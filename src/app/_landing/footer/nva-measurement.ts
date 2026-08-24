type CanvasWithLetterSpacing = CanvasRenderingContext2D & {
  letterSpacing?: string;
};

function applyNvaCanvasFont(
  context: CanvasRenderingContext2D,
  computed: CSSStyleDeclaration,
  letterSpacing: number,
) {
  context.font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
  context.fontKerning = "normal";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  const typed = context as CanvasWithLetterSpacing;
  if (typeof typed.letterSpacing === "string") {
    typed.letterSpacing = `${letterSpacing}px`;
  }
}

export function measureNvaInk(computed: CSSStyleDeclaration, fontSize: number) {
  const text = "NVA";
  const letterSpacing = Number.parseFloat(computed.letterSpacing) || 0;
  const sampleScale = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) return null;

  applyNvaCanvasFont(context, computed, letterSpacing);
  const metrics = context.measureText(text);
  const hasCanvasTracking =
    typeof (context as CanvasWithLetterSpacing).letterSpacing === "string";
  const padding = Math.ceil(fontSize * 0.5);
  const ascent = Math.ceil(metrics.actualBoundingBoxAscent || fontSize * 0.9);
  const descent = Math.ceil(
    metrics.actualBoundingBoxDescent || fontSize * 0.25,
  );
  const trackedWidth =
    metrics.width +
    (hasCanvasTracking ? 0 : Math.abs(letterSpacing) * text.length);

  canvas.width = Math.ceil((trackedWidth + padding * 2) * sampleScale);
  canvas.height = Math.ceil((ascent + descent + padding * 2) * sampleScale);
  context.setTransform(sampleScale, 0, 0, sampleScale, 0, 0);
  applyNvaCanvasFont(context, computed, letterSpacing);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000";

  if (hasCanvasTracking) {
    context.fillText(text, padding, padding + ascent);
  } else {
    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      if (!character) continue;

      const prefix = text.slice(0, index + 1);
      const characterWidth = context.measureText(character).width;
      const characterX =
        padding +
        context.measureText(prefix).width -
        characterWidth +
        letterSpacing * index;

      context.fillText(character, characterX, padding + ascent);
    }
  }

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const alphaThreshold = 128;
  let firstInkPixel = canvas.width;
  let lastInkPixel = -1;

  for (let index = 3; index < pixels.length; index += 4) {
    const alpha = pixels[index];
    if (alpha === undefined || alpha < alphaThreshold) continue;
    const pixelX = ((index - 3) / 4) % canvas.width;
    firstInkPixel = Math.min(firstInkPixel, pixelX);
    lastInkPixel = Math.max(lastInkPixel, pixelX);
  }

  if (lastInkPixel < firstInkPixel) return null;

  const pixelInkLeft = firstInkPixel / sampleScale - padding;
  const pixelInkRight = (lastInkPixel + 1) / sampleScale - padding;
  const metricsInkLeft = Number.isFinite(metrics.actualBoundingBoxLeft)
    ? -metrics.actualBoundingBoxLeft
    : pixelInkLeft;
  const metricsInkRight = Number.isFinite(metrics.actualBoundingBoxRight)
    ? metrics.actualBoundingBoxRight
    : pixelInkRight;
  const inkLeft = Math.max(pixelInkLeft, metricsInkLeft);
  const inkRight = Math.max(pixelInkRight, metricsInkRight);
  const inkWidth = inkRight - inkLeft;

  if (!Number.isFinite(inkWidth) || inkWidth <= 0) return null;

  return { inkLeft, inkWidth };
}

export function mobileNvaViewportWidth(
  innerWidth: number,
  visualWidth?: number,
) {
  const raw = visualWidth && visualWidth > 0 ? visualWidth : innerWidth;
  if (!(raw > 0)) return 0;
  return Math.round(raw);
}

export function fitSvgNvaInk(
  inkLeft: number,
  inkRight: number,
  viewBoxWidth: number,
) {
  const inkWidth = inkRight - inkLeft;
  if (!(inkWidth > 0) || !(viewBoxWidth > 0)) return null;

  return {
    scale: viewBoxWidth / inkWidth,
    translate: -inkLeft,
  };
}

export function fitMobileNvaInk(
  ink: { inkLeft: number; inkWidth: number },
  targetWidth: number,
) {
  if (!(ink.inkWidth > 0) || !(targetWidth > 0)) return null;

  return {
    scale: targetWidth / ink.inkWidth,
    shift: -ink.inkLeft,
    width: targetWidth,
  };
}

export function anchorRepresentedBySvg(
  text: SVGTextElement,
  label: HTMLElement,
) {
  const svg = text.ownerSVGElement;
  const panel = svg?.parentElement?.parentElement;
  if (!svg || !panel || text.getNumberOfChars() < 1) return;

  let n: SVGRect;
  try {
    n = text.getExtentOfChar(0);
  } catch {
    return;
  }

  const viewBox = svg.viewBox.baseVal;
  const panelRect = panel.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();
  if (n.width < 0.5 || viewBox.width < 1 || svgRect.width < 2) return;

  const scaleX = svgRect.width / viewBox.width;
  const scaleY = svgRect.height / viewBox.height;
  const nLeft = svgRect.left + n.x * scaleX;
  const nTop = svgRect.top + n.y * scaleY;
  const nWidth = Math.max(1, n.width * scaleX);
  const nHeight = Math.max(1, n.height * scaleY);
  const yAbs = panelRect.top + panelRect.height * 0.28;
  const alongGlyph = (yAbs - nTop) / nHeight;
  const xAbs = nLeft + nWidth * alongGlyph;

  label.style.setProperty("--n-x", `${xAbs - panelRect.left}px`);
  label.style.setProperty("--n-y", `${yAbs - panelRect.top}px`);
  label.style.setProperty(
    "--n-angle",
    `${(Math.atan2(nHeight, nWidth) * 180) / Math.PI}deg`,
  );
  label.style.fontSize = `${Math.min(16, Math.max(11, panelRect.height * 0.048))}px`;
}

export function anchorRepresentedBy(word: HTMLElement, label: HTMLElement) {
  const panel = word.parentElement?.parentElement;
  const textNode = word.firstChild;

  if (!panel || textNode?.nodeType !== Node.TEXT_NODE) return;

  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, 1);
  const nRect = range.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  range.detach();

  if (nRect.width < 2 || nRect.height < 2 || panelRect.height < 2) return;

  const computed = window.getComputedStyle(word);
  const letterSpacing = Number.parseFloat(computed.letterSpacing);
  const scaleX = new DOMMatrix(computed.transform).a || 1;
  const visualTracking = Number.isFinite(letterSpacing)
    ? Math.abs(letterSpacing * scaleX)
    : 0;
  const inkWidth = Math.max(1, nRect.width - visualTracking);
  const yAbs = panelRect.top + panelRect.height * 0.28;
  const alongGlyph = (yAbs - nRect.top) / nRect.height;
  const xAbs = nRect.left + inkWidth * alongGlyph;

  label.style.setProperty("--n-x", `${xAbs - panelRect.left}px`);
  label.style.setProperty("--n-y", `${yAbs - panelRect.top}px`);
  label.style.setProperty(
    "--n-angle",
    `${(Math.atan2(nRect.height, inkWidth) * 180) / Math.PI}deg`,
  );
  label.style.fontSize = `${Math.min(16, Math.max(11, panelRect.height * 0.048))}px`;
}

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

export const NVA_REPRESENTED_ANGLE_DEG = 55.83;
export const NVA_REPRESENTED_PIN = {
  small: { height: 297, xFrac: 0.1435, yFrac: 0.2182 },
  large: { height: 766.25, xFrac: 0.1156, yFrac: 0.1224 },
} as const;
export const NVA_REPRESENTED_X_PCT = 11.56;
export const NVA_REPRESENTED_Y_PCT = 12.24;
export const NVA_REPRESENTED_N_X = 0.13087;
export const NVA_REPRESENTED_N_Y = 0.27528;

type NvaBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function representedByMarkFractions(markHeight: number) {
  const { small, large } = NVA_REPRESENTED_PIN;
  const span = large.height - small.height;
  const t =
    span > 0
      ? Math.min(1, Math.max(0, (markHeight - small.height) / span))
      : 1;

  return {
    xFrac: small.xFrac + (large.xFrac - small.xFrac) * t,
    yFrac: small.yFrac + (large.yFrac - small.yFrac) * t,
  };
}

export function representedByWordmarkPin(
  mark: NvaBox,
  panel: NvaBox,
  xFrac?: number,
  yFrac?: number,
) {
  if (!(panel.width > 0) || !(panel.height > 0)) return null;

  const fractions = representedByMarkFractions(mark.height);
  const pinX = xFrac ?? fractions.xFrac;
  const pinY = yFrac ?? fractions.yFrac;
  const x = mark.left - panel.left + mark.width * pinX;
  const y = mark.top - panel.top + mark.height * pinY;
  return {
    xPct: (x / panel.width) * 100,
    yPct: (y / panel.height) * 100,
  };
}

function visibleNRect(
  n: { left: number; top: number; width: number; height: number },
  box: { left: number; top: number; width: number; height: number },
) {
  const left = Math.max(n.left, box.left);
  const top = Math.max(n.top, box.top);
  const right = Math.min(n.left + n.width, box.left + box.width);
  const bottom = Math.min(n.top + n.height, box.top + box.height);
  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  };
}

export function representedByScaleVars(
  n: { left: number; top: number; width: number; height: number },
  box: { left: number; top: number; width: number; height: number },
) {
  const vis = visibleNRect(n, box);
  const width = vis.width > 1 ? vis.width : box.width;
  const height = vis.height > 1 ? vis.height : box.height;
  const left = vis.width > 1 ? vis.left : box.left;
  const top = vis.height > 1 ? vis.top : box.top;
  const nLeft = box.width > 0 ? ((left - box.left) / box.width) * 100 : 0;
  const nTop = box.height > 0 ? ((top - box.top) / box.height) * 100 : 0;
  const nWidth = box.width > 0 ? (width / box.width) * 100 : 34;
  const nHeight = box.height > 0 ? (height / box.height) * 100 : 100;

  return {
    nLeft,
    nTop,
    nWidth,
    nHeight,
    xPct: nLeft + nWidth * NVA_REPRESENTED_N_X,
    yPct: nTop + nHeight * NVA_REPRESENTED_N_Y,
    angleDeg: NVA_REPRESENTED_ANGLE_DEG,
  };
}

export function representedByAnchor(
  n: { left: number; top: number; width: number; height: number },
  box: { left: number; top: number; width: number; height: number },
) {
  const scale = representedByScaleVars(n, box);
  return {
    ...scale,
    x: (scale.xPct / 100) * box.width,
    y: (scale.yPct / 100) * box.height,
  };
}

function applyRepresentedByScale(
  host: HTMLElement,
  scale: ReturnType<typeof representedByScaleVars>,
) {
  host.style.setProperty("--n-left", `${scale.nLeft}%`);
  host.style.setProperty("--n-top", `${scale.nTop}%`);
  host.style.setProperty("--n-width", `${scale.nWidth}%`);
  host.style.setProperty("--n-height", `${scale.nHeight}%`);
  host.style.setProperty("--n-angle", `${scale.angleDeg}deg`);
}

function scaleVarsForContainer(
  scale: ReturnType<typeof representedByScaleVars>,
  box: { left: number; top: number; width: number; height: number },
  container: { left: number; top: number; width: number; height: number },
) {
  if (!(container.width > 0) || !(container.height > 0)) return scale;

  const leftPx = box.left - container.left + (scale.nLeft / 100) * box.width;
  const topPx = box.top - container.top + (scale.nTop / 100) * box.height;
  const widthPx = (scale.nWidth / 100) * box.width;
  const heightPx = (scale.nHeight / 100) * box.height;

  return {
    nLeft: (leftPx / container.width) * 100,
    nTop: (topPx / container.height) * 100,
    nWidth: (widthPx / container.width) * 100,
    nHeight: (heightPx / container.height) * 100,
    xPct: ((leftPx + widthPx * NVA_REPRESENTED_N_X) / container.width) * 100,
    yPct: ((topPx + heightPx * NVA_REPRESENTED_N_Y) / container.height) * 100,
    angleDeg: scale.angleDeg,
  };
}

export function anchorRepresentedBySvg(
  text: SVGTextElement,
  label: HTMLElement,
) {
  const svg = text.ownerSVGElement;
  const wordmark = svg?.parentElement;
  const panel = wordmark?.parentElement;
  if (!svg || !wordmark || !panel || text.getNumberOfChars() < 1) return;

  let n: SVGRect;
  try {
    n = text.getExtentOfChar(0);
  } catch {
    return;
  }

  const viewBox = svg.viewBox.baseVal;
  const box = wordmark.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();
  if (n.width < 0.5 || viewBox.width < 1 || svgRect.width < 2) return;

  const scaleX = svgRect.width / viewBox.width;
  const scaleY = svgRect.height / viewBox.height;
  applyRepresentedByScale(
    panel,
    scaleVarsForContainer(
      representedByScaleVars(
        {
          left: svgRect.left + n.x * scaleX,
          top: svgRect.top + n.y * scaleY,
          width: Math.max(1, n.width * scaleX),
          height: Math.max(1, n.height * scaleY),
        },
        box,
      ),
      box,
      panel.getBoundingClientRect(),
    ),
  );
  clearRepresentedByOverrides(wordmark, label);
}

export function anchorRepresentedBy(word: HTMLElement, label: HTMLElement) {
  const wordmark = word.parentElement;
  const panel = wordmark?.parentElement;
  const textNode = word.firstChild;

  if (!wordmark || !panel || textNode?.nodeType !== Node.TEXT_NODE) return;

  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, 1);
  const nRect = range.getBoundingClientRect();
  const box = wordmark.getBoundingClientRect();
  range.detach();

  if (nRect.width < 2 || nRect.height < 2 || box.height < 2) return;

  const computed = window.getComputedStyle(word);
  const letterSpacing = Number.parseFloat(computed.letterSpacing);
  const scaleX = new DOMMatrix(computed.transform).a || 1;
  const visualTracking = Number.isFinite(letterSpacing)
    ? Math.abs(letterSpacing * scaleX)
    : 0;
  const inkWidth = Math.max(1, nRect.width - visualTracking);

  applyRepresentedByScale(
    panel,
    scaleVarsForContainer(
      representedByScaleVars(
        {
          left: nRect.left,
          top: nRect.top,
          width: inkWidth,
          height: nRect.height,
        },
        box,
      ),
      box,
      panel.getBoundingClientRect(),
    ),
  );
  clearRepresentedByOverrides(wordmark, label);
}

function clearRepresentedByOverrides(wordmark: HTMLElement, label: HTMLElement) {
  wordmark.style.removeProperty("--n-left");
  wordmark.style.removeProperty("--n-top");
  wordmark.style.removeProperty("--n-width");
  wordmark.style.removeProperty("--n-height");
  wordmark.style.removeProperty("--n-angle");
  label.style.removeProperty("--n-x");
  label.style.removeProperty("--n-y");
  label.style.removeProperty("font-size");
}

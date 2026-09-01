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

export const SHOWREEL_RADIUS_REM = 2.6;
export const INTRO_REVEAL_DELAY_MS = 1_000;
export const INTRO_HEADER_SLIDE_DURATION_S = 2;
export const INTRO_CARD_SLIDE_DURATION_S = 6;
export const INTRO_SLIDE_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];
export const INTRO_CARD_SLIDE_EASE: [number, number, number, number] = [
  0.18, 0.9, 0.08, 1,
];
export const SCROLL_PANEL_HOLD = 0.04;
export const SCROLL_PANEL_EXPANDED = 0.28;
export const SCROLL_HERO_FADE_END = 0.2;
export const SCROLL_SURFACE_INSET_MID = 0.16;
const SCROLL_WORK_REVEAL = 0.45;
const SCROLL_WORK_SHADE_SET = 0.51;
export const SCROLL_WORK_TEXT_HOLD_END = 0.63;
const SCROLL_WORK_LINE_STAGGER = 0.015;
const SCROLL_WORK_LINE_TRAVEL = 0.048;
const SCROLL_MARQUEE_FULL = 0.83;
const SCROLL_MARQUEE_HOLD_END = 0.88;
export const SCROLL_CONTACT_SET = 0.96;
const WORK_SHADE_COPY = 0.34;
const WORK_SHADE_EDGE = 0.3;
const WORK_SHADE_COPY_COMPACT = 0.58;
const WORK_SHADE_EDGE_COMPACT = 0.28;

function getWorkShadeCarrierWidth(viewportWidth: number, compact: boolean) {
  const copy =
    viewportWidth * (compact ? WORK_SHADE_COPY_COMPACT : WORK_SHADE_COPY);
  const edge =
    viewportWidth * (compact ? WORK_SHADE_EDGE_COMPACT : WORK_SHADE_EDGE);
  return copy + edge;
}

export function getWorkShadeOffset(
  progress: number,
  viewportWidth: number,
  compact: boolean,
) {
  const carrier = getWorkShadeCarrierWidth(viewportWidth, compact);
  const startX = -carrier;
  const parkedX = 0;
  const exitX = viewportWidth;

  if (progress <= SCROLL_WORK_REVEAL) return startX;

  if (progress < SCROLL_WORK_SHADE_SET) {
    const t =
      (progress - SCROLL_WORK_REVEAL) /
      (SCROLL_WORK_SHADE_SET - SCROLL_WORK_REVEAL);
    return startX + t * (parkedX - startX);
  }

  if (progress <= SCROLL_WORK_TEXT_HOLD_END) return parkedX;

  if (progress >= SCROLL_MARQUEE_FULL) return exitX;

  const t =
    (progress - SCROLL_WORK_TEXT_HOLD_END) /
    (SCROLL_MARQUEE_FULL - SCROLL_WORK_TEXT_HOLD_END);

  return parkedX + t * (exitX - parkedX);
}

export function getClientsOverlayOffset(
  progress: number,
  viewportWidth: number,
) {
  if (progress <= SCROLL_WORK_TEXT_HOLD_END) return -viewportWidth;
  if (progress >= SCROLL_MARQUEE_FULL) return 0;

  const t =
    (progress - SCROLL_WORK_TEXT_HOLD_END) /
    (SCROLL_MARQUEE_FULL - SCROLL_WORK_TEXT_HOLD_END);

  return -viewportWidth * (1 - t);
}

export function getWorkLineOffset(
  progress: number,
  viewportWidth: number,
  index: number,
) {
  const enterStart = SCROLL_WORK_REVEAL + index * SCROLL_WORK_LINE_STAGGER;
  const enterEnd = enterStart + SCROLL_WORK_LINE_TRAVEL;
  const offLeft = -viewportWidth * 0.55;

  if (progress <= enterStart) return offLeft;

  if (progress < enterEnd) {
    const t = (progress - enterStart) / (enterEnd - enterStart);
    const eased = 1 - (1 - t) ** 3;
    return offLeft + eased * -offLeft;
  }

  if (progress <= SCROLL_WORK_TEXT_HOLD_END) return 0;

  if (progress >= SCROLL_MARQUEE_FULL) return viewportWidth;

  const t =
    (progress - SCROLL_WORK_TEXT_HOLD_END) /
    (SCROLL_MARQUEE_FULL - SCROLL_WORK_TEXT_HOLD_END);

  return t * viewportWidth;
}

export function getContactWipeOffset(progress: number, viewportWidth: number) {
  if (progress <= SCROLL_MARQUEE_HOLD_END) return -viewportWidth;
  if (progress >= SCROLL_CONTACT_SET) return 0;

  const t =
    (progress - SCROLL_MARQUEE_HOLD_END) /
    (SCROLL_CONTACT_SET - SCROLL_MARQUEE_HOLD_END);

  return -viewportWidth * (1 - t);
}

export function getIntroPanelRest(compact: boolean) {
  return compact
    ? {
        x: "-5vw",
        y: "43svh",
        scaleX: 0.9,
        scaleY: 0.51,
      }
    : {
        x: "-3vw",
        y: "9svh",
        scaleX: 0.31,
        scaleY: 0.82,
      };
}

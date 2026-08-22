export const SHOWREEL_RADIUS_REM = 2.6;
export const INTRO_REVEAL_DELAY_MS = 2_000;
export const INTRO_HEADER_SLIDE_DURATION_S = 4;
export const INTRO_CARD_SLIDE_DURATION_S = 5;
export const INTRO_SLIDE_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];
export const INTRO_CARD_SLIDE_EASE: [number, number, number, number] = [
  0.18, 0.9, 0.08, 1,
];

export const SCROLL_PANEL_HOLD = 0.025;
export const SCROLL_PANEL_EXPANDED = 0.18;
export const SCROLL_HERO_FADE_END = 0.125;
export const SCROLL_SURFACE_INSET_MID = 0.1;
export const SCROLL_WORK_REVEAL = 0.27;
export const SCROLL_WORK_RESET = 0.24;
export const SCROLL_WORK_EXIT_START = 0.4;
export const SCROLL_MARQUEE_FULL = 0.51;
export const SCROLL_CONTACT_START = 0.6;
export const SCROLL_CONTACT_SET = 0.82;

export const WORK_SHADE_ENTRY_DURATION_S = 1.05;
export const WORK_LINE_ENTRY_LEAD_S = 0.22;
export const WORK_LINE_ENTRY_DURATION_S = 1.05;
export const WORK_LINE_STAGGER_S = 0.16;

const MARQUEE_HANDOFF_RANGE = SCROLL_MARQUEE_FULL - SCROLL_WORK_EXIT_START;
const SCROLL_MARQUEE_SHADE_FADE_START =
  SCROLL_WORK_EXIT_START + MARQUEE_HANDOFF_RANGE * 0.75;
const SCROLL_CLIENTS_CONTACT_FADE_START =
  SCROLL_WORK_EXIT_START + MARQUEE_HANDOFF_RANGE * 0.8;
const CLIENTS_CONTACT_FADE_REST_SCALE = 0.35;

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function getMarqueeHandoffProgress(progress: number) {
  if (progress <= SCROLL_WORK_EXIT_START) return 0;
  if (progress >= SCROLL_MARQUEE_FULL) return 1;

  const t =
    (progress - SCROLL_WORK_EXIT_START) /
    (SCROLL_MARQUEE_FULL - SCROLL_WORK_EXIT_START);

  return easeInOutSine(t);
}

export function getWorkShadeOpacity(progress: number) {
  if (progress <= SCROLL_MARQUEE_SHADE_FADE_START) return 1;
  if (progress >= SCROLL_MARQUEE_FULL) return 0;

  const t =
    (progress - SCROLL_MARQUEE_SHADE_FADE_START) /
    (SCROLL_MARQUEE_FULL - SCROLL_MARQUEE_SHADE_FADE_START);

  return 1 - easeInOutSine(t);
}

export function getClientsContactFadeOpacity(progress: number) {
  if (progress <= SCROLL_CLIENTS_CONTACT_FADE_START) return 0;
  if (progress >= SCROLL_MARQUEE_FULL) return 1;

  const t =
    (progress - SCROLL_CLIENTS_CONTACT_FADE_START) /
    (SCROLL_MARQUEE_FULL - SCROLL_CLIENTS_CONTACT_FADE_START);

  return easeInOutSine(t);
}

export function getClientsContactFadeScaleX(progress: number) {
  if (progress <= SCROLL_CONTACT_START) {
    return CLIENTS_CONTACT_FADE_REST_SCALE;
  }
  if (progress >= SCROLL_CONTACT_SET) return 1;

  const t =
    (progress - SCROLL_CONTACT_START) /
    (SCROLL_CONTACT_SET - SCROLL_CONTACT_START);

  return (
    CLIENTS_CONTACT_FADE_REST_SCALE +
    easeInOutSine(t) * (1 - CLIENTS_CONTACT_FADE_REST_SCALE)
  );
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

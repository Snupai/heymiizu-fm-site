import { WORK_LINES } from "./content";

export const SHOWREEL_RADIUS_REM = 2.6;
export const INTRO_REVEAL_DELAY_MS = 2_500;
export const INTRO_MOBILE_REVEAL_DELAY_MS = 900;
export const INTRO_SCROLL_UNLOCK_LEAD_MS = 7_000;
export const INTRO_HEADER_SLIDE_DURATION_S = 4;
export const INTRO_MOBILE_HEADER_SLIDE_DURATION_S = 2.4;
export const INTRO_CARD_SLIDE_DURATION_S = 3;
export const INTRO_MOBILE_CARD_SLIDE_DURATION_S = 2.2;
export const INTRO_CARD_UNLOCK_LEAD_MS = 1_000;
export const INTRO_SLIDE_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];
export const INTRO_CARD_SLIDE_EASE: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];
export const INTRO_CARD_SLIDE_TRANSITION = {
  duration: INTRO_CARD_SLIDE_DURATION_S,
  ease: INTRO_CARD_SLIDE_EASE,
} as const;
export const INTRO_MOBILE_CARD_SLIDE_TRANSITION = {
  duration: INTRO_MOBILE_CARD_SLIDE_DURATION_S,
  ease: INTRO_CARD_SLIDE_EASE,
} as const;

export function getIntroRevealDelayMs(compact: boolean) {
  return compact ? INTRO_MOBILE_REVEAL_DELAY_MS : INTRO_REVEAL_DELAY_MS;
}

export function getIntroHeaderSlideDurationS(compact: boolean) {
  return compact
    ? INTRO_MOBILE_HEADER_SLIDE_DURATION_S
    : INTRO_HEADER_SLIDE_DURATION_S;
}

export function getIntroCardSlideDurationS(compact: boolean) {
  return compact
    ? INTRO_MOBILE_CARD_SLIDE_DURATION_S
    : INTRO_CARD_SLIDE_DURATION_S;
}

export function getIntroCardSlideTransition(compact: boolean) {
  return compact
    ? INTRO_MOBILE_CARD_SLIDE_TRANSITION
    : INTRO_CARD_SLIDE_TRANSITION;
}

export const SCROLL_PANEL_HOLD = 0.02;
export const SCROLL_PANEL_EXPANDED = 0.15;
export const SCROLL_HERO_FADE_END = 0.1;
export const SCROLL_SURFACE_INSET_MID = 0.08;
export const SCROLL_WORK_REVEAL = 0.28;
export const SCROLL_WORK_RESET = 0.19;
export const SCROLL_WORK_PAUSE = 0.28;
export const SCROLL_WORK_UP_PAUSE = 0.24;
export const SCROLL_WORK_EXIT_START = 0.3;
export const SCROLL_MARQUEE_FULL = 0.58;
export const SCROLL_CONTACT_START = 0.66;
export const SCROLL_CONTACT_SET = 0.83;

export const SCROLL_SHOWREEL_PAUSE_MS = 600;
export const SCROLL_WORK_PAUSE_MS = 1_600;
export const SCROLL_CLIENTS_PAUSE_MS = 600;
export const SCROLL_CONTACT_PAUSE_MS = 600;
export const SCROLL_PAUSE_RELEASE = 0.016;

export const WORK_SHADE_ENTRY_DURATION_S = 1.05;
export const WORK_LINE_ENTRY_LEAD_S = 0.22;
export const WORK_LINE_ENTRY_DURATION_S = 1.05;
export const WORK_LINE_STAGGER_S = 0.16;
export const WORK_LINE_ENTRY_DISTANCE_VW = 55;
export const WORK_SEQUENCE_DURATION_S =
  WORK_LINE_ENTRY_LEAD_S +
  (WORK_LINES.length - 1) * WORK_LINE_STAGGER_S +
  WORK_LINE_ENTRY_DURATION_S;
export const SCROLL_WORK_UP_PAUSE_MS = Math.max(
  SCROLL_WORK_PAUSE_MS,
  Math.round(WORK_SEQUENCE_DURATION_S * 1_000),
);

export const SCROLL_PAUSE_STOPS = [
  { at: SCROLL_PANEL_EXPANDED, dir: "down", holdMs: SCROLL_SHOWREEL_PAUSE_MS },
  { at: SCROLL_WORK_PAUSE, dir: "down", holdMs: SCROLL_WORK_PAUSE_MS },
  { at: SCROLL_WORK_UP_PAUSE, dir: "up", holdMs: SCROLL_WORK_UP_PAUSE_MS },
  { at: SCROLL_MARQUEE_FULL, dir: "down", holdMs: SCROLL_CLIENTS_PAUSE_MS },
  { at: SCROLL_CONTACT_SET, dir: "down", holdMs: SCROLL_CONTACT_PAUSE_MS },
] as const;

export type ScrollPauseStop = (typeof SCROLL_PAUSE_STOPS)[number];

function clamp01(value: number) {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function sampleCubic(t: number, a: number, b: number) {
  const inverse = 1 - t;
  return 3 * inverse * inverse * t * a + 3 * inverse * t * t * b + t * t * t;
}

function workSlideEase(progress: number) {
  const targetX = clamp01(progress);
  const [x1, y1, x2, y2] = INTRO_SLIDE_EASE;
  let guess = targetX;

  for (let i = 0; i < 5; i += 1) {
    const currentX = sampleCubic(guess, x1, x2);
    const derivative =
      3 * (1 - guess) * (1 - guess) * x1 +
      6 * (1 - guess) * guess * (x2 - x1) +
      3 * guess * guess * (1 - x2);
    if (Math.abs(derivative) < 1e-6) break;
    guess -= (currentX - targetX) / derivative;
  }

  return sampleCubic(guess, y1, y2);
}

export function getWorkShadeEntryX(time: number) {
  const local = clamp01(time / WORK_SHADE_ENTRY_DURATION_S);
  return `${(workSlideEase(local) - 1) * 100}%`;
}

export function getWorkLineEntryX(time: number, index: number) {
  const start = WORK_LINE_ENTRY_LEAD_S + index * WORK_LINE_STAGGER_S;
  const local = clamp01((time - start) / WORK_LINE_ENTRY_DURATION_S);
  return `${(workSlideEase(local) - 1) * WORK_LINE_ENTRY_DISTANCE_VW}vw`;
}

const MARQUEE_HANDOFF_RANGE = SCROLL_MARQUEE_FULL - SCROLL_WORK_EXIT_START;
const SCROLL_CLIENTS_CONTACT_FADE_START =
  SCROLL_WORK_EXIT_START + MARQUEE_HANDOFF_RANGE * 0.8;
const CLIENTS_CONTACT_FADE_REST_SCALE = 0.35;

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function easeInOutMarquee(t: number) {
  const sine = easeInOutSine(t);
  return t * 0.55 + sine * 0.45;
}

export function getMarqueeHandoffProgress(progress: number) {
  if (progress <= SCROLL_WORK_EXIT_START) return 0;
  if (progress >= SCROLL_MARQUEE_FULL) return 1;

  const t =
    (progress - SCROLL_WORK_EXIT_START) /
    (SCROLL_MARQUEE_FULL - SCROLL_WORK_EXIT_START);

  return easeInOutMarquee(t);
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

export type IntroLayout = "compact" | "medium" | "desktop";

const INTRO_PANEL_REST = {
  compact: {
    x: "-5vw",
    y: "43svh",
    scaleX: 0.9,
    scaleY: 0.51,
  },
  medium: {
    x: "-3vw",
    y: "9svh",
    scaleX: 0.5,
    scaleY: 0.82,
  },
  desktop: {
    x: "-3vw",
    y: "9svh",
    scaleX: 0.31,
    scaleY: 0.82,
  },
} as const;

export function getIntroPanelRest(layout: IntroLayout) {
  return INTRO_PANEL_REST[layout];
}

export function getIntroLayout(width: number): IntroLayout {
  if (width <= 760) return "compact";
  if (width <= 1400) return "medium";
  return "desktop";
}

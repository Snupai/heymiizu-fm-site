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

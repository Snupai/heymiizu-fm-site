import { describe, expect, test } from "bun:test";

import {
  COMPACT_LAYOUT_MAX_WIDTH,
  getIntroLayout,
  getIntroRevealDelayMs,
  hasIntroPlaybackReachedReveal,
} from "./scroll-timeline";

describe("intro layout breakpoints", () => {
  test("compact covers phones and small-width devices", () => {
    expect(getIntroLayout(320)).toBe("compact");
    expect(getIntroLayout(COMPACT_LAYOUT_MAX_WIDTH)).toBe("compact");
  });

  test("medium and desktop start just above the compact cap", () => {
    expect(getIntroLayout(COMPACT_LAYOUT_MAX_WIDTH + 1)).toBe("medium");
    expect(getIntroLayout(1400)).toBe("medium");
    expect(getIntroLayout(1401)).toBe("desktop");
  });
});

describe("intro preload reveal", () => {
  test("desktop waits a few seconds of actual playback before the card moves in", () => {
    const delayMs = getIntroRevealDelayMs(false);
    expect(delayMs).toBeGreaterThanOrEqual(1_500);
    expect(delayMs).toBeLessThanOrEqual(2_500);
    expect(hasIntroPlaybackReachedReveal(0, delayMs)).toBe(false);
    expect(hasIntroPlaybackReachedReveal(delayMs / 1000 - 0.05, delayMs)).toBe(
      false,
    );
    expect(hasIntroPlaybackReachedReveal(delayMs / 1000, delayMs)).toBe(true);
  });
});

import { describe, expect, test } from "bun:test";

import {
  crossedPauseStop,
  pauseHoldTick,
  pauseKey,
  shouldSkipPauseStops,
} from "./scroll-pauses";
import { SCROLL_PANEL_EXPANDED, SCROLL_PAUSE_STOPS } from "./scroll-timeline";

describe("mobile pause stops", () => {
  test("a flick across a stop is detected", () => {
    const stop = crossedPauseStop(0.1, 0.2, new Set());
    expect(stop?.at).toBe(SCROLL_PANEL_EXPANDED);
    expect(stop?.dir).toBe("down");
  });

  test("holding a stop pins instead of releasing when native momentum keeps moving", () => {
    expect(
      pauseHoldTick({
        now: 100,
        pauseUntil: 800,
        progress: 0.22,
        heldProgress: SCROLL_PANEL_EXPANDED,
      }),
    ).toBe("pin");
  });

  test("overlay scrollbar native scrolling still skips pauses", () => {
    expect(
      shouldSkipPauseStops({
        draggingScrollbar: false,
        holding: false,
        isScrolling: "native",
        skipPausesUserData: false,
      }),
    ).toBe(true);
  });

  test("an active hold is not aborted by leftover native scroll events", () => {
    expect(
      shouldSkipPauseStops({
        draggingScrollbar: false,
        holding: true,
        isScrolling: "native",
        skipPausesUserData: false,
      }),
    ).toBe(false);
  });

  test("smooth Lenis scrolling is allowed to pause", () => {
    expect(
      shouldSkipPauseStops({
        draggingScrollbar: false,
        holding: false,
        isScrolling: "smooth",
        skipPausesUserData: false,
      }),
    ).toBe(false);
  });

  test("consumed stops are not hit twice until they are released", () => {
    const first = SCROLL_PAUSE_STOPS[0];
    if (!first) throw new Error("expected pause stops");
    const consumed = new Set([pauseKey(first)]);
    expect(crossedPauseStop(0.1, 0.2, consumed)).toBeNull();
  });
});

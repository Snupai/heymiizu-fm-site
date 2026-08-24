import { describe, expect, test } from "bun:test";

import {
  COMPACT_LAYOUT_MAX_WIDTH,
  COMPACT_LAYOUT_QUERY,
  getIntroLayout,
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

  test("the compact media query matches the numeric cap", () => {
    expect(COMPACT_LAYOUT_QUERY).toBe(
      `(max-width: ${COMPACT_LAYOUT_MAX_WIDTH}px)`,
    );
  });
});

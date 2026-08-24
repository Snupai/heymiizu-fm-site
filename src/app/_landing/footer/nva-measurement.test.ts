import { describe, expect, test } from "bun:test";

import {
  fitMobileNvaInk,
  fitSvgNvaInk,
  mobileNvaViewportWidth,
} from "./nva-measurement";

describe("mobile NVA full-width fit", () => {
  test("scales ink to the viewport and shifts the left bearing to 0", () => {
    expect(fitMobileNvaInk({ inkLeft: 12.4, inkWidth: 360 }, 390)).toEqual({
      scale: 390 / 360,
      shift: -12.4,
      width: 390,
    });
  });

  test("rejects empty ink or target widths", () => {
    expect(fitMobileNvaInk({ inkLeft: 0, inkWidth: 0 }, 390)).toBeNull();
    expect(fitMobileNvaInk({ inkLeft: 0, inkWidth: 200 }, 0)).toBeNull();
  });

  test("maps SVG glyph ink onto the viewBox", () => {
    expect(fitSvgNvaInk(18, 362, 390)).toEqual({
      scale: 390 / (362 - 18),
      translate: -18,
    });
    expect(fitSvgNvaInk(0, 0, 390)).toBeNull();
  });

  test("prefers the visual viewport when it is available", () => {
    expect(mobileNvaViewportWidth(390.4, 389.6)).toBe(390);
    expect(mobileNvaViewportWidth(412)).toBe(412);
    expect(mobileNvaViewportWidth(0, 0)).toBe(0);
  });
});

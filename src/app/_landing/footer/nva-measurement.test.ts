import { describe, expect, test } from "bun:test";

import {
  fitMobileNvaInk,
  fitSvgNvaInk,
  mobileNvaViewportWidth,
  NVA_REPRESENTED_ANGLE_DEG,
  NVA_REPRESENTED_N_X,
  NVA_REPRESENTED_N_Y,
  NVA_REPRESENTED_PIN,
  NVA_REPRESENTED_X_PCT,
  NVA_REPRESENTED_Y_PCT,
  representedByAnchor,
  representedByMarkFractions,
  representedByWordmarkPin,
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

describe("represented-by N diagonal anchor", () => {
  test("keeps the pinned spot on the N as the glyph scales", () => {
    const large = representedByAnchor(
      { left: 0, top: 0, width: 2000, height: 2000 },
      { left: 0, top: 0, width: 2000, height: 2000 },
    );
    const small = representedByAnchor(
      { left: 0, top: 0, width: 1000, height: 1000 },
      { left: 0, top: 0, width: 1000, height: 1000 },
    );

    expect(large.x).toBeCloseTo(2000 * NVA_REPRESENTED_N_X, 5);
    expect(large.y).toBeCloseTo(2000 * NVA_REPRESENTED_N_Y, 5);
    expect(small.nWidth).toBeCloseTo(large.nWidth, 5);
    expect(small.nHeight).toBeCloseTo(large.nHeight, 5);
    expect(small.xPct).toBeCloseTo(large.xPct, 5);
    expect(small.yPct).toBeCloseTo(large.yPct, 5);
    expect(small.angleDeg).toBe(NVA_REPRESENTED_ANGLE_DEG);
  });

  test("pins in the visible N when the glyph is cropped", () => {
    const box = { left: 0, top: 0, width: 760, height: 250 };
    const point = representedByAnchor(
      { left: -20, top: -150, width: 800, height: 500 },
      box,
    );

    expect(point.xPct).toBeGreaterThan(0);
    expect(point.xPct).toBeLessThan(100);
    expect(point.yPct).toBeGreaterThan(0);
    expect(point.yPct).toBeLessThan(100);
    expect(point.xPct).toBeCloseTo(NVA_REPRESENTED_N_X * 100, 5);
    expect(point.yPct).toBeCloseTo(NVA_REPRESENTED_N_Y * 100, 5);
  });

  test("keeps the same wordmark percentages when the N and wordmark scale together", () => {
    const large = representedByAnchor(
      { left: -20, top: -150, width: 800, height: 500 },
      { left: 0, top: 0, width: 760, height: 250 },
    );
    const small = representedByAnchor(
      { left: -10, top: -75, width: 400, height: 250 },
      { left: 0, top: 0, width: 380, height: 125 },
    );

    expect(small.nLeft).toBeCloseTo(large.nLeft, 5);
    expect(small.nTop).toBeCloseTo(large.nTop, 5);
    expect(small.nWidth).toBeCloseTo(large.nWidth, 5);
    expect(small.nHeight).toBeCloseTo(large.nHeight, 5);
    expect(small.xPct).toBeCloseTo(large.xPct, 5);
    expect(small.yPct).toBeCloseTo(large.yPct, 5);
  });
});

describe("represented-by wordmark pin", () => {
  test("uses the small-page pin when the wordmark is small", () => {
    const pin = representedByWordmarkPin(
      { left: 0, top: 0, width: 885, height: NVA_REPRESENTED_PIN.small.height },
      { left: 0, top: 0, width: 885, height: NVA_REPRESENTED_PIN.small.height },
    );

    expect(pin?.xPct).toBeCloseTo(NVA_REPRESENTED_PIN.small.xFrac * 100, 2);
    expect(pin?.yPct).toBeCloseTo(NVA_REPRESENTED_PIN.small.yFrac * 100, 2);
  });

  test("uses the large-page pin when the wordmark is large", () => {
    const pin = representedByWordmarkPin(
      {
        left: 0,
        top: 0,
        width: 2283,
        height: NVA_REPRESENTED_PIN.large.height,
      },
      {
        left: 0,
        top: 0,
        width: 2283,
        height: NVA_REPRESENTED_PIN.large.height,
      },
    );

    expect(pin?.xPct).toBeCloseTo(NVA_REPRESENTED_PIN.large.xFrac * 100, 2);
    expect(pin?.yPct).toBeCloseTo(NVA_REPRESENTED_PIN.large.yFrac * 100, 2);
  });

  test("blends the two pins as the wordmark grows", () => {
    const midHeight =
      (NVA_REPRESENTED_PIN.small.height + NVA_REPRESENTED_PIN.large.height) / 2;
    const mid = representedByMarkFractions(midHeight);

    expect(mid.xFrac).toBeGreaterThan(NVA_REPRESENTED_PIN.large.xFrac);
    expect(mid.xFrac).toBeLessThan(NVA_REPRESENTED_PIN.small.xFrac);
    expect(mid.yFrac).toBeGreaterThan(NVA_REPRESENTED_PIN.large.yFrac);
    expect(mid.yFrac).toBeLessThan(NVA_REPRESENTED_PIN.small.yFrac);
  });

  test("keeps CSS fallbacks in sync with the large-page pin", async () => {
    const css = await Bun.file(
      new URL("../../../app/miizu-landing.module.css", import.meta.url),
    ).text();

    expect(NVA_REPRESENTED_X_PCT).toBe(11.56);
    expect(NVA_REPRESENTED_Y_PCT).toBe(12.24);
    expect(css).toContain(`left: var(--n-x, ${NVA_REPRESENTED_X_PCT}%);`);
    expect(css).toContain(`top: var(--n-y, ${NVA_REPRESENTED_Y_PCT}%);`);
    expect(css).toContain(
      `rotate(var(--n-angle, ${NVA_REPRESENTED_ANGLE_DEG}deg))`,
    );
  });
});

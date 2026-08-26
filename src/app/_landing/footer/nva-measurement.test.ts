import { describe, expect, test } from "bun:test";

import {
  fitMobileNvaInk,
  mobileNvaViewportWidth,
  NVA_REPRESENTED_PIN,
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

  test("prefers the visual viewport when it is available", () => {
    expect(mobileNvaViewportWidth(390.4, 389.6)).toBe(390);
    expect(mobileNvaViewportWidth(412)).toBe(412);
    expect(mobileNvaViewportWidth(0, 0)).toBe(0);
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

    expect(NVA_REPRESENTED_PIN.large.xFrac * 100).toBeCloseTo(11.56, 5);
    expect(NVA_REPRESENTED_PIN.large.yFrac * 100).toBeCloseTo(12.24, 5);
    expect(css).toContain("left: var(--n-x, 11.56%);");
    expect(css).toContain("top: var(--n-y, 12.24%);");
    expect(css).toContain("rotate(var(--n-angle, 55.83deg))");
  });
});

import { describe, expect, test } from "bun:test";

import { fitMobileNvaInk } from "./nva-measurement";

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
});

import { describe, expect, test } from "bun:test";

import { WORK_PROOF_ITEMS } from "./content";

describe("mobile work proof", () => {
  test("keeps the directed work types without the sentence scaffolding", () => {
    expect(WORK_PROOF_ITEMS.map((item) => item.text)).toEqual([
      "Launches",
      "Trailers",
      "Keynotes",
      "Placements",
    ]);
  });
});

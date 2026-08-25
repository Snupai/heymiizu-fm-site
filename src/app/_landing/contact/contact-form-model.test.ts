import { describe, expect, test } from "bun:test";

import {
  getBudgetValidationMessage,
  getDeadlineValidationMessage,
} from "./contact-form-model";

describe("optional project details", () => {
  test("budget is required only when asked for", () => {
    expect(getBudgetValidationMessage("", true)).toBe(
      "Please choose a budget range.",
    );
    expect(getBudgetValidationMessage("", false)).toBeNull();
    expect(getBudgetValidationMessage("10 - 25k", false)).toBeNull();
  });

  test("deadline stays optional until a start date is picked", () => {
    expect(getDeadlineValidationMessage(undefined, "", false)).toBeNull();
    expect(getDeadlineValidationMessage(undefined, "", true)).toBe(
      "Please select a project date range.",
    );
    expect(
      getDeadlineValidationMessage({ from: new Date("2026-09-01") }, "", false),
    ).toBe("Please select an end date.");
  });
});

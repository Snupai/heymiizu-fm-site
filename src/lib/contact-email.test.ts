import { describe, expect, test } from "bun:test";

import { buildContactInquiryEmail } from "./contact-email";

const baseInquiry = {
  name: "Mia",
  email: "mia@example.com",
  telephone: null,
  referral: null,
  service: "Trailer",
  region: "international" as const,
  description: "A launch film.",
};

describe("contact inquiry email", () => {
  test("omits budget and dates when the short form leaves them empty", () => {
    const email = buildContactInquiryEmail({
      ...baseInquiry,
      budget: "",
      deadline: "",
    });

    expect(email.text).toContain("Budget: Not provided");
    expect(email.text).toContain("Project dates: Not provided");
    expect(email.html).not.toContain(">Budget</p>");
    expect(email.html).not.toContain(">Project dates</p>");
  });

  test("includes budget and dates when they are filled in", () => {
    const email = buildContactInquiryEmail({
      ...baseInquiry,
      budget: "10 - 25k",
      deadline: "2026-09-01 - 2026-09-20",
    });

    expect(email.text).toContain("Budget: 10 - 25k");
    expect(email.html).toContain("10 - 25k");
    expect(email.html).toContain("Project dates");
  });
});

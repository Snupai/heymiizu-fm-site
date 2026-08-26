import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";

describe("intro scrollbar gutter", () => {
  const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");
  const introLockStart = css.indexOf("data-intro-lock");
  const introLock = css.slice(introLockStart);

  test("does not collapse the gutter while scroll is locked", () => {
    expect(introLockStart).toBeGreaterThan(-1);
    expect(introLock).not.toMatch(/scrollbar-width:\s*none/);
    expect(introLock).not.toMatch(/display:\s*none/);
    expect(introLock).not.toMatch(/width:\s*0/);
  });
});

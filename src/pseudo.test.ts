import { describe, expect, it } from "vitest";

import { pseudoLocalizeMessage } from "./pseudo";

describe("pseudoLocalizeMessage", () => {
  it("deterministically expands and accents visible text", () => {
    const result = pseudoLocalizeMessage("Create workspace");

    expect(result).toContain("[");
    expect(result).toContain("]");
    expect(result.length).toBeGreaterThan("Create workspace".length);
    expect(result).not.toBe(pseudoLocalizeMessage("Workspace created"));
  });

  it("preserves ICU placeholders and rich text tags", () => {
    const message = "Hello {name}, <strong>{count, plural, one {# item} other {# items}}</strong>";
    const result = pseudoLocalizeMessage(message);

    expect(result).toContain("{name}");
    expect(result).toContain("{count, plural, one {# item} other {# items}}");
    expect(result).toContain("<strong>");
    expect(result).toContain("</strong>");
  });
});

import { describe, expect, it } from "vitest";

import { negotiateLocale } from "./negotiation";

describe("negotiateLocale", () => {
  it("uses explicit locale before cookie and Accept-Language", () => {
    expect(
      negotiateLocale({
        explicitLocale: "en-XA",
        cookieLocale: "en-US",
        acceptLanguage: "en-US;q=1",
      })
    ).toBe("en-XA");
  });

  it("uses cookie locale when explicit locale is unsupported", () => {
    expect(
      negotiateLocale({
        explicitLocale: "fr-FR",
        cookieLocale: "en-XA",
        acceptLanguage: "en-US;q=1",
      })
    ).toBe("en-XA");
  });

  it("honors Accept-Language q-values and the supported locale allowlist", () => {
    expect(
      negotiateLocale({
        acceptLanguage: "fr-FR;q=1, en-XA;q=0.8, en-US;q=0.7",
      })
    ).toBe("en-XA");
  });

  it("supports base language matches only when unambiguous in the supported list", () => {
    expect(negotiateLocale({ acceptLanguage: "en;q=1" })).toBe("en-US");
  });

  it.each([
    "../../secret",
    "en-US/../../x",
    "<script>",
    "",
    null,
    undefined,
    {},
  ])("falls back for hostile or malformed Accept-Language input %p", (acceptLanguage) => {
    expect(negotiateLocale({ acceptLanguage })).toBe("en-US");
  });
});

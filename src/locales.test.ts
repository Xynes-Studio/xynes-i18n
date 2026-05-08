import { describe, expect, it } from "vitest";

import {
  DEFAULT_LOCALE,
  PSEUDO_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  normalizeLocale,
} from "./locales";

describe("locale configuration", () => {
  it("exports the supported default and pseudo locales", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en-US", "en-XA"]);
    expect(DEFAULT_LOCALE).toBe("en-US");
    expect(PSEUDO_LOCALE).toBe("en-XA");
  });

  it("recognizes exact supported locale values", () => {
    expect(isSupportedLocale("en-US")).toBe(true);
    expect(isSupportedLocale("en-XA")).toBe(true);
    expect(isSupportedLocale("fr-FR")).toBe(false);
  });

  it("normalizes mixed-case locale tags to supported canonical values", () => {
    expect(normalizeLocale("en-us")).toBe("en-US");
    expect(normalizeLocale("EN-xa")).toBe("en-XA");
  });

  it.each([
    "fr-FR",
    "../../secret",
    "en-US/../../x",
    "en_US",
    "",
    "   ",
    null,
    undefined,
    {},
    [],
  ])("fails closed to the default locale for %p", (value) => {
    expect(normalizeLocale(value)).toBe(DEFAULT_LOCALE);
  });
});

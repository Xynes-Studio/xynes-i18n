import { describe, expect, it } from "vitest";

import {
  flattenCatalogKeys,
  validateCatalogKeyParity,
  validateCatalogPlaceholderParity,
  validateIcuPlaceholderParity,
} from "./catalog";

describe("catalog validation", () => {
  const baseCatalog = {
    nav: {
      home: "Home",
      greeting: "Hello {name}",
    },
    count: "{count, plural, one {# item} other {# items}}",
  };

  it("flattens nested catalog keys", () => {
    expect(flattenCatalogKeys(baseCatalog)).toEqual([
      "count",
      "nav.greeting",
      "nav.home",
    ]);
  });

  it("detects missing and extra keys", () => {
    const issues = validateCatalogKeyParity(baseCatalog, {
      nav: {
        home: "Pseudo home",
      },
      extra: "Unexpected",
    });

    expect(issues).toEqual([
      { type: "missing_key", key: "count" },
      { type: "missing_key", key: "nav.greeting" },
      { type: "extra_key", key: "extra" },
    ]);
  });

  it("detects ICU placeholder parity mismatches", () => {
    expect(validateIcuPlaceholderParity("Hello {name}", "Hello {user}")).toEqual([
      { type: "missing_placeholder", key: "name" },
      { type: "extra_placeholder", key: "user" },
    ]);
  });

  it("validates placeholders across matching catalog keys", () => {
    const issues = validateCatalogPlaceholderParity(baseCatalog, {
      nav: {
        home: "Pseudo home",
        greeting: "Pseudo {user}",
      },
      count: "Pseudo {count, plural, one {# thing} other {# things}}",
    });

    expect(issues).toEqual([
      { type: "missing_placeholder", key: "nav.greeting", placeholder: "name" },
      { type: "extra_placeholder", key: "nav.greeting", placeholder: "user" },
    ]);
  });
});

import { describe, expect, it } from "vitest";

import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  formatTime,
} from "./format";

const date = new Date("2026-05-08T10:30:00.000Z");

describe("formatter helpers", () => {
  it("formats date, time, and date-time through safe locale normalization", () => {
    expect(formatDate(date, { locale: "EN-us", timeZone: "UTC" })).toContain("2026");
    expect(formatTime(date, { locale: "../../secret", timeZone: "UTC" })).toMatch(/\d/);
    expect(formatDateTime(date, { locale: "en-XA", timeZone: "UTC" })).toContain("2026");
  });

  it("formats relative time", () => {
    expect(formatRelativeTime(-1, "day", { locale: "en-us" })).toBe("1 day ago");
  });

  it("formats number, percent, and currency", () => {
    expect(formatNumber(1234.5, { locale: "en-US" })).toBe("1,234.5");
    expect(formatPercent(0.42, { locale: "en-US" })).toBe("42%");
    expect(formatCurrency(12.5, { currency: "USD", locale: "en-US" })).toBe("$12.50");
  });
});

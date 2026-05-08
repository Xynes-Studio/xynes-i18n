export const SUPPORTED_LOCALES = ["en-US", "en-XA"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en-US";
export const PSEUDO_LOCALE: Locale = "en-XA";

const SUPPORTED_LOCALE_SET = new Set<string>(SUPPORTED_LOCALES);
const CANONICAL_LOCALE_BY_LOWERCASE = new Map(
  SUPPORTED_LOCALES.map((locale) => [locale.toLowerCase(), locale])
);

export function isSupportedLocale(value: unknown): value is Locale {
  return typeof value === "string" && SUPPORTED_LOCALE_SET.has(value);
}

export function normalizeLocale(value: unknown): Locale {
  if (typeof value !== "string") {
    return DEFAULT_LOCALE;
  }

  const trimmedValue = value.trim();

  if (!/^[A-Za-z]{2,3}-[A-Za-z0-9]{2,8}$/.test(trimmedValue)) {
    return DEFAULT_LOCALE;
  }

  return CANONICAL_LOCALE_BY_LOWERCASE.get(trimmedValue.toLowerCase()) ?? DEFAULT_LOCALE;
}

export function findSupportedLocale(value: unknown): Locale | null {
  const normalizedLocale = normalizeLocale(value);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  if (!/^[A-Za-z]{2,3}-[A-Za-z0-9]{2,8}$/.test(trimmedValue)) {
    return null;
  }

  return CANONICAL_LOCALE_BY_LOWERCASE.has(trimmedValue.toLowerCase())
    ? normalizedLocale
    : null;
}

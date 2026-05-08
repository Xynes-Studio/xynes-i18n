import { DEFAULT_LOCALE, type Locale, SUPPORTED_LOCALES, findSupportedLocale } from "./locales";

export interface LocaleNegotiationInput {
  explicitLocale?: unknown;
  cookieLocale?: unknown;
  acceptLanguage?: unknown;
}

interface AcceptLanguageCandidate {
  readonly locale: Locale;
  readonly quality: number;
  readonly index: number;
}

export function negotiateLocale(input: LocaleNegotiationInput): Locale {
  return (
    findSupportedLocale(input.explicitLocale) ??
    findSupportedLocale(input.cookieLocale) ??
    negotiateAcceptLanguage(input.acceptLanguage) ??
    DEFAULT_LOCALE
  );
}

function negotiateAcceptLanguage(value: unknown): Locale | null {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const candidates = value
    .split(",")
    .map((part, index): AcceptLanguageCandidate | null => {
      const [rawTag, ...rawParameters] = part.trim().split(";");
      const quality = parseQuality(rawParameters);
      const locale = matchLanguageTag(rawTag);

      if (!locale || quality <= 0) {
        return null;
      }

      return { locale, quality, index };
    })
    .filter((candidate): candidate is AcceptLanguageCandidate => candidate !== null)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  return candidates[0]?.locale ?? null;
}

function parseQuality(parameters: string[]): number {
  const qualityParameter = parameters
    .map((parameter) => parameter.trim())
    .find((parameter) => parameter.toLowerCase().startsWith("q="));

  if (!qualityParameter) {
    return 1;
  }

  const quality = Number.parseFloat(qualityParameter.slice(2));

  if (!Number.isFinite(quality)) {
    return 0;
  }

  return Math.max(0, Math.min(1, quality));
}

function matchLanguageTag(rawTag: string | undefined): Locale | null {
  if (!rawTag || !/^[A-Za-z]{1,8}(?:-[A-Za-z0-9]{1,8})*$/.test(rawTag)) {
    return null;
  }

  const directLocale = findSupportedLocale(rawTag);
  if (directLocale) {
    return directLocale;
  }

  const lowerTag = rawTag.toLowerCase();
  const matchingLocales = SUPPORTED_LOCALES.filter((locale) =>
    locale.toLowerCase().startsWith(`${lowerTag}-`)
  );

  return matchingLocales.length === 1 ? matchingLocales[0] : null;
}

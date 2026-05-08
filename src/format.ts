import { type Locale, normalizeLocale } from "./locales";

interface LocaleFormatOptions {
  readonly locale?: unknown;
}

export type DateFormatOptions = LocaleFormatOptions & Intl.DateTimeFormatOptions;
export type NumberFormatOptions = LocaleFormatOptions & Intl.NumberFormatOptions;
export type RelativeTimeFormatOptions = LocaleFormatOptions & Intl.RelativeTimeFormatOptions;

export interface CurrencyFormatOptions extends LocaleFormatOptions {
  readonly currency: string;
  readonly minimumFractionDigits?: number;
  readonly maximumFractionDigits?: number;
  readonly currencyDisplay?: Intl.NumberFormatOptions["currencyDisplay"];
}

type DateInput = Date | string | number;

export function formatDate(value: DateInput, options: DateFormatOptions = {}): string {
  return new Intl.DateTimeFormat(resolveLocale(options.locale), {
    dateStyle: options.dateStyle ?? "medium",
    timeZone: options.timeZone,
    calendar: options.calendar,
    numberingSystem: options.numberingSystem,
  }).format(toDate(value));
}

export function formatTime(value: DateInput, options: DateFormatOptions = {}): string {
  return new Intl.DateTimeFormat(resolveLocale(options.locale), {
    timeStyle: options.timeStyle ?? "short",
    timeZone: options.timeZone,
    hourCycle: options.hourCycle,
    calendar: options.calendar,
    numberingSystem: options.numberingSystem,
  }).format(toDate(value));
}

export function formatDateTime(value: DateInput, options: DateFormatOptions = {}): string {
  return new Intl.DateTimeFormat(resolveLocale(options.locale), {
    dateStyle: options.dateStyle ?? "medium",
    timeStyle: options.timeStyle ?? "short",
    timeZone: options.timeZone,
    hourCycle: options.hourCycle,
    calendar: options.calendar,
    numberingSystem: options.numberingSystem,
  }).format(toDate(value));
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  options: RelativeTimeFormatOptions = {}
): string {
  return new Intl.RelativeTimeFormat(resolveLocale(options.locale), {
    localeMatcher: options.localeMatcher,
    numeric: options.numeric ?? "always",
    style: options.style ?? "long",
  }).format(value, unit);
}

export function formatNumber(value: number, options: NumberFormatOptions = {}): string {
  const intlOptions = stripLocale(options);

  return new Intl.NumberFormat(resolveLocale(options.locale), intlOptions).format(value);
}

export function formatPercent(value: number, options: NumberFormatOptions = {}): string {
  const intlOptions = stripLocale(options);

  return new Intl.NumberFormat(resolveLocale(options.locale), {
    ...intlOptions,
    style: "percent",
  }).format(value);
}

export function formatCurrency(value: number, options: CurrencyFormatOptions): string {
  return new Intl.NumberFormat(resolveLocale(options.locale), {
    style: "currency",
    currency: options.currency,
    currencyDisplay: options.currencyDisplay,
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
  }).format(value);
}

function resolveLocale(locale: unknown): Locale {
  return normalizeLocale(locale);
}

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

function stripLocale(options: NumberFormatOptions): Intl.NumberFormatOptions {
  const intlOptions = { ...options } as Intl.NumberFormatOptions & { locale?: unknown };
  delete intlOptions.locale;
  return intlOptions;
}

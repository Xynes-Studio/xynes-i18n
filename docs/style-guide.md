# Xynes I18n Style Guide

## Locale Policy

- Supported Story 1 locales are `en-US` and pseudo-locale `en-XA`.
- Unsupported, malformed, hostile, empty, or non-string locale inputs must resolve to `en-US`.
- Locale values are allowlisted before app code uses them for catalog selection.
- Apps must use static locale-to-catalog import maps. Never build an import path from raw locale input.

## Catalog Policy

- Catalog keys should be stable and descriptive.
- Keep product copy in app catalogs. Shared package messages are only for common cross-app labels.
- Preserve ICU placeholders exactly across locales.
- Do not render catalog strings through `dangerouslySetInnerHTML`.
- Rich text translations must use explicit component allowlists in the consuming app.

## Pseudo-Locale Policy

Use `en-XA` for layout stress, truncation, and accessible-name testing. Pseudo-locale text is deterministic and generated from source English; it is not a human translation.

## Formatter Policy

Use the formatter helpers from `@xynes/i18n` when an app needs shared locale fallback behavior. Pass explicit `timeZone` values where deterministic tests or server-rendered dates require them.

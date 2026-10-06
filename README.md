# @xynes/i18n

Shared locale, formatting, pseudo-locale, and catalog validation utilities for Xynes frontend apps.

This package has no runtime dependency on a translation management system, machine translation provider, or app framework. Apps own their product catalogs and use this package for shared rules.

## Locale Config

```ts
import {
  DEFAULT_LOCALE,
  PSEUDO_LOCALE,
  SUPPORTED_LOCALES,
  normalizeLocale,
} from "@xynes/i18n";

normalizeLocale("en-us"); // "en-US"
normalizeLocale("../../secret"); // "en-US"
```

## Negotiation

```ts
import { negotiateLocale } from "@xynes/i18n";

const locale = negotiateLocale({
  explicitLocale: searchParams.locale,
  cookieLocale: cookies.get("xynes_locale")?.value,
  acceptLanguage: request.headers.get("accept-language"),
});
```

Precedence is explicit preference, cookie, `Accept-Language`, then `en-US`.

## Formatting

```ts
import { formatCurrency, formatDateTime } from "@xynes/i18n";

formatDateTime(new Date(), { locale, timeZone: "UTC" });
formatCurrency(19.99, { locale, currency: "USD" });
```

## Pseudo-Locale

```ts
import { pseudoLocalizeMessage } from "@xynes/i18n";

pseudoLocalizeMessage("Hello {name}");
// "[HHeelllloo {name}]"
```

ICU placeholders and rich-text tags are preserved.

## Catalog Validation

```ts
import {
  validateCatalogKeyParity,
  validateCatalogPlaceholderParity,
} from "@xynes/i18n";

const keyIssues = validateCatalogKeyParity(enUsMessages, enXaMessages);
const placeholderIssues = validateCatalogPlaceholderParity(enUsMessages, enXaMessages);
```

Validation detects missing/extra keys and ICU placeholder mismatches without evaluating translated messages.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm test:coverage
pnpm lint
pnpm typecheck
pnpm build
```

## Pull request checks

Required checks are recorded in `.github/ci/required-checks.json`: lint, test,
coverage, build, typecheck, security, and CodeQL analyze. Confirm that every
required check has completed successfully on the current PR commit; an absent
check is a validation gap.

GitHub can disable scheduled workflows after repository inactivity. If CodeQL
analyze is absent, check the existing CodeQL workflow's state in Actions and
reactivate it when disabled for inactivity, then push the next reviewed change
to trigger PR analysis. Keep the required check and the workflow's read-only PR
permissions in place.

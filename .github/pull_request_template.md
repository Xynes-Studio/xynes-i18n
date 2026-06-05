## Summary
<!-- One-paragraph description of what this PR does and why. -->

## Linked work
- Plan / issue: <!-- link -->
- Related repos: <!-- link any PRs that depend on or are depended on by this one -->

## Quality gates
- [ ] `lint` passes locally
- [ ] `test` passes locally
- [ ] Coverage ≥ ADR-001 80% floor (or justified exception below)
- [ ] `typecheck` / `build` passes (where applicable)
- [ ] Docs updated (`README.md`, `DEVELOPER.md`, `AGENTS.md`, repo memory)
- [ ] Migration added (if schema change) — forward-only, expand/contract
- [ ] QA PII scrub updated (if migration adds PII)
- [ ] Release doc set updated (if release contract changed)

## Security
- [ ] No secrets in code, logs, error messages, or test fixtures
- [ ] No raw API keys forwarded to downstream services
- [ ] No PII added to telemetry or access logs

## Deployment notes
<!-- e.g. "Requires migration run before service rollout", "Requires xynes-platform-contracts vX.Y.Z first". -->

## Rollback plan
<!-- For risky changes only. -->

---

## Repo-specific items (xynes-i18n)

This is the **shared i18n package** (`@xynes/i18n`) — locale config, ICU MessageFormat negotiation, pseudo-locale (`en-XA`), and the common message catalog consumed by every FE app via `pnpm link`. Use `pnpm`, never `npm`.

- [ ] Lint: `pnpm lint` (eslint over `src/**/*.ts`)
- [ ] Tests: `pnpm test` (vitest run)
- [ ] Coverage: `pnpm test:coverage` — overall must stay at or above the **ADR-001 80% lines + branches floor**
- [ ] Typecheck: `pnpm typecheck` (= `tsc --noEmit`)
- [ ] Build: `pnpm build` (tsup ESM + CJS + DTS) — **MANDATORY before opening downstream consumer PRs.** Every consumer (`xynes-auth-app`, `xynes-cms-console-web`, `xynes-auth-sdk`) imports from this package's `dist/`. A consumer PR opened against a stale dist will fail with type errors that look unrelated. Same stale-dist trap as `xynes-auth-sdk`.
- [ ] **Cross-repo merge ordering.** Publish (or `pnpm link` refresh) MUST land BEFORE downstream consumer PRs. Catalog or negotiation contract changes that ripple into auth-app + cms-console-web message bundles need lockstep PRs.
- [ ] **Locale negotiation contract is closed-set and fail-closed.** `resolveAuthLocale` / `resolveLocale` use a closed set of supported locales; hostile cookies, malformed `Accept-Language` headers, and unknown locale codes ALL fall closed to the documented default (`en-US`). PRs that touch negotiation MUST preserve this posture — never silently coerce an unknown locale to a translated one.
- [ ] **Pseudo-locale (`en-XA`) round-trip is mandatory.** Every new catalog key MUST register in both `en-US` and `en-XA`. Hostile-translator regression guards (`landing-copy.test.ts` precedent in `xynes-auth-app` for the CodeQL `js/incomplete-url-scheme-check` alert) ensure no `javascript:` / `data:` / `vbscript:` / protocol-relative URL substrings can be smuggled through translation strings. New tests of this kind MUST run case-insensitive + trimmed per the CodeQL example.
- [ ] **ICU MessageFormat is the only allowed string interpolation.** Direct template-literal concatenation in catalog values is forbidden — it defeats the negotiation + escape pipeline. Use `{namedVariable}` placeholders and resolve via the format pipeline.
- [ ] **Common message catalog is a SHARED contract.** Strings consumed across both `xynes-auth-app` AND `xynes-cms-console-web` live here. App-specific strings (`auth.landing.meta.title`, `cms.entry.delete.confirm`) live in their app's own catalog, not here. Don't mix layers.
- [ ] **CI workflows already shipped** (`ci.yml`, `codeql.yml`). This PR adds ONLY `pull_request_template.md` + `CODEOWNERS`. Do NOT modify the existing workflows — that's a separate concern.
- [ ] **No raw credentials and no PII in any catalog value, test fixture, or pseudo-locale generator.** No `xynes_live_*` / `AKIA*` / `re_*` substrings anywhere — this repo publishes translated UI strings, nothing more.

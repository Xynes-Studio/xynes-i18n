# Xynes Translation Glossary

This glossary is the shared starting point for product UI translation. App-specific catalogs can add local context, but these terms should stay consistent across frontend repos.

| Term | Rule | Notes |
|---|---|---|
| Xynes | Do not translate | Product/brand name. Preserve capitalization. |
| Workspace | Translate when the target locale has a clear product equivalent | A customer-owned collaboration/account boundary. |
| Workspace Admin | Translate descriptively if needed | The Auth dashboard surface for workspace-level administration. |
| CMS | Usually do not translate | Use the local industry-standard acronym if different. |
| API key | Translate "key" only when natural | Never include raw key values in catalogs or metadata. |
| Verified domain | Translate | A domain whose ownership has been verified through the Workspace Admin flow. |
| Publisher | Translate | A role or automation that can publish CMS content. |
| Content entry | Translate | CMS-authored content item. |
| Directory | Translate carefully | CMS content organization concept, not a filesystem promise. |
| Invite | Translate | Workspace invitation flow. |

## Security Rules

- Do not place secrets, raw API keys, verification hashes, session details, invite tokens, or internal audit notes in message catalogs.
- Do not put externally controlled URLs in translated strings. Keep link targets in code/config.
- Do not rely on machine translation as a runtime dependency for product UI.

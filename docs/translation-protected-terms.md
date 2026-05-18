# Translation Protected Terms

This glossary lists Zcash ecosystem terms that should not be machine-translated literally.

The goal is to keep wiki translations accurate and consistent. Some terms are product names, protocol names, wallet names, or community program names. Translating them literally can confuse readers. For example, `Arborist Calls` should remain `Arborist Calls`, not a literal translation such as `Chiamate dell'arboricoltore`.

## How to Use This List

- Do not translate protected brand, wallet, protocol, or community program names.
- Keep the original capitalization unless a page already uses a known variant.
- When a localized explanation is useful, add it around the term instead of replacing the term.
- During translation review, compare translated pages against `src/constants/protectedTranslationTerms.ts`.
- Future UI work can use this list to wrap generated labels with `translate="no"` or `className="notranslate"`.

## Examples

Preferred:

```md
Arborist Calls are recurring ecosystem calls for Zcash protocol discussion.
```

Acceptable localized explanation:

```md
Arborist Calls, le chiamate ricorrenti della community dedicate al protocollo Zcash, ...
```

Avoid:

```md
Chiamate dell'arboricoltore
```

## Source of Truth

The canonical list lives in:

```txt
src/constants/protectedTranslationTerms.ts
```

If a new wallet, protocol feature, organization, or community program is added to the wiki, add it to the protected term list in the same pull request when appropriate.

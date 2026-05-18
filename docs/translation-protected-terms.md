# Translation Protected Terms

This glossary lists Zcash ecosystem terms that should not be machine-translated literally.

The goal is to keep wiki translations accurate and consistent. Some terms are product names, protocol names, wallet names, or community program names. Translating them literally can confuse readers. For example, `Arborist Calls` should remain `Arborist Calls`, not a literal translation such as `Chiamate dell'arboricoltore`.

## How to Use This List

- Do not translate protected brand, wallet, protocol, or community program names.
- Keep the original capitalization unless a page already uses a known variant.
- When a localized explanation is useful, add it around the term instead of replacing the term.
- During translation review, compare translated pages against `src/constants/protectedTranslationTerms.ts`.
- Future UI work can use this list to wrap generated labels with `translate="no"` or `className="notranslate"`.

## What Should Be Protected

Protect terms that behave like names or identifiers:

- Brands and projects: `Zcash`, `ZecHub`, `Free2Z`, `Zcash.Me`.
- Organizations and programs: `Electric Coin Company`, `Zcash Foundation`, `ZCG`, `Arborist Calls`.
- Protocol eras and network upgrades: `Sapling`, `Orchard`, `NU5`, `NU6`.
- Software and commands: `Zebra`, `zebrad`, `zcashd`, `lightwalletd`, `Zaino`.
- Acronyms and governance labels: `ZEC`, `ZIP`, `ZCAP`, `FROST`.
- Address and key primitives where literal translation can change the expected technical term: `Unified Address`, `Viewing Key`, `t-address`.

Do not protect normal descriptive words by themselves unless they are part of a fixed term. For example, `shielded`, `transparent`, `memo`, `wallet`, `transaction`, and `address` should usually be translatable in regular prose. Protect a fixed phrase only when the English phrase is the expected product, page, or protocol term.

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

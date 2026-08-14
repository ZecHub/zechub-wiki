# Translation Protected Terms

This glossary lists Zcash ecosystem terms that should not be machine-translated literally.

The goal is to keep wiki translations accurate and consistent. Some terms are product names, protocol names, wallet names, or community program names. Translating them literally can confuse readers. For example, `Arborist Calls` should remain `Arborist Calls`, not a literal translation such as `Chiamate dell'arboricoltore`.

## How to Use This List

- Do not translate protected brand, wallet, protocol, or community program names.
- Keep the original capitalization unless a page already uses a known variant.
- When a localized explanation is useful, add it around the term instead of replacing the term. See [First-Use Gloss](#first-use-gloss) for the form to use.
- During translation review, check against **both** lists described in [Source of Truth](#source-of-truth). The categorized list in this repo is the easier one to read, but the content repo's `translation/protected-terms.json` is the one CI enforces, and it contains terms this one does not.
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

## First-Use Gloss

A protected term must appear verbatim, but that does not mean the reader is left guessing. Some protected terms are **compound technical terms**, where the English words state the meaning — `Unified Address` and `Viewing Key` are the clearest cases, along with the other key and address forms. Understanding them is part of what the page teaches.

For those, keep the term and add a short localized gloss in parentheses **on first use in the page**, then use the term alone afterwards:

```md
La Viewing Key (chiave di visualizzazione) consente di visualizzare i dettagli
delle proprie transazioni schermate senza poter spendere i fondi. Condividi la
Viewing Key solo con chi deve verificare le tue transazioni.
```

- **Term first, gloss second.** `Viewing Key (chiave di visualizzazione)`, not the reverse. The English term is what the reader meets again in wallets, block explorers, ZIPs and the forum, so it is the string worth anchoring; the gloss teaches the concept once.
- **First use only.** Repeating the gloss at every mention is noise.
- **Keep it short** — a word or brief phrase, not a definition. The page defines the concept anyway.
- **Use the language's established term.** If translators in that language already have a word for the concept, use it rather than coining one.
- **Never gloss a codename or an acronym.** Many protected terms are ordinary English words borrowed as labels, where the literal meaning is irrelevant and a gloss actively misleads: `Sapling`, `Blossom`, `Heartwood`, `Canopy`, `Sprout`, `Overwinter`, `Orchard`, `Halo`, `Pallas`, `Vesta`, `Zebra`. `Sapling (alberello)` tells the reader something untrue about a network upgrade. The same goes for acronyms — `ZIP`, `ZCAP`, `NU6` — and for brand, wallet, organization, service and community names such as `Zashi`, `ZecHub` or `Arborist Calls`.
- **Using the categorized list**: within `addressing`, gloss **every expanded address or key compound** — that is `Unified Address`, `Viewing Key`, `Unified Viewing Key`, `Full Viewing Key`, `Incoming Viewing Key`, `Outgoing Viewing Key`, `Spending Key`, `Diversified Address` and `TEX Address` — and leave the **short label forms** bare: `UA`, `UAs`, `t-address`, `z-address`, `u-address`. Do not gloss `protocol`, `cryptography`, `network`, `software`, `brand`, `wallet`, `organization`, `service` or `community`. In `governance`, the acronyms take no gloss while a compound like `Dev Fund` may take one. When a term does not obviously fit, ask whether the English words state the meaning or merely serve as a label — label means no gloss.
- **Plural forms are not protected, and you should not treat them as protected.** The categorized list carries a few (`Unified Addresses`, `UAs`, `ZIPs`), but pluralizing an English loanword is a language-by-language decision, not an English one. Italian writes *gli Unified Address*, because Italian does not add `-s` to loanwords; Japanese, Korean and Chinese do not inflect plurals at all. So treat the **singular** as the term to preserve, gloss it on its first appearance, and pluralize however your language normally would.
- **Do not gloss inside** headings, code spans or fences, link text, table cells, image alt text, URLs, or frontmatter. A gloss in a heading changes the page anchor, and a gloss inside a URL or anchor breaks the link outright — the translation-sync tooling compares link destinations between a page and its translation, so that can also cause an automated re-sync to reject the page. Code and frontmatter are not prose. Link text, table cells and image alt text are excluded for readability rather than tooling reasons.
- For right-to-left languages, follow the pattern already used in the existing Arabic pages so parentheses and Latin text nest correctly.

A parenthetical gloss is for a short equivalent. Explaining a term at length in the surrounding prose — as the `Arborist Calls` example above does — is always fine and is not restricted to compound terms; the rules here govern the short parenthetical form only.

The protected-terms check only asks whether the term is present, so a glossed and an unglossed first mention both pass. This is an editorial convention, not a validation rule.

**Machine translation is not expected to do this.** The sync pipeline re-translates a page block by block and cannot see whether an earlier block already glossed a term, so asking it for "first use only" would produce glosses repeated or missing at random. Glossing is a human-review improvement.

If you hand-edit a machine-translated page, the content repo's `translation/sync-state.json` must record it or the manifest check rejects the change: note what you did in that entry's `tool` field. This applies to **every** edit, not just the first — an `edited: true` flag already set in an earlier pull request is not a standing licence to change the file again without touching the manifest.

Setting `edited: true` additionally protects the page from being overwritten — but be deliberate, because it removes the page from automated sync **permanently**, so later English updates will no longer reach that translation. Reserve it for a page you intend to maintain by hand, and prefer folding a gloss into a fuller human review rather than freezing a whole page for one word.

## Source of Truth

Two lists exist today, and they are not the same:

```txt
src/constants/protectedTranslationTerms.ts   (this repo — categorized, for UI work and review)
translation/protected-terms.json             (content repo — the list CI enforces)
```

The check that gates a pull request reads `preserveVerbatim` from the **content repo's** `translation/protected-terms.json`. If a term is missing there, nothing prevents a translation from localizing it, however carefully the list in this repo is maintained.

The two have drifted. As of 2026-08-14 the categorized list here carries terms the CI list does not enforce — including `Blossom`, `Canopy`, `Brave Wallet`, `Dev Fund` and `BTCPayServer` — while the CI list enforces terms absent here, including `Keystone`, `Ledger`, `Zkool`, `Zingo-CLI` and `eZcash`. Recount before relying on any figure, since both lists change. Reconciling them is an editorial decision rather than a mechanical one: adding a term creates review work in every language whose pages already use it.

If a new wallet, protocol feature, organization, or community program is added to the wiki, add it to both lists as part of the same change. They live in different repositories, so that means a paired pull request in each — and only the content-repo half changes what CI enforces.

---
date: 2026-09-22
---

# Translating ZecHub

How multilingual content works, and how to add or update a language — for translators and developers.

You probably only need one half of this doc:

- **Translators** — you write Markdown and/or translate UI labels. Read [How it works](#how-it-works-one-curated-path) and jump to [Adding a language](#adding-a-language). You don't need the internals.
- **Developers** — you change how i18n works. Read [Architecture](#architecture) and [Invariants](#invariants).

---

## How it works: one curated path

Every non-English page you see is **curated** — human-written, human-reviewed Markdown, served on a real indexable URL (`/es/tech/halo`) through `next-intl`. There is exactly one translation path.

- **There is no machine-translation fallback.** The wiki used to run a runtime Google Translate widget for locales without curated content. That widget has been removed — it loaded a third-party script, wasn't indexable, and corrupted proper nouns (e.g. "Paradigma" -> "Paradigm"). Now every language in the switcher ships curated content.
- **The direct consequence:** A curated page is exactly what a reader sees, with no safety net, until it is re-synced. If the English source changes and a translation isn't updated, that locale silently serves stale content. That is why the content repo has a staleness & sync system.

Currently 18 curated locales ship: `ar`, `ch`, `hi`, `ru`, `ja`, `ko`, `tr`, `uk` (LLM-translated) and `am`, `fr`, `es`, `de`, `pt`, `fa`, `vi`, `id`, `ro`, `it` (translated baseline).

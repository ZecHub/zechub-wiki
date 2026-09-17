// Single source of truth for menu-label tooling, shared by BOTH the CI coverage
// gate (scripts/check-menu-labels.mjs) and the operator fill routine
// (zechub-i18n-tooling sync-menu-labels.mjs). Having one module kills the
// brand-list / locale-list / extraction drift that two copies caused.
//
// The menu STRUCTURE (navigation.ts, explore-menu.ts) is shared across locales;
// only the LABEL text is per-locale (dictionaries menuLabels / exploreMenu).

import { join } from "node:path";
import { routing } from "../../src/i18n/routing.ts";

// Canonical locales = the app's routed set minus English (the source language).
// Deriving from routing.ts means the gate and sync agree with the app itself.
export const CANONICAL_LOCALES = routing.locales.filter((l) => l !== "en");

// Brand / product / proper names shown VERBATIM in every language (English
// fallback is correct, never a "missing translation"). One list for gate + sync.
// Deliberately CONSERVATIVE — only unambiguous single-name brands/tickers.
// Multi-word descriptive labels ("Zgo Payment Processor") are treated as
// translatable, since dictionaries legitimately localize the descriptive part.
export const MENU_BRANDS = new Set([
  "Sovright", "Free2Z", "Free2z", "ZecHub", "Zashi", "Zingo",
  "Ywallet", "YWallet", "Zcash", "ZEC", "Zcash.Me",
  // Social platforms (verbatim in every language — pre-existing dicts mistranslate
  // e.g. "Discord" -> "misunderstanding"; the gate now flags that).
  "Discord", "Twitter", "Youtube", "Github",
  // Hardware/product name that appears as a SUBSTRING of multi-word labels
  // ("Raspberry Pi Zebra Node"); listed so the sync passes it to the translator
  // as a keep-verbatim term. (Zebra/zebrad/Zcashd come from content protected-terms.)
  "Raspberry Pi",
  // Organisations, programmes, products and one jargon term whose WHOLE label is
  // a proper name — Zcash ecosystem vocabulary that reads wrong localised. These
  // self-map, so a locale that had translated them reverts to English; that is
  // the intent (one name everywhere), not a regression.
  //
  // "Testnet" is the one non-name here. It is jargon rather than a brand, and
  // the corpus was split 9 locales translating it against 9 keeping it — a tie
  // that had to be broken one way, and English matches how Russian and Arabic
  // technical writing usually renders it.
  "Financial Privacy Foundation", "ZKAV Club", "Zcash Global Ambassadors",
  "Zcash Community Grants", "Zcash Login", "Zcash Devtool", "Testnet",
  // Organisations and programmes added 2026-09-17. Each was translated by the
  // sync in most locales because the descriptive-looking word carries the name:
  // "Zcash Labs" -> "Laboratorios Zcash", "Valar Group" -> "Gruppo Valar",
  // "CoinHolder ... Grants" three different ways across 18 locales. Same class
  // as Financial Privacy Foundation and Zcash Community Grants above.
  //
  // "ShapeShift Zcash" is listed as the FULL label. The set has no type
  // distinction -- every entry is both a gate whole-label key and a sync
  // keep-verbatim substring -- so what changes is only whether an entry happens
  // to equal a whole label, and therefore self-maps. Listing only "ShapeShift"
  // left the remainder "Zcash", itself a brand, with nothing to localise, and
  // the label emitted a self-equal advisory in all 18 locales.
  //
  // "Akash Network Zcashd" and "CoinHolder Directed Retroactive Grants" were
  // tried here and deliberately removed. Both have a genuinely descriptive
  // remainder, and protecting the whole label discarded sound translations
  // ("Rete Akash Zcashd", "Subvenciones retroactivas dirigidas por los
  // titulares de monedas"). They stay translatable; Akash keeps its name via
  // the substring entry below.
  "Valar Group", "Zcash Labs", "ShapeShift Zcash",
  // SUBSTRINGS, not whole labels, per the conservative rule above: these appear
  // inside labels whose remainder is descriptive and SHOULD stay localised —
  // "BTCPayServer Zcash Plugin" (plugin), "Fork zechub-wiki" (fork). Listing the
  // name alone keeps the name verbatim without flattening the whole label to
  // English, exactly as "Raspberry Pi" does above.
  "BTCPayServer", "zechub", "zechub-wiki",
  // Added 2026-09-17: unprotected, these were transliterated into non-Latin
  // scripts -- Brave -> "\u092c\u094d\u0930\u0947\u0935" (hi), Akash -> "\u0906\u0915\u093e\u0936" (hi) / "\u30a2\u30ab\u30b7\u30e5" (ja) --
  // while the descriptive remainder ("Wallet Guide") should stay localised.
  // "Zebrad" is listed in this exact capitalisation: the content glossary
  // carries only "zebrad" and "Zebra", and the prompt asks for terms EXACTLY as
  // written, so ko rendered "Zebrad" as "\uc81c\ube0c\ub77c\ub4dc" inside the migration-guide label.
  "Akash", "Brave", "ShapeShift", "Zebrad",
]);

// NOT added, deliberately, though both were flagged as untranslated in some
// locales:
//   "Shielded Pools"    — `Shielded` was removed from the content
//                         protected-terms list on purpose as translatable in
//                         prose (with Transparent and Memo). Protecting it in
//                         menus alone would render the same concept English in
//                         the sidebar and localised two lines into the page.
//                         15 of 18 locales translate it today.
//   "Freelance Privacy" — a use-case description, not a Zcash term; no product
//                         carries the name. 17 of 18 locales translate it, and
//                         that near-unanimity is the signal.

// Extract the English label sets by IMPORTING the modules (never regex).
// `root` is the frontend repo root. Returns { navLabels, coinLabels } as Sets.
export async function extractMenuLabels(root) {
  const nav = await import(join(root, "src/constants/navigation.ts"));
  const exp = await import(join(root, "src/constants/explore-menu.ts"));
  const navLabels = new Set();
  (function walk(arr) {
    for (const i of arr) {
      if (i.name) navLabels.add(i.name);
      if (i.label) navLabels.add(i.label);
      if (i.links) walk(i.links);
    }
  })(nav.navigations);
  const coinLabels = new Set(
    [...exp.exploreMenu.mainLinks, ...exp.exploreMenu.forkSection].map((x) => x.label),
  );
  return { navLabels, coinLabels };
}

// A dictionary value counts as a present translation only if it's a non-empty
// string (whitespace-only or non-string is treated as missing, so the gate
// flags it and the sync repairs it).
export const hasTranslation = (v) => typeof v === "string" && v.trim() !== "";

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
  // SUBSTRINGS, not whole labels, per the conservative rule above: these appear
  // inside labels whose remainder is descriptive and SHOULD stay localised —
  // "BTCPayServer Zcash Plugin" (plugin), "Fork zechub-wiki" (fork). Listing the
  // name alone keeps the name verbatim without flattening the whole label to
  // English, exactly as "Raspberry Pi" does above.
  "BTCPayServer", "zechub", "zechub-wiki",
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

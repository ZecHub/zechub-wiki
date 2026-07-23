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
]);

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

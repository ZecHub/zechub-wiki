// Menu-label coverage gate (secretless — no translation, no network).
//
// Fails a PR when an editorial menu change (new/renamed nav or coin item) leaves
// a label untranslated in some locale — so a menu change can't merge
// half-translated. It IMPORTS the menu modules to read the English label set
// (never regex) and verifies each canonical locale's dictionary covers it.
//
// Scope: nav + coin ITEM labels (dictionaries menuLabels / exploreMenu). It does
// NOT police runtime folder-derived SideMenu section headers (those aren't
// statically enumerable) — that gap closes only with the deferred labelKey
// refactor. Brand/product names are exempt from coverage but must be verbatim.
//
// The complementary fill step is the operator-side C2 sync routine.
// Run: node_modules/.bin/tsx scripts/check-menu-labels.mjs

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { extractMenuLabels, MENU_BRANDS, CANONICAL_LOCALES, hasTranslation } from "./lib/menu-source.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { navLabels, coinLabels } = await extractMenuLabels(root);

// Sanity floor: if a menu refactor (e.g. `name` -> `title`) makes extraction
// return almost nothing, the gate would "pass" with 0 labels checked. Refuse.
if (navLabels.size < 20 || coinLabels.size < 5) {
  console.error(
    `Menu-label extraction returned too few labels (nav=${navLabels.size}, coin=${coinLabels.size}) — the menu structure may have changed. Refusing to pass.`,
  );
  process.exit(1);
}

let problems = 0; // hard failures: untranslated non-brand labels, missing dicts
let warnings = 0; // advisory: brand non-verbatim value, or a label left === English
const detail = [];
for (const loc of CANONICAL_LOCALES) {
  const dictPath = join(root, "dictionaries", `${loc}.json`);
  if (!existsSync(dictPath)) {
    // A canonical (routed) locale with no dictionary is a hard failure — the
    // gate must not silently shrink coverage by looking only at files present.
    detail.push({ loc, fatal: "dictionary missing" });
    problems += 1;
    continue;
  }
  const dict = JSON.parse(readFileSync(dictPath, "utf8"));
  const ml = dict.menuLabels ?? {};
  const em = dict.exploreMenu ?? {};
  const missNav = [], missCoin = [], badBrand = [], selfEqual = [];
  const audit = (labels, section, sectionName) => {
    for (const l of labels) {
      const v = section[l];
      if (MENU_BRANDS.has(l)) {
        // brands: OK if absent (English fallback) or an exact self-map; a real
        // translation of a brand is wrong.
        if (v !== undefined && v !== l) badBrand.push(`${sectionName}:"${l}"="${v}"`);
      } else if (!hasTranslation(v)) {
        (sectionName === "menuLabels" ? missNav : missCoin).push(l);
      } else if (v.trim() === l.trim()) {
        // Present but byte-identical to the English label. Often a legitimate
        // proper noun, but also the signature of an untranslated-verbatim paste —
        // the "half-translated menu that merges green" gap. Advisory (many labels
        // are legitimately identical); promote to hard-fail only with a curated
        // INVARIANT_LABELS allowlist to avoid false-failing genuine proper nouns.
        selfEqual.push(`${sectionName}:"${l}"`);
      }
    }
  };
  audit(navLabels, ml, "menuLabels");
  audit(coinLabels, em, "exploreMenu");
  if (missNav.length || missCoin.length || badBrand.length || selfEqual.length) {
    problems += missNav.length + missCoin.length;
    warnings += badBrand.length + selfEqual.length;
    detail.push({ loc, missNav, missCoin, badBrand, selfEqual });
  }
}

if (problems === 0) {
  console.log(`Menu-label coverage OK — ${navLabels.size} nav + ${coinLabels.size} coin labels across ${CANONICAL_LOCALES.length} locales.` + (warnings ? ` (${warnings} brand-verbatim warning(s) — advisory)` : ""));
  // Print advisory warnings (brand-verbatim + label-left-as-English) but do not fail on them.
  for (const d of detail) {
    for (const b of d.badBrand ?? []) console.warn(`  warning ${d.loc}: brand should be verbatim: ${b}`);
    for (const s of d.selfEqual ?? []) console.warn(`  warning ${d.loc}: label identical to English (untranslated?): ${s}`);
  }
  process.exit(0);
}
console.error(`Menu-label coverage FAILED — ${problems} untranslated label(s)${warnings ? ` (+${warnings} brand warning(s))` : ""}. Run the C2 menu-label sync to fill.`);
for (const d of detail) {
  console.error(`  ${d.loc}:`);
  if (d.fatal) { console.error(`    ${d.fatal}`); continue; }
  for (const l of d.missNav) console.error(`    menuLabels: "${l}" (untranslated)`);
  for (const l of d.missCoin) console.error(`    exploreMenu: "${l}" (untranslated)`);
  for (const b of d.badBrand) console.error(`    brand should be verbatim: ${b}`);
  for (const s of d.selfEqual ?? []) console.warn(`    advisory — label identical to English (untranslated?): ${s}`);
}
process.exit(1);

// Dictionary-key coverage REPORT (secretless — no translation, no network).
//
// Reports, per locale, which dictionary keys are missing against
// dictionaries/en.json, which are left over from an English rename, and which
// exist on both sides but cannot be used interchangeably (type, array length,
// empty string). It does NOT fail the build: a missing key falls back to
// English at runtime, so it is a backlog item, not a broken tree.
//
// Why this exists alongside scripts/check-menu-labels.mjs: that gate covers the
// two MENU namespaces (menuLabels, exploreMenu) and hard-fails on them. Every
// other namespace — pages, navigation, home, footer, visualizer, wallets, … —
// had no coverage at all, so English keys could be added and simply never
// reach any locale. Those namespaces are what this report watches; the menu
// namespaces are excluded and left to the gate that owns them.
//
// Run: node_modules/.bin/tsx scripts/check-dictionary-keys.mjs
//   yarn check:dictionaries          # same thing
//   yarn check:dictionaries --json   # machine-readable, for tooling
//   yarn check:dictionaries --strict # exit 1 on any gap (NOT used by CI)

import { appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  CANONICAL_LOCALES,
  compareAgainstEnglish,
  contentKeys,
  flattenDictionary,
  menuKeyCount,
  readDictionary,
} from "./lib/dictionary-keys.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const asJson = args.has("--json");
const strict = args.has("--strict");

const english = readDictionary(root, "en");
if (english === null) {
  // en.json is the canonical key set; without it there is nothing to compare
  // against and a silent "0 problems" would be a lie.
  console.error("dictionaries/en.json not found — nothing to compare against.");
  process.exit(1);
}

const englishLeaves = flattenDictionary(english);
const englishContent = contentKeys(englishLeaves);

const locales = [];
for (const locale of CANONICAL_LOCALES) {
  const dict = readDictionary(root, locale);
  if (dict === null) {
    locales.push({ locale, absent: true });
    continue;
  }
  const leaves = flattenDictionary(dict);
  locales.push({
    locale,
    absent: false,
    menuKeys: menuKeyCount(leaves),
    ...compareAgainstEnglish(englishContent, contentKeys(leaves)),
  });
}

const present = locales.filter((l) => !l.absent);
const absent = locales.filter((l) => l.absent);

// A key missing from EVERY locale is the actionable case: an English key that
// was added and never propagated. One line for the set beats the same list
// repeated 18 times.
const missingEverywhere = present.length
  ? [...englishContent.keys()]
      .filter((k) => present.every((l) => l.missing.includes(k)))
      .sort()
  : [];
const missingEverywhereSet = new Set(missingEverywhere);

const totals = {
  englishContentKeys: englishContent.size,
  locales: present.length,
  localesWithoutDictionary: absent.length,
  missingEverywhere: missingEverywhere.length,
  missing: present.reduce((n, l) => n + l.missing.length, 0),
  extra: present.reduce((n, l) => n + l.extra.length, 0),
  shape: present.reduce((n, l) => n + l.shape.length, 0),
};

if (asJson) {
  console.log(
    JSON.stringify({ totals, missingEverywhere, locales }, null, 2),
  );
} else {
  console.log(
    `Dictionary-key report — ${totals.englishContentKeys} English content keys across ${totals.locales} locale(s).`,
  );
  console.log(
    `  menuLabels / exploreMenu are excluded here; scripts/check-menu-labels.mjs gates those.\n`,
  );

  for (const l of absent)
    console.log(`${l.locale}: NO DICTIONARY — dictionaries/${l.locale}.json is missing.`);
  if (absent.length) console.log("");

  if (missingEverywhere.length) {
    console.log(
      `Missing from ALL ${totals.locales} locales (${missingEverywhere.length}) — English keys that never propagated:`,
    );
    for (const k of missingEverywhere) console.log(`  ${k}`);
    console.log("");
  }

  for (const l of present) {
    const only = l.missing.filter((k) => !missingEverywhereSet.has(k));
    const parts = [
      `missing ${l.missing.length}`,
      `extra ${l.extra.length}`,
      `shape ${l.shape.length}`,
    ];
    console.log(`${l.locale.padEnd(3)} ${parts.join("  ")}   (menu keys: ${l.menuKeys})`);
    for (const k of only) console.log(`      missing: ${k}`);
    for (const k of l.extra) console.log(`      extra:   ${k} (not in en.json)`);
    for (const s of l.shape) console.log(`      shape:   ${s.key} — ${s.detail}`);
  }

  console.log(
    `\nTotals: ${totals.missing} missing, ${totals.extra} extra, ${totals.shape} shape issue(s).`,
  );
  if (missingEverywhere.length)
    console.log(
      `${missingEverywhere.length} key(s) are missing from every locale — those are listed once above, not per locale.`,
    );
  console.log("Report only — this check does not fail the build.");
}

// GitHub Actions job summary: the per-locale table lands on the run page, so a
// reviewer sees the state without opening the log.
if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = [
    "## Dictionary-key report",
    "",
    `${totals.englishContentKeys} English content keys · ${totals.locales} locales · report only (does not fail the build).`,
    "",
    "| Locale | Missing | Extra | Shape |",
    "| --- | ---: | ---: | ---: |",
    ...present.map(
      (l) => `| ${l.locale} | ${l.missing.length} | ${l.extra.length} | ${l.shape.length} |`,
    ),
    ...absent.map((l) => `| ${l.locale} | — | — | no dictionary |`),
    "",
  ];
  if (missingEverywhere.length) {
    rows.push(
      `### Missing from all ${totals.locales} locales (${missingEverywhere.length})`,
      "",
      ...missingEverywhere.map((k) => `- \`${k}\``),
      "",
    );
  }
  rows.push("Menu namespaces are gated separately by `scripts/check-menu-labels.mjs`.", "");
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, rows.join("\n"));
}

// Default exit is always 0 — this is a report. `--strict` is for a maintainer
// who wants a local non-zero exit; the workflow does not pass it.
if (strict && (totals.missing || totals.extra || totals.shape || absent.length))
  process.exit(1);
process.exit(0);

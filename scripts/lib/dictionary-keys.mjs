// Shared dictionary-key comparison logic, used by the report-only CI check
// (scripts/check-dictionary-keys.mjs). Kept in scripts/lib/ next to
// menu-source.mjs so the locale list has ONE definition — the menu gate and
// this report must never disagree about which locales ship.
//
// What this module knows and the menu gate does not: en.json is the canonical
// key set for every *content* namespace (translation-guide invariant 4,
// "Dictionary keys are append-only and English-complete"), so a key present in
// en.json and absent from a locale is a real gap, and a key present in a locale
// and absent from en.json is a leftover from an English rename.
//
// The two MENU namespaces are the exception and are excluded here — see
// MENU_NAMESPACES below.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export { CANONICAL_LOCALES, hasTranslation } from "./menu-source.mjs";

// `menuLabels` and `exploreMenu` are keyed by the ENGLISH MENU LABEL, not by a
// content key, and their source of truth is src/constants/navigation.ts +
// explore-menu.ts — not en.json. en.json carries only a self-map of the labels
// it happens to know about, so comparing a locale's menu namespace against
// en.json reports dozens of phantom "extra" keys for menu items that simply
// have not been added to the English self-map.
//
// scripts/check-menu-labels.mjs already gates those namespaces against the menu
// modules. This report counts them and points there instead of duplicating
// (and contradicting) that gate.
export const MENU_NAMESPACES = ["menuLabels", "exploreMenu"];

const isPlainObject = (v) =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Flatten a dictionary into dotted key -> leaf value.
 *
 * A leaf is any non-object: a string (the normal case) or an array (used by
 * dao.beliefs, dao.features, components.aiAssistant.quickQuestions). Arrays are
 * kept whole rather than indexed, so a translated list is one key whose LENGTH
 * can be compared instead of N keys that drift on every edit.
 */
export function flattenDictionary(value, prefix = "", out = new Map()) {
  for (const [key, v] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(v)) flattenDictionary(v, path, out);
    else out.set(path, v);
  }
  return out;
}

/** Drop the menu namespaces, which en.json does not own. */
export function contentKeys(leaves) {
  const out = new Map();
  for (const [k, v] of leaves) {
    if (!MENU_NAMESPACES.some((ns) => k === ns || k.startsWith(`${ns}.`)))
      out.set(k, v);
  }
  return out;
}

const typeName = (v) => (Array.isArray(v) ? "array" : typeof v);

/** Every proper prefix of every key: "a.b.c" contributes "a" and "a.b". */
function ancestorSet(keys) {
  const out = new Set();
  for (const key of keys) {
    const parts = key.split(".");
    for (let i = 1; i < parts.length; i += 1)
      out.add(parts.slice(0, i).join("."));
  }
  return out;
}

/** The nearest ancestor of `key` that is a leaf in `leaves`, or undefined. */
function leafAncestor(key, leaves) {
  const parts = key.split(".");
  for (let i = parts.length - 1; i >= 1; i -= 1) {
    const candidate = parts.slice(0, i).join(".");
    if (leaves.has(candidate)) return candidate;
  }
  return undefined;
}

/**
 * Compare one locale's leaves against English.
 *
 * missing  — in en.json, not in this locale. Renders as English at runtime
 *            (dictionaries are seeded server-side and fall back per key), so it
 *            is invisible in review: the page still builds and still reads.
 * extra    — in this locale, not in en.json. Dead weight left by an English
 *            rename or removal; nothing reads it.
 * shape    — the key exists on both sides but cannot be used interchangeably:
 *            different leaf type, mismatched array length, an empty string, or
 *            an object on one side and a leaf on the other.
 */
export function compareAgainstEnglish(enLeaves, localeLeaves) {
  const missing = [];
  const extra = [];
  const shape = [];

  const englishAncestors = ancestorSet(enLeaves.keys());
  const localeAncestors = ancestorSet(localeLeaves.keys());

  for (const [key, enValue] of enLeaves) {
    if (!localeLeaves.has(key)) {
      // The key exists on both sides at different depths. Two mirror cases,
      // each named once on the key where the structures diverge rather than
      // once per child (which would list the whole subtree as "missing").
      if (localeAncestors.has(key)) {
        shape.push({ key, detail: "object in this locale, leaf in en.json" });
        continue;
      }
      const collapsedTo = leafAncestor(key, localeLeaves);
      if (collapsedTo !== undefined) {
        shape.push({
          key: collapsedTo,
          detail: "leaf in this locale, object in en.json",
        });
        continue;
      }
      missing.push(key);
      continue;
    }

    const value = localeLeaves.get(key);
    if (typeName(value) !== typeName(enValue))
      shape.push({
        key,
        detail: `${typeName(value)} here, ${typeName(enValue)} in en.json`,
      });
    else if (Array.isArray(enValue) && value.length !== enValue.length)
      shape.push({
        key,
        detail: `array of ${value.length}, en.json has ${enValue.length}`,
      });
    else if (typeof value === "string" && value.trim() === "")
      shape.push({ key, detail: "empty string" });
  }

  for (const key of localeLeaves.keys()) {
    if (enLeaves.has(key)) continue;
    // Both divergence cases above are already reported against the English
    // key; don't also count the locale side as a leftover key.
    if (englishAncestors.has(key)) continue;
    if (leafAncestor(key, enLeaves) !== undefined) continue;
    extra.push(key);
  }

  // A collapse fires once per English child key; report it once per key.
  const seen = new Set();
  const shapeUnique = shape.filter(({ key, detail }) => {
    const id = `${key}\u0000${detail}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  return {
    missing: missing.sort(),
    extra: extra.sort(),
    shape: shapeUnique.sort((a, b) => a.key.localeCompare(b.key)),
  };
}

/** Read and parse one dictionary. Returns null when the file is absent. */
export function readDictionary(root, locale) {
  const path = join(root, "dictionaries", `${locale}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}

/** Count the menu-namespace keys, reported as a pointer to the menu gate. */
export function menuKeyCount(leaves) {
  let n = 0;
  for (const k of leaves.keys())
    if (MENU_NAMESPACES.some((ns) => k === ns || k.startsWith(`${ns}.`))) n += 1;
  return n;
}

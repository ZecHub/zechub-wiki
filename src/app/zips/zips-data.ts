/**
 * Helpers and constants used by the ZIP tracker UI.
 *
 * The ZIP list itself is no longer hardcoded here — it's fetched live
 * from github.com/zcash/zips at request time (see lib/load-zips.ts).
 */

import type { ZipStatus } from "./types";

export const STATUS_ORDER: ZipStatus[] = [
  "Reserved",
  "Draft",
  "Proposed",
  "Active",
  "Final",
  "Withdrawn",
  "Obsolete",
];

export const LIFECYCLE: ZipStatus[] = ["Reserved", "Draft", "Proposed", "Final"];

export function fmtZipNum(n: number): string {
  if (n < 1000) return String(n).padStart(4, "0");
  return String(n);
}

export function zipUrl(n: number): string {
  return `https://zips.z.cash/zip-${String(n).padStart(4, "0")}`;
}

export function zipGithubUrl(n: number): string {
  return `https://github.com/zcash/zips/blob/main/zips/zip-${String(n).padStart(4, "0")}.rst`;
}

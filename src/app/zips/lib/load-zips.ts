import "server-only";
import type { Zip } from "../types";
import { parseZipsIndex } from "./parse-zips-index";
import { SUMMARIES } from "./zip-overlay";
import { FALLBACK_ZIPS } from "./fallback";

// Canonical rendered index. Generated from each ZIP's frontmatter on
// every commit to zcash/zips, so it's always in sync with what's been
// merged. The upstream README.template no longer carries the table.
const SOURCE_URL = "https://zips.z.cash/";

const REVALIDATE_SECONDS = 3600; // 1 hour

export type LoadSource = "live" | "fallback";

export interface LoadResult {
  zips: Zip[];
  lastSyncedAt: string; 
  source: LoadSource;
}

/**
 * Fetch the canonical zcash/zips README at request time and parse it.
 */
export async function loadZips(): Promise<LoadResult> {
  try {
    const res = await fetch(SOURCE_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { "User-Agent": "zechub-zip-tracker" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const parsed = parseZipsIndex(html);

    if (parsed.length < 80) {
      throw new Error(`parsed only ${parsed.length} ZIPs from upstream — refusing to overwrite`);
    }

    // console.log(
    //   `[zips] live fetch OK — ${parsed.length} ZIPs from ${html.length}-byte index`
    // );

    return {
      zips: enrich(parsed),
      lastSyncedAt: new Date().toISOString(),
      source: "live",
    };
  } catch (err) {
    // console.error("[zips] live fetch FAILED, serving fallback snapshot:", err);
    return {
      zips: enrich(FALLBACK_ZIPS),
      lastSyncedAt: new Date().toISOString(),
      source: "fallback",
    };
  }
}

function enrich(zips: Zip[]): Zip[] {
  return zips.map((z) => ({
    ...z,
    summary: SUMMARIES[z.num] ?? z.summary ?? null,
  }));
}

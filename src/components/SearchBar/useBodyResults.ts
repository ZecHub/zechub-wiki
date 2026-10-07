"use client";

/**
 * Pages whose body matches the query but whose title does not.
 *
 * The existing search ranks titles, paths and the curated descriptions and
 * aliases in src/constants/searcher.ts. It covers every page in every locale,
 * so a reader who knows a page's title finds it. A reader who knows a phrase
 * from inside the page does not: "FlyClient" is a heading on the Heartwood
 * article and returns nothing today.
 *
 * This hook fills that gap and nothing else. It returns only pages that
 * searchWiki did not already return, and the caller appends them below the
 * existing results. Nothing is reordered, so no query that works today can
 * come back different tomorrow.
 *
 * The index is fetched on the first query, not imported, so it stays out of
 * the initial bundle and a reader who never opens search never downloads it.
 * One locale is loaded, never all nineteen. If the file is missing — the
 * build is allowed to skip generating it — this returns nothing and search
 * behaves exactly as it does now.
 */

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { loadIndex, search, type SearchIndex } from "@/lib/search/client";
import type { Searcher } from "@/types";

/** Appended below the title results, so the fold still belongs to them. */
const MAX_BODY_RESULTS = 8;

/** Compare by path, ignoring any origin or locale prefix. */
function pathKey(url: string): string {
  return url
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/[a-z]{2}(?:-[a-z]{2})?(?=\/)/i, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

export function useBodyResults(
  query: string,
  alreadyShown: readonly Searcher[],
): Searcher[] {
  const locale = useLocale();
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!query || requested) return;
    setRequested(true);
    let live = true;
    loadIndex(locale).then((loaded) => {
      if (live) setIndex(loaded);
    });
    return () => {
      live = false;
    };
  }, [query, requested, locale]);

  return useMemo(() => {
    if (!index || !query) return [];
    const seen = new Set(alreadyShown.map((item) => pathKey(item.url)));
    const out: Searcher[] = [];
    for (const hit of search(index, query, MAX_BODY_RESULTS * 3)) {
      if (seen.has(pathKey(hit.url))) continue;
      seen.add(pathKey(hit.url));
      out.push({ name: hit.title, desc: hit.snippet, url: hit.url });
      if (out.length >= MAX_BODY_RESULTS) break;
    }
    return out;
  }, [index, query, alreadyShown]);
}

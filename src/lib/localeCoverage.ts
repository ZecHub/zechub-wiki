import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { getMenuTitlesCached } from "@/lib/authAndFetch";
import { keyToWikiPath } from "@/lib/wikiPaths";

export { keyToWikiPath };

// Canonical origin. Matches src/lib/helpers.ts `metadataBase` and the sitemap's
// URL construction. English is served unprefixed at the root; other locales
// carry a `/<locale>` prefix (routing.localePrefix is "as-needed").
export const BASE_URL = "https://zechub.wiki";

// The RSS feed alternate the locale layout declares via `alternates.types`
// (src/app/[locale]/layout.tsx). A page's own `alternates` object shallow-
// REPLACES the layout's `alternates.types` under Next's per-key metadata merge,
// which would drop the metadata-level `application/rss+xml` <link>. Every page
// that emits `alternates` re-carries this so the feed alternate survives. URL +
// title MUST match the layout's declaration exactly.
const RSS_ALTERNATE_TYPES = {
  "application/rss+xml": [
    { url: `${BASE_URL}/rss.xml`, title: "ZecHub Dashboard Updates" },
  ],
};

/**
 * Absolute URL for a page path in a given locale. English (defaultLocale) is
 * unprefixed; every other locale gets the `/<locale>` prefix. Shared by
 * src/app/sitemap.ts and buildAlternates so the two can never drift on URL
 * shape.
 */
export const toWikiUrl = (locale: string, path: string): string => {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale
    ? `${BASE_URL}${clean}`
    : `${BASE_URL}/${locale}${clean}`;
};

/**
 * Convert a menu-titles manifest key into the wiki URL path the app serves it
 * at. Re-exported from the dependency-free wikiPaths module so the sitemap,
 * locale coverage and server-built search index cannot drift on route shape.
 */

// Normalize an arbitrary wiki path to the lowercase, single-leading-slash,
// no-trailing-slash form that keyToWikiPath emits, so path comparisons match.
const normalizeWikiPath = (path: string): string => {
  if (path === "/") return "/";
  const p = "/" + path.replace(/^\/+/, "").replace(/\/+$/, "");
  return p.toLowerCase();
};

/**
 * Which locales genuinely carry a given wiki path, using the SAME menu-titles
 * manifests + keyToWikiPath mapping the sitemap uses for its per-page hreflang
 * coverage (so head-level alternates and the sitemap can't disagree about which
 * pages are translated).
 *
 * A locale "covers" the path when its manifest has any key that maps to that
 * path. English is guaranteed to appear whenever the page exists in any locale
 * (it is the canonical/x-default anchor). Uses the cached manifest fetch, so
 * the per-request cost is a set of cache reads. NEVER throws — degrades to
 * English-only on any failure, so it is safe to call from generateMetadata.
 */
export async function localesForPath(path: string): Promise<string[]> {
  const target = normalizeWikiPath(path);
  try {
    const manifests = await Promise.all(
      routing.locales.map(
        async (locale) =>
          [
            locale,
            await getMenuTitlesCached(locale).catch(
              (): Record<string, string> => ({}),
            ),
          ] as const,
      ),
    );
    const covered: string[] = [];
    for (const [locale, titles] of manifests) {
      if (Object.keys(titles).some((k) => keyToWikiPath(k) === target)) {
        covered.push(locale);
      }
    }
    // Defensive: if the page resolved in some locale but the EN manifest lookup
    // missed, still anchor the alternate set on English.
    if (covered.length > 0 && !covered.includes(routing.defaultLocale)) {
      covered.unshift(routing.defaultLocale);
    }
    return covered.length > 0 ? covered : [routing.defaultLocale];
  } catch {
    return [routing.defaultLocale];
  }
}

/**
 * Build the head-level `alternates` for a page: a locale-aware self canonical
 * plus, when the page exists in more than one locale, a reciprocal hreflang
 * `languages` map (every available locale + an `x-default` pointing at the
 * English URL). Mirrors the sitemap's reciprocal-hreflang treatment.
 *
 * `path`            — the bare wiki path (no locale prefix), e.g. "/using-zcash".
 * `currentLocale`   — the locale being rendered; drives the canonical URL.
 * `availableLocales`— which locales carry this page (from localesForPath, or an
 *                     explicit list for non-manifest routes like the homepage).
 *
 * A single-locale (English-only) page gets a canonical only — a lone `{ en }`
 * languages map would just repeat the canonical as a duplicate, exactly as the
 * sitemap omits alternates for English-only entries. Pure + never throws.
 */
export function buildAlternates(
  path: string,
  currentLocale: string,
  availableLocales: string[],
): Metadata["alternates"] {
  const normalized = normalizeWikiPath(path);
  const canonical = toWikiUrl(currentLocale, normalized);

  // Keep only locales the app actually ships, preserving input order.
  const shipped = routing.locales as readonly string[];
  const locales = availableLocales.filter((l) => shipped.includes(l));

  if (locales.length <= 1) {
    return { canonical, types: RSS_ALTERNATE_TYPES };
  }

  const languages: Record<string, string> = {};
  for (const loc of locales) languages[loc] = toWikiUrl(loc, normalized);
  languages["x-default"] =
    languages[routing.defaultLocale] ?? toWikiUrl(routing.defaultLocale, normalized);

  return { canonical, languages, types: RSS_ALTERNATE_TYPES };
}

/** Static app routes that render for every shipped locale. */
export function buildAlternatesAllLocales(
  path: string,
  currentLocale: string,
): Metadata["alternates"] {
  return buildAlternates(path, currentLocale, [...routing.locales]);
}

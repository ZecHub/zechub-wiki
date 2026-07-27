import type { MetadataRoute } from "next";

import { SITE_LINKS } from "@/constants/siteLinks";
import { routing } from "@/i18n/routing";
import { getMenuTitlesCached } from "@/lib/authAndFetch";
import { keyToWikiPath, toWikiUrl as toUrl } from "@/lib/localeCoverage";

// keyToWikiPath / toUrl are shared with head-level hreflang alternates
// (src/lib/localeCoverage.ts) so the sitemap's per-page locale coverage and the
// pages' <link rel="alternate"> can never drift on either URL shape or path
// derivation. keyToWikiPath is the proven inverse of `derivePageTitleKey` in
// src/components/Sitemap/Sitemap.tsx.

// The DAO section is deliberately kept out of both robots.txt and the sitemap.
const isExcluded = (path: string): boolean =>
  path === "/dao" || path.startsWith("/dao/");

// Normalize a SITE_LINKS href to a clean internal path, or null if it is
// external (absolute URL or opens in a new tab).
const normalizeInternalPath = (href: string, target?: string): string | null => {
  if (target === "_blank") return null;
  if (!href.startsWith("/")) return null;
  const trimmed = href.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
};

// The top-level app / bespoke routes (home, /wallets, /developers, …) plus the
// wiki-content links, harvested from SITE_LINKS. Content pages that also live in
// the menu-titles manifest are de-duplicated by the caller (manifest wins, so
// they keep their hreflang alternates); the remainder are English-only app
// routes.
const collectSiteLinkPaths = (): string[] => {
  const paths = new Set<string>();
  const addLink = (href: string, target?: string) => {
    const p = normalizeInternalPath(href, target);
    if (p) paths.add(p);
  };
  for (const section of SITE_LINKS) {
    const buckets = [
      section.links,
      ...(section.subsections?.map((s) => s.links) ?? []),
    ];
    for (const bucket of buckets) {
      for (const link of bucket) {
        addLink(link.href, link.target);
        for (const child of link.children ?? []) addLink(child.href, child.target);
      }
    }
  }
  return [...paths];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A single build-time timestamp. Per-page commit dates aren't cheaply
  // available from the manifests, and stamping every URL with the same build
  // date is a widely-accepted sitemap convention.
  const lastModified = new Date();

  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const pushEntry = (path: string, languages?: Record<string, string>) => {
    // De-dup case-insensitively: `/zcash-organizations/ZODL` (SITE_LINKS) and
    // `/zcash-organizations/zodl` (manifest) resolve to identical content, so
    // only the first-seen form survives. The manifest loop runs before the
    // SITE_LINKS loop, so the lowercase/manifest form always wins.
    const seenKey = path.toLowerCase();
    if (isExcluded(path) || seen.has(seenKey)) return;
    seen.add(seenKey);

    // Multi-locale page: Google requires *reciprocal* hreflang — every language
    // version must have its own <url> that repeats the FULL alternate set (a
    // page whose alternates don't point back at it is dropped as "no return
    // tags"). So emit one <url> per available locale, each carrying the same
    // `languages` map plus an `x-default` pointing at the English URL.
    if (languages && Object.keys(languages).length > 1) {
      const alternates: Record<string, string> = {
        ...languages,
        "x-default": languages.en ?? toUrl(routing.defaultLocale, path),
      };
      for (const loc of Object.keys(languages)) {
        entries.push({
          url: languages[loc],
          lastModified,
          alternates: { languages: alternates },
        });
      }
      return;
    }

    // English-only page: a single <url>, no alternates (a lone `{ en }` map
    // would just repeat the canonical URL as a duplicate).
    entries.push({
      url: toUrl(routing.defaultLocale, path),
      lastModified,
    });
  };

  // Homepage always ships first. Localized homepages render for every locale
  // (verified `/it` serves), so give it the same reciprocal treatment as any
  // other translated page: one <url> per locale + a full alternate set.
  const homeLanguages: Record<string, string> = {};
  for (const locale of routing.locales) homeLanguages[locale] = toUrl(locale, "/");
  pushEntry("/", homeLanguages);

  let manifestPageCount = 0;
  try {
    // The English manifest is the authoritative full page list.
    const enTitles = await getMenuTitlesCached("en");
    const enKeys = Object.keys(enTitles);

    // Sanity guard: if GitHub creds ARE configured, a healthy English manifest
    // should carry well over 100 pages. A handful (but non-empty) almost always
    // means a partial/failed fetch — a silently degraded sitemap. Don't throw
    // (the SITE_LINKS + English fallback is intentional); just make it loud.
    const credsPresent = Boolean(
      process.env.OWNER && process.env.REPO && process.env.BRANCH,
    );
    if (credsPresent && enKeys.length > 0 && enKeys.length < 50) {
      console.warn(
        `[sitemap] WARNING: only ${enKeys.length} manifest pages despite GitHub creds — manifest fetch may have failed; sitemap is degraded.`,
      );
    }

    if (enKeys.length === 0) {
      console.warn(
        "[sitemap] English menu-titles manifest is empty (no creds or fetch failed) — falling back to SITE_LINKS + English only.",
      );
    } else {
      // Fetch every other locale's manifest so we can compute per-page hreflang
      // coverage. getMenuTitlesCached never throws (returns {} on any error);
      // the extra .catch is belt-and-braces so one bad locale can't abort the
      // sitemap.
      const otherLocales = routing.locales.filter(
        (l) => l !== routing.defaultLocale,
      );
      const localeManifests = await Promise.all(
        otherLocales.map(
          async (locale) =>
            [
              locale,
              await getMenuTitlesCached(locale).catch(
                (): Record<string, string> => ({}),
              ),
            ] as const,
        ),
      );

      for (const key of enKeys) {
        const path = keyToWikiPath(key);
        if (isExcluded(path)) continue;
        // English is always the canonical entry; add a hreflang alternate for
        // every locale whose manifest actually carries this page.
        const languages: Record<string, string> = { en: toUrl("en", path) };
        for (const [locale, titles] of localeManifests) {
          if (titles[key]) languages[locale] = toUrl(locale, path);
        }
        pushEntry(path, languages);
        manifestPageCount++;
      }
    }
  } catch (err) {
    // A sitemap route must never throw — a throw yields a broken/empty
    // /sitemap.xml at build or request time. Degrade to SITE_LINKS + English.
    console.error(
      "[sitemap] manifest-driven generation failed; using SITE_LINKS + English fallback:",
      err,
    );
  }

  // App / bespoke routes (and any content links not covered by the manifest).
  // These are English-only in the sitemap — the menu-titles manifest is the
  // single source of truth for which pages are genuinely translated.
  let siteLinkCount = 0;
  for (const path of collectSiteLinkPaths()) {
    if (!seen.has(path) && !isExcluded(path)) {
      pushEntry(path);
      siteLinkCount++;
    }
  }

  console.log(
    `[sitemap] generated ${entries.length} urls (manifest pages: ${manifestPageCount}, site-links: ${siteLinkCount}).`,
  );

  return entries;
}

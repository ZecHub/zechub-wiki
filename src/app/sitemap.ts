import type { MetadataRoute } from "next";

import { SITE_LINKS } from "@/constants/siteLinks";
import { routing } from "@/i18n/routing";
import { getMenuTitlesCached } from "@/lib/authAndFetch";
import { keyToWikiPath, toWikiUrl as toUrl } from "@/lib/localeCoverage";

// keyToWikiPath / toUrl are shared with head-level hreflang alternates
// (src/lib/localeCoverage.ts) so the sitemap's per-page locale coverage and the
// pages' <link rel="alternate"> can never drift on either URL shape or path
// derivation.

// The DAO section is deliberately kept out of both robots.txt and the sitemap.
const isExcluded = (path: string): boolean =>
  path === "/dao" || path.startsWith("/dao/");

// Normalize a SITE_LINKS href to a clean internal path, or null if it is
// external (absolute URL or opens in a new tab).
const normalizeInternalPath = (
  href: string,
  target?: string,
): string | null => {
  if (target === "_blank") return null;
  if (!href.startsWith("/")) return null;

  const trimmed = href.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
};

// Explicitly include important application/global routes that may not appear
// in the menu-titles manifest or SITE_LINKS.
const GLOBAL_ROUTES = [
  "/privacy",
  "/brand",
  "/zcash-community/community-projects",
  "/using-zcash/blockchain-explorers",
];

// Top-level app / bespoke routes plus wiki-content links harvested from
// SITE_LINKS.
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

        for (const child of link.children ?? []) {
          addLink(child.href, child.target);
        }
      }
    }
  }

  return [...paths];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A single build-time timestamp.
  const lastModified = new Date();

  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const pushEntry = (
    path: string,
    languages?: Record<string, string>,
  ) => {
    const seenKey = path.toLowerCase();

    if (isExcluded(path) || seen.has(seenKey)) return;

    seen.add(seenKey);

    // Multi-locale page:
    // Emit one <url> per available locale and include the complete reciprocal
    // hreflang set on every version.
    if (languages && Object.keys(languages).length > 1) {
      const alternates: Record<string, string> = {
        ...languages,
        "x-default":
          languages.en ?? toUrl(routing.defaultLocale, path),
      };

      for (const loc of Object.keys(languages)) {
        entries.push({
          url: languages[loc],
          lastModified,
          alternates: {
            languages: alternates,
          },
        });
      }

      return;
    }

    // English-only page.
    entries.push({
      url: toUrl(routing.defaultLocale, path),
      lastModified,
    });
  };

  /*
   * --------------------------------------------------------------------------
   * HOMEPAGE
   * --------------------------------------------------------------------------
   */

  const homeLanguages: Record<string, string> = {};

  for (const locale of routing.locales) {
    homeLanguages[locale] = toUrl(locale, "/");
  }

  pushEntry("/", homeLanguages);

  /*
   * --------------------------------------------------------------------------
   * GLOBAL / BESPOKE ROUTES
   * --------------------------------------------------------------------------
   *
   * These routes are not necessarily represented in the wiki manifest.
   * Keep them explicitly listed so important pages such as privacy, brand,
   * community projects and blockchain explorers cannot disappear from the
   * sitemap.
   */

  for (const path of GLOBAL_ROUTES) {
    pushEntry(path);
  }

  /*
   * --------------------------------------------------------------------------
   * ENGLISH WIKI MANIFEST + LOCALE COVERAGE
   * --------------------------------------------------------------------------
   */

  let manifestPageCount = 0;

  try {
    // The English manifest is the authoritative full page list.
    const enTitles = await getMenuTitlesCached("en");
    const enKeys = Object.keys(enTitles);

    const credsPresent = Boolean(
      process.env.OWNER &&
        process.env.REPO &&
        process.env.BRANCH,
    );

    if (
      credsPresent &&
      enKeys.length > 0 &&
      enKeys.length < 50
    ) {
      console.warn(
        `[sitemap] WARNING: only ${enKeys.length} manifest pages despite GitHub creds — manifest fetch may have failed; sitemap is degraded.`,
      );
    }

    if (enKeys.length === 0) {
      console.warn(
        "[sitemap] English menu-titles manifest is empty (no creds or fetch failed) — falling back to SITE_LINKS + global routes + English only.",
      );
    } else {
      // Fetch every other locale so we can calculate actual hreflang
      // availability for each page.
      const otherLocales = routing.locales.filter(
        (locale) => locale !== routing.defaultLocale,
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

        // English is always the canonical entry.
        const languages: Record<string, string> = {
          en: toUrl("en", path),
        };

        // Only include a locale if that locale's manifest actually contains
        // the page.
        for (const [locale, titles] of localeManifests) {
          if (titles[key]) {
            languages[locale] = toUrl(locale, path);
          }
        }

        pushEntry(path, languages);
        manifestPageCount++;
      }
    }
  } catch (err) {
    // A sitemap route must never throw. Degrade gracefully to the explicit
    // routes + SITE_LINKS fallback.
    console.error(
      "[sitemap] manifest-driven generation failed; using SITE_LINKS + global routes + English fallback:",
      err,
    );
  }

  /*
   * --------------------------------------------------------------------------
   * SITE_LINKS
   * --------------------------------------------------------------------------
   *
   * Include routes from the site's navigation structure that were not already
   * discovered through the wiki manifest.
   */

  let siteLinkCount = 0;

  for (const path of collectSiteLinkPaths()) {
    const seenKey = path.toLowerCase();

    if (!seen.has(seenKey) && !isExcluded(path)) {
      pushEntry(path);
      siteLinkCount++;
    }
  }

  /*
   * --------------------------------------------------------------------------
   * FINAL LOG
   * --------------------------------------------------------------------------
   */

  console.log(
    `[sitemap] generated ${entries.length} urls (manifest pages: ${manifestPageCount}, site-links: ${siteLinkCount}, global routes: ${GLOBAL_ROUTES.length}).`,
  );

  return entries;
}

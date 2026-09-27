import type {
  ContentSectionDef,
  SiteLink,
  SiteLinkSection,
} from "@/constants/siteLinks";
import { keyToWikiPath } from "@/lib/wikiPaths";

export type MenuTitles = Record<string, string>;

type BuildSitemapSectionsOptions = {
  /** The English menu-titles manifest — the authoritative list of content routes. */
  englishTitles: MenuTitles;
  /** The active locale's manifest. Missing keys fall back to English. */
  localizedTitles?: MenuTitles;
  /** The curated sections (app routes, external links, ordering, icons). */
  staticSections: readonly SiteLinkSection[];
  /** Which manifest category belongs in which section. */
  sectionDefs: readonly ContentSectionDef[];
};

type ManifestEntry = {
  key: string;
  englishTitle: string;
  href: string;
  category: string;
};

/**
 * Normalize a route for identity comparisons: lowercase, single leading slash,
 * no trailing slash. Matches the shape `keyToWikiPath` emits so a curated href
 * like "/sitemap/" and a manifest route like "/sitemap" compare equal.
 */
const normalizePath = (href: string): string => {
  const trimmed = href.trim();
  if (!trimmed) return "";
  if (!trimmed.startsWith("/")) return "";
  const withoutTrailing = "/" + trimmed.replace(/^\/+/, "").replace(/\/+$/, "");
  return withoutTrailing.toLowerCase();
};

/** "Zcash_Tech" -> "Zcash Tech". Used to title a section for a manifest
 * category nobody has mapped yet, so new content directories surface on the
 * page instead of silently disappearing — the failure this builder exists to
 * fix. */
const humanizeCategory = (category: string): string =>
  category
    .split(/[_-]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

/**
 * Every English manifest key, resolved to the route it is served at. Keys that
 * collide on a route (or produce no usable route) are dropped, so each content
 * page is represented exactly once.
 */
const manifestEntries = (englishTitles: MenuTitles): ManifestEntry[] => {
  const byPath = new Map<string, ManifestEntry>();

  for (const [key, englishTitle] of Object.entries(englishTitles)) {
    const title = englishTitle?.trim();
    if (!title) continue;

    const href = keyToWikiPath(key);
    const path = normalizePath(href);
    const category = key.split("/")[0] ?? "";
    if (!path || !category || byPath.has(path)) continue;

    byPath.set(path, { key, englishTitle: title, href, category });
  }

  return [...byPath.values()];
};

/**
 * Build the reader-facing sitemap's sections from the curated list plus every
 * content route in the English menu-titles manifest.
 *
 * The curated sections supply ordering, icons, app routes and external links;
 * the manifest supplies coverage. A curated link that is also a manifest page
 * keeps its position and gains a `titleKey`, so it picks up the localized title
 * like any generated link. Remaining manifest pages are appended to their
 * section, sorted by title.
 *
 * Every route appears exactly once across the whole page — the first occurrence
 * in curated order wins.
 *
 * An empty English manifest returns the curated sections unchanged (still
 * de-duplicated). That is the safe production fallback: `getMenuTitlesCached`
 * resolves to `{}` when GitHub credentials are absent or the fetch fails, and
 * the page must keep rendering the curated navigation rather than collapse to
 * nothing.
 */
export function buildSitemapSections({
  englishTitles,
  localizedTitles = {},
  staticSections,
  sectionDefs,
}: BuildSitemapSectionsOptions): SiteLinkSection[] {
  const entries = manifestEntries(englishTitles);
  const entriesByPath = new Map(entries.map((e) => [normalizePath(e.href), e]));

  // Routes already placed, so nothing is listed twice.
  const seen = new Set<string>();

  const takeLink = (link: SiteLink): SiteLink | null => {
    const path = normalizePath(link.href);

    // External links and app routes that produce no comparable path (mailto:,
    // absolute URLs) are kept as-is; they cannot collide with a content route.
    if (!path) return link;
    if (seen.has(path)) return null;
    seen.add(path);

    const entry = entriesByPath.get(path);
    if (!entry) return link;

    // Curated link that is also a manifest page: keep the curated label as the
    // fallback and attach the key so the component can localize it.
    return { ...link, titleKey: entry.key };
  };

  const sections: SiteLinkSection[] = [];
  const sectionByTitle = new Map<string, SiteLinkSection>();

  for (const section of staticSections) {
    const next: SiteLinkSection = {
      ...section,
      links: section.links
        .map(takeLink)
        .filter((link): link is SiteLink => link !== null),
    };

    if (section.subsections) {
      next.subsections = section.subsections.map((subsection) => ({
        ...subsection,
        links: subsection.links
          .map(takeLink)
          .filter((link): link is SiteLink => link !== null),
      }));
    }

    sections.push(next);
    sectionByTitle.set(section.title, next);
  }

  // No manifest (no credentials, or the fetch failed) — curated navigation only.
  if (entries.length === 0) return sections;

  const sectionForCategory = new Map(
    sectionDefs.map((def) => [def.category, def] as const),
  );

  // Group the not-yet-placed manifest pages by the section they belong to,
  // preserving the order sections should appear in.
  const pending = new Map<string, { def: ContentSectionDef; links: SiteLink[] }>();

  for (const entry of entries) {
    const path = normalizePath(entry.href);
    if (seen.has(path)) continue;
    seen.add(path);

    const def = sectionForCategory.get(entry.category) ?? {
      category: entry.category,
      title: humanizeCategory(entry.category),
      icon: sectionDefs[0]?.icon,
    };

    let bucket = pending.get(def.title);
    if (!bucket) {
      bucket = { def, links: [] };
      pending.set(def.title, bucket);
    }

    bucket.links.push({
      label: entry.englishTitle,
      href: entry.href,
      titleKey: entry.key,
    });
  }

  const titleFor = (link: SiteLink) =>
    (link.titleKey && localizedTitles[link.titleKey]) || link.label;

  const byTitle = (a: SiteLink, b: SiteLink) =>
    titleFor(a).localeCompare(titleFor(b), undefined, { sensitivity: "base" });

  for (const [sectionTitle, { def, links }] of pending) {
    links.sort(byTitle);

    const existing = sectionByTitle.get(sectionTitle);
    if (existing) {
      // Curated links keep their curated order; generated ones follow.
      existing.links = [...existing.links, ...links];
      continue;
    }

    const created: SiteLinkSection = {
      title: def.title,
      icon: def.icon,
      links,
    };
    sections.push(created);
    sectionByTitle.set(sectionTitle, created);
  }

  return sections;
}

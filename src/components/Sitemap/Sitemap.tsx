"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import {
  CONTENT_SECTIONS,
  SITE_LINKS,
  type SiteLink,
} from "@/constants/siteLinks";
import { useLanguage } from "@/context/LanguageContext";
import { buildSitemapSections } from "@/lib/sitemapSections";

// Map a SITE_LINKS section title to the `<Category>` segment used by the
// menu-titles manifest keys. Only wiki-content sections map to a category; the
// "Pages" section is app-route navigation and has no manifest entries.
const SECTION_CATEGORY: Record<string, string> = {
  Organizations: "Zcash_Organizations",
  Guides: "Guides",
  "Use Zcash": "Using_Zcash",
  Ecosystem: "Zcash_Community",
};

// Best-effort derivation of a menu-titles manifest key (`<Category>/<File>.md`)
// from a wiki-style href like "/using-zcash/buying-zec". Returns null when the
// href is external, an app route, or otherwise not a wiki-content path.
const derivePageTitleKey = (
  category: string | undefined,
  href: string,
): string | null => {
  if (!category) return null;
  if (!href.startsWith("/")) return null;
  const segments = href.replace(/^\/+/, "").replace(/\/+$/, "").split("/");
  if (segments.length < 2) return null;
  const file = segments[segments.length - 1];
  if (!file) return null;
  // The manifest keys derive from the original .md filename
  // (Title_Case_With_Underscores); wiki hrefs are kebab-case. Convert kebab ->
  // the capitalized underscore form, then append the site-relative ".md" path.
  const fileKey = file
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join("_");
  return `${category}/${fileKey}.md`;
};

interface SitemapProps {
  // Localized + English menu-titles manifests (path-keyed by "<Category>/<File>.md"),
  // fetched server-side and passed in (this is a client component).
  titles?: Record<string, string>;
  enTitles?: Record<string, string>;
}

export default function SitemapPage({ titles = {}, enTitles = {} }: SitemapProps) {
  const { t } = useLanguage();
  const s = t?.pages?.sitemap;

  // The curated sections supply ordering, icons, app routes and external links;
  // the English manifest supplies coverage for every wiki content route. Built
  // here rather than in the server page because a section carries its Lucide
  // icon component, which cannot cross the server/client boundary as a prop.
  const sections = useMemo(
    () =>
      buildSitemapSections({
        englishTitles: enTitles,
        localizedTitles: titles,
        staticSections: SITE_LINKS,
        sectionDefs: CONTENT_SECTIONS,
      }),
    [enTitles, titles],
  );

  // Localized label for a single sitemap link. Preference order (matching the
  // SideMenu approach): localized manifest -> English manifest ->
  // pages.sitemap.links dictionary -> the English source label.
  const linkLabel = (sectionTitle: string, link: SiteLink) => {
    // Generated links carry their manifest key; curated ones fall back to
    // deriving it from the href.
    const key =
      link.titleKey ??
      derivePageTitleKey(SECTION_CATEGORY[sectionTitle], link.href);
    if (key) {
      if (titles[key]) return titles[key];
      if (enTitles[key]) return enTitles[key];
    }
    return s?.links?.[link.label] ?? link.label;
  };

  // Localized section / subsection title.
  const sectionLabel = (title: string) => s?.sections?.[title] ?? title;

  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const LIMIT = 12;
  const needle = query.trim().toLowerCase();

  // Filter by the label the reader actually sees, keeping the section order.
  const visible = useMemo(() => {
    const match = (sectionTitle: string, link: SiteLink) =>
      !needle || linkLabel(sectionTitle, link).toLowerCase().includes(needle);
    return sections
      .map((section) => ({
        section,
        links: section.links.filter((l) => match(section.title, l)),
        subsections: (section.subsections ?? [])
          .map((sub) => ({
            ...sub,
            links: sub.links.filter((l) => match(section.title, l)),
          }))
          .filter((sub) => sub.links.length > 0),
      }))
      .filter((v) => v.links.length > 0 || v.subsections.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, needle, titles, enTitles]);

  const countOf = (v: (typeof visible)[number]) =>
    v.links.length + v.subsections.reduce((n, sub) => n + sub.links.length, 0);
  const total = sections.reduce(
    (n, sec) =>
      n +
      sec.links.length +
      (sec.subsections ?? []).reduce((m, sub) => m + sub.links.length, 0),
    0,
  );

  const anchorId = (title: string) =>
    "sitemap-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const LinkRow = ({
    link,
    sectionTitle,
  }: {
    link: SiteLink;
    sectionTitle: string;
  }) => (
    <Link
      href={link.href}
      target={link.target}
      className="group flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-foreground/90 transition-colors hover:bg-brand/10 hover:text-brand dark:hover:text-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <span className="leading-snug">{linkLabel(sectionTitle, link)}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand dark:text-brand-soft">
            {s?.eyebrow ?? "Sitemap"}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-balance md:text-5xl">
            {s?.heading ?? "Site Navigation"}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground text-pretty">
            {s?.subheading ??
              "Complete overview of all pages and resources available on the Zechub Wiki"}
          </p>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={s?.filterPlaceholder ?? "Filter pages"}
                aria-label={s?.filterPlaceholder ?? "Filter pages"}
                className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={s?.clearFilter ?? "Clear filter"}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {needle
                ? (s?.filterCount ?? "{count} of {total} pages")
                    .replace("{count}", String(visible.reduce((n, v) => n + countOf(v), 0)))
                    .replace("{total}", String(total))
                : (s?.totalCount ?? "{total} pages in {sections} sections")
                    .replace("{total}", String(total))
                    .replace("{sections}", String(sections.length))}
            </p>
          </div>
        </div>
      </div>

      {/* Jump links */}
      <div className="sticky top-[4.5rem] z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="container mx-auto px-6 py-3">
          <nav
            aria-label={s?.jumpTo ?? "Jump to section"}
            className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]"
          >
            {visible.map((v) => (
              <a
                key={v.section.title}
                href={`#${anchorId(v.section.title)}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-brand hover:text-brand dark:hover:text-brand-soft"
              >
                {sectionLabel(v.section.title)}
                <span className="text-muted-foreground">{countOf(v)}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Sections */}
      <main className="container mx-auto px-6 py-10">
        {visible.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            {(s?.noResults ?? 'No pages match "{query}".').replace("{query}", query)}
          </p>
        ) : (
          <div className="space-y-8">
            {visible.map((v) => {
              const { section } = v;
              const Icon = section.icon;
              const open = !!needle || !!expanded[section.title];
              return (
                <section
                  key={section.title}
                  id={anchorId(section.title)}
                  className="scroll-mt-24 rounded-xl border border-border bg-card/40 p-6"
                >
                  <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand dark:text-brand-soft">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2 className="text-xl font-semibold">
                      {sectionLabel(section.title)}
                    </h2>
                    <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {countOf(v)}
                    </span>
                  </div>

                  {v.links.length > 0 && (
                    <nav className="grid gap-x-4 gap-y-0.5 imd:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {(open ? v.links : v.links.slice(0, LIMIT)).map((link) => (
                        <LinkRow key={link.href} link={link} sectionTitle={section.title} />
                      ))}
                    </nav>
                  )}

                  {v.links.length > LIMIT && !needle && (
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() =>
                        setExpanded((e) => ({ ...e, [section.title]: !open }))
                      }
                      className="mt-4 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/10 dark:text-brand-soft"
                    >
                      {open
                        ? (s?.showLess ?? "Show less")
                        : (s?.showAll ?? "Show all {count} pages").replace(
                            "{count}",
                            String(v.links.length),
                          )}
                    </button>
                  )}

                  {v.subsections.length > 0 && (
                    <div className="grid gap-8 imd:grid-cols-2 lg:grid-cols-3">
                      {v.subsections.map((sub) => (
                        <div key={sub.title}>
                          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {sectionLabel(sub.title)}
                          </h3>
                          <nav className="flex flex-col gap-0.5">
                            {sub.links.map((link) => (
                              <LinkRow key={link.href} link={link} sectionTitle={section.title} />
                            ))}
                          </nav>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

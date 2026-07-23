"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { SITE_LINKS } from "@/constants/siteLinks";
import { useLanguage } from "@/context/LanguageContext";

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

  // Localized label for a single sitemap link. Preference order (matching the
  // SideMenu approach): localized manifest -> English manifest ->
  // pages.sitemap.links dictionary -> the English source label.
  const linkLabel = (sectionTitle: string, href: string, label: string) => {
    const key = derivePageTitleKey(SECTION_CATEGORY[sectionTitle], href);
    if (key) {
      if (titles[key]) return titles[key];
      if (enTitles[key]) return enTitles[key];
    }
    return s?.links?.[label] ?? label;
  };

  // Localized section / subsection title.
  const sectionLabel = (title: string) => s?.sections?.[title] ?? title;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-5xl font-bold tracking-tight text-balance">
            {s?.heading ?? "Site Navigation"}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl text-pretty">
            {s?.subheading ??
              "Complete overview of all pages and resources available on the Zechub Wiki"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="space-y-16">
          {SITE_LINKS.map((section) => {
            const Icon = section.icon;
            const isGuidesSection = section.title === "Guides";

            return (
              <section key={section.title} className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <Icon className="h-6 w-6 text-foreground" />
                  <h2 className="text-2xl font-semibold">
                    {sectionLabel(section.title)}
                  </h2>
                  {isGuidesSection && (
                    <span className="ml-auto text-sm text-muted-foreground">
                      {(s?.guidesCount ?? "{count} guides").replace(
                        "{count}",
                        String(section.links.length),
                      )}
                    </span>
                  )}
                </div>

                {/* Main links (for Pages section) */}
                {section.links.length > 0 && (
                  <nav
                    className={
                      isGuidesSection
                        ? "grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    }
                  >
                    {section.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target={link.target}
                        className={
                          isGuidesSection
                            ? "group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors text-sm"
                            : "group flex items-center justify-between py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors"
                        }
                      >
                        <span className="text-foreground flex-1 leading-snug">
                          {linkLabel(section.title, link.href, link.label)}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </Link>
                    ))}
                  </nav>
                )}

                {/* Subsections (for other sections) */}
                {section.subsections && (
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {section.subsections.map((subsection) => (
                      <div key={subsection.title}>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                          {sectionLabel(subsection.title)}
                        </h3>
                        <nav className="space-y-2">
                          {subsection.links.map((link) => (
                            <Link
                              key={link.label}
                              href={link.href}
                              target={link.target}
                              className="group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors"
                            >
                              <span className="text-foreground text-sm flex-1 leading-snug">
                                {linkLabel(section.title, link.href, link.label)}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </Link>
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
      </main>
    </div>
  );
}

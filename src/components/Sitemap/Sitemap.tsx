import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_LINKS } from "@/constants/siteLinks";

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-5xl font-bold tracking-tight text-balance">
            Site Navigation
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl text-pretty">
            Complete overview of all pages and resources available on the Zechub
            Wiki
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
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                  {isGuidesSection && (
                    <span className="ml-auto text-sm text-muted-foreground">
                      {section.links.length} guides
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
                          {link.label}
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
                          {subsection.title}
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
                                {link.label}
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

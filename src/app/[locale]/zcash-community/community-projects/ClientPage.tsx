"use client";

import ExplorerDirectoryCard from "@/app/[locale]/using-zcash/blockchain-explorers/ExplorerDirectoryCard";
import { useLanguage } from "@/context/LanguageContext";
import type { CommunityProject } from "@/lib/parseCommunityProjects";
import { useMemo, useState } from "react";

type Props = {
  projects: CommunityProject[];
};

const CommunityProjectsClient = ({ projects }: Props) => {
  const { t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string | "all">(
    "all",
  );

  const [searchQuery, setSearchQuery] = useState("");

  const title =
    t?.pages?.zcashCommunity?.communityProjects?.title ?? "Community Projects";

  const description =
    t?.pages?.zcashCommunity?.communityProjects?.description ??
    "Discover tools, wallets, applications, libraries, and ecosystem initiatives built by the Zcash community and the wider zero-knowledge proof world.";

  const cta = "Visit Site";

  // Search projects by title, description, or category
  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return projects;
    }

    return projects.filter((project) => {
      const title = project.title?.toLowerCase() ?? "";
      const description = project.description?.toLowerCase() ?? "";
      const category = project.category?.toLowerCase() ?? "";

      return (
        title.includes(query) ||
        description.includes(query) ||
        category.includes(query)
      );
    });
  }, [projects, searchQuery]);

  // Group filtered projects by category
  const grouped = useMemo(() => {
    return filteredProjects.reduce<Record<string, CommunityProject[]>>(
      (acc, p) => {
        const cat = p.category || "Other";
        (acc[cat] ??= []).push(p);
        return acc;
      },
      {},
    );
  }, [filteredProjects]);

  const categories = Object.keys(grouped);

  // Filter by selected category
  const visibleGroups =
    activeCategory === "all"
      ? grouped
      : { [activeCategory]: grouped[activeCategory] || [] };

  const visibleProjectCount =
    activeCategory === "all"
      ? filteredProjects.length
      : visibleGroups[activeCategory]?.length || 0;

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-4xl text-center md:mb-14">
        <h1 className="mb-4 text-balance text-3xl font-semibold text-slate-900 md:text-5xl dark:text-white">
          {title}
        </h1>

        <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-slate-600 md:text-lg dark:text-slate-300">
          {description}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mx-auto mb-8 max-w-2xl">
        <label
          htmlFor="community-project-search"
          className="sr-only"
        >
          Search community projects
        </label>

        <div className="relative">
          {/* Search Icon */}
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>

          <input
            id="community-project-search"
            type="search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setActiveCategory("all");
            }}
            placeholder="Search community projects..."
            autoComplete="off"
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-800"
          />

          {/* Clear Search Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Project Count + Category Filters */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {visibleProjectCount}{" "}
          {visibleProjectCount === 1 ? "project" : "projects"}
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* No Results */}
      {visibleProjectCount === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
            No projects found
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Try a different search term or select another category.
          </p>

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Grouped Sections */}
      {visibleProjectCount > 0 && (
        <div className="space-y-16">
          {Object.entries(visibleGroups).map(([category, items]) => (
            <section key={category}>
              <div className="mb-6 flex items-baseline gap-3">
                <h2 className="text-xl font-semibold text-slate-900 md:text-2xl dark:text-white">
                  {category}
                </h2>

                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  ({items.length})
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {items.map((itm, i) => (
                  <ExplorerDirectoryCard
                    key={`${category}-${itm.title}-${i}`}
                    thumbnailImage={itm.thumbnailImage ?? ""}
                    description={itm.description}
                    title={itm.title}
                    url={itm.url}
                    features={itm.features}
                    ctaLabel={cta}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommunityProjectsClient;

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
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");

  const title =
    t?.pages?.zcashCommunity?.communityProjects?.title ?? "Community Projects";
  const description =
    t?.pages?.zcashCommunity?.communityProjects?.description ??
    "Discover tools, wallets, applications, libraries, and ecosystem initiatives built by the Zcash community and the wider zero-knowledge proof world.";
  const cta = "Visit Site";

  // Group projects by category
  const grouped = useMemo(() => {
    return projects.reduce<Record<string, CommunityProject[]>>((acc, p) => {
      const cat = p.category || "Other";
      (acc[cat] ??= []).push(p);
      return acc;
    }, {});
  }, [projects]);

  const categories = Object.keys(grouped);

  // Filtered view
  const visibleGroups =
    activeCategory === "all"
      ? grouped
      : { [activeCategory]: grouped[activeCategory] || [] };

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

      {/* Project count + filter pills */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {projects.length} projects
        </p>

        <div className="flex flex-wrap gap-2">
          <button
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

      {/* Grouped sections */}
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
                  key={`${category}-${i}`}
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
    </section>
  );
};

export default CommunityProjectsClient;
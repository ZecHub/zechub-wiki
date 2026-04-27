"use client";
import ExplorerDirectoryCard from "@/app/using-zcash/blockchain-explorers/ExplorerDirectoryCard";
import { communityProjects } from "@/constants/communityProjects";
import { useLanguage } from "@/context/LanguageContext";

const CommunityProjectsClient = () => {
  const { t } = useLanguage();
  const title = t?.pages?.zcashCommunity?.communityProjects?.title ?? "Community Projects";
  const description =
    t?.pages?.zcashCommunity?.communityProjects?.description ??
    "Discover tools, wallets, applications, libraries, and ecosystem initiatives built by the Zcash community and the wider zero-knowledge proof world.";

  const cta = "Visit Site";

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto mb-10 max-w-4xl text-center md:mb-14">
        <h1 className="mb-4 text-balance text-3xl font-semibold text-slate-900 md:text-5xl dark:text-white">
          {title}
        </h1>
        <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-slate-600 md:text-lg dark:text-slate-300">
          {description}
        </p>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {communityProjects.length} projects
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {communityProjects.map((itm, i) => (
          <ExplorerDirectoryCard
            thumbnailImage={itm.thumbnailImage}
            description={itm.description}
            title={itm.title}
            url={itm.url}
            key={i}
            features={itm.features}
            ctaLabel={cta}
          />
        ))}
      </div>
    </section>
  );
};

export default CommunityProjectsClient;
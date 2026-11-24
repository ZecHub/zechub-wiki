"use client";

import ambassadorProjects from "./ambassador_list_v2.json";
import { useLanguage } from "@/context/LanguageContext";
import { LuExternalLink, LuGlobe, LuInstagram, LuSend } from "react-icons/lu";
import { socialIcons } from "@/components/UI/SvgIcons";
import GlobalAmbassadorsMap from "./map/GlobalAmbassadorsMap";

// ── Card ───────────────────────────────────────────────────────────────────
const BTN_GHOST =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-1.5 text-sm font-semibold text-slate-700 no-underline transition-colors hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10";

function AmbassadorCard({
  project,
  description,
}: {
  project: (typeof ambassadorProjects)[number];
  description: string;
}) {
  const extra = project as { language?: string; instagram?: string; website?: string; telegram?: string };
  const language = extra.language;
  const instagram = extra.instagram;
  const telegram = extra.telegram;
  const website = extra.website ?? project.projectSite ?? undefined;
  return (
    <article className="flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-5 transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-slate-900 ring-2 ring-brand/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={`${project.name} logo`}
            width={80}
            height={80}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
        </div>
        <div className="min-w-0">
          <h3 className="m-0 text-lg font-semibold leading-tight text-slate-900 dark:text-white">
            {project.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[13px] text-slate-700 dark:bg-white/10 dark:text-slate-200">
              <span role="img" aria-hidden className="mr-1">
                {project.flag}
              </span>
              {language ?? "Community"}
            </span>
          </div>
        </div>
      </div>

      <p className="m-0 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.twitter && (
          <a href={project.twitter} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
            <span className="inline-flex [&>svg]:!h-3.5 [&>svg]:!w-3.5" aria-hidden="true">
              {socialIcons.x}
            </span>
            {/bsky\.app/.test(project.twitter) ? "Bluesky" : "X"}
          </a>
        )}
        {instagram && (
          <a href={instagram} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
            <LuInstagram className="h-3.5 w-3.5" aria-hidden="true" />
            Instagram
          </a>
        )}
        {telegram && (
          <a href={telegram} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
            <LuSend className="h-3.5 w-3.5" aria-hidden="true" />
            Telegram
          </a>
        )}
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
            <LuGlobe className="h-3.5 w-3.5" aria-hidden="true" />
            Website
          </a>
        )}
        {project.blog && project.blog !== website && (
          <a href={project.blog} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
            <LuExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Blog
          </a>
        )}
      </div>
    </article>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function GlobalAmbassadorsClient() {
  const { t } = useLanguage();

  const title =
    t?.pages?.zcashGlobalAmbassadors?.title ?? "Zcash Global Ambassadors";
  const description =
    t?.pages?.zcashGlobalAmbassadors?.description ??
    "Zcash Global Ambassadors are community leaders dedicated to promoting privacy-focused cryptocurrency adoption and education worldwide. Each ambassador project focuses on building awareness and engagement within their respective regions.";
  const activeHeading =
    t?.pages?.zcashGlobalAmbassadors?.activeProjectsHeading ??
    "Active Global Ambassador Projects";
  const footerInfo =
    t?.pages?.zcashGlobalAmbassadors?.footerInfo ??
    "The Zcash Global Ambassadors program supports community-led initiatives to promote privacy-focused technology adoption. Each ambassador project operates independently while contributing to the broader Zcash ecosystem.";

  // Some communities appear twice on the globe (one pin per country); show them once here.
  const uniqueProjects = ambassadorProjects.filter(
    (p, i, all) => all.findIndex((q) => q.name === p.name) === i,
  );
  const getProjectKey = (project: (typeof ambassadorProjects)[number]) =>
    `${project.name}-${project.geo_query ?? project.countryCode}`;

  return (
    <main className="min-h-screen bg-background">
      <GlobalAmbassadorsMap />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 md:py-14">
        {/* Header */}
        <header className="border-b border-slate-200 pb-8 dark:border-white/10">
          <h1 className="m-0 text-balance text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl dark:text-white">
            {title}
          </h1>
          <p className="m-0 mt-4 max-w-3xl text-pretty text-base leading-7 text-slate-600 md:text-lg md:leading-8 dark:text-slate-300">
            {description}
          </p>
        </header>

        {/* Cards grid */}
        <section>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900 md:text-[1.75rem] dark:text-white">
              {activeHeading}
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {uniqueProjects.map((project) => (
              <AmbassadorCard
                key={getProjectKey(project)}
                project={project}
                description={
                  (project as { about?: string }).about ??
                  t?.pages?.zcashGlobalAmbassadors?.projects?.[project.name] ??
                  project.description
                }
                
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-8 dark:border-white/10">
          <p className="m-0 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">{footerInfo}</p>
        </footer>
      </div>
    </main>
  );
}

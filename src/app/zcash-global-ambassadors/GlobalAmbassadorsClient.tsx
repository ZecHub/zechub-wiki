"use client";

import { ambassadorProjects } from "@/constants/ambassadorProjects";
import { useLanguage } from "@/context/LanguageContext";
import { LuExternalLink, LuTwitter } from "react-icons/lu";

// ── Banner ─────────────────────────────────────────────────────────────────
function AmbassadorBanner({
  src,
  alt,
  flag,
}: {
  src: string;
  alt: string;
  flag: string;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-t-2xl bg-muted group-hover:scale-[1.02] transition-transform duration-300"
      style={{ aspectRatio: "16 / 7" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover object-center"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Flag badge — top-right corner */}
      <span
        className="absolute top-2 right-3 text-3xl leading-none select-none drop-shadow"
        role="img"
        aria-label={alt}
      >
        {flag}
      </span>
    </div>
  );
}

// ── Card (now with modern pop-out effect) ───────────────────────────────────
function AmbassadorCard({
  project,
  followLabel,
  projectSiteLabel,
}: {
  project: (typeof ambassadorProjects)[number];
  followLabel: string;
  projectSiteLabel: string;
}) {
  return (
    <div className="group flex flex-col bg-white dark:bg-slate-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <AmbassadorBanner
        src={project.image}
        alt={`${project.name} banner`}
        flag={project.flag}
      />

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-hidden>
            {project.flag}
          </span>
          <h3 className="font-semibold text-lg text-foreground leading-tight">
            {project.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
          {project.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {project.twitter && (
            <a
              href={project.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-border hover:bg-accent transition-colors text-foreground"
            >
              <LuTwitter className="w-3.5 h-3.5" />
              {followLabel}
            </a>
          )}

          {project.projectSite && (
            <a
              href={project.projectSite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <LuExternalLink className="w-3.5 h-3.5" />
              {projectSiteLabel}
            </a>
          )}
        </div>
      </div>
    </div>
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
  const projectSitesHeading =
    t?.pages?.zcashGlobalAmbassadors?.projectSitesHeading ??
    "Project Sites & Blogs";
  const followLabel =
    t?.pages?.zcashGlobalAmbassadors?.followOnX ?? "Follow on X";
  const projectSiteLabel =
    t?.pages?.zcashGlobalAmbassadors?.projectSiteLabel ?? "Project Site";
  const linkLabel = t?.pages?.zcashGlobalAmbassadors?.linkLabel ?? "Link";
  const footerInfo =
    t?.pages?.zcashGlobalAmbassadors?.footerInfo ??
    "The Zcash Global Ambassadors program supports community-led initiatives to promote privacy-focused technology adoption. Each ambassador project operates independently while contributing to the broader Zcash ecosystem.";

  const projectsWithBlogs = ambassadorProjects.filter((p) => p.blog);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        {/* Cards grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-foreground">
            {activeHeading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ambassadorProjects.map((project) => (
              <AmbassadorCard
                key={project.name}
                project={project}
                followLabel={followLabel}
                projectSiteLabel={projectSiteLabel}
              />
            ))}
          </div>
        </div>

        {/* Project Sites & Blogs table */}
        {projectsWithBlogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              {projectSitesHeading}
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-1">
                {projectsWithBlogs.map((project) => (
                  <div
                    key={project.name}
                    className="flex items-center justify-between py-2.5 border-b border-border last:border-b-0"
                  >
                    <span className="font-medium text-foreground flex items-center gap-2">
                      <span role="img" aria-hidden>
                        {project.flag}
                      </span>
                      {project.name}
                    </span>

                    <div className="flex items-center gap-2">
                      {project.projectSite && (
                        <a
                          href={project.projectSite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm border px-2 py-1 rounded hover:bg-accent transition-colors text-primary"
                        >
                          {projectSiteLabel}{" "}
                          <LuExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <a
                        href={project.blog!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm border px-2 py-1 rounded hover:bg-accent transition-colors text-primary"
                      >
                        {linkLabel} <LuExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-border pt-8 mt-12">
          <p className="text-sm text-muted-foreground">{footerInfo}</p>
        </div>
      </div>
    </main>
  );
}
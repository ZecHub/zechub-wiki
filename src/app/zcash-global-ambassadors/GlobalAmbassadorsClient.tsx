"use client";

import { AmbassadorCards } from "@/components/AmbassadorCards/AmbassadorCards";
import { ambassadorProjects } from "@/constants/ambassadorProjects";
import { LuExternalLink } from "react-icons/lu";
import { useLanguage } from '@/context/LanguageContext';

export default function GlobalAmbassadorsClient() {
  const { t } = useLanguage();
  const title = t?.pages?.zcashGlobalAmbassadors?.title ?? "Zcash Global Ambassadors";
  const description =
    t?.pages?.zcashGlobalAmbassadors?.description ??
    "Zcash Global Ambassadors are community leaders dedicated to promoting privacy-focused cryptocurrency adoption and education worldwide. Each ambassador project focuses on building awareness and engagement within their respective regions.";
  const activeHeading = t?.pages?.zcashGlobalAmbassadors?.activeProjectsHeading ?? "Active Global Ambassador Projects";
  const projectSitesHeading = t?.pages?.zcashGlobalAmbassadors?.projectSitesHeading ?? "Project Sites & Blogs";
  const followLabel = t?.pages?.zcashGlobalAmbassadors?.followOnX ?? "Follow on X";
  const projectSiteLabel = t?.pages?.zcashGlobalAmbassadors?.projectSiteLabel ?? "Project Site";
  const linkLabel = t?.pages?.zcashGlobalAmbassadors?.linkLabel ?? "Link";
  const footerInfo = t?.pages?.zcashGlobalAmbassadors?.footerInfo ??
    "The Zcash Global Ambassadors program supports community-led initiatives to promote privacy-focused technology adoption. Each ambassador project operates independently while contributing to the broader Zcash ecosystem.";

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-foreground">{activeHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ambassadorProjects.map((project) => (
              <AmbassadorCards
                key={project.name}
                title={project.name}
                url={project.twitter}
                thumbnailImage={project.image}
                description={project.description}
                ctaLabel={followLabel}
                manual={
                  project.projectSite
                    ? { url: project.projectSite, ctaLabel: projectSiteLabel }
                    : undefined
                }
              />
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">{projectSitesHeading}</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="space-y-3">
              {ambassadorProjects
                .filter((project) => project.blog)
                .map((project) => (
                  <div
                    key={project.name}
                    className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                  >
                    <span className="font-medium text-foreground">{project.name}</span>
                    <div className="border px-2 rounded">
                      <a
                        href={project.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary flex items-center gap-2"
                      >
                        {linkLabel} <LuExternalLink />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-12">
          <p className="text-sm text-muted-foreground">{footerInfo}</p>
        </div>
      </div>
    </main>
  );
}

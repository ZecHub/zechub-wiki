import Hackathon from "@/components/Hackathon/Hackathon";
import {
  fetchHackathonGithubProjects,
  type HackathonGithubProject,
} from "@/lib/fetchHackathonGithubProjects";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "ZecHub Hackathon: Tracks & Submitted Projects | ZecHub",
    description:
      "Tracks, rules and submitted projects from the ZecHub Hackathon, where builders create, document and demo Zcash projects.",
    url: `https://zechub.wiki${localePrefix}/hackathon`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/hackathon", locale),
  });
}

// Project folders come from the GitHub contents API at request time. Revalidate
// hourly so newly merged submissions appear without a redeploy.
export const revalidate = 3600;

const HackathonPage = async () => {
  let githubProjects: HackathonGithubProject[] = [];
  let githubProjectsError: string | undefined;

  try {
    githubProjects = await fetchHackathonGithubProjects();
  } catch (err) {
    // The page still renders: the component falls back to a "browse on GitHub"
    // card, so a rate-limited or failing API never blanks the section.
    githubProjectsError =
      err instanceof Error ? err.message : "Unknown error loading projects";
    console.error("[hackathon] failed to load project folders:", err);
  }

  return (
    <Hackathon
      githubProjects={githubProjects}
      githubProjectsError={githubProjectsError}
    />
  );
};

export default HackathonPage;

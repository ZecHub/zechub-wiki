import Hackathon from "@/components/Hackathon/Hackathon";
import { genMetadata } from "@/lib/helpers";
import { fetchHackathonGithubProjects } from "@/lib/fetchHackathonGithubProjects";
import { Metadata } from "next";
import { getDictionary } from '@/lib/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dict = (await getDictionary()) as {
    pages?: {
      hackathon?: {
        title?: string;
      };
    };
  };
  return genMetadata({
    title: dict.pages?.hackathon?.title || "Hackathon | ZecHub",
    url: "https://zechub.wiki/hackathon",
  }) as Metadata;
}

export default async function page() {
  let githubProjects: Awaited<ReturnType<typeof fetchHackathonGithubProjects>> =
    [];
  let githubProjectsError: string | undefined;

  try {
    githubProjects = await fetchHackathonGithubProjects();
  } catch (e) {
    githubProjectsError =
      e instanceof Error ? e.message : "Could not load GitHub listing.";
  }

  return (
    <Hackathon
      githubProjects={githubProjects}
      githubProjectsError={githubProjectsError}
    />
  );
}
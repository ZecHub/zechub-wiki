import Hackathon from "@/components/Hackathon/Hackathon";
import {
  fetchHackathonGithubProjects,
  type HackathonGithubProject,
} from "@/lib/fetchHackathonGithubProjects";

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

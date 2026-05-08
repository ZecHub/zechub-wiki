export type HackathonGithubProject = {
  name: string;
  /** Repo path, e.g. Hackathon/2024/zchat */
  slugPath: string;
  htmlUrl: string;
  /** Four-digit year folder when nested under Hackathon/{year}/ */
  cohort: string | null;
};

type GhContentItem = {
  name: string;
  path: string;
  type: string;
  html_url: string;
};

const YEAR_DIR = /^\d{4}$/;

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "ZecHub-Wiki (hackathon; +https://zechub.wiki/hackathon)",
} as const;

async function fetchDirectoryContents(
  repoPath: string
): Promise<GhContentItem[]> {
  const url = `https://api.github.com/repos/ZecHub/zechub/contents/${repoPath}?ref=main`;
  const res = await fetch(url, {
    headers: GITHUB_HEADERS,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} for ${repoPath}`);
  }

  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Unexpected GitHub API response");
  }

  return data as GhContentItem[];
}

/**
 * Lists project folders from ZecHub/zechub Hackathon/: top-level dirs (except
 * year buckets) plus each dir inside four-digit year folders (e.g. 2024/).
 */
export async function fetchHackathonGithubProjects(): Promise<
  HackathonGithubProject[]
> {
  const root = await fetchDirectoryContents("Hackathon");
  const out: HackathonGithubProject[] = [];

  const yearFolders = root.filter(
    (i) => i.type === "dir" && YEAR_DIR.test(i.name)
  );
  const rootProjectDirs = root.filter(
    (i) => i.type === "dir" && !YEAR_DIR.test(i.name)
  );

  for (const d of rootProjectDirs) {
    out.push({
      name: d.name,
      slugPath: d.path,
      htmlUrl: d.html_url,
      cohort: null,
    });
  }

  await Promise.all(
    yearFolders.map(async (yf) => {
      const children = await fetchDirectoryContents(yf.path);
      for (const c of children) {
        if (c.type !== "dir") continue;
        out.push({
          name: c.name,
          slugPath: c.path,
          htmlUrl: c.html_url,
          cohort: yf.name,
        });
      }
    })
  );

  out.sort((a, b) => {
    if (a.cohort === null && b.cohort !== null) return -1;
    if (b.cohort === null && a.cohort !== null) return 1;
    if (a.cohort && b.cohort) {
      const y = parseInt(b.cohort, 10) - parseInt(a.cohort, 10);
      if (y !== 0) return y;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  return out;
}

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

// Server-only. GITHUB_TOKEN is optional, but without it GitHub allows just 60
// requests/hour/IP, which a shared deploy IP burns through quickly and every
// call then fails with 403.
function githubHeaders(withToken = true): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ZecHub-Wiki (hackathon; +https://zechub.wiki/hackathon)",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token && withToken) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchDirectoryContents(
  repoPath: string
): Promise<GhContentItem[]> {
  const url = `https://api.github.com/repos/ZecHub/zechub/contents/${repoPath}?ref=main`;
  const request = (withToken: boolean) =>
    fetch(url, {
      headers: githubHeaders(withToken),
      next: { revalidate: 3600 },
    });

  let res = await request(true);
  // An expired or revoked GITHUB_TOKEN answers 401 even for public repos.
  // ZecHub/zechub is public, so retry anonymously instead of failing the page.
  if (res.status === 401) res = await request(false);

  if (!res.ok) {
    const hint =
      res.status === 403 || res.status === 429
        ? " (rate limited; set GITHUB_TOKEN to raise the limit)"
        : "";
    throw new Error(`GitHub API ${res.status} for ${repoPath}${hint}`);
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

import { config } from "./config";

export interface ZIPData {
  number: number;
  title: string;
  status: string;
  type: string;
  authors: string;
  url: string;
}

interface GitHubFile {
  name: string;
  path: string;
  download_url: string;
}

export async function fetchZIPs(): Promise<ZIPData[]> {
  const res = await fetch(config.zipUrl, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  if (!res.ok) throw new Error("Failed to fetch ZIPs from GitHub");

  const files: GitHubFile[] = await res.json();
  // const zipsFiles = f

  return [];
}

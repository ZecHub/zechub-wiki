import { NextResponse } from "next/server";

// Latest security-relevant activity for the Zcash ecosystem, read from GitHub
// server-side (token-aware, cached) so the Ecosystem Security page can show a
// live feed without the browser calling api.github.com directly.
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

const REPOS = [
  { repo: "ZcashFoundation/zebra", label: "Zebra" },
  { repo: "zcash/zcash", label: "zcashd" },
  { repo: "zcash/librustzcash", label: "librustzcash" },
];

const SECURITY_RE = /security|vulnerab|\bCVE-|critical|denial.of.service|\bdos\b|crash|exploit/i;

type Item = {
  id: string;
  source: string;
  kind: "advisory" | "release";
  security: boolean;
  title: string;
  date: string;
  url: string;
};

function headers() {
  const h: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "ZecHub-App" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function getJson(url: string): Promise<any[]> {
  try {
    const r = await fetch(url, { headers: headers(), next: { revalidate: 3600 } });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const jobs = REPOS.flatMap(({ repo, label }) => [
    getJson(`https://api.github.com/repos/${repo}/releases?per_page=8`).then((rows) =>
      rows
        .filter((r) => !r.draft && !r.prerelease && r.published_at)
        .map<Item>((r) => ({
          id: `${repo}#${r.tag_name}`,
          source: label,
          kind: "release",
          security: SECURITY_RE.test(`${r.name || ""}\n${r.body || ""}`),
          title: String(r.name || r.tag_name),
          date: r.published_at,
          url: r.html_url,
        })),
    ),
    getJson(`https://api.github.com/repos/${repo}/security-advisories?state=published&per_page=8`).then((rows) =>
      rows
        .filter((a) => a.published_at)
        .map<Item>((a) => ({
          id: a.ghsa_id,
          source: label,
          kind: "advisory",
          security: true,
          title: String(a.summary || a.ghsa_id),
          date: a.published_at,
          url: a.html_url,
        })),
    ),
  ]);
  const all = (await Promise.all(jobs)).flat();
  // Releases only count when they mention security; advisories always do.
  const items = all
    .filter((i) => i.security)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  // At most 4 per project so one burst of advisories does not hide the rest.
  const perSource: Record<string, number> = {};
  const trimmed = items.filter((i) => (perSource[i.source] = (perSource[i.source] || 0) + 1) <= 4).slice(0, 8);
  return NextResponse.json({ items: trimmed }, { headers: { "Cache-Control": CACHE_CONTROL } });
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  GitBranch,
  GitPullRequest,
  CircleDot,
  Radio,
  Users,
  Link2,
  ChevronDown,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type View = "radicle" | "github" | "links";
type HistoryFeed = Exclude<View, "links">;
type Metric = "seeding" | "open_issues" | "merged_prs" | "stars" | "forks";

interface Project {
  name: string;
  seeding?: number | null;
  issues_open?: number | null;
  patches_merged?: number | null;
  delegates?: number | null;
  stars?: number | null;
  forks?: number | null;
  open_issues?: number | null;
  merged_pull_requests?: number | null;
  explorer_url?: string | null;
}

interface HistoryEntry {
  date: string;
  generated_at?: string | null;
  projects?: Project[];
  summary?: {
    total_projects?: number | null;
    total_seeding?: number | null;
    total_issues?: number | null;
    total_patches?: number | null;
    total_stars?: number | null;
    total_open_issues?: number | null;
    total_merged_prs?: number | null;
    total_forks?: number | null;
  };
}

const projectNumberFields = [
  "seeding",
  "issues_open",
  "patches_merged",
  "delegates",
  "stars",
  "forks",
  "open_issues",
  "merged_pull_requests",
] as const;
const summaryNumberFields = [
  "total_projects",
  "total_seeding",
  "total_issues",
  "total_patches",
  "total_stars",
  "total_open_issues",
  "total_merged_prs",
  "total_forks",
] as const;

function isOptionalFiniteNumber(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const entry = value as Record<string, unknown>;
  if (typeof entry.date !== "string") return false;
  if (entry.generated_at != null && typeof entry.generated_at !== "string") {
    return false;
  }

  if (entry.summary != null) {
    if (typeof entry.summary !== "object" || Array.isArray(entry.summary)) {
      return false;
    }
    const summary = entry.summary as Record<string, unknown>;
    if (!summaryNumberFields.every((field) => isOptionalFiniteNumber(summary[field]))) {
      return false;
    }
  }

  if (entry.projects === undefined) return true;
  if (!Array.isArray(entry.projects)) return false;

  return entry.projects.every((project) => {
    if (project === null || typeof project !== "object" || Array.isArray(project)) {
      return false;
    }

    const record = project as Record<string, unknown>;
    return (
      typeof record.name === "string" &&
      (record.explorer_url == null || typeof record.explorer_url === "string") &&
      projectNumberFields.every((field) => isOptionalFiniteNumber(record[field]))
    );
  });
}

interface LinkHealthEntry {
  date: string;
  generatedAt: string;
  filesScanned: number;
  serious: number;
  totals: {
    broken?: number;
    dns?: number;
    blocked?: number;
    redirect?: number;
    route?: number;
    asset?: number;
    timeout?: number;
    error?: number;
    invalid?: number;
  };
}

const numberFormat = new Intl.NumberFormat("en-US");

const formatNumber = (value: number | null | undefined) =>
  value == null ? "—" : numberFormat.format(value);

const percentChange = (current: number, previous: number | undefined) =>
  previous == null || previous === 0
    ? null
    : Math.round(((current - previous) / previous) * 100);

function getTotals(entry: HistoryEntry | undefined, view: View) {
  const projects = entry?.projects || [];
  const summary = entry?.summary || {};
  if (view === "radicle") {
    return {
      projects: summary.total_projects ?? projects.length,
      primary:
        summary.total_seeding ??
        projects.reduce((n, p) => n + (p.seeding || 0), 0),
      issues:
        summary.total_issues ??
        projects.reduce((n, p) => n + (p.issues_open || 0), 0),
      prs:
        summary.total_patches ??
        projects.reduce((n, p) => n + (p.patches_merged || 0), 0),
      secondary: projects.reduce((n, p) => n + (p.delegates || 0), 0),
    };
  }
  return {
    projects: projects.length,
    primary:
      summary.total_stars ?? projects.reduce((n, p) => n + (p.stars || 0), 0),
    issues:
      summary.total_open_issues ??
      projects.reduce((n, p) => n + (p.open_issues || 0), 0),
    prs:
      summary.total_merged_prs ??
      projects.reduce((n, p) => n + (p.merged_pull_requests || 0), 0),
    secondary:
      summary.total_forks ?? projects.reduce((n, p) => n + (p.forks || 0), 0),
  };
}

function projectActivity(project: Project, view: View) {
  return view === "radicle"
    ? (project.seeding || 0) +
        (project.patches_merged || 0) +
        (project.issues_open || 0)
    : (project.merged_pull_requests || 0) +
        (project.open_issues || 0) +
        (project.stars || 0);
}

export default function CodePulse() {
  const [view, setView] = useState<View>("radicle");
  const [radicleHistory, setRadicleHistory] = useState<HistoryEntry[]>([]);
  const [githubHistory, setGithubHistory] = useState<HistoryEntry[]>([]);
  const [linkHistory, setLinkHistory] = useState<LinkHealthEntry[]>([]);
  const [latest, setLatest] = useState<any>(null);
  const [loading, setLoading] = useState<Record<View, boolean>>({
    radicle: true,
    github: true,
    links: true,
  });
  const [errors, setErrors] = useState<Record<HistoryFeed, boolean>>({
    radicle: false,
    github: false,
  });
  const [selectedMetric, setSelectedMetric] = useState<Metric>("seeding");
  const [selectedRepo, setSelectedRepo] = useState("all");
  const [linkMetric, setLinkMetric] = useState<"serious" | "broken" | "blocked" | "redirect">("serious");

  useEffect(() => {
    let active = true;

    const loadFeed = async (
      feed: HistoryFeed,
      setHistory: (history: HistoryEntry[]) => void,
    ) => {
      try {
        const response = await fetch(`/data/${feed}/${feed}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const history = await response.json();
        if (!Array.isArray(history) || !history.every(isHistoryEntry)) {
          throw new Error("Invalid feed");
        }
        if (active) setHistory(history);
      } catch (error) {
        if (active) {
          setErrors((previous) => ({ ...previous, [feed]: true }));
          console.error(`Failed to load Code Pulse ${feed} feed`, error);
        }
      } finally {
        if (active) {
          setLoading((previous) => ({ ...previous, [feed]: false }));
        }
      }
    };

    const loadLinks = async () => {
      try {
        const [linkRes, latestRes] = await Promise.all([
          fetch("/data/link-health/history.json").catch(() => null),
          fetch("/data/link-health/latest.json").catch(() => null),
        ]);

        if (active && linkRes?.ok) {
          const linkData = await linkRes.json();
          if (active) setLinkHistory(Array.isArray(linkData) ? linkData : []);
        }
        if (active && latestRes?.ok) {
          const latestData = await latestRes.json();
          if (active) setLatest(latestData);
        }
      } catch (error) {
        if (active) {
          console.error("Failed to load Code Pulse link health data", error);
        }
      } finally {
        if (active) {
          setLoading((previous) => ({ ...previous, links: false }));
        }
      }
    };

    void loadFeed("radicle", setRadicleHistory);
    void loadFeed("github", setGithubHistory);
    void loadLinks();

    return () => {
      active = false;
    };
  }, []);

  const currentHistory = view === "radicle" ? radicleHistory : githubHistory;
  const current = currentHistory.at(-1);
  const previous = currentHistory.at(-2);
  const currentTotals = getTotals(current, view);
  const previousTotals = getTotals(previous, view);

  const linkCurrent = linkHistory.at(-1);
  const linkPrevious = linkHistory.at(-2);

  const githubRepos = useMemo(() => {
    const names = new Set<string>();
    githubHistory.forEach((entry) =>
      (entry.projects || []).forEach((project) => {
        if (project?.name) names.add(project.name);
      }),
    );
    return Array.from(names).sort();
  }, [githubHistory]);

  const metricOptions =
    view === "radicle"
      ? [
          { value: "seeding" as const, label: "Seeding" },
          { value: "open_issues" as const, label: "Open issues" },
          { value: "merged_prs" as const, label: "Merged patches" },
        ]
      : [
          { value: "stars" as const, label: "Stars" },
          { value: "forks" as const, label: "Forks" },
          { value: "open_issues" as const, label: "Open issues" },
          { value: "merged_prs" as const, label: "Merged PRs" },
        ];

  const trendData = currentHistory.map((entry) => {
    const totals = getTotals(entry, view);
    const projects = entry.projects || [];
    if (selectedRepo !== "all" && view === "github") {
      const project = projects.find((item) => item.name === selectedRepo);
      return {
        date: entry.date,
        stars: project?.stars ?? null,
        forks: project?.forks ?? null,
        open_issues: project?.open_issues ?? null,
        merged_prs: project?.merged_pull_requests ?? null,
      };
    }
    return {
      date: entry.date,
      seeding: view === "radicle" ? totals.primary : 0,
      stars: view === "github" ? totals.primary : 0,
      forks: view === "github" ? totals.secondary : 0,
      open_issues: totals.issues,
      merged_prs: totals.prs,
    };
  });

  const linkTrendData = linkHistory.map((entry) => ({
    date: entry.date,
    serious: entry.serious,
    broken: entry.totals?.broken ?? 0,
    blocked: entry.totals?.blocked ?? 0,
    redirect: entry.totals?.redirect ?? 0,
  }));

  const projects = current?.projects || [];
  const sortedProjects = [...projects].sort(
    (a, b) => projectActivity(b, view) - projectActivity(a, view),
  );
  const heatmapData = trendData.slice(-84);
  const maxHeat = Math.max(
    1,
    ...heatmapData.map((item) => Number(item[selectedMetric]) || 0),
  );

  const changeView = (nextView: View) => {
    setView(nextView);
    if (nextView !== "links") {
      setSelectedMetric(nextView === "radicle" ? "seeding" : "stars");
    }
    if (nextView !== "github") setSelectedRepo("all");
  };

  const delta =
    view === "links"
      ? percentChange(linkCurrent?.serious ?? 0, linkPrevious?.serious)
      : percentChange(currentTotals.primary, previousTotals.primary);

  const updatedAt =
    view === "links"
      ? linkCurrent?.generatedAt
        ? new Date(linkCurrent.generatedAt)
        : null
      : current?.generated_at
        ? new Date(current.generated_at)
        : null;

  return (
    <div className="space-y-7">
      <header className="relative overflow-hidden rounded-3xl border border-purple-200/70 bg-gradient-to-br from-purple-700 via-violet-700 to-indigo-800 p-6 text-white shadow-lg md:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-purple-100">
              <Activity className="h-4 w-4" /> Developer ecosystem pulse
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              See what is moving.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100 md:text-base">
              A quick visual read on Zcash projects, contribution activity, and
              open work across GitHub and Radicle.
            </p>
          </div>
          <div className="text-left text-sm text-purple-100 md:text-right">
            <p className="font-semibold text-white">
              {view === "radicle"
                ? "Radicle network"
                : view === "github"
                  ? "GitHub projects"
                  : "Link health"}
            </p>
            <p>
              {updatedAt
                ? `Updated ${updatedAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
                : "Update time unavailable"}
            </p>
          </div>
        </div>
        <div
          className="relative mt-7 inline-flex rounded-2xl bg-black/20 p-1"
          role="tablist"
          aria-label="Code Pulse source"
        >
          {(["radicle", "github", "links"] as View[]).map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={view === item}
              onClick={() => changeView(item)}
              className={`rounded-xl px-5 py-2 text-sm font-semibold capitalize transition ${
                view === item
                  ? "bg-white text-purple-800 shadow"
                  : "text-purple-100 hover:bg-white/10"
              }`}
            >
              {item === "links" ? (
                <span className="flex items-center gap-1.5">
                  <Link2 className="h-4 w-4" />
                  Link Health
                </span>
              ) : (
                item
              )}
            </button>
          ))}
        </div>
      </header>

      {loading[view] ? (
        <div
          role="status"
          className="rounded-3xl border bg-card p-12 text-center text-muted-foreground"
        >
          Loading{" "}
          {view === "links"
            ? "Link Health"
            : view === "radicle"
              ? "Radicle"
              : "GitHub"}{" "}
          feed…
        </div>
      ) : view !== "links" && errors[view] ? (
        <div
          role="alert"
          className="rounded-3xl border bg-card p-8 text-center text-destructive"
        >
          Could not load the {view === "radicle" ? "Radicle" : "GitHub"} feed.
        </div>
      ) : view !== "links" && !current ? (
        <div
          role="status"
          className="rounded-3xl border bg-card p-8 text-center text-muted-foreground"
        >
          No {view === "radicle" ? "Radicle" : "GitHub"} data available yet.
        </div>
      ) : view === "links" ? (
        <>
          <section
            aria-label="Current link health summary"
            className="grid grid-cols-2 gap-3 md:grid-cols-4"
          >
            <SummaryCard
              icon={<CircleDot />}
              label="Needing attention"
              value={linkCurrent?.serious ?? 0}
              delta={delta}
              tone="purple"
            />
            <SummaryCard
              icon={<ExternalLink />}
              label="Broken"
              value={linkCurrent?.totals?.broken ?? 0}
              delta={percentChange(
                linkCurrent?.totals?.broken ?? 0,
                linkPrevious?.totals?.broken,
              )}
              tone="orange"
            />
            <SummaryCard
              icon={<Radio />}
              label="Could not verify"
              value={linkCurrent?.totals?.blocked ?? 0}
              delta={percentChange(
                linkCurrent?.totals?.blocked ?? 0,
                linkPrevious?.totals?.blocked,
              )}
              tone="blue"
            />
            <SummaryCard
              icon={<ArrowUpRight />}
              label="Redirects"
              value={linkCurrent?.totals?.redirect ?? 0}
              delta={percentChange(
                linkCurrent?.totals?.redirect ?? 0,
                linkPrevious?.totals?.redirect,
              )}
              tone="green"
            />
          </section>

          <section className="rounded-3xl border bg-card p-5 md:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Momentum
                </p>
                <h3 className="mt-1 text-xl font-bold">
                  Link health over time
                </h3>
              </div>
              <div className="relative">
                <select
                  value={linkMetric}
                  onChange={(e) =>
                    setLinkMetric(
                      e.target.value as
                        | "serious"
                        | "broken"
                        | "blocked"
                        | "redirect",
                    )
                  }
                  aria-label="Select link health metric"
                  className="appearance-none rounded-xl border bg-background py-2 pl-3 pr-8 text-sm"
                >
                  <option value="serious">Needing attention</option>
                  <option value="broken">Broken</option>
                  <option value="blocked">Could not verify</option>
                  <option value="redirect">Redirects</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={linkTrendData}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    className="stroke-slate-200 dark:stroke-slate-700"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(String(date)).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={32}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={36}
                  />
                  <Tooltip
                    labelFormatter={(date) =>
                      new Date(String(date)).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })
                    }
                    formatter={(value: unknown) => [
                      formatNumber(Number(value)),
                      linkMetric === "serious"
                        ? "Needing attention"
                        : linkMetric === "broken"
                          ? "Broken"
                          : linkMetric === "blocked"
                            ? "Could not verify"
                            : "Redirects",
                    ]}
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 8px 30px rgba(15,23,42,.12)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={linkMetric}
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-3xl border bg-card p-5 md:p-6">
            <div className="mb-2">
              <p className="text-sm font-semibold text-muted-foreground">
                Current scan
              </p>
              <h3 className="mt-1 text-xl font-bold">Link health</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {linkCurrent
                ? `${formatNumber(linkCurrent.filesScanned)} pages scanned.`
                : "No link health data yet."}
            </p>
          </section>

          {latest?.findings?.length > 0 && (
            <FindingsSection findings={latest.findings} />
          )}
        </>
      ) : (
        <>
          <section
            aria-label="Current Code Pulse summary"
            className="grid grid-cols-2 gap-3 md:grid-cols-4"
          >
            <SummaryCard
              icon={<Radio />}
              label={view === "radicle" ? "Seeding" : "Stars"}
              value={currentTotals.primary}
              delta={delta}
              tone="purple"
            />
            <SummaryCard
              icon={<CircleDot />}
              label="Open issues"
              value={currentTotals.issues}
              delta={percentChange(currentTotals.issues, previousTotals.issues)}
              tone="orange"
            />
            <SummaryCard
              icon={<GitPullRequest />}
              label={view === "radicle" ? "Merged patches" : "Merged PRs"}
              value={currentTotals.prs}
              delta={percentChange(currentTotals.prs, previousTotals.prs)}
              tone="blue"
            />
            <SummaryCard
              icon={view === "radicle" ? <Users /> : <GitBranch />}
              label={view === "radicle" ? "Delegates" : "Forks"}
              value={currentTotals.secondary}
              delta={percentChange(
                currentTotals.secondary,
                previousTotals.secondary,
              )}
              tone="green"
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-3xl border bg-card p-5 md:p-6">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Momentum
                  </p>
                  <h3 className="mt-1 text-xl font-bold">Activity over time</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {view === "github" && (
                    <div className="relative">
                      <select
                        value={selectedRepo}
                        onChange={(event) => setSelectedRepo(event.target.value)}
                        aria-label="Select repository"
                        className="appearance-none rounded-xl border bg-background py-2 pl-3 pr-8 text-sm"
                      >
                        <option value="all">All repositories</option>
                        {githubRepos.map((repo) => (
                          <option key={repo} value={repo}>
                            {repo}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  )}
                  <div className="relative">
                    <select
                      value={selectedMetric}
                      onChange={(event) =>
                        setSelectedMetric(event.target.value as Metric)
                      }
                      aria-label="Select trend metric"
                      className="appearance-none rounded-xl border bg-background py-2 pl-3 pr-8 text-sm"
                    >
                      {metricOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      className="stroke-slate-200 dark:stroke-slate-700"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) =>
                        new Date(String(date)).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      }
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={32}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <Tooltip
                      labelFormatter={(date) =>
                        new Date(String(date)).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })
                      }
                      formatter={(value: unknown) => [
                        formatNumber(Number(value)),
                        metricOptions.find(
                          (item) => item.value === selectedMetric,
                        )?.label,
                      ]}
                      contentStyle={{
                        borderRadius: 14,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 8px 30px rgba(15,23,42,.12)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="#7c3aed"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border bg-card p-5 md:p-6">
              <div className="mb-5">
                <p className="text-sm font-semibold text-muted-foreground">
                  Daily signal
                </p>
                <h3 className="mt-1 text-xl font-bold">Activity map</h3>
              </div>
              <div
                className="flex flex-wrap gap-1.5"
                aria-label={`Activity map for ${metricOptions.find((item) => item.value === selectedMetric)?.label}`}
              >
                {heatmapData.map((item, index) => {
                  const value = Number(item[selectedMetric]) || 0;
                  const intensity =
                    value === 0
                      ? 0
                      : Math.max(1, Math.ceil((value / maxHeat) * 4));
                  return (
                    <span
                      key={`${item.date}-${index}`}
                      title={`${item.date}: ${formatNumber(value)}`}
                      className={`h-4 w-4 rounded-[4px] ${
                        intensity === 0
                          ? "bg-slate-100 dark:bg-slate-800"
                          : intensity === 1
                            ? "bg-purple-200"
                            : intensity === 2
                              ? "bg-purple-300"
                              : intensity === 3
                                ? "bg-purple-500"
                                : "bg-purple-700"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>{heatmapData[0]?.date || ""}</span>
                <span>
                  Less{" "}
                  <span className="mx-1 inline-flex gap-1 align-middle">
                    <i className="h-3 w-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
                    <i className="h-3 w-3 rounded-sm bg-purple-300" />
                    <i className="h-3 w-3 rounded-sm bg-purple-700" />
                  </span>{" "}
                  More
                </span>
                <span>{heatmapData.at(-1)?.date || ""}</span>
              </div>
              <div className="mt-6 rounded-2xl bg-purple-50 p-4 dark:bg-purple-950/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Quick read
                </p>
                <p className="mt-1 text-sm leading-5 text-purple-950 dark:text-purple-100">
                  {sortedProjects[0]?.name ? (
                    <>
                      <strong>{sortedProjects[0].name}</strong> is the most
                      active project in this snapshot.
                    </>
                  ) : (
                    "No project activity is available in this snapshot."
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border bg-card p-5 md:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Project health
                </p>
                <h3 className="mt-1 text-xl font-bold">Projects at a glance</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatNumber(currentTotals.projects)} tracked
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {sortedProjects.map((project) => (
                <ProjectCard key={project.name} project={project} view={view} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}


function FindingsSection({ findings }: { findings: any[] }) {
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [quickFilter, setQuickFilter] = useState<
    "all" | "attention" | "broken" | "blocked"
  >("all");
  const [search, setSearch] = useState("");

  const kinds = useMemo(() => {
    const set = new Set<string>();
    findings.forEach((f) => f.kind && set.add(f.kind));
    return Array.from(set).sort();
  }, [findings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return findings.filter((f) => {
      if (quickFilter === "attention" && !["broken", "dns", "route", "asset", "invalid"].includes(f.kind))
        return false;
      if (quickFilter === "broken" && f.kind !== "broken") return false;
      if (quickFilter === "blocked" && f.kind !== "blocked") return false;
      if (kindFilter !== "all" && f.kind !== kindFilter) return false;
      if (q) {
        const hay = `${f.url || ""} ${f.file || ""} ${f.detail || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [findings, quickFilter, kindFilter, search]);

  const shown = filtered.slice(0, 200);

  return (
    <section className="rounded-3xl border bg-card p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Details</p>
          <h3 className="mt-1 text-xl font-bold">Findings</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {formatNumber(filtered.length)} of {formatNumber(findings.length)}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["attention", "Needing attention"],
            ["broken", "Broken"],
            ["blocked", "Could not verify"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setQuickFilter(value)}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
              quickFilter === value
                ? "bg-purple-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative">
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            aria-label="Filter by kind"
            className="appearance-none rounded-xl border bg-background py-2 pl-3 pr-8 text-sm"
          >
            <option value="all">All kinds</option>
            {kinds.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search URL or source..."
          className="min-w-[200px] flex-1 rounded-xl border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="max-h-96 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="pb-2 pr-4">Kind</th>
              <th className="pb-2 pr-4">URL</th>
              <th className="pb-2 pr-4">Source</th>
              <th className="pb-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((f, i) => (
              <tr key={i} className="border-t border-border/50">
                <td className="py-2 pr-4 align-top font-medium">{f.kind}</td>
                <td className="py-2 pr-4 align-top break-all">
                  {f.url ? (
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      {f.url}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-2 pr-4 align-top text-muted-foreground">
                  {f.file}
                  {f.line ? `:${f.line}` : ""}
                </td>
                <td className="py-2 align-top text-muted-foreground">
                  {f.detail || f.status || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 200 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Showing first 200 of {formatNumber(filtered.length)}.
          </p>
        )}
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No findings match the current filters.
          </p>
        )}
      </div>
    </section>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  delta,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  delta: number | null;
  tone: "purple" | "orange" | "blue" | "green";
}) {
  const toneStyles = {
    purple:
      "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
    orange:
      "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
    green:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  };
  return (
    <div className="rounded-3xl border bg-card p-4 md:p-5">
      <div className={`mb-5 inline-flex rounded-xl p-2 ${toneStyles[tone]}`}>
        {icon}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
        {formatNumber(value)}
      </p>
      {delta != null && (
        <p
          className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
            delta >= 0 ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {delta >= 0 ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {Math.abs(delta)}% since previous snapshot
        </p>
      )}
    </div>
  );
}

function ProjectCard({ project, view }: { project: Project; view: View }) {
  const quiet =
    view === "github" &&
    (project.open_issues || 0) === 0 &&
    (project.merged_pull_requests || 0) === 0;
  const metrics =
    view === "radicle"
      ? [
          { label: "seeding", value: project.seeding },
          { label: "issues", value: project.issues_open },
          { label: "patches", value: project.patches_merged },
        ]
      : [
          { label: "stars", value: project.stars },
          { label: "forks", value: project.forks },
          { label: "open issues", value: project.open_issues },
        ];
  const href =
    view === "radicle"
      ? project.explorer_url ?? undefined
      : `https://github.com/ZecHub/${project.name}`;
  return (
    <article className="rounded-2xl border bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate font-semibold">{project.name}</h4>
          <p
            className={`mt-1 text-xs font-medium ${
              quiet ? "text-slate-500" : "text-emerald-600"
            }`}
          >
            {quiet ? "Quiet snapshot" : "Active snapshot"}
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.name}`}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl bg-muted/60 p-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-1 font-semibold">{formatNumber(metric.value)}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type View = "radicle" | "github";

export default function CodePulse() {
  const [view, setView] = useState<View>("radicle");
  const [radicleHistory, setRadicleHistory] = useState<any[]>([]);
  const [githubHistory, setGithubHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<
    "seeding" | "open_issues" | "merged_prs" | "stars" | "forks"
  >("seeding");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [radRes, gitRes] = await Promise.all([
          fetch("/data/radicle/radicle.json"),
          fetch("/data/github/github.json"),
        ]);
        const radData = await radRes.json();
        const gitData = await gitRes.json();
        setRadicleHistory(Array.isArray(radData) ? radData : []);
        setGithubHistory(Array.isArray(gitData) ? gitData : []);
      } catch (error) {
        console.error("Failed to load Code Pulse data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading Code Pulse...
      </div>
    );
  }

  const currentHistory = view === "radicle" ? radicleHistory : githubHistory;
  const current =
    currentHistory.length > 0
      ? currentHistory[currentHistory.length - 1]
      : null;

  if (!current) {
    return (
      <div className="p-8 text-center text-red-500">No data available yet.</div>
    );
  }

  const metricOptions =
    view === "radicle"
      ? [
          { value: "seeding", label: "Seeding" },
          { value: "open_issues", label: "Open Issues" },
          { value: "merged_prs", label: "Merged Patches" },
        ]
      : [
          { value: "stars", label: "Stars" },
          { value: "forks", label: "Forks" },
          { value: "open_issues", label: "Open Issues" },
          { value: "merged_prs", label: "Merged PRs" },
        ];

  const currentMetricLabel =
    metricOptions.find((m) => m.value === selectedMetric)?.label || selectedMetric;

  const trendData = currentHistory.map((entry: any) => {
    const s = entry.summary || {};
    const projects = entry.projects || [];

    if (view === "radicle") {
      return {
        date: entry.date,
        seeding: s.total_seeding ?? projects.reduce((sum: number, p: any) => sum + (p.seeding || 0), 0),
        open_issues: s.total_issues ?? projects.reduce((sum: number, p: any) => sum + (p.issues_open || 0), 0),
        merged_prs: s.total_patches ?? projects.reduce((sum: number, p: any) => sum + (p.patches_merged || 0), 0),
        stars: 0,
        forks: 0,
      };
    } else {
      return {
        date: entry.date,
        seeding: 0,
        open_issues: s.total_open_issues ?? projects.reduce((sum: number, p: any) => sum + (p.open_issues || 0), 0),
        merged_prs: s.total_merged_prs ?? projects.reduce((sum: number, p: any) => sum + (p.merged_pull_requests || 0), 0),
        stars: s.total_stars ?? projects.reduce((sum: number, p: any) => sum + (p.stars || 0), 0),
        forks: s.total_forks ?? projects.reduce((sum: number, p: any) => sum + (p.forks || 0), 0),
      };
    }
  });

  const handleViewChange = (v: View) => {
    setView(v);
    setSelectedMetric(v === "radicle" ? "seeding" : "stars");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-semibold tracking-tight">Code Pulse</h2>
        </div>
        <p className="text-muted-foreground mt-1">
          GitHub + Radicle project activity and health
        </p>
        {current.generated_at && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date(current.generated_at).toLocaleString()}
          </p>
        )}
      </div>

      {/* Toggle */}
      <div className="inline-flex rounded-xl border bg-muted p-1 text-sm">
        <button
          onClick={() => handleViewChange("radicle")}
          className={`px-5 py-1.5 rounded-lg font-medium transition-all ${
            view === "radicle"
              ? "bg-background text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:bg-muted/60"
          }`}
        >
          Radicle
        </button>
        <button
          onClick={() => handleViewChange("github")}
          className={`px-5 py-1.5 rounded-lg font-medium transition-all ${
            view === "github"
              ? "bg-background text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:bg-muted/60"
          }`}
        >
          GitHub
        </button>
      </div>

      {/* Current View */}
      {view === "radicle" ? (
        <RadicleView data={current} />
      ) : (
        <GitHubView data={current} />
      )}

      {/* Trends */}
      <div className="pt-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Trends Over Time — {currentMetricLabel}</h3>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="bg-background border rounded-lg px-3 py-1 text-sm min-w-32.5"
          >
            {metricOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="h-80 w-full rounded-xl border bg-card p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#7c3aed"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Radicle View
function RadicleView({ data }: { data: any }) {
  const projects = data.projects || [];
  const summary = data.summary || {};
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Projects"
          value={summary.total_projects || projects.length}
        />
        <MetricCard
          label="Total Seeding"
          value={summary.total_seeding || 0}
          color="text-green-600"
        />
        <MetricCard
          label="Total Issues"
          value={summary.total_issues || 0}
          color="text-orange-600"
        />
        <MetricCard
          label="Total Patches"
          value={summary.total_patches || 0}
          color="text-blue-600"
        />
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm md:min-w-[620px]">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">Project</th>
              <th className="text-center p-4">Seeding</th>
              <th className="text-center p-4">Delegates</th>
              <th className="text-center p-4">Issues</th>
              <th className="text-center p-4">Patches</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((p: any, i: number) => (
              <tr key={i} className="hover:bg-muted/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {p.description}
                  </div>
                </td>
                <td className="text-center p-4 font-semibold text-green-600">
                  {p.seeding}
                </td>
                <td className="text-center p-4">
                  {p.delegates} / {p.threshold}
                </td>
                <td className="text-center p-4">
                  {p.issues_open} / {p.issues_total}
                </td>
                <td className="text-center p-4">
                  {p.patches_open} / {p.patches_merged}
                </td>
                <td className="text-right p-4">
                  <a
                    href={p.explorer_url}
                    target="_blank"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    View →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// GitHub View
function GitHubView({ data }: { data: any }) {
  const projects = data.projects || [];
  const totalStars = projects.reduce(
    (sum: number, p: any) => sum + (p.stars || 0),
    0,
  );
  const totalForks = projects.reduce(
    (sum: number, p: any) => sum + (p.forks || 0),
    0,
  );
  const totalOpenIssues = projects.reduce(
    (sum: number, p: any) => sum + (p.open_issues || 0),
    0,
  );
  const totalMergedPRs = projects.reduce(
    (sum: number, p: any) => sum + (p.merged_pull_requests || 0),
    0,
  );
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Stars"
          value={totalStars}
          color="text-yellow-600"
        />
        <MetricCard
          label="Total Forks"
          value={totalForks}
          color="text-emerald-600"
        />
        <MetricCard
          label="Open Issues"
          value={totalOpenIssues}
          color="text-orange-600"
        />
        <MetricCard
          label="Merged PRs"
          value={totalMergedPRs}
          color="text-purple-600"
        />
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm md:min-w-[620px]">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">Project</th>
              <th className="text-center p-4">Stars</th>
              <th className="text-center p-4">Forks</th>
              <th className="text-center p-4">Open Issues</th>
              <th className="text-center p-4">Merged PRs</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((p: any, i: number) => (
              <tr key={i} className="hover:bg-muted/50 transition-colors">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="text-center p-4 font-semibold text-yellow-600">
                  {p.stars}
                </td>
                <td className="text-center p-4 text-emerald-600">{p.forks}</td>
                <td className="text-center p-4 text-orange-600">
                  {p.open_issues}
                </td>
                <td className="text-center p-4 text-purple-600">
                  {p.merged_pull_requests}
                </td>
                <td className="text-right p-4">
                  <a
                    href={`https://github.com/ZecHub/${p.name}`}
                    target="_blank"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    View →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  color = "",
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-card p-5 transition-all hover:scale-[1.02] hover:shadow-md ${color}`}
    >
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-3xl font-semibold mt-1 tracking-tight">{value}</div>
    </div>
  );
}
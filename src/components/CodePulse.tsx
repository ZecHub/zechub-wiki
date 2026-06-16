"use client";

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type View = 'radicle' | 'github';

export default function CodePulse() {
  const [view, setView] = useState<View>('radicle');
  const [radicleHistory, setRadicleHistory] = useState<any[]>([]);
  const [githubHistory, setGithubHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'seeding' | 'open_issues' | 'merged_prs' | 'stars' | 'forks'>('seeding');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [radRes, gitRes] = await Promise.all([
          fetch('/data/radicle/radicle.json'),
          fetch('/data/github/github.json'),
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
    return <div className="p-8 text-center text-muted-foreground">Loading Code Pulse data...</div>;
  }

  const currentHistory = view === 'radicle' ? radicleHistory : githubHistory;
  const current = currentHistory.length > 0 ? currentHistory[currentHistory.length - 1] : null;

  if (!current) {
    return <div className="p-8 text-center text-red-500">No data available yet.</div>;
  }

  // Prepare trend data
  const trendData = currentHistory.map((entry: any) => {
    const proj = entry.projects?.[0] || {};
    return {
      date: entry.date,
      seeding: proj.seeding || 0,
      open_issues: proj.open_issues || 0,
      merged_prs: proj.merged_pull_requests || 0,
      stars: proj.stars || 0,
      forks: proj.forks || 0,
    };
  });

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

      {/* Toggle Pills */}
      <div className="inline-flex rounded-lg border bg-muted p-0.5 text-sm">
        <button
          onClick={() => setView('radicle')}
          className={`px-4 py-1.5 rounded-md font-medium transition-all ${view === 'radicle' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Radicle
        </button>
        <button
          onClick={() => setView('github')}
          className={`px-4 py-1.5 rounded-md font-medium transition-all ${view === 'github' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          GitHub
        </button>
      </div>

      {/* Current View */}
      {view === 'radicle' ? (
        <RadicleView data={current} />
      ) : (
        <GitHubView data={current} />
      )}

      {/* Trends Section */}
      <div className="pt-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Trends Over Time</h3>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="bg-background border rounded-lg px-3 py-1 text-sm"
          >
            <option value="seeding">Seeding</option>
            <option value="open_issues">Open Issues</option>
            <option value="merged_prs">Merged PRs</option>
            <option value="stars">Stars</option>
            <option value="forks">Forks</option>
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

// ==================== RADICLE VIEW ====================
function RadicleView({ data }: { data: any }) {
  const projects = data.projects || [];
  const summary = data.summary || {};

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Projects" value={summary.total_projects || projects.length} />
        <MetricCard label="Total Seeding" value={summary.total_seeding || 0} color="text-green-500" />
        <MetricCard label="Total Issues" value={summary.total_issues || 0} color="text-orange-500" />
        <MetricCard label="Total Patches" value={summary.total_patches || 0} color="text-blue-500" />
      </div>

      {/* Projects Table */}
      <div className="rounded-xl border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">Project</th>
              <th className="text-center p-4">Seeding</th>
              <th className="text-center p-4">Delegates</th>
              <th className="text-center p-4">Issues</th>
              <th className="text-center p-4">Patches</th>
              <th className="text-center p-4">Head</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((p: any, index: number) => (
              <tr key={index} className="hover:bg-muted/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{p.description}</div>
                </td>
                <td className="text-center p-4 font-semibold text-green-500">{p.seeding}</td>
                <td className="text-center p-4">{p.delegates} / {p.threshold}</td>
                <td className="text-center p-4">{p.issues_open} / {p.issues_total}</td>
                <td className="text-center p-4">{p.patches_open} / {p.patches_merged}</td>
                <td className="text-center p-4 font-mono text-xs text-muted-foreground">
                  {p.head?.slice(0, 8)}
                </td>
                <td className="text-right p-4">
                  <a href={p.explorer_url} target="_blank" className="text-primary hover:underline text-sm font-medium">
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

// ==================== GITHUB VIEW ====================
function GitHubView({ data }: { data: any }) {
  const projects = data.projects || [];

  const totalStars = projects.reduce((sum: number, p: any) => sum + (p.stars || 0), 0);
  const totalForks = projects.reduce((sum: number, p: any) => sum + (p.forks || 0), 0);
  const totalOpenIssues = projects.reduce((sum: number, p: any) => sum + (p.open_issues || 0), 0);
  const totalMergedPRs = projects.reduce((sum: number, p: any) => sum + (p.merged_pull_requests || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Stars" value={totalStars} color="text-yellow-500" />
        <MetricCard label="Total Forks" value={totalForks} color="text-emerald-500" />
        <MetricCard label="Open Issues" value={totalOpenIssues} color="text-orange-500" />
        <MetricCard label="Merged PRs" value={totalMergedPRs} color="text-purple-500" />
      </div>

      {/* Projects Table */}
      <div className="rounded-xl border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">Project</th>
              <th className="text-center p-4">Stars</th>
              <th className="text-center p-4">Forks</th>
              <th className="text-center p-4">Open Issues</th>
              <th className="text-center p-4">Merged PRs</th>
              <th className="text-center p-4">Open PRs</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((p: any, index: number) => (
              <tr key={index} className="hover:bg-muted/50 transition-colors">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="text-center p-4 font-semibold text-yellow-500">{p.stars}</td>
                <td className="text-center p-4 text-emerald-500">{p.forks}</td>
                <td className="text-center p-4 text-orange-500">{p.open_issues}</td>
                <td className="text-center p-4 text-purple-500">{p.merged_pull_requests}</td>
                <td className="text-center p-4 text-blue-500">{p.open_pull_requests}</td>
                <td className="text-right p-4">
                  <a href={`https://github.com/ZecHub/${p.name}`} target="_blank" className="text-primary hover:underline text-sm font-medium">
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

// Reusable Metric Card with hover effect
function MetricCard({ label, value, color = "" }: { label: string; value: number | string; color?: string }) {
  return (
    <div className={`rounded-xl border bg-card p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${color}`}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-3xl font-semibold mt-1 tracking-tight">{value}</div>
    </div>
  );
}
"use client";

import { useState, useMemo } from "react";
import type { FlatProposal } from "@/components/Proposals/proposals-list-client";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/util";
import {
  MetricCard,
  MetricCardSkeleton,
} from "../Charts/Zcash/ZcashMetrics/MetricCard";

const COLORS = {
  yes: "#4ade80",
  no: "#f87171",
  abstain: "#fbbf24",
  primary: "#60a5fa",
  gridStroke: "#1e293b",
  tooltipBg: "#0f172a",
  tooltipBorder: "#1e293b",
  tooltipText: "#e2e8f0",
};

interface AnalyticsDashboardProps {
  proposals: FlatProposal[];
}

function formatMonth(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-md px-3 py-2 text-xs shadow-lg"
      style={{
        backgroundColor: COLORS.tooltipBg,
        border: `1px solid ${COLORS.tooltipBorder}`,
        color: COLORS.tooltipText,
      }}
    >
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}:{" "}
          <span className="font-mono font-semibold">
            {typeof entry.value === "number"
              ? entry.value % 1 === 0
                ? entry.value
                : entry.value.toFixed(1)
              : entry.value}
            {entry.name.includes("%") ||
            entry.name.toLowerCase().includes("rate") ||
            entry.name.toLowerCase().includes("turnout") ||
            entry.name.toLowerCase().includes("power")
              ? "%"
              : ""}
          </span>
        </p>
      ))}
    </div>
  );
}

const AXIS_STYLE = {
  fontSize: 12,
  fill: "#64748b",
  fontFamily: "var(--font-mono)",
};

const CHART_TABS = [
  "Submissions",
  "Members",
  "Approval Rate",
  "Voter Turnout",
  "Voting Power",
] as const;

type ChartTab = (typeof CHART_TABS)[number];

// ── Main component ────────────────────────────────────────────────────────────
export function AnalyticsDashboard({ proposals }: AnalyticsDashboardProps) {
  const [activeChart, setActiveChart] = useState<ChartTab>("Submissions");

  const sorted = useMemo(
    () =>
      [...proposals].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [proposals],
  );

  // ── derived data ──────────────────────────────────────────────────────────
  const submissionsData = useMemo(() => {
    const byMonth = new Map<string, number>();
    sorted.forEach((p) => {
      const key = formatMonth(p.createdAt);
      byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
    });
    let cum = 0;
    return Array.from(byMonth.entries()).map(([month, count]) => {
      cum += count;
      return { month, count, cumulative: cum };
    });
  }, [sorted]);

  const approvalData = useMemo(() => {
    const byMonth = new Map<string, { totalApproval: number; count: number }>();
    sorted
      .filter(
        (p) =>
          p.proposal.votes?.yes !== undefined &&
          p.proposal.votes?.no !== undefined &&
          p.proposal.votes?.abstain !== undefined,
      )
      .forEach((p) => {
        const yes = parseInt(p.proposal.votes.yes, 10);
        const no = parseInt(p.proposal.votes.no, 10);
        const abstain = parseInt(p.proposal.votes.abstain, 10);
        const total = yes + no + abstain;
        const approval = total > 0 ? (yes / total) * 100 : 0;
        const key = formatMonth(p.createdAt);
        const existing = byMonth.get(key) ?? { totalApproval: 0, count: 0 };
        byMonth.set(key, {
          totalApproval: existing.totalApproval + approval,
          count: existing.count + 1,
        });
      });
    return Array.from(byMonth.entries()).map(
      ([month, { totalApproval, count }]) => ({
        month,
        approval: Math.round((totalApproval / count) * 10) / 10,
      }),
    );
  }, [sorted]);

  const membersData = useMemo(() => {
    const byMonth = new Map<string, number>();
    sorted.forEach((p) => {
      const key = formatMonth(p.createdAt);
      const members = parseInt(p.proposal.total_power, 10);
      byMonth.set(key, Math.max(byMonth.get(key) ?? 0, members));
    });
    return Array.from(byMonth.entries()).map(([month, members]) => ({
      month,
      members,
    }));
  }, [sorted]);

  const turnoutData = useMemo(() => {
    const byMonth = new Map<string, { totalTurnout: number; count: number }>();
    sorted
      .filter(
        (p) =>
          p.proposal.votes?.yes !== undefined &&
          p.proposal.votes?.no !== undefined &&
          p.proposal.votes?.abstain !== undefined,
      )
      .forEach((p) => {
        const yes = parseInt(p.proposal.votes.yes, 10);
        const no = parseInt(p.proposal.votes.no, 10);
        const abstain = parseInt(p.proposal.votes.abstain, 10);
        const totalPower = parseInt(p.proposal.total_power, 10);
        const turnout =
          totalPower > 0 ? ((yes + no + abstain) / totalPower) * 100 : 0;
        const key = formatMonth(p.createdAt);
        const existing = byMonth.get(key) ?? { totalTurnout: 0, count: 0 };
        byMonth.set(key, {
          totalTurnout: existing.totalTurnout + turnout,
          count: existing.count + 1,
        });
      });
    return Array.from(byMonth.entries()).map(
      ([month, { totalTurnout, count }]) => ({
        month,
        turnout: Math.round((totalTurnout / count) * 10) / 10,
      }),
    );
  }, [sorted]);

  // ── NEW: Power by Proposal (for Voting Power tab) ────────────────────────
  const powerByProposal = useMemo(() => {
    return sorted
      .map((p) => {
        const totalPower = parseInt(p.proposal.total_power || "0", 10);
        const yes = parseInt(p.proposal.votes?.yes || "0", 10);
        const no = parseInt(p.proposal.votes?.no || "0", 10);
        const abstain = parseInt(p.proposal.votes?.abstain || "0", 10);

        return {
          id: p.id,
          totalPower,
          votesCast: yes + no + abstain,
        };
      })
      .sort((a, b) => a.id - b.id);
  }, [sorted]);

  // ── summary metrics ───────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const totalProposals = proposals.length;
    const uniqueProposers = new Set(proposals.map((p) => p.proposal.proposer))
      .size;
    const executed = proposals.filter(
      (p) => p.proposal.status.toLowerCase() === "executed",
    ).length;
    const passed = proposals.filter(
      (p) => p.proposal.status.toLowerCase() === "passed",
    ).length;
    const rejected = proposals.filter(
      (p) => p.proposal.status.toLowerCase() === "rejected",
    ).length;

    const avgApproval =
      approvalData.length > 0
        ? (
            approvalData.reduce((s, d) => s + d.approval, 0) /
            approvalData.length
          ).toFixed(1) + "%"
        : "—";

    const avgTurnout =
      turnoutData.length > 0
        ? (
            turnoutData.reduce((s, d) => s + d.turnout, 0) / turnoutData.length
          ).toFixed(1) + "%"
        : "—";

    const maxPower = powerByProposal.length
      ? Math.max(...powerByProposal.map((d) => d.totalPower))
      : 0;

    return [
      { label: "Total Proposals", value: totalProposals },
      { label: "Unique Proposers", value: uniqueProposers },
      { label: "Executed", value: executed },
      { label: "Passed", value: passed },
      { label: "Rejected", value: rejected },
      { label: "Avg Approval", value: avgApproval },
      { label: "Avg Turnout", value: avgTurnout },
      { label: "Peak Voting Power", value: maxPower },
    ];
  }, [proposals, approvalData, turnoutData, powerByProposal]);

  const chartMeta: Record<ChartTab, { title: string; subtitle: string }> = {
    Submissions: {
      title: "Submissions Over Time",
      subtitle: "Cumulative proposal count by month",
    },
    Members: {
      title: "DAO Members Over Time",
      subtitle: "Peak total power recorded per month",
    },
    "Approval Rate": {
      title: "Approval Rate",
      subtitle: "Yes votes as % of total votes per month",
    },
    "Voter Turnout": {
      title: "Voter Turnout Over Time",
      subtitle: "Average votes cast as % of total voting power per month",
    },
    "Voting Power": {
      title: "Voting Power by Proposal",
      subtitle: "Total available voting power vs actual votes cast per proposal",
    },
  };

  return (
    <div className="space-y-4">
      {/* Metrics grid */}
      <div className="my-12">
        <h2 className="font-bold text-xl text-slate-700 dark:text-slate-100">
          Proposals Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {metrics.map(({ label, value }) => (
            <MetricCard
              label={label}
              value={value}
              key={label}
              height="h-auto"
            />
          ))}
        </div>
      </div>

      {/* Tabbed chart panel */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center border-b border-border overflow-y-hidden">
          {CHART_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveChart(tab)}
              className={cn(
                "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
                activeChart === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="px-5 pt-5 pb-2">
          <h3 className="text-lg font-semibold text-card-foreground">
            {chartMeta[activeChart].title}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {chartMeta[activeChart].subtitle}
          </p>
        </div>

        <div className="w-full px-2 pb-6">
          {/* All other tabs remain unchanged */}
          {activeChart === "Submissions" && (
            <ResponsiveContainer width="100%" height={460}>
              <AreaChart
                data={submissionsData}
                margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="submGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={COLORS.gridStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} minTickGap={40} />
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={44} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="cumulative" stroke={COLORS.primary} strokeWidth={2} fill="url(#submGrad)" name="Total" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChart === "Members" && (
            <ResponsiveContainer width="100%" height={460}>
              <AreaChart data={membersData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="membGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.yes} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={COLORS.yes} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={COLORS.gridStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} minTickGap={40} />
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={44} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="members" stroke={COLORS.yes} strokeWidth={2} fill="url(#membGrad)" name="Members" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChart === "Approval Rate" && (
            <ResponsiveContainer width="100%" height={460}>
              <BarChart data={approvalData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.gridStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} minTickGap={20} />
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" width={44} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="approval" fill={COLORS.yes} radius={[3, 3, 0, 0]} name="Approval Rate" maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChart === "Voter Turnout" && (
            <ResponsiveContainer width="100%" height={460}>
              <AreaChart data={turnoutData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="turnoutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.abstain} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={COLORS.abstain} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={COLORS.gridStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} minTickGap={40} />
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" width={44} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="turnout" stroke={COLORS.abstain} strokeWidth={2} fill="url(#turnoutGrad)" name="Avg Turnout" dot={{ r: 3, fill: COLORS.abstain, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* ========== NEW VOTING POWER TAB ========== */}
          {activeChart === "Voting Power" && (
            <ResponsiveContainer width="100%" height={480}>
              <LineChart
                data={powerByProposal}
                margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridStroke} />
                <XAxis
                  dataKey="id"
                  tick={{ fill: "#888", fontSize: 11 }}
                  interval={Math.floor(powerByProposal.length / 14)}
                />
                <YAxis
                  tick={{ fill: "#888", fontSize: 11 }}
                  domain={[0, "dataMax + 3"]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {/* Total Voting Power (available) */}
                <Line
                  type="monotone"
                  dataKey="totalPower"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                  name="Total Voting Power"
                />

                {/* Actual Votes Cast */}
                <Line
                  type="monotone"
                  dataKey="votesCast"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="Votes Cast"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
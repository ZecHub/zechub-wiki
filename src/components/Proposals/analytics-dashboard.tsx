"use client";

import { useState, useMemo } from "react";
import { DaoProps } from "@/lib/chart/types";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/util";

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
  proposals: DaoProps[];
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

// ── Metric card ───────────────────────────────────────────────────────────────

export const MetricCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-slate-100 dark:bg-transparent shadow-sm border border-gray-200 dark:border-slate-700 rounded-md p-4 transition hover:shadow-sm">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className="font-medium text-slate-700 dark:text-white">{value}</p>
  </div>
);

export const MetricCardSkeleton = () => (
  <div className="bg-white dark:bg-transparent shadow-sm border border-gray-200 dark:border-slate-700 rounded-md p-4 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-2" />
    <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded w-32" />
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

export function AnalyticsDashboard({ proposals }: AnalyticsDashboardProps) {
  const [activeChart, setActiveChart] = useState<ChartTab>("Submissions");

  const [loading, setLoading] = useState(false);

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
          p.proposal.votes &&
          p.proposal.votes.yes !== undefined &&
          p.proposal.votes.no !== undefined &&
          p.proposal.votes.abstain !== undefined,
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

  // Voter turnout grouped by month — average turnout % across all proposals in that month
  const turnoutData = useMemo(() => {
    const byMonth = new Map<string, { totalTurnout: number; count: number }>();

    sorted
      .filter(
        (p) =>
          p.proposal.votes &&
          p.proposal.votes.yes !== undefined &&
          p.proposal.votes.no !== undefined &&
          p.proposal.votes.abstain !== undefined,
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

  const powerData = useMemo(() => {
    const byMonth = new Map<string, number>();

    sorted.forEach((p) => {
      const key = formatMonth(p.createdAt);
      const totalPower = parseInt(p.proposal.total_power, 10);

      // Convert total power to voting power percentage
      const votingPower = totalPower > 0 ? 100 / totalPower : 0;

      byMonth.set(key, Math.max(byMonth.get(key) ?? 0, votingPower));
    });

    return Array.from(byMonth.entries()).map(([month, power]) => ({
      month,
      power,
    }));
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

    const maxPower = powerData.length
      ? Math.max(...powerData.map((d) => d.power)).toLocaleString() + "%"
      : "—";

    return [
      {
        label: "Total Proposals",
        value: totalProposals,
        accent: COLORS.primary,
      },
      { label: "Unique Proposers", value: uniqueProposers, accent: COLORS.yes },
      { label: "Executed", value: executed, accent: COLORS.yes },
      { label: "Passed", value: passed, accent: "#a3e635" },
      { label: "Rejected", value: rejected, accent: COLORS.no },
      { label: "Avg Approval", value: avgApproval, accent: COLORS.yes },
      { label: "Avg Turnout", value: avgTurnout, accent: COLORS.abstain },
      { label: "Peak Voting Power", value: maxPower, accent: COLORS.primary },
    ];
  }, [proposals, approvalData, turnoutData, powerData]);

  // ── per-tab meta ──────────────────────────────────────────────────────────

  const chartMeta: Record<ChartTab, { title: string; subtitle: string }> = {
    Submissions: {
      title: "Submissions Over Time",
      subtitle: "Cumulative proposal count by month",
    },
    Members: {
      title: "DAO Members Over Time",
      subtitle: "Unique proposers accumulated by month",
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
      title: "Voting Power Over Time",
      subtitle: "Peak total voting power recorded per month",
    },
  };

  return (
    <div className="space-y-4">
      {/* ── Metrics grid ── */}
      <div className="my-12">
        <h2 className="font-bold text-xl text-slate-700 dark:text-slate-100">
          Proposals Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {loading
            ? metrics.map(({ label, value }) => (
                <MetricCardSkeleton key={label} />
              ))
            : metrics.map(({ label, value }) => (
                <MetricCard label={label} value={value} key={label} />
              ))}
        </div>
      </div>

      {/* ── Tabbed chart panel ── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* Tab bar */}
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

        {/* Chart header */}
        <div className="px-5 pt-5 pb-2">
          <h3 className="text-lg font-semibold text-card-foreground">
            {chartMeta[activeChart].title}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {chartMeta[activeChart].subtitle}
          </p>
        </div>

        {/* Chart body — full-width, tall */}
        <div className="w-full px-2 pb-6">
          {activeChart === "Submissions" && (
            <ResponsiveContainer width="100%" height={460}>
              <AreaChart
                data={submissionsData}
                margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="submGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.primary}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={COLORS.gridStroke}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={40}
                />
                <YAxis
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  fill="url(#submGrad)"
                  name="Total"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChart === "Members" && (
            <ResponsiveContainer width="100%" height={460}>
              <AreaChart
                data={membersData}
                margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="membGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.yes}
                      stopOpacity={0.35}
                    />
                    <stop offset="95%" stopColor={COLORS.yes} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={COLORS.gridStroke}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={40}
                />
                <YAxis
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="members"
                  stroke={COLORS.yes}
                  strokeWidth={2}
                  fill="url(#membGrad)"
                  name="Members"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChart === "Approval Rate" && (
            <ResponsiveContainer width="100%" height={460}>
              <BarChart
                data={approvalData}
                margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  stroke={COLORS.gridStroke}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={20}
                />
                <YAxis
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  unit="%"
                  width={44}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="approval"
                  fill={COLORS.yes}
                  radius={[3, 3, 0, 0]}
                  name="Approval Rate"
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChart === "Voter Turnout" && (
            <ResponsiveContainer width="100%" height={460}>
              <AreaChart
                data={turnoutData}
                margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="turnoutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.abstain}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.abstain}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={COLORS.gridStroke}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={40}
                />
                <YAxis
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  unit="%"
                  width={44}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="turnout"
                  stroke={COLORS.abstain}
                  strokeWidth={2}
                  fill="url(#turnoutGrad)"
                  name="Avg Turnout"
                  dot={{ r: 3, fill: COLORS.abstain, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChart === "Voting Power" && (
            <ResponsiveContainer width="100%" height={460}>
              <AreaChart
                data={powerData}
                margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.no}
                      stopOpacity={0.25}
                    />
                    <stop offset="95%" stopColor={COLORS.no} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={COLORS.gridStroke}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={40}
                />
                <YAxis
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                  width={44}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke={COLORS.no}
                  strokeWidth={2}
                  fill="url(#powerGrad)"
                  dot={{ r: 3, fill: COLORS.no, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: COLORS.no, strokeWidth: 0 }}
                  name="Voting Power"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

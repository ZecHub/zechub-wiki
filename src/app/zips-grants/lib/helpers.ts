import { format, parse } from "date-fns";
import { Grant, GrantStatus } from "../types/grants";
import { CHART_COLORS } from "./chart-colors";

export type StatusVariant =
  | "active"
  | "draft"
  | "final"
  | "withdrawn"
  | "funded"
  | "in-progress"
  | "completed"
  | "proposed"
  | "default"
  | "cancelled"
  | "open";

export function getVariant(status: string): StatusVariant {
  const s = status.toLowerCase();

  if (["active", "implemented"].includes(s)) return "active";
  if (["draft", "reserved"].includes(s)) return "draft";
  if (["withdrawn", "rejected", "obsolete"].includes(s)) return "withdrawn";
  if (["final"].includes(s)) return "final";
  if (s === "funded") return "funded";
  if (s === "in-progress") return "in-progress";
  if (s === "completed") return "completed";
  if (s === "proposed") return "proposed";
  if (s === "cancelled") return "cancelled";
  if (s === "open") return "open";

  return "default";
}

export function computeGrantStatusStats(grants: Grant[]) {
  const stats = {
    total: grants.length,
    open: 0,
    completed: 0,
    cancelled: 0,
  };

  for (const grant of grants) {
    if (grant.status === "Open") stats.open++;
    if (grant.status === "Completed") stats.completed++;
    if (grant.status === "Cancelled") stats.cancelled++;
  }

  return {
    ...stats,
    activeGrants: stats.open,
    closedGrants: stats.cancelled + stats.completed,
  };
}

export function computeFinancialStats(grants: Grant[]) {
  return grants.reduce(
    (acc, grant) => {
      acc.totalAwarded += grant.summary.totalAmountUSD;
      acc.totalUsdDisbursed += grant.summary.totalUsdDisbursed;
      acc.totalZecDisbursed += grant.summary.totalZecDisbursed;

      return acc;
    },
    {
      totalAwarded: 0,
      totalUsdDisbursed: 0,
      totalZecDisbursed: 0,
    },
  );
}

export function computeCategoryStats(grants: Grant[]) {
  const map = new Map<string, { count: number; totalUSD: number }>();
  for (const g of grants) {
    const cat = g.category || "Unknown";
    const prev = map.get(cat) || { count: 0, totalUSD: 0 };
    map.set(cat, {
      count: prev.count + 1,
      totalUSD: prev.totalUSD + g.summary.totalAmountUSD,
    });
  }
  return Array.from(map.entries()).map(([name, val], i) => ({
    name,
    value: val.count,
    totalUSD: val.totalUSD,
    fill: getColorForIndex(i),
  }));
}

export function computeMilestonesStats(grants: Grant[]) {
  let totalMilestones = 0;
  let totalCompletedMilestone = 0;
  let totalEstimatedUSD = 0;
  let totalMilestoneAmountUSD = 0;

  for (const grant of grants) {
    totalMilestones += grant.summary.totalMilestones;
    totalCompletedMilestone += grant.summary.completedMilestones;

    for (const milestone of grant.milestones) {
      if (milestone.amountUSD) {
        totalMilestoneAmountUSD += milestone.amountUSD;
      }

      if (milestone.estimateUSD) {
        totalEstimatedUSD += milestone.estimateUSD;
      }
    }
  }

  return {
    totalMilestones,
    totalCompletedMilestone,
    completionRates:
      totalMilestones > 0
        ? Math.round((totalCompletedMilestone / totalMilestones) * 100)
        : 0,
    totalMilestoneAmountUSD,
    totalEstimatedUSD,
  };
}

export function buildGrantStatusChartData(
  grants: Grant[],
): { name: GrantStatus; value: number }[] {
  const stats = computeGrantStatusStats(grants);

  return [
    { name: "Open", value: stats.open },
    { name: "Completed", value: stats.completed },
    { name: "Cancelled", value: stats.cancelled },
  ];
}

export function buildFinancialChartData(grants: Grant[]) {
  const stats = computeFinancialStats(grants);

  return [
    { name: "Awarded", value: stats.totalAwarded },
    { name: "USD Disbursed", value: stats.totalUsdDisbursed },
  ];
}

export function buildMilestoneCompletionChartData(grants: Grant[]) {
  const stats = computeMilestonesStats(grants);

  return [
    { name: "Completed", value: stats.totalCompletedMilestone },
    {
      name: "Remaining",
      value: stats.totalMilestones - stats.totalCompletedMilestone,
    },
  ];
}

export function getColorForIndex(i: number) {
  return CHART_COLORS[i % CHART_COLORS.length];
}

export function computeStats(grants: Grant[]) {
  const totalGrants = grants.length;
  const totalAmountUSD = grants.reduce(
    (s, g) => s + g.summary.totalAmountUSD,
    0,
  );
  const totalZec = grants.reduce((s, g) => s + g.summary.totalZecDisbursed, 0);
  const avgGrant = totalGrants ? totalAmountUSD / totalGrants : 0;
  const completed = grants.filter(
    (g) => g.summary.completedPercent === 100,
  ).length;

  const completionRate = totalGrants ? (completed / totalGrants) * 100 : 0;

  return { totalGrants, totalAmountUSD, totalZec, avgGrant, completionRate };
}

function parseDateSafe(dateStr: string): Date | null {
  try {
    const trimmed = dateStr.trim();
    // Try "d MMM yyyy" format
    return parse(trimmed, "d MMM yyyy", new Date());
  } catch {
    return null;
  }
}

export function disbursedOverTime(grants: Grant[]) {
  const monthly = new Map<string, number>();

  for (const g of grants) {
    for (const m of g.milestones) {
      if (!m.paidOutDate) continue;

      const d = parseDateSafe(m.paidOutDate);
      if (!d || isNaN(d.getTime())) continue;

      const key = format(d, "yyyy-MM");
      monthly.set(key, (monthly.get(key) || 0) + m.amountUSD!);
    }
  }

  return Array.from(monthly.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount }));
}

export function topGrantees(grants: Grant[], limit = 15) {
  const map = new Map<string, number>();

  for (const g of grants) {
    const prev = map.get(g.grantee) || 0;
    map.set(g.grantee, prev + g.summary.totalAmountUSD);
  }

  return Array.from(map.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, amount], i) => ({ name, amount, fill: getColorForIndex(i) }));
}

export function zecUsdRateOverTime(grants: Grant[]) {
  const points: {
    date: string;
    rate: number;
    project: string;
    amount: number;
  }[] = [];

  for (const g of grants) {
    for (const m of g.milestones) {
      if (!m.paidOutDate || !m.zecUsdRate) continue;

      const d = parseDateSafe(m.paidOutDate);
      if (!d || isNaN(d.getTime())) continue;

      points.push({
        date: format(d, "yyyy-MM-dd"),
        rate: m.zecUsdRate,
        project: g.project,
        amount: m.amountUSD!,
      });
    }
  }

  return points.sort((a, b) => a.date.localeCompare(b.date));
}

export function totalGrantees(grants: Grant[]) {
  return grants
    .map((g) => g.grantee)
    .filter((g, i, arr) => arr.indexOf(g) === i);
}

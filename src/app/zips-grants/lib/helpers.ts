import { Grant, GrantStatus } from "../types/grants";

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
  const map = new Map<string, number>();

  for (const grant of grants) {
    map.set(grant.category, (map.get(grant.category) || 0) + 1);
  }

  return Array.from(map.entries()).map(([category, count]) => ({
    category,
    count,
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


export function buildMilestoneCompletionChartData(grants: Grant[]){
  const stats = computeMilestonesStats(grants)
  
  return [
    {name: 'Completed', value: stats.totalCompletedMilestone},
    {name: 'Remaining', value: stats.totalMilestones - stats.totalCompletedMilestone}
  ]
}

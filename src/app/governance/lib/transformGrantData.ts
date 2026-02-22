import {
  Grant,
  Milestone,
  MilestoneStatus,
  RawGrantRow,
} from "../types/grants";
import { normalizeStatus, parseMoney, parseNumber } from "./grantParsers";

export function transformGrantData(rows: RawGrantRow[]): Grant[] {
  const grouped = new Map<string, Grant>();

  for (const row of rows) {
    const key = `${row.Project}::${row.Grantee}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        id: key.toLowerCase().replace(/\s+/g, "-"),
        project: row.Project,
        grantee: row.Grantee,
        category: row["Category (as determined by ZCG)"],
        reportingFrequency:
          row["Reporting Frequency (as determined by ZCG)"] || null,
        milestones: [],
        summary: {} as any,
      });
    }

    const milestone: Milestone = {
      number: Number(row.Milestone),
      amountUSD: parseMoney(row["Amount (USD)"]),
      estimateUSD: parseMoney(row.Estimate),
      status: normalizeStatus(row["Grant Status"]),
      paidOutDate: row["Paid Out"] || null,
      usdDisbursed: parseMoney(row["USD Disbursed"]),
      zecDisbursed: parseNumber(row["ZEC Disbursed"]),
      zecUsdRate: parseMoney(row["ZEC/USD"]),
    };

    grouped.get(key)!.milestones.push(milestone);
  }

  // Compute summaries
  for (const grant of grouped.values()) {
    grant.milestones.sort((a, b) => a.number - b.number);

    const totalMilestones = grant.milestones.length;
    const completedMilestones = grant.milestones.filter(
      (m) => m.status === "Completed",
    ).length;

    const totalAmountUSD = grant.milestones.reduce(
      (sum, m) => sum + (m.amountUSD ?? 0),
      0,
    );

    const totalUsdDisbursed = grant.milestones.reduce(
      (sum, m) => sum + (m.usdDisbursed ?? 0),
      0,
    );
    const totalZecDisbursed = grant.milestones.reduce(
      (sum, m) => sum + (m.zecDisbursed ?? 0),
      0,
    );

    const completedPercent =
      totalMilestones === 0
        ? 0
        : Math.round((completedMilestones / totalMilestones) * 100);

    const overallStatus: MilestoneStatus =
      completedMilestones === totalMilestones
        ? "Completed"
        : completedMilestones > 0
          ? "In progress"
          : "Pending";

    grant.summary = {
      totalMilestones,
      completedMilestones,
      totalUsdDisbursed,
      totalAmountUSD,
      totalZecDisbursed,
      completedPercent,
      overallStatus,
    };
  }

  return Array.from(grouped.values());
}

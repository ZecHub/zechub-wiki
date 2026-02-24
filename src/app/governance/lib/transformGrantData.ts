import { Grant, RawGrantRow } from "../types/grants";
import {
  extractNumericMilestone,
  normalizeStatus,
  parseMoney,
  parseNumber,
} from "./grantParsers";

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
        status: normalizeStatus(row["Grant Status"]!),
        summary: {} as any,
      });
    }

    const grant = grouped.get(key);

    if (grant && grant.status) {
      if (grant.status === "Cancelled") {
        grant.status = "Cancelled";
      } else if (grant.status === "Open") {
        grant.status = "Open";
      } else {
        grant.status === "Completed";
      }
    }

    grant!.milestones.push({
      label: row.Milestone,
      numericOrder: extractNumericMilestone(row.Milestone),
      amountUSD: parseMoney(row["Amount (USD)"]),
      estimateUSD: parseMoney(row.Estimate),
      // status: normalizeStatus(row["Grant Status"]),
      paidOutDate: row["Paid Out"] || null,
      usdDisbursed: parseMoney(row["USD Disbursed"]),
      zecDisbursed: parseNumber(row["ZEC Disbursed"]),
      zecUsdRate: parseMoney(row["ZEC/USD"]),
    });
  }

  // Compute summaries
  for (const grant of grouped.values()) {
    grant.milestones.sort((a, b) => {
      if (a.numericOrder === null) return 1;
      if (b.numericOrder === null) return -1;

      return a.numericOrder - b.numericOrder;
    });

    const totalMilestones = grant.milestones.length;

    const completedMilestones = grant.milestones.filter(
      (m) =>
        m.paidOutDate !== null ||
        (m.usdDisbursed ?? 0) !== 0 ||
        (m.zecDisbursed ?? 0) !== 0,
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

    console.log({ completedPercent, totalAmountUSD });

    grant.summary = {
      completedMilestones,
      totalMilestones,
      totalUsdDisbursed,
      totalAmountUSD,
      totalZecDisbursed,
      completedPercent,
    };
  }

  return Array.from(grouped.values());
}

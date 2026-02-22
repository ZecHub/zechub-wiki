import {
  Grant,
  Milestone,
  RawGrantRow,
} from "../types/grants";
import { normalizeStatus, parseMoney, parseNumber } from "./grantParsers";

export function transformGrantData(rows: RawGrantRow[]): Grant[] {
  console.log(rows[0]);
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


  return Array.from(grouped.values());
}

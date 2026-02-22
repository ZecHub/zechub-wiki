export type MilestoneStatus = "completed" | "In progress" | "Pending";

export interface RawGrantRow {
  Grantee: string;
  "Category (as determined by ZCG)": string;
  "Reporting Frequency (as determined by ZCG)"?: string;
  Milestone: string;
  "Amount (USD)"?: string;
  Estimate?: string;
  "Grant Status"?: string;
  "Paid Out"?: string;
  "USD Disbursed"?: string;
  "ZEC Disbursed"?: string;
  "ZEC/USD"?: string;
}

export interface Milestone {
  number: number;
  amountUSD: number | null;
  status: MilestoneStatus;
  paidOutDate: string | null;
  usdDisbursed: number | null;
  zecDisbursed: number | null;
  zecUsdRate: number | null;
}

export interface GrantSummary {
  totalMilestones: number;
  complettedMilestones: number;
  totalAmountUSD: number;
  totalUsdDisbursed: number;
  totalZecDisbursed: number;
  completedPercent: number;
  overallStatus: MilestoneStatus;
}

export interface Grant {
  idz: string;
  project: string;
  grantee: string;
  category: string;
  reportingFrequency: string | null;
  milestone: Milestone[];
  summary: GrantSummary;
}

export type MilestoneStatus = "Completed" | "In progress" | "Pending";
export type GrantStatus = "Completed" | "Cancelled" | "Open";

export interface RawGrantRow {
  Project: string;
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

export interface Milestone2 {
  number: number;
  amountUSD: number | null;
  estimateUSD: number | null;
  status: MilestoneStatus;
  paidOutDate: string | null;
  usdDisbursed: number | null;
  zecDisbursed: number | null;
  zecUsdRate: number | null;
}

export interface Milestone {
  label: string;
  numericOrder: number | null;
  amountUSD: number | null;
  estimateUSD: number | null;
  paidOutDate: string | null;
  usdDisbursed: number | null;
  zecDisbursed: number | null;
  zecUsdRate: number | null;
}

export interface GrantSummary {
  totalMilestones: number;
  totalAmountUSD: number;
  totalUsdDisbursed: number;
  totalZecDisbursed: number;
  completedPercent: number;
  completedMilestones: number;
}

export interface Grant {
  id: string;
  project: string;
  grantee: string;
  category: string;
  reportingFrequency: string | null;
  status: GrantStatus;
  milestones: Milestone[];
  summary: GrantSummary;
}

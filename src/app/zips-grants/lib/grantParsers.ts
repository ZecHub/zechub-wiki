import { GrantStatus } from "../types/grants";

export const parseMoney = (value?: string): number | null => {
  if (!value || value.trim() === "") return null;

  return Number(value.replace(/[$,]/g, "")) || 0;
};

export const parseNumber = (value?: string): number | null => {
  if (!value || value.trim() === "") return null;

  return Number(value);
};

export const normalizeStatus = (status: string): GrantStatus => {
  if (status === "Completed") return "Completed";
  if (status === "Cancelled") return "Cancelled";

  return "Open";
};

export const extractNumericMilestone = (label: string): number | null => {
  if (!label) return null;

  const match = label.match(/\d+/);
  return match ? Number(match[0]) : null;
};

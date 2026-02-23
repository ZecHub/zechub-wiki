import { GrantStatus } from "../types/grants";

export const parseMoney = (value?: string): number | null => {
  if (!value || value.trim() === "") return null;

  return Number(value.replace(/[$,]/g, "")) || 0;
};

export const parseNumber = (value?: string): number | null => {
  if (!value || value.trim() === "") return null;

  return Number(value);
};

export const normalizeStatus = (status?: string): GrantStatus => {
  if (status === "Complete") return "Completed";
  if (status === "Cancelled") return "Cancelled";

  return "Open";
};

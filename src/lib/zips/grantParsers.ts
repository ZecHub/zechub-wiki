import { GrantStatus } from "@/types/grants";

export const parseMoney = (value?: string): number | null => {
  if (!value || value.trim() === "") return null;

  return Number(value.replace(/[$,]/g, "")) || 0;
};

export const parseNumber = (value?: string): number | null => {
  if (!value || value.trim() === "") return null;

  const text = value.trim();
  // Sheets supplies formatted values, including thousands separators. Only
  // strip commas from valid groups so malformed amounts are not reinterpreted.
  if (text.includes(",") && !/^[+-]?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(text)) {
    return null;
  }

  const number = Number(text.replace(/,/g, ""));
  return Number.isFinite(number) ? number : null;
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

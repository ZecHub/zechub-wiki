import { MilestoneStatus } from "../types/grants";

const parseMoney = (value?: string): number | null => {
  if (!value || value.trim() === "") return null;

  return Number(value.replace(/[$,]/g, "")) || null;
};

export const parseNumber = (value?: string): number | null => {
  if (!value || value.trim() === "") return null;

  return Number(value) || null;
};

export const normalizeStatus = (status?: string): MilestoneStatus => {
  if (!status) return "Pending";
  if (status.toLowerCase() === "completed") return "Completed";
  
  return "In progress";
};

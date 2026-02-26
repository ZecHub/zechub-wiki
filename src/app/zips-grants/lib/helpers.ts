
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

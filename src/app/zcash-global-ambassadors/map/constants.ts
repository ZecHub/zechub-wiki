export type RegionFilter =
  | "all"
  | "africa"
  | "asia"
  | "americas"
  | "europe"
  | "oceania";

export const REGION_LABELS: Record<RegionFilter, string> = {
  all: "All regions",
  africa: "Africa",
  asia: "Asia",
  americas: "Americas",
  europe: "Europe",
  oceania: "Oceania",
};

export const REGION_COLORS: Record<Exclude<RegionFilter, "all"> | string, string> = {
  africa: "#F5A623",
  asia: "#4A90D9",
  americas: "#7ED321",
  europe: "#BD10E0",
  oceania: "#50E3C2",
};

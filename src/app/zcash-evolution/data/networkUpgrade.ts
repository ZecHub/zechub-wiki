export interface NetworkUpgrade {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  blockHeight: number | null;
  description: string;
  features: string[];
  zips: { number: number; title: string }[];
  privacyLevel: number; // 0-100
  privacyLabel: string;
  status: "past" | "current" | "future";
  eraColor: string; // HSL string for accent
}


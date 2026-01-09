export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "welcome" | "intro";
}

export const STAGES: Stage[] = [];

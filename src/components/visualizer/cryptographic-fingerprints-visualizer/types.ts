
export type HashType =
  | "intro"
  | "integrity"
  | "irreversible"
  | "collision"
  | "properties";

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "welcome" | "keys";
  amount?: string;
  keyType?: KeyType;
}

export const STAGES: Stage[] = [
  {
    id: 0,
    title: "Welcome",
    subtitle: "Ready to explore Zcash?",
    description: "Click the play button below to begin!",
    type: "welcome",
  },
 
];

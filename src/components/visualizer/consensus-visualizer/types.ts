export type ConsensusType = 'intro'| 'sybil' | 'soft-fork'| 'hard-fork'|'network-upgrade'

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "intro" | "consensus";
  consensusType?: ConsensusType;
}

export const STAGES: Stage[] = [


]

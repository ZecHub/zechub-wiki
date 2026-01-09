export type KeyType = 'intro' | 'transparent'|'shielded-overview' | 'sprout'| 'sapling' | 'orchard'

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "intro" | 'keys';
  keyType: KeyType
}

export const STAGES: Stage[] = [];

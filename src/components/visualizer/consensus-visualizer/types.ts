export type ConsensusType =
  | "intro"
  | "sybil"
  | "soft-fork"
  | "hard-fork"
  | "network-upgrade";

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "intro" | "consensus";
  consensusType?: ConsensusType;
}

export const STAGES: Stage[] = [
  {
    id: 0,
    title: 'Decentralized Consensus',
    subtitle: 'Agreement Without Authority',
    description: 'How do hundreds of nodes agree on chain state? Consensus mechanisms make it possible.',
    type: 'consensus',
    consensusType: 'intro',
  },
  {
    id: 1,
    title: 'Sybil Resistance',
    subtitle: 'Preventing Fake Identities',
    description: 'Proof-of-work ties voting power to real-world resources, preventing attackers from creating fake identities.',
    type: 'consensus',
    consensusType: 'sybil',
  },
  {
    id: 2,
    title: 'Soft Forks',
    subtitle: 'Backward-Compatible Changes',
    description: 'Soft forks tighten consensus rules. Old nodes still accept new blocks, maintaining network compatibility.',
    type: 'consensus',
    consensusType: 'soft-fork',
  },
  {
    id: 3,
    title: 'Hard Forks',
    subtitle: 'Breaking Changes',
    description: 'Hard forks change rules in incompatible ways. Without universal upgrade, the blockchain can split permanently.',
    type: 'consensus',
    consensusType: 'hard-fork',
  },
  {
    id: 4,
    title: 'Network Upgrades',
    subtitle: 'Planned Evolution',
    description: 'Zcash uses coordinated network upgrades — planned hard forks where the community agrees on changes in advance.',
    type: 'consensus',
    consensusType: 'network-upgrade',
  },
];

export type PoolType = "transparent" | "sapling" | "orchard";

export interface PoolData {
  type: PoolType;
  name: string;
  description: string;
  exampleAddress: string;
  addressPrefix: string;
  privacyLevel: "none" | "partial" | "full";
  color: string;
  glowColor: string;
}

export const POOLS: Record<PoolType, PoolData> = {
  transparent: {
    type: "transparent",
    name: "Transparent",
    description:
      "Like Bitcoin - all transaction details are publicly visible on the blockchain.",
    exampleAddress: "t1Rv4exT7bqhZqi2j7xz8bUHDMxwosrjADU",
    addressPrefix: "t1",
    privacyLevel: "none",
    color: "pool-transparent",
    glowColor: "pool-transparent-glow",
  },
  sapling: {
    type: "sapling",
    name: "Sapling",
    description:
      "Shielded transactions with zero-knowledge proofs. Sender, receiver, and amount are encrypted.",
    exampleAddress:
      "zs1z7rejlpsa98s2rrrfkwmaxu53e4ue0ulcrw0h4x5g8jl04tak0d3mm47vdtahatqrlkngh9sly",
    addressPrefix: "zs1",
    privacyLevel: "partial",
    color: "pool-sapling",
    glowColor: "pool-sapling-glow",
  },
  orchard: {
    type: "orchard",
    name: "Orchard",
    description:
      "Latest shielded protocol with enhanced privacy. Uses Unified Addresses for maximum anonymity.",
    exampleAddress: "u1rl84p7l9xq3cxu2yh2cks9v8qcgrpf25h4hgn0...unified",
    addressPrefix: "u1",
    privacyLevel: "full",
    color: "pool-orchard",
    glowColor: "pool-orchard-glow",
  },
};


export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "intro" | "pool" | "transaction" | "comparison";
  focusPool?: PoolType;
  transactionFrom?: PoolType;
  transactionTo?: PoolType;
  amount?: string;
}

export const STAGES: Stage[] = [
  {
    id: 0,
    title: "Understanding Privacy Pools",
    subtitle: "Introduction",
    description:
      "Explore how Zcash provides financial privacy through its innovative shielded pool technology.",
    type: "intro",
  },
  {
    id: 1,
    title: "Transparent Addresses",
    subtitle: "t-addresses",
    description:
      "Public transactions similar to Bitcoin. All details visible on the blockchain.",
    type: "pool",
    focusPool: "transparent",
  },
  {
    id: 2,
    title: "Sapling Addresses",
    subtitle: "z-addresses (zs1...)",
    description:
      "Shielded transactions using zero-knowledge proofs. Fast and private.",
    type: "pool",
    focusPool: "sapling",
  },
  {
    id: 3,
    title: "Orchard Protocol",
    subtitle: "Unified Addresses (u1...)",
    description:
      "The latest privacy protocol with enhanced anonymity and improved cryptography.",
    type: "pool",
    focusPool: "orchard",
  },
  {
    id: 4,
    title: "Shielding Transaction",
    subtitle: "Transparent → Shielded",
    description:
      "Move funds from transparent to shielded pool. Source is visible, but destination is hidden.",
    type: "transaction",
    transactionFrom: "transparent",
    transactionTo: "sapling",
    amount: "1.5 ZEC",
  },
  {
    id: 5,
    title: "Shielded Transfer",
    subtitle: "Shielded → Shielded",
    description:
      "Fully private transaction. Sender, receiver, and amount are all encrypted.",
    type: "transaction",
    transactionFrom: "sapling",
    transactionTo: "orchard",
    amount: "2.0 ZEC",
  },
  {
    id: 6,
    title: "Privacy Comparison",
    subtitle: "Understanding the Differences",
    description: "Compare privacy levels across all three pool types.",
    type: "comparison",
  },
];

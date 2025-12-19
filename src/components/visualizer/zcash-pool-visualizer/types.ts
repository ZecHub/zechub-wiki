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
  type: "welcome" | "intro" | "pool" | "transaction" | "comparison";
  focusPool?: PoolType;
  transactionFrom?: PoolType;
  transactionTo?: PoolType;
  amount?: string;
}

export const STAGES: Stage[] = [
  {
    id: 0,
    title: "Welcome",
    subtitle: "Ready to explore Zcash?",
    description: "Click the play button below to begin!",
    type: "welcome",
  },
  {
    id: 1,
    title: "Understanding Privacy Pools",
    subtitle: "Introduction",
    description:
      "Explore how Zcash provides financial privacy through its innovative shielded pool technology.",
    type: "intro",
  },
  {
    id: 2,
    title: "Transparent Addresses",
    subtitle: "t-addresses",
    description:
      "Public transactions similar to Bitcoin. All details visible on the blockchain.",
    type: "pool",
    focusPool: "transparent",
  },
  {
    id: 3,
    title: "Sapling Addresses",
    subtitle: "z-addresses (zs1...)",
    description:
      "Shielded transactions using zero-knowledge proofs. Fast and private.",
    type: "pool",
    focusPool: "sapling",
  },
  {
    id: 4,
    title: "Orchard Protocol",
    subtitle: "Unified Addresses (u1...)",
    description:
      "The latest privacy protocol with enhanced anonymity and improved cryptography.",
    type: "pool",
    focusPool: "orchard",
  },
  {
    id: 5,
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
    id: 6,
    title: "Shielded Transfer",
    subtitle: "Sapling → Orchard",
    description:
      "Cross-pool shielded transaction. Amount is visible on-chain, but sender and receiver remain hidden.",
    type: "transaction",
    transactionFrom: "sapling",
    transactionTo: "orchard",
    amount: "2.0 ZEC",
  },
  {
    id: 7,
    title: "Sapling Internal Transfer",
    subtitle: "Sapling → Sapling",
    description:
      "Fully private transaction within the Sapling pool. Sender, receiver, and amount are all encrypted.",
    type: "transaction",
    transactionFrom: "sapling",
    transactionTo: "sapling",
    amount: "0.5 ZEC",
  },
  {
    id: 8,
    title: "Orchard Internal Transfer",
    subtitle: "Orchard → Orchard",
    description:
      "Maximum privacy transaction within the Orchard pool. All details fully encrypted with latest cryptography.",
    type: "transaction",
    transactionFrom: "orchard",
    transactionTo: "orchard",
    amount: "2.30 ZEC",
  },
  {
    id: 9,
    title: "Transaction Privacy Matrix",
    subtitle: "Understanding the Nuances",
    description:
      "Privacy depends on transaction type. Compare what's visible across all possible transaction combinations.",
    type: "comparison",
  },
];

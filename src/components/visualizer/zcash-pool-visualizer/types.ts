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

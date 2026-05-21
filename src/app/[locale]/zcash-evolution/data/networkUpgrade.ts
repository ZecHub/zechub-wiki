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

export const networkUpgrades: NetworkUpgrade[] = [
  {
    id: "genesis",
    name: "Genesis / Sprout",
    subtitle: "The Beginning of Private Money",
    date: "October 28, 2016",
    blockHeight: 0,
    description:
      "Zcash launched as the first cryptocurrency with zk-SNARK based shielded transactions. The Sprout circuit introduced private transfers using JoinSplit proofs, establishing the foundation for financial privacy on a public blockchain.",
    features: [
      "First zk-SNARK cryptocurrency",
      "Sprout shielded pool (JoinSplit)",
      "Equihash proof-of-work",
      "Founders' Reward (10% of block rewards)",
    ],
    zips: [],
    privacyLevel: 20,
    privacyLabel: "Basic Shielded",
    status: "past",
    eraColor: "140 55% 45%",
  },
  {
    id: "overwinter",
    name: "Overwinter",
    subtitle: "The First Planned Upgrade",
    date: "June 25, 2018",
    blockHeight: 347500,
    description:
      "The first network upgrade established the framework for future upgrades. It introduced transaction expiry and replay protection, proving Zcash could evolve safely.",
    features: [
      "Transaction expiry (default 20 blocks)",
      "Replay protection across upgrades",
      "Transaction version groups",
      "Upgrade activation mechanism",
    ],
    zips: [
      { number: 201, title: "Network Peer Management for Overwinter" },
      { number: 202, title: "Version 3 Transaction Format for Overwinter" },
      { number: 203, title: "Transaction Expiry" },
    ],
    privacyLevel: 25,
    privacyLabel: "Foundation Set",
    status: "past",
    eraColor: "180 50% 40%",
  },
  {
    id: "sapling",
    name: "Sapling",
    subtitle: "The Privacy Breakthrough",
    date: "October 28, 2018",
    blockHeight: 419200,
    description:
      "A monumental upgrade that replaced Sprout's slow proving with Groth16 proofs, making shielded transactions 100x faster and enabling mobile wallet support for the first time.",
    features: [
      "Groth16 zk-SNARKs (100x faster proofs)",
      "New shielded pool with jubjub curve",
      "Sapling payment addresses & keys",
      "Sapling addresses and viewing keys",
      "Mobile-friendly shielded transactions",
      "Jubjub elliptic curve",
      "Diversified addresses for privacy",
    ],
    zips: [
      { number: 205, title: "Deployment of the Sapling Network Upgrade" },
      { number: 212, title: "Transfer and Withdraw Sapling Funds" },
      { number: 208, title: "Sapling consensus changes" },
    ],
    privacyLevel: 50,
    privacyLabel: "Efficient Privacy",
    status: "past",
    eraColor: "45 90% 50%",
  },
  {
    id: "blossom",
    name: "Blossom",
    subtitle: "Accelerating the Chain",
    date: "December 11, 2019",
    blockHeight: 653600,
    description:
      "Blossom doubled block production frequency from 150 seconds to 75 seconds, increasing throughput and reducing confirmation latency while maintaining the same issuance schedule.",
    features: [
      "Block time reduced to 75 seconds",
      "2x transaction throughput",
      "Adjusted block reward to maintain issuance",
      "Improved confirmation speed",
    ],
    zips: [
      { number: 206, title: "Deployment of the Blossom Network Upgrade" },
      { number: 208, title: "Shorter Block Target Spacing" },
      {
        number: 211,
        title: "Disabling Addition of New Value to the Sprout Chain Value Pool",
      },
    ],
    privacyLevel: 55,
    privacyLabel: "Faster Privacy",
    status: "past",
    eraColor: "330 60% 55%",
  },
  {
    id: "heartwood",
    name: "Heartwood",
    subtitle: "Mining Goes Private",
    date: "July 16, 2020",
    blockHeight: 903000,
    description:
      "Heartwood enabled shielded coinbase outputs, allowing miners to receive block rewards directly into shielded addresses. It also introduced FlyClient commitments to improve light client verification.",
    features: [
      "Shielded coinbase (miners paid privately)",
      "FlyClient block header commitments",
      "Improved light client verification",
      "Expanded protocol privacy coverage",
    ],
    zips: [
      { number: 213, title: "Shielded Coinbase" },
      { number: 221, title: "FlyClient - Consensus-Layer Changes" },
      { number: 250, title: "Deployment of the Heartwood Network Upgrade" },
    ],
    privacyLevel: 65,
    privacyLabel: "Deep Privacy",
    status: "past",
    eraColor: "15 70% 50%",
  },
  {
    id: "canopy",
    name: "Canopy",
    subtitle: "Sustainable Funding",
    date: "November 18, 2020",
    blockHeight: 1046400,
    description:
      "Canopy replaced the orignal Founders' Reward with a new Dev Fund, allocating 20% of block rewards to ECC, Zcash Foundation, and community grants. Deprecated Sprout shielding to encourage migration.",
    features: [
      "First block reward halving",
      "Dev Fund: 20% of block rewards",
      "Dev Fund allocation - 8% ECC, 7% ZF, 5% community grants",
      "Deprecated Sprout value pool",
    ],
    zips: [
      { number: 214, title: "Consensus Rules for a Zcash Dev Fund" },
      { number: 251, title: "Deployment of the Canopy Network Upgrade" },
      { number: 1014, title: "Establishing a Dev Fund for Zcash" },
    ],
    privacyLevel: 70,
    privacyLabel: "Governed Privacy",
    status: "past",
    eraColor: "260 50% 55%",
  },
  {
    id: "nu5",
    name: "NU5 / Orchard",
    subtitle: "Trustless Privacy",
    date: "May 31, 2022",
    blockHeight: 1687104,
    description:
      "NU5 introduced the Orchard shielded pool and the Halo 2 proving system, eliminating trusted setup ceremonies. It also introduced Unified Addresses to simplify user interactions across transparent and shielded pools.",
    features: [
      "Halo 2: no trusted setup required",
      "Orchard shielded pool (Pallas/Vesta curves)",
      "Unified Addresses (one address, all pools)",
      "Transaction Authorization using RedPallas",
      "Non-malleable transaction IDs",
    ],
    zips: [
      { number: 224, title: "Orchard Shielded Protocol" },
      { number: 225, title: "Version 5 Transaction Format" },
      { number: 244, title: "Transaction Identifier Non-Malleability" },
      { number: 252, title: "Deployment of the NU5 Network Upgrade" },
      { number: 316, title: "Unified Addresses and Unified Viewing Keys" },
    ],
    privacyLevel: 85,
    privacyLabel: "Trustless Privacy",
    status: "past",
    eraColor: "280 60% 55%",
  },
  {
    id: "nu6",
    name: "NU6",
    subtitle: "Treasury Lockbox Era",
    date: "November 23, 2024",
    blockHeight: 2726400,
    description:
      "NU6 introduced the lockbox treasury system to manage post-Dev-Fund funding and aligned Zcash governance for long-term sustainability following the second halving.",
    features: [
      "Lockbox treasury funding model",
      "Revised development funding streams",
      "Second Zcash halving",
      "Updated funding governance rules",
    ],
    zips: [
      { number: 236, title: "Blocks Should Balance Exactly" },
      {
        number: 1015,
        title: "Block Subsidy Allocation for Non-Direct Development Funding",
      },
      { number: 2001, title: "Lockbox Funding Streams" },
      { number: 253, title: "Deployment of the NU6 Network Upgrade" },
    ],
    privacyLevel: 90,
    privacyLabel: "Sustainable Privacy",
    status: "past",
    eraColor: "45 100% 55%",
  },
  {
    id: "nu6_1",
    name: "NU6.1",
    subtitle: "Funding Governance Upgrade",
    date: "November 24, 2025",
    blockHeight: 3146400,
    description:
      "NU6.1 refined the treasury governance introduced in NU6 by enabling community and coinholder participation in funding decisions and implementing a one-time lockbox disbursement mechanism.",
    features: [
      "Community and coinholder funding model",
      "Deferred lockbox disbursement mechanism",
      "Extension of development funding rules",
      "Improved Orchard RPC reporting",
    ],
    zips: [
      { number: 255, title: "Deployment of the NU6.1 Network Upgrade" },
      { number: 271, title: "Deferred Dev Fund Lockbox Disbursement" },
      { number: 1016, title: "Community and Coinholder Funding Model" },
    ],
    privacyLevel: 92,
    privacyLabel: "Community-Governed Privacy",
    status: "current",
    eraColor: "60 95% 55%",
  },
  {
    id: "nu7",
    name: "NU7",
    subtitle: "Shielded Assets Era",
    date: "TBD",
    blockHeight: null,
    description:
      "NU7 is expected to introduce Zcash Shielded Assets (ZSAs), enabling issuance and transfer of private tokens directly within the Orchard shielded protocol along with a new version 6 transaction format.",
    features: [
      "Zcash Shielded Assets (custom private tokens)",
      "Cross-chain bridges & interoperability",
      "Further scalability improvements",
      "Version 6 transaction format",
      "Memo bundles for improved metadata",
      "Network sustainability mechanisms",
      "Potential fee burn and issuance smoothing",
    ],
    zips: [
      { number: 226, title: "Zcash Shielded Assets" },
      { number: 227, title: "Issuance of Zcash Shielded Assets" },
      { number: 230, title: "Version 6 Transaction Format" },
      { number: 231, title: "Memo Bundles" },
      { number: 233, title: "Removing Funds From Circulation" },
      { number: 234, title: "Issuance Smoothing" },
      { number: 235, title: "Transaction Fee Burn Mechanism" },
      { number: 246, title: "Digests for Version 6 Transactions" },
    ],
    privacyLevel: 100,
    privacyLabel: "Programmable Privacy",
    status: "future",
    eraColor: "45 100% 65%",
  },
];

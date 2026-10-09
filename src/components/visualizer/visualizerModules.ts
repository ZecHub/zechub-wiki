export const BASIC_VISUALIZER_MODULES = [
  {
    id: "zcash-wallet",
    title: "Introduction to Zcash Wallets",
    description: "Providing Shielded Functionality",
  },
  {
    id: "pool",
    title: "Value Pools & Address Types",
    description:
      "Explore Zcash privacy pools, address types and the Ironwood migration",
  },
  {
    id: "pay-with-zcash",
    title: "Pay with Zcash",
    description: "Discover where and how to use ZEC for private payments",
  },
  {
    id: "zcash-dex",
    title: "Zcash Exchanges (DEX)",
    description:
      "Permissionless, censorship-resistant access to ZEC using decentralized exchanges",
  },
  {
    id: "hash-function",
    title: "Hash Functions",
    description: "What is a Hash Function?",
  },
  {
    id: "blockchain-foundation",
    title: "Zcash Blockchain Fundamentals",
    description: "Understanding Zcash Blockchain Foundation",
  },
  {
    id: "distributed-database",
    title: "Distributed Databases",
    description: "Compare centralized databases with blockchains",
  },
] as const;

export const ADVANCED_VISUALIZER_MODULES = [
  {
    id: "zkproof",
    title: "zk-SNARKs",
    description: "Interactive demonstration of shielded transactions",
  },
  {
    id: "build-shielded-transaction",
    title: "Build a Shielded Transaction",
    description: "Step-by-step construction of a shielded transaction",
  },
  {
    id: "CrossLink-Protocol",
    title: "CrossLink Protocol",
    description: "Hybrid PoW + BFT finality: How Crosslink seals Zcash blocks",
  },
  {
    id: "zcash-key",
    title: "Zcash Keys",
    description: "Understanding Zcash Keys",
  },
  {
    id: "infrastructure",
    title: "Zcash Infrastructure",
    description: "How Zcash components work together",
  },
  {
    id: "consensus",
    title: "Consensus",
    description: "How do hundreds of nodes agree on chain state?",
  },
  {
    id: "mining-halo",
    title: "Zcash Mining",
    description:
      "Understanding Equihash mining and recursive zero-knowledge proofs",
  },
  {
    id: "privacy-use-cases",
    title: "Privacy Use Cases",
    description: "Real-world applications of privacy technology on Zcash",
  },
  {
    id: "governance",
    title: "Governance & Dev Fund",
    description:
      "Community-driven development and decentralized decision making",
  },
  {
    id: "frost-multisig",
    title: "FROST & Private Multi Signatures",
    description: "Secure multisig without a single point of failure",
  },
] as const;

export const CONTRIBUTOR_VISUALIZER_MODULES = [
  {
    id: "zechub-bounties",
    title: "ZecHub Bounties",
    description:
      "Claim bounties on bounties.zechub.wiki and get paid natively in ZEC",
  },
  {
    id: "dao-proposal",
    title: "DAO Proposals",
    description:
      "Step-by-step guide to creating a ZecHub DAO governance proposal",
  },
  {
    id: "zcash-community-grants",
    title: "Zcash Community Grants",
    description: "Funding for Zcash ecosystem projects",
  },
  {
    id: "coinholder-grants",
    title: "Coinholder Directed Grants",
    description: "Retroactive funding directed by ZEC holders",
  },
  {
    id: "open-source-repos",
    title: "Open Source Repositories",
    description: "Contribute to Zcash open source projects",
  },
  {
    id: "zkav-club",
    title: "ZKAV Club Opportunities",
    description:
      "Privacy-first audiovisual roles and paid gigs with the Zero-knowledge Audiovisual Club",
  },
] as const;

export const VISUALIZER_MODULES = [
  ...BASIC_VISUALIZER_MODULES,
  ...ADVANCED_VISUALIZER_MODULES,
  ...CONTRIBUTOR_VISUALIZER_MODULES,
] as const;

export type VisualizerModuleInfo = (typeof VISUALIZER_MODULES)[number];
export type VisualizerModuleId = VisualizerModuleInfo["id"];

export const VISUALIZER_MODULE_IDS = VISUALIZER_MODULES.map(({ id }) => id);

export function findVisualizerModule(
  moduleId: string | null | undefined,
): VisualizerModuleInfo | null {
  const normalized = moduleId?.trim().toLowerCase();
  if (!normalized) return null;

  return (
    VISUALIZER_MODULES.find(({ id }) => id.toLowerCase() === normalized) ?? null
  );
}

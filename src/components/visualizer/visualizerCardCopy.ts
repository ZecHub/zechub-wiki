export type VisualizerCardSource = {
  id: string;
  title: string;
  description: string;
};

export const VISUALIZER_I18N_KEYS: Record<string, string> = {
  "zcash-wallet": "wallets",
  pool: "pools",
  "pay-with-zcash": "payWith",
  "zcash-dex": "dex",
  "hash-function": "hashFunction",
  "blockchain-foundation": "blockchain",
  zkproof: "zkproof",
  "zcash-key": "keys",
  infrastructure: "infrastructure",
  consensus: "consensus",
  "mining-halo": "miningHalo",
  "privacy-use-cases": "privacyUseCases",
  governance: "governance",
  "zechub-bounties": "bounties",
  "dao-proposal": "daoProposal",
  "zcash-community-grants": "communityGrants",
  "coinholder-grants": "coinholderGrants",
  "open-source-repos": "openSource",
};

export function visualizerCardCopy(
  t: { visualizer?: Record<string, { title?: string; description?: string }> },
  v: VisualizerCardSource,
) {
  const section = t?.visualizer;
  const key = VISUALIZER_I18N_KEYS[v.id] ?? v.id;
  const entry = section?.[key];
  return {
    title: entry?.title ?? v.title,
    description: entry?.description ?? v.description,
  };
}

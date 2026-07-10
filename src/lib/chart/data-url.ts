export const DATA_URL = {
  defaultUrl: "/data/zcash/shielded_supply.json",
  sproutUrl: "/data/zcash/sprout_supply.json",
  saplingUrl: "/data/zcash/sapling_supply.json",
  totalSupplyUrl: "/data/zcash/total_supply.json",
  orchardUrl: "/data/zcash/orchard_supply.json",
  txsummaryUrl: "/data/zcash/transaction_summary.json",
  transparentSupplyUrl: "/data/zcash/transparent_supply.json",
  netInflowsOutflowsUrl: "/data/zcash/netinflowoutflow.json",
  nodecountUrl: "/data/zcash/nodecount.json",
  difficultyUrl: "/data/zcash/difficulty.json",
  lockboxUrl: "/data/zcash/lockbox.json",
  ironwoodUrl: "/data/zcash/ironwood_supply.json",
  shieldedTxCountUrl: "/data/zcash/shieldedtxcount.json",
  issuanceUrl: "/data/zcash/issuance.json",
  zcashShieldedStatsUrl: "/data/zcash/shieldedStatsJSON.json",
  shieldedUrl:
    "/api/data-updated?path=public/data/zcash/shielded_supply.json",
  namadaSupplyUrl: "/data/namada/namada_supply.json",
  blockchainInfoUrl: "/api/blockchain-info",
  // Server-side proxy (key stays out of the browser) — see pages/api/blockchain-data.
  blockchairUrl: "/api/blockchain-data",
  namadaRewardUrl: "/data/namada/namada_rewards_rate.json",
  blockFeesUrl: "/data/zcash/blockFeesZEC.json",
  networkSolpsUrl: "/data/zcash/networksolps.json",
  daoProps: "/data/juno/zechub.json",
  miningHistoryUrl: "/api/mining-history",
  miningPoolsUrl: "/api/mining-pools",
  miningPoolsDominanceUrl: "/api/mining-pools-dominance",
} as const;

// All "last updated" lookups go through the same-origin /api/data-updated proxy
// (server-side GitHub token + caching) instead of the browser hitting
// api.github.com directly.
export const DATE_URL = {
  defaultUrl:
    "/api/data-updated?path=public/data/zcash/shielded_supply.json",
  sproutUrl:
    "/api/data-updated?path=public/data/zcash/sprout_supply.json",
  saplingUrl:
    "/api/data-updated?path=public/data/zcash/sapling_supply.json",
  orchardUrl:
    "/api/data-updated?path=public/data/zcash/orchard_supply.json",
  txsummaryUrl:
    "/api/data-updated?path=public/data/zcash/transaction_summary.json",
  transparentSupplyUrl:
    "/api/data-updated?path=public/data/zcash/transparent_supply.json",
  netInflowsOutflowsUrl:
    "/api/data-updated?path=public/data/zcash/netinflowoutflow.json",
  nodecountUrl:
    "/api/data-updated?path=public/data/zcash/nodecount.json",
  difficultyUrl:
    "/api/data-updated?path=public/data/zcash/difficulty.json",
  lockboxUrl:
    "/api/data-updated?path=public/data/zcash/lockbox.json",
  ironwoodUrl:
    "/api/data-updated?path=public/data/zcash/ironwood_supply.json",
  shieldedTxCountUrl:
    "/api/data-updated?path=public/data/zcash/shieldedtxcount.json",
  issuanceUrl:
    "/api/data-updated?path=public/data/zcash/issuance.json",
  shieldedUrl:
    "/api/data-updated?path=public/data/zcash/shielded_supply.json",
  namadaSupplyUrl:
    "/api/data-updated?path=public/data/namada/namada_supply.json",
  blockchainInfoUrl: "/api/blockchain-info",
  blockchairUrl: "/api/blockchain-data",
  namadaRewardUrl:
    "/api/data-updated?path=public/data/namada/namada_rewards_rate.json",
  zcashShieldedStatsUrl:
    "/api/data-updated?path=public/data/zcash/shieldedStatsJSON.json",
  totalSupplyUrl:
    "/api/data-updated?path=public/data/zcash/total_supply.json",
} as const;
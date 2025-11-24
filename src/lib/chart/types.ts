export interface BlockchainInfo {
  blocks: number;
  transactions_24h: number;
  market_cap_usd: number;
  market_price_usd: number;
  market_price_btc: number;
}

export type PoolKey = "default" | "sprout" | "sapling" | "orchard";
export type NamadaAsset = { id: string; totalSupply: string };
export type SupplyData = { close: string; supply: number };
export type ShieldedTxCount = {
  sapling: number;
  orchard: number;
  timestamp: string;
};
export type NodeCountData = { Date: string; nodecount: string };

/**
 * Type of values from the shielded pool over time. Each datum is amount
 * shielded at a given date.
 */
export type ShieldedAmountDatum = {
  close: string;
  supply: number;
  Date: string;
  Hashrate: any;
};

export interface ShieldedPoolChartProps {
  dataUrl: string;
  color: string;
}

export type ShieldedSupplyLastUpdated = string;

export type Issuance = {
  Date: string;
  "ZEC Issuance": string;
  "ZEC  Supply": string;
  "Current Inflation (%)": string;
  "Unnamed: 4": string;
  "ZIP 234": string;
  "Unnamed: 6": string;
};

export type IssuanceParsed = {
  Date: string;
  zecIssuance: number;
  zecSupply: number;
  inflation: number;
};

export type Difficulty = {
  Date: string;
  Difficulty: string;
};

export type totalSupply = {
  close: string;
  supply : string;
};

export type BlockFees = {
  Block: string;
  Fees: string;
};

export type NetInOutflow = {
  Date: string;
  "Net Sapling Flow": string;
  "Net Orchard Flow": string;
};

export type LockBox = {
  Date: string;
  lockbox: string;
};

export type BlockchainNetwork = "Zcash" | "Namada" | "Penumbra";

export type FlattenedTokenData = {
  Date: string;
  [tokenId: string]: number | string; // `Date` is string, others are numbers
};

export type ShieldedTransactionDatum = {
  height: number;
  sapling: number;
  sapling_filter: number;
  orchard: number;
  orchard_filter: number;
};

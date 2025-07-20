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

export type BlockchainNetwork = "Zcash" | "Namada" | "Penumbra";

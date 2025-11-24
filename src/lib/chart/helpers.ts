import { DATE_URL } from "./data-url";
import {
  BlockchainInfo,
  Difficulty,
  Issuance,
  IssuanceParsed,
  LockBox,
  NetInOutflow,
  NodeCountData,
  ShieldedAmountDatum,
  ShieldedTransactionDatum,
  ShieldedTxCount,
  SupplyData,
  BlockFees,
} from "./types";

export async function getBlockchainData(
  url: string,
  signal?: AbortSignal
): Promise<BlockchainInfo | null> {
  try {
    const res = await fetch(url, {
      signal,
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as BlockchainInfo;
  } catch {
    return null;
  }
}
export async function getIssuanceData(
  url: string,
  signal?: AbortSignal
): Promise<IssuanceParsed[] | null> {
  try {
    const res = await fetch(url, {
      signal,
    });
    if (!res.ok) return null;
    const data: Issuance[] = await res.json();

    const parsed = data.map((entry) => ({
      Date: entry.Date,
      zecIssuance: parseFloat(entry["ZEC  Supply"]),
      zecSupply: parseFloat(entry["ZEC  Supply"]),
      inflation: parseFloat(entry["Current Inflation (%)"]),
    }));

    return parsed;
  } catch {
    return null;
  }
}

export async function getZcashCirculationCount(
  url: string,
  signal?: AbortSignal
): Promise<number | null> {
  try {
    const res = await fetch(url, {
      signal,
    });
    if (!res.ok) return null;
    const json = await res.json();
    return parseInt(json.chainSupply.chainValueZat, 10) * 1e-8;
  } catch {
    return null;
  }
}

export async function getSupplyData(
  url: string,
  signal?: AbortSignal
): Promise<SupplyData[]> {
  try {
    const res = await fetch(url, {
      signal,
    });
    if (!res.ok) return [];
    return (await res.json()) as SupplyData[];
  } catch {
    return [];
  }
}

export async function getLastUpdatedDate(
  url: string,
  signal?: AbortSignal
): Promise<string> {
  try {
    const res = await fetch(url, {
      signal,
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ZecHub-App",
      },
    });

    if (!res.ok) return "N/A";
    const d = await res.json();

    console.log("d", d);

    return d[d.length - 1]?.commit?.committer?.date ?? "N/A";
  } catch {
    return "N/A";
  }
}

export function getCommitUrlForTab(tabLabel: string): string {
  const urlMap: Record<string, string> = {
    supply: DATE_URL.shieldedUrl,
    difficulty: DATE_URL.difficultyUrl,
    issuance: DATE_URL.issuanceUrl,
    lockbox: DATE_URL.lockboxUrl,
    flows: DATE_URL.netInflowsOutflowsUrl,
    "node count": DATE_URL.nodecountUrl,
    "tx summary": DATE_URL.txsummaryUrl,
    "privacy set": DATE_URL.shieldedTxCountUrl,
    rewards: DATE_URL.namadaRewardUrl,
    transparent: DATE_URL.transparentSupplyUrl,
    "shielded stats": DATE_URL.zcashShieldedStatsUrl,
    "Halving Meter": "",
    "total supply": DATE_URL.totalSupplyUrl,
  };

  return urlMap[tabLabel] || DATE_URL.defaultUrl;
}

export async function getShieldedTxCount(
  url: string,
  signal?: AbortSignal
): Promise<ShieldedTxCount[] | null> {
  try {
    const res = await fetch(url, {
      signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as ShieldedTxCount[];
  } catch {
    return null;
  }
}

export async function getNodeCountData(
  url: string,
  signal?: AbortSignal
): Promise<NodeCountData[]> {
  try {
    const res = await fetch(url, {
      signal,
    });
    if (!res.ok) return [];
    return (await res.json()) as NodeCountData[];
  } catch {
    return [];
  }
}

export async function getLockboxData(
  url: string,
  signal?: AbortSignal
): Promise<LockBox[]> {
  try {
    const res = await fetch(url, { signal });

    if (!res.ok) {
      console.warn(`Fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: any[] = await res.json();
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn("Fetch aborted.");
    } else {
      console.error(err.message || err);
    }
    return [];
  }
}
export async function getNetInOutflowData(
  url: string,
  signal?: AbortSignal
): Promise<NetInOutflow[]> {
  try {
    const res = await fetch(url, { signal });

    if (!res.ok) {
      console.warn(`Fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: any[] = await res.json();
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn("Fetch aborted.");
    } else {
      console.error(err.message || err);
    }
    return [];
  }
}
export async function getDifficultyData(
  url: string,
  signal?: AbortSignal
): Promise<Difficulty[]> {
  try {
    const res = await fetch(url, { signal });

    if (!res.ok) {
      console.warn(`Fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: any[] = await res.json();
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn("Fetch aborted.");
    } else {
      console.error(err.message || err);
    }
    return [];
  }
}

export async function getTotalSupplyData(
  url: string,
  signal?: AbortSignal
): Promise<any[]> {
  try {
    const res = await fetch(url, { signal });

    if (!res.ok) {
      console.warn(`Fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }
    
    const data: any[] = await res.json();
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn("Fetch aborted.");
    }
    else {
      console.error(err.message || err);
    }
    return [];
  }
}

export async function getBlockFeesData(
  url: string,
  signal?: AbortSignal
): Promise<BlockFees[]> {
  try {
    const res = await fetch(url, { signal });

    if (!res.ok) {
      console.warn(`Fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: any[] = await res.json();
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn("Fetch aborted.");
    } else {
      console.error(err.message || err);
    }
    return [];
  }
}

export async function getNamadaSupply(
  url: string,
  signal?: AbortSignal
): Promise<any[]> {
  try {
    const res = await fetch(url, { signal });

    if (!res.ok) {
      console.warn(`Fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: any[] = await res.json();
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn("Fetch aborted.");
    } else {
      console.error("Error fetching Namada supply:", err.message || err);
    }
    return [];
  }
}

export async function fetchTransactionData(
  url: string
): Promise<Array<ShieldedTransactionDatum>> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}
/**
 * Loads the historic shielded pool data from a public json file in Github repo
 * @returns Promise of shielded pool data
 */
export async function fetchShieldedSupplyData(
  url: string,
  signal?: AbortSignal
): Promise<Array<ShieldedAmountDatum>> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

export function formatDate(s: string | null): string {
  if (!s) return "N/A";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
}

export function transformSupplyData(
  d: SupplyData | null
): { timestamp: string; supply: number } | null {
  return d ? { timestamp: d.close, supply: d.supply } : null;
}

export type PoolType = "sprout" | "sapling" | "orchard";
export const getColorForPool = (poolKey: PoolType): string => {
  switch (poolKey) {
    case "sprout":
      return "hsl(var(--chart-1))";
    case "sapling":
      return "hsl(var(--chart-2))";
    case "orchard":
      return "hsl(var(--chart-3))";
    default:
      return "#999999"; // fallback gray
  }
};

export function formatNumberShort(num: number): string {
  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 1_000_000_000)
    return `${sign}${(absNum / 1_000_000_000).toFixed(1)}B`;
  if (absNum >= 1_000_000) return `${sign}${(absNum / 1_000_000).toFixed(1)}M`;
  if (absNum >= 1_000) return `${sign}${(absNum / 1_000).toFixed(1)}k`;

  return `${sign}${absNum.toLocaleString()}`;
}

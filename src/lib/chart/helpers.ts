import {
  BlockchainInfo,
  Difficulty,
  Issuance,
  LockBox,
  NetInOutflow,
  NodeCountData,
  ShieldedAmountDatum,
  ShieldedTxCount,
  SupplyData,
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
): Promise<Issuance[] | null> {
  try {
    const res = await fetch(url, {
      signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function getBlockchainInfo(
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
    });
    if (!res.ok) return "N/A";
    const d = await res.json();

    return d[0]?.commit?.committer?.date ?? "N/A";
  } catch {
    return "N/A";
  }
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

/**
 * Loads the historic shielded pool data from a public json file in Github repo
 * @returns Promise of shielded pool data
 */
export async function fetchShieldedSupplyData(
  url: string
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

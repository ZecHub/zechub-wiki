export type ZcashNetwork = "mainnet" | "testnet" | "unknown";

export function detectZcashNetwork(addr: string): ZcashNetwork {
  if (!addr) return "unknown";

  // Testnet
  if (
    addr.startsWith("tm") ||
    addr.startsWith("utest1") ||
    addr.startsWith("ztestsapling")
  ) {
    return "testnet";
  }

  // Mainnet
  if (
    addr.startsWith("t1") ||
    addr.startsWith("zs1") ||
    addr.startsWith("u1")
  ) {
    return "mainnet";
  }

  return "unknown";
}

export function encodeMemo(memo: string) {
  try {
    const b64 = btoa(unescape(encodeURIComponent(memo)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return undefined;
  }
}

export async function fetchZecPrice(
  url: string,
  amount: string,
  currency: string,
) {
  return await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          from: currency,
          to: "zec",
        }),
      });
}

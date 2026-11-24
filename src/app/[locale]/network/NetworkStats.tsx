"use client";

import { useEffect, useState } from "react";
import { DATA_URL } from "@/lib/chart/data-url";
import { getBlockchainData } from "@/lib/chart/helpers";
import type { BlockchainInfo } from "@/lib/chart/types";

type Price = { usd: number; change: number | null };

const PRICE_URL =
  "/api/prices/simple?ids=zcash&vs_currencies=usd&include_24hr_change=true";

const NA = "—";

// Live summary strip for the Network hub. It reuses the same sources as the
// Ecosystem Dashboard (CoinGecko proxy + Cipherscan via /api/blockchain-data),
// so the numbers match. Each card falls back to a dash if its source is down.
export default function NetworkStats() {
  const [price, setPrice] = useState<Price | null>(null);
  const [chain, setChain] = useState<BlockchainInfo | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(PRICE_URL, { signal: controller.signal });
        if (res.ok) {
          const z = (await res.json())?.zcash;
          if (typeof z?.usd === "number") {
            setPrice({
              usd: z.usd,
              change:
                typeof z.usd_24h_change === "number" ? z.usd_24h_change : null,
            });
          }
        }
      } catch {
        // keep the dash
      }
    })();
    getBlockchainData(DATA_URL.blockchainDataUrl, controller.signal).then(
      (data) => data && setChain(data),
    );
    return () => controller.abort();
  }, []);

  const shieldedPct =
    chain?.shielded_value_zec && chain?.circulation
      ? (chain.shielded_value_zec / chain.circulation) * 100
      : null;

  const stats = [
    {
      label: "ZEC price",
      value: price ? `$${price.usd.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : NA,
      note:
        price?.change != null
          ? `${price.change >= 0 ? "+" : ""}${price.change.toFixed(1)}% (24h)`
          : "USD",
      tone:
        price?.change == null
          ? ""
          : price.change >= 0
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-red-700 dark:text-red-400",
    },
    {
      label: "Shielded supply",
      value: shieldedPct != null ? `${shieldedPct.toFixed(1)}%` : NA,
      note: "of circulating ZEC",
      tone: "",
    },
    {
      label: "Block height",
      value: chain?.blocks ? chain.blocks.toLocaleString("en-US") : NA,
      note: "latest block",
      tone: "",
    },
    {
      label: "Circulating supply",
      value:
        chain?.circulation != null
          ? Math.round(chain.circulation).toLocaleString("en-US")
          : NA,
      note: "ZEC",
      tone: "",
    },
  ];

  return (
    <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03]"
        >
          <dt className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {s.label}
          </dt>
          <dd className="mt-2 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
            {s.value}
          </dd>
          <p className={`mt-1 text-xs ${s.tone || "text-muted-foreground"}`}>
            {s.note}
          </p>
        </div>
      ))}
    </dl>
  );
}

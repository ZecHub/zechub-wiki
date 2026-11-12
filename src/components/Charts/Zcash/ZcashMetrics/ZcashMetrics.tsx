"use client";

import { useInMobile } from "@/hooks/useInMobile";
import { DATA_URL } from "@/lib/chart/data-url";
import {
  getBlockchainData,
  getShieldedTxCount,
  getZecPrice,
} from "@/lib/chart/helpers";
import { BlockchainInfo, ShieldedTxCount, ZecPrice } from "@/lib/chart/types";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ErrorBoundary } from "../../../ErrorBoundary/ErrorBoundary";
import { MetricCard, MetricCardSkeleton } from "./MetricCard";
import Link from "next/link";

// Icons
import {
  DollarSign,
  Coins,
  TrendingUp,
  Bitcoin,
  Cuboid,
  Activity,
  ShieldCheck,
  Lock,
  ChevronRight,
} from "lucide-react";

interface ZcashStatisticsPorps {}

export function ZcashMetrics(props: ZcashStatisticsPorps) {
  const isMobile = useInMobile();
  const { t } = useLanguage();
  const metricT = t?.pages?.dashboard?.charts?.zcashMetrics;
  const notAvailable = metricT?.notAvailable || "N/A";

  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<ZecPrice | null>(null);
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>();
  const [shieldedTxCount, setShieldedTxCount] = useState<
    ShieldedTxCount[] | null
  >([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [chainData, priceData, shieldedTxCount] = await Promise.all([
          getBlockchainData(DATA_URL.blockchainDataUrl, controller.signal),
          getZecPrice(DATA_URL.pricesUrl, controller.signal),
          getShieldedTxCount(DATA_URL.shieldedTxCountUrl, controller.signal),
        ]);

        if (chainData) {
          setBlockchainInfo(chainData);
        }

        if (priceData) {
          setPrice(priceData);
        }

        if (shieldedTxCount) {
          setShieldedTxCount(shieldedTxCount);
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchAllData();

    return () => {
      controller.abort();
    };
  }, []);

  const metricsObj = [
    {
      label: metricT?.marketCap || "Market Cap",
      value: price?.usd_market_cap
        ? `$${Math.round(price.usd_market_cap).toLocaleString()}`
        : notAvailable,
      icon: <DollarSign size={18} />,
    },
    {
      label: metricT?.circulation || "Circulation",
      value: blockchainInfo?.circulation
        ? `${Math.round(blockchainInfo.circulation).toLocaleString()} ZEC`
        : notAvailable,
      icon: <Coins size={18} />,
    },
    {
      label: metricT?.shieldedValue || "Shielded Value",
      value:
        blockchainInfo?.shielded_value_zec && price?.usd
          ? `$${Math.round(blockchainInfo.shielded_value_zec * price.usd).toLocaleString()}`
          : notAvailable,
      icon: <Lock size={18} />,
    },
    {
      label: metricT?.marketPriceUsd || "Market Price (USD)",
      value: price?.usd ? `$${price.usd.toFixed(2)}` : notAvailable,
      icon: <TrendingUp size={18} />,
    },
    {
      label: metricT?.marketPriceBtc || "Market Price (BTC)",
      value: price?.btc
        ? isMobile
          ? Number(price.btc).toFixed(4)
          : Number(price.btc).toFixed(8)
        : notAvailable,
      icon: <Bitcoin size={18} />,
    },
    {
      label: metricT?.blocks || "Blocks",
      value: blockchainInfo?.blocks
        ? blockchainInfo?.blocks.toLocaleString()
        : notAvailable,
      icon: <Cuboid size={18} />,
    },
    {
      label: metricT?.transactions24h || "24h Transactions",
      value:
        blockchainInfo?.transactions_24h != null
          ? blockchainInfo.transactions_24h.toLocaleString()
          : notAvailable,
      icon: <Activity size={18} />,
    },
    {
      label: metricT?.shieldedTx24h || "Shielded TX (24h)",
      value: shieldedTxCount?.length
        ? [
            `Sprout: ${(shieldedTxCount.at(-1)!.sprout ?? 0).toLocaleString()}`,
            `Sapling: ${(shieldedTxCount.at(-1)!.sapling ?? 0).toLocaleString()}`,
            `Orchard: ${(shieldedTxCount.at(-1)!.orchard ?? 0).toLocaleString()}`,
            `Ironwood: ${(shieldedTxCount.at(-1)!.ironwood ?? 0).toLocaleString()}`,
          ].join("\n")
        : notAvailable,
      icon: <ShieldCheck size={18} />,
      isShielded: true,
    },
  ];

  return (
    <ErrorBoundary
      fallback={metricT?.loadError || "Failed to load Zcash Metrics"}
    >
      <div className="my-12">
        <h2 className="font-bold text-xl text-slate-700 dark:text-slate-100">
          {metricT?.title || "Zcash Metrics"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
          {loading
            ? metricsObj.map(({ label }) => (
                <MetricCardSkeleton key={label} />
              ))
            : metricsObj.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  icon={metric.icon}
                  isShielded={metric.isShielded}
                />
              ))}
        </div>

        {/* Chain State Explorer pill — sits under metrics, above Analytics Charts */}
        <Link
          href="/chain-stats"
          className="mt-6 flex items-center justify-between gap-3 w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-violet-500/60 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:text-violet-700 dark:hover:text-violet-300 transition-all duration-200 group"
        >
          <span className="flex items-center gap-3">
            {/* Colorful chain-state icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="csGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="csGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              {/* Outer chain links */}
              <path
                d="M7.5 4.5a3 3 0 0 1 3 3v1.5h1.5a3 3 0 1 1 0 6H10.5v1.5a3 3 0 1 1-3 3H6a3 3 0 0 1-3-3v-1.5H1.5a3 3 0 1 1 0-6H3V7.5a3 3 0 0 1 3-3h1.5z"
                stroke="url(#csGrad1)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Inner accent bars */}
              <rect x="9" y="8" width="2" height="8" rx="0.5" fill="url(#csGrad2)" />
              <rect x="13" y="6" width="2" height="12" rx="0.5" fill="url(#csGrad1)" />
              <rect x="17" y="9" width="2" height="6" rx="0.5" fill="url(#csGrad2)" />
            </svg>
            <span>Chain State Explorer</span>
          </span>
          <ChevronRight
            size={18}
            className="shrink-0 text-slate-400 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>
    </ErrorBoundary>
  );
}

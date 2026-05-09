"use client";

import { useInMobile } from "@/hooks/useInMobile";
import { DATA_URL } from "@/lib/chart/data-url";
import {
  getBlockchainData,
  getShieldedTxCount,
  getZcashCirculationCount,
} from "@/lib/chart/helpers";
import { BlockchainInfo, ShieldedTxCount } from "@/lib/chart/types";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ErrorBoundary } from "../../../ErrorBoundary/ErrorBoundary";
import { MetricCard, MetricCardSkeleton } from "./MetricCard";

// Icons
import {
  DollarSign,
  Coins,
  TrendingUp,
  Bitcoin,
  Cuboid,
  Activity,
  ShieldCheck,
} from "lucide-react";

interface ZcashStatisticsPorps {}

export function ZcashMetrics(props: ZcashStatisticsPorps) {
  const isMobile = useInMobile();
  const { t } = useLanguage();
  const metricT = t?.pages?.dashboard?.charts?.zcashMetrics;
  const notAvailable = metricT?.notAvailable || "N/A";

  const [loading, setLoading] = useState(true);
  const [circulation, setCirculation] = useState<number | null>(null);
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>();
  const [shieldedTxCount, setShieldedTxCount] = useState<
    ShieldedTxCount[] | null
  >([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [chainData, circulationInfo, shieldedTxCount] = await Promise.all([
          getBlockchainData(DATA_URL.blockchairUrl, controller.signal),
          getZcashCirculationCount(DATA_URL.blockchainInfoUrl, controller.signal),
          getShieldedTxCount(DATA_URL.shieldedTxCountUrl, controller.signal),
        ]);

        if (chainData) {
          setBlockchainInfo(chainData);
        }

        if (circulationInfo) {
          setCirculation(circulationInfo);
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
      value: blockchainInfo?.market_cap_usd
        ? `$${blockchainInfo?.market_cap_usd.toLocaleString()}`
        : notAvailable,
      icon: <DollarSign size={18} />,
    },
    {
      label: metricT?.circulation || "Circulation",
      value: circulation
        ? `${circulation?.toLocaleString()} ZEC`
        : notAvailable,
      icon: <Coins size={18} />,
    },
    {
      label: metricT?.marketPriceUsd || "Market Price (USD)",
      value: blockchainInfo?.market_price_usd
        ? `$${blockchainInfo?.market_price_usd.toFixed(2)}`
        : notAvailable,
      icon: <TrendingUp size={18} />,
    },
    {
      label: metricT?.marketPriceBtc || "Market Price (BTC)",
      value: blockchainInfo?.market_price_btc
        ? isMobile
          ? Number(blockchainInfo?.market_price_btc).toFixed(4)
          : Number(blockchainInfo?.market_price_btc).toFixed(8)
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
      value: blockchainInfo?.transactions_24h.toLocaleString() ?? notAvailable,
      icon: <Activity size={18} />,
    },
    {
      label: metricT?.shieldedTx24h || "Shielded TX (24h)",
      value: shieldedTxCount?.length
        ? `Sapling: ${shieldedTxCount.at(-1)!.sapling.toLocaleString()}\nOrchard: ${shieldedTxCount.at(-1)!.orchard.toLocaleString()}`
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
      </div>
    </ErrorBoundary>
  );
}
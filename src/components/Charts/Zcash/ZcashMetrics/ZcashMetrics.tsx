import { useInMobile } from "@/hooks/useInMobile";
import { DATA_URL } from "@/lib/chart/data-url";
import {
  getBlockchainData,
  getMiningHistory,
  getMiningPools,
  getShieldedTxCount,
  getZcashCirculationCount,
} from "@/lib/chart/helpers";
import {
  BlockchainInfo,
  MiningHistoryResponse,
  MiningPoolsResponse,
  ShieldedTxCount,
} from "@/lib/chart/types";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ErrorBoundary } from "../../../ErrorBoundary/ErrorBoundary";
import { MetricCard, MetricCardSkeleton } from "./MetricCard";

interface ZcashStatisticsPorps {}

/* Metrics */
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
  const [miningHistory, setMiningHistory] = useState<MiningHistoryResponse | null>(
    null
  );
  const [miningPools, setMiningPools] = useState<MiningPoolsResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [
          chainData,
          circulationInfo,
          shieldedTxCount,
          miningHistoryData,
          miningPoolsData,
        ] = await Promise.all([
          getBlockchainData(DATA_URL.blockchairUrl, controller.signal),
          getZcashCirculationCount(DATA_URL.blockchainInfoUrl, controller.signal),
          getShieldedTxCount(DATA_URL.shieldedTxCountUrl, controller.signal),
          getMiningHistory(DATA_URL.miningHistoryUrl, "24h", controller.signal),
          getMiningPools(DATA_URL.miningPoolsUrl, "24h", controller.signal),
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

        if (miningHistoryData) {
          setMiningHistory(miningHistoryData);
        }

        if (miningPoolsData) {
          setMiningPools(miningPoolsData);
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

  const latestMiningBucket = miningHistory?.buckets?.at(-1);
  const foundryPool = miningPools?.pools?.find((pool) => {
    const name = pool.pool_name?.toLowerCase() ?? "";
    return name.includes("foundry");
  });
  const foundrySharePct = foundryPool?.share_percentage ?? null;
  const foundryEstimatedHashrateGsols =
    latestMiningBucket && typeof foundrySharePct === "number"
      ? latestMiningBucket.avg_network_hashrate_gsols * (foundrySharePct / 100)
      : null;

  const metricsObj = [
    {
      label: metricT?.marketCap || "Market Cap",
      value: blockchainInfo?.market_cap_usd
        ? `$${blockchainInfo?.market_cap_usd.toLocaleString()}`
        : notAvailable,
    },
    {
      label: metricT?.circulation || "Circulation",
      value: circulation
        ? `${circulation?.toLocaleString()} ZEC`
        : notAvailable,
    },
    {
      label: metricT?.marketPriceUsd || "Market Price (USD)",
      value: blockchainInfo?.market_price_usd
        ? `$${blockchainInfo?.market_price_usd.toFixed(2)}`
        : notAvailable,
    },
    {
      label: metricT?.marketPriceBtc || "Market Price (BTC)",
      value: blockchainInfo?.market_price_btc
        ? isMobile
          ? Number(blockchainInfo?.market_price_btc).toFixed(4)
          : Number(blockchainInfo?.market_price_btc).toFixed(8)
        : notAvailable,
    },
    {
      label: metricT?.blocks || "Blocks",
      value: blockchainInfo?.blocks
        ? blockchainInfo?.blocks.toLocaleString()
        : notAvailable,
    },
    {
      label: metricT?.transactions24h || "24h Transactions",
      value: blockchainInfo?.transactions_24h.toLocaleString() ?? notAvailable,
    },
    {
      label: metricT?.shieldedTx24h || "Shielded TX (24h)",
      value: shieldedTxCount?.length
        ? `${metricT?.saplingAbbrev || "Sap"}: ${shieldedTxCount
            .at(-1)!
            .sapling.toLocaleString()} | ${metricT?.orchardAbbrev || "Orc"}: ${shieldedTxCount
            .at(-1)!
            .orchard.toLocaleString()}`
        : notAvailable,
    },
    {
      label: metricT?.foundryShare24h || "Foundry Share (24h)",
      value:
        typeof foundrySharePct === "number"
          ? `${foundrySharePct.toFixed(2)}%`
          : notAvailable,
    },
    {
      label: metricT?.foundryHashrate24h || "Foundry Est. Hashrate (24h)",
      value:
        typeof foundryEstimatedHashrateGsols === "number"
          ? `${foundryEstimatedHashrateGsols.toFixed(2)} GSol/s`
          : notAvailable,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {loading
            ? metricsObj.map(({ label, value }) => (
                <MetricCardSkeleton key={label} />
              ))
            : metricsObj.map(({ label, value }) => (
                <MetricCard label={label} value={value} key={label} />
              ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

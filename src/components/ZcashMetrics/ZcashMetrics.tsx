import { useInMobile } from "@/hooks/useInMobile";
import { DATA_URL } from "@/lib/chart/data-url";
import {
  getBlockchainData,
  getShieldedTxCount,
  getZcashCirculationCount,
} from "@/lib/chart/helpers";
import { BlockchainInfo, ShieldedTxCount } from "@/lib/chart/types";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import { MetricCard, MetricCardSkeleton } from "./MetricCard";

interface ZcashStatisticsPorps {}

/* Metrics */
export function ZcashMetrics(props: ZcashStatisticsPorps) {
  const isMobile = useInMobile();

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
        const [chainData, circulationInfo, shieldedTxCount] = await Promise.all(
          [
            getBlockchainData(DATA_URL.blockchairUrl, controller.signal),
            getZcashCirculationCount(
              DATA_URL.blockchainInfoUrl,
              controller.signal
            ),
            getShieldedTxCount(DATA_URL.shieldedTxCountUrl, controller.signal),
          ]
        );

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
      label: "Market Cap",
      value: blockchainInfo?.market_cap_usd
        ? `$${blockchainInfo?.market_cap_usd.toLocaleString()}`
        : "N/A",
    },
    {
      label: "Circulation",
      value: circulation ? `${circulation?.toLocaleString()} ZEC` : "N/A",
    },
    {
      label: "Market Price (USD)",
      value: blockchainInfo?.market_price_usd
        ? `$${blockchainInfo?.market_price_usd.toFixed(2)}`
        : "N/A",
    },
    {
      label: "Market Price (BTC)",
      value: blockchainInfo?.market_price_btc
        ? isMobile
          ? Number(blockchainInfo?.market_price_btc).toFixed(4)
          : Number(blockchainInfo?.market_price_btc).toFixed(8)
        : "N/A",
    },
    {
      label: "Blocks",
      value: blockchainInfo?.blocks.toLocaleString() ?? "N/A",
    },
    {
      label: "24h Transactions",
      value: blockchainInfo?.transactions_24h.toLocaleString() ?? "N/A",
    },
    {
      label: "Shielded TX (24h)",
      value: shieldedTxCount?.length
        ? `Sap: ${shieldedTxCount
            .at(-1)!
            .sapling.toLocaleString()} | Orc: ${shieldedTxCount
            .at(-1)!
            .orchard.toLocaleString()}`
        : "N/A",
    },
  ];

  return (
    <ErrorBoundary fallback={"Failed to load Zcash Metrics"}>
      <div className="my-12">
        <h2 className="font-bold text-xl text-slate-700 dark:text-slate-100">
          Zcash Metrics
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

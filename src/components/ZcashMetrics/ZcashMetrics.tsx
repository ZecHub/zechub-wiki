import { useInMobile } from "@/hooks/useInMobile";
import { BlockchainInfo } from "@/lib/chart/types";
import { MetricCard } from "./MetricCard";

interface ZcashStatisticsPorps {
  blockchainInfo: BlockchainInfo;
  circulation: number;
  shieldedTxCount: any[];
}

/* Metrics */
export function ZcashMetrics(props: ZcashStatisticsPorps) {
  const isMobile = useInMobile();

  const metricsObj = [
    {
      label: "Market Cap",
      value: `$${
        props.blockchainInfo?.market_cap_usd.toLocaleString() ?? "NA"
      }`,
    },
    {
      label: "Circulation",
      value: `${props.circulation?.toLocaleString() ?? "N/A"} ZEC`,
    },
    {
      label: "Market Price (USD)",
      value: `$${props.blockchainInfo?.market_price_usd.toFixed(2) ?? "NA"}`,
    },
    {
      label: "Market Price (BTC)",
      value: isMobile
        ? Number(props.blockchainInfo?.market_price_btc).toFixed(4) ?? "NA"
        : Number(props.blockchainInfo?.market_price_btc).toFixed(8) ?? "NA",
    },
    {
      label: "Blocks",
      value: props.blockchainInfo?.blocks.toLocaleString() ?? "NA",
    },
    {
      label: "24h Transactions",
      value: props.blockchainInfo?.transactions_24h.toLocaleString() ?? "NA",
    },
    {
      label: "Shielded TX (24h)",
      value: props.shieldedTxCount?.length
        ? `Sapling: ${props.shieldedTxCount
            .at(-1)!
            .sapling.toLocaleString()} | Orchard: ${props.shieldedTxCount
            .at(-1)!
            .orchard.toLocaleString()}`
        : "N/A",
    },
  ];

  return (
    <div className="my-12">
      <h1 className="font-bold text-xl text-slate-700 dark:text-slate-100">
        Zcash Metrics
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {metricsObj.map(({ label, value }) => (
          <MetricCard label={label} value={value} key={label} />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { MetricCard } from "../ZcashMetrics/MetricCard";

interface CoinData {
  usd?: number;
  btc?: number;
  usd_market_cap?: number;
  usd_24h_vol?: number;
  usd_24h_change?: number;
}

interface BlockchainInfo {
  market_cap_usd: number;
  market_price_usd: number;
  market_price_btc: number;
  blocks: number;
  transactions_24h: number;
}

const CryptoMetrics = ({ selectedCoin }: { selectedCoin: string }) => {
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>({
    market_cap_usd: 0,
    market_price_usd: 0,
    market_price_btc: 0,
    blocks: Math.floor(Math.random() * 2000000),
    transactions_24h: 0,
  });
  const [circulation, setCirculation] = useState<number | null>(null);
  const [shieldedTxCount, setShieldedTxCount] = useState<
    { sapling: number; orchard: number }[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let name = selectedCoin;
    const fetchCoinData = async () => {
      // Skip fetch for Namada and Zcash (or handle differently)
      if (selectedCoin === "Zcash") {
        setLoading(false);
        return;
      }
      if (selectedCoin === "Atom") {
        name = "Cosmos Hub";
      } else if (selectedCoin === "Tia") {
        name = "Celestia";
      } else if (selectedCoin === "Osmo") {
        name = "Osmosis";
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch CoinGecko data
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": "CG-C7uDKWaJaNy8ZTtVb6bWv19d",
          },
        };

        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd%2Cbtc&names=${encodeURIComponent(
            name.toLowerCase()
          )}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`,
          options
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        console.log(name);
        if (name == "Usdc") {
          name = "USDC";
        }
        const coinInfo = data[name];
        setCoinData(coinInfo);
        console.log(name.toLowerCase(), "coinInfo", data);

        // Mock blockchain data (replace with actual API calls)
        setBlockchainInfo({
          market_cap_usd: coinInfo?.usd_market_cap || 0,
          market_price_usd: coinInfo?.usd || 0,
          market_price_btc: coinInfo?.btc || 0,
          blocks: Math.floor(Math.random() * 2000000),
          transactions_24h: coinInfo?.usd_24h_vol || 0,
        });

        setCirculation(
          Math.floor(
            coinInfo?.usd_market_cap
              ? coinInfo?.usd_market_cap / coinInfo?.usd
              : 0
          )
        );
      } catch (err) {
        console.error("Failed to fetch coin data:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [selectedCoin]);

  const metricsObj = [
    {
      label: "Market Cap",
      value: `$${blockchainInfo?.market_cap_usd.toLocaleString() ?? "N/A"}`,
    },
    {
      label: "Circulation",
      value: `${circulation?.toLocaleString() ?? "N/A"} ${selectedCoin}`,
    },
    {
      label: "Market Price (USD)",
      value: `$${blockchainInfo?.market_price_usd.toFixed(2) ?? "N/A"}`,
    },
    {
      label: "Market Price (BTC)",
      value: Number(blockchainInfo?.market_price_btc).toFixed(8),
      // value: isMobile
      //   ? Number(blockchainInfo?.market_price_btc).toFixed(4) ?? "N/A"
      //   : Number(blockchainInfo?.market_price_btc).toFixed(8) ?? "N/A",
    },
    {
      label: "Blocks",
      value: blockchainInfo?.blocks.toLocaleString() ?? "N/A",
    },
    {
      label: "24h Transactions",
      value: blockchainInfo?.transactions_24h.toLocaleString() ?? "N/A",
    },
  ];

  return (
    // <div className="flex flex-wrap gap-8 justify-center items-center mt-8">
    //   <div className="border p-4 rounded-md text-center min-w-[200px]">
    //     <h3 className="font-bold text-lg">Market Cap</h3>
    //     <p>${blockchainInfo?.market_cap_usd?.toLocaleString()}</p>
    //   </div>

    //   <div className="border p-4 rounded-md text-center min-w-[200px]">
    //     <h3 className="font-bold text-lg">{selectedCoin} in Circulation</h3>
    //     <p>
    //       {circulation?.toLocaleString()} {selectedCoin}
    //     </p>
    //   </div>

    //   <div className="border p-4 rounded-md text-center min-w-[200px]">
    //     <h3 className="font-bold text-lg">Market Price (USD)</h3>
    //     <p>${blockchainInfo?.market_price_usd?.toFixed(2)}</p>
    //   </div>

    //   <div className="border p-4 rounded-md text-center min-w-[200px]">
    //     <h3 className="font-bold text-lg">Market Price (BTC)</h3>
    //     <p>{blockchainInfo?.market_price_btc?.toFixed(8)}</p>
    //   </div>

    //   {/* {blockchainInfo?.blocks && (
    //     <div className="border p-4 rounded-md text-center min-w-[200px]">
    //       <h3 className="font-bold text-lg">Blocks</h3>
    //       <p>{blockchainInfo.blocks.toLocaleString()}</p>
    //     </div>
    //   )} */}

    //   <div className="border p-4 rounded-md text-center min-w-[200px]">
    //     <h3 className="font-bold text-lg">24h Transactions</h3>
    //     <p>{blockchainInfo?.transactions_24h?.toLocaleString()}</p>
    //   </div>
    // </div>

    <div className="my-12">
      <h2 className="font-bold text-xl text-slate-700 dark:text-slate-100">
        {selectedCoin} Metrics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {metricsObj.map(({ label, value }) => (
          <MetricCard label={label} value={value} key={label} />
        ))}
      </div>
    </div>
  );
};

export default CryptoMetrics;

"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import ZecToZatsConverter from "@/components/Converter/ZecToZatsConverter";
import Tools from "@/components/tools";
import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import dynamic from "next/dynamic";

const ShieldedPoolChart = dynamic(
  () => import("../../components/ShieldedPoolChart"),
  { ssr: true } // Enable SSR
);

const TransactionSummaryChart = dynamic(
  () => import("../../components/TransactionSummaryChart"),
  { ssr: true } // Enable SSR
);

const defaultUrl =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shielded_supply.json";
const sproutUrl =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sprout_supply.json";
const saplingUrl =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sapling_supply.json";
const orchardUrl =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/orchard_supply.json";
const hashrateUrl =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/hashrate.json";
const txsummaryUrl =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json";
const shieldedTxCountUrl =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shieldedtxcount.json";

interface BlockchainInfo {
  market_cap_usd: number;
  circulation: number;
  market_price_usd: number;
  market_price_btc: number;
  blocks: number;
  transactions_24h: number;
  nodes: number;
}

interface SupplyData {
  timestamp: string;
  supply: number;
}

interface ShieldedTxCount {
  sapling: number;
  orchard: number;
  timestamp: string;
}

const ShieldedPoolDashboard = () => {
  const [selectedPool, setSelectedPool] = useState("default");
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(null);
  const [circulation, setCirculation] = useState<number | null>(null);
  const [sproutSupply, setSproutSupply] = useState<SupplyData | null>(null);
  const [saplingSupply, setSaplingSupply] = useState<SupplyData | null>(null);
  const [orchardSupply, setOrchardSupply] = useState<SupplyData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [shieldedTxCount, setShieldedTxCount] = useState<ShieldedTxCount | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>("supply");
  const [selectedToolName, setSelectedToolName] = useState<string>("Shielded Supply Chart (ZEC)");
  const [cumulativeCheck, setCumulativeCheck] = useState(true);
  const [filterSpamCheck, setFilterSpamCheck] = useState(false);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  const getDataUrl = () => {
    switch (selectedPool) {
      case "sprout":
        return sproutUrl;
      case "sapling":
        return saplingUrl;
      case "orchard":
        return orchardUrl;
      case "hashrate":
        return hashrateUrl;
      default:
        return defaultUrl;
    }
  };

  const getDataColor = () => {
    switch (selectedPool) {
      case "sprout":
        return "#A020F0";
      case "sapling":
        return "#FFA500";
      case "orchard":
        return "#32CD32";
      default:
        return "url(#area-background-gradient)";
    }
  };

  const getTotalShieldedSupply = () => {
    const totalSupply =
      (sproutSupply?.supply ?? 0) +
      (saplingSupply?.supply ?? 0) +
      (orchardSupply?.supply ?? 0);
    return totalSupply;
  };

  useEffect(() => {
    // Fetch blockchain data
    async function fetchData() {
      const res = await fetch("https://api.blockchair.com/zcash/stats");
      const data = await res.json();
      setBlockchainInfo(data.data as BlockchainInfo);
    }
    fetchData();

    // Fetch shielded supply data
    async function fetchSupplyData(url: string, setData: (data: SupplyData | null) => void) {
      const res = await fetch(url);
      const data = await res.json();
      setData(data[data.length - 1] ?? null);
    }
    fetchSupplyData(sproutUrl, setSproutSupply);
    fetchSupplyData(saplingUrl, setSaplingSupply);
    fetchSupplyData(orchardUrl, setOrchardSupply);
  }, []);

  return (
    <div>
      <h2 className="font-bold mt-8 mb-4">{selectedToolName}</h2>
      <div className="border p-3 rounded-lg">
        <Tools onToolChange={setSelectedTool} />
        <div className="relative">
          <div ref={divChartRef}>
            {selectedTool === "supply" && (
              <ShieldedPoolChart dataUrl={getDataUrl()} color={getDataColor()} />
            )}
            {selectedTool === "transaction" && (
              <TransactionSummaryChart
                dataUrl={txsummaryUrl}
                pool={selectedPool}
                cumulative={cumulativeCheck}
                filter={filterSpamCheck}
              />
            )}
          </div>
        </div>
      </div>

      {selectedTool === "supply" && (
        <div className="mt-8 flex flex-col items-center">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setSelectedPool("default")}
              text="Total Shielded"
              className={`rounded py-2 px-4 ${
                selectedPool === "default" ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            />
            <Button
              onClick={() => setSelectedPool("sprout")}
              text="Sprout Pool"
              className={`rounded py-2 px-4 ${
                selectedPool === "sprout" ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            />
            <Button
              onClick={() => setSelectedPool("sapling")}
              text="Sapling Pool"
              className={`rounded py-2 px-4 ${
                selectedPool === "sapling" ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            />
            <Button
              onClick={() => setSelectedPool("orchard")}
              text="Orchard Pool"
              className={`rounded py-2 px-4 ${
                selectedPool === "orchard" ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            />
          </div>

          {/* ZecToZatsConverter */}
          <div className="mt-8">
            <ZecToZatsConverter />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-8 justify-center items-center mt-8">
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Cap</h3>
          <p>${blockchainInfo?.market_cap_usd?.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">ZEC in Circulation</h3>
          <p>{circulation?.toLocaleString() ?? "N/A"} ZEC</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Price (USD)</h3>
          <p>${blockchainInfo?.market_price_usd?.toFixed(2)}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Blocks</h3>
          <p>{blockchainInfo?.blocks?.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">24h Transactions</h3>
          <p>{blockchainInfo?.transactions_24h?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ShieldedPoolDashboard;

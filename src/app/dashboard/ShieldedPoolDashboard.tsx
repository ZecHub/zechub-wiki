"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import Tools from "@/components/tools";
import ZecToZatsConverter from "@/components/Converter/ZecToZatsConverter";
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

const apiUrl =
  "https://api.github.com/repos/ZecHub/zechub-wiki/commits?path=public/data/shielded_supply.json";
const blockchainInfoUrl =
  "https://mainnet.zcashexplorer.app/api/v1/blockchain-info";

interface BlockchainInfo {
  blocks: number;
  transactions: number;
  outputs: number;
  circulation: number | null;
  blocks_24h: number;
  transactions_24h: number;
  difficulty: number;
  volume_24h: number;
  mempool_transactions: number;
  average_transaction_fee_24h: number;
  largest_transaction_24h: {
    hash: string;
    value_usd: number;
  };
  nodes: number;
  hashrate_24h: string;
  inflation_usd_24h: number;
  average_transaction_fee_usd_24h: number;
  market_price_usd: number;
  market_price_btc: number;
  market_price_usd_change_24h_percentage: number;
  market_cap_usd: number;
  market_dominance_percentage: number;
  next_retarget_time_estimate: string;
  next_difficulty_estimate: number;
  countdowns: any[];
  hodling_addresses: number;
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

async function getBlockchainData(): Promise<BlockchainInfo | null> {
  try {
    const response = await fetch(
      "https://api.blockchair.com/zcash/stats?key=A___8A4ebOe3KJT9bqiiOHWnJbCLpDUZ"
    );
    if (!response.ok) {
      console.error("Failed to fetch blockchain data:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data.data as BlockchainInfo;
  } catch (error) {
    console.error("Error fetching blockchain data:", error);
    return null;
  }
}

async function getBlockchainInfo(): Promise<number | null> {
  try {
    const response = await fetch(blockchainInfoUrl, { mode: "cors" });
    if (!response.ok) {
      console.error("Failed to fetch blockchain info:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data.chainSupply?.chainValue ?? null;
  } catch (error) {
    console.error("Error fetching blockchain info:", error);
    return null;
  }
}

async function getSupplyData(url: string): Promise<SupplyData[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch supply data:", response.statusText);
      return [];
    }
    const data = await response.json();
    return data as SupplyData[];
  } catch (error) {
    console.error("Error fetching supply data:", error);
    return [];
  }
}

async function getLastUpdatedDate(): Promise<string> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error("Failed to fetch last updated date:", response.statusText);
      return "N/A";
    }
    const data = await response.json();
    return data[0]?.commit?.committer?.date ?? "N/A";
  } catch (error) {
    console.error("Error fetching last updated date:", error);
    return "N/A";
  }
}

const ShieldedPoolDashboard = () => {
  const [selectedPool, setSelectedPool] = useState("default");
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(
    null
  );
  const [circulation, setCirculation] = useState<number | null>(null);
  const [sproutSupply, setSproutSupply] = useState<SupplyData | null>(null);
  const [saplingSupply, setSaplingSupply] = useState<SupplyData | null>(null);
  const [orchardSupply, setOrchardSupply] = useState<SupplyData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [selectedTool, setSelectedTool] = useState<string>("supply");
  const [selectedToolName, setSelectedToolName] = useState<string>(
    "Shielded Supply Chart (ZEC)"
  );

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  const getDataUrl = () => {
    switch (selectedPool) {
      case "sprout":
        return sproutUrl;
      case "sapling":
        return saplingUrl;
      case "orchard":
        return orchardUrl;
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
    return (
      (sproutSupply?.supply ?? 0) +
      (saplingSupply?.supply ?? 0) +
      (orchardSupply?.supply ?? 0)
    );
  };

  useEffect(() => {
    const fetchBlockchainInfo = async () => {
      try {
        const response = await fetch(defaultUrl);
        const data = await response.json();
        setBlockchainInfo(data);
      } catch (error) {
        console.error("Error fetching blockchain info:", error);
      }
    };

    const fetchLastUpdated = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setLastUpdated(data[0]?.commit?.committer?.date ?? "N/A");
      } catch (error) {
        console.error("Error fetching last updated date:", error);
      }
    };

    fetchBlockchainInfo();
    fetchLastUpdated();
  }, []);

  return (
    <div>
      <h2 className="font-bold mt-8 mb-4">{selectedToolName}</h2>
      <div className="border p-3 rounded-lg">
        <Tools onToolChange={(tool) => setSelectedTool(tool)} />
        <div className="relative">
          <div ref={divChartRef}>
            {selectedTool === "supply" && (
              <ShieldedPoolChart
                dataUrl={getDataUrl()}
                color={getDataColor()}
              />
            )}
            {selectedTool === "transaction" && (
              <TransactionSummaryChart
                dataUrl={txsummaryUrl}
                pool={selectedPool}
              />
            )}
          </div>
        </div>
        <div className="flex justify-end gap-12 text-right mt-4 text-sm text-gray-500">
          <span>
            Last updated:{" "}
            {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : "N/A"}
          </span>
          <Button
            text="Export (PNG)"
            className="bg-blue-500 text-white px-3 py-2 rounded-lg"
            onClick={() =>
              handleSaveToPng(selectedPool, { sproutSupply, saplingSupply })
            }
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <div className="flex justify-center space-x-4">
          <Button
            text="Total Shielded"
            className={`rounded-md py-2 px-4 text-white ${
              selectedPool === "default" ? "bg-blue-500" : "bg-gray-400"
            }`}
            onClick={() => setSelectedPool("default")}
          />
          <Button
            text="Sprout Pool"
            className={`rounded-md py-2 px-4 text-white ${
              selectedPool === "sprout" ? "bg-blue-500" : "bg-gray-400"
            }`}
            onClick={() => setSelectedPool("sprout")}
          />
          <Button
            text="Sapling Pool"
            className={`rounded-md py-2 px-4 text-white ${
              selectedPool === "sapling" ? "bg-blue-500" : "bg-gray-400"
            }`}
            onClick={() => setSelectedPool("sapling")}
          />
          <Button
            text="Orchard Pool"
            className={`rounded-md py-2 px-4 text-white ${
              selectedPool === "orchard" ? "bg-blue-500" : "bg-gray-400"
            }`}
            onClick={() => setSelectedPool("orchard")}
          />
        </div>

        <div className="mt-8 w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
          <ZecToZatsConverter />
        </div>
      </div>
    </div>
  );
};

export default ShieldedPoolDashboard;

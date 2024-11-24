"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import Tools from "@/components/tools";
import ZecToZatsConverter from "@/components/Converter/ZecToZatsConverter"; // Importing the ZecToZatsConverter component
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
  const [filterSpamCheck, setfilterSpamCheck] = useState(false);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  useEffect(() => {
    getBlockchainData().then((data) => {
      if (data) {
        data.nodes = 125;
        setBlockchainInfo(data);
      }
    });
  }, []);

  return (
    <div>
      <h2 className="font-bold mt-8 mb-4">{selectedToolName}</h2>
      <div className="border p-3 rounded-lg">
        <Tools onToolChange={setSelectedTool} />
        <div className="relative">
          <div ref={divChartRef}>
            {selectedTool === "supply" && (
              <ShieldedPoolChart dataUrl={defaultUrl} color="blue" />
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center">
        {/* Existing Buttons and Data */}
        <div className="flex justify-center space-x-4">
          <div className="flex flex-col items-center">
            <Button text="Total Shielded" className="bg-blue-500 text-white" />
          </div>
          <div className="flex flex-col items-center">
            <Button text="Sprout Pool" className="bg-green-500 text-white" />
          </div>
        </div>
        {/* ZecToZatsConverter */}
        <div
          style={{
            marginTop: "20px",
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <ZecToZatsConverter />
        </div>
      </div>
    </div>
  );
};

export default ShieldedPoolDashboard;

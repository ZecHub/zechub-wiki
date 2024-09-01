"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import HalvingMeter from "@/components/HalvingMeter";
import Tools from "@/components/tools";
import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import dynamic from "next/dynamic";

const ShieldedPoolChart = dynamic(
  () => import("../../components/ShieldedPoolChart"),
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

async function getShieldedTxCount(): Promise<ShieldedTxCount | null> {
  try {
    const response = await fetch(shieldedTxCountUrl);
    if (!response.ok) {
      console.error("Failed to fetch shielded transaction counts:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data as ShieldedTxCount;
  } catch (error) {
    console.error("Error fetching shielded transaction counts:", error);
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

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  useEffect(() => {
    getBlockchainData().then((data) => {
      if (data) {
        data.nodes = 125; // Manually set the node count to 125
        setBlockchainInfo(data);
      }
    });

    getBlockchainInfo().then((data) => setCirculation(data ?? 0));

    getLastUpdatedDate().then((date) => setLastUpdated(date.split("T")[0]));

    getSupplyData(sproutUrl).then((data) =>
      setSproutSupply(data[data.length - 1] ?? { timestamp: "N/A", supply: 0 })
    );

    getSupplyData(saplingUrl).then((data) =>
      setSaplingSupply(data[data.length - 1] ?? { timestamp: "N/A", supply: 0 })
    );

    getSupplyData(orchardUrl).then((data) =>
      setOrchardSupply(data[data.length - 1] ?? { timestamp: "N/A", supply: 0 })
    );

    getShieldedTxCount().then((data) =>
      setShieldedTxCount(data ?? { sapling: 0, orchard: 0, timestamp: "N/A" })
    );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSupplyData(getDataUrl());
      setLastUpdated(data[data.length - 1]?.timestamp?.split("T")[0] || "N/A");
    };
    fetchData();
  }, [selectedPool]);

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

  if (!blockchainInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="font-bold mt-8 mb-4">Shielded Supply Chart (ZEC)</h2>
      <div className="border p-3 rounded-lg">
        <Tools />
        <div className="relative">
          <div ref={divChartRef}>
            <ShieldedPoolChart dataUrl={getDataUrl()} color={getDataColor()} />
          </div>
        </div>
        <div className="flex justify-end gap-12 text-right mt-4 text-sm text-gray-500">
          <span className="px-3 py-2">
            Last updated:{" "}
            {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : "N/A"}
          </span>
          <Button
            text="Export (PNG)"
            className="px-3 py-2 border text-white border-slate-300 rounded-md shadow-sm bg-[#1984c7]"
            onClick={() =>
              handleSaveToPng(selectedPool, {
                sproutSupply,
                saplingSupply,
                orchardSupply,
              })
            }
          />
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <div className="flex justify-center space-x-4">
          <div className="flex flex-col items-center">
            <Button
              onClick={() => setSelectedPool("default")}
              text="Total Shielded"
              className={`rounded-[0.4rem] py-2 px-4 text-white ${
                selectedPool === "default" ? "bg-[#1984c7]" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {getTotalShieldedSupply().toLocaleString()} ZEC
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => setSelectedPool("hashrate")}
              text="Hash Rate"
              className={`rounded-[0.4rem] py-2 px-4 text-white ${
                selectedPool === "hashrate" ? "bg-[#1984c7]" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => setSelectedPool("sprout")}
              text="Sprout Pool"
              className={`rounded-[0.4rem] py-2 px-4 text-white ${
                selectedPool === "sprout" ? "bg-[#1984c7]" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {sproutSupply ? `${sproutSupply.supply.toLocaleString()} ZEC` : "Loading..."}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => setSelectedPool("sapling")}
              text="Sapling Pool"
              className={`rounded-[0.4rem] py-2 px-4 text-white ${
                selectedPool === "sapling" ? "bg-[#1984c7]" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {saplingSupply ? `${saplingSupply.supply.toLocaleString()} ZEC` : "Loading..."}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => setSelectedPool("orchard")}
              text="Orchard Pool"
              className={`rounded-[0.4rem] py-2 px-4 text-white ${
                selectedPool === "orchard" ? "bg-[#1984c7]" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {orchardSupply ? `${orchardSupply.supply.toLocaleString()} ZEC` : "Loading..."}
            </span>
          </div>
        </div>
      </div>
      <HalvingMeter />
      <div className="flex flex-wrap gap-8 justify-center items-center mt-8">
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Cap</h3>
          <p>${blockchainInfo.market_cap_usd?.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">ZEC in Circulation</h3>
          <p>{circulation?.toLocaleString() ?? "N/A"} ZEC</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Price (USD)</h3>
          <p>${blockchainInfo.market_price_usd?.toFixed(2)}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Price (BTC)</h3>
          <p>{blockchainInfo.market_price_btc}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Blocks</h3>
          <p>{blockchainInfo.blocks?.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">24h Transactions</h3>
          <p>{blockchainInfo.transactions_24h?.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Nodes</h3>
          <p>{blockchainInfo.nodes}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Shielded TX (24h)</h3>
          <p>
            {shieldedTxCount
              ? `Sapling: ${shieldedTxCount?.sapling?.toLocaleString()} | Orchard: ${shieldedTxCount.orchard?.toLocaleString()}`
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShieldedPoolDashboard;

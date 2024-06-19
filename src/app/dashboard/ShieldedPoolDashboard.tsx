"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/Button/Button";
import HalvingMeter from "@/components/HalvingMeter";

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

interface BlockchainInfo {
  blocks: number;
  transactions: number;
  outputs: number;
  circulation: number;
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

async function getBlockchainData() {
  const response = await fetch(
    "https://api.blockchair.com/zcash/stats?key=A___8A4ebOe3KJT9bqiiOHWnJbCLpDUZ"
  );
  const data = await response.json();

  return data.data as BlockchainInfo;
}

async function getSupplyData(url: string): Promise<SupplyData[]> {
  const response = await fetch(url);
  const data = await response.json();
  return data as SupplyData[];
}

const ShieldedPoolDashboard = () => {
  const [selectedPool, setSelectedPool] = useState("default");
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(
    null
  );
  const [sproutSupply, setSproutSupply] = useState<SupplyData | null>(null);
  const [saplingSupply, setSaplingSupply] = useState<SupplyData | null>(null);
  const [orchardSupply, setOrchardSupply] = useState<SupplyData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    getBlockchainData().then((data) => setBlockchainInfo(data));
    getSupplyData(sproutUrl).then((data) => {
      setSproutSupply(data[data.length - 1]);
      if (selectedPool === "sprout") setLastUpdated(data[data.length - 1].timestamp);
    });
    getSupplyData(saplingUrl).then((data) => {
      setSaplingSupply(data[data.length - 1]);
      if (selectedPool === "sapling") setLastUpdated(data[data.length - 1].timestamp);
    });
    getSupplyData(orchardUrl).then((data) => {
      setOrchardSupply(data[data.length - 1]);
      if (selectedPool === "orchard") setLastUpdated(data[data.length - 1].timestamp);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSupplyData(getDataUrl());
      setLastUpdated(data[data.length - 1].timestamp);
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
      case "default":
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
      case "url(#area-background-gradient)":
      default:
        return "url(#area-background-gradient)";
    }
  };

  if (!blockchainInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="font-bold mt-8 mb-4">Shielded Supply Chart (ZEC)</h2>
      <div className="border p-3 rounded-lg relative">
        <ShieldedPoolChart dataUrl={getDataUrl()} color={getDataColor()} />
        <span className="absolute bottom-0 right-0 p-2 text-sm text-gray-500">
          Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "Loading..."}
        </span>
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
      <div className="mt-8">
        <h2 className="font-bold my-2">Metrics</h2>
        <table className="border-collapse w-full rounded-lg first:tr">
          <thead>
            <tr className="p-0 lg:p-4 hidden lg:table-row">
              <th className="lg:border border-blue-300 text-left px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0 bg-blue-100 text-gray-500">
                Property
              </th>
              <th className="lg:border border-blue-300 text-left px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0 bg-blue-100">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Market Price (USD)
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                ${blockchainInfo.market_price_usd?.toLocaleString() ?? "N/A"}
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Market Price Change (24h %)
              </td>
              <td
                className={`lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0 ${
                  blockchainInfo.market_price_usd_change_24h_percentage > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {blockchainInfo.market_price_usd_change_24h_percentage?.toFixed(
                  2
                ) ?? "N/A"}
                %
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Block Height
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                {blockchainInfo.blocks?.toLocaleString() ?? "N/A"}
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Circulation
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                {(blockchainInfo.circulation / 1e8)?.toLocaleString() ?? "N/A"}{" "}
                ZEC
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Blocks (24h)
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                {blockchainInfo.blocks_24h?.toLocaleString() ?? "N/A"}
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Transactions (24h)
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                {blockchainInfo.transactions_24h?.toLocaleString() ?? "N/A"}
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Difficulty
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                {blockchainInfo.difficulty?.toLocaleString() ?? "N/A"}
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Volume (24h)
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                {(blockchainInfo.volume_24h / 1e8)?.toLocaleString() ?? "N/A"}{" "}
                ZEC
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Mempool Transactions
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                {blockchainInfo.mempool_transactions?.toLocaleString() ?? "N/A"}
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Average Transaction Fee (24h)
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                {blockchainInfo.average_transaction_fee_24h?.toLocaleString() ??
                  "N/A"}{" "}
                sat
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Largest Transaction (24h)
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                <a
                  href={`https://3xpl.com/zcash/transaction/${blockchainInfo.largest_transaction_24h?.hash}`}
                  className="text-blue-500 underline"
                >
                  {blockchainInfo.largest_transaction_24h?.hash ?? "N/A"}
                </a>
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Nodes
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                {blockchainInfo.nodes?.toLocaleString() ?? "N/A"}
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Hashrate (24h)
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                {blockchainInfo.hashrate_24h ?? "N/A"}
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Inflation (USD, 24h)
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                ${blockchainInfo.inflation_usd_24h?.toLocaleString() ?? "N/A"}
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Average Transaction Fee (USD, 24h)
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                $
                {blockchainInfo.average_transaction_fee_usd_24h?.toFixed(2) ??
                  "N/A"}
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Market Cap (USD)
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                ${blockchainInfo.market_cap_usd?.toLocaleString() ?? "N/A"}
              </td>
            </tr>
            <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">
                Hodling Addresses
              </td>
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">
                {blockchainInfo.hodling_addresses?.toLocaleString() ?? "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShieldedPoolDashboard;

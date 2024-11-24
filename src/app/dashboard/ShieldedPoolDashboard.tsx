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
const txsummaryUrl =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json";
const shieldedTxCountUrl =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shieldedtxcount.json";
const apiUrl =
  "https://api.github.com/repos/ZecHub/zechub-wiki/commits?path=public/data/shielded_supply.json";
const blockchairUrl =
  "https://api.blockchair.com/zcash/stats?key=A___8A4ebOe3KJT9bqiiOHWnJbCLpDUZ";

interface BlockchainInfo {
  blocks: number;
  transactions: number;
  market_price_usd: number;
  market_price_btc: number;
  market_cap_usd: number;
  circulation: number;
  transactions_24h: number;
  difficulty: number;
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
  const [selectedTool, setSelectedTool] = useState<string>("supply");
  const [cumulativeCheck, setCumulativeCheck] = useState(true);
  const [filterSpamCheck, setFilterSpamCheck] = useState(false);
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(
    null
  );
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  useEffect(() => {
    const fetchBlockchainInfo = async () => {
      try {
        const response = await fetch(blockchairUrl);
        const data = await response.json();
        setBlockchainInfo(data.data);
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
      <h2 className="font-bold mt-8 mb-4">
        {selectedTool === "supply"
          ? "Shielded Supply Chart (ZEC)"
          : "Shielded Transactions Chart"}
      </h2>
      <div className="border p-3 rounded-lg">
        <Tools
          onToolChange={(tool) => setSelectedTool(tool)}
        />
        <div className="relative">
          <div ref={divChartRef}>
            {selectedTool === "supply" && (
              <ShieldedPoolChart dataUrl={defaultUrl} color="blue" />
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
        <div className="flex justify-end gap-12 text-right mt-4 text-sm text-gray-500">
          <span>
            Last updated:{" "}
            {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : "N/A"}
          </span>
          <Button
            text="Export (PNG)"
            className="bg-blue-500 text-white px-3 py-2 rounded-lg"
            onClick={() =>
              handleSaveToPng(selectedPool, { blockchainInfo })
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

      <div className="flex flex-wrap gap-8 justify-center items-center mt-8">
        {blockchainInfo && (
          <>
            <div className="border p-4 rounded-md text-center">
              <h3 className="font-bold text-lg">Market Cap</h3>
              <p>${blockchainInfo.market_cap_usd?.toLocaleString()}</p>
            </div>
            <div className="border p-4 rounded-md text-center">
              <h3 className="font-bold text-lg">ZEC in Circulation</h3>
              <p>{blockchainInfo.circulation?.toLocaleString()} ZEC</p>
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
              <h3 className="font-bold text-lg">24h Transactions</h3>
              <p>{blockchainInfo.transactions_24h?.toLocaleString()}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShieldedPoolDashboard;

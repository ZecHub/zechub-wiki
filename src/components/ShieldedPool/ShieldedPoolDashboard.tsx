"use client";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import NodeCountChart from "@/components/NodeCountChart";
import Tools from "@/components/Tools";
import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import { Spinner } from "flowbite-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ToolOptions } from "../Tools/tools";
import NetInflowsOutflowsChart from "../Charts/NetInflowsOutflowsChart";
import NoData from "../../assets/nodata.svg";
import Image from "next/image";

const ShieldedPoolChart = dynamic(
  () => import("./ShieldedPoolChart"),
  { ssr: true } // Enable SSR
);

const TransactionSummaryChart = dynamic(
  () => import("../TransactionSummaryChart"),
  { ssr: true } // Enable SSR
);

// const ZecIssuanceSummaryChart = dynamic(
//   () => import("../ZecIssuanceSummaryChart"),
//   { ssr: true } // Enable SSR
// );

const ZecIssuanceSummaryChart = dynamic(
  () => import("../ZecIssuanceSummaryChart"),
  { ssr: true } // Enable SSR
);

const DataUrlOptions = {
  defaultUrl:
    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shielded_supply.json",
  netInflowsOutflowsUrl: "/data/netinflowoutflow.json",
  sproutUrl:
    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sprout_supply.json",
  saplingUrl:
    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sapling_supply.json",
  orchardUrl:
    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/orchard_supply.json",
  hashrateUrl:
    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/hashrate.json",
  nodecountUrl:
    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/nodecount.json",
  difficultyUrl:
    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/difficulty.json",
  lockboxUrl:
    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/lockbox.json",
  txsummaryUrl:
    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json",
  shieldedTxCountUrl:
    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shieldedtxcount.json",
  apiUrl:
    "https://api.github.com/repos/ZecHub/zechub-wiki/commits?path=public/data/shielded_supply.json",
  issuanceUrl:
    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/issuance.json",
};

// const defaultUrl =
//   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shielded_supply.json";
// const sproutUrl =
//   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sprout_supply.json";
// const saplingUrl =
//   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sapling_supply.json";
// const orchardUrl =
//   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/orchard_supply.json";
// const hashrateUrl =
//   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/hashrate.json";
// const nodecountUrl =
//   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/nodecount.json";
// const difficultyUrl =
//   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/difficulty.json";
// const lockboxUrl =
//   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/lockbox.json";
// const txsummaryUrl =
//   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json";
// const shieldedTxCountUrl =
//   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shieldedtxcount.json";
// const netInflowsOutflowsUrl =
//   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/netinflowoutflow.json";
// const issuanceUrl =  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/issuance.json";

// const apiUrl =   "https://api.github.com/repos/ZecHub/zechub-wiki/commits?path=public/data/shielded_supply.json";

const blockchainInfoUrl = "/api/blockchain-info";
const blockchainDataUrl = "/api/blockchain-data";

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

// The supply JSON uses "close" as the date field.
interface SupplyData {
  close: string;
  supply: number;
}

interface ShieldedTxCount {
  sapling: number;
  orchard: number;
  timestamp: string;
}

// --- Updated interface for Node Count Data ---
// Note: The JSON uses "Date" and "nodecount" (as strings)
interface NodeCountData {
  Date: string;
  nodecount: string;
}

async function getNodeCountData(url: string): Promise<NodeCountData[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch node count data:", response.statusText);
      return [];
    }
    const data = await response.json();
    return data as NodeCountData[];
  } catch (error) {
    console.error("Error fetching node count data:", error);
    return [];
  }
}

async function getBlockchainData(): Promise<BlockchainInfo | null> {
  try {
    const response = await fetch(
      "https://api.blockchair.com/zcash/stats?key=A___nnFHttBygZPrKgm5WZyXU3WCondo"
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
    const response = await fetch(blockchainInfoUrl);
    if (!response.ok) {
      console.error("Failed to fetch blockchain info:", response.statusText);
      return null;
    }
    const data = await response.json();
    console.log(data);
    const valZat = parseInt(data?.chainSupply?.chainValueZat) * 0.00000001;
    return valZat ?? null;
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
    const response = await fetch(DataUrlOptions.apiUrl);
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
    const response = await fetch(DataUrlOptions.shieldedTxCountUrl);
    if (!response.ok) {
      console.error(
        "Failed to fetch shielded transaction counts:",
        response.statusText
      );
      return null;
    }
    const data = await response.json();
    const latestData = data[data.length - 1] || {};
    return {
      sapling: latestData.sapling || 0,
      orchard: latestData.orchard || 0,
      timestamp: latestData.timestamp || "N/A",
    };
  } catch (error) {
    console.error("Error fetching shielded transaction counts:", error);
    return null;
  }
}

// Helper function to format dates.
// It handles MM/DD/YYYY dates (as in your JSON) and ISO strings.
function formatDate(dateString: string | null): string {
  if (!dateString || dateString === "N/A") return "N/A";

  // Check for MM/DD/YYYY format.
  const mmddyyyyRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
  if (mmddyyyyRegex.test(dateString)) {
    const [month, day, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  }

  // Fallback for ISO strings or other formats.
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
}

// Helper function to transform SupplyData to the expected shape for export.
function transformSupplyData(
  data: SupplyData | null
): { timestamp: string; supply: number } | null {
  return data ? { timestamp: data.close, supply: data.supply } : null;
}

const ShieldedPoolDashboard = () => {
  const [selectedPool, setSelectedPool] = useState("default");
  const [selectedCoin, setSelectedCoin] = useState("Zcash");
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(
    null
  );
  const [circulation, setCirculation] = useState<number | null>(null);
  const [shieldedSupply, setShieldedSupply] = useState<SupplyData | null>(null);
  const [sproutSupply, setSproutSupply] = useState<SupplyData | null>(null);
  const [saplingSupply, setSaplingSupply] = useState<SupplyData | null>(null);
  const [orchardSupply, setOrchardSupply] = useState<SupplyData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [shieldedTxCount, setShieldedTxCount] =
    useState<ShieldedTxCount | null>(null);
  // New state for the most recent node count.
  const [latestNodeCount, setLatestNodeCount] = useState<number | null>(null);

  const [selectedTool, setSelectedTool] = useState<string>(ToolOptions.supply);  // Changed to supply
  const [selectedToolName, setSelectedToolName] = useState<string>(
    "Shielded Supply Chart (ZEC)"  // Changed to this default text
  );
  const [cumulativeCheck, setCumulativeCheck] = useState(true);
  const [filterSpamCheck, setfilterSpamCheck] = useState(false);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  useEffect(() => {
    getBlockchainData().then((data) => {
      if (data) {
        // Use actual blockchain info
        setBlockchainInfo(data);
      }
    });

    getBlockchainInfo().then((data) => setCirculation(data ?? 0));

    // Use the full ISO string from GitHub (the helper will format it)
    getLastUpdatedDate().then((date) => setLastUpdated(date));

    // Fetch shielded supply (Total Shielded) from defaultUrl.
    getSupplyData(DataUrlOptions.defaultUrl).then((data) =>
      setShieldedSupply(data[data.length - 1] ?? { close: "N/A", supply: 0 })
    );

    getSupplyData(DataUrlOptions.sproutUrl).then((data) =>
      setSproutSupply(data[data.length - 1] ?? { close: "N/A", supply: 0 })
    );

    getSupplyData(DataUrlOptions.saplingUrl).then((data) =>
      setSaplingSupply(data[data.length - 1] ?? { close: "N/A", supply: 0 })
    );

    getSupplyData(DataUrlOptions.orchardUrl).then((data) =>
      setOrchardSupply(data[data.length - 1] ?? { close: "N/A", supply: 0 })
    );

    getShieldedTxCount().then((data) =>
      setShieldedTxCount(data ?? { sapling: 0, orchard: 0, timestamp: "N/A" })
    );
  }, []);

  // Update lastUpdated when the selected pool changes.
  useEffect(() => {
    const fetchData = async () => {
      const data = await getSupplyData(getDataUrl());
      setLastUpdated(data[data.length - 1]?.close || "N/A");
    };
    fetchData();
  }, [selectedPool]);

  // Fetch node count data and update the most recent node count.
  useEffect(() => {
    getNodeCountData(DataUrlOptions.nodecountUrl).then((data) => {
      if (data.length > 0) {
        const lastEntry = data[data.length - 1];
        // Convert the string value to a number.
        setLatestNodeCount(Number(lastEntry.nodecount));
      }
    });
  }, []);

  const getDataUrl = () => {
    switch (selectedPool) {
      case "sprout":
        return DataUrlOptions.sproutUrl;
      case "sapling":
        return DataUrlOptions.saplingUrl;
      case "orchard":
        return DataUrlOptions.orchardUrl;
      case "hashrate":
        return DataUrlOptions.hashrateUrl;
      case "nodecount":
        return DataUrlOptions.nodecountUrl;
      case "difficulty":
        return DataUrlOptions.difficultyUrl;
      case "lockbox":
        return DataUrlOptions.lockboxUrl;
      case ToolOptions.net_inflows_outflows:
        return DataUrlOptions.netInflowsOutflowsUrl;
      case "issuance":
        // console.log(issuanceUrl);
        return DataUrlOptions.issuanceUrl;
      default:
        return DataUrlOptions.defaultUrl;
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

  // Now, the total supply is directly taken from shieldedSupply.
  const getTotalShieldedSupply = () => {
    return shieldedSupply?.supply ?? 0;
  };

  const handleToolChange = (tool: string) => {
    setSelectedTool(tool);
    switch (tool) {
      case ToolOptions.supply:
        setSelectedPool("default");
        setSelectedToolName("Shielded Supply Chart (ZEC)");
        break;
      case ToolOptions.transaction:
        setSelectedPool("default");
        setSelectedToolName("Shielded Transactions Chart (ZEC)");
        break;
      case "issuance":
        setSelectedPool("issuance");
        setSelectedToolName("Issuance Chart (ZEC)");
        break;
      case ToolOptions.nodecount:
        setSelectedPool("nodecount");
        setSelectedToolName("Node Count");
        break;
      case ToolOptions.difficulty:
        setSelectedPool("difficulty");
        setSelectedToolName("Difficulty");
        break;
      case ToolOptions.lockbox:
        setSelectedPool("lockbox");
        setSelectedToolName("Lockbox ZEC Amount");
        break;
      case ToolOptions.net_inflows_outflows:
        setSelectedPool(ToolOptions.net_inflows_outflows);
        setSelectedToolName(ToolOptions.net_inflows_outflows);
        break;
    }
  };

  const handleCumulativeChange = (checked: boolean) => {
    setCumulativeCheck(checked);
  };

  const handleFilterChange = (checked: boolean) => {
    setfilterSpamCheck(checked);
  };

  if (!blockchainInfo) {
    return (
      <div className="flex justify-center content-center mt-48">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mt-28">
      <div className="flex items-center gap-4 justify-between">
        <h2 className="font-bold mt-8 mb-4">{selectedToolName}</h2>
        <div>
          <Button
            text="Zcash"
            className="px-3 py-2 border text-white border-slate-300 rounded-md shadow-sm bg-[#1984c7]"
            onClick={() => setSelectedCoin("Zcash")}
          />
          <Button
            text="Penumbra"
            className="px-3 py-2 border text-white border-slate-300 rounded-md shadow-sm bg-[#1984c7]"
            onClick={() => setSelectedCoin("Penumbra")}
          />
          <Button
            text="Namada"
            className="px-3 py-2 border text-white border-slate-300 rounded-md shadow-sm bg-[#1984c7]"
            onClick={() => setSelectedCoin("Namada")}
          />
        </div>
      </div>

      <div className="border border-slate-400 p-3 rounded-lg">
        <div className="flex items-center gap-4 justify-end">
          
        <Tools 
  onToolChange={handleToolChange}
  defaultSelected={ToolOptions.supply}  // Add this prop
/>        </div>
        <div className="relative">
          <div ref={divChartRef}>
            {selectedCoin !== "Zcash" ? (
              <div className="w-full h-[400px] flex flex-col justify-center items-center">
                <Image
                  className="mb-8 object-cover "
                  alt="Nodata"
                  width={200}
                  height={250}
                  src={NoData}
                />
                <p className="font-[20px]">
                  Chart data for {selectedCoin} unavailable
                </p>
              </div>
            ) : (
              <>
                {/* {selectedTool === "supply" && ( */}
                {selectedTool === ToolOptions.supply && (
                  <ShieldedPoolChart
                    dataUrl={getDataUrl()}
                    color={getDataColor()}
                  />
                )}
                {/* {selectedTool === "transaction" && ( */}
                {selectedTool === ToolOptions.transaction && (
              <TransactionSummaryChart
              dataUrl={DataUrlOptions.txsummaryUrl}
              pool={selectedPool}
              cumulative={cumulativeCheck}
              filter={filterSpamCheck}
              applyFilter={!cumulativeCheck || filterSpamCheck}  // Add this new prop
            />
                )}
                {/* {selectedTool === "nodecount" && ( */}
                {selectedTool === ToolOptions.nodecount && (
                  <NodeCountChart
                    dataUrl={getDataUrl()}
                    color={getDataColor()}
                  />
                )}
                {/* {selectedTool === "difficulty" && ( */}
                {selectedTool === ToolOptions.difficulty && (
                  <NodeCountChart
                    dataUrl={getDataUrl()}
                    color={getDataColor()}
                  />
                )}
                {/* {selectedTool === "lockbox" && ( */}
                {selectedTool === ToolOptions.lockbox && (
                  <NodeCountChart
                    dataUrl={getDataUrl()}
                    color={getDataColor()}
                  />
                )}
                {selectedTool === ToolOptions.net_inflows_outflows && (
                  <NetInflowsOutflowsChart
                    dataUrl={getDataUrl()}
                    color={getDataColor()}
                  />
                )}
                {/* {selectedTool === "issuance" && (
              <NodeCountChart
                dataUrl={getDataUrl()}
                color={getDataColor()}
                chartType="line"
              />
            )} */}
                {selectedTool === "issuance" && (
                  <ZecIssuanceSummaryChart
                    dataUrl={DataUrlOptions.issuanceUrl}
                    pool={selectedPool}
                    cumulative={cumulativeCheck}
                    filter={filterSpamCheck}
                  />
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-12 text-right mt-20 mb-2 mr-2 text-sm text-gray-500">
          <span className="px-3 py-2">
            Last updated: {formatDate(lastUpdated)}
          </span>
          <Button
            text="Export (PNG)"
            className="px-3 py-2 border text-white border-slate-300 rounded-md shadow-sm bg-[#1984c7]"
            onClick={() =>
              handleSaveToPng(
                selectedPool,
                {
                  sproutSupply: transformSupplyData(sproutSupply),
                  saplingSupply: transformSupplyData(saplingSupply),
                  orchardSupply: transformSupplyData(orchardSupply),
                },
                selectedTool
              )
            }
          />
        </div>
      </div>
      {selectedTool === "supply" && (
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
                onClick={() => setSelectedPool("sprout")}
                text="Sprout Pool"
                className={`rounded-[0.4rem] py-2 px-4 text-white ${
                  selectedPool === "sprout" ? "bg-[#1984c7]" : "bg-gray-400"
                }`}
              />
              <span className="text-sm text-gray-600">
                {sproutSupply
                  ? `${sproutSupply.supply.toLocaleString()} ZEC`
                  : "Loading..."}
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
                {saplingSupply
                  ? `${saplingSupply.supply.toLocaleString()} ZEC`
                  : "Loading..."}
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
                {orchardSupply
                  ? `${orchardSupply.supply.toLocaleString()} ZEC`
                  : "Loading..."}
              </span>
            </div>
          </div>
        </div>
      )}
      {selectedTool === "transaction" && (
        <div className="mt-8 flex flex-col items-center">
          <div className="flex justify-center space-x-4">
            <div className="flex flex-col items-center">
              <Button
                onClick={() => setSelectedPool("default")}
                text="Sapling + Orchard"
                className={`rounded-[0.4rem] py-2 px-4 text-white ${
                  selectedPool === "default" ? "bg-[#1984c7]" : "bg-gray-400"
                }`}
              />
            </div>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => setSelectedPool("sapling")}
                text="Sapling"
                className={`rounded-[0.4rem] py-2 px-4 text-white ${
                  selectedPool === "sapling" ? "bg-[#1984c7]" : "bg-gray-400"
                }`}
              />
            </div>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => setSelectedPool("orchard")}
                text="Orchard"
                className={`rounded-[0.4rem] py-2 px-4 text-white ${
                  selectedPool === "orchard" ? "bg-[#1984c7]" : "bg-gray-400"
                }`}
              />
            </div>
            <div className="flex flex-col items-center">
              <Checkbox
                checked={cumulativeCheck}
                onChange={handleCumulativeChange}
                label="Cumulative Values"
                className="custom-checkbox"
              />
            </div>
            <div className="flex flex-col items-center">
              <Checkbox
                checked={filterSpamCheck}
                onChange={handleFilterChange}
                label="Filter Spam"
                className="custom-checkbox"
              />
            </div>
          </div>
        </div>
      )}

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
          <p>
            {typeof latestNodeCount === "number"
              ? latestNodeCount.toLocaleString()
              : "Loading..."}
          </p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Shielded TX (24h)</h3>
          <p>
            {shieldedTxCount
              ? `Sapling: ${shieldedTxCount.sapling?.toLocaleString()} | Orchard: ${shieldedTxCount.orchard?.toLocaleString()}`
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShieldedPoolDashboard;

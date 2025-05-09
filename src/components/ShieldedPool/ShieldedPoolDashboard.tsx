"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import NodeCountChart from "@/components/NodeCountChart";
import Tools from "@/components/Tools";
import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import { Spinner } from "flowbite-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import NoData from "../../assets/nodata.svg";
import PrivacySetVisualization from "../PrivacySet/PrivacySetVisualization";
import { ToolOptions, toolOptionLabels } from "../Tools/tools";

const ShieldedPoolChart           = dynamic(() => import("./ShieldedPoolChart"), { ssr: true });
const TransactionSummaryChart     = dynamic(() => import("../TransactionSummaryChart"), { ssr: true });
const ZecIssuanceSummaryChart     = dynamic(() => import("../ZecIssuanceSummaryChart"), { ssr: true });
const NetInflowsOutflowsChart     = dynamic(() => import("../Charts/NetInflowsOutflowsChart"), { ssr: true });

const DataUrlOptions = {
  defaultUrl:     "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shielded_supply.json",
  sproutUrl:      "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sprout_supply.json",
  saplingUrl:     "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sapling_supply.json",
  orchardUrl:     "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/orchard_supply.json",
  netInflowsOutflowsUrl: "/data/netinflowoutflow.json",
  nodecountUrl:   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/nodecount.json",
  difficultyUrl:  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/difficulty.json",
  lockboxUrl:     "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/lockbox.json",
  txsummaryUrl:   "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json",
  shieldedTxCountUrl: "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shieldedtxcount.json",
  issuanceUrl:    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/issuance.json",
  apiUrl:         "https://api.github.com/repos/ZecHub/zechub-wiki/commits?path=public/data/shielded_supply.json",
};

const blockchainInfoUrl = "/api/blockchain-info";

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
  largest_transaction_24h: { hash: string; value_usd: number };
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

interface SupplyData { close: string; supply: number; }
type ShieldedTxCount   = { sapling: number; orchard: number; timestamp: string; };
type NodeCountData     = { Date: string; nodecount: string; };

async function getBlockchainData(): Promise<BlockchainInfo | null> {
  try {
    const res = await fetch("https://api.blockchair.com/zcash/stats?key=A___nnFHttBygZPrKgm5WZyXU3WCondo");
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as BlockchainInfo;
  } catch {
    return null;
  }
}

async function getBlockchainInfo(): Promise<number | null> {
  try {
    const res = await fetch(blockchainInfoUrl);
    if (!res.ok) return null;
    const json = await res.json();
    return parseInt(json.chainSupply.chainValueZat, 10) * 1e-8;
  } catch {
    return null;
  }
}

async function getSupplyData(url: string): Promise<SupplyData[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return (await res.json()) as SupplyData[];
  } catch {
    return [];
  }
}

async function getLastUpdatedDate(): Promise<string> {
  try {
    const res = await fetch(DataUrlOptions.apiUrl);
    if (!res.ok) return "N/A";
    const d = await res.json();
    return d[0]?.commit?.committer?.date ?? "N/A";
  } catch {
    return "N/A";
  }
}

async function getShieldedTxCount(): Promise<ShieldedTxCount[] | null> {
  try {
    const res = await fetch(DataUrlOptions.shieldedTxCountUrl);
    if (!res.ok) return null;
    return (await res.json()) as ShieldedTxCount[];
  } catch {
    return null;
  }
}

async function getNodeCountData(url: string): Promise<NodeCountData[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return (await res.json()) as NodeCountData[];
  } catch {
    return [];
  }
}

function formatDate(s: string | null): string {
  if (!s) return "N/A";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
}

function transformSupplyData(d: SupplyData | null) {
  return d ? { timestamp: d.close, supply: d.supply } : null;
}

const ShieldedPoolDashboard: React.FC = () => {
  const [selectedPool, setSelectedPool]           = useState<string>("default");
  const [selectedCoin, setSelectedCoin]           = useState<string>("Zcash");
  const [selectedTool, setSelectedTool]           = useState<string>(ToolOptions.supply);
  const [selectedToolName, setSelectedToolName]   = useState<string>(toolOptionLabels[ToolOptions.supply]);
  const [cumulativeCheck, setCumulativeCheck]     = useState<boolean>(true);
  const [filterSpamCheck, setfilterSpamCheck]     = useState<boolean>(false);

  const [blockchainInfo, setBlockchainInfo]       = useState<BlockchainInfo | null>(null);
  const [circulation, setCirculation]             = useState<number | null>(null);
  const [shieldedSupply, setShieldedSupply]       = useState<SupplyData | null>(null);
  const [sproutSupply, setSproutSupply]           = useState<SupplyData | null>(null);
  const [saplingSupply, setSaplingSupply]         = useState<SupplyData | null>(null);
  const [orchardSupply, setOrchardSupply]         = useState<SupplyData | null>(null);
  const [lastUpdated, setLastUpdated]             = useState<string | null>(null);
  const [shieldedTxCount, setShieldedTxCount]     = useState<ShieldedTxCount[] | null>(null);
  const [latestNodeCount, setLatestNodeCount]     = useState<number | null>(null);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  // Initial data fetch
  useEffect(() => {
    getBlockchainData().then(d => d && setBlockchainInfo(d));
    getBlockchainInfo().then(c => setCirculation(c));
    getLastUpdatedDate().then(d => setLastUpdated(d));

    getSupplyData(DataUrlOptions.defaultUrl).then(a => setShieldedSupply(a[a.length-1] || null));
    getSupplyData(DataUrlOptions.sproutUrl).then(a => setSproutSupply(a[a.length-1] || null));
    getSupplyData(DataUrlOptions.saplingUrl).then(a => setSaplingSupply(a[a.length-1] || null));
    getSupplyData(DataUrlOptions.orchardUrl).then(a => setOrchardSupply(a[a.length-1] || null));
    getShieldedTxCount().then(d => d && setShieldedTxCount(d));
    getNodeCountData(DataUrlOptions.nodecountUrl).then(a => a.length && setLatestNodeCount(Number(a[a.length-1].nodecount)));
  }, []);

  // Update lastUpdated when pool changes
  useEffect(() => {
    (async () => {
      const url = selectedPool === "default"
        ? DataUrlOptions.defaultUrl
        : (DataUrlOptions as any)[`${selectedPool}Url`];
      const a = await getSupplyData(url);
      setLastUpdated(a[a.length-1]?.close || "N/A");
    })();
  }, [selectedPool]);

  const getDataUrl = (): string => {
    switch (selectedPool) {
      case "sprout": return DataUrlOptions.sproutUrl;
      case "sapling": return DataUrlOptions.saplingUrl;
      case "orchard": return DataUrlOptions.orchardUrl;
      case ToolOptions.net_inflows_outflows: return DataUrlOptions.netInflowsOutflowsUrl;
      case "issuance": return DataUrlOptions.issuanceUrl;
      case ToolOptions.nodecount: return DataUrlOptions.nodecountUrl;
      case ToolOptions.difficulty: return DataUrlOptions.difficultyUrl;
      case ToolOptions.lockbox: return DataUrlOptions.lockboxUrl;
      default: return DataUrlOptions.defaultUrl;
    }
  };

  const getDataColor = (): string => {
    switch (selectedPool) {
      case "sprout": return "#A020F0";
      case "sapling": return "#FFA500";
      case "orchard": return "#32CD32";
      default: return "url(#area-background-gradient)";
    }
  };

const handleToolChange = (tool: ToolOptions) => {
  setSelectedTool(tool);
  // route each tool to the correct dataUrl via selectedPool
  switch (tool) {
    case ToolOptions.supply:
      setSelectedPool("default");
      break;
    case ToolOptions.transaction:
      setSelectedPool("default");
      break;
    case ToolOptions.nodecount:
      setSelectedPool("nodecount");
      break;
    case ToolOptions.difficulty:
      setSelectedPool("difficulty");
      break;
    case ToolOptions.lockbox:
      setSelectedPool("lockbox");
      break;
    case ToolOptions.net_inflows_outflows:
      setSelectedPool("net_inflows_outflows");
      break;
    case "issuance":
      setSelectedPool("issuance");
      break;
    case ToolOptions.privacy_set:
      setSelectedPool("default");
      break;
    default:
      setSelectedPool("default");
  }
  setSelectedToolName(toolOptionLabels[tool]);
};


  if (!blockchainInfo) {
    return <div className="flex justify-center mt-48"><Spinner /></div>;
  }

  // Helper to get supply by pool key
  const poolLabels: Record<string,string> = {
    default: "Total Shielded",
    sprout:  "Sprout Pool",
    sapling: "Sapling Pool",
    orchard: "Orchard Pool",
  };
  const getSupplyByPool = (k: string) => {
    switch (k) {
      case "sprout": return sproutSupply?.supply ?? 0;
      case "sapling": return saplingSupply?.supply ?? 0;
      case "orchard": return orchardSupply?.supply ?? 0;
      default: return shieldedSupply?.supply ?? 0;
    }
  };

  return (
    <div className="mt-28">
      {/* Header & Coin Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">{selectedToolName}</h2>
        <div className="flex gap-2">
          <Button text="Zcash"    onClick={() => setSelectedCoin("Zcash")} />
          <Button text="Penumbra" onClick={() => setSelectedCoin("Penumbra")} />
          <Button text="Namada"   onClick={() => setSelectedCoin("Namada")} />
        </div>
      </div>

      {/* Chart & Tool Selector */}
      <div className="border p-4 rounded-lg relative">
        <Tools onToolChange={handleToolChange} defaultSelected={ToolOptions.supply} />
        <div ref={divChartRef}>
          {selectedCoin !== "Zcash" ? (
            <div className="w-full h-[400px] flex flex-col items-center justify-center">
              <Image src={NoData} width={200} height={250} alt="No data" />
              <p>Chart data for {selectedCoin} unavailable</p>
            </div>
          ) : (
            <>
              {selectedTool === ToolOptions.supply && <ShieldedPoolChart dataUrl={getDataUrl()} color={getDataColor()} />}
              {selectedTool === ToolOptions.transaction && (
                <TransactionSummaryChart
                  dataUrl={DataUrlOptions.txsummaryUrl} pool={selectedPool}
                  cumulative={cumulativeCheck} filter={filterSpamCheck}
                  applyFilter={!cumulativeCheck || filterSpamCheck}
                />
              )}
              {selectedTool === ToolOptions.nodecount && <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()} />}
              {selectedTool === ToolOptions.difficulty && <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()} />}
              {selectedTool === ToolOptions.lockbox    && <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()} />}
              {selectedTool === ToolOptions.net_inflows_outflows && <NetInflowsOutflowsChart dataUrl={getDataUrl()} color={getDataColor()} />}
              {selectedTool === "issuance"    && <ZecIssuanceSummaryChart dataUrl={DataUrlOptions.issuanceUrl} pool={selectedPool} cumulative={cumulativeCheck} filter={filterSpamCheck} />}
              {selectedTool === ToolOptions.privacy_set && <PrivacySetVisualization />}
            </>
          )}
        </div>

        {/* Supply-Pool Toggles */}
        {selectedTool === ToolOptions.supply && (
          <div className="mt-8 flex justify-center space-x-6">
            {Object.keys(poolLabels).map(key => (
              <div key={key} className="flex flex-col items-center">
                <Button
                  onClick={() => setSelectedPool(key)}
                  text={poolLabels[key]}
                  className={`py-2 px-4 rounded ${selectedPool===key?"bg-[#1984c7]":"bg-gray-400"} text-white`}
                />
                <span className="text-sm text-gray-600">
                  {getSupplyByPool(key).toLocaleString()} ZEC
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Export & Last Updated */}
        <div className="flex justify-end gap-4 text-sm text-gray-500 mt-4">
          <span>Last updated: {formatDate(lastUpdated)}</span>
          <Button text="Export (PNG)" onClick={() => handleSaveToPng(
            selectedPool,
            {
              sproutSupply: transformSupplyData(sproutSupply),
              saplingSupply: transformSupplyData(saplingSupply),
              orchardSupply: transformSupplyData(orchardSupply),
            },
            selectedTool
          )} />
        </div>
      </div>

      {/* Metrics Panel */}
      <div className="flex flex-wrap gap-8 justify-center items-center mt-8">
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Cap</h3>
          <p>${blockchainInfo.market_cap_usd.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">ZEC in Circulation</h3>
          <p>{circulation?.toLocaleString() ?? "N/A"} ZEC</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Price (USD)</h3>
          <p>${blockchainInfo.market_price_usd.toFixed(2)}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Price (BTC)</h3>
          <p>{blockchainInfo.market_price_btc}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Blocks</h3>
          <p>{blockchainInfo.blocks.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">24h Transactions</h3>
          <p>{blockchainInfo.transactions_24h.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Nodes</h3>
          <p>{latestNodeCount?.toLocaleString() ?? "Loading..."}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Shielded TX (24h)</h3>
          <p>{shieldedTxCount && shieldedTxCount.length
              ? `Sapling: ${shieldedTxCount[shieldedTxCount.length-1].sapling.toLocaleString()} | Orchard: ${shieldedTxCount[shieldedTxCount.length-1].orchard.toLocaleString()}`
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShieldedPoolDashboard;

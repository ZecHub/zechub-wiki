"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import NodeCountChart from "@/components/NodeCountChart";
import Tools from "@/components/Tools";
import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import { Spinner } from "flowbite-react";
import PrivacySetVisualization from "../PrivacySet/PrivacySetVisualization";
import NamadaSupplyChart from "./NamadaSupplyChart";
import { ToolOptions, toolOptionLabels } from "../Tools/tools";
import NoData from "../../assets/nodata.svg";

const ShieldedPoolChart       = dynamic(() => import("./ShieldedPoolChart"),       { ssr: true });
const TransactionSummaryChart = dynamic(() => import("../TransactionSummaryChart"), { ssr: true });
const ZecIssuanceSummaryChart = dynamic(() => import("../ZecIssuanceSummaryChart"),{ ssr: true });
const NetInflowsOutFlowsChart = dynamic(() => import("../Charts/NetInflowsOutflowsChart"),{ ssr: true });

const DataUrlOptions = {
  defaultUrl:             "/data/zcash/shielded_supply.json",
  sproutUrl:              "/data/zcash/sprout_supply.json",
  saplingUrl:             "/data/zcash/sapling_supply.json",
  orchardUrl:             "/data/zcash/orchard_supply.json",
  netInflowsOutflowsUrl:  "/data/zcash/netinflowoutflow.json",
  nodecountUrl:           "/data/zcash/nodecount.json",
  difficultyUrl:          "/data/zcash/difficulty.json",
  lockboxUrl:             "/data/zcash/lockbox.json",
  txsummaryUrl:           "/data/zcash/transaction_summary.json",
  shieldedTxCountUrl:     "/data/zcash/shieldedtxcount.json",
  issuanceUrl:            "/data/zcash/issuance.json",
  apiUrl:                 "https://api.github.com/repos/ZecHub/zechub-wiki/commits?path=public/data/shielded_supply.json",
  namadaSupplyUrl:        "/data/namada/namada_supply.json",
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

type SupplyData = { close: string; supply: number };
type ShieldedTxCount = { sapling: number; orchard: number; timestamp: string };
type NodeCountData = { Date: string; nodecount: string };

async function getBlockchainData(): Promise<BlockchainInfo | null> {
  try {
    const res = await fetch(
      "https://api.blockchair.com/zcash/stats?key=A___nnFHttBygZPrKgm5WZyXU3WCondo"
    );
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

function transformSupplyData(
  d: SupplyData | null
): { timestamp: string; supply: number } | null {
  return d ? { timestamp: d.close, supply: d.supply } : null;
}

const ShieldedPoolDashboard: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<string>("default");
  const [selectedCoin, setSelectedCoin] = useState<"Zcash" | "Penumbra" | "Namada">("Zcash");
  const [selectedTool, setSelectedTool] = useState<ToolOptions>(ToolOptions.supply);
  const [selectedToolName, setSelectedToolName] = useState<string>(toolOptionLabels[ToolOptions.supply]);
  const [cumulativeCheck, setCumulativeCheck] = useState(true);
  const [filterSpamCheck, setFilterSpamCheck] = useState(false);

  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(null);
  const [circulation, setCirculation] = useState<number | null>(null);
  const [supplies, setSupplies] = useState<{ default: SupplyData | null; sprout: SupplyData | null; sapling: SupplyData | null; orchard: SupplyData | null }>({ default: null, sprout: null, sapling: null, orchard: null });
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [shieldedTxCount, setShieldedTxCount] = useState<ShieldedTxCount[] | null>(null);
  const [latestNodeCount, setLatestNodeCount] = useState<number | null>(null);

  const [namadaAssets, setNamadaAssets] = useState<{ id: string; totalSupply: string }[]>([]);
  const [selectedNamadaAsset, setSelectedNamadaAsset] = useState<string>("");

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  // Initial data loads
  useEffect(() => {
    getBlockchainData().then((d) => d && setBlockchainInfo(d));
    getBlockchainInfo().then((c) => setCirculation(c));
    getLastUpdatedDate().then((d) => setLastUpdated(d));

    getSupplyData(DataUrlOptions.defaultUrl).then((a) => setSupplies((s) => ({ ...s, default: a.pop() || null })));
    getSupplyData(DataUrlOptions.sproutUrl).then((a) => setSupplies((s) => ({ ...s, sprout: a.pop() || null })));
    getSupplyData(DataUrlOptions.saplingUrl).then((a) => setSupplies((s) => ({ ...s, sapling: a.pop() || null })));
    getSupplyData(DataUrlOptions.orchardUrl).then((a) => setSupplies((s) => ({ ...s, orchard: a.pop() || null })));

    getShieldedTxCount().then((d) => d && setShieldedTxCount(d));
    getNodeCountData(DataUrlOptions.nodecountUrl).then((a) => { if (a.length) setLatestNodeCount(Number(a[a.length - 1].nodecount)); });
  }, []);

  // Update lastUpdated when pool changes
  useEffect(() => {
    (async () => {
      const key = selectedPool === "default" ? "defaultUrl" : `${selectedPool}Url`;
      const arr = await getSupplyData((DataUrlOptions as any)[key]);
      setLastUpdated(arr.pop()?.close || "N/A");
    })();
  }, [selectedPool]);

  // Load Namada assets
  useEffect(() => {
    if (selectedCoin !== "Namada") return;
    fetch(DataUrlOptions.namadaSupplyUrl)
      .then((r) => r.json())
      .then((json: any[]) => {
        const list = json[0]?.["Total_Supply"] || [];
        setNamadaAssets(list);
        if (list.length) setSelectedNamadaAsset(list[0].id);
      })
      .catch(console.error);
  }, [selectedCoin]);

  if (!blockchainInfo) {
    return (
      <div className="flex justify-center mt-48"> <Spinner /> </div>
    );
  }

  const poolLabels = { default: "Total Shielded", sprout: "Sprout Pool", sapling: "Sapling Pool", orchard: "Orchard Pool" } as const;
  const poolKeys = Object.keys(poolLabels) as Array<keyof typeof poolLabels>;

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
    switch (tool) {
      case ToolOptions.supply:
      case ToolOptions.transaction:
      case ToolOptions.privacy_set:
        setSelectedPool("default"); break;
      case ToolOptions.nodecount:
        setSelectedPool("nodecount"); break;
      case ToolOptions.difficulty:
        setSelectedPool("difficulty"); break;
      case ToolOptions.lockbox:
        setSelectedPool("lockbox"); break;
      case ToolOptions.net_inflows_outflows:
        setSelectedPool(ToolOptions.net_inflows_outflows); break;
      case "issuance":
        setSelectedPool("issuance"); break;
      default:
        setSelectedPool("default");
    }
    setSelectedToolName(toolOptionLabels[tool]);
  };

  return (
    <div className="mt-28">
      {/* Header & Coin Buttons */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <h2 className="font-bold text-xl">{selectedToolName}</h2>
        <div className="flex gap-4">
          <Button text="Zcash" className="bg-orange-400/75 text-white rounded-full px-4 py-2" onClick={() => setSelectedCoin("Zcash")} />
          <Button text="Penumbra" className="bg-purple-500/75 text-white rounded-full px-4 py-2" onClick={() => setSelectedCoin("Penumbra")} />
          <Button text="Namada" className="bg-yellow-300/75 text-white rounded-full px-4 py-2" onClick={() => setSelectedCoin("Namada")} />
        </div>
      </div>
      {/* Chart & Tools */}
      <div className="border p-4 rounded-lg relative">
        <Tools onToolChange={handleToolChange} defaultSelected={ToolOptions.supply} />
        <div ref={divChartRef}>
          {/* Zcash */}
          {selectedCoin === "Zcash" && (
            <> {/* supply, transaction, nodecount, etc. sections unchanged */}
              {selectedTool === ToolOptions.privacy_set && <PrivacySetVisualization />}
            </>
          )}
          {/* Namada chart */}
          {selectedCoin === "Namada" && selectedTool === ToolOptions.supply && selectedNamadaAsset && (
            <NamadaSupplyChart dataUrl={DataUrlOptions.namadaSupplyUrl} assetId={selectedNamadaAsset} />
          )}
          {/* Other coins */}
          {selectedCoin !== "Zcash" && selectedCoin !== "Namada" && (
            <div className="w-full h-[400px] flex flex-col items-center justify-center">
              <Image src={NoData} width={200} height={250} alt="No data" />
              <p>Chart data for {selectedCoin} unavailable</p>
            </div>
          )}
        </div>
        {/* Zcash pool toggles */}
        {selectedTool === ToolOptions.supply && selectedCoin === "Zcash" && (
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {poolKeys.map((key) => (
              <div key={key} className="flex flex-col items-center">
                <Button
                  text={poolLabels[key]}
                  className={`py-2 px-4 rounded-full ${selectedPool === key ? "bg-[#1984c7] text-white" : "bg-gray-400 text-white"}`}
                  onClick={() => setSelectedPool(key)}
                />
                <span className="text-sm text-gray-600 mt-1">{(supplies[key]?.supply || 0).toLocaleString()} ZEC</span>
              </div>
            ))}
          </div>
        )}
        {/* Namada toggles */}
        {selectedTool === ToolOptions.supply && selectedCoin === "Namada" && (
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {namadaAssets.map((asset) => (
              <div key={asset.id} className="flex flex-col items-center">
                <Button
                  text={asset.id}
                  className={`py-2 px-4 rounded-full ${selectedNamadaAsset === asset.id ? "bg-yellow-500 text-white" : "bg-gray-400 text-white"}`}
                  onClick={() => setSelectedNamadaAsset(asset.id)}
                />
                <span className="text-sm text-gray-600 mt-1">{(Number(asset.totalSupply || 0) / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            ))}
          </div>
        )}
        {/* Export & Last Updated */}
        <div className="flex justify-end items-center gap-4 mt-4">
          <span className="text-sm text-gray-500">Last updated: {formatDate(lastUpdated)}</span>
          <Button
            text="Export PNG"
            className="bg-blue-500 text-white rounded-full px-4 py-2"
            onClick={() =>
              handleSaveToPng(
                selectedPool,
                {
                  sproutSupply: transformSupplyData(supplies.sprout),
                  saplingSupply: transformSupplyData(supplies.sapling),
                  orchardSupply: transformSupplyData(supplies.orchard),
                },
                selectedTool
              )
            }
          />
        </div>
      </div>
      {/* Metrics */}
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
          <p>
            {shieldedTxCount?.length
              ? `Sapling: ${shieldedTxCount[shieldedTxCount.length - 1].sapling.toLocaleString()} | Orchard: ${shieldedTxCount[shieldedTxCount.length - 1].orchard.toLocaleString()}`
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShieldedPoolDashboard;

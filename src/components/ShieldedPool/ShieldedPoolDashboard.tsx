"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import NodeCountChart from "@/components/NodeCountChart";
import Tools from "@/components/Tools";
import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import { Spinner } from "flowbite-react";
import PrivacySetVisualization from "../PrivacySet/PrivacySetVisualization";
import NamadaSupplyChart, { SeriesPoint } from "./NamadaSupplyChart";
import { ToolOptions, toolOptionLabels } from "../Tools/tools";
import NoData from "../../assets/nodata.svg";

// Dynamic imports
const ShieldedPoolChart       = dynamic(() => import("./ShieldedPoolChart"),       { ssr: true });
const TransactionSummaryChart = dynamic(() => import("../TransactionSummaryChart"), { ssr: true });
const ZecIssuanceSummaryChart = dynamic(() => import("../ZecIssuanceSummaryChart"),{ ssr: true });
const NetInflowsOutFlowsChart = dynamic(() => import("../Charts/NetInflowsOutflowsChart"),{ ssr: true });

// Data URLs
const DataUrlOptions = {
  defaultUrl:             "/data/zcash/shielded_supply.json",
  sproutUrl:              "/data/zcash/sprout_supply.json",
  saplingUrl:             "/data/zcash/sapling_supply.json",
  orchardUrl:             "/data/zcash/orchard_supply.json",
  txsummaryUrl:           "/data/zcash/transaction_summary.json",
  netInflowsOutflowsUrl:  "/data/zcash/netinflowoutflow.json",
  nodecountUrl:           "/data/zcash/nodecount.json",
  difficultyUrl:          "/data/zcash/difficulty.json",
  lockboxUrl:             "/data/zcash/lockbox.json",
  shieldedTxCountUrl:     "/data/zcash/shieldedtxcount.json",
  issuanceUrl:            "/data/zcash/issuance.json",
  apiUrl:                 "https://api.github.com/repos/ZecHub/zechub-wiki/commits?path=public/data/shielded_supply.json",
  namadaSupplyUrl:        "/data/namada/namada_supply.json",
} as const;

const blockchainInfoUrl = "/api/blockchain-info";

// Types
interface BlockchainInfo {
  blocks: number;
  transactions_24h: number;
  market_cap_usd: number;
  market_price_usd: number;
  market_price_btc: number;
  nodes: number;
}
type SupplyData      = { close: string; supply: number };
type ShieldedTxCount = { sapling: number; orchard: number; timestamp: string };
type NodeCountData   = { Date: string; nodecount: string };
type NamadaAsset     = { id: string; totalSupply: string };

// Fetch helper
async function fetchJSON<T>(url: string): Promise<T|null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

// Pool keys
type PoolKey = "default" | "sprout" | "sapling" | "orchard";

export default function ShieldedPoolDashboard() {
  // State
  const [selectedPool, setSelectedPool]               = useState<PoolKey>("default");
  const [selectedCoin, setSelectedCoin]               = useState<"Zcash"|"Penumbra"|"Namada">("Zcash");
  const [selectedTool, setSelectedTool]               = useState<ToolOptions>(ToolOptions.supply);
  const [selectedToolName, setSelectedToolName]       = useState(toolOptionLabels[ToolOptions.supply]);
  const [cumulativeCheck, setCumulativeCheck]         = useState(true);
  const [filterSpamCheck, setFilterSpamCheck]         = useState(false);

  const [blockchainInfo, setBlockchainInfo]           = useState<BlockchainInfo|null>(null);
  const [circulation, setCirculation]                 = useState<number|null>(null);
  const [supplies, setSupplies] = useState<Record<PoolKey,SupplyData|null>>({
    default: null,
    sprout:  null,
    sapling: null,
    orchard: null,
  });
  const [lastUpdated, setLastUpdated]                 = useState<string|null>(null);
  const [shieldedTxCount, setShieldedTxCount]         = useState<ShieldedTxCount[]|null>(null);
  const [latestNodeCount, setLatestNodeCount]         = useState<number|null>(null);

  // Namada
  const [namadaRaw, setNamadaRaw]                     = useState<any[]>([]);
  const [namadaAssets, setNamadaAssets]               = useState<NamadaAsset[]>([]);
  const [selectedNamadaAsset, setSelectedNamadaAsset] = useState<string>("");
  const [namadaSeries, setNamadaSeries]               = useState<SeriesPoint[]>([]);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  // Build the correct URL based on tool & pool
  const getDataUrl = useCallback((): string => {
    if (selectedTool === ToolOptions.supply) {
      switch (selectedPool) {
        case "sprout":  return DataUrlOptions.sproutUrl;
        case "sapling": return DataUrlOptions.saplingUrl;
        case "orchard": return DataUrlOptions.orchardUrl;
        default:        return DataUrlOptions.defaultUrl;
      }
    }
    if (selectedTool === ToolOptions.transaction)        return DataUrlOptions.txsummaryUrl;
    if (selectedTool === ToolOptions.net_inflows_outflows)return DataUrlOptions.netInflowsOutflowsUrl;
    if (selectedTool === ToolOptions.nodecount)          return DataUrlOptions.nodecountUrl;
    if (selectedTool === ToolOptions.difficulty)         return DataUrlOptions.difficultyUrl;
    if (selectedTool === ToolOptions.lockbox)            return DataUrlOptions.lockboxUrl;
    if (selectedTool === "issuance")                     return DataUrlOptions.issuanceUrl;
    return DataUrlOptions.defaultUrl;
  }, [selectedTool, selectedPool]);

  // Initial load
  useEffect(() => {
    // Zcash stats
    fetchJSON<BlockchainInfo>("https://api.blockchair.com/zcash/stats?key=A___nnFHttBygZPrKgm5WZyXU3WCondo")
      .then(d => d && setBlockchainInfo(d));
    fetchJSON<any>(blockchainInfoUrl)
      .then(j => j && setCirculation(parseInt(j.chainSupply.chainValueZat,10)*1e-8));
    // Last updated for shielded supply
    fetchJSON<any[]>(DataUrlOptions.apiUrl)
      .then(c => c && setLastUpdated(c[0]?.commit?.committer?.date?.slice(0,10) || "N/A"));

    // Shielded supply pools
    (["default","sprout","sapling","orchard"] as PoolKey[]).forEach(pool => {
      const url = pool === "default"
        ? DataUrlOptions.defaultUrl
        : (DataUrlOptions as any)[`${pool}Url`];
      fetchJSON<SupplyData[]>(url)
        .then(arr => arr && setSupplies(s => ({ ...s, [pool]: arr.pop()||null })));
    });

    // TX counts + nodes
    fetchJSON<ShieldedTxCount[]>(DataUrlOptions.shieldedTxCountUrl)
      .then(d => d && setShieldedTxCount(d));
    fetchJSON<NodeCountData[]>(DataUrlOptions.nodecountUrl)
      .then(nodes => nodes && setLatestNodeCount(Number(nodes[nodes.length-1].nodecount)));

    // Namada data
    fetchJSON<any[]>(DataUrlOptions.namadaSupplyUrl)
      .then(data => {
        if (!data) return;
        setNamadaRaw(data);
        const list: NamadaAsset[] = data[0]?.Total_Supply || [];
        setNamadaAssets(list);
        if (list.length) setSelectedNamadaAsset(list[0].id);
      });
  }, []);

  // Update lastUpdated whenever the URL changes
  useEffect(() => {
    const url = getDataUrl();
    fetchJSON<any[]>(url)
      .then(arr => arr && setLastUpdated((arr.pop()?.close as string) || "N/A"));
  }, [getDataUrl]);

  // Build Namada series
  useEffect(() => {
    if (!selectedNamadaAsset) return;
    const series = namadaRaw
      .map(day => {
        const row = day.Total_Supply.find((a:any) => a.id === selectedNamadaAsset);
        if (!row?.totalSupply) return null;
        return { timestamp: day.Date, supply: parseFloat(row.totalSupply) };
      })
      .filter((x): x is SeriesPoint => !!x);
    setNamadaSeries(series);
  }, [namadaRaw, selectedNamadaAsset]);

  if (!blockchainInfo) {
    return <div className="flex justify-center mt-48"><Spinner/></div>;
  }

  const poolLabels = {
    default: "Total Shielded",
    sprout:  "Sprout Pool",
    sapling: "Sapling Pool",
    orchard: "Orchard Pool",
  } as const;
  const poolKeys = Object.keys(poolLabels) as PoolKey[];

  const getDataColor = () => {
    switch (selectedPool) {
      case "sprout":  return "#A020F0";
      case "sapling": return "#FFA500";
      case "orchard": return "#32CD32";
      default:        return "url(#area-background-gradient)";
    }
  };

  const handleToolChange = (tool: ToolOptions) => {
    setSelectedTool(tool);
    if (
      tool === ToolOptions.supply ||
      tool === ToolOptions.transaction ||
      tool === ToolOptions.privacy_set
    ) {
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
          <Button text="Zcash"    onClick={()=>setSelectedCoin("Zcash")}    className="bg-orange-400/75 text-white px-4 py-2 rounded-full"/>
          <Button text="Penumbra" onClick={()=>setSelectedCoin("Penumbra")} className="bg-purple-500/75 text-white px-4 py-2 rounded-full"/>
          <Button text="Namada"   onClick={()=>setSelectedCoin("Namada")}   className="bg-yellow-300/75 text-white px-4 py-2 rounded-full"/>
        </div>
      </div>

      {/* Chart & Tools */}
      <div className="border p-4 rounded-lg relative">
        {/* When Namada: only supply */}
        {selectedCoin === "Namada" ? (
          <div className="mb-4 flex justify-center">
            <Button
              text="Supply"
              onClick={() => handleToolChange(ToolOptions.supply)}
              className={`px-4 py-2 rounded-full ${
                selectedTool === ToolOptions.supply
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            />
          </div>
        ) : (
          <Tools onToolChange={handleToolChange} defaultSelected={ToolOptions.supply} />
        )}

        <div ref={divChartRef}>
          {selectedCoin === "Zcash" && (
            <>
              {selectedTool === ToolOptions.supply && (
                <ShieldedPoolChart dataUrl={getDataUrl()} color={getDataColor()} />
              )}
              {selectedTool === ToolOptions.transaction && (
                <>
                  <div className="flex gap-4 justify-center mb-4">
                    <Checkbox checked={cumulativeCheck} onChange={setCumulativeCheck} label="Cumulative" />
                    <Checkbox checked={filterSpamCheck} onChange={setFilterSpamCheck} label="Filter Spam" />
                  </div>
                  <TransactionSummaryChart
                    dataUrl={DataUrlOptions.txsummaryUrl}
                    pool={selectedPool}
                    cumulative={cumulativeCheck}
                    filter={filterSpamCheck}
                    applyFilter={!cumulativeCheck || filterSpamCheck}
                  />
                </>
              )}
              {(selectedTool === ToolOptions.nodecount ||
                selectedTool === ToolOptions.difficulty ||
                selectedTool === ToolOptions.lockbox) && (
                <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()} />
              )}
              {selectedTool === ToolOptions.net_inflows_outflows && (
                <NetInflowsOutFlowsChart dataUrl={getDataUrl()} color={getDataColor()} />
              )}
              {selectedTool === "issuance" && (
                <ZecIssuanceSummaryChart
                  dataUrl={DataUrlOptions.issuanceUrl}
                  pool={selectedPool}
                  cumulative={cumulativeCheck}
                  filter={filterSpamCheck}
                />
              )}
              {selectedTool === ToolOptions.privacy_set && <PrivacySetVisualization />}
            </>
          )}

          {selectedCoin === "Namada" && selectedTool === ToolOptions.supply && (
            <NamadaSupplyChart data={namadaSeries} width={800} height={400} />
          )}

          {selectedCoin !== "Zcash" && selectedCoin !== "Namada" && (
            <div className="w-full h-[400px] flex flex-col items-center justify-center">
              <Image src={NoData} width={200} height={250} alt="No data" />
              <p>Chart data for {selectedCoin} unavailable</p>
            </div>
          )}
        </div>

        {/* Pool toggles */}
        {selectedTool === ToolOptions.supply && selectedCoin === "Zcash" && (
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {poolKeys.map(key => (
              <div key={key} className="flex flex-col items-center">
                <Button
                  text={poolLabels[key]}
                  onClick={() => setSelectedPool(key)}
                  className={`px-4 py-2 rounded-full ${
                    selectedPool === key ? "bg-[#1984c7] text-white" : "bg-gray-400 text-white"
                  }`}
                />
                <span className="text-sm text-gray-600 mt-1">
                  {(supplies[key]?.supply || 0).toLocaleString()} ZEC
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Namada toggles */}
        {selectedTool === ToolOptions.supply && selectedCoin === "Namada" && (
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {namadaAssets.map(asset => (
              <div key={asset.id} className="flex flex-col items-center">
                <Button
                  text={asset.id}
                  onClick={() => setSelectedNamadaAsset(asset.id)}
                  className={`px-4 py-2 rounded-full ${
                    selectedNamadaAsset === asset.id ? "bg-yellow-500 text-white" : "bg-gray-400 text-white"
                  }`}
                />
                <span className="text-sm text-gray-600 mt-1">
                  {asset.id === "Namada"
                    ? Number(asset.totalSupply || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })
                    : Math.floor(Number(asset.totalSupply || 0) / 1e6).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Export & Last Updated */}
        <div className="flex justify-end items-center gap-4 mt-4">
          <span className="text-sm text-gray-500">Last updated: {lastUpdated}</span>
          <Button
            text="Export PNG"
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
            onClick={() =>
              handleSaveToPng(
                selectedPool,
                {
                  sproutSupply: null,
                  saplingSupply: null,
                  orchardSupply: null,
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
              ? `Sapling: ${shieldedTxCount[shieldedTxCount.length-1].sapling.toLocaleString()} | Orchard: ${shieldedTxCount[shieldedTxCount.length-1].orchard.toLocaleString()}`
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

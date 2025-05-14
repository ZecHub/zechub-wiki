"use client";

import React, { useState, useEffect, useCallback } from "react";
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

// helper to transform SupplyData → { timestamp, supply }
function transformSupplyData(
  d: SupplyData | null
): { timestamp: string; supply: number } | null {
  return d ? { timestamp: d.close, supply: d.supply } : null;
}

// simple JSON fetch helper
async function fetchJSON<T>(url: string): Promise<T|null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

// valid Zcash pool keys
type PoolKey = "defaultUrl" | "sproutUrl" | "saplingUrl" | "orchardUrl";

export default function ShieldedPoolDashboard() {
  // State
  const [selectedPool, setSelectedPool]               = useState<PoolKey>("defaultUrl");
  const [selectedCoin, setSelectedCoin]               = useState<"Zcash"|"Penumbra"|"Namada">("Zcash");
  const [selectedTool, setSelectedTool]               = useState<ToolOptions>(ToolOptions.supply);
  const [selectedToolName, setSelectedToolName]       = useState(toolOptionLabels[ToolOptions.supply]);
  const [cumulativeCheck, setCumulativeCheck]         = useState(true);
  const [filterSpamCheck, setFilterSpamCheck]         = useState(false);

  const [blockchainInfo, setBlockchainInfo]           = useState<BlockchainInfo|null>(null);
  const [circulation, setCirculation]                 = useState<number|null>(null);
  const [supplies, setSupplies] = useState<Record<PoolKey,SupplyData|null>>({
    defaultUrl: null,
    sproutUrl: null,
    saplingUrl: null,
    orchardUrl: null,
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

  // compute data URL
  const getDataUrl = useCallback((): string => {
    switch (selectedTool) {
      case ToolOptions.supply:
        return DataUrlOptions[selectedPool];
      case ToolOptions.transaction:
        return DataUrlOptions.txsummaryUrl;
      case ToolOptions.net_inflows_outflows:
        return DataUrlOptions.netInflowsOutflowsUrl;
      case ToolOptions.nodecount:
        return DataUrlOptions.nodecountUrl;
      case ToolOptions.difficulty:
        return DataUrlOptions.difficultyUrl;
      case ToolOptions.lockbox:
        return DataUrlOptions.lockboxUrl;
      case "issuance":
        return DataUrlOptions.issuanceUrl;
      default:
        return DataUrlOptions.defaultUrl;
    }
  }, [selectedTool, selectedPool]);

  // initial load
  useEffect(() => {
    fetchJSON<BlockchainInfo>("https://api.blockchair.com/zcash/stats?key=A___nnFHttBygZPrKgm5WZyXU3WCondo")
      .then(d => d && setBlockchainInfo(d));
    fetchJSON<any>(blockchainInfoUrl)
      .then(j => j && setCirculation(parseInt(j.chainSupply.chainValueZat,10)*1e-8));
    fetchJSON<any[]>(DataUrlOptions.apiUrl)
      .then(c => c && setLastUpdated(c[0]?.commit?.committer?.date?.slice(0,10) || "N/A"));

    // shielded pools
    (["defaultUrl","sproutUrl","saplingUrl","orchardUrl"] as PoolKey[]).forEach(key => {
      fetchJSON<SupplyData[]>(DataUrlOptions[key])
        .then(arr => arr && setSupplies(s => ({ ...s, [key]: arr.pop()||null })));
    });

    // shielded tx & nodes
    fetchJSON<ShieldedTxCount[]>(DataUrlOptions.shieldedTxCountUrl)
      .then(d => d && setShieldedTxCount(d));
    fetchJSON<NodeCountData[]>(DataUrlOptions.nodecountUrl)
      .then(n => n?.length && setLatestNodeCount(Number(n[n.length-1].nodecount)));

    // namada raw + assets
    fetchJSON<any[]>(DataUrlOptions.namadaSupplyUrl)
      .then(data => {
        if (!data) return;
        setNamadaRaw(data);
        const list: NamadaAsset[] = data[0]?.Total_Supply || [];
        setNamadaAssets(list);
        if (list.length) setSelectedNamadaAsset(list[0].id);
      });
  }, []);

  // update lastUpdated
  useEffect(() => {
    (async () => {
      const arr = (await fetchJSON<SupplyData[]>(getDataUrl())) || [];
      setLastUpdated(arr.pop()?.close || "N/A");
    })();
  }, [getDataUrl]);

  // build namada series
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
    defaultUrl:"Total Shielded",
    sproutUrl :"Sprout Pool",
    saplingUrl:"Sapling Pool",
    orchardUrl:"Orchard Pool",
  } as const;
  const poolKeys = Object.keys(poolLabels) as PoolKey[];

  const getDataColor = (): string => {
    switch (selectedPool) {
      case "sproutUrl": return "#A020F0";
      case "saplingUrl": return "#FFA500";
      case "orchardUrl": return "#32CD32";
      default:          return "url(#area-background-gradient)";
    }
  };

  const handleToolChange = (tool: ToolOptions) => {
    setSelectedTool(tool);
    if (tool === ToolOptions.supply) {
      setSelectedPool("defaultUrl");
    }
    setSelectedToolName(toolOptionLabels[tool]);
  };

  return (
    <div className="mt-28">
      {/* Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <h2 className="font-bold text-xl">{selectedToolName}</h2>
        <div className="flex gap-4">
          <Button text="Zcash"    className="bg-orange-400/75 text-white px-4 py-2 rounded-full" onClick={()=>setSelectedCoin("Zcash")} />
          <Button text="Penumbra" className="bg-purple-500/75 text-white px-4 py-2 rounded-full" onClick={()=>setSelectedCoin("Penumbra")} />
          <Button text="Namada"   className="bg-yellow-300/75 text-white px-4 py-2 rounded-full" onClick={()=>setSelectedCoin("Namada")} />
        </div>
      </div>

      {/* Chart & Tools */}
      <div className="border p-4 rounded-lg relative">
        {selectedCoin === "Namada" ? (
          <div className="mb-4 flex justify-center">
            <Button
              text="Supply"
              className={`px-4 py-2 rounded-full ${
                selectedTool === ToolOptions.supply
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => handleToolChange(ToolOptions.supply)}
            />
          </div>
        ) : (
          <Tools onToolChange={handleToolChange} defaultSelected={ToolOptions.supply} />
        )}

        <div ref={divChartRef}>
          {/* Zcash */}
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

          {/* Namada */}
          {selectedCoin === "Namada" && selectedTool === ToolOptions.supply && selectedNamadaAsset && (
            <NamadaSupplyChart data={namadaSeries} width={800} height={400} />
          )}

          {/* No Data */}
          {selectedCoin !== "Zcash" && selectedCoin !== "Namada" && (
            <div className="w-full h-[400px] flex flex-col items-center justify-center">
              <Image src={NoData} width={200} height={250} alt="No data" />
              <p>Chart data for {selectedCoin} unavailable</p>
            </div>
          )}
        </div>

        {/* Zcash pool toggles */}
        {selectedCoin === "Zcash" && selectedTool === ToolOptions.supply && (
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {poolKeys.map(key => (
              <div key={key} className="flex flex-col items-center">
                <Button
                  text={poolLabels[key]}
                  className={`px-4 py-2 rounded-full ${
                    selectedPool === key ? "bg-[#1984c7] text-white" : "bg-gray-400 text-white"
                  }`}
                  onClick={() => setSelectedPool(key)}
                />
                <span className="text-sm text-gray-600	mt-1">
                  {(supplies[key]?.supply || 0).toLocaleString()} ZEC
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Namada asset toggles */}
        {selectedCoin === "Namada" && (
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {namadaAssets.map(asset => (
              <div key={asset.id} className="flex flex-col items-center">
                <Button
                  text={asset.id}
                  className={`px-4 py-2 rounded-full ${
                    selectedNamadaAsset === asset.id ? "bg-yellow-500 text-white" : "bg-gray-400 text-white"
                  }`}
                  onClick={() => setSelectedNamadaAsset(asset.id)}
                />
                <span className="text-sm text-gray-600	mt-1">
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
                  sproutSupply: transformSupplyData(supplies.sproutUrl),
                  saplingSupply: transformSupplyData(supplies.saplingUrl),
                  orchardSupply: transformSupplyData(supplies.orchardUrl),
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
}

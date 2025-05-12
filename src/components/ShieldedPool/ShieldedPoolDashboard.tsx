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

// Data URLs
const DataUrlOptions = {
  defaultUrl:            "/data/zcash/shielded_supply.json",
  sproutUrl:             "/data/zcash/sprout_supply.json",
  saplingUrl:            "/data/zcash/sapling_supply.json",
  orchardUrl:            "/data/zcash/orchard_supply.json",
  netInflowsOutFlowsUrl: "/data/zcash/netinflowoutflow.json",
  nodecountUrl:          "/data/zcash/nodecount.json",
  difficultyUrl:         "/data/zcash/difficulty.json",
  lockboxUrl:            "/data/zcash/lockbox.json",
  txsummaryUrl:          "/data/zcash/transaction_summary.json",
  shieldedTxCountUrl:    "/data/zcash/shieldedtxcount.json",
  issuanceUrl:           "/data/zcash/issuance.json",
  apiUrl:
    "https://api.github.com/repos/ZecHub/zechub-wiki/commits?path=public/data/shielded_supply.json",
  namadaSupplyUrl:       "/data/namada/namada_supply.json",
};

// Interfaces
interface BlockchainInfo { /* as before... */ }
interface SupplyData { close: string; supply: number; }
type ShieldedTxCount = { sapling: number; orchard: number; timestamp: string };
type NodeCountData   = { Date: string; nodecount: string };

// Helpers (fetchers & formatters) omitted for brevity—**please include them exactly** as in the last full version.

// Dynamic imports
const ShieldedPoolChart       = dynamic(() => import("./ShieldedPoolChart"),       { ssr: true });
const TransactionSummaryChart = dynamic(() => import("../TransactionSummaryChart"), { ssr: true });
const ZecIssuanceSummaryChart = dynamic(() => import("../ZecIssuanceSummaryChart"),{ ssr: true });
const NetInflowsOutFlowsChart = dynamic(() => import("../Charts/NetInflowsOutflowsChart"),{ ssr: true });

// Main component
const ShieldedPoolDashboard: React.FC = () => {
  // States
  const [selectedPool, setSelectedPool]       = useState<string>("default");
  const [selectedCoin, setSelectedCoin]       = useState<"Zcash"|"Penumbra"|"Namada">("Zcash");
  const [selectedTool, setSelectedTool]       = useState<ToolOptions>(ToolOptions.supply);
  const [selectedToolName, setSelectedToolName] = useState<string>(toolOptionLabels[ToolOptions.supply]);
  const [cumulativeCheck, setCumulativeCheck] = useState(true);
  const [filterSpamCheck, setFilterSpamCheck] = useState(false);

  const [blockchainInfo, setBlockchainInfo]   = useState<any|null>(null);
  const [circulation, setCirculation]         = useState<number|null>(null);
  const [supplies, setSupplies] = useState<{
    default: SupplyData|null;
    sprout: SupplyData|null;
    sapling: SupplyData|null;
    orchard: SupplyData|null;
  }>({ default: null, sprout: null, sapling: null, orchard: null });
  const [lastUpdated, setLastUpdated]         = useState<string|null>(null);
  const [shieldedTxCount, setShieldedTxCount] = useState<ShieldedTxCount[]|null>(null);
  const [latestNodeCount, setLatestNodeCount] = useState<number|null>(null);

  // Namada assets
  const [namadaAssets, setNamadaAssets]             = useState<{id:string; totalSupply:string}[]>([]);
  const [selectedNamadaAsset, setSelectedNamadaAsset] = useState<string>("");

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  // Initial data load
  useEffect(() => {
    getBlockchainData().then(d => d && setBlockchainInfo(d));
    getBlockchainInfo().then(c => setCirculation(c));
    getLastUpdatedDate().then(d => setLastUpdated(d));

    // shielded supply snapshots
    getSupplyData(DataUrlOptions.defaultUrl).then(a => setSupplies(s => ({ ...s, default: a.pop()||null })));
    getSupplyData(DataUrlOptions.sproutUrl ).then(a => setSupplies(s => ({ ...s, sprout:  a.pop()||null })));
    getSupplyData(DataUrlOptions.saplingUrl).then(a => setSupplies(s => ({ ...s, sapling: a.pop()||null })));
    getSupplyData(DataUrlOptions.orchardUrl).then(a => setSupplies(s => ({ ...s, orchard: a.pop()||null })));

    getShieldedTxCount().then(d => d && setShieldedTxCount(d));
    getNodeCountData(DataUrlOptions.nodecountUrl).then(a => { if(a.length) setLatestNodeCount(Number(a[a.length-1].nodecount)); });
  }, []);

  // Update `lastUpdated` when pool changes
  useEffect(() => {
    (async () => {
      const key = selectedPool==="default" ? "defaultUrl" : `${selectedPool}Url`;
      const arr = await getSupplyData((DataUrlOptions as any)[key]);
      setLastUpdated(arr.pop()?.close||"N/A");
    })();
  }, [selectedPool]);

  // Load Namada assets
  useEffect(() => {
    if(selectedCoin !== "Namada") return;
    fetch(DataUrlOptions.namadaSupplyUrl)
      .then(r=>r.json())
      .then((json:any[])=>{
        const list = json[0]?.["Total Supply"]||[];
        setNamadaAssets(list);
        if(list.length) setSelectedNamadaAsset(list[0].id);
      })
      .catch(console.error);
  },[selectedCoin]);

  if(!blockchainInfo) {
    return <div className="flex justify-center mt-48"><Spinner/></div>;
  }

  // Pool labels
  const poolLabels = {
    default: "Total Shielded",
    sprout:  "Sprout Pool",
    sapling: "Sapling Pool",
    orchard: "Orchard Pool",
  } as const;
  const poolKeys = Object.keys(poolLabels) as Array<keyof typeof poolLabels>;

  // Helpers
  const getDataUrl = () => {
    switch(selectedPool) {
      case "sprout":   return DataUrlOptions.sproutUrl;
      case "sapling":  return DataUrlOptions.saplingUrl;
      case "orchard":  return DataUrlOptions.orchardUrl;
      case ToolOptions.net_inflows_outflows: return DataUrlOptions.netInflowsOutFlowsUrl;
      case "issuance": return DataUrlOptions.issuanceUrl;
      case ToolOptions.nodecount:            return DataUrlOptions.nodecountUrl;
      case ToolOptions.difficulty:           return DataUrlOptions.difficultyUrl;
      case ToolOptions.lockbox:              return DataUrlOptions.lockboxUrl;
      default: return DataUrlOptions.defaultUrl;
    }
  };
  const getDataColor = () => {
    switch(selectedPool) {
      case "sprout":  return "#A020F0";
      case "sapling": return "#FFA500";
      case "orchard": return "#32CD32";
      default: return "url(#area-background-gradient)";
    }
  };
  const handleToolChange = (tool: ToolOptions) => {
    setSelectedTool(tool);
    if([ToolOptions.supply,ToolOptions.transaction,ToolOptions.privacy_set].includes(tool)) {
      setSelectedPool("default");
    } else if(tool===ToolOptions.nodecount) {
      setSelectedPool("nodecount");
    } else if(tool===ToolOptions.difficulty) {
      setSelectedPool("difficulty");
    } else if(tool===ToolOptions.lockbox) {
      setSelectedPool("lockbox");
    } else if(tool===ToolOptions.net_inflows_outflows) {
      setSelectedPool(ToolOptions.net_inflows_outflows);
    } else {
      setSelectedPool("default");
    }
    setSelectedToolName(toolOptionLabels[tool]);
  };

  return (
    <div className="mt-28">
      {/* Header + coin buttons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl">{selectedToolName}</h2>
        <div className="flex gap-4">
          <Button
            text="Zcash"
            className="bg-orange-400/75 text-white rounded-full px-4 py-2"
            onClick={()=>setSelectedCoin("Zcash")}
          />
          <Button
            text="Penumbra"
            className="bg-purple-500/75 text-white rounded-full px-4 py-2"
            onClick={()=>setSelectedCoin("Penumbra")}
          />
          <Button
            text="Namada"
            className="bg-yellow-300/75 text-white rounded-full px-4 py-2"
            onClick={()=>setSelectedCoin("Namada")}
          />
        </div>
      </div>

      {/* Chart area */}
      <div className="border p-4 rounded-lg relative">
        <Tools onToolChange={handleToolChange} defaultSelected={ToolOptions.supply}/>

        {/* Chart or placeholder */}
        <div ref={divChartRef}>
          {selectedCoin === "Zcash" && (
            <>
              {selectedTool===ToolOptions.supply && (
                <ShieldedPoolChart dataUrl={getDataUrl()} color={getDataColor()}/>
              )}
              {selectedTool===ToolOptions.transaction && (
                <>
                  <div className="flex gap-4 justify-center mb-4">
                    <Checkbox
                      checked={cumulativeCheck}
                      onChange={setCumulativeCheck}
                      label="Cumulative"
                    />
                    <Checkbox
                      checked={filterSpamCheck}
                      onChange={setFilterSpamCheck}
                      label="Filter Spam"
                    />
                  </div>
                  <TransactionSummaryChart
                    dataUrl={DataUrlOptions.txsummaryUrl}
                    pool={selectedPool}
                    cumulative={cumulativeCheck}
                    filter={filterSpamCheck}
                    applyFilter={!cumulativeCheck||filterSpamCheck}
                  />
                </>
              )}
              {selectedTool===ToolOptions.nodecount && (
                <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()}/>
              )}
              {selectedTool===ToolOptions.difficulty && (
                <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()}/>
              )}
              {selectedTool===ToolOptions.lockbox && (
                <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()}/>
              )}
              {selectedTool===ToolOptions.net_inflows_outflows && (
                <NetInflowsOutFlowsChart dataUrl={getDataUrl()} color={getDataColor()}/>
              )}
              {selectedTool==="issuance" && (
                <ZecIssuanceSummaryChart
                  dataUrl={DataUrlOptions.issuanceUrl}
                  pool={selectedPool}
                  cumulative={cumulativeCheck}
                  filter={filterSpamCheck}
                />
              )}
              {selectedTool===ToolOptions.privacy_set && (
                <PrivacySetVisualization/>
              )}
            </>
          )}

          {selectedCoin === "Namada" && selectedTool===ToolOptions.supply && selectedNamadaAsset && (
            <NamadaSupplyChart
              dataUrl={DataUrlOptions.namadaSupplyUrl}
              assetId={selectedNamadaAsset}
            />
          )}

          {selectedCoin !== "Zcash" && selectedCoin !== "Namada" && (
            <div className="w-full h-[400px] flex flex-col items-center justify-center">
              <Image src={NoData} width={200} height={250} alt="No data"/>
              <p>Chart data for {selectedCoin} unavailable</p>
            </div>
          )}
        </div>

        {/* Zcash supply toggles */}
        {selectedTool===ToolOptions.supply && selectedCoin==="Zcash" && (
          <div className="mt-8 flex justify-center gap-6">
            {poolKeys.map(key=>(
              <div key={key} className="flex flex-col items-center">
                <Button
                  text={poolLabels[key]}
                  className={`py-2 px-4 rounded-full ${
                    selectedPool===key?"bg-[#1984c7] text-white":"bg-gray-400 text-white"
                  }`}
                  onClick={()=>setSelectedPool(key)}
                />
                <span className="text-sm text-gray-600 mt-1">
                  {(supplies[key]?.supply||0).toLocaleString()} ZEC
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Namada asset toggles */}
        {selectedTool===ToolOptions.supply && selectedCoin==="Namada" && (
          <div className="mt-8 flex justify-center gap-6">
            {namadaAssets.map(asset=>(
              <div key={asset.id} className="flex flex-col items-center">
                <Button
                  text={asset.id}
                  className={`py-2 px-4 rounded-full ${
                    selectedNamadaAsset===asset.id?"bg-yellow-500 text-white":"bg-gray-400 text-white"
                  }`}
                  onClick={()=>setSelectedNamadaAsset(asset.id)}
                />
                <span className="text-sm text-gray-600 mt-1">
                  {Number(asset.totalSupply||0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Export & last‐updated */}
        <div className="flex justify-end items-center gap-4 mt-4">
          <span className="text-sm text-gray-500">
            Last updated: {formatDate(lastUpdated)}
          </span>
          <Button
            text="Export PNG"
            className="bg-blue-500 text-white rounded-full px-4 py-2"
            onClick={()=>handleSaveToPng(
              selectedPool,
              {
                sproutSupply: transformSupplyData(supplies.sprout),
                saplingSupply: transformSupplyData(supplies.sapling),
                orchardSupply: transformSupplyData(supplies.orchard),
              },
              selectedTool
            )}
          />
        </div>
      </div>

      {/* Metrics panel */}
      <div className="flex flex-wrap gap-8 justify-center items-center mt-8">
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Cap</h3>
          <p>${blockchainInfo.market_cap_usd.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">ZEC in Circulation</h3>
          <p>{circulation?.toLocaleString() || "N/A"} ZEC</p>
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
          <p>{latestNodeCount?.toLocaleString() || "Loading..."}</p>
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
};

export default ShieldedPoolDashboard;

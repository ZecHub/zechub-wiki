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

// Dynamic imports
const ShieldedPoolChart       = dynamic(() => import("./ShieldedPoolChart"), { ssr: true });
const TransactionSummaryChart = dynamic(() => import("../TransactionSummaryChart"), { ssr: true });
const ZecIssuanceSummaryChart = dynamic(() => import("../ZecIssuanceSummaryChart"), { ssr: true });
const NetInflowsOutflowsChart = dynamic(() => import("../Charts/NetInflowsOutflowsChart"), { ssr: true });

// Data URLs
const DataUrlOptions = {
  defaultUrl:            "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shielded_supply.json",
  sproutUrl:             "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sprout_supply.json",
  saplingUrl:            "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sapling_supply.json",
  orchardUrl:            "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/orchard_supply.json",
  netInflowsOutflowsUrl: "/data/netinflowoutflow.json",
  nodecountUrl:          "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/nodecount.json",
  difficultyUrl:         "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/difficulty.json",
  lockboxUrl:            "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/lockbox.json",
  txsummaryUrl:          "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json",
  shieldedTxCountUrl:    "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shieldedtxcount.json",
  issuanceUrl:           "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/issuance.json",
  apiUrl:                "https://api.github.com/repos/ZecHub/zechub-wiki/commits?path=public/data/shielded_supply.json",
};

const blockchainInfoUrl = "/api/blockchain-info";

interface BlockchainInfo { /* ...fields as before... */ }
interface SupplyData { close: string; supply: number; }
type ShieldedTxCount = { sapling: number; orchard: number; timestamp: string; };
type NodeCountData   = { Date: string; nodecount: string; };

// Fetch helpers: getBlockchainData, getBlockchainInfo, getSupplyData, getLastUpdatedDate, getShieldedTxCount, getNodeCountData
// (Implementations unchanged from previous version)

function formatDate(s: string | null): string {
  if (!s) return "N/A";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
}

function transformSupplyData(d: SupplyData | null) {
  return d ? { timestamp: d.close, supply: d.supply } : null;
}

const ShieldedPoolDashboard: React.FC = () => {
  // UI state
  const [selectedPool, setSelectedPool]         = useState<string>("default");
  const [selectedCoin, setSelectedCoin]         = useState<string>("Zcash");
  const [selectedTool, setSelectedTool]         = useState<string>(ToolOptions.supply);
  const [selectedToolName, setSelectedToolName] = useState<string>(toolOptionLabels[ToolOptions.supply]);
  const [cumulativeCheck, setCumulativeCheck]   = useState<boolean>(true);
  const [filterSpamCheck, setfilterSpamCheck]   = useState<boolean>(false);

  // Data state
  const [blockchainInfo, setBlockchainInfo]     = useState<BlockchainInfo | null>(null);
  const [circulation, setCirculation]           = useState<number | null>(null);
  const [supplies, setSupplies]                 = useState<Record<string, SupplyData | null>>({ default:null, sprout:null, sapling:null, orchard:null });
  const [lastUpdated, setLastUpdated]           = useState<string | null>(null);
  const [shieldedTxCount, setShieldedTxCount]   = useState<ShieldedTxCount[] | null>(null);
  const [latestNodeCount, setLatestNodeCount]   = useState<number | null>(null);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  // Initial fetch
  useEffect(() => {
    getBlockchainData().then(d => d && setBlockchainInfo(d));
    getBlockchainInfo().then(c => setCirculation(c));
    getLastUpdatedDate().then(d => setLastUpdated(d));

    getSupplyData(DataUrlOptions.defaultUrl).then(a => setSupplies(s => ({ ...s, default: a.pop() || null })));
    getSupplyData(DataUrlOptions.sproutUrl).then(a => setSupplies(s => ({ ...s, sprout: a.pop() || null })));
    getSupplyData(DataUrlOptions.saplingUrl).then(a => setSupplies(s => ({ ...s, sapling: a.pop() || null })));
    getSupplyData(DataUrlOptions.orchardUrl).then(a => setSupplies(s => ({ ...s, orchard: a.pop() || null })));

    getShieldedTxCount().then(d => d && setShieldedTxCount(d));
    getNodeCountData(DataUrlOptions.nodecountUrl).then(a => a.length && setLatestNodeCount(Number(a[a.length-1].nodecount)));
  }, []);

  // Update lastUpdated on pool change
  useEffect(() => {
    (async () => {
      const url = selectedPool === "default"
        ? DataUrlOptions.defaultUrl
        : (DataUrlOptions as any)[`${selectedPool}Url`];
      const a = await getSupplyData(url);
      setLastUpdated(a.pop()?.close || "N/A");
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
    switch(tool) {
      case ToolOptions.supply: setSelectedPool("default"); break;
      case ToolOptions.transaction: setSelectedPool("default"); break;
      case ToolOptions.nodecount: setSelectedPool("nodecount"); break;
      case ToolOptions.difficulty: setSelectedPool("difficulty"); break;
      case ToolOptions.lockbox: setSelectedPool("lockbox"); break;
      case ToolOptions.net_inflows_outflows: setSelectedPool("net_inflows_outflows"); break;
      case "issuance": setSelectedPool("issuance"); break;
      case ToolOptions.privacy_set: setSelectedPool("default"); break;
      default: setSelectedPool("default");
    }
    setSelectedToolName(toolOptionLabels[tool]);
  };

  if (!blockchainInfo) {
    return <div className="flex justify-center mt-48"><Spinner/></div>;
  }

  const poolLabels: Record<string,string> = {
    default: "Total Shielded",
    sprout:  "Sprout Pool",
    sapling: "Sapling Pool",
    orchard: "Orchard Pool",
  };

  return (
    <div className="mt-28">
      {/* Header & Coin Buttons */}
      <div className="flex items-center justify-center mb-4 space-x-6">
        <h2 className="font-bold text-xl">{selectedToolName}</h2>
        <Button text="Zcash"    className="bg-yellow-400/75 text-white rounded-xl" onClick={()=>setSelectedCoin("Zcash")} />
        <Button text="Penumbra" className="bg-purple-500/75 text-white rounded-xl" onClick={()=>setSelectedCoin("Penumbra")} />
        <Button text="Namada"   className="bg-yellow-300/75 text-white rounded-xl" onClick={()=>setSelectedCoin("Namada")} />
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
            <>  {/* Chart cases */}
              {selectedTool===ToolOptions.supply && <ShieldedPoolChart dataUrl={getDataUrl()} color={getDataColor()} />}
              {selectedTool===ToolOptions.transaction && (
                <>
                  <div className="flex gap-4 justify-center mb-4">
                    <Checkbox checked={cumulativeCheck} onChange={setCumulativeCheck} label="Cumulative" />
                    <Checkbox checked={filterSpamCheck} onChange={setfilterSpamCheck} label="Filter Spam" />
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
              {selectedTool===ToolOptions.nodecount && <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()} />}
              {selectedTool===ToolOptions.difficulty && <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()} />}
              {selectedTool===ToolOptions.lockbox && <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()} />}
              {selectedTool===ToolOptions.net_inflows_outflows && <NetInflowsOutflowsChart dataUrl={getDataUrl()} color={getDataColor()} />}
              {selectedTool==="issuance" && <ZecIssuanceSummaryChart dataUrl={DataUrlOptions.issuanceUrl} pool={selectedPool} cumulative={cumulativeCheck} filter={filterSpamCheck} />}
              {selectedTool===ToolOptions.privacy_set && <PrivacySetVisualization />}
            </>
          )}
        </div>

        {/* Supply toggles */}
        {selectedTool===ToolOptions.supply && (
          <div className="mt-8 flex justify-center gap-6">
            {Object.entries(poolLabels).map(([key,label])=> (
              <div key={key} className="flex flex-col items-center">
                <Button text={label} className={`py-2 px-4 rounded ${selectedPool===key?"bg-blue-500 text-white":"bg-gray-400 text-white"}`} onClick={()=>setSelectedPool(key)} />
                <span className="text-sm text-gray-600 mt-1">{(supplies[key]?.supply??0).toLocaleString()} ZEC</span>
              </div>
            ))}
          </div>
        )}

        {/* Export & Last Updated */}
        <div className="flex justify-end items-center gap-4 mt-4">
          <span className="text-sm text-gray-500">Last updated: {formatDate(lastUpdated)}</span>
          <Button text="Export PNG" className="bg-blue-500 text-white" onClick={()=>handleSaveToPng(
            selectedPool,
            { sproutSupply: transformSupplyData(supplies.sprout), saplingSupply: transformSupplyData(supplies.sapling), orchardSupply: transformSupplyData(supplies.orchard) },
            selectedTool
          )} />
        </div>
      </div>

      {/* Metrics panel */}
      <div className="flex flex-wrap gap-8 justify-center items-center mt-8">
        {/* metric cards... unchanged */}
      </div>
    </div>
  );
};

export default ShieldedPoolDashboard;

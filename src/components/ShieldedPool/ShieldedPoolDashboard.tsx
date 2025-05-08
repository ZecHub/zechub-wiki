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

const ShieldedPoolChart = dynamic(
  () => import("./ShieldedPoolChart"),
  { ssr: true }
);

const TransactionSummaryChart = dynamic(
  () => import("../TransactionSummaryChart"),
  { ssr: true }
);

const ZecIssuanceSummaryChart = dynamic(
  () => import("../ZecIssuanceSummaryChart"),
  { ssr: true }
);

const NetInflowsOutflowsChart = dynamic(
  () => import("../Charts/NetInflowsOutflowsChart"),
  { ssr: true }
);

const DataUrlOptions = {
  defaultUrl: "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shielded_supply.json",
  sproutUrl: "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sprout_supply.json",
  saplingUrl: "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sapling_supply.json",
  orchardUrl: "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/orchard_supply.json",
  netInflowsOutflowsUrl: "/data/netinflowoutflow.json",
  nodecountUrl: "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/nodecount.json",
  difficultyUrl: "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/difficulty.json",
  lockboxUrl: "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/lockbox.json",
  txsummaryUrl: "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json",
  shieldedTxCountUrl: "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shieldedtxcount.json",
  issuanceUrl: "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/issuance.json",
  apiUrl: "https://api.github.com/repos/ZecHub/zechub-wiki/commits?path=public/data/shielded_supply.json",
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

interface SupplyData {
  close: string;
  supply: number;
}

type ShieldedTxCount = { sapling: number; orchard: number; timestamp: string };

type NodeCountData = { Date: string; nodecount: string };

async function getNodeCountData(url: string): Promise<NodeCountData[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    return (await response.json()) as NodeCountData[];
  } catch {
    return [];
  }
}

async function getBlockchainData(): Promise<BlockchainInfo | null> {
  try {
    const response = await fetch(
      "https://api.blockchair.com/zcash/stats?key=A___nnFHttBygZPrKgm5WZyXU3WCondo"
    );
    if (!response.ok) return null;
    const json = await response.json();
    return json.data as BlockchainInfo;
  } catch {
    return null;
  }
}

async function getBlockchainInfo(): Promise<number | null> {
  try {
    const response = await fetch(blockchainInfoUrl);
    if (!response.ok) return null;
    const json = await response.json();
    return parseInt(json.chainSupply.chainValueZat, 10) * 1e-8;
  } catch {
    return null;
  }
}

async function getSupplyData(url: string): Promise<SupplyData[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    return (await response.json()) as SupplyData[];
  } catch {
    return [];
  }
}

async function getLastUpdatedDate(): Promise<string> {
  try {
    const response = await fetch(DataUrlOptions.apiUrl);
    if (!response.ok) return "N/A";
    const data = await response.json();
    return data[0]?.commit?.committer?.date ?? "N/A";
  } catch {
    return "N/A";
  }
}

async function getShieldedTxCount(): Promise<ShieldedTxCount[] | null> {
  try {
    const response = await fetch(DataUrlOptions.shieldedTxCountUrl);
    if (!response.ok) return null;
    const data = await response.json();
    return data.map((e: any) => ({ sapling: e.sapling, orchard: e.orchard, timestamp: e.timestamp }));
  } catch {
    return null;
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
}

function transformSupplyData(data: SupplyData | null): { timestamp: string; supply: number } | null {
  return data ? { timestamp: data.close, supply: data.supply } : null;
}

const ShieldedPoolDashboard: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<string>("default");
  const [selectedCoin, setSelectedCoin] = useState<string>("Zcash");
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(null);
  const [circulation, setCirculation] = useState<number | null>(null);
  const [shieldedSupply, setShieldedSupply] = useState<SupplyData | null>(null);
  const [sproutSupply, setSproutSupply] = useState<SupplyData | null>(null);
  const [saplingSupply, setSaplingSupply] = useState<SupplyData | null>(null);
  const [orchardSupply, setOrchardSupply] = useState<SupplyData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [shieldedTxCount, setShieldedTxCount] = useState<ShieldedTxCount[] | null>(null);
  const [latestNodeCount, setLatestNodeCount] = useState<number | null>(null);

  const [selectedTool, setSelectedTool] = useState<string>(ToolOptions.supply);
  const [selectedToolName, setSelectedToolName] = useState<string>(toolOptionLabels[ToolOptions.supply]);
  const [cumulativeCheck, setCumulativeCheck] = useState<boolean>(true);
  const [filterSpamCheck, setfilterSpamCheck] = useState<boolean>(false);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  useEffect(() => {
    getBlockchainData().then((d) => d && setBlockchainInfo(d));
    getBlockchainInfo().then((c) => setCirculation(c));
    getLastUpdatedDate().then((d) => setLastUpdated(d));

    getSupplyData(DataUrlOptions.defaultUrl).then((arr) =>
      setShieldedSupply(arr[arr.length - 1] || null)
    );
    getSupplyData(DataUrlOptions.sproutUrl).then((arr) =>
      setSproutSupply(arr[arr.length - 1] || null)
    );
    getSupplyData(DataUrlOptions.saplingUrl).then((arr) =>
      setSaplingSupply(arr[arr.length - 1] || null)
    );
    getSupplyData(DataUrlOptions.orchardUrl).then((arr) =>
      setOrchardSupply(arr[arr.length - 1] || null)
    );

    getShieldedTxCount().then((d) => d && setShieldedTxCount(d));
  }, []);

  useEffect(() => {
    async function upd() {
      const url =
        selectedPool === "default"
          ? DataUrlOptions.defaultUrl
          : DataUrlOptions[`\${selectedPool}Url` as keyof typeof DataUrlOptions];
      const arr = await getSupplyData(url);
      setLastUpdated(arr[arr.length - 1]?.close || "N/A");
    }
    upd();
  }, [selectedPool]);

  useEffect(() => {
    getNodeCountData(DataUrlOptions.nodecountUrl).then((arr) => {
      if (arr.length) setLatestNodeCount(Number(arr[arr.length - 1].nodecount));
    });
  }, []);

  const getDataUrl = (): string => {
    switch (selectedPool) {
      case "sprout": return DataUrlOptions.sproutUrl;
      case "sapling": return DataUrlOptions.saplingUrl;
      case "orchard": return DataUrlOptions.orchardUrl;
      case ToolOptions.net_inflows_outflows: return DataUrlOptions.netInflowsOutFlowsUrl;
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
    setSelectedPool("default");
    setSelectedToolName(toolOptionLabels[tool]);
  };

  if (!blockchainInfo) {
    return <div className="flex justify-center mt-48"><Spinner /></div>;
  }

  return (
    <div className="mt-28">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">{selectedToolName}</h2>
        <div className="flex gap-2">
          <Button text="Zcash" onClick={() => setSelectedCoin("Zcash")} />
          <Button text="Penumbra" onClick={() => setSelectedCoin("Penumbra")} />
          <Button text="Namada" onClick={() => setSelectedCoin("Namada")} />
        </div>
      </div>

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
              {selectedTool === ToolOptions.supply && (
                <ShieldedPoolChart dataUrl={getDataUrl()} color={getDataColor()} />
              )}
              {selectedTool === ToolOptions.transaction && (
                <TransactionSummaryChart
                  dataUrl={DataUrlOptions.txsummaryUrl}
                  pool={selectedPool}
                  cumulative={cumulativeCheck}
                  filter={filterSpamCheck}
                  applyFilter={!cumulativeCheck || filterSpamCheck}
                />
              )}
              {selectedTool === ToolOptions.nodecount && (
                <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()} />
              )}
              {selectedTool === ToolOptions.difficulty && (
                <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()} />
              )}
              {selectedTool === ToolOptions.lockbox && (
                <NodeCountChart dataUrl={getDataUrl()} color={getDataColor()} />
              )}
              {selectedTool === ToolOptions.net_inflows_outflows && (
                <NetInflowsOutflowsChart dataUrl={getDataUrl()} color={getDataColor()} />
              )}
              {selectedTool === "issuance" && (
                <ZecIssuanceSummaryChart
                  dataUrl={DataUrlOptions.issuanceUrl}
                  pool={selectedPool}
                  cumulative={cumulativeCheck}
                  filter={filterSpamCheck}
                />
              )}
              {selectedTool === ToolOptions.privacy_set && (
                <PrivacySetVisualization />
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-4 text-sm text-gray-500 mt-4">
          <span>Last updated: {formatDate(lastUpdated)}</span>
          <Button
            text="Export (PNG)"
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

      {/* Additional controls for supply & transaction modes can follow here */}
    </div>
  );
};

export default ShieldedPoolDashboard;

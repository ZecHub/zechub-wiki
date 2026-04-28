"use client";

import React, { RefObject } from "react";
import ChartFooter from "../../ChartFooter";
import DifficultyChart from "../DifficultyChart";
import IssuanceChart from "../IssuanceChart";
import LockboxChart from "../LockboxChart";
import NetInflowsOutflowsChart from "../NetInflowsOutflowsChart";
import PrivacySetVisualizationChart from "../PrivacySetVisualizationChart";
import ShieldedSupplyChart from "../ShieldedSupplyChart";
import TransactionsSummaryChart from "../TransactionSummaryChart";
import { CardContent } from "@/components/UI/shadcn/card";
import NodeCountChart from "../NodeCountChart";
import ShieldedStats from "./ShieldedStatsPro";
import { HalvingMeter } from "@/components/HalvingMeter/halving-meter";
import BlockFeesChart from "../BlockFeesChart";
import NetworkSolpsChart from "../NetworkSolpsChart";
import MiningPoolsDominanceChart from "../MiningPoolsDominanceChart";

type ZcashChartProps = {
  divChartRef: RefObject<HTMLDivElement | null>;
  handleSaveToPng: (
    poolType: string,
    poolData: Record<string, { timestamp: string; supply: number } | null>,
    toolType: string,
  ) => Promise<void>;
  activeTab: string;
  onTabChange: (newTab: string) => void;
};

const CardContentShielded = (props: ZcashChartProps) => {
  const { activeTab, onTabChange } = props;   // receive from parent

  return (
    <CardContent>
      <div className="mt-8">
        {activeTab === "supply" && <ShieldedSupplyChart chartRef={props.divChartRef} />}
        {activeTab === "difficulty" && <DifficultyChart chartRef={props.divChartRef} />}
        {activeTab === "issuance" && <IssuanceChart chartRef={props.divChartRef} />}
        {activeTab === "lockbox" && <LockboxChart chartRef={props.divChartRef} />}
        {activeTab === "flows" && <NetInflowsOutflowsChart color="red" chartRef={props.divChartRef} />}
        {activeTab === "node count" && <NodeCountChart color="red" chartRef={props.divChartRef} />}
        {activeTab === "tx summary" && <TransactionsSummaryChart chartRef={props.divChartRef} />}
        {activeTab === "privacy set" && <PrivacySetVisualizationChart chartRef={props.divChartRef} />}
        {activeTab === "shielded stats" && <ShieldedStats chartRef={props.divChartRef} />}
        {activeTab === "block fees" && <BlockFeesChart chartRef={props.divChartRef} />}
        {activeTab === "network solps" && <NetworkSolpsChart chartRef={props.divChartRef} />}
        {activeTab === "mining pools" && <MiningPoolsDominanceChart chartRef={props.divChartRef} />}
        {activeTab === "halving meter" && <HalvingMeter chartRef={props.divChartRef} />}
      </div>

      <ChartFooter
        imgLabel={activeTab}
        handleSaveToPng={props.handleSaveToPng}
        lastUpdatedDate={activeTab}
      />
    </CardContent>
  );
};

export default CardContentShielded;
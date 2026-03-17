import React, { RefObject, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ChartFooter from "../../ChartFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Tabs";
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

type ZcashChartProps = {
  divChartRef: RefObject<HTMLDivElement | null>;
  handleSaveToPng: (
    poolType: string,
    poolData: Record<
      string,
      {
        timestamp: string;
        supply: number;
      } | null
    >,
    toolType: string,
  ) => Promise<void>;
};

const CardContentShielded = (props: ZcashChartProps) => {
  const { t } = useLanguage();
  const tabT = t?.pages?.dashboard?.charts?.zcashShieldedTabs;
  const [activeTab, setActiveTab] = useState<String | any>("supply");

  const tabs = [
    { value: "supply", label: tabT?.supply || "Supply" },
    { value: "difficulty", label: tabT?.difficulty || "Difficulty" },
    { value: "issuance", label: tabT?.issuance || "Issuance" },
    { value: "lockbox", label: tabT?.lockbox || "Lockbox" },
    { value: "flows", label: tabT?.flows || "Flows" },
    { value: "node count", label: tabT?.nodeCount || "Node Count" },
    { value: "tx summary", label: tabT?.txSummary || "TX Summary" },
    { value: "privacy set", label: tabT?.privacySet || "Privacy Set" },
    {
      value: "shielded stats",
      label: tabT?.shieldedStats || "Shielded Stats",
    },
    { value: "block fees", label: tabT?.blockFees || "Block Fees" },
    {
      value: "network solps",
      label: tabT?.networkSolps || "Network Solps",
    },
    {
      value: "halving meter",
      label: tabT?.halvingMeter || "Halving Meter",
    },
  ];
  return (
    <CardContent>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {({ activeTab, setActiveTab }: any) => (
          <>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="supply" activeTab={activeTab}>
              <ShieldedSupplyChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="difficulty" activeTab={activeTab}>
              <DifficultyChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="issuance" activeTab={activeTab}>
              {activeTab === "issuance" && (
                <IssuanceChart chartRef={props.divChartRef} />
              )}
            </TabsContent>

            <TabsContent value="lockbox" activeTab={activeTab}>
              <LockboxChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="flows" activeTab={activeTab}>
              <NetInflowsOutflowsChart
                color="red"
                chartRef={props.divChartRef}
              />
            </TabsContent>

            <TabsContent value="node count" activeTab={activeTab}>
              <NodeCountChart color="red" chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="tx summary" activeTab={activeTab}>
              <TransactionsSummaryChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="privacy set" activeTab={activeTab}>
              <PrivacySetVisualizationChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="shielded stats" activeTab={activeTab}>
              <ShieldedStats chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="block fees" activeTab={activeTab}>
              <BlockFeesChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="network solps" activeTab={activeTab}>
              <NetworkSolpsChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="halving meter" activeTab={activeTab}>
              <HalvingMeter />
            </TabsContent>

            <ChartFooter
              imgLabel={activeTab}
              handleSaveToPng={props.handleSaveToPng}
              lastUpdatedDate={activeTab}
            />
          </>
        )}
      </Tabs>
    </CardContent>
  );
};

export default CardContentShielded;

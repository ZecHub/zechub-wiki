import NodeCountChart from "@/components/Charts/Zcash/NodeCountChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import { RefObject, useState } from "react";
import ChartFooter from "../ChartFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Tabs";
import DifficultyChart from "./DifficultyChart";
import IssuanceChart from "./IssuanceChart";
import LockboxChart from "./LockboxChart";
import NetInflowsOutflowsChart from "./NetInflowsOutflowsChart";
import PrivacySetVisualizationChart from "./PrivacySetVisualizationChart";
import ShieldedSupplyChart from "./ShieldedSupplyChart";
import TransactionsSummaryChart from "./TransactionSummaryChart";
import { ZcashMetrics } from "./ZcashMetrics/ZcashMetrics";

type ZcashChartProps = {
  lastUpdated: Date;
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
    toolType: string
  ) => Promise<void>;
};

function ZcashChart(props: ZcashChartProps) {
  const [activeTab, setActiveTab] = useState("supply");

  const tabLabels = [
    "Supply",
    "Difficulty",
    "Issuance",
    "Lockbox",
    "Flows",
    "Node Count",
    "TX Summary",
    "Privacy Set",
  ];

  return (
    <div className="space-y-6">
      {/* Market Metrics */}
      <ZcashMetrics />

      {/* Charts Tabs */}
      <Card className="shadow-sm border border-gray-200 dark:border-slate-700">
        <CardHeader className="mb-4">
          <CardTitle className="text-xl">Analytics Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {({ activeTab, setActiveTab }: any) => (
              <>
                <TabsList>
                  {tabLabels.map((label) => (
                    <TabsTrigger
                      key={label}
                      value={label.toLowerCase()}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                    >
                      {label}
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

                <ChartFooter
                  imgLabel={activeTab}
                  handleSaveToPng={props.handleSaveToPng}
                  lastUpdatedDate={props.lastUpdated}
                />
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ZcashChart;

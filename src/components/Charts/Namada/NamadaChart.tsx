// "use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";

import { RefObject, useState } from "react";

import { ErrorBoundary } from "../../ErrorBoundary/ErrorBoundary";
import CryptoMetrics from "../Metric";
import ChartFooter from "../ChartFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Tabs";
import RewardChart from "./RewardsChart";
import TokenEcosystem from "./TokenEcosystem";

type NamadaChartProps = {
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

function NamadaChart(props: NamadaChartProps) {
  const [selectedTokenId, setSelectedTokenId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("supply");
  const tabLabels = ["Supply", "Rewards"];

  return (
    <ErrorBoundary fallback="Failed to render Namada Chart">
      <div className="space-y-6">
        <CryptoMetrics
          selectedCoin={selectedTokenId === "all" ? "Namada" : selectedTokenId}
        />

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
                    <TokenEcosystem
                      divChartRef={props.divChartRef}
                      selectedTokenId={selectedTokenId}
                      setSelectedTokenId={setSelectedTokenId}
                    />
                  </TabsContent>

                  <TabsContent value="rewards" activeTab={activeTab}>
                    <RewardChart divChartRef={props.divChartRef} />
                  </TabsContent>

                  <ChartFooter
                    imgLabel={selectedTokenId}
                    handleSaveToPng={props.handleSaveToPng}
                    lastUpdatedDate={activeTab}
                  />
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

export default NamadaChart;

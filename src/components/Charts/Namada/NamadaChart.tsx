// "use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { getNamadaSupply } from "@/lib/chart/helpers";

import { Spinner } from "flowbite-react";
import { RefObject, useEffect, useState } from "react";

import { ErrorBoundary } from "../../ErrorBoundary/ErrorBoundary";
import CryptoMetrics from "../../ShieldedPool/Metric";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../UI/shadcn/select";
import ChartFooter from "../ChartFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Tabs";
import RewardChart from "./RewardsChart";
import TokenEcosystem from "./TokenEcosystem";

type NamadaChartProps = {
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

// type NamadaAsset = {
//   id: string;
//   totalSupply: string;
//   shieldedSupply: string;
//   transparentSupply: string;
// };

// type NamadaRawData = {
//   Date: string;
//   Total_Supply: NamadaAsset[];
//   Native_Supply_NAM: string;
// };

// type FlattenedTokenData = {
//   Date: string;
//   [tokenId: string]: number | string;
// };

function NamadaChart(props: NamadaChartProps) {
  const [selectedTokenId, setSelectedTokenId] = useState<string>("all");
  // const [rawData, setRawData] = useState<NamadaRawData[]>([]);
  // const [tokenIds, setTokenIds] = useState<string[]>([]);
  // const [loading, setLoading] = useState(true);

  // const fontSize = useResponsiveFontSize();

  const [activeTab, setActiveTab] = useState("supply");

  const tabLabels = ["Supply", "Rewards"];

  // useEffect(() => {
  //   const controller = new AbortController();

  //   async function fetchData() {
  //     setLoading(true);
  //     try {
  //       const data = await getNamadaSupply(
  //         DATA_URL.namadaSupplyUrl,
  //         controller.signal
  //       );
  //       setRawData(data || []);

  //       const firstEntry = data?.[0]?.Total_Supply || [];
  //       setTokenIds(firstEntry.map((t: NamadaAsset) => t.id));
  //     } catch (err) {
  //       console.error("Failed to fetch namada data:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchData();
  //   return () => controller.abort();
  // }, []);

  // const flattenedData: FlattenedTokenData[] = rawData.map((entry) => {
  //   const row: FlattenedTokenData = { Date: entry.Date };
  //   entry.Total_Supply.forEach((token) => {
  //     const value = parseFloat(token.totalSupply || "0");
  //     row[token.id] = value;
  //   });
  //   return row;
  // });

  // const chartData =
  //   selectedTokenId === "all"
  //     ? flattenedData
  //     : flattenedData.map((d) => ({
  //         Date: d.Date,
  //         [selectedTokenId]: d[selectedTokenId],
  //       }));

  // const activeTokenIds =
  //   selectedTokenId === "all" ? tokenIds : [selectedTokenId];

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
                    <TokenEcosystem divChartRef={props.divChartRef} selectedTokenId={selectedTokenId} setSelectedTokenId={setSelectedTokenId}/>
                  </TabsContent>

                  <TabsContent value="rewards" activeTab={activeTab}>
                    <RewardChart chartRef={props.divChartRef} />
                  </TabsContent>

                  <ChartFooter
                    pngLabel={selectedTokenId}
                    handleSaveToPng={props.handleSaveToPng}
                    lastUpdatedDate={props.lastUpdated}
                    data={[]}
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

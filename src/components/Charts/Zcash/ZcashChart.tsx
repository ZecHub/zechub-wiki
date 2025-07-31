import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
// import { NamadaAsset } from "@/lib/chart/types";
import NodeCountChartB from "@/components/NodeCountChart";
import { RefObject, useState } from "react";
import SupplyDataLastUpdated from "../../LastUpdated";
import { ZcashMetrics } from "../../ZcashMetrics/ZcashMetrics";
import DifficultyChart from "./DifficultyChart";
import IssuanceChart from "./IssuanceChart";
import LockboxChart from "./LockboxChart";
import NetInflowsOutflowsChart from "./NetInflowsOutflowsChart";
import ShieldedSupplyChart from "./ShieldedSupplyChart";

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

// Tabs component - simple implementation
const Tabs = ({ children, defaultValue, value, onValueChange }: any) => {
  const [activeTab, setActiveTab] = useState(defaultValue || value);

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className="tabs-container">
      {children({ activeTab, setActiveTab: handleTabChange })}
    </div>
  );
};

const TabsList = ({ children }: any) => (
  <div className="flex space-x-1 rounded-lg bg-muted bg-slate-100 p-1 mb-4">
    {children}
  </div>
);

const TabsTrigger = ({ value, children, activeTab, setActiveTab }: any) => (
  <button
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === value
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    }`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab }: any) => (
  <div className={activeTab === value ? "block" : "hidden"}>{children}</div>
);

function ZcashChart(props: ZcashChartProps) {
  const [activeTab, setActiveTab] = useState("supply");
  const [cumulativeCheck, setCumulativeCheck] = useState(true);
  const [filterSpamCheck, setFilterSpamCheck] = useState(false);

  const tabLabels = [
    "Supply",
    "Difficulty",
    "Issuance",
    "Lockbox",
    "Flows",
    "Node Count",
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

                <TabsContent
                  value="supply"
                  activeTab={activeTab}
                  ref={props.divChartRef}
                >
                  <ShieldedSupplyChart />
                </TabsContent>

                <TabsContent value="difficulty" activeTab={activeTab}>
                  <DifficultyChart />
                </TabsContent>

                <TabsContent value="issuance" activeTab={activeTab}>
                  {activeTab === "issuance" && <IssuanceChart />}
                </TabsContent>

                <TabsContent value="lockbox" activeTab={activeTab}>
                  <LockboxChart />
                </TabsContent>

                <TabsContent value="flows" activeTab={activeTab}>
                  <NetInflowsOutflowsChart color="red" />
                </TabsContent>

                <TabsContent value="node count" activeTab={activeTab}>
                  {/* <NodeCountChart color="red" /> */}
                  <NodeCountChartB color="red" />
                </TabsContent>

                <div>
                  {props.lastUpdated && (
                    <SupplyDataLastUpdated lastUpdated={props.lastUpdated} />
                  )}
                  {/* <ExportButton
                      handleSaveToPng={props.handleSaveToPng}
                      selectedPool={selectedPool}
                      selectedTool={selectedTool}
                      supplies={supplies}
                    /> */}
                </div>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ZcashChart;

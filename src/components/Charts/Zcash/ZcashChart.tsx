import { Card, CardHeader, CardTitle } from "@/components/UI/shadcn/card";
import { RefObject, useState } from "react";
import CardContentShielded from "./Shielded/CardContent";
import CardContentTxn from "./Transparent/CardContent";
import { ZcashMetrics } from "./ZcashMetrics/ZcashMetrics";
import DefaultSelect from "@/components/DefaultSelect";
import CardContentSupply from "./Supply/CardContentSupply";

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
    toolType: string
  ) => Promise<void>;
};

function ZcashChart(props: ZcashChartProps) {
  const [activeTab, setActiveTab] = useState("supply");
  const [supplyTab, setSupplyTab] = useState("Shielded");

  const tabLabels = [
    "Total Supply",
    "Supply",
    "Difficulty",
    "Issuance",
    "Lockbox",
    "Flows",
    "Node Count",
    "TX Summary",
    "Privacy Set",
    "Stats"
  ];

  const supplyLabels = ["Shielded", "Transparent", "Total Supply"];

  return (
    <div className="space-y-6">
      {/* Market Metrics */}
      <ZcashMetrics />

      {/* Charts Tabs */}
      <Card className="shadow-sm border border-gray-200 dark:border-slate-700">
        <CardHeader className="mb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Analytics Charts</CardTitle>
            {/*  Supply Dropdown */}
            <div className="flex gap-2 items-center">
              <DefaultSelect
                value={supplyTab}
                onChange={(v) => setSupplyTab(v)}
                options={supplyLabels}
                className="inline-block"
                ariaLabel="Supply type"
              />
        
            </div>
          </div>
        </CardHeader>
        {supplyTab == "Shielded" && <CardContentShielded {...props} />}

        {supplyTab == "Transparent" && <CardContentTxn {...props} />}
      
        {supplyTab == "Total Supply" && <CardContentSupply {...props} />}
        
      </Card>
    </div>
  );
}

export default ZcashChart;

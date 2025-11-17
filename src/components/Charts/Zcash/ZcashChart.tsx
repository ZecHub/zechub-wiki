import { Card, CardHeader, CardTitle } from "@/components/UI/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/shadcn/select";
import { RefObject, useState } from "react";
import CardContentShielded from "./Shielded/CardContent";
import CardContentTxn from "./Transparent/CardContent";
import { ZcashMetrics } from "./ZcashMetrics/ZcashMetrics";
import DefaultSelect from "@/components/DefaultSelect";
import CardContentBlockFees from "./ZcashMetrics/BlockFeesChart";

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

  const supplyLabels = ["Shielded", "Transparent", "Block Fees"];

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
              {/* <Select
                value={supplyTab}
                onValueChange={(v) => setSupplyTab(v as any)}
              >
                <SelectTrigger className="w-36 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supplyLabels.map((opt) => (
                    <SelectItem
                      key={opt}
                      value={opt}
                      className="hover:cursor-pointer bg-slate-50 dark:bg-slate-800"
                    >
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>
          </div>
        </CardHeader>
        {supplyTab == "Shielded" && <CardContentShielded {...props} />}

        {supplyTab == "Transparent" && <CardContentTxn {...props} />}

 {supplyTab == "Block Fees" && (
          <CardContentBlockFees chartRef={props.divChartRef} />
        )}

        
      </Card>
    </div>
  );
}

export default ZcashChart;

import { Card, CardHeader, CardTitle } from "@/components/UI/shadcn/card";
import { RefObject, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
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

type SupplyType = "shielded" | "transparent" | "totalSupply";

function ZcashChart(props: ZcashChartProps) {
  const { t } = useLanguage();
  const chartT = t?.pages?.dashboard?.charts?.zcashChart;
  const [supplyTab, setSupplyTab] = useState<SupplyType>("shielded");

  const supplyOptions: SupplyType[] = ["shielded", "transparent", "totalSupply"];

  const getSupplyLabel = (opt: SupplyType) => {
    if (opt === "shielded") return chartT?.supplyOptions?.shielded || "Shielded";
    if (opt === "transparent") {
      return chartT?.supplyOptions?.transparent || "Transparent";
    }
    return chartT?.supplyOptions?.totalSupply || "Total Supply";
  };

  return (
    <div className="space-y-6">
      {/* Market Metrics */}
      <ZcashMetrics />

      {/* Charts Tabs */}
      <Card className="shadow-sm border border-gray-200 dark:border-slate-700">
        <CardHeader className="mb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              {chartT?.title || "Analytics Charts"}
            </CardTitle>
            {/*  Supply Dropdown */}
            <div className="flex gap-2 items-center">
              <DefaultSelect
                value={supplyTab}
                onChange={(v) => setSupplyTab(v)}
                options={supplyOptions}
                renderOption={getSupplyLabel}
                className="inline-block"
                ariaLabel={chartT?.supplyTypeAriaLabel || "Supply type"}
              />
        
            </div>
          </div>
        </CardHeader>
        {supplyTab === "shielded" && <CardContentShielded {...props} />}

        {supplyTab === "transparent" && <CardContentTxn {...props} />}
      
        {supplyTab === "totalSupply" && <CardContentSupply {...props} />}
        
      </Card>
    </div>
  );
}

export default ZcashChart;

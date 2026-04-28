import { Card, CardHeader, CardTitle } from "@/components/UI/shadcn/card";
import { RefObject, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import CardContentShielded from "./Shielded/CardContent";
import CardContentTxn from "./Transparent/CardContent";
import { ZcashMetrics } from "./ZcashMetrics/ZcashMetrics";
import CardContentSupply from "./Supply/CardContentSupply";
import HeroPopoverTabs from "../HeroPopoverTabs";

type ZcashChartProps = {
  divChartRef: RefObject<HTMLDivElement | null>;
  handleSaveToPng: (
    poolType: string,
    poolData: Record<string, { timestamp: string; supply: number } | null>,
    toolType: string
  ) => Promise<void>;
};

type SupplyType = "shielded" | "transparent" | "totalSupply";

function ZcashChart(props: ZcashChartProps) {
  const { t } = useLanguage();
  const chartT = t?.pages?.dashboard?.charts?.zcashChart;

  const [supplyTab, setSupplyTab] = useState<SupplyType>("shielded");
  const [activeTab, setActiveTab] = useState("supply");

  const tabs = [
    { value: "supply", label: chartT?.supply || "Supply" },
    { value: "difficulty", label: chartT?.difficulty || "Difficulty" },
    { value: "issuance", label: chartT?.issuance || "Issuance" },
    { value: "lockbox", label: chartT?.lockbox || "Lockbox" },
    { value: "flows", label: chartT?.flows || "Flows" },
    { value: "node count", label: chartT?.nodeCount || "Node Count" },
    { value: "tx summary", label: chartT?.txSummary || "TX Summary" },
    { value: "privacy set", label: chartT?.privacySet || "Privacy Set" },
    { value: "shielded stats", label: chartT?.shieldedStats || "Shielded Stats" },
    { value: "block fees", label: chartT?.blockFees || "Block Fees" },
    { value: "network solps", label: chartT?.networkSolps || "Network Solps" },
    { value: "mining pools", label: chartT?.miningPools || "Mining Pools" },
    { value: "halving meter", label: chartT?.halvingMeter || "Halving Meter" },
  ];

  const handleTabChange = (newTab: string) => {
    if (supplyTab !== "shielded") {
      setSupplyTab("shielded");
    }
    setActiveTab(newTab);
  };

  return (
    <div className="space-y-6">
      <ZcashMetrics />

      <Card className="shadow-sm border border-gray-200 dark:border-slate-700">
        <CardHeader className="mb-4">
          <CardTitle className="text-xl">
            {chartT?.title || "Analytics Charts"}
          </CardTitle>
        </CardHeader>

        <HeroPopoverTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          supplyTab={supplyTab}
          setSupplyTab={(tab) => setSupplyTab(tab as SupplyType)}   // ← safe cast
        />

        {supplyTab === "shielded" && (
          <CardContentShielded
            {...props}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}
        {supplyTab === "transparent" && <CardContentTxn {...props} />}
        {supplyTab === "totalSupply" && <CardContentSupply {...props} />}
      </Card>
    </div>
  );
}

export default ZcashChart;
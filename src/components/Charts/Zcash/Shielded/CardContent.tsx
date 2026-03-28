'use client';

import React, { RefObject, useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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

  // === LOCAL STATE (instant clicks) + URL SYNC ===
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<string>(() => {
    return searchParams?.get("tab") || "supply";
  });

  // Sync from URL when someone pastes a link / hits Enter / refreshes
  useEffect(() => {
    const urlTab = searchParams?.get("tab") || "supply";
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams, activeTab]);

  // Click handler — instant UI change + URL update
  const handleTabChange = useCallback(
    (newTab: string) => {
      setActiveTab(newTab);

      const params = new URLSearchParams(searchParams?.toString() || "");
      if (newTab && newTab !== "supply") {
        params.set("tab", newTab);
      } else {
        params.delete("tab");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const tabs = [
    { value: "supply", label: tabT?.supply || "Supply" },
    { value: "difficulty", label: tabT?.difficulty || "Difficulty" },
    { value: "issuance", label: tabT?.issuance || "Issuance" },
    { value: "lockbox", label: tabT?.lockbox || "Lockbox" },
    { value: "flows", label: tabT?.flows || "Flows" },
    { value: "node count", label: tabT?.nodeCount || "Node Count" },
    { value: "tx summary", label: tabT?.txSummary || "TX Summary" },
    { value: "privacy set", label: tabT?.privacySet || "Privacy Set" },
    { value: "shielded stats", label: tabT?.shieldedStats || "Shielded Stats" },
    { value: "block fees", label: tabT?.blockFees || "Block Fees" },
    { value: "network solps", label: tabT?.networkSolps || "Network Solps" },
    { value: "halving meter", label: tabT?.halvingMeter || "Halving Meter" },
  ];

  return (
    <CardContent>
      {/* Key forces Tabs to remount when URL tab changes → fixes Enter/refresh */}
      <Tabs
        key={activeTab}
        value={activeTab}
        defaultValue={activeTab}
        onValueChange={handleTabChange}
      >
        {({ activeTab: currentTab }: any) => (
          <>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  activeTab={currentTab}
                  setActiveTab={handleTabChange}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="supply" activeTab={currentTab}>
              <ShieldedSupplyChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="difficulty" activeTab={currentTab}>
              <DifficultyChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="issuance" activeTab={currentTab}>
              {currentTab === "issuance" && (
                <IssuanceChart chartRef={props.divChartRef} />
              )}
            </TabsContent>

            <TabsContent value="lockbox" activeTab={currentTab}>
              <LockboxChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="flows" activeTab={currentTab}>
              <NetInflowsOutflowsChart
                color="red"
                chartRef={props.divChartRef}
              />
            </TabsContent>

            <TabsContent value="node count" activeTab={currentTab}>
              <NodeCountChart color="red" chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="tx summary" activeTab={currentTab}>
              <TransactionsSummaryChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="privacy set" activeTab={currentTab}>
              <PrivacySetVisualizationChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="shielded stats" activeTab={currentTab}>
              <ShieldedStats chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="block fees" activeTab={currentTab}>
              <BlockFeesChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="network solps" activeTab={currentTab}>
              <NetworkSolpsChart chartRef={props.divChartRef} />
            </TabsContent>

            <TabsContent value="halving meter" activeTab={currentTab}>
              <HalvingMeter />
            </TabsContent>

            <ChartFooter
              imgLabel={currentTab}
              handleSaveToPng={props.handleSaveToPng}
              lastUpdatedDate={currentTab}
            />
          </>
        )}
      </Tabs>
    </CardContent>
  );
};

export default CardContentShielded;
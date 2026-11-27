"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/Charts/Tabs";
import ShieldedSupplyChart from "@/components/Charts/Zcash/ShieldedSupplyChart";
import DifficultyChart from "@/components/Charts/Zcash/DifficultyChart";
import IssuanceChart from "@/components/Charts/Zcash/IssuanceChart";
import LockboxChart from "@/components/Charts/Zcash/LockboxChart";
import NetInflowsOutflowsChart from "@/components/Charts/Zcash/NetInflowsOutflowsChart";
import TransactionsSummaryChart from "@/components/Charts/Zcash/TransactionSummaryChart";
import PrivacySetVisualizationChart from "@/components/Charts/Zcash/PrivacySetVisualizationChart";
import ChartFooter from "@/components/Charts/ChartFooter";
import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import { DATA_URL } from "@/lib/chart/data-url";
import { getLastUpdatedDate } from "@/lib/chart/helpers";
import "@/components/Charts/index.css";

const tabLabels = [
  "Supply",
  "Difficulty",
  "Issuance",
  "Lockbox",
  "Flows",
  "Tx Summary",
  "Privacy Set",
];

function ZcashEmbedContent() {
  const searchParams = useSearchParams();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("supply");
  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  // Get embed parameters
  const theme = searchParams?.get("theme") || "dark";
  const hideHeader = searchParams?.get("hideHeader") === "true";
  const hideControls = searchParams?.get("hideControls") === "true";
  const isEmbed = searchParams?.get("embed") === "true";
  const requestedTab = searchParams?.get("tab")?.trim().toLowerCase();
  const defaultTab = tabLabels.find((label) => label.toLowerCase() === requestedTab)?.toLowerCase()
    ?? "supply";
  const darkClasses = [
    "bg-slate-900",
    "text-white",
    "transition",
    "duration-500",
  ];

  console.log(theme);
  if (typeof document !== "undefined") {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove(...darkClasses);
    } else {
      document.documentElement.classList.add("dark");
      document.body.classList.add(...darkClasses);
    }
  }

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const lastUpdatedDate = await getLastUpdatedDate(
          DATA_URL.shieldedUrl,
          controller.signal
        );

        if (lastUpdatedDate) {
          setLastUpdated(new Date(lastUpdatedDate));
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  // Apply theme class to body
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove(...darkClasses);
    } else {
      document.documentElement.classList.add("dark");
      document.body.classList.add(...darkClasses);
    }
  }, [theme]);

  // Send height to parent iframe for auto-resize
  useEffect(() => {
    if (isEmbed && window.parent !== window) {
      const sendHeight = () => {
        // Measure actual body height instead of scrollHeight
        const height = document.body.offsetHeight;
        window.parent.postMessage({ type: "zechub-resize", height }, "*");
      };

      // Initial
      setTimeout(sendHeight, 100);

      // Listen for window resizes
      window.addEventListener("resize", sendHeight);

      // ResizeObserver for dynamic content
      const observer = new ResizeObserver(() => {
        setTimeout(sendHeight, 100);
      });
      observer.observe(document.body);

      return () => {
        window.removeEventListener("resize", sendHeight);
        observer.disconnect();
      };
    }
  }, [isEmbed, activeTab]);

  if (!lastUpdated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-muted-foreground">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    // <div className={`min-h-screen ${isEmbed ? "p-4" : "p-6"}`}>
    <div style={{ width: "100%", height: "100%" }}>
      {/* Charts Tabs */}
      <Card className="shadow-sm border border-gray-200 dark:border-slate-700">
        {!hideHeader && (
          <CardHeader className="mb-4">
            <CardTitle className="text-xl">Analytics Charts</CardTitle>
          </CardHeader>
        )}
        <CardContent className={hideHeader ? "pt-6" : undefined}>
          <Tabs key={defaultTab} defaultValue={defaultTab} onValueChange={setActiveTab}>
            {({ activeTab, setActiveTab }) => (
              <>
                {!hideControls && (
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
                )}

                <TabsContent value="supply" activeTab={activeTab}>
                  <ShieldedSupplyChart chartRef={divChartRef} />
                </TabsContent>

                <TabsContent value="difficulty" activeTab={activeTab}>
                  <DifficultyChart chartRef={divChartRef} />
                </TabsContent>

                <TabsContent value="issuance" activeTab={activeTab}>
                  {activeTab === "issuance" && (
                    <IssuanceChart chartRef={divChartRef} />
                  )}
                </TabsContent>

                <TabsContent value="lockbox" activeTab={activeTab}>
                  <LockboxChart chartRef={divChartRef} />
                </TabsContent>

                <TabsContent value="flows" activeTab={activeTab}>
                  <NetInflowsOutflowsChart color="red" chartRef={divChartRef} />
                </TabsContent>

                <TabsContent value="tx summary" activeTab={activeTab}>
                  <TransactionsSummaryChart chartRef={divChartRef} />
                </TabsContent>

                <TabsContent value="privacy set" activeTab={activeTab}>
                  <PrivacySetVisualizationChart chartRef={divChartRef} />
                </TabsContent>

                {!hideControls && (
                  <ChartFooter
                    imgLabel={activeTab}
                    handleSaveToPng={handleSaveToPng}
                    lastUpdatedDate={activeTab}
                  />
                )}
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
    // </div>
  );
}

export default function ZcashEmbedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <ZcashEmbedContent />
    </Suspense>
  );
}

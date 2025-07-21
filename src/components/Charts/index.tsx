import { Button } from "@/components/ui/shadcn/button";
import { useEffect, useState } from "react";

import "./index.css";

import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import { DATA_URL } from "@/lib/chart/data-url";
import { getLastUpdatedDate } from "@/lib/chart/helpers";
import NamadaChart from "./NamadaChart";
import PenumbraChart from "./PenumbraChart";
import ZcashChart from "./ZcashChart";

const Dashboard = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("zcash");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      try {
        const [lastUpdated] = await Promise.all([
          getLastUpdatedDate(DATA_URL.shieldedUrl, controller.signal),
        ]);

        if (lastUpdated) {
          setLastUpdated(new Date(lastUpdated));
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchAllData();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="mt-12">
            <h1 className="text-3xl font-bold text-foreground">
              Privacy Cryptocurrency Dashboard
            </h1>
            <p className="text-muted-foreground">
              Analyze privacy coin metrics and trends
            </p>
          </div>

          {/* Crypto Selector */}
          <div className="flex gap-2">
            <Button
              className="bg-orange-400/75 text-white"
              variant={selectedCrypto === "zcash" ? "default" : "outline"}
              onClick={() => setSelectedCrypto("zcash")}
            >
              Zcash
            </Button>
            <Button
              className="bg-purple-500/75 text-white"
              variant={selectedCrypto === "penumbra" ? "default" : "outline"}
              onClick={() => setSelectedCrypto("penumbra")}
              disabled
            >
              Penumbra
            </Button>
            <Button
              className="bg-yellow-300/75 text-white"
              variant={selectedCrypto === "namada" ? "default" : "outline"}
              onClick={() => setSelectedCrypto("namada")}
            >
              Namada
            </Button>
          </div>
        </div>

        {/* Zcash Dashboard */}
        {selectedCrypto === "zcash" && (
          <ZcashChart
            lastUpdated={lastUpdated!}
            divChartRef={divChartRef}
            handleSaveToPng={handleSaveToPng}
          />
        )}

        {/* Namada Dashboard */}
        {selectedCrypto === "namada" && (
          <NamadaChart lastUpdated={lastUpdated!} divChartRef={divChartRef} />
        )}

        {/* Penumbra Dashboard */}
        {selectedCrypto === "penumbra" && (
          <PenumbraChart lastUpdated={lastUpdated!} divChartRef={divChartRef} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

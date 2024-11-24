"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import ZecToZatsConverter from "@/components/Converter/ZecToZatsConverter";
import Tools from "@/components/tools";
import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import dynamic from "next/dynamic";

const ShieldedPoolChart = dynamic(
  () => import("../../components/ShieldedPoolChart"),
  { ssr: true }
);

const TransactionSummaryChart = dynamic(
  () => import("../../components/TransactionSummaryChart"),
  { ssr: true }
);

const defaultUrl =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/shielded_supply.json";
const txsummaryUrl =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json";

interface TransactionSummary {
  totalShielded: number;
  sprout: number;
  sapling: number;
  orchard: number;
  timestamp: string;
}

const ShieldedPoolDashboard = () => {
  const [selectedPool, setSelectedPool] = useState("default");
  const [supplyData, setSupplyData] = useState<TransactionSummary | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [selectedTool, setSelectedTool] = useState<string>("supply");
  const [selectedToolName, setSelectedToolName] = useState<string>("Shielded Supply Chart (ZEC)");

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  const getDataColor = () => {
    switch (selectedPool) {
      case "sprout":
        return "#A020F0";
      case "sapling":
        return "#FFA500";
      case "orchard":
        return "#32CD32";
      default:
        return "url(#area-background-gradient)";
    }
  };

  useEffect(() => {
    // Fetch total shielded supply and pool-specific data
    async function fetchTransactionSummary() {
      try {
        const response = await fetch(txsummaryUrl);
        const data = await response.json();
        const latest = data[data.length - 1]; // Get the most recent entry
        setSupplyData(latest);
        setLastUpdated(latest.timestamp);
      } catch (error) {
        console.error("Error fetching transaction summary:", error);
      }
    }

    fetchTransactionSummary();
  }, []);

  return (
    <div>
      <h2 className="font-bold mt-8 mb-4">{selectedToolName}</h2>
      <div className="border p-3 rounded-lg relative">
        <Tools onToolChange={setSelectedTool} />
        <div ref={divChartRef}>
          {selectedTool === "supply" && (
            <ShieldedPoolChart
              dataUrl={defaultUrl}
              color={getDataColor()}
            />
          )}
          {selectedTool === "transaction" && (
            <TransactionSummaryChart dataUrl={txsummaryUrl} />
          )}
        </div>

        {/* Last Updated Date */}
        <div className="absolute bottom-0 right-0 p-3 text-sm text-gray-500">
          Last Updated:{" "}
          {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : "Loading..."}
        </div>
      </div>

      {selectedTool === "supply" && (
        <div className="mt-8 flex flex-col items-center">
          <div className="flex justify-center space-x-4">
            <div className="flex flex-col items-center">
              <Button
                onClick={() => setSelectedPool("default")}
                text="Total Shielded"
                className={`rounded py-2 px-4 ${
                  selectedPool === "default" ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              />
              <span className="text-sm text-gray-600">
                {supplyData?.totalShielded?.toLocaleString() ?? "Loading..."} ZEC
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => setSelectedPool("sprout")}
                text="Sprout Pool"
                className={`rounded py-2 px-4 ${
                  selectedPool === "sprout" ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              />
              <span className="text-sm text-gray-600">
                {supplyData?.sprout?.toLocaleString() ?? "Loading..."} ZEC
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => setSelectedPool("sapling")}
                text="Sapling Pool"
                className={`rounded py-2 px-4 ${
                  selectedPool === "sapling" ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              />
              <span className="text-sm text-gray-600">
                {supplyData?.sapling?.toLocaleString() ?? "Loading..."} ZEC
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => setSelectedPool("orchard")}
                text="Orchard Pool"
                className={`rounded py-2 px-4 ${
                  selectedPool === "orchard" ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              />
              <span className="text-sm text-gray-600">
                {supplyData?.orchard?.toLocaleString() ?? "Loading..."} ZEC
              </span>
            </div>
          </div>

          {/* ZecToZatsConverter placed here with transparency */}
          <div className="mt-8 w-full flex justify-center">
            <div
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                maxWidth: "400px",
                textAlign: "center",
              }}
            >
              <ZecToZatsConverter />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShieldedPoolDashboard;

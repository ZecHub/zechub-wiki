"use client";

import { Button } from "@/components/UI/shadcn/button";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import "./index.css";

import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import { DATA_URL } from "@/lib/chart/data-url";
import { getLastUpdatedDate } from "@/lib/chart/helpers";
import NamadaChart from "./Namada/NamadaChart";
import PenumbraChart from "./Penumbra/PenumbraChart";
import ZcashChart from "./Zcash/ZcashChart";

import { HalvingMeter } from "../HalvingMeter/halving-meter";

const Dashboard = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("zcash");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();


  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="mt-12">
            <h1 className="text-3xl font-bold text-foreground">ZecHub Dashboard</h1>
            <p className="text-muted-foreground">Analyze Zcash network metrics and trends</p>
          </div>

          {/* Shielded Networks Dropdown only */}
          <div
            className="relative inline-block text-left w-[160px]"
            ref={dropdownRef}
          >
            <Button
              className="bg-purple-500/90 text-white w-[160px]"
              variant={selectedCrypto === "zcash" ? "default" : "outline"}
              onClick={() => setOpen(!open)}
            >
              Shielded Networks
            </Button>
            {open && (
              <div className="absolute mt-2 bg-white shadow-lg rounded-lg dark:bg-slate-900 w-[160px]">
                <ul className="w-[160px]">
                  <li className="px-4 py-2 hover:bg-purple-300/50 dark:hover:bg-purple-500/50 rounded-md cursor-pointer w-[160px]">
                    <Link
                      href="https://namada.zechub.wiki"
                      className="block w-full h-full"
                      onClick={() => setOpen(false)}
                      target="_blank"
                    >
                      Namada
                    </Link>
                  </li>
                </ul>
                
              </div>
            )}
          </div>
        </div>

        {/* Zcash Dashboard (default) */}
        {selectedCrypto === "zcash" &&  (
          <ZcashChart
            divChartRef={divChartRef}
            handleSaveToPng={handleSaveToPng}
          />
        )}

        {/* Namada Dashboard (kept for potential future internal view; currently linked out) */}
        {selectedCrypto === "namada" && (
          <NamadaChart
            
            divChartRef={divChartRef}
            handleSaveToPng={handleSaveToPng}
          />
        )}

        {/* Penumbra Dashboard (not selectable in UI currently) */}
        {selectedCrypto === "penumbra" && (
          <PenumbraChart  divChartRef={divChartRef} />
        )}
      
      </div>
    </div>
  );
};

export default Dashboard;

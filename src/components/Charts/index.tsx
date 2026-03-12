"use client";

import { Button } from "@/components/UI/shadcn/button";
import { BarChart3, FileText, Shield, Award } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import "./index.css";

import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import NamadaChart from "./Namada/NamadaChart";
import PenumbraChart from "./Penumbra/PenumbraChart";
import ZcashChart from "./Zcash/ZcashChart";

import { ProposalsList } from "@/components/Proposals";

const ZCGDashboard = dynamic(() => import("@/app/zips-grants/page"), { ssr: false });

type ViewType = "dashboard" | "proposals" | "zcg";

const Dashboard = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("zcash");
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  // Close Shielded Networks dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeView = (view: ViewType) => setCurrentView(view);

  const tabs = [
    { key: "dashboard" as const, label: "ZecHub Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { key: "proposals" as const, label: "Proposals", icon: <FileText className="w-5 h-5" /> },
    { key: "zcg" as const, label: "ZCG Dashboard", icon: <Award className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8 relative">

        {/* === SHIELDED NETWORKS — TOP RIGHT CORNER === */}
        <div className="absolute top-8 right-8 z-50" ref={dropdownRef}>
          <Button
            size="icon"
            className="bg-purple-600 hover:bg-purple-700 text-white h-11 w-11 rounded-2xl shadow-lg"
            onClick={() => setOpen(!open)}
            title="Shielded Networks"
          >
            <Shield className="h-5 w-5" />
          </Button>

          {open && (
            <div className="absolute mt-2 right-0 bg-white shadow-lg rounded-lg dark:bg-slate-900 w-[160px] border border-slate-200 dark:border-slate-700">
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

        {/* === HEADER === */}
        <div className="mt-12 text-center">
          <h1 className="text-3xl font-bold text-foreground">Zcash Analytics</h1>
          <p className="text-muted-foreground">Analyze Zcash network metrics and trends</p>
        </div>

        {/* === PURE PURPLE TABS (always visible) === */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-3xl p-1.5 shadow-inner">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant="ghost"
                className={`px-9 py-3.5 rounded-3xl font-semibold flex items-center gap-2 transition-all text-base ${
                  currentView === tab.key
                    ? "bg-purple-700 text-white shadow-lg"   // Pure bold purple
                    : "text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-700 dark:hover:text-purple-300"
                }`}
                onClick={() => changeView(tab.key)}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* === SELECTED CONTENT === */}
        {currentView === "dashboard" && (
          <>
            {selectedCrypto === "zcash" && (
              <ZcashChart divChartRef={divChartRef} handleSaveToPng={handleSaveToPng} />
            )}
            {selectedCrypto === "namada" && (
              <NamadaChart divChartRef={divChartRef} handleSaveToPng={handleSaveToPng} />
            )}
            {selectedCrypto === "penumbra" && <PenumbraChart divChartRef={divChartRef} />}
          </>
        )}

        {currentView === "proposals" && <ProposalsList />}

        {currentView === "zcg" && <ZCGDashboard />}

      </div>
    </div>
  );
};

export default Dashboard;
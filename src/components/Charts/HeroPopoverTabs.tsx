"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";

type Tab = {
  value: string;
  label: string;
};

interface HeroPopoverTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (newTab: string) => void;
  supplyTab: string;
  setSupplyTab: (tab: string) => void;
}

export default function HeroPopoverTabs({
  tabs,
  activeTab,
  onTabChange,
  supplyTab,
  setSupplyTab,
}: HeroPopoverTabsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTabData = tabs.find((t) => t.value === activeTab) || tabs[0];
  const otherTabs = tabs.filter((t) => t.value !== activeTab);

  const supplyOptions = [
    { value: "shielded", label: "Shielded" },
    { value: "transparent", label: "Transparent" },
    { value: "totalSupply", label: "Total Supply" },
  ];

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative mx-4 sm:mx-0 space-y-3">
      {/* Top row: active tab pill + "All Tabs" toggle */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Active tab — matches Dashboard's active button style exactly */}
        <div className="px-6 py-2.5 md:px-9 md:py-3.5 rounded-3xl font-semibold flex items-center gap-2 text-sm md:text-base bg-purple-700 dark:bg-purple-800 text-white shadow-lg pointer-events-none select-none">
          {activeTabData.label}
        </div>

        {/* All Tabs toggle — matches inactive button style, flips to active when open */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className={`flex items-center gap-1.5 px-5 py-2.5 md:px-7 md:py-3.5 rounded-3xl font-semibold text-sm md:text-base transition-all ${
            isOpen
              ? "bg-purple-700 dark:bg-purple-800 text-white shadow-lg"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-700 dark:hover:bg-purple-800 hover:text-white"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>All Tabs</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Supply sub-tabs — matches the YouTube sub-tab row in Dashboard */}
      {activeTab === "supply" && (
        <div className="flex justify-center">
          <div className="grid grid-cols-2 imd:inline-flex bg-slate-100 dark:bg-slate-800 rounded-3xl p-1 shadow-inner flex-wrap mb-3">
            {supplyOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSupplyTab(opt.value)}
                className={`px-6 py-2.5 text-sm font-medium rounded-3xl transition-all whitespace-nowrap ${
                  supplyTab === opt.value
                    ? "bg-purple-700 dark:bg-purple-800 text-white shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-950"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden w-fit min-w-75 imd:min-w-100 md:min-w-150 max-w-5xl lg:max-w-2xl">
          <div className="p-3 grid grid-cols-2 imd:grid-cols-3 lg:grid-cols-4 gap-2">
            {otherTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  onTabChange(tab.value);
                  setIsOpen(false);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-700 dark:hover:bg-purple-800 hover:text-white whitespace-nowrap"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

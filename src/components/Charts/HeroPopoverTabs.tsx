"use client";

import React, { useState } from "react";
import { ChevronDown, List } from "lucide-react";

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

  const activeTabData = tabs.find((tab) => tab.value === activeTab) || tabs[0];

  const handleSelectTab = (value: string) => {
    onTabChange(value);
    setIsOpen(false);
  };

  const otherTabs = tabs.filter((tab) => tab.value !== activeTab);

  const supplyOptions = [
    { value: "shielded", label: "Shielded" },
    { value: "transparent", label: "Transparent" },
    { value: "totalSupply", label: "Total Supply" },
  ];

  return (
    <div className="relative bg-card border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-6 py-3.5 bg-muted hover:bg-accent border border-border rounded-3xl text-muted-foreground hover:text-foreground transition-all duration-200 font-medium"
        >
          <List className="w-5 h-5" />
          <span>All Tabs</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <div className="flex-1 max-w-md">
          <div className="px-10 py-5 bg-primary text-primary-foreground rounded-3xl text-2xl font-semibold text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-primary/30">
            {activeTabData.label}
          </div>
        </div>

        <div className="w-[148px]" />
      </div>

      {activeTab === "supply" && (
        <div className="flex justify-center gap-2 mt-6">
          {supplyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSupplyTab(option.value)}
              className={`px-7 py-3 rounded-3xl font-medium transition-all ${
                supplyTab === option.value
                  ? "bg-primary text-primary-foreground shadow-md border border-primary/30"
                  : "bg-muted hover:bg-accent text-muted-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleSelectTab(tab.value)}
                className={`px-6 py-3.5 text-sm font-medium rounded-3xl transition-all text-center ${
                  activeTab === tab.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-accent text-muted-foreground"
                }`}
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
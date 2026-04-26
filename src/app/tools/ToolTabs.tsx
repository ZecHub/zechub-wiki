"use client";

import ZecToZatsConverter from "@/components/Converter/ZecToZatsConverter";
import { useState } from "react";
import AddressDecoder from "./AddressDecoder";
import PaymentRequestBuilder from "./PaymentRequestBuilder";
import PaymentRequestWidget from "./PaymentRequestWidget";
import { config } from "./config";

type TabId = "converter" | "payment" | "decoder" | "payment-request-widget";

interface Tab {
  id: TabId;
  label: string;
  shortLabel: string;
  badge: string;
  title: string;
  subtitle: string;
}

const TABS: Tab[] = [
  {
    id: "converter",
    label: "ZEC ↔ Zats",
    shortLabel: "Converter",
    badge: "Converter",
    title: "ZEC ↔ Zats",
    subtitle: "Precise conversion between ZEC and Zatoshi",
  },
  {
    id: "payment",
    label: "Payment Request",
    shortLabel: "Payment",
    badge: "ZIP-321",
    title: "Payment Request Builder",
    subtitle: "Generate zcash: URIs with QR codes for easy payment requests",
  },
  {
    id: "payment-request-widget",
    label: "PR Widget",
    shortLabel: "Payment",
    badge: "ZIP-321",
    title: "Payment Request Widget",
    subtitle: "Generate zcash: URIs with QR codes for easy payment requests",
  },
  {
    id: "decoder",
    label: "Address Decoder",
    shortLabel: "Decoder",
    badge: "Unified Address",
    title: "Address Decoder",
    subtitle: "Extract transparent, sapling & orchard receivers from a UA",
  },
];

export interface GeneratedConfig {
  address: string;
  amount: number;
  label: string;
  apiBase: string;
  qrData?: unknown;
  theme: string;
  target: string;
  disabled: boolean;
  [index: string]: any;
}

export default function ToolTabs() {
  const [active, setActive] = useState<TabId>("converter");

  const current = TABS.find((t) => t.id === active)!;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex bg-zinc-100 dark:bg-[#0f1720] rounded-xl p-1 border border-zinc-200 dark:border-[#1e2d3d] mb-6">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`
                flex-1 relative py-2.5 sm:py-3 rounded-lg text-[13px] sm:text-sm font-semibold
                transition-all duration-200 ease-out
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#F4B728] to-[#d9a520] text-[#151e29] shadow-md shadow-[#F4B728]/15"
                    : "text-zinc-400 dark:text-[#4a5a6e] hover:text-zinc-600 dark:hover:text-[#7a8a9e]"
                }
              `}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-[#1e2d3d] bg-white dark:bg-[#151e29] overflow-hidden shadow-sm dark:shadow-none">
        {/* Card header */}
        <div className="px-5 pt-5 pb-4 sm:px-7 sm:pt-7 sm:pb-5 border-b border-zinc-100 dark:border-[#1e2d3d]">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] text-[#F4B728] bg-[#F4B728]/10 border border-[#F4B728]/15 px-2 py-1 rounded mb-3">
            {current.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            {current.title}
          </h2>
          <p className="mt-1 text-[13px] sm:text-sm text-zinc-500 dark:text-[#5a6a7e]">
            {current.subtitle}
          </p>
        </div>

        {/* Card body */}
        <div className="px-5 py-6 sm:px-7 sm:py-7">
          {active === "converter" && <ZecToZatsConverter />}
          {active === "payment" && <PaymentRequestBuilder />}
          {active === "payment-request-widget" && <PaymentRequestWidget />}
          {active === "decoder" && <AddressDecoder />}
        </div>
      </div>
    </div>
  );
}

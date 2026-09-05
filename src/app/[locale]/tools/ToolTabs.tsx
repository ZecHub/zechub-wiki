"use client";

import ZecToZatsConverter from "@/components/Converter/ZecToZatsConverter";
import { useSearchParams } from "next/navigation";
import AddressDecoder from "./AddressDecoder";
import PaymentRequestBuilder from "./PaymentRequestBuilder";
import PaymentRequestWidget from "./zcash-payment-widget/PaymentRequestWidget";
import FaucetClaim from "./FaucetClaim";

// Tab ids double as the public URL slug, e.g. /tools?tool=address-decoder.
// Renaming one changes a shareable link, so treat them as part of the API.
type TabId =
  | "converter"
  | "payment-request"
  | "payment-request-widget"
  | "address-decoder"
  | "faucet";

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
    id: "faucet",
    label: "Testnet Faucet",
    shortLabel: "Faucet",
    badge: "Testnet ZEC",
    title: "Request Testnet ZEC",
    subtitle: "Get testnet ZEC for wallet and integration testing",
  },
  {
    id: "converter",
    label: "ZEC ↔ Zats",
    shortLabel: "Converter",
    badge: "Converter",
    title: "ZEC ↔ Zats",
    subtitle: "Precise conversion between ZEC and Zatoshi",
  },
  {
    id: "payment-request",
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
    id: "address-decoder",
    label: "Address Decoder",
    shortLabel: "Decoder",
    badge: "Unified Address",
    title: "Address Decoder",
    subtitle: "Extract transparent, sapling & orchard receivers from a UA",
  },
];

const TOOL_PARAM = "tool";
const DEFAULT_TAB: TabId = TABS[0].id;

function tabIdFromParam(requested: string | null): TabId {
  return TABS.some((t) => t.id === requested)
    ? (requested as TabId)
    : DEFAULT_TAB;
}

export interface GeneratedConfig {
  address: string;
  amount: number;
  zecUsdRate: number;
  label: string;
  apiBase: string;
  qrData?: unknown;
  theme: string;
  target: string;
  disabled: boolean;
  [index: string]: any;
}

export default function ToolTabs() {
  // `?tool=` is the only source of truth for which tool is open: it makes each
  // one linkable, survives a refresh, and moves with Back/Forward for free.
  const searchParams = useSearchParams();
  const active = tabIdFromParam(searchParams?.get(TOOL_PARAM) ?? null);

  const selectTab = (id: TabId) => {
    if (id === active) return;
    const url = new URL(window.location.href);
    url.searchParams.set(TOOL_PARAM, id);
    // pushState rather than router.push: switching tools stays instant and
    // local instead of round-tripping to the server, and Back/Forward still get
    // a real history entry. Next keeps useSearchParams in sync with it.
    window.history.pushState(null, "", url);
  };

  const current = TABS.find((t) => t.id === active)!;

  return (
    <div className="lg:grid lg:grid-cols-[176px_minmax(0,1fr)] lg:items-start lg:gap-5">
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Zcash tools"
        className="mb-6 flex w-full snap-x snap-mandatory gap-1 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-[#1e2d3d] dark:bg-[#0f1720] lg:mb-0 lg:flex-col lg:overflow-visible"
      >
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              id={`tool-tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tool-panel-${tab.id}`}
              className={`
                relative min-h-14 w-[142px] flex-none snap-start rounded-lg px-3 py-2 text-center text-[12px] leading-tight font-semibold whitespace-nowrap
                transition-all duration-200 ease-out sm:min-h-16 sm:w-[156px] sm:px-3 sm:py-3 sm:text-[13px] lg:min-h-12 lg:w-full lg:px-2 lg:py-2.5 lg:text-left
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#F4B728] to-[#d9a520] text-[#151e29] shadow-md shadow-[#F4B728]/15"
                    : "text-zinc-400 dark:text-[#4a5a6e] hover:text-zinc-600 dark:hover:text-[#7a8a9e]"
                }
              `}
            >
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
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
        <div
          id={`tool-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`tool-tab-${active}`}
          tabIndex={0}
          className="px-5 py-6 outline-none sm:px-7 sm:py-7"
        >
          {active === "converter" && <ZecToZatsConverter />}
          {active === "payment-request" && <PaymentRequestBuilder />}
          {active === "payment-request-widget" && <PaymentRequestWidget />}
          {active === "address-decoder" && <AddressDecoder />}
          {active === "faucet" && <FaucetClaim />}
        </div>
      </div>
    </div>
  );
}

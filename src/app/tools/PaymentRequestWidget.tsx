"use client";

import { useCallback, useEffect, useState } from "react";
import { config } from "./config";
import {
  detectZcashNetwork,
  fetchZecPrice,
  resolveQRCode,
  type ZcashNetwork,
} from "./helper";
import { useWasm } from "./hooks/useWasm";
import { GeneratedConfig } from "./ToolTabs";
import WasmInitStatus from "./WasmInitStatus";
import WidgetButtonTrigger from "./WidgetButtonTrigger";

const INPUT_CLASS = [
  "w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]",
  "focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15",
  "rounded-xl px-4 py-3.5 text-[15px] font-medium outline-none transition-all duration-200",
  "text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-[#2d3e50]",
].join(" ");

const LABEL_CLASS =
  "block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1";

const WIDGET_API_BASE_URL = config.env.NEXT_PUBLIC_WIDGET_API_BASE_URL;

// State type
type ValidationState =
  | { status: "idle" }
  | { status: "validating" }
  | { status: "valid"; addressType?: string; network: ZcashNetwork }
  | { status: "invalid"; error: string };

type Payment = {
  address: string;
  amount: string;
  label: string;
  validation: ValidationState;
};

const Validation = {
  idle(): ValidationState {
    return { status: "idle" };
  },
  validating(): ValidationState {
    return { status: "validating" };
  },
  invalid(error: string): ValidationState {
    return { status: "invalid", error };
  },
  valid(addressType?: string, network?: ZcashNetwork): ValidationState {
    return { status: "valid", addressType, network: network! };
  },
};

export default function PaymentRequestWidget() {
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const { wasmMmoduleRef, wasmReady } = useWasm();
  const [isValidating, setIsValidating] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [priceFeedDataSource, setPriceFeedDataSource] = useState({
    rate: "",
    source: "",
  });

  const [payment, setPayment] = useState<Payment>({
    address: "",
    amount: "",
    label: "",
    validation: {
      status: "idle",
    },
  });

  const [generatedConfig, setGeneratedConfig] = useState<GeneratedConfig>({
    address: "xxxxxxxxxxxxxxxx...",
    amount: 0,
    label: "",
    apiBase: "",
    theme: "",
    target: config.WIDGET_CONTAINER,
    disabled: true,
  });

  /* ── Validate when input changes ── */
  const validateAddr = useCallback(
    (addr: string) => {
      addr = addr.trim();

      if (!addr || !wasmMmoduleRef.current) {
        return Validation.idle();
      }

      setLoading(true);
      try {
        const mod = wasmMmoduleRef.current;

        const validateAddress =
          mod.isZcashAddressValid ?? mod.is_valid_zcash_address;
        const typeFn = mod.getZcashAddressType ?? mod.get_zcash_address_type;

        if (!validateAddress) {
          return Validation.invalid("WASM validation functions missing");
        }

        if (!validateAddress(addr)) {
          return Validation.invalid("Not a valid Zcash address");
        }

        return Validation.valid(
          typeFn ? typeFn(addr) : undefined,
          detectZcashNetwork(addr),
        );
      } catch (err: unknown) {
        return Validation.invalid(
          err instanceof Error ? err.message : "Validation failed",
        );
      } finally {
        setLoading(false);
      }
    },
    [wasmMmoduleRef],
  );

  // Flags
  const isLoading = payment.validation.status === "validating";

  const allValid =
    payment.address !== "" &&
    parseFloat(payment.amount) > 0 &&
    payment.validation.status === "valid";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetchZecPrice(
        `${WIDGET_API_BASE_URL}/payment-request-uri/zcash-price-feed`,
        payment.amount,
        currency,
      );

      if (!res.ok) {
        throw new Error("PriceConversion: Price conversion failed!");
      }

      const { data } = await res.json();

      if (!data.amount) {
        throw new Error("PriceConversion: Invalid price data");
      }

      const qrRes = await resolveQRCode(
        `${WIDGET_API_BASE_URL}/payment-request-uri/qrcode`,
        payment.address,
        data.amount,
        payment.label,
      );

      const qrData = await qrRes.json();

      setPriceFeedDataSource({
        rate: data.rate,
        source: data.source,
      });

      setGeneratedConfig({
        theme,
        qrData: qrData.data,
        amount: data.amount,
        label: payment.label,
        address: payment.address,
        disabled: data.amount < 0,
        apiBase: WIDGET_API_BASE_URL,
        validation: payment.validation,
        target: "#payment-request-container",
      });
    } catch (err) {
      console.error("handleSubmit::error:", err);
      alert("Failed to generate. Check inputs or API connection.");
    } finally {
      setLoading(false);
    }
  };

  const isValid = payment.validation.status === "valid";
  const isShielded =
    payment.address.startsWith("zs") ||
    payment.address.startsWith("u1") ||
    payment.address.startsWith("utest1");

  useEffect(() => {
    if (!payment.address) return;

    setIsValidating(true);

    const timer = setTimeout(() => {
      const result = validateAddr(payment.address);

      setPayment((p) => ({
        ...p,
        validation: result,
      }));

      setIsValidating(false);
    }, 300); // debounce delay

    return () => clearTimeout(timer);
  }, [payment.address, validateAddr]);

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-6">
          <div className="rounded space-y-2 border-b border-zinc-100 dark:border-[#1e2d3d]">
            {/* Address */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex justify-between">
                <label className={LABEL_CLASS}>Recipient Address:</label>
                {payment.validation.status === "valid" && (
                  <span className={LABEL_CLASS}>
                    {payment.validation.network === "mainnet"
                      ? "🟢 Mainnet"
                      : "🟡 Testnet"}{" "}
                    · {payment.validation.addressType}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={payment.address}
                onChange={(e) => {
                  setPayment((p) => ({
                    ...p,
                    address: e.target.value,
                  }));
                }}
                placeholder="t1..., zs1..., u1..., utest..., or tm... address"
                className={INPUT_CLASS}
              />
              {payment.validation.status === "valid" && payment.address && (
                <p className="mt-1.5 ml-1 text-[11px] font-mono text-[#5a6a7e]">
                  {isShielded
                    ? "✦ Shielded tx"
                    : payment.address.startsWith("t")
                      ? "◇ Transparent tx"
                      : ""}
                </p>
              )}

              {payment.validation.status === "invalid" && (
                <div className="mt-2 rounded-xl bg-red-500/5 border border-red-500/15 px-4 py-3">
                  <p className="text-[13px] text-red-400 font-medium">
                    {payment.validation.error}
                  </p>
                </div>
              )}

              {isValidating && (
                <div className="mt-1.5 rounded-xl bg-red-500/5 border border-red-500/15 px-4 py-3">
                  <p className="text-[13px] text-red-500 font-medium">
                    Validating…
                  </p>
                </div>
              )}
            </div>

            {/* Label & Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>Label</label>
                <input
                  disabled={!isValid}
                  type="text"
                  value={payment.label}
                  onChange={(e) => {
                    setPayment((p) => ({
                      ...p,
                      label: e.target.value,
                    }));
                  }}
                  placeholder="Payment objective"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Theme</label>
                <select
                  value={theme}
                  disabled={loading || payment.label === ""}
                  onChange={(e) => setTheme(e.target.value)}
                  className={`${INPUT_CLASS} disabled:text-slate-600`}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            {/* Amount and Currency Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>Amount </label>
                <input
                  disabled={!isValid}
                  type="number"
                  value={payment.amount}
                  onChange={(e) => {
                    setPayment((p) => ({
                      ...p,
                      amount: e.target.value,
                    }));
                  }}
                  placeholder="0.00"
                  className={INPUT_CLASS}
                  step="any"
                  min="0"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Currency</label>
                <select
                  value={currency}
                  disabled={loading || parseFloat(currency) < 0 || !allValid}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={`${INPUT_CLASS} disabled:text-slate-600`}
                >
                  <option value="usd">USD</option>
                  <option value="zec">ZEC</option>
                </select>
              </div>
            </div>
          </div>

          <button
            disabled={loading || !allValid}
            className={`w-full py-3.5 px-6 text-black rounded-xl font-semibold text-widget-dark-bg bg-linear-to-r from-[#F4B728] to-[#d9a520] shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Button"
            )}
          </button>

          <div className="text-slate-400 text-xs min-h-4">
            {priceFeedDataSource.source
              ? `Source: ${priceFeedDataSource.source} - ZEC/USD: $${parseFloat(priceFeedDataSource.rate).toFixed(2)}`
              : ""}
          </div>

          <WasmInitStatus wasmReady={wasmReady} />
        </div>
      </form>

      {!generatedConfig.disabled && (
        <>
          {/* Generator Section */}
          <div className="my-8">
            <WidgetButtonTrigger config={generatedConfig} />
          </div>
        </>
      )}
    </>
  );
}

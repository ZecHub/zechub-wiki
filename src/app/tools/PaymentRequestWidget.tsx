"use client";

import { useCallback, useState } from "react";
import { config } from "./config";
import { detectZcashNetwork, type ZcashNetwork } from "./helper";
import { useWasm } from "./hooks/useWasm";
import { GeneratedConfig } from "./ToolTabs";
import WasmInitStatus from "./WasmInitStatus";

const INPUT_CLASS = [
  "w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]",
  "focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15",
  "rounded-xl px-4 py-3.5 text-[15px] font-medium outline-none transition-all duration-200",
  "text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-[#2d3e50]",
].join(" ");

const LABEL_CLASS =
  "block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1";

const WIDGET_API_BASE_URL = config.env.NEXT_PUBLIC_WIDGET_API_BASE_URL;

type TValidationState = {
  status: "idle" | "validating" | "valid" | "invalid";
  error?: string;
  addressType?: string;
  network?: ZcashNetwork;
};

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
  // message: string;
  // memo: string;
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

interface Props {
  onGenerated: (config: GeneratedConfig) => void;
}

export default function PaymentRequestWidget(props: Props) {
  const [amount, setAmount] = useState("");
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [priceDataSource, setPriceDataSource] = useState("");
  const { wasmError, wasmMmoduleRef, wasmReady } = useWasm();

  const [validation, setValidation] = useState<TValidationState>({
    status: "idle",
    addressType: "",
    error: "",
    network: undefined,
  });

  const [payment, setPayment] = useState<Payment>({
    address: "",
    amount: "",
    label: "",
    // message: "",
    // memo: "",
    validation: {
      status: "idle",
    },
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
  const isLoading = validation.status === "validating";

  const allValid =
    payment.address !== "" &&
    parseFloat(payment.amount) > 0 &&
    payment.validation.status === "valid";

  // const uri = useMemo(() => {
  //   if (!allValid) return null;

  //   const parts: string[] = [];

  //   payments.forEach((p, i) => {
  //     const idx = i === 0 ? "" : `.${i}`;

  //     parts.push(`address${idx}=${p.address}`);
  //     if (p.amount) parts.push(`amount${idx}=${p.amount}`);
  //     if (p.label) parts.push(`label${idx}=${encodeURIComponent(p.label)}`);
  //     if (p.message)
  //       parts.push(`message${idx}=${encodeURIComponent(p.message)}`);

  //     const isShielded =
  //       p.address.startsWith("zs") ||
  //       p.address.startsWith("u1") ||
  //       p.address.startsWith("utest1");

  //     if (p.memo && isShielded) {
  //       const m = encodeMemo(p.memo);

  //       if (m) parts.push(`memo${idx}=${m}`);
  //     }
  //   });

  //   return `zcash:?${parts.join("&")}`;
  // }, [payment, allValid]);

  // const deferredURI = useDeferredValue(uri);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setPriceDataSource("");

      const res =
        process.env.NODE_ENV === "development"
          ? { json: () => ({ amount: 350, source: "diadata.org" }), ok: true }
          : await fetch(
              `${WIDGET_API_BASE_URL}/payment-request-qrcode/zcash-price-feed`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  amount: parseFloat(payment.amount),
                  from: currency,
                  to: "zec",
                }),
              },
            );

      if (!res.ok) {
        throw new Error("PriceConversion: Price conversion failed!");
      }

      const data = await res.json();

      if (!data.amount) {
        throw new Error("PriceConversion: Invalid price data");
      }

      setPriceDataSource(data.source);

      const qrRes = await fetch(`${WIDGET_API_BASE_URL}/qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: payment.address,
          amount: data.amount,
          label: payment.label,
        }),
      });

      props.onGenerated({
        address: payment.address,
        label: payment.label,
        qrData: await qrRes.json(),
        theme,
        amount: data.amount,
        apiBase: WIDGET_API_BASE_URL,
        target: "#payment-request-container",
        disabled: data.amount < 0,
        validation: payment.validation,
      });
    } catch (err) {
      console.error(err);
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

  return (
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
                const validationResult = validateAddr(e.target.value);

                setPayment((p) => ({
                  ...p,
                  address: e.target.value,
                  validation: validationResult,
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

            {validation.status === "invalid" && (
              <div className="mt-2 rounded-xl bg-red-500/5 border border-red-500/15 px-4 py-3">
                <p className="text-[13px] text-red-400 font-medium">
                  {validation.error}
                </p>
              </div>
            )}

            {isLoading && (
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
                disabled={loading || !allValid}
                onChange={(e) => setTheme(e.target.value)}
                className={INPUT_CLASS}
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
                disabled={loading || !allValid}
                onChange={(e) => setCurrency(e.target.value)}
                className={INPUT_CLASS}
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



        <WasmInitStatus wasmReady={wasmReady} />
      </div>
    </form>
  );
}

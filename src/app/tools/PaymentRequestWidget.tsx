"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { config } from "./config";
import { detectZcashNetwork, encodeMemo, type ZcashNetwork } from "./helper";
import { useWasm } from "./hooks/useWasm";
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

type GeneratedConfig = {
  qrData?: unknown;
  apiBase: string;
  theme: string;
  target: string;
  disabled: boolean;
} & Payment;

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
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [priceDataSource, setPriceDataSource] = useState("");
  const { wasmError, wasmMmoduleRef, wasmReady } = useWasm();
  const [validation, setValidation] = useState<ValidationState>({
    status: "idle",
  });
  const [payment, setPayment] = useState<Payment>({
    address: "",
    amount: "",
    label: "",
    // message: "",
    // memo: "",
    validation: { status: "idle" },
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

  // debounce validation per row
  useEffect(() => {
    if (!wasmReady) return;

    const addresses = payments.map((p) => p.address.trim());

    const timers = addresses.map((addr, i) =>
      setTimeout(() => {
        setPayments((prev) => {
          if (prev[i].address.trim() !== addr) return prev;

          const next = [...prev];
          const nextValidation = validateAddr(addr);

          if (
            JSON.stringify(next[i].validation) ===
            JSON.stringify(nextValidation)
          ) {
            return prev;
          }

          next[i] = {
            ...next[i],
            validation: nextValidation,
          };

          return next;
        });
      }, 200),
    );

    return () => timers.forEach(clearTimeout);
  }, [payment, wasmReady, validateAddr]);

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

  const updatePayment = (i: number, field: keyof Payment, value: string) => {
    setPayments((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const addPayment = () => {
    setPayments((p) => {
      const next = [
        ...p,
        {
          address: "",
          amount: "",
          label: "",
          message: "",
          memo: "",
          validation: { status: "idle" },
        },
      ];

      const newIndex = next.length - 1;
      setActiveIndex(newIndex);

      // smoother UX: slight delay ensures DOM is ready before scroll
      setTimeout(() => {
        const el = itemRefs.current[newIndex];
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);

      return next as any;
    });
  };

  const removePayment = (i: number) => {
    setPayments((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      // set active to last item (or 0 if empty safety)
      const newIndex = next.length > 0 ? next.length - 1 : 0;
      setActiveIndex(newIndex);

      return next;
    });
  };


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
        body: JSON.stringify({ address: payment.address, amount: data.amount, label:payment.label }),
      });

      const qrData = await qrRes.json();

      props.onGenerated({
        address: payment.address,
        label: payment.label,
        qrData,
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

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-6">
        {payments.map((p, i) => {
          // ensure refs array length
          if (!itemRefs.current[i]) itemRefs.current[i] = null as any;
          const isActive = i === activeIndex;
          const v = p.validation;

          const isValid = p.validation.status === "valid";
          const isShielded =
            p.address.startsWith("zs") ||
            p.address.startsWith("u1") ||
            p.address.startsWith("utest1");

          return (
            <div
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="rounded space-y-2 border-b border-zinc-100 dark:border-[#1e2d3d]"
            >
              {payments.length > 1 && (
                <div
                  onClick={() => setActiveIndex(i)}
                  className="flex justify-between items-center cursor-pointer dark:bg-slate-600 p-2.5 mb-4"
                >
                  <div
                    className={`text-xs font-mono block text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-slate-400`}
                  >
                    {p.address
                      ? `${p.address.slice(0, 12)}...`
                      : `Recipient ${i + 1}`}
                  </div>

                  <div className="text-xs">
                    {v.status === "valid" && "✓"}
                    {v.status === "invalid" && "⚠"}
                    {v.status === "validating" && "..."}
                  </div>
                </div>
              )}

              {isActive && (
                <>
                  {/* Address */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isActive ? "max-h-175 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="flex justify-between">
                      <label className={LABEL_CLASS}>Recipient Address:</label>
                      {p.validation.status === "valid" && (
                        <span className={LABEL_CLASS}>
                          {p.validation.network === "mainnet"
                            ? "🟢 Mainnet"
                            : "🟡 Testnet"}{" "}
                          · {p.validation.addressType}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={p.address}
                      onChange={(e) =>
                        updatePayment(i, "address", e.target.value)
                      }
                      placeholder="t1..., zs1..., u1..., utest..., or tm... address"
                      className={INPUT_CLASS}
                    />
                    {p.validation.status === "valid" && p.address && (
                      <p className="mt-1.5 ml-1 text-[11px] font-mono text-[#5a6a7e]">
                        {isShielded
                          ? "✦ Shielded — encrypted memo enabled"
                          : p.address.startsWith("t")
                            ? "◇ Transparent address"
                            : ""}
                      </p>
                    )}

                    {p.validation.status === "invalid" && (
                      <div className="mt-2 rounded-xl bg-red-500/5 border border-red-500/15 px-4 py-3">
                        <p className="text-[13px] text-red-400 font-medium">
                          {p.validation.error}
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

                  {/* Label */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isActive ? "max-h-175 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <label className={LABEL_CLASS}>Label</label>
                    <input
                      disabled={!isValid}
                      type="text"
                      value={p.label}
                      onChange={(e) =>
                        updatePayment(i, "label", e.target.value)
                      }
                      placeholder="Recipient name"
                      className={INPUT_CLASS}
                    />
                  </div>

                  {/* Amount and Currency Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL_CLASS}>Amount </label>
                      <input
                        disabled={!isValid}
                        type="number"
                        value={p.amount}
                        onChange={(e) =>
                          updatePayment(i, "amount", e.target.value)
                        }
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
                        onChange={(e) => setCurrency(e.target.value)}
                        className={INPUT_CLASS}
                      >
                        <option value="usd">USD</option>
                        <option value="zec">ZEC</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={LABEL_CLASS}>Message (public note)</label>
                    <input
                      disabled={!isValid}
                      type="text"
                      value={p.message}
                      onChange={(e) =>
                        updatePayment(i, "message", e.target.value)
                      }
                      placeholder="What's this payment for?"
                      className={INPUT_CLASS}
                    />
                  </div>

                  {/* Memo — shielded only */}
                  {isShielded && (
                    <div>
                      <label className={LABEL_CLASS}>Encrypted Memo</label>
                      <textarea
                        disabled={!isValid}
                        value={p.memo}
                        onChange={(e) =>
                          updatePayment(i, "memo", e.target.value)
                        }
                        placeholder="Private memo — only the recipient reads this"
                        rows={3}
                        className={`${INPUT_CLASS} resize-y font-mono text-sm min-h-[72px]`}
                      />
                      <p className="mt-1 ml-1 text-[10px] font-mono text-[#3d4e60]">
                        Encoded as base64url per ZIP-321
                      </p>
                    </div>
                  )}

                  {payments.length > 1 && (
                    <div className="my-4">
                      <button
                        onClick={() => removePayment(i)}
                        className="text-red-500 text-xs cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        <div>
          {/* Add multiple recipients */}
          <button
            onClick={addPayment}
            className="text-sm underline cursor-pointer"
          >
            + Add recipient
          </button>
        </div>

        <button
          disabled={!allValid}
          className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-[0.98] ${
            uri
              ? "bg-gradient-to-r from-[#F4B728] to-[#d9a520] text-[#151e29] hover:shadow-lg hover:shadow-[#F4B728]/15 hover:-translate-y-0.5 cursor-pointer"
              : "bg-zinc-100 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040] text-zinc-400 dark:text-[#3d4e60] cursor-not-allowed"
          }`}
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

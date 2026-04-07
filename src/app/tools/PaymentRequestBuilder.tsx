"use client";

import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWasm } from "./hooks/useWasm";
import WasmInitStatus from "./WasmInitStatus";
import { detectZcashNetwork, type ZcashNetwork } from "./helper";

function QRCode({ value, size = 176 }: { value: string; size?: number }) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor="#ffffff"
      fgColor="#151e29"
      level="M"
    />
  );
}
const INPUT_CLASS = [
  "w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]",
  "focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15",
  "rounded-xl px-4 py-3.5 text-[15px] font-medium outline-none transition-all duration-200",
  "text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-[#2d3e50]",
].join(" ");

const LABEL_CLASS =
  "block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1";

// State type
type ValidationState =
  | { status: "idle" }
  | { status: "validating" }
  | { status: "valid"; addressType?: string; network: ZcashNetwork }
  | { status: "invalid"; error: string };

export default function PaymentRequestBuilder() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [message, setMessage] = useState("");
  const [label, setLabel] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const { wasmError, wasmMmoduleRef, wasmReady } = useWasm();

  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    status: "idle",
  });

  /* ── Validate when input changes ── */
  const validateAddr = useCallback(
    (addr: string) => {
      addr = addr.trim();

      if (!addr || !wasmMmoduleRef.current) {
        setValidation({ status: "idle" });

        return;
      }

      setValidation({ status: "validating" });

      setLoading(true);
      try {
        const mod = wasmMmoduleRef.current;

        const validateAddress =
          mod.isZcashAddressValid ?? mod.is_valid_zcash_address;
        const typeFn = mod.getZcashAddressType ?? mod.get_zcash_address_type;

        if (!validateAddress) {
          setValidation({
            status: "invalid",
            error: "WASM validation functions missing",
          });

          return;
        }

        if (!validateAddress(addr)) {
          setValidation({
            status: "invalid",
            error: "Not a valid Zcash address",
          });

          return;
        }

        const addressType = typeFn ? typeFn(addr) : undefined;
        const network = detectZcashNetwork(addr);

        setValidation({ status: "valid", addressType, network });
      } catch (err: unknown) {
        setValidation({
          status: "invalid",
          error: err instanceof Error ? err.message : "Validation failed",
        });
      } finally {
        setLoading(false);
      }
    },
    [wasmMmoduleRef],
  );

  useEffect(() => {
    if (!wasmReady) return;
    const currentAddress = address.trim();

    const t = setTimeout(() => {
      validateAddr(currentAddress);
    }, 200);

    return () => clearTimeout(t);
  }, [validateAddr, wasmReady, address]);

  // Flags
  const isValid = validation.status === "valid";
  const isInvalid = validation.status === "invalid";
  const isLoading = validation.status === "validating";

  const isShielded = address.startsWith("zs") || address.startsWith("u1");

  const uri = useMemo(() => {
    if (!isValid) return null;

    const parts: string[] = [];

    if (amount) parts.push(`amount=${amount}`);
    if (label) parts.push(`label=${encodeURIComponent(label)}`);
    if (message) parts.push(`message=${encodeURIComponent(message)}`);

    if (memo && isShielded) {
      try {
        const b64 = btoa(unescape(encodeURIComponent(memo)));
        parts.push(
          `memo=${b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}`,
        );
      } catch {
        // invalid memo, skip
      }
    }
    return `zcash:${address}${parts.length ? "?" + parts.join("&") : ""}`;
  }, [isValid, isShielded, address, amount, memo, message, label]);

  useEffect(() => {
    setShowQR(false);

    if (!uri) return;

    const t = setTimeout(() => setShowQR(true), 100);
    return () => clearTimeout(t);
  }, [uri]);

  const copyURI = () => {
    if (!uri) return;

    navigator.clipboard.writeText(uri).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Address */}
      <div>
        <div className="flex justify-between">
          <label className={LABEL_CLASS}>Recipient Address:</label>
          {validation.status === "valid" && (
            <span className={LABEL_CLASS}>
              {validation.network === "mainnet" ? "🟢 Mainnet" : "🟡 Testnet"} ·{" "}
              {validation.addressType}
            </span>
          )}
        </div>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="t1..., zs1..., u1..., utest..., or tm... address"
          className={INPUT_CLASS}
        />
        {address && (
          <p className="mt-1.5 ml-1 text-[11px] font-mono text-[#5a6a7e]">
            {isShielded
              ? "✦ Shielded — encrypted memo enabled"
              : address.startsWith("t")
                ? "◇ Transparent address"
                : ""}
          </p>
        )}

        {isInvalid && (
          <div className="mt-2 rounded-xl bg-red-500/5 border border-red-500/15 px-4 py-3">
            <p className="text-[13px] text-red-400 font-medium">
              {validation.error}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="mt-1.5 rounded-xl bg-red-500/5 border border-red-500/15 px-4 py-3">
            <p className="text-[13px] text-red-500 font-medium">Validating…</p>
          </div>
        )}
      </div>

      {/* Amount + Label */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLASS}>Amount (ZEC)</label>
          <input
            disabled={!isValid}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={INPUT_CLASS}
            step="any"
            min="0"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Label</label>
          <input
            disabled={!isValid}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Recipient name"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className={LABEL_CLASS}>Message (public note)</label>
        <input
          disabled={!isValid}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Private memo — only the recipient reads this"
            rows={3}
            className={`${INPUT_CLASS} resize-y font-mono text-sm min-h-[72px]`}
          />
          <p className="mt-1 ml-1 text-[10px] font-mono text-[#3d4e60]">
            Encoded as base64url per ZIP-321
          </p>
        </div>
      )}

      {/* Generated URI */}
      <div>
        <label className={LABEL_CLASS}>Generated URI</label>
        <div
          className={`relative rounded-xl px-4 py-3.5 font-mono text-[13px] leading-relaxed break-all min-h-[48px] transition-all duration-300 ${
            uri
              ? "bg-[#F4B728]/5 border border-[#F4B728]/20 text-[#F4B728]"
              : "border border-dashed border-zinc-200 dark:border-[#243040] text-zinc-400 dark:text-[#3d4e60]"
          }`}
        >
          {uri || "Enter an address to generate a payment URI..."}
          {uri && (
            <span className="absolute top-2.5 right-3 text-[9px] font-bold uppercase tracking-wider bg-[#F4B728]/15 text-[#F4B728] px-2 py-0.5 rounded">
              ZIP-321
            </span>
          )}
        </div>
      </div>

      {/* QR */}
      {isValid && uri && (
        <div className="flex justify-center pt-1">
          <div className="p-4 bg-white rounded-2xl shadow-xl shadow-black/10 dark:shadow-[#F4B728]/5 border border-zinc-100 dark:border-[#243040]">
            <QRCode value={uri} />
          </div>
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={copyURI}
        disabled={!isValid}
        className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-[0.98] ${
          uri
            ? "bg-gradient-to-r from-[#F4B728] to-[#d9a520] text-[#151e29] hover:shadow-lg hover:shadow-[#F4B728]/15 hover:-translate-y-0.5 cursor-pointer"
            : "bg-zinc-100 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040] text-zinc-400 dark:text-[#3d4e60] cursor-not-allowed"
        }`}
      >
        {copied
          ? "✓ Copied to clipboard!"
          : uri
            ? "Copy Payment URI"
            : "Enter an address to continue"}
      </button>

      <WasmInitStatus wasmReady={wasmReady} />
    </div>
  );
}

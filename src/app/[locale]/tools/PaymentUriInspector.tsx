"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CircleCheck, CircleX, Copy, ImageUp } from "lucide-react";
import {
  formatZatoshis,
  inspectZip321Uri,
  type Zip321AddressKind,
  type Zip321InspectedPayment,
  type Zip321Issue,
} from "@/lib/zip321Inspect";
import { useWasm, type ZaddrModuleAny } from "./hooks/useWasm";
import WasmInitStatus from "./WasmInitStatus";

const INPUT_CLASS = [
  "w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]",
  "focus:border-brand focus:ring-2 focus:ring-brand/15",
  "rounded-xl px-4 py-3.5 text-[14px] font-mono outline-none transition-all duration-200 break-all",
  "text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-[#2d3e50]",
].join(" ");

const LABEL_CLASS =
  "block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1";

const CARD_CLASS =
  "rounded-xl border border-zinc-200 dark:border-[#243040] bg-zinc-50 dark:bg-[#0f1720] px-4 py-4";

const KIND_LABEL: Record<Zip321AddressKind, string> = {
  transparent: "Transparent",
  tex: "TEX (transparent-source only)",
  sapling: "Sapling (shielded)",
  unified: "Unified Address",
  sprout: "Sprout (not allowed)",
  unknown: "Unrecognised",
};

// The examples from ZIP 321 itself, so every result here can be checked
// against the spec text.
const EXAMPLES: { name: string; uri: string }[] = [
  {
    name: "Single payment",
    uri: "zcash:ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez?amount=1&memo=VGhpcyBpcyBhIHNpbXBsZSBtZW1vLg&message=Thank%20you%20for%20your%20purchase",
  },
  {
    name: "Two recipients",
    uri: "zcash:?address=tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU&amount=123.456&address.1=ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez&amount.1=0.789&memo.1=VGhpcyBpcyBhIHVuaWNvZGUgbWVtbyDinKjwn6aE8J-PhvCfjok",
  },
  {
    name: "Broken",
    uri: "zcash:?address=tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU&amount=1,5&memo=SGk=&amount.1=2&address.01=ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez",
  },
];

/** Shape of the browser's built-in BarcodeDetector (Chrome, Edge, Android). */
type BarcodeDetectorCtor = new (options: { formats: string[] }) => {
  detect(source: ImageBitmapSource): Promise<{ rawValue: string }[]>;
};

function getBarcodeDetector(): BarcodeDetectorCtor | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector ?? null;
}

type AddressCheck = { valid: boolean; orchard?: boolean } | undefined;

function checkAddress(mod: ZaddrModuleAny | null, address: string): AddressCheck {
  if (!mod) return undefined;
  const isValid = mod.isZcashAddressValid ?? mod.is_valid_zcash_address;
  const receivers = mod.getAddressReceivers ?? mod.get_address_receivers;
  if (!isValid) return undefined;
  try {
    if (!isValid(address)) return { valid: false };
    if (!address.startsWith("u")) return { valid: true };
    return { valid: true, orchard: receivers ? Boolean(receivers(address)?.orchard) : undefined };
  } catch {
    return { valid: false };
  }
}

export default function PaymentUriInspector() {
  const searchParams = useSearchParams();
  // `?tool=uri-inspector&uri=zcash:...` opens with a URI already filled in.
  const [input, setInput] = useState(() => searchParams?.get("uri") ?? "");
  const [copied, setCopied] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [canScan, setCanScan] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { wasmReady, wasmMmoduleRef } = useWasm();

  useEffect(() => setCanScan(getBarcodeDetector() !== null), []);

  const inspection = useMemo(() => (input.trim() ? inspectZip321Uri(input) : null), [input]);

  // Checksums need the address WASM module; the grammar checks above do not.
  const addressChecks = useMemo(() => {
    const checks = new Map<number, AddressCheck>();
    if (!inspection || !wasmReady) return checks;
    for (const p of inspection.payments) {
      if (p.address) checks.set(p.index, checkAddress(wasmMmoduleRef.current, p.address));
    }
    return checks;
  }, [inspection, wasmReady, wasmMmoduleRef]);

  const issues: Zip321Issue[] = useMemo(() => {
    if (!inspection) return [];
    const extra: Zip321Issue[] = [];
    for (const p of inspection.payments) {
      const check = addressChecks.get(p.index);
      if (check && !check.valid && p.addressKind !== "unknown") {
        extra.push({ level: "error", index: p.index, message: "The address fails its checksum; it is mistyped or corrupted." });
      }
      if (p.asset && check?.valid && check.orchard === false) {
        extra.push({ level: "error", index: p.index, message: "This Unified Address has no Orchard receiver, so it cannot receive a custom asset." });
      }
    }
    return [...inspection.issues, ...extra];
  }, [inspection, addressChecks]);

  const errorCount = issues.filter((i) => i.level === "error").length;
  const warningCount = issues.length - errorCount;
  const general = issues.filter((i) => i.index === undefined);

  async function scanImage(file: File) {
    setScanError(null);
    const Detector = getBarcodeDetector();
    if (!Detector) return;
    try {
      const bitmap = await createImageBitmap(file);
      const codes = await new Detector({ formats: ["qr_code"] }).detect(bitmap);
      bitmap.close();
      const value = codes.find((c) => /^zcash:/i.test(c.rawValue))?.rawValue ?? codes[0]?.rawValue;
      if (!value) setScanError("No QR code found in that image.");
      else setInput(value);
    } catch {
      setScanError("Could not read that image.");
    }
  }

  async function copyCanonical() {
    if (!inspection?.canonical) return;
    try {
      await navigator.clipboard.writeText(inspection.canonical);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-brand/5 border border-brand/10 px-4 py-3 text-sm text-zinc-500 dark:text-[#7a8a9e]">
        Paste a <code className="font-mono text-[13px]">zcash:</code> payment link, or read one from a QR image, to see
        exactly what it asks a wallet to send before you pay. Everything runs in your browser; nothing is sent anywhere.
      </div>

      <div>
        <div className="flex items-end justify-between gap-3">
          <label htmlFor="zip321-uri" className={LABEL_CLASS}>
            Payment URI
          </label>
          <WasmInitStatus wasmReady={wasmReady} label="Address checks ready" />
        </div>
        <textarea
          id="zip321-uri"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          spellCheck={false}
          autoComplete="off"
          placeholder="zcash:u1...?amount=0.5&memo=..."
          className={INPUT_CLASS}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-400 dark:text-[#5a6a7e]">Examples:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.name}
              type="button"
              onClick={() => setInput(ex.uri)}
              className="rounded-md border border-zinc-200 dark:border-[#243040] px-2 py-1 font-medium text-zinc-600 hover:border-brand hover:text-brand dark:text-[#9aa8b8]"
            >
              {ex.name}
            </button>
          ))}
          {canScan && (
            <>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="ml-auto inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-[#243040] px-2 py-1 font-medium text-zinc-600 hover:border-brand hover:text-brand dark:text-[#9aa8b8]"
              >
                <ImageUp aria-hidden="true" className="h-3.5 w-3.5" /> Read QR image
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void scanImage(file);
                  e.target.value = "";
                }}
              />
            </>
          )}
        </div>
        {scanError && <p className="mt-2 text-sm text-red-400">{scanError}</p>}
      </div>

      {inspection && (
        <div aria-live="polite" className="space-y-4">
          <StatusBanner
            errors={errorCount}
            warnings={warningCount}
            payments={inspection.payments.length}
            network={inspection.network}
            total={inspection.totalZatoshis}
          />

          {general.length > 0 && <IssueList issues={general} />}

          {inspection.payments.map((p) => (
            <PaymentCard
              key={p.index}
              payment={p}
              check={addressChecks.get(p.index)}
              issues={issues.filter((i) => i.index === p.index)}
              multi={inspection.payments.length > 1}
            />
          ))}

          {inspection.canonical && errorCount === 0 && (
            <div className={CARD_CLASS}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className={LABEL_CLASS.replace(" mb-1.5", "")}>As the Payment Request builder writes it</span>
                <button
                  type="button"
                  onClick={copyCanonical}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                >
                  <Copy aria-hidden="true" className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="m-0 break-all font-mono text-[12px] text-zinc-600 dark:text-[#9aa8b8]">{inspection.canonical}</p>
              <p className="mb-0 mt-2 text-xs text-zinc-400 dark:text-[#5a6a7e]">
                {inspection.canonical === input.trim()
                  ? "Identical to the URI above."
                  : "Same payments in the builder's form; differences are only in order, number formatting or index numbers."}
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-zinc-400 dark:text-[#5a6a7e]">
        Checks follow{" "}
        <a href="https://zips.z.cash/zip-0321" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">
          ZIP 321
        </a>
        : grammar, indexes, amounts, base64url memos (512 bytes), memo-capable addresses, req- parameters and networks.
        Address checksums use the same decoder as the Address Decoder tab.
      </p>
    </div>
  );
}

function StatusBanner({
  errors,
  warnings,
  payments,
  network,
  total,
}: {
  errors: number;
  warnings: number;
  payments: number;
  network: string;
  total?: bigint;
}) {
  const ok = errors === 0;
  const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? "" : "s"}`;
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        ok
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
      }`}
    >
      {ok ? <CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /> : <CircleX aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>
        <strong data-testid="zip321-status">{ok ? "Valid ZIP 321 request" : `Invalid: ${plural(errors, "problem")}`}</strong>
        {warnings > 0 && `, ${plural(warnings, "warning")}`}
        <span className="block text-xs opacity-80">
          {plural(payments, "payment")}
          {network !== "unknown" && ` · ${network}`}
          {total !== undefined && ` · total ${formatZatoshis(total)} ZEC`}
        </span>
      </span>
    </div>
  );
}

function IssueList({ issues }: { issues: Zip321Issue[] }) {
  return (
    <ul className="m-0 list-none space-y-1.5 p-0 text-sm">
      {issues.map((issue, i) => (
        <li key={i} className="flex items-start gap-2">
          {issue.level === "error" ? (
            <CircleX aria-label="Error" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
          ) : (
            <AlertTriangle aria-label="Warning" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
          )}
          <span className="leading-relaxed text-zinc-700 dark:text-[#c5d0dc]">
            {issue.param && <code className="mr-1 font-mono text-[12px] text-zinc-500">{issue.param}</code>}
            {issue.message}
          </span>
        </li>
      ))}
    </ul>
  );
}

function PaymentCard({
  payment: p,
  check,
  issues,
  multi,
}: {
  payment: Zip321InspectedPayment;
  check: AddressCheck;
  issues: Zip321Issue[];
  multi: boolean;
}) {
  const rows: [string, ReactNode][] = [];
  if (p.address) {
    rows.push([
      "Address",
      <span key="a">
        <span className="break-all font-mono text-[12px]">{p.address}</span>
        <span className="block text-xs text-zinc-400 dark:text-[#5a6a7e]">
          {KIND_LABEL[p.addressKind]}
          {p.network !== "unknown" && ` · ${p.network}`}
          {check?.valid === true && " · checksum OK"}
          {check?.orchard !== undefined && (check.orchard ? " · has Orchard receiver" : " · no Orchard receiver")}
        </span>
      </span>,
    ]);
  }
  if (p.amount !== undefined) {
    rows.push(["Amount", `${p.amount} ZEC (${p.zatoshis?.toLocaleString("en-US")} zatoshis)`]);
  } else if (issues.some((i) => i.param?.startsWith("amount"))) {
    rows.push(["Amount", <span key="n" className="text-red-400">Invalid, see below</span>]);
  } else if (!p.asset) {
    rows.push(["Amount", <span key="n" className="text-zinc-400">Not set: the wallet will ask the payer</span>]);
  }
  if (p.asset) {
    rows.push([
      "Custom asset",
      <span key="as">
        {p.asset.units !== undefined ? `${p.asset.units} minimal units` : `encoding version ${p.asset.version}`}
        {p.asset.assetIdHex && (
          <span className="block break-all font-mono text-[11px] text-zinc-400">asset id {p.asset.assetIdHex}</span>
        )}
      </span>,
    ]);
  }
  if (p.label !== undefined) rows.push(["Label", p.label || "(empty)"]);
  if (p.message !== undefined) rows.push(["Message", p.message || "(empty)"]);
  if (p.memo) {
    rows.push([
      "Memo",
      <span key="m">
        {p.memo.text !== undefined ? (
          <span className="whitespace-pre-wrap break-words">{p.memo.text || "(empty)"}</span>
        ) : (
          <span className="break-all font-mono text-[12px]">{p.memo.hex}</span>
        )}
        <span className="block text-xs text-zinc-400 dark:text-[#5a6a7e]">
          {p.memo.bytes} / 512 bytes{p.memo.text === undefined && " · binary, not text"}
        </span>
      </span>,
    ]);
  }
  for (const o of p.other) rows.push([o.name, o.value ?? "(no value)"]);

  return (
    <div className={CARD_CLASS} data-testid="zip321-payment">
      {multi && (
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-brand dark:text-brand-soft">
          Payment {p.index === 0 ? "(no index)" : `.${p.index}`}
        </div>
      )}
      <dl className="m-0 grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-zinc-400 dark:text-[#5a6a7e]">{k}</dt>
            <dd className="m-0 min-w-0 text-zinc-800 dark:text-[#c5d0dc]">{v}</dd>
          </div>
        ))}
      </dl>
      {issues.length > 0 && (
        <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-[#243040]">
          <IssueList issues={issues} />
        </div>
      )}
    </div>
  );
}

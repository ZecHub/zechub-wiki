"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// Grid that holds address specimen cards.
export function AddressGrid(props: Record<string, unknown> & { children?: React.ReactNode }) {
  return <div className="not-prose clear-both my-6 grid gap-4 grid-cols-1 imd:grid-cols-2">{props.children}</div>;
}

// One example address: generated QR code, type label, prefix and length badges, copyable address.
export function AddressSpecimen(props: Record<string, unknown>) {
  const address = String(props.address ?? "");
  const label = String(props.label ?? "");
  const length = String(props.length ?? address.length);
  const prefix = String(props.prefix ?? address.slice(0, address.startsWith("u1") || address.startsWith("zs") ? 2 : 2));
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03] min-[480px]:flex-row min-[480px]:items-start">
      <div className="shrink-0 self-start rounded-lg bg-white p-2 ring-1 ring-slate-200 dark:ring-white/10">
        <QRCodeSVG value={address} size={104} level="L" aria-label={`QR code for the ${label} example address`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-base font-semibold leading-tight text-slate-900 dark:text-white">{label}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 font-medium text-brand dark:text-brand-soft">
            Starts with {prefix}
          </span>
          <span className="rounded-md border border-slate-200 px-2 py-0.5 text-slate-600 dark:border-white/10 dark:text-slate-300">
            {length} characters
          </span>
        </div>
        <div className="mt-3 flex items-start gap-2">
          <code className="line-clamp-3 min-w-0 flex-1 break-all rounded-md bg-slate-100 px-2 py-1.5 !font-mono text-[0.7rem] leading-snug text-slate-700 dark:bg-black/30 dark:text-slate-300" title={address}>
            {address}
          </code>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Address copied" : "Copy address"}
            className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-brand hover:text-brand dark:border-white/10 dark:text-slate-300"
          >
            {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

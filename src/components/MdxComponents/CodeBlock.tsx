"use client";

import { Check, Copy } from "lucide-react";
import React, { HTMLProps, useRef, useState } from "react";

// Code block with a one-click copy button (top-right, always visible on touch, on hover otherwise).
export default function CodeBlock(props: HTMLProps<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text.replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="group relative my-6">
      <pre
        ref={ref}
        className="!my-0 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-5 pr-14 font-mono text-sm leading-relaxed text-slate-800 dark:border-white/10 dark:bg-[#040f1d] dark:text-slate-100 [&_code]:!m-0 [&_code]:!translate-y-0 [&_code]:!border-0 [&_code]:!bg-transparent [&_code]:!p-0"
        {...props}
      />
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        title={copied ? "Copied" : "Copy"}
        className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100 ${
          copied
            ? "border-brand/60 bg-brand/15 text-brand dark:text-brand-soft"
            : "border-slate-300 bg-white/80 text-slate-600 hover:border-brand/60 hover:text-brand dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:text-brand-soft"
        }`}
      >
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

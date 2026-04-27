/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from "react";
import { config } from "./config";
interface Config {
  address: string;
  amount: number;
  label: string;
  apiBase: string;
  theme: string;
  target: string;
  disabled: boolean;
  zecUsdRate: number
}

interface Props {
  config: Config;
}

const API_BASE_URL_EMBED_CODE = config.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE;

export default function PaymentRequestWidgetCodeSnippet({ config }: Props) {
  const [copied, setCopied] = useState(false);

  const disabled = String(config.disabled);

  const snippet = `<script
  src=${API_BASE_URL_EMBED_CODE} 
  data-address="${config.address}"
  data-amount="${config.amount}"
  data-zec-usd-rate="${config.zecUsdRate}"
  data-label="${config.label}"
  data-theme="${config.theme}"
  data-target="${config.target}"
  data-disabled="${disabled}"
  data-api-base="${config.apiBase}"
></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative overflow-hidden shadow-xl">
      {/* Decorative gradient orb */}
      <div className="absolute -top-10 -left-10 w-32 h-32 blur-2xl" />

      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-zcash-gold/20 to-zcash-amber/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <span className="font-medium text-black dark:text-widget-dark-text">
              Embed Code
            </span>
          </div>

          <button
            onClick={handleCopy}
            className={`px-4 py-2 text-black/80 rounded-lg text-sm font-medium transition-all duration-200 ${
              copied
                ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                : "bg-widget-light-bg dark:bg-widget-dark-bg text-widget-light-text dark:text-widget-dark-text border border-widget-light-border dark:border-widget-dark-border hover:border-zcash-gold/50 hover:bg-zcash-gold/5"
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </span>
            )}
          </button>
        </div>

        {/* Code Block */}
        <div className="relative rounded-xl bg-[#1d1d39] dark:bg-[#1d1d39] border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-400 bg-widget-dark-surface/50">
            <span className="ml-2 text-xs text-widget-dark-muted">HTML</span>
          </div>

          <pre className="p-4 overflow-x-auto text-md">
            <code className="text-widget-dark-text font-mono leading-relaxed">
              <span className="text-pink-400">&lt;script</span>
              {"\n"}
              {"  "}
              <span className="text-zcash-gold">src</span>=
              <span className="text-green-400">{API_BASE_URL_EMBED_CODE}</span>
              {"\n"}
              {"  "}
              <span className="text-zcash-gold">data-address</span>=
              <span className="text-green-400">
                "{config.address || "u1abc123xyz..."}"
              </span>
              {"\n"}
              {"  "}
              <span className="text-zcash-gold">data-amount</span>=
              <span className="text-green-400">"{config.amount}"</span>
              {"\n"}
              {"  "}
              <span className="text-zcash-gold">data-zec-usd-rate</span>=
              <span className="text-green-400">"{config.zecUsdRate}"</span>
              {"\n"}
              {"  "}
              <span className="text-zcash-gold">data-label</span>=
              <span className="text-green-400">
                "{config.label || "Pay with Zcash"}"
              </span>
              {"\n"} <span className="text-zcash-gold"> data-theme</span>=
              <span className="text-green-400">"{config.theme}"</span>
              {"\n"} <span className="text-zcash-gold"> data-api-base</span>=
              <span className="text-green-400">"{config.apiBase}"</span>
              {"\n"} <span className="text-zcash-gold"> data-target</span>=
              <span className="text-green-400">"{config.target}"</span>
              {"\n"} <span className="text-zcash-gold"> data-disabled</span>=
              <span className="text-green-400">"{disabled}"</span>
              {"\n"} <span className="text-pink-400">&gt;&lt;/script&gt;</span>
            </code>
          </pre>
        </div>

        {/* Help text */}
        <p className="text-md text-slate-800">
          Paste this code snippet into your website's HTML to add the payment
          button.
        </p>
      </div>
    </div>
  );
}

export function Modal({ isOpen, onClose, children }: any) {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: any) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: any) => {
    if (e.target === modalRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-99999 flex items-center justify-center
             bg-black/60 backdrop-blur-sm
             p-5 animate-fade-in"
    >
      <div
        className="w-full max-w-200 bg-white relative
             rounded-[28px] p-7 text-[--zwg-text]
             font-sans
             shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4),0_0_0_1px_var(--zwg-border)]
             animate-fade-out"
      >
        <button
          onClick={onClose}
          className="float-right text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          ×
        </button>
        <div className="clear-both">{children}</div>
      </div>
    </div>
  );
}

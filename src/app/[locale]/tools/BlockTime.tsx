"use client";

import { FormEvent, useMemo, useState } from "react";

const HEIGHT_RE = /^\d{1,8}$/;
const HASH_RE = /^[0-9a-f]{64}$/i;

const INPUT_CLASS = [
  "w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]",
  "focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15",
  "rounded-xl px-4 py-3.5 text-[15px] font-mono outline-none transition-all duration-200",
  "text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-[#2d3e50]",
].join(" ");

type BlockTime = {
  height: number;
  hash: string;
  timestamp: number;
  confirmations: number | null;
};

function timezoneName() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "local";
  } catch {
    return "local";
  }
}

function format(ts: number, zone: "local" | "utc") {
  const date = new Date(ts * 1000);
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  };
  if (zone === "utc") opts.timeZone = "UTC";
  return new Intl.DateTimeFormat(undefined, opts).format(date);
}

export default function BlockTime() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BlockTime | null>(null);
  const zone = useMemo(timezoneName, []);

  async function lookup(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    setError(null);
    setResult(null);
    if (!HEIGHT_RE.test(value) && !HASH_RE.test(value)) {
      setError("Enter a block height (e.g. 2500000) or a 64-character block hash.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `/api/cipherscan/block/${encodeURIComponent(value)}`,
        { cache: "no-store" },
      );
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof body.error === "string" ? body.error : "Could not look up that block.",
        );
      }
      if (
        typeof body.height !== "number" ||
        typeof body.hash !== "string" ||
        typeof body.timestamp !== "number"
      ) {
        throw new Error("Unexpected response from the block lookup.");
      }
      setResult({
        height: body.height,
        hash: body.hash,
        timestamp: body.timestamp,
        confirmations:
          typeof body.confirmations === "number" ? body.confirmations : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not look up that block.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={lookup} className="space-y-5">
      <div className="rounded-xl bg-[#F4B728]/5 border border-[#F4B728]/10 px-4 py-3 text-sm text-zinc-500 dark:text-[#7a8a9e]">
        Looks up a Zcash block header time from{" "}
        <span className="font-mono text-[#F4B728]">CipherScan</span> and converts
        the Unix timestamp into your current timezone
        {zone !== "local" ? (
          <>
            {" "}
            (<span className="font-mono text-zinc-700 dark:text-[#c5d0dc]">{zone}</span>)
          </>
        ) : null}
        .
      </div>

      <div>
        <label
          htmlFor="block-id"
          className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1"
        >
          Block height or hash
        </label>
        <input
          id="block-id"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="3499421 or 00000000…"
          disabled={loading}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className={INPUT_CLASS}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="w-full rounded-xl bg-gradient-to-r from-[#F4B728] to-[#d9a520] px-4 py-3 text-sm font-bold text-[#151e29] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Looking up block…" : "Convert block time"}
      </button>

      {error && <p className="text-sm leading-relaxed text-red-400">{error}</p>}

      {result && (
        <div className="space-y-3 rounded-xl border border-zinc-200 dark:border-[#243040] bg-zinc-50 dark:bg-[#0f1720] px-4 py-4">
          <Row label={`Local (${zone})`} value={format(result.timestamp, "local")} />
          <Row label="UTC" value={format(result.timestamp, "utc")} />
          <Row label="Unix timestamp" value={String(result.timestamp)} mono />
          <Row label="Height" value={String(result.height)} mono />
          <Row label="Hash" value={result.hash} mono />
          {result.confirmations != null && (
            <Row label="Confirmations" value={result.confirmations.toLocaleString()} />
          )}
          <a
            href={`https://cipherscan.app/block/${result.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block pt-1 text-sm font-semibold text-[#F4B728] hover:underline"
          >
            View on CipherScan
          </a>
        </div>
      )}
    </form>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e]">
        {label}
      </div>
      <div
        className={`mt-0.5 text-sm text-zinc-800 dark:text-[#e8eef5] break-all ${
          mono ? "font-mono text-[13px]" : "font-medium"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

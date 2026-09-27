"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { detectZcashNetwork } from "./helper";
import { useWasm } from "./hooks/useWasm";

type State = "idle" | "submitting" | "pending" | "confirmed" | "failed";
const success = new Set(["confirmed", "complete", "completed", "success", "successful", "mined"]);
const failure = new Set(["failed", "error", "rejected"]);

function message(body: any, fallback: string) {
  const value = body?.error?.message || body?.error || body?.message;
  return typeof value === "string" ? value : fallback;
}

function status(body: any): "pending" | "confirmed" | "failed" {
  const value = String(body?.status ?? body?.claim?.status ?? body?.data?.status ?? "pending").toLowerCase();
  return success.has(value) ? "confirmed" : failure.has(value) ? "failed" : "pending";
}

export default function Faucet() {
  const [address, setAddress] = useState("");
  const [state, setState] = useState<State>("idle");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { wasmReady, wasmMmoduleRef } = useWasm();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function poll(id: string, signal: AbortSignal) {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (attempt) await new Promise((resolve) => setTimeout(resolve, 3000));
      if (signal.aborted) return;
      const response = await fetch(`/api/faucet/status/testnet/${encodeURIComponent(id)}`, { signal, cache: "no-store" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(message(body, "Could not check claim status"));
      const next = status(body);
      if (next === "confirmed") {
        setState("confirmed");
        setNotice(body.txid || body.tx_hash || body.transaction_id || "Your testnet claim was confirmed.");
        return;
      }
      if (next === "failed") {
        setState("failed");
        setNotice(message(body, "The faucet claim failed."));
        return;
      }
      setState("pending");
      setNotice("Your claim is queued. Checking for confirmation…");
    }
    setState("failed");
    setNotice("The claim is taking longer than expected. Check Fauzec later with the request ID.");
  }

  async function claim(event: FormEvent) {
    event.preventDefault();
    const value = address.trim();
    setNotice(null);
    setRequestId(null);
    const validate = wasmMmoduleRef.current?.is_valid_zcash_address;
    if (!wasmReady || !validate) {
      setState("failed");
      setNotice("The address decoder is still loading. Please try again shortly.");
      return;
    }
    if (!validate(value) || detectZcashNetwork(value) !== "testnet") {
      setState("failed");
      setNotice("Enter a valid Zcash testnet Sapling or Unified address.");
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState("submitting");
    try {
      const response = await fetch("/api/faucet/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ network: "testnet", address: value }), signal: controller.signal });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(message(body, "The faucet rejected this claim"));
      const id = body.request_id ?? body.requestId ?? body.data?.request_id;
      if (typeof id !== "string" || !id) throw new Error("The faucet did not return a request ID");
      setRequestId(id);
      setState("pending");
      setNotice("Claim submitted. Waiting for confirmation…");
      await poll(id, controller.signal);
    } catch (error) {
      if (controller.signal.aborted) return;
      setState("failed");
      setNotice(error instanceof Error ? error.message : "Unable to submit faucet claim");
    }
  }

  const busy = state === "submitting" || state === "pending";
  const color = state === "confirmed" ? "text-emerald-400" : state === "failed" ? "text-red-400" : "text-[#F4B728]";
  return <form onSubmit={claim} className="space-y-5">
    <div className="rounded-xl bg-[#F4B728]/5 border border-[#F4B728]/10 px-4 py-3 text-sm text-zinc-500 dark:text-[#7a8a9e]">Request Zcash testnet funds from <span className="font-mono text-[#F4B728]">fauzec.com</span>. This tool never uses mainnet funds.</div>
    <div>
      <label htmlFor="faucet-address" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1">Testnet Sapling or Unified Address</label>
      <input id="faucet-address" type="text" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="ztestsapling1… or utest1…" disabled={busy} className="w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040] focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15 rounded-xl px-4 py-3.5 text-[13px] font-mono outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-[#2d3e50]" />
    </div>
    <button type="submit" disabled={busy || !wasmReady || !address.trim()} className="w-full rounded-xl bg-gradient-to-r from-[#F4B728] to-[#d9a520] px-4 py-3 text-sm font-bold text-[#151e29] transition-opacity disabled:cursor-not-allowed disabled:opacity-40">{state === "submitting" ? "Submitting claim…" : state === "pending" ? "Claim pending…" : "Request testnet ZEC"}</button>
    {notice && <p className={`text-sm leading-relaxed ${color}`}>{notice}</p>}
    {requestId && <p className="text-[11px] font-mono break-all text-zinc-400 dark:text-[#5a6a7e]">Request ID: {requestId}</p>}
  </form>;
}

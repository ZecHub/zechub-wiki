"use client";

import { FormEvent, useMemo, useState } from "react";
import { useWasm } from "./hooks/useWasm";

const INPUT_CLASS = "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-[15px] font-medium text-zinc-900 outline-none transition focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15 dark:border-[#243040] dark:bg-[#0f1720] dark:text-white";

export default function FaucetClaim() {
  const [address, setAddress] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error" | "rate-limit">("idle");
  const [message, setMessage] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const { wasmReady, wasmError, wasmMmoduleRef } = useWasm();

  const validation = useMemo(() => {
    const value = address.trim();
    if (!value || !wasmReady || !wasmMmoduleRef.current) return null;
    const valid = wasmMmoduleRef.current.is_valid_zcash_address?.(value) ?? false;
    const type = valid ? wasmMmoduleRef.current.get_zcash_address_type?.(value) : null;
    return { valid: type === "unified" || type === "sapling", type };
  }, [address, wasmReady, wasmMmoduleRef]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = address.trim();
    if (!validation?.valid) {
      setState("error");
      setMessage("Enter a valid Unified or Sapling address.");
      return;
    }
    setState("submitting");
    setMessage("");
    setRequestId(null);
    try {
      const response = await fetch("/api/faucet/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: value }),
      });
      const body = await response.json().catch(() => ({}));
      if (response.status === 429) setState("rate-limit");
      else if (!response.ok) setState("error");
      else setState("success");
      setMessage(body.message || body.error || (response.ok ? "Your testnet ZEC request was accepted." : "The faucet rejected this request."));
      setRequestId(body.request_id ?? body.requestId ?? null);
    } catch {
      setState("error");
      setMessage("The faucet could not be reached. Please try again.");
    }
  }

  const resultClass = state === "success" ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400" : state === "rate-limit" ? "border-amber-500/25 bg-amber-500/10 text-amber-400" : "border-red-500/25 bg-red-500/10 text-red-400";

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#F4B728]/20 bg-[#F4B728]/5 px-4 py-3.5 text-sm leading-relaxed text-zinc-500 dark:text-[#a5afbb]">
        Request testnet ZEC (TAZ) from Fauzec for wallet and integration testing. Testnet ZEC has no real monetary value.
      </div>
      <form onSubmit={submit} className="space-y-4" aria-describedby="faucet-help">
        <div>
          <label htmlFor="faucet-address" className="mb-1.5 ml-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e]">Receiving address</label>
          <input id="faucet-address" value={address} onChange={(event) => { setAddress(event.target.value); setState("idle"); }} className={INPUT_CLASS} placeholder="utest1... or ztestsapling..." autoComplete="off" spellCheck={false} disabled={!wasmReady} aria-invalid={validation ? !validation.valid : undefined} />
          <p id="faucet-help" className="mt-2 px-1 text-xs text-zinc-400 dark:text-[#5a6a7e]">Unified and Sapling addresses only. The request always uses the testnet network.</p>
        </div>
        {wasmError && <p role="alert" className="text-sm text-red-400">Address validation is unavailable. Reload the page and try again.</p>}
        {address && validation && !validation.valid && <p role="alert" className="text-sm text-red-400">That is not a valid Unified or Sapling address.</p>}
        <button type="submit" disabled={!wasmReady || state === "submitting"} className="min-h-11 w-full rounded-xl bg-gradient-to-r from-[#F4B728] to-[#d9a520] px-4 py-3 text-sm font-bold text-[#151e29] shadow-md shadow-[#F4B728]/15 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#F4B728] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#151e29]">
          {state === "submitting" ? "Requesting testnet ZEC..." : "Request testnet ZEC"}
        </button>
      </form>
      {state !== "idle" && state !== "submitting" && <div role={state === "success" ? "status" : "alert"} aria-live="polite" className={`rounded-xl border px-4 py-3.5 text-sm leading-relaxed ${resultClass}`}><p className="font-semibold">{state === "success" ? "Request submitted" : state === "rate-limit" ? "Rate limit reached" : "Request not completed"}</p><p className="mt-1">{message}</p>{requestId && <p className="mt-2 break-all font-mono text-xs opacity-80">Request ID: {requestId}</p>}</div>}
    </div>
  );
}

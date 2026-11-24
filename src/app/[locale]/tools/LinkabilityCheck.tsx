"use client";

import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { Coins, ExternalLink, Hourglass, Lock, ShieldAlert, ShieldCheck, ShieldQuestion, Sparkles, Split } from "lucide-react";
import { AMILINKABLE_ORIGIN } from "@/lib/amilinkable/snapshot";
import { decodeShields, type ShieldsPayload } from "@/lib/amilinkable/shields";
import { ShieldIndex, checkWithdrawal, describeAge, type CheckResult, type Risk } from "@/lib/amilinkable/match";
import { pickCommonExample, pickRiskyExample } from "@/lib/amilinkable/examples";
import { formatZec, parseZecToZat } from "@/lib/amilinkable/zat";

// "Before you move", from Am I Linkable. The amount typed here never leaves the
// browser: the page downloads the same public 30-day snapshot for everyone and
// does the matching locally.

const INPUT_CLASS = [
  "w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]",
  "focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15",
  "rounded-xl pl-4 pr-16 py-3.5 text-[15px] font-mono outline-none transition-all duration-200",
  "text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-[#2d3e50]",
].join(" ");

const RISK: Record<Risk, { label: string; text: string; badge: string; icon: typeof ShieldAlert }> = {
  high: { label: "High risk", text: "text-red-600 dark:text-red-400", badge: "bg-red-500/10 border-red-500/20", icon: ShieldAlert },
  medium: { label: "Medium risk", text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-500/10 border-amber-500/20", icon: ShieldQuestion },
  low: { label: "Low risk", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-500/10 border-emerald-500/20", icon: ShieldCheck },
};

const POOL: Record<string, string> = { sprout: "Sprout", sapling: "Sapling", orchard: "Orchard", ironwood: "Ironwood" };

type Data = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; index: ShieldIndex; generatedAt: string };

function verdict(r: Extract<CheckResult, { kind: "result" }>): string {
  if (r.anonymitySet === 0) return "No recent deposit matches this amount.";
  if (r.risk === "high") return "This withdrawal may be linkable to a recent deposit.";
  if (r.risk === "medium") return "This withdrawal may be linkable, though the link is weaker.";
  return "This withdrawal blends in with many recent deposits.";
}

/** formatZec without thousands separators, so it can go back into the input. */
const plain = (zat: number) => formatZec(zat).replace(/,/g, "");

export default function LinkabilityCheck() {
  const [data, setData] = useState<Data>({ status: "loading" });
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/amilinkable/shields", { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok || !body) throw new Error(typeof body?.error === "string" ? body.error : "Could not load recent deposits.");
        const payload = body as ShieldsPayload;
        setData({ status: "ready", index: new ShieldIndex(decodeShields(payload)), generatedAt: payload.generatedAt });
      })
      .catch((e) => {
        if (!controller.signal.aborted) setData({ status: "error", message: e instanceof Error ? e.message : "Could not load recent deposits." });
      });
    return () => controller.abort();
  }, []);

  const ready = data.status === "ready" ? data : null;

  function run(raw: string, exampleNote: string | null = null) {
    const parsed = parseZecToZat(raw);
    if (!parsed.ok) {
      setError(parsed.error);
      setResult(null);
      return;
    }
    if (!ready) return;
    setError(null);
    setNote(exampleNote);
    setInput(raw);
    setResult(checkWithdrawal(parsed.zat, Date.now(), ready.index));
    requestAnimationFrame(() => resultRef.current?.focus({ preventScroll: true }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    run(input);
  }

  function example(kind: "risky" | "common") {
    if (!ready) return;
    const now = Date.now();
    const zat = kind === "risky" ? pickRiskyExample(ready.index, now) : pickCommonExample(ready.index, now);
    if (zat === null) {
      setNote(kind === "risky" ? "No unique recent deposit to use as an example right now." : "No common amount found right now.");
      return;
    }
    run(
      plain(zat),
      kind === "risky"
        ? "Example: a deposit from the last two days with a unique amount, minus a typical fee. Picked in your browser."
        : "Example: one of the most common deposit amounts this month. Picked in your browser.",
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex gap-3 rounded-xl bg-[#F4B728]/5 border border-[#F4B728]/10 px-4 py-3 text-sm text-zinc-500 dark:text-[#7a8a9e]">
        <Lock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#F4B728]" />
        <p>
          Before you withdraw (unshield), see whether the amount could be linked to a recent deposit by amount and timing. Matching runs in your
          browser against the last 30 days of public deposits from{" "}
          <a href={AMILINKABLE_ORIGIN} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#F4B728] hover:underline">
            Am I Linkable
          </a>
          . The amount you type is never sent anywhere.
        </p>
      </div>

      <div>
        <label
          htmlFor="linkability-amount"
          className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1"
        >
          Amount you plan to withdraw
        </label>
        <div className="relative">
          <input
            id="linkability-amount"
            type="text"
            inputMode="decimal"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="2.5"
            autoComplete="off"
            spellCheck={false}
            aria-describedby={error ? "linkability-error" : undefined}
            className={INPUT_CLASS}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400 dark:text-[#5a6a7e]">ZEC</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-400 dark:text-[#5a6a7e]">Try an example:</span>
          <ExampleButton onClick={() => example("risky")} disabled={!ready}>
            risky amount
          </ExampleButton>
          <ExampleButton onClick={() => example("common")} disabled={!ready}>
            common amount
          </ExampleButton>
        </div>
      </div>

      <button
        type="submit"
        disabled={!ready || !input.trim()}
        className="w-full rounded-xl bg-gradient-to-r from-[#F4B728] to-[#d9a520] px-4 py-3 text-sm font-bold text-[#151e29] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        {data.status === "loading" ? "Loading recent deposits…" : "Check linkability"}
      </button>

      {data.status === "error" && <p className="text-sm leading-relaxed text-red-400">{data.message}</p>}
      {error && (
        <p id="linkability-error" className="text-sm leading-relaxed text-red-400">
          {error}
        </p>
      )}
      {note && <p className="text-xs text-zinc-400 dark:text-[#5a6a7e]">{note}</p>}

      {result && (
        <div
          ref={resultRef}
          tabIndex={-1}
          aria-live="polite"
          className="space-y-5 rounded-xl border border-zinc-200 dark:border-[#243040] bg-zinc-50 dark:bg-[#0f1720] px-4 py-5 imd:px-5 outline-none"
        >
          {result.kind !== "result" ? (
            <p className="text-sm text-zinc-600 dark:text-[#c5d0dc]">{result.message}</p>
          ) : (
            <Result result={result} />
          )}
        </div>
      )}

      {ready && (
        <p className="text-xs text-zinc-400 dark:text-[#5a6a7e]">
          {ready.index.size.toLocaleString("en-US")} deposits in the last 30 days
          {ready.generatedAt ? `, updated ${new Date(ready.generatedAt).toUTCString().slice(5, 22)} UTC` : ""}. Data from Am I Linkable (MIT).
        </p>
      )}
    </form>
  );
}

function ExampleButton({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 rounded-full border border-zinc-200 dark:border-[#243040] px-2.5 py-1 font-medium text-zinc-600 dark:text-[#c5d0dc] transition-colors hover:border-[#F4B728]/50 hover:text-[#F4B728] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Sparkles aria-hidden="true" className="h-3 w-3" />
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 rounded-lg border border-zinc-200 dark:border-[#243040] bg-white dark:bg-[#151e29] px-3 py-2 imd:block imd:py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e]">{label}</div>
      <div className="text-sm font-bold text-zinc-900 dark:text-white tabular-nums imd:mt-0.5 imd:text-base">{value}</div>
    </div>
  );
}

function Tip({ icon: Icon, children }: { icon: typeof Hourglass; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#F4B728]/10 text-[#F4B728]">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function Result({ result }: { result: Extract<CheckResult, { kind: "result" }> }) {
  const style = RISK[result.risk];
  const Icon = style.icon;
  const { wait, commonAmounts, split } = result.suggestions;
  const firstBetter = wait?.find((w) => w.risk !== result.risk);
  const newest = result.matches[0];
  return (
    <>
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${style.badge} ${style.text}`}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <div className={`text-[11px] font-bold uppercase tracking-[0.12em] ${style.text}`}>
            {style.label}
          </div>
          <div className="text-[15px] font-semibold text-zinc-900 dark:text-white">{verdict(result)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 imd:grid-cols-3">
        <Stat label="Matching" value={result.anonymitySet.toLocaleString("en-US")} />
        <Stat label="Exact amount" value={result.exactCount.toLocaleString("en-US")} />
        <Stat label="Newest" value={newest ? `${describeAge(newest.ageMs)} ago` : "none"} />
      </div>

      <ul className="space-y-1 text-sm leading-relaxed text-zinc-600 dark:text-[#c5d0dc]">
        {result.reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      {(firstBetter || commonAmounts || split) && (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#F4B728]">To blend in</div>
          <ul className="mt-2.5 space-y-2.5 text-sm text-zinc-600 dark:text-[#c5d0dc]">
            {firstBetter && (
              <Tip icon={Hourglass}>
                Wait {firstBetter.afterDays} day{firstBetter.afterDays === 1 ? "" : "s"}: the risk drops to {RISK[firstBetter.risk].label.toLowerCase()}.
              </Tip>
            )}
            {commonAmounts?.slice(0, 2).map((c) => (
              <Tip key={c.amountZat} icon={Coins}>
                Withdraw <span className="font-mono font-semibold text-zinc-900 dark:text-white">{formatZec(c.amountZat)} ZEC</span> instead. It blends in with{" "}
                {c.anonymitySet.toLocaleString("en-US")} recent deposits; leave the rest shielded.
              </Tip>
            ))}
            {split && (
              <Tip icon={Split}>
                Split it into <span className="font-mono font-semibold text-zinc-900 dark:text-white">{split.map((s) => formatZec(s.amountZat)).join(" + ")} ZEC</span>, each part
                blending in.
              </Tip>
            )}
          </ul>
        </div>
      )}

      {result.matches.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e]">
            Matching deposits{result.anonymitySet > result.matches.length ? ` (newest ${result.matches.length})` : ""}
          </div>
          <ul className="mt-2 divide-y divide-zinc-200 dark:divide-[#243040] text-sm">
            {result.matches.map((m, i) => (
              <li key={`${m.txidPrefix}-${i}`} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-0.5 py-2">
                <span className="font-mono font-medium text-zinc-800 dark:text-[#e8eef5]">{formatZec(m.amountZat)} ZEC</span>
                <span className="text-right text-xs text-zinc-500 dark:text-[#7a8a9e]">{describeAge(m.ageMs)} ago</span>
                <span className="text-xs text-zinc-500 dark:text-[#7a8a9e]">
                  {POOL[m.pool] ?? m.pool} · {m.kind === "exact" ? "exact amount" : `${formatZec(m.differenceZat)} ZEC more`}
                </span>
                <span className="text-right font-mono text-xs text-zinc-400 dark:text-[#5a6a7e]">{m.txidPrefix}…</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 dark:border-[#243040] pt-3">
        <p className="text-xs leading-relaxed text-zinc-400 dark:text-[#5a6a7e]">{result.caveat}</p>
        <a
          href={`${AMILINKABLE_ORIGIN}/check`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#F4B728] hover:underline"
        >
          More on Am I Linkable <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
      </div>
    </>
  );
}

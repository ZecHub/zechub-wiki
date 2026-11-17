"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CircleCheck, CircleDashed, CircleX, Clock, ExternalLink, FlaskConical, Lock, MessageSquarePlus } from "lucide-react";
import { CANISHIELD_ORIGIN, shortDay, type DepositRecord, type DepositService } from "@/lib/canishield";

const SELECT_CLASS = [
  "w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]",
  "focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15",
  "rounded-xl px-4 py-3.5 text-[15px] outline-none transition-all duration-200",
  "text-zinc-900 dark:text-white disabled:opacity-60",
].join(" ");

type Tone = "ok" | "warn" | "bad" | "info";

const TONE_CLASS: Record<Tone, string> = {
  ok: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  bad: "bg-red-500/10 text-red-600 dark:text-red-400",
  info: "bg-[#F4B728]/10 text-[#F4B728]",
};

const REPORT_ICON = { ok: CircleCheck, warn: Clock, bad: CircleX } as const;

const DEFAULT_SERVICE = "binance";

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof body?.error === "string" ? body.error : "Could not load the record.");
  return body as T;
}

const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? "" : "s"}`;

export default function DepositCheck() {
  const [services, setServices] = useState<DepositService[] | null>(null);
  const [slug, setSlug] = useState("");
  const [record, setRecord] = useState<DepositRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getJson<{ services: DepositService[] }>("/api/canishield/services", controller.signal)
      .then(({ services }) => {
        setServices(services);
        const preferred = services.find((s) => s.slug === DEFAULT_SERVICE) ?? services.find((s) => s.hasRecord) ?? services[0];
        setSlug(preferred?.slug ?? "");
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Could not load the list.");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setRecord(null);
    getJson<DepositRecord>(`/api/canishield/services/${encodeURIComponent(slug)}`, controller.signal)
      .then(setRecord)
      .catch((e) => {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Could not load the record.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [slug]);

  const withRecord = services?.filter((s) => s.hasRecord) ?? [];
  const without = services?.filter((s) => !s.hasRecord) ?? [];
  const empty = record && !record.deposit && !record.outcomes.latest;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-[#F4B728]/5 border border-[#F4B728]/10 px-4 py-3 text-sm text-zinc-500 dark:text-[#7a8a9e]">
        Before you send shielded ZEC to an exchange or swap, see what happened when others did: on-chain deposit checks and reviewed reports from{" "}
        <a href={CANISHIELD_ORIGIN} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#F4B728] hover:underline">
          Can I Shield
        </a>
        .
      </div>

      <div>
        <label
          htmlFor="deposit-service"
          className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1"
        >
          Exchange or swap
        </label>
        <select id="deposit-service" value={slug} onChange={(event) => setSlug(event.target.value)} disabled={!services} className={SELECT_CLASS}>
          {!services && <option value="">Loading…</option>}
          {withRecord.length > 0 && (
            <optgroup label="With a record">
              {withRecord.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </optgroup>
          )}
          {without.length > 0 && (
            <optgroup label="No record yet">
              {without.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {loading && (
        <div aria-hidden="true" className="space-y-3 rounded-xl border border-zinc-200 dark:border-[#243040] bg-zinc-50 dark:bg-[#0f1720] px-4 py-5">
          <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-[#1e2d3d]" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-[#1e2d3d]" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-[#1e2d3d]" />
        </div>
      )}
      {error && <p className="text-sm leading-relaxed text-red-400">{error}</p>}

      {record && (
        <div aria-live="polite" className="space-y-4 rounded-xl border border-zinc-200 dark:border-[#243040] bg-zinc-50 dark:bg-[#0f1720] px-4 py-5 imd:px-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#F4B728]">Before you send shielded ZEC to {record.name}</div>

          <ul className="space-y-3.5 text-sm text-zinc-700 dark:text-[#c5d0dc]">
            {record.deposit && (
              <Line tone={record.deposit.ok ? "ok" : "warn"} icon={<Lock className="h-3.5 w-3.5" />}>
                Latest deposit check: <strong className="text-zinc-900 dark:text-white">{record.deposit.label}</strong>
                {record.deposit.credit ? `, ${record.deposit.credit}` : ""}
                <span className="block text-xs text-zinc-400 dark:text-[#5a6a7e]">
                  {shortDay(record.deposit.date)} · from a shielded wallet to {record.deposit.to} deposit address · checked on-chain
                </span>
              </Line>
            )}
            {record.outcomes.latest ? (
              <Line tone={record.outcomes.latest.tone} icon={iconFor(record.outcomes.latest.tone)}>
                Latest report: <strong className="text-zinc-900 dark:text-white">{record.outcomes.latest.label}</strong>
                <span className="block text-xs text-zinc-400 dark:text-[#5a6a7e]">
                  {record.outcomes.latest.week} · {plural(record.outcomes.total, "reviewed report")}
                  {record.outcomes.trouble > 0 ? `, ${record.outcomes.trouble} with a hold, refusal or refund` : ""}
                </span>
              </Line>
            ) : (
              <Line tone="info" icon={<CircleDashed className="h-3.5 w-3.5" />}>
                <span className="text-zinc-500 dark:text-[#7a8a9e]">
                  {empty
                    ? `No deposit checks or reports for ${record.name} yet.`
                    : "No one has reported what happened after sending shielded ZEC here yet."}
                </span>
              </Line>
            )}
            <Line tone="info" icon={<FlaskConical className="h-3.5 w-3.5" />}>
              Send a small test amount first, and wait for it to arrive before sending the rest.
            </Line>
          </ul>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-200 dark:border-[#243040] pt-3 text-sm">
            <a href={record.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#F4B728] hover:underline">
              Full record and sources <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
            {record.reportUrl && (
              <a
                href={record.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-zinc-500 hover:text-[#F4B728] dark:text-[#7a8a9e]"
              >
                <MessageSquarePlus aria-hidden="true" className="h-3.5 w-3.5" /> Sent ZEC here? Report what happened
              </a>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-zinc-400 dark:text-[#5a6a7e]">
        Reports keep only an amount range and the week, never an address or transaction ID. Data from Can I Shield, CC BY 4.0.
      </p>
    </div>
  );
}

function iconFor(tone: "ok" | "warn" | "bad") {
  const Icon = REPORT_ICON[tone];
  return <Icon className="h-3.5 w-3.5" />;
}

function Line({ tone, icon, children }: { tone: Tone; icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span aria-hidden="true" className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md ${TONE_CLASS[tone]}`}>
        {icon}
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

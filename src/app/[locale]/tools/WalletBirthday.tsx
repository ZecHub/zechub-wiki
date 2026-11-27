"use client";

import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { CalendarClock, Check, Copy, ExternalLink, Hourglass, TriangleAlert } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  MAINNET_ERAS,
  SAPLING_ACTIVATION_HEIGHT,
  findLastBlockBefore,
  shiftHeight,
  toUnixTime,
  type FoundBlock,
} from "@/lib/walletBirthday";

const FIELD_CLASS = [
  "w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]",
  "focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15",
  "rounded-xl px-4 py-3.5 text-[15px] outline-none transition-all duration-200",
  "text-zinc-900 dark:text-white disabled:opacity-60",
].join(" ");

const LABEL_CLASS = "block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1";

const DAY = 86_400;

const MARGINS = [
  { id: "day", label: "1 day earlier (recommended)", span: "about 1 day", seconds: DAY },
  { id: "week", label: "1 week earlier", span: "about 1 week", seconds: 7 * DAY },
  { id: "month", label: "30 days earlier", span: "about 30 days", seconds: 30 * DAY },
  { id: "none", label: "No margin", span: "", seconds: 0 },
] as const;

type Margin = (typeof MARGINS)[number];
type Zone = "local" | "utc";
type Found = { target: number; zone: Zone; block: FoundBlock; exact: boolean };

const LAUNCH_DATE = "2016-10-28";
const fmt = (n: number) => n.toLocaleString("en-US");

// "150 s at launch; 75 s from Blossom, block 653,600; 25 s from NU7, block 3,543,405"
const SPACINGS = MAINNET_ERAS.map((era, i) =>
  i === 0 ? `${era.spacing} s at launch` : `${era.spacing} s from ${era.name}, block ${fmt(era.height)}`,
).join("; ");

function formatTime(ts: number, zone: Zone) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
    ...(zone === "utc" ? { timeZone: "UTC" } : {}),
  }).format(new Date(ts * 1000));
}

// Same CipherScan proxy as the Block Time tool. A 404 means the height is
// above the chain tip.
async function fetchBlock(height: number, signal: AbortSignal): Promise<FoundBlock | null> {
  const response = await fetch(`/api/cipherscan/block/${height}`, { signal });
  if (response.status === 404) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof body.error === "string" ? body.error : "Could not look up block times.");
  }
  if (body.height !== height || typeof body.timestamp !== "number" || typeof body.hash !== "string") {
    throw new Error("Unexpected response from the block lookup.");
  }
  return {
    height,
    timestamp: body.timestamp,
    hash: body.hash,
    confirmations: typeof body.confirmations === "number" ? body.confirmations : null,
  };
}

export default function WalletBirthday() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [zone, setZone] = useState<Zone>("local");
  const [marginId, setMarginId] = useState<Margin["id"]>("day");
  const [zoneName, setZoneName] = useState<string | null>(null);
  const [today, setToday] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<Found | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Browser-only values, read after hydration so the server render matches.
  useEffect(() => {
    try {
      setZoneName(Intl.DateTimeFormat().resolvedOptions().timeZone || null);
    } catch {
      // "Local time" without a name is fine.
    }
    const now = new Date();
    setToday([now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, "0")).join("-"));
    return () => controllerRef.current?.abort();
  }, []);

  const margin = MARGINS.find((m) => m.id === marginId) ?? MARGINS[0];

  async function submit(event: FormEvent) {
    event.preventDefault();
    setFound(null);
    const target = toUnixTime(date, time, zone);
    if (target === null) {
      setError("Enter a date, and a time if you know it, such as 2024-03-15 and 14:30.");
      return;
    }
    if (target <= MAINNET_ERAS[0].time) {
      setError("Zcash mainnet launched on 28 October 2016. Pick a later date.");
      return;
    }
    if (target > Date.now() / 1000) {
      setError("That date is in the future. A new wallet records its own birthday when you create it.");
      return;
    }
    setError(null);

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setBusy(true);
    setChecking(null);
    try {
      const result = await findLastBlockBefore(target, (height) => {
        setChecking(height);
        return fetchBlock(height, controller.signal);
      });
      if (controller.signal.aborted) return;
      setFound({ target, zone, block: result.block, exact: result.exact });
      requestAnimationFrame(() => resultRef.current?.focus({ preventScroll: true }));
    } catch (err) {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Could not look up block times.");
    } finally {
      if (!controller.signal.aborted) {
        setBusy(false);
        setChecking(null);
      }
    }
  }

  return (
    <form onSubmit={submit} aria-busy={busy} className="space-y-5">
      <div className="flex gap-3 rounded-xl bg-[#F4B728]/5 border border-[#F4B728]/10 px-4 py-3 text-sm text-zinc-500 dark:text-[#7a8a9e]">
        <CalendarClock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#F4B728]" />
        <p>
          Restoring a wallet from its recovery phrase? Enter the day you created it, or the day it first received ZEC, to get the block
          height to use as its birthday. Block times come from <span className="font-mono text-[#F4B728]">CipherScan</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 imd:grid-cols-2">
        <div>
          <label htmlFor="birthday-date" className={LABEL_CLASS}>
            Date
          </label>
          <input
            id="birthday-date"
            type="date"
            required
            min={LAUNCH_DATE}
            max={today}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            disabled={busy}
            aria-describedby={error ? "birthday-error" : undefined}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="birthday-time" className={LABEL_CLASS}>
            Time (optional)
          </label>
          <input
            id="birthday-time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            disabled={busy}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="birthday-zone" className={LABEL_CLASS}>
            Timezone
          </label>
          <select
            id="birthday-zone"
            value={zone}
            onChange={(event) => setZone(event.target.value as Zone)}
            disabled={busy}
            className={FIELD_CLASS}
          >
            <option value="local">{zoneName ? `Local time (${zoneName})` : "Local time"}</option>
            <option value="utc">UTC</option>
          </select>
        </div>
        <div>
          <label htmlFor="birthday-margin" className={LABEL_CLASS}>
            Safety margin
          </label>
          <select
            id="birthday-margin"
            value={marginId}
            onChange={(event) => setMarginId(event.target.value as Margin["id"])}
            className={FIELD_CLASS}
          >
            {MARGINS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="-mt-2 ml-1 text-xs text-zinc-400 dark:text-[#5a6a7e]">
        No time means the start of the day. Not sure of the date? Pick an earlier one or a longer margin.
      </p>

      <button
        type="submit"
        disabled={busy || !date}
        className="w-full rounded-xl bg-gradient-to-r from-[#F4B728] to-[#d9a520] px-4 py-3 text-sm font-bold text-[#151e29] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? (checking === null ? "Looking up block times…" : `Checking block ${fmt(checking)}…`) : "Find birthday height"}
      </button>

      {error && (
        <p id="birthday-error" className="text-sm leading-relaxed text-red-400">
          {error}
        </p>
      )}

      {found && (
        <div
          ref={resultRef}
          tabIndex={-1}
          aria-live="polite"
          className="space-y-4 rounded-xl border border-zinc-200 dark:border-[#243040] bg-zinc-50 dark:bg-[#0f1720] px-4 py-5 imd:px-5 outline-none"
        >
          <Result key={`${found.target}-${found.block.height}`} found={found} margin={margin} />
        </div>
      )}

      <div className="space-y-3 rounded-xl border border-zinc-200 dark:border-[#243040] px-4 py-4 imd:px-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#F4B728]">Why a lower height is safer</div>
        <ul className="space-y-3 text-sm text-zinc-600 dark:text-[#c5d0dc]">
          <Tip icon={<TriangleAlert className="h-3.5 w-3.5" />} tone="bad">
            <strong className="text-zinc-900 dark:text-white">Too late hides funds.</strong> A restored wallet only scans from its birthday
            onwards, so ZEC it received before that block doesn&apos;t show up. The funds are still on chain and still yours: restore again
            with a lower height.
          </Tip>
          <Tip icon={<Hourglass className="h-3.5 w-3.5" />} tone="ok">
            <strong className="text-zinc-900 dark:text-white">Too early only costs time.</strong> Nothing is missed. The first sync just
            takes longer, because the wallet has more blocks to check.
          </Tip>
        </ul>
        <p className="text-xs text-zinc-400 dark:text-[#5a6a7e]">
          See both cases step by step in the{" "}
          <Link href="/visualizer?module=wallet-scanning" className="font-semibold text-[#F4B728] hover:underline">
            wallet scanning visualizer
          </Link>
          .
        </p>
      </div>

      <p className="text-xs text-zinc-400 dark:text-[#5a6a7e]">
        Heights are first estimated from the target block spacing ({SPACINGS}), then checked against real block times.
      </p>
    </form>
  );
}

function Result({ found, margin }: { found: Found; margin: Margin }) {
  const { block, target, zone } = found;
  const birthday = shiftHeight(block.height, -margin.seconds);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard
      ?.writeText(String(birthday))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#F4B728]">Wallet birthday height</div>
          <div data-testid="birthday-height" className="mt-1 font-mono text-3xl font-bold tabular-nums text-zinc-900 dark:text-white">
            {fmt(birthday)}
          </div>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-[#243040] px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-[#c5d0dc] transition-colors hover:border-[#F4B728]/50 hover:text-[#F4B728]"
        >
          {copied ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="text-sm text-zinc-600 dark:text-[#c5d0dc]">Enter this height, or any lower one, when you restore the wallet.</p>

      <dl className="space-y-3 border-t border-zinc-200 dark:border-[#243040] pt-3">
        <Row label="Your date" value={formatTime(target, zone)} />
        <Row label="Last block before it" value={`${fmt(block.height)}, mined ${formatTime(block.timestamp, zone)}`} />
        <Row
          label="Safety margin"
          value={
            margin.seconds
              ? `${fmt(block.height - birthday)} blocks earlier, ${margin.span}`
              : "None: this is the last block before your date"
          }
        />
      </dl>

      {birthday < SAPLING_ACTIVATION_HEIGHT && (
        <Note>
          This is before Sapling activated at block {fmt(SAPLING_ACTIVATION_HEIGHT)} (29 October 2018). Light wallets such as ZODL
          don&apos;t accept a lower birthday, so enter {fmt(SAPLING_ACTIVATION_HEIGHT)} there.
        </Note>
      )}
      {!found.exact && (
        <Note>Block times were too irregular here to pin down the exact block, but this one was still mined before your date.</Note>
      )}

      {block.hash && (
        <a
          href={`https://cipherscan.app/block/${block.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#F4B728] hover:underline"
        >
          View block {fmt(block.height)} on CipherScan <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e]">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-zinc-800 dark:text-[#e8eef5]">{value}</dd>
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
      <TriangleAlert aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function Tip({ icon, tone, children }: { icon: ReactNode; tone: "ok" | "bad"; children: ReactNode }) {
  const toneClass =
    tone === "ok" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400";
  return (
    <li className="flex items-start gap-3">
      <span aria-hidden="true" className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md ${toneClass}`}>
        {icon}
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

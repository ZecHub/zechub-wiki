"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LIFECYCLE,
  STATUS_ORDER,
  fmtZipNum,
  zipGithubUrl,
  zipUrl,
} from "./zips-data";
import type { Zip, ZipStatus } from "./types";
import { SANDBOXES, hasSandbox } from "./sandboxes";

export interface ZipTrackerProps {
  zips: Zip[];
  lastSyncedAt: string;
  source: "live" | "fallback";
}

type SortKey = "number-desc" | "number-asc" | "title" | "status";

const STATUS_DOT: Record<ZipStatus, string> = {
  Final: "bg-emerald-600 dark:bg-emerald-400",
  Active: "bg-[#1984c7] dark:bg-[#3fa3e0]",
  Proposed: "bg-amber-600 dark:bg-amber-400",
  Draft: "bg-purple-500 dark:bg-purple-400",
  Reserved: "bg-zinc-400 dark:bg-zinc-500",
  Withdrawn: "bg-rose-600 dark:bg-rose-400",
  Obsolete: "bg-zinc-500 dark:bg-zinc-400",
};

const STATUS_NUM_TINT: Record<string, string> = {
  Final: "text-emerald-600 dark:text-emerald-400",
  Active: "text-[#1984c7] dark:text-[#3fa3e0]",
  Proposed: "text-amber-600 dark:text-amber-400",
  Draft: "text-purple-500 dark:text-purple-400",
  Reserved: "text-zinc-500 dark:text-zinc-400",
};

const TAG_TINT: Record<string, string> = {
  nu7: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  consensus: "bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-300",
  wallet: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  network: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  funding: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
  upgrade: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300",
  mining: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300",
  process: "bg-zinc-100 text-zinc-700 dark:bg-zinc-700/40 dark:text-zinc-300",
};

function tagClass(t: string) {
  return TAG_TINT[t] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-700/40 dark:text-zinc-300";
}

function highlight(text: string, q: string) {
  if (!q) return text;
  const tokens = q
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!tokens.length) return text;
  const splitRe = new RegExp(`(${tokens.join("|")})`, "gi");
  const matchRe = new RegExp(`^(?:${tokens.join("|")})$`, "i");
  const parts = text.split(splitRe);
  return parts.map((p, i) =>
    matchRe.test(p) ? (
      <mark
        key={i}
        className="bg-amber-200/80 dark:bg-amber-500/30 text-zinc-900 dark:text-amber-50 rounded-[2px] px-0.5"
      >
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function ZipTracker({ zips, lastSyncedAt, source }: ZipTrackerProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ZipStatus | "all">("all");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("number-desc");
  const [drawerNum, setDrawerNum] = useState<number | null>(null);
  const [sandboxNum, setSandboxNum] = useState<number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // ESC + "/" hotkey
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (sandboxNum != null) setSandboxNum(null);
        else if (drawerNum != null) setDrawerNum(null);
      }
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (e.key === "/" && tag !== "input" && tag !== "textarea") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerNum, sandboxNum]);

  // Body scroll lock when overlay open
  useEffect(() => {
    const open = drawerNum != null || sandboxNum != null;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerNum, sandboxNum]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      Final: 0, Active: 0, Proposed: 0, Draft: 0, Reserved: 0, Withdrawn: 0, Obsolete: 0,
    };
    zips.forEach((z) => (c[z.status] = (c[z.status] || 0) + 1));
    return c;
  }, [zips]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    let arr = zips.filter((z) => {
      if (status !== "all" && z.status !== status) return false;
      if (cat !== "all" && !z.tags.includes(cat)) return false;
      if (!tokens.length) return true;
      const hay = `${z.num} zip-${z.num} ${z.title} ${z.tags.join(" ")} ${z.summary || ""}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
    arr = [...arr];
    switch (sort) {
      case "number-asc":  arr.sort((a, b) => a.num - b.num); break;
      case "number-desc": arr.sort((a, b) => b.num - a.num); break;
      case "title":       arr.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "status":      arr.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || b.num - a.num); break;
    }
    return arr;
  }, [zips, search, status, cat, sort]);

  const nu7Zips = useMemo(() => zips.filter((z) => z.tags.includes("nu7")), [zips]);

  const drawerZip = drawerNum != null ? zips.find((z) => z.num === drawerNum) : null;
  const sandboxZip = sandboxNum != null ? zips.find((z) => z.num === sandboxNum) : null;
  const sandboxEntry = sandboxNum != null ? SANDBOXES[sandboxNum] : null;

  return (
    <div
      className="bg-zinc-50 dark:bg-[#111b27] text-zinc-900 dark:text-zinc-100 min-h-screen"
      data-zips-source={source}
      data-zips-count={zips.length}
      data-zips-synced-at={lastSyncedAt}
    >
      {/* TOPBAR */}
      <div className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0f1720]/95 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
          <a href="/" className="hover:text-[#1984c7] dark:hover:text-[#3fa3e0] transition-colors">ZecHub</a>
          <span className="opacity-40">/</span>
          <a href="/tools" className="hover:text-[#1984c7] dark:hover:text-[#3fa3e0] transition-colors">Tools</a>
          <span className="opacity-40">/</span>
          <span className="text-zinc-900 dark:text-zinc-100">ZIP Tracker</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <SyncIndicator source={source} lastSyncedAt={lastSyncedAt} />

          <a
            href="https://github.com/zcash/zips"
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-zinc-600 dark:text-zinc-300 hover:text-[#1984c7] dark:hover:text-[#3fa3e0]"
          >
            GitHub ↗
          </a>
        </div>
      </div>

      {/* HERO */}
      <section className="relative max-w-[1320px] mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10 border-b border-zinc-200 dark:border-zinc-800">
        <div
          className="pointer-events-none absolute top-7 right-7 w-56 h-56 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #F4B728, transparent 65%)" }}
          aria-hidden
        />
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1984c7] dark:text-[#3fa3e0] font-semibold mb-4">
          ZIP-0000 · ZIP-2005 · {zips.length} proposals tracked
        </div>
        <h1
          className="text-[clamp(34px,5.5vw,60px)] leading-[1.05] tracking-tight font-medium max-w-[920px] mb-4"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Every Zcash<br />Improvement Proposal,<br />
          <em className="not-italic italic text-[#1984c7] dark:text-[#3fa3e0]">in one place.</em>
        </h1>
        <p className="text-[16px] sm:text-[17px] text-zinc-600 dark:text-zinc-300 max-w-[680px] leading-relaxed mb-7">
          Track every ZIP from Draft to Final. Filter by category, search by keyword, and follow what's queued for the next network upgrade — all kept in sync with the canonical{" "}
          <a href="https://github.com/zcash/zips" className="text-[#1984c7] dark:text-[#3fa3e0] hover:underline">zcash/zips</a> repository.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-5 sm:gap-y-0 mt-8 pt-7 border-t border-zinc-200 dark:border-zinc-800">
          {(["Final", "Active", "Proposed", "Draft", "Reserved"] as const).map((k, i) => (
            <div
              key={k}
              className={`px-0 sm:px-6 ${i > 0 ? "sm:border-l sm:border-zinc-200 dark:sm:border-zinc-800" : ""}`}
            >
              <div
                className={`text-[34px] sm:text-[38px] tracking-tight leading-none mb-2 font-medium ${STATUS_NUM_TINT[k] ?? ""}`}
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {counts[k] ?? 0}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400 font-medium">
                {k}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NU7 BAND */}
      <section
        className="text-zinc-100 px-4 sm:px-8 py-9 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f1827 0%, #142943 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 80% 20%, rgba(244, 183, 40, 0.12) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(25, 132, 200, 0.18) 0%, transparent 50%)`,
          }}
        />
        <div className="relative max-w-[1320px] mx-auto">
          <div className="flex justify-between items-baseline mb-5 flex-wrap gap-4">
            <div>
              <div className="text-[24px] sm:text-[28px] tracking-tight font-medium" style={{ fontFamily: "'Fraunces', serif" }}>
                <span className="font-mono text-[11px] font-semibold bg-[#F4B728] text-zinc-900 px-2.5 py-1 rounded-sm align-middle mr-3 tracking-wider">
                  NU7
                </span>
                Candidate ZIPs for the next network upgrade
              </div>
              <div className="text-[13px] text-zinc-400 mt-2 max-w-[540px] leading-relaxed">
                These ZIPs are under consideration for deployment in NU7. Final inclusion will be defined by draft-arya-deploy-nu7. No decision has been made yet.
              </div>
            </div>
          </div>
          <div
            className="grid gap-px border border-white/10"
            style={{
              background: "rgba(255,255,255,0.08)",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            }}
          >
            {nu7Zips.map((z) => (
              <button
                key={z.num}
                onClick={() => setDrawerNum(z.num)}
                className="text-left bg-white/[0.02] hover:bg-[#F4B728]/10 transition-colors px-5 py-4 flex flex-col gap-1.5"
              >
                <div className="font-mono text-[11px] text-[#F4B728] tracking-wider font-semibold">
                  ZIP {fmtZipNum(z.num)}
                </div>
                <div className="text-[14px] font-medium text-zinc-100 leading-snug">{z.title}</div>
                {hasSandbox(z.num) && (
                  <span className="font-mono text-[9px] mt-1 inline-flex items-center gap-1 self-start px-1.5 py-0.5 rounded bg-[#F4B728]/15 text-[#F4B728]">
                    ⚗ SANDBOX
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-7 pb-3 flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1720] focus-within:border-[#1984c7] dark:focus-within:border-[#3fa3e0] focus-within:ring-2 focus-within:ring-[#1984c7]/15 dark:focus-within:ring-[#3fa3e0]/20 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400 shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by number, title, or keyword (e.g. 'shielded assets', 'fees', 'NU7')..."
              autoComplete="off"
              className="flex-1 outline-none bg-transparent text-[14px] placeholder:text-zinc-400"
            />
            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              /
            </span>
          </div>
        </div>

        <Filters
          label="Status"
          options={[
            { id: "all", label: "All", count: zips.length },
            ...(["Final", "Active", "Proposed", "Draft", "Reserved", "Withdrawn", "Obsolete"] as ZipStatus[]).map((s) => ({
              id: s,
              label: s,
              count: counts[s] ?? 0,
            })),
          ]}
          value={status}
          onChange={(v) => setStatus(v as ZipStatus | "all")}
          activeColor={(id) =>
            id === "Final" ? "bg-emerald-600 border-emerald-600 text-white" :
            id === "Active" ? "bg-[#1984c7] border-[#1984c7] text-white" :
            id === "Proposed" ? "bg-amber-600 border-amber-600 text-white" :
            id === "Draft" ? "bg-purple-500 border-purple-500 text-white" :
            "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900"
          }
        />

        <Filters
          label="Category"
          options={[
            { id: "all", label: "All categories" },
            { id: "nu7", label: "NU7 candidate" },
            { id: "consensus", label: "Consensus" },
            { id: "wallet", label: "Wallet" },
            { id: "network", label: "Network" },
            { id: "funding", label: "Dev fund" },
          ]}
          value={cat}
          onChange={setCat}
          activeColor={() => "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900"}
        />

        <div className="flex justify-between items-center pt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
          <span className="font-mono text-[11px]">
            {filtered.length} ZIP{filtered.length === 1 ? "" : "s"}
          </span>
          <div className="flex gap-3 items-center">
            <span>Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent border-0 text-[12px] text-zinc-900 dark:text-zinc-100 cursor-pointer px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 outline-none"
            >
              <option value="number-desc">Newest (high → low)</option>
              <option value="number-asc">Oldest (low → high)</option>
              <option value="status">Status</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </div>
        </div>
      </section>

      {/* LIST */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-2 pb-20">
        <div className="hidden md:grid grid-cols-[80px_1fr_180px_140px_120px] gap-6 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800">
          <div>ZIP</div>
          <div>Title</div>
          <div>Tags</div>
          <div>Status</div>
          <div />
        </div>
        <div className="border-t border-zinc-100 dark:border-zinc-900 md:border-t-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 dark:text-zinc-400">
              <strong className="block text-zinc-900 dark:text-zinc-100 mb-1.5 text-[16px]">
                No ZIPs match your filters
              </strong>
              Try clearing the search or switching to "All".
            </div>
          ) : (
            filtered.map((z) => (
              <ZipRow
                key={z.num}
                zip={z}
                query={search}
                onOpen={() => setDrawerNum(z.num)}
              />
            ))
          )}
        </div>
      </section>

      {/* DRAWER */}
      <Drawer
        zip={drawerZip ?? null}
        onClose={() => setDrawerNum(null)}
        onOpenSandbox={(num) => {
          setDrawerNum(null);
          setTimeout(() => setSandboxNum(num), 200);
        }}
      />

      {/* SANDBOX */}
      <SandboxModal
        zip={sandboxZip ?? null}
        entry={sandboxEntry}
        onClose={() => setSandboxNum(null)}
      />
    </div>
  );
}

// --------- Sync indicator ---------
function SyncIndicator({ source, lastSyncedAt }: { source: "live" | "fallback"; lastSyncedAt: string }) {
  const isLive = source === "live";
  const title = isLive
    ? `Live data from zips.z.cash · revalidates hourly · rendered ${new Date(lastSyncedAt).toLocaleString()}`
    : "Upstream fetch failed — showing static fallback snapshot";

  return (
    <span title={title} aria-label={isLive ? "live" : "fallback"} className="relative inline-flex">
      <span
        className={`absolute w-2 h-2 rounded-full opacity-60 ${
          isLive ? "bg-emerald-500 animate-ping" : "bg-amber-500"
        }`}
      />
      <span
        className={`relative w-2 h-2 rounded-full ${isLive ? "bg-emerald-500" : "bg-amber-500"}`}
      />
    </span>
  );
}

// --------- Filters ---------
function Filters({
  label,
  options,
  value,
  onChange,
  activeColor,
}: {
  label: string;
  options: { id: string; label: string; count?: number }[];
  value: string;
  onChange: (v: string) => void;
  activeColor: (id: string) => string;
}) {
  return (
    <div className="flex gap-2 flex-wrap items-center">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400 font-semibold mr-1">
        {label}
      </span>
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors font-medium inline-flex items-center gap-1.5
              ${active
                ? activeColor(o.id)
                : "bg-white dark:bg-[#0f1720] border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
          >
            {o.label}
            {o.count !== undefined && (
              <span className="font-mono text-[10px] opacity-70">{o.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// --------- Row ---------
function ZipRow({ zip, query, onOpen }: { zip: Zip; query: string; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full text-left grid md:grid-cols-[80px_1fr_180px_140px_120px] gap-2 md:gap-6 px-3 py-4 border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-white dark:hover:bg-[#0f1720] transition-colors items-center cursor-pointer"
    >
      <div className="font-mono text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
        <span className="text-zinc-400 dark:text-zinc-500 font-medium md:inline">ZIP </span>
        {fmtZipNum(zip.num)}
      </div>
      <div className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug flex flex-wrap items-center gap-2">
        <span>{highlight(zip.title, query)}</span>
        {hasSandbox(zip.num) && (
          <span className="font-mono text-[9px] inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-300/40">
            ⚗ SANDBOX
          </span>
        )}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {zip.tags.map((t) => (
          <span key={t} className={`font-mono text-[10px] px-2 py-0.5 rounded font-medium tracking-wide ${tagClass(t)}`}>
            {t}
          </span>
        ))}
      </div>
      <div className="inline-flex items-center gap-2 text-[12px] font-medium text-zinc-700 dark:text-zinc-300">
        <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[zip.status]}`} />
        {zip.status}
      </div>
      <div className="hidden md:flex justify-end text-zinc-400 dark:text-zinc-500">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  );
}

// --------- Drawer ---------
function Drawer({
  zip,
  onClose,
  onOpenSandbox,
}: {
  zip: Zip | null;
  onClose: () => void;
  onOpenSandbox: (num: number) => void;
}) {
  const open = zip != null;
  if (!zip) {
    return (
      <>
        <div
          className={`fixed inset-0 bg-zinc-900/40 backdrop-blur-[2px] z-[300] transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={onClose}
        />
      </>
    );
  }

  const cur = LIFECYCLE.indexOf(zip.status);
  const isTerminal = zip.status === "Withdrawn" || zip.status === "Obsolete";

  return (
    <>
      <div
        className={`fixed inset-0 bg-zinc-900/40 backdrop-blur-[2px] z-[300] transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[560px] bg-white dark:bg-[#0f1720] z-[301] overflow-y-auto shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="px-7 pt-6 pb-5 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-[#0f1720] z-[2]">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-5 p-1.5 rounded text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="font-mono text-[12px] text-[#1984c7] dark:text-[#3fa3e0] mb-2 font-semibold tracking-wide">
            ZIP {fmtZipNum(zip.num)}
          </div>
          <div className="text-[24px] sm:text-[26px] font-medium leading-tight tracking-tight mb-4 pr-8" style={{ fontFamily: "'Fraunces', serif" }}>
            {zip.title}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="inline-flex items-center gap-2 text-[12px] font-medium">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[zip.status]}`} />
              {zip.status}
            </span>
            {zip.tags.map((t) => (
              <span key={t} className={`font-mono text-[10px] px-2 py-0.5 rounded font-medium tracking-wide ${tagClass(t)}`}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="px-7 py-7 space-y-7">
          <Section title="Summary">
            <p className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">
              {zip.summary ??
                "No short summary available yet — read the full specification on zips.z.cash for the canonical description."}
            </p>
          </Section>

          <Section title="Lifecycle">
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-1 bottom-1 w-[2px] bg-zinc-200 dark:bg-zinc-700" />
              {isTerminal ? (
                <div className="relative pb-4 text-[13px]">
                  <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-rose-500" />
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{zip.status}</div>
                  <div className="text-zinc-500 dark:text-zinc-400 text-[12px] mt-0.5">
                    This ZIP is no longer being progressed.
                  </div>
                </div>
              ) : (
                LIFECYCLE.map((s, i) => {
                  const done = i < cur;
                  const current = i === cur;
                  return (
                    <div key={s} className="relative pb-5 last:pb-0 text-[13px]">
                      <span
                        className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${
                          done
                            ? "bg-emerald-500 border-emerald-500"
                            : current
                              ? "bg-[#1984c7] dark:bg-[#3fa3e0] border-[#1984c7] dark:border-[#3fa3e0] ring-4 ring-[#1984c7]/15 dark:ring-[#3fa3e0]/20"
                              : "bg-white dark:bg-[#0f1720] border-zinc-300 dark:border-zinc-600"
                        }`}
                      />
                      <div className={`font-medium ${current ? "text-[#1984c7] dark:text-[#3fa3e0]" : "text-zinc-900 dark:text-zinc-100"}`}>
                        {s}
                      </div>
                      <div className="text-zinc-500 dark:text-zinc-400 text-[12px] mt-0.5">
                        {done ? "Complete" : current ? "Current stage" : "Not yet reached"}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Section>
        </div>

        <div className="px-7 py-5 flex gap-2.5 flex-wrap border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
          {hasSandbox(zip.num) && (
            <button
              onClick={() => onOpenSandbox(zip.num)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-[13px] font-medium border border-transparent transition shadow-sm"
              style={{ background: "linear-gradient(135deg, #F4B728, #e8a418)", color: "#0e1116" }}
            >
              ⚗ Open Sandbox
            </button>
          )}
          <a
            href={zipUrl(zip.num)}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-[13px] font-medium border transition ${
              hasSandbox(zip.num)
                ? "border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-500"
                : "bg-[#1984c7] hover:bg-[#1574af] text-white border-[#1984c7]"
            }`}
          >
            Read full spec ↗
          </a>
          <a
            href={zipGithubUrl(zip.num)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-[13px] font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-500 transition"
          >
            View on GitHub ↗
          </a>
        </div>
      </aside>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400 mb-2.5 font-semibold">
        {title}
      </h3>
      {children}
    </div>
  );
}

// --------- Sandbox modal ---------
function SandboxModal({
  zip,
  entry,
  onClose,
}: {
  zip: Zip | null;
  entry: { Component: React.ComponentType; pendingPeerReview: boolean } | null;
  onClose: () => void;
}) {
  const open = zip != null;
  return (
    <>
      <div
        className={`fixed inset-0 bg-zinc-900/55 backdrop-blur-[4px] z-[400] transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-0 sm:inset-6 bg-zinc-50 dark:bg-[#0f1720] z-[401] sm:rounded-lg overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ${
          open ? "scale-100 opacity-100 pointer-events-auto" : "scale-[0.97] opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-5 sm:px-7 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 shrink-0 bg-white dark:bg-[#0f1720]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-9 h-9 rounded-md inline-flex items-center justify-center text-zinc-900 text-base shrink-0"
              style={{ background: "linear-gradient(135deg, #F4B728, #e8a418)" }}
            >
              ⚗
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400 font-semibold mb-0.5">
                {zip ? `ZIP ${fmtZipNum(zip.num)} · NU7 candidate · ${zip.status}` : ""}
              </div>
              <div
                className="text-[20px] sm:text-[22px] font-medium leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 truncate"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {zip?.title ?? "Sandbox"}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 text-[12px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100 shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-[#111b27]">
          {open && entry ? <entry.Component /> : null}
          {open && !entry && zip && <PlaceholderSandbox num={zip.num} title={zip.title} />}
        </div>
      </div>
    </>
  );
}

function PlaceholderSandbox({ num, title }: { num: number; title: string }) {
  return (
    <div className="max-w-[1100px] mx-auto px-9 pt-7 pb-16">
      <div className="rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 px-8 py-16 text-center max-w-[540px] mx-auto mt-12 bg-white dark:bg-[#0f1720]">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl opacity-60">
          🚧
        </div>
        <h2 className="text-[22px] font-medium text-zinc-900 dark:text-zinc-100 mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
          Sandbox in development
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-[13.5px] leading-relaxed mb-1.5">
          The interactive sandbox for ZIP {fmtZipNum(num)} ({title}) is being built.
        </p>
      </div>
    </div>
  );
}

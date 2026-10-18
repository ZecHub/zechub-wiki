"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  History,
  Lock,
  LockOpen,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  StepForward,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  SCENARIOS,
  blockAt,
  chainBalance,
  confirmations,
  firstHeight,
  formatZec,
  isSynced,
  nextAutoAction,
  nextHeight,
  nullifierFor,
  scanToTip,
  startScan,
  tipHeight,
  walletBalance,
  type ExampleState,
  type ScanEvent,
  type ScenarioId,
  type SimBlock,
  type WalletNote,
} from "@/lib/walletScanSimulation";
import { VisualizerModuleLink } from "../VisualizerModuleLink";

export interface Stage {
  id: ScenarioId;
  title: string;
  intro: string;
}

export const STAGES: Stage[] = [
  {
    id: "receive",
    title: "Receiving a payment",
    intro:
      "Alice sends this wallet 0.25 ZEC. Nobody tells the wallet; it finds the payment by trying its key on every output in every block.",
  },
  {
    id: "spend",
    title: "Discovering a spend",
    intro:
      "Note A, 0.50 ZEC, arrives in block 102. In block 105 it is spent: 0.20 ZEC goes to someone else and the change comes back.",
  },
  {
    id: "incomplete",
    title: "Incomplete sync",
    intro:
      "Note A arrives in block 102. The same keys also live on another phone, which spends A in block 106, and Carol pays 0.15 ZEC in block 109. This phone's sync stops after block 104.",
  },
  {
    id: "late-birthday",
    title: "Birthday too late",
    intro:
      "Alice pays 0.40 ZEC in block 103 and Bob pays 0.10 ZEC in block 107. The wallet's birthday is block 105, so that is where scanning starts.",
  },
  {
    id: "rescan",
    title: "Rescanning",
    intro:
      "This wallet synced from a birthday of block 106 and shows 0.10 ZEC, but its history starts in block 102. A rescan keeps the same keys and scans again from an earlier block.",
  },
  {
    id: "reorg",
    title: "A chain reorg",
    intro:
      "Alice pays 0.30 ZEC in block 103 and Carol pays 0.20 ZEC in block 109. After the wallet syncs, a competing branch from block 108 overtakes the chain it scanned.",
  },
];

const short = (hex: string, length = 8) => hex.slice(0, length);

const blockLabel = (height: number) => `block ${height}`;

function describeEvent(event: ScanEvent): string {
  switch (event.kind) {
    case "start":
      return `Scan starts at ${blockLabel(event.from)}, the birthday.`;
    case "empty": {
      const outputs = `${event.outputs} output${event.outputs === 1 ? "" : "s"}, none opened`;
      const nullifiers =
        event.nullifiers > 0
          ? `; ${event.nullifiers} nullifier${event.nullifiers === 1 ? "" : "s"}, none of them this wallet's`
          : "";
      return `Block ${event.height}: ${outputs}${nullifiers}.`;
    }
    case "found":
      return event.note.change
        ? `Block ${event.height}: an output opened with the internal key. Note ${event.note.id}, ${formatZec(event.note.value)} of change.`
        : `Block ${event.height}: an output opened. Note ${event.note.id}, ${formatZec(event.note.value)} from ${event.note.from}.`;
    case "spent":
      return `Block ${event.height}: a nullifier matches note ${event.note.id}. ${formatZec(event.note.value)} marked spent.`;
    case "reorg": {
      const forgot = event.dropped.length > 0 ? ` Forgot note ${event.dropped.join(", ")}.` : "";
      const unspent =
        event.unspent.length > 0 ? ` Note ${event.unspent.join(", ")} is unspent again.` : "";
      return `Block ${event.height} does not build on the block the wallet stored. Rewound to ${blockLabel(event.commonAncestor)}.${forgot}${unspent}`;
    }
  }
}

// ─── Small pieces ───────────────────────────────────────────────────────────

const toolButton =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background/60 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-40";

function Panel({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      className={`min-w-0 rounded-xl border border-border bg-card/60 p-4 ${className}`}
    >
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground md:text-base">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ExamplePicker({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Guided examples">
      <ol className="flex flex-wrap gap-2">
        {STAGES.map((stage, index) => (
          <li key={stage.id}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-current={index === current ? "step" : undefined}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 md:text-sm ${
                index === current
                  ? "border-amber-400 bg-amber-400 text-slate-950"
                  : "border-border bg-background/60 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
              }`}
            >
              {index + 1}. {stage.title}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Disclaimer() {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-border bg-slate-100/70 dark:bg-slate-800/40 px-3 py-2 text-xs text-muted-foreground md:text-sm">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <span>
        A teaching simulation with a fictional chain, keys and amounts. It is not a wallet, and it
        never asks for a seed phrase, a viewing key or any other wallet secret.
      </span>
    </p>
  );
}

// ─── Controls ───────────────────────────────────────────────────────────────

export interface ScanControlsProps {
  example: ExampleState;
  isPlaying: boolean;
  onStep: () => void;
  onTogglePlay: () => void;
  onReplay: () => void;
  onBirthday: (height: number) => void;
  onReorg: () => void;
  onRescan: () => void;
}

export function ScanControls({
  example,
  isPlaying,
  onStep,
  onTogglePlay,
  onReplay,
  onBirthday,
  onReorg,
  onRescan,
}: ScanControlsProps) {
  const scenario = SCENARIOS[example.id];
  const synced = isSynced(example.scan, example.chain);
  const finished = nextAutoAction(example) === "done";
  const birthdayId = `wallet-birthday-${example.id}`;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-3 md:flex-row md:flex-wrap md:items-center">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Scanning">
        <button type="button" className={toolButton} onClick={onStep} disabled={synced}>
          <StepForward className="h-4 w-4" />
          Scan next block
        </button>
        <button
          type="button"
          className={toolButton}
          onClick={onTogglePlay}
          disabled={!isPlaying && finished}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? "Pause scanning" : "Play scanning"}
        </button>
        <button type="button" className={toolButton} onClick={onReplay}>
          <RotateCcw className="h-4 w-4" />
          Replay scan
        </button>
        {scenario.reorg && (
          <button type="button" className={toolButton} onClick={onReorg} disabled={example.reorged}>
            <GitBranch className="h-4 w-4" />
            Simulate a reorg
          </button>
        )}
        {scenario.rescanFrom !== undefined && (
          <button type="button" className={toolButton} onClick={onRescan}>
            <History className="h-4 w-4" />
            Rescan from block {scenario.rescanFrom}
          </button>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 md:min-w-[16rem]">
        <label htmlFor={birthdayId} className="flex items-baseline justify-between gap-2 text-sm text-foreground">
          <span className="font-medium">Wallet birthday</span>
          <output htmlFor={birthdayId} className="tabular-nums">
            {blockLabel(example.scan.birthday)}
          </output>
        </label>
        <input
          id={birthdayId}
          type="range"
          min={firstHeight(example.chain)}
          max={tipHeight(example.chain)}
          step={1}
          value={example.scan.birthday}
          onChange={(event) => onBirthday(Number(event.target.value))}
          className="w-full cursor-pointer accent-emerald-500"
          aria-describedby={`${birthdayId}-hint`}
        />
        <p id={`${birthdayId}-hint`} className="text-xs text-muted-foreground">
          The first block the wallet scans. Changing it starts the scan again from there.
        </p>
      </div>
    </div>
  );
}

// ─── View 1: the chain ──────────────────────────────────────────────────────

type BlockStatus = "skipped" | "scanned" | "next" | "waiting" | "stale" | "replaced";

function blockStatus(block: SimBlock, example: ExampleState, orphaned: boolean): BlockStatus {
  const stored = example.scan.stored.find((entry) => entry.height === block.height);
  const kept = stored?.hash === block.hash;
  if (orphaned) return kept ? "stale" : "replaced";
  if (kept) return "scanned";
  if (block.height < example.scan.birthday) return "skipped";
  if (block.height === nextHeight(example.scan)) return "next";
  return "waiting";
}

const STATUS_TEXT: Record<BlockStatus, string> = {
  skipped: "before the birthday, never scanned",
  scanned: "scanned",
  next: "scanning next",
  waiting: "not scanned yet",
  stale: "replaced by the reorg, but the wallet still has it",
  replaced: "replaced by the reorg",
};

/** What scanning this block told the wallet, once it has been scanned. */
function findings(block: SimBlock, example: ExampleState) {
  const opened = block.outputs.filter((output) => output.note).length;
  const matched = block.nullifiers.filter((nf) =>
    example.scan.notes.some((note) => note.nullifier === nf && note.spentAt === block.height),
  ).length;
  return { opened, matched };
}

function BlockTile({
  block,
  example,
  orphaned,
  selected,
  onSelect,
}: {
  block: SimBlock;
  example: ExampleState;
  orphaned: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const status = blockStatus(block, example, orphaned);
  const seen = status === "scanned" || status === "stale";
  const { opened, matched } = seen ? findings(block, example) : { opened: 0, matched: 0 };

  const label = [
    `Block ${block.height}`,
    STATUS_TEXT[status],
    `${block.outputs.length} encrypted outputs`,
    seen && opened > 0 ? `${opened} opened by this wallet` : null,
    `${block.nullifiers.length} nullifiers`,
    seen && matched > 0 ? `${matched} matching this wallet's notes` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const frame: Record<BlockStatus, string> = {
    skipped: "border-dashed border-border bg-slate-100/70 dark:bg-slate-800/30 opacity-60",
    scanned: "border-border bg-background",
    next: "border-sky-500 bg-background motion-safe:animate-pulse",
    waiting: "border-border bg-background/40",
    stale: "border-rose-500/70 bg-rose-500/10",
    replaced: "border-dashed border-rose-500/50 bg-background/40 opacity-60",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={label}
      title={label}
      className={`flex min-w-0 flex-col gap-1 rounded-lg border-2 p-2 text-left transition-colors hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${frame[status]} ${
        selected ? "ring-2 ring-amber-400" : ""
      }`}
    >
      <span className={`text-xs font-semibold tabular-nums text-foreground ${status === "replaced" ? "line-through" : ""}`}>
        {block.height}
      </span>
      <span className="truncate font-mono text-[10px] text-muted-foreground">{short(block.hash, 6)}</span>
      <span className="flex flex-wrap gap-1" aria-hidden="true">
        {block.outputs.map((output) => (
          <span
            key={output.ciphertext}
            className={`h-2.5 w-2.5 rounded-sm ${
              seen && output.note ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-500"
            }`}
          />
        ))}
      </span>
      {block.nullifiers.length > 0 && (
        <span className="flex flex-wrap gap-1" aria-hidden="true">
          {block.nullifiers.map((nf) => {
            const mine = seen && example.scan.notes.some((note) => note.nullifier === nf && note.spentAt === block.height);
            return (
              <span
                key={nf}
                className={`h-2.5 w-2.5 rounded-full border ${
                  mine ? "border-amber-500 bg-amber-500" : "border-slate-400 dark:border-slate-500"
                }`}
              />
            );
          })}
        </span>
      )}
    </button>
  );
}

function BlockDetail({ block, example }: { block: SimBlock; example: ExampleState }) {
  const orphaned = example.orphaned.includes(block);
  const status = blockStatus(block, example, orphaned);
  const seen = status === "scanned" || status === "stale";
  const last = example.scan.stored[example.scan.stored.length - 1];
  const parentMismatch =
    status === "next" && last !== undefined && last.height === block.height - 1 && last.hash !== block.prevHash;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-background/60 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">
          Block {block.height} <span className="font-normal text-muted-foreground">({STATUS_TEXT[status]})</span>
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">
          hash {short(block.hash, 12)} · parent {short(block.prevHash, 12)}
        </p>
      </div>

      {parentMismatch && (
        <p className="flex items-start gap-2 rounded-md bg-rose-500/10 px-2 py-1.5 text-xs text-rose-700 dark:text-rose-300">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Its parent is {short(block.prevHash)}, but the wallet stored {short(last.hash)} for block{" "}
          {last.height}. The next scan will notice the chain changed.
        </p>
      )}

      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Encrypted outputs
        </p>
        <ul className="space-y-1">
          {block.outputs.map((output) => {
            const opened = seen && output.note;
            return (
              <li key={output.ciphertext} className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                {opened ? (
                  <LockOpen className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className="font-mono text-muted-foreground">{short(output.ciphertext, 16)}…</span>
                <span className={opened ? "font-medium text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}>
                  {opened && output.note
                    ? `Opened: note ${output.note.id}, ${formatZec(output.note.value)}${output.note.change ? " of change" : ` from ${output.note.from}`}`
                    : seen
                      ? "Did not open with this wallet's keys"
                      : status === "skipped"
                        ? "Never tried: before the birthday"
                        : "Not tried yet"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {block.nullifiers.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Nullifiers from spends
          </p>
          <ul className="space-y-1">
            {block.nullifiers.map((nf) => {
              const note = seen
                ? example.scan.notes.find((n) => n.nullifier === nf && n.spentAt === block.height)
                : undefined;
              return (
                <li key={nf} className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                  <span className="font-mono text-muted-foreground">{short(nf, 16)}</span>
                  <span className={note ? "font-medium text-amber-700 dark:text-amber-300" : "text-muted-foreground"}>
                    {note
                      ? `Matches note ${note.id}: it is spent`
                      : seen
                        ? "Not the nullifier of any note this wallet has"
                        : "Not checked yet"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ChainPanel({
  example,
  selected,
  onSelect,
}: {
  example: ExampleState;
  selected: SimBlock;
  onSelect: (block: SimBlock) => void;
}) {
  const tiles = (blocks: SimBlock[], orphaned: boolean) => (
    <ol className="grid grid-cols-[repeat(auto-fill,minmax(4.25rem,1fr))] gap-2">
      {blocks.map((block) => (
        <li key={block.hash} className="min-w-0">
          <BlockTile
            block={block}
            example={example}
            orphaned={orphaned}
            selected={block === selected}
            onSelect={() => onSelect(block)}
          />
        </li>
      ))}
    </ol>
  );

  return (
    <Panel
      title="1. The chain everyone downloads"
      icon={<Lock className="h-4 w-4 text-muted-foreground" />}
    >
      <p className="mb-3 text-xs text-muted-foreground md:text-sm">
        Every wallet gets the same blocks, so the server never learns which outputs are whose. Squares
        are encrypted outputs; circles are nullifiers published by spends. Select a block to look inside.
      </p>
      {tiles(example.chain, false)}

      {example.orphaned.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-300">
            <GitBranch className="h-3.5 w-3.5" />
            Replaced by the reorg, no longer part of the chain
          </p>
          {tiles(example.orphaned, true)}
        </div>
      )}

      <div className="mt-3">
        <BlockDetail block={selected} example={example} />
      </div>

      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground" aria-hidden="true">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-slate-400 dark:bg-slate-500" /> output, sealed</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> opened by this wallet</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border border-slate-400 dark:border-slate-500" /> nullifier</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> this wallet&apos;s note, spent</span>
      </p>
    </Panel>
  );
}

// ─── View 2: scanning progress ──────────────────────────────────────────────

export function ScanPanel({ example }: { example: ExampleState }) {
  const { scan, chain } = example;
  const scenario = SCENARIOS[example.id];
  const tip = tipHeight(chain);
  const total = Math.max(0, tip - scan.birthday + 1);
  const done = scan.stored.filter((entry) => blockAt(chain, entry.height)?.hash === entry.hash).length;
  const skipped = scan.birthday - firstHeight(chain);
  const action = nextAutoAction(example);
  const next = nextHeight(scan);

  let status: string;
  if (action === "halt") {
    status = `Sync stopped after block ${scenario.haltAfter}. ${tip - (scenario.haltAfter ?? tip)} blocks not scanned.`;
  } else if (isSynced(scan, chain)) {
    status = `Synced to block ${tip}.`;
  } else if (scan.stored.length === 0) {
    status = `Ready to scan from block ${scan.birthday}.`;
  } else {
    status = `Scanned up to block ${next - 1}. Next: block ${next} of ${tip}.`;
  }

  const latest = scan.events[scan.events.length - 1];
  const log = [...scan.events].reverse();

  return (
    <Panel
      title="2. Scanning progress"
      icon={<StepForward className="h-4 w-4 text-sky-600 dark:text-sky-400" />}
    >
      <div
        role="progressbar"
        aria-label="Blocks scanned since the birthday"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.min(done, total)}
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <div
          className="h-full rounded-full bg-sky-500 transition-[width] duration-500"
          style={{ width: total === 0 ? "0%" : `${(Math.min(done, total) / total) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">{status}</p>
      <p className="text-xs text-muted-foreground">
        {Math.min(done, total)} of {total} blocks from the birthday to the tip
        {skipped > 0 ? `; ${skipped} older block${skipped === 1 ? "" : "s"} skipped` : ""}.
      </p>

      <p className="sr-only" aria-live="polite">
        {latest ? describeEvent(latest) : ""}
      </p>

      <ol
        aria-label="Scan log, newest first"
        tabIndex={0}
        className="mt-3 max-h-56 space-y-1.5 overflow-y-auto rounded-lg border border-border bg-background/60 p-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        {log.map((event, index) => (
          <li
            key={scan.events.length - index}
            className={
              event.kind === "found"
                ? "text-emerald-700 dark:text-emerald-300"
                : event.kind === "spent"
                  ? "text-amber-700 dark:text-amber-300"
                  : event.kind === "reorg"
                    ? "text-rose-700 dark:text-rose-300"
                    : "text-muted-foreground"
            }
          >
            {describeEvent(event)}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

// ─── View 3: the wallet ─────────────────────────────────────────────────────

export function WalletPanel({ example }: { example: ExampleState }) {
  const reduceMotion = useReducedMotion();
  const balance = walletBalance(example.scan);
  const truth = chainBalance(example.chain);
  const matches = balance === truth;

  return (
    <Panel
      title="3. What the wallet knows"
      icon={<Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
    >
      <p className="text-xs text-muted-foreground">Balance shown to you</p>
      <p className="text-2xl font-bold tabular-nums text-foreground" aria-live="polite">
        {formatZec(balance)}
      </p>

      <div
        className={`mt-2 flex items-start gap-2 rounded-md px-2 py-1.5 text-xs ${
          matches
            ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
            : "bg-amber-500/10 text-amber-800 dark:text-amber-200"
        }`}
      >
        {matches ? (
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        ) : (
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        )}
        <span>
          Simulation only: these keys really hold <strong className="tabular-nums">{formatZec(truth)}</strong> on
          this chain.{" "}
          {matches
            ? "The wallet agrees."
            : "A real wallet cannot see this number; it only knows what it has scanned."}
        </span>
      </div>

      <p className="mb-1.5 mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Notes</p>
      {example.scan.notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notes found yet.</p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {example.scan.notes.map((note) => {
              const spent = note.spentAt !== null;
              return (
                <motion.li
                  key={`${note.id}-${note.receivedAt}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  className={`rounded-lg border p-2 text-xs ${
                    spent ? "border-border bg-slate-100/70 dark:bg-slate-800/40 text-muted-foreground" : "border-emerald-500/40 bg-emerald-500/5 text-foreground"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span className="font-semibold">
                      Note {note.id}{" "}
                      <span className={`tabular-nums ${spent ? "line-through" : ""}`}>{formatZec(note.value)}</span>
                    </span>
                    <span className={spent ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"}>
                      {spent ? `Spent in block ${note.spentAt}` : "Unspent"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-muted-foreground">
                    {note.change ? "Change from your own payment" : `From ${note.from}`}, block {note.receivedAt},{" "}
                    {confirmations(example.scan, note)} confirmation{confirmations(example.scan, note) === 1 ? "" : "s"}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    nullifier {short(note.nullifier, 12)}
                  </p>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </Panel>
  );
}

// ─── What this shows ────────────────────────────────────────────────────────

type Tone = "info" | "warn" | "ok";

/** Notes a full scan finds that this one never tried, because they came before the birthday. */
function missedBeforeBirthday(example: ExampleState): WalletNote[] {
  const { scan, chain } = example;
  return scanToTip(startScan(firstHeight(chain)), chain).notes.filter(
    (note) => note.receivedAt < scan.birthday && !scan.notes.some((mine) => mine.id === note.id),
  );
}

function describeMissed(missed: WalletNote[], birthday: number): string {
  const list = missed
    .map((note) =>
      note.change ? `the change in block ${note.receivedAt}` : `${note.from}'s payment in block ${note.receivedAt}`,
    )
    .join(" and ");
  return `${list.charAt(0).toUpperCase()}${list.slice(1)} came before the birthday at ${blockLabel(birthday)}, so the wallet never tried to decrypt ${missed.length === 1 ? "it" : "them"}.`;
}

function lesson(example: ExampleState): { tone: Tone; text: string } {
  const { scan, chain } = example;
  const scenario = SCENARIOS[example.id];
  const synced = isSynced(scan, chain);
  const note = (id: string) => scan.notes.find((n) => n.id === id);
  const balance = formatZec(walletBalance(scan));
  const truth = formatZec(chainBalance(chain));
  const missed = missedBeforeBirthday(example);
  const lastEvent = scan.events[scan.events.length - 1];

  // Any example can be given a birthday that is too late. When that has cost
  // the wallet money, say so rather than tell the story the example was
  // written for.
  if (
    synced &&
    missed.some((n) => n.spentAt === null) &&
    example.id !== "late-birthday" &&
    example.id !== "rescan"
  ) {
    return {
      tone: "warn",
      text: `Fully synced, and showing ${balance} instead of ${truth}. ${describeMissed(missed, scan.birthday)} Move the birthday back to block ${missed[0].receivedAt} or earlier and scan again.`,
    };
  }

  switch (example.id) {
    case "receive":
      return note("A")
        ? {
            tone: "ok",
            text: "Note A opened with this wallet's incoming viewing key, so it counts toward the balance. The other outputs in block 103 stayed sealed: the wallet cannot tell who they paid or how much. The server sent the same blocks to every wallet, so it never learned which output was this one's.",
          }
        : {
            tone: "info",
            text: "The wallet tries its incoming viewing key on every output. Only an output addressed to this wallet decrypts; everything else stays sealed.",
          };

    case "spend":
      if (note("A")?.spentAt) {
        return {
          tone: "ok",
          text: `Block 105 lists nullifier ${short(nullifierFor("A"))}, the one this wallet worked out for note A from its full viewing key. That match is how it knows A is spent. The 0.20 ZEC payment stays sealed, and the change, note B, opens with the wallet's internal key.`,
        };
      }
      if (synced && !note("A")) {
        return {
          tone: "info",
          text: "Starting after block 102, the wallet never found note A, so the nullifier in block 105 meant nothing to it. The balance is still right: A was spent anyway, and the change, note B, was addressed to this wallet.",
        };
      }
      return {
        tone: "info",
        text: "Spending a note publishes its nullifier. Only the wallet holding the keys can link a nullifier to its note, so the wallet watches every block for the nullifiers of the notes it has.",
      };

    case "incomplete": {
      if (nextAutoAction(example) === "halt") {
        const countsSpentA = note("A")?.spentAt === null;
        const reasons = [
          countsSpentA ? "it still counts note A, which was spent in block 106" : null,
          "it has not yet seen Carol's payment in block 109",
        ].filter(Boolean);
        return {
          tone: "warn",
          text: `Sync stopped after block ${scenario.haltAfter}. The wallet shows ${balance}, but the chain says ${truth}: ${reasons.join(", and ")}.${
            countsSpentA
              ? " A transaction spending A now would be rejected, because A's nullifier is already on chain."
              : ""
          } Scan the next block or press play to finish the sync.`,
        };
      }
      if (synced) {
        return {
          tone: "ok",
          text: "Fully synced, the wallet matches the chain. An incomplete scan gives an incomplete balance, and it can be wrong in either direction: too high while a spend has not been seen, too low while a payment has not.",
        };
      }
      return {
        tone: "info",
        text: "The balance can only reflect blocks already scanned. Watch what it says when the sync stops.",
      };
    }

    case "late-birthday":
      if (!synced) {
        return {
          tone: "info",
          text: `The birthday is the first block the wallet scans. Nothing before ${blockLabel(scan.birthday)} is downloaded or tried.`,
        };
      }
      return missed.length > 0
        ? {
            tone: "warn",
            text: `Fully synced and still ${formatZec(chainBalance(chain) - walletBalance(scan))} short. ${describeMissed(missed, scan.birthday)} Move the birthday to block ${missed[0].receivedAt} or earlier and scan again.`,
          }
        : {
            tone: "ok",
            text: `With the birthday at ${blockLabel(scan.birthday)}, the scan covers every payment and finds them all. An earlier birthday costs more scanning, which is why wallets record the height at which they were created.`,
          };

    case "rescan":
      if (synced && missed.length > 0) {
        return {
          tone: "warn",
          text: `This wallet finished syncing from ${blockLabel(scan.birthday)} and shows ${balance}. ${describeMissed(missed, scan.birthday)} A rescan keeps the same keys and only moves the starting block.`,
        };
      }
      if (!synced) {
        return {
          tone: "info",
          text: `Rescanning from ${blockLabel(scan.birthday)}: the wallet forgets what it found and works through the blocks again.${
            scan.birthday <= 102
              ? " Watch it find note A, spot A's nullifier in block 104, and pick up the change."
              : ""
          }`,
        };
      }
      return {
        tone: "ok",
        text: "The rescan rebuilt the whole history, spends included. Nothing about the keys changed, only the block the scan starts from.",
      };

    case "reorg": {
      if (!example.reorged) {
        return synced
          ? {
              tone: "info",
              text: `The wallet shows ${balance} and has stored the hash of every block it scanned. Now a competing branch from block 108 becomes the longer chain: simulate the reorg.`,
            }
          : {
              tone: "info",
              text: "As it scans, the wallet keeps the hash of each block. That is how it will notice if the chain changes under it.",
            };
      }
      const rewound = scan.events.some((event) => event.kind === "reorg");
      const stale = scan.stored.some((entry) => example.orphaned.some((block) => block.hash === entry.hash));
      if (lastEvent?.kind === "reorg" && !synced) {
        const forgot =
          lastEvent.dropped.length > 0
            ? `, and forgot note ${lastEvent.dropped.join(", ")} because it came from a replaced block`
            : "";
        return {
          tone: "warn",
          text: `The wallet rewound to ${blockLabel(lastEvent.commonAncestor)}, the last block both chains share${forgot}. Real wallets usually rewind a few extra blocks to be safe. Now it scans the replacement blocks.`,
        };
      }
      if (synced) {
        return rewound
          ? {
              tone: "ok",
              text: "Carol's payment was mined again, this time in block 110, so the wallet found it there. A payment that is not mined again on the new chain would simply disappear, which is why wallets wait for several confirmations before treating received money as settled.",
            }
          : {
              tone: "ok",
              text: "The reorg happened before the wallet reached the replaced blocks, so it simply scanned the new branch and no rewind was needed. Carol's payment is in block 110 on this chain.",
            };
      }
      return stale && !rewound
        ? {
            tone: "warn",
            text: "The server now serves a longer branch. Its next block names a parent hash the wallet never stored. Scan it and see what the wallet does.",
          }
        : { tone: "info", text: "Scanning the replacement chain." };
    }
  }
}


export function LessonCallout({ example }: { example: ExampleState }) {
  const { tone, text } = lesson(example);
  const styles: Record<Tone, string> = {
    info: "border-sky-500/40 bg-sky-500/5",
    warn: "border-amber-500/50 bg-amber-500/10",
    ok: "border-emerald-500/40 bg-emerald-500/5",
  };

  return (
    <div className={`rounded-xl border p-3 md:p-4 ${styles[tone]}`} aria-live="polite">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">What this shows</p>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  );
}

export function FurtherReading() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card/60 p-3 text-sm md:flex-row md:items-center md:justify-between">
      <p className="text-muted-foreground">
        Where does a payment like Alice&apos;s come from?{" "}
        <VisualizerModuleLink
          module="build-shielded-transaction"
          className="inline-flex items-center gap-1 font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
        >
          Build one in the Shielded Transaction visualizer
          <ArrowRight className="h-3.5 w-3.5" />
        </VisualizerModuleLink>
      </p>
      <a
        href="https://zips.z.cash/zip-0307"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Light client protocol (ZIP 307)
      </a>
    </div>
  );
}

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Eye, Lock, RotateCcw, Timer, Zap } from "lucide-react";
import { Button } from "@/components/UI/button";
import { cn } from "@/lib/util";
import { IRONWOOD_ACTIVATION, POOL_THEMES } from "./types";

type Phase = "orchard" | "turnstile" | "ironwood";
type MigrationMode = "immediate" | "scheduled";

interface MigrationNote {
  id: string;
  amount: number;
  phase: Phase;
  offsetBlocks?: number;
}

const TOTAL_ZEC = 18;

const NOTE_PLANS: Record<MigrationMode, Omit<MigrationNote, "phase">[]> = {
  immediate: [{ id: "im-0", amount: TOTAL_ZEC }],
  scheduled: [
    { id: "sc-0", amount: 10, offsetBlocks: 144 },
    { id: "sc-1", amount: 5, offsetBlocks: 432 },
    { id: "sc-2", amount: 2, offsetBlocks: 864 },
    { id: "sc-3", amount: 1, offsetBlocks: 1296 },
  ],
};

const MODE_COPY: Record<
  MigrationMode,
  { label: string; icon: typeof Zap; blurb: string }
> = {
  immediate: {
    label: "Immediate migration",
    icon: Zap,
    blurb:
      "One transfer, the whole balance. Simple, but the amount and its timing make a distinctive fingerprint on-chain.",
  },
  scheduled: {
    label: "Scheduled migration",
    icon: Timer,
    blurb:
      "The shape wallets are converging on in the draft ZIP 318: split the balance into canonical denominations and broadcast at shared anchor heights, so many wallets look alike and timing reveals little.",
  },
};

const buildNotes = (mode: MigrationMode): MigrationNote[] =>
  NOTE_PLANS[mode].map((note) => ({ ...note, phase: "orchard" }));

const formatZec = (value: number) =>
  `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ZEC`;

interface NoteChipProps {
  note: MigrationNote;
  hidden: boolean;
}

const NoteChip = ({ note, hidden }: NoteChipProps) => (
  <motion.div
    layout
    layoutId={note.id}
    transition={{ type: "spring", stiffness: 220, damping: 26 }}
    className={cn(
      "rounded-lg border px-2.5 py-1.5 font-mono text-xs font-semibold shadow-sm",
      hidden
        ? "border-border/60 bg-secondary/60 text-muted-foreground"
        : "border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-300"
    )}
  >
    {hidden ? "•••• ZEC" : formatZec(note.amount)}
    {note.offsetBlocks !== undefined && (
      <span className="block text-[10px] font-normal text-muted-foreground">
        +{note.offsetBlocks.toLocaleString()} blocks
      </span>
    )}
  </motion.div>
);

interface ColumnProps {
  title: string;
  caption: string;
  accent: string;
  icon: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

const Column = ({
  title,
  caption,
  accent,
  icon,
  children,
  footer,
}: ColumnProps) => (
  <div className={cn("rounded-xl border-2 p-4 flex flex-col", accent)}>
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <h4 className="font-semibold text-foreground">{title}</h4>
    </div>
    <p className="text-xs text-muted-foreground mb-3">{caption}</p>
    <div className="flex-1 min-h-[92px] flex flex-wrap content-start gap-2">
      {children}
    </div>
    <div className="mt-3 pt-3 border-t border-border/50">{footer}</div>
  </div>
);

export const MigrationFlow = () => {
  const [mode, setMode] = useState<MigrationMode>("immediate");
  const [runId, setRunId] = useState(0);
  const [notes, setNotes] = useState<MigrationNote[]>(() =>
    buildNotes("immediate")
  );

  const replay = useCallback(() => setRunId((id) => id + 1), []);

  const selectMode = useCallback((next: MigrationMode) => {
    setMode(next);
    setRunId((id) => id + 1);
  }, []);

  useEffect(() => {
    setNotes(buildNotes(mode));
  }, [mode, runId]);

  const allMigrated = notes.every((note) => note.phase === "ironwood");

  useEffect(() => {
    if (allMigrated) return;
    const tickMs = mode === "immediate" ? 1100 : 1800;

    const timer = setInterval(() => {
      setNotes((prev) => {
        const next = prev.map((note) =>
          note.phase === "turnstile"
            ? { ...note, phase: "ironwood" as Phase }
            : note
        );
        const waiting = next.findIndex((note) => note.phase === "orchard");
        if (waiting !== -1) {
          next[waiting] = { ...next[waiting], phase: "turnstile" };
        }
        return next;
      });
    }, tickMs);

    return () => clearInterval(timer);
  }, [mode, runId, allMigrated]);

  useEffect(() => {
    if (!allMigrated) return;
    const timer = setTimeout(replay, 3000);
    return () => clearTimeout(timer);
  }, [allMigrated, replay]);

  const totals = useMemo(() => {
    const sum = (phase: Phase) =>
      notes
        .filter((note) => note.phase === phase)
        .reduce((acc, note) => acc + note.amount, 0);
    const remaining = sum("orchard");
    return {
      remaining,
      crossing: sum("turnstile"),
      arrived: sum("ironwood"),
      verified: TOTAL_ZEC - remaining,
    };
  }, [notes]);

  const inPhase = (phase: Phase) =>
    notes.filter((note) => note.phase === phase);

  const ModeIcon = MODE_COPY[mode].icon;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col imd:flex-row items-stretch imd:items-center justify-center gap-3">
        <div className="flex flex-wrap justify-center rounded-lg border border-border/60 bg-card/60 p-1 gap-1">
          {(Object.keys(MODE_COPY) as MigrationMode[]).map((key) => {
            const Icon = MODE_COPY[key].icon;
            return (
              <button
                key={key}
                onClick={() => selectMode(key)}
                aria-pressed={mode === key}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  mode === key
                    ? "bg-amber-500 text-slate-900"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {MODE_COPY[key].label}
              </button>
            );
          })}
        </div>
        <Button variant="ghost" size="sm" onClick={replay}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Replay
        </Button>
      </div>

      <motion.p
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-sm text-muted-foreground max-w-2xl mx-auto flex items-center justify-center gap-2"
      >
        <ModeIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
        {MODE_COPY[mode].blurb}
      </motion.p>

      <div className="grid gap-4 lg:grid-cols-3">
        <Column
          title="Orchard"
          caption="Now spend-only — no new deposits, no internal payments."
          accent={cn(POOL_THEMES.orchard.border, POOL_THEMES.orchard.bg)}
          icon={
            <POOL_THEMES.orchard.icon
              className={cn("w-5 h-5", POOL_THEMES.orchard.text)}
            />
          }
          footer={
            <p className="text-xs text-muted-foreground">
              Remaining balance{" "}
              <span className="font-mono font-semibold text-foreground">
                {formatZec(totals.remaining)}
              </span>
            </p>
          }
        >
          {inPhase("orchard").map((note) => (
            <NoteChip key={note.id} note={note} hidden />
          ))}
        </Column>

        <Column
          title="Public turnstile"
          caption="Amount is revealed at the checkpoint. Sender and receiver stay private."
          accent="border-amber-500/50 bg-amber-500/10"
          icon={<Eye className="w-5 h-5 text-amber-500" />}
          footer={
            <p className="text-xs text-muted-foreground">
              Publicly counted out of Orchard{" "}
              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                {formatZec(totals.verified)}
              </span>
            </p>
          }
        >
          {inPhase("turnstile").map((note) => (
            <NoteChip key={note.id} note={note} hidden={false} />
          ))}
          {totals.crossing === 0 && (
            <p className="text-xs text-muted-foreground italic self-center">
              waiting for the next transfer…
            </p>
          )}
        </Column>

        <Column
          title="Ironwood"
          caption="New shielded pool with the corrected circuit. Balances hidden again."
          accent={cn(POOL_THEMES.ironwood.border, POOL_THEMES.ironwood.bg)}
          icon={
            <POOL_THEMES.ironwood.icon
              className={cn("w-5 h-5", POOL_THEMES.ironwood.text)}
            />
          }
          footer={
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Migrated{" "}
              <span className="font-mono font-semibold text-foreground">
                {formatZec(totals.arrived)}
              </span>
            </p>
          }
        >
          {inPhase("ironwood").map((note) => (
            <NoteChip key={note.id} note={note} hidden />
          ))}
        </Column>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="p-3 font-medium text-muted-foreground">Pool</th>
                <th className="p-3 font-medium text-muted-foreground">
                  Before activation
                </th>
                <th className="p-3 font-medium text-muted-foreground">
                  Now — from block{" "}
                  {IRONWOOD_ACTIVATION.blockHeight.toLocaleString()}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/40">
                <td
                  className={cn("p-3 font-medium", POOL_THEMES.orchard.text)}
                >
                  Orchard
                </td>
                <td className="p-3 text-muted-foreground">
                  Receives, sends and spends normally
                </td>
                <td className="p-3 text-foreground">
                  Spend-only — funds can leave, nothing new comes in
                </td>
              </tr>
              <tr>
                <td
                  className={cn("p-3 font-medium", POOL_THEMES.ironwood.text)}
                >
                  Ironwood
                </td>
                <td className="p-3 text-muted-foreground">
                  Did not exist
                </td>
                <td className="p-3 text-foreground">
                  Default destination for new shielded activity
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

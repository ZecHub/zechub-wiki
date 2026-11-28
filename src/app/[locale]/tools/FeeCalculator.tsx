"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { GRACE_ACTIONS, type Pool } from "@/lib/zip317";
import {
  EMPTY_SHAPE,
  FEE_SCHEDULES,
  MAX_COUNT,
  estimateFee,
  parseCount,
  transferShape,
  zatsToZec,
  type FeeScheduleId,
  type TxShape,
} from "@/lib/zip317-calculator";

// ZIP 317 fee calculator. Everything is computed in the browser from the
// counts typed here; nothing is fetched.

const INPUT_CLASS = [
  "w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]",
  "focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15",
  "rounded-xl px-3 py-2.5 text-[15px] font-mono outline-none transition-all duration-200",
  "text-zinc-900 dark:text-white tabular-nums",
].join(" ");

const LABEL_CLASS =
  "block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1";

const POOLS: { pool: Pool; label: string; spend: keyof TxShape; output: keyof TxShape; spendLabel: string; outputLabel: string }[] = [
  { pool: "transparent", label: "Transparent (P2PKH)", spend: "transparentInputs", output: "transparentOutputs", spendLabel: "Inputs", outputLabel: "Outputs" },
  { pool: "sapling", label: "Sapling", spend: "saplingSpends", output: "saplingOutputs", spendLabel: "Spends", outputLabel: "Outputs" },
  { pool: "orchard", label: "Orchard", spend: "orchardSpends", output: "orchardOutputs", spendLabel: "Notes spent", outputLabel: "Outputs" },
  { pool: "ironwood", label: "Ironwood", spend: "ironwoodSpends", output: "ironwoodOutputs", spendLabel: "Notes spent", outputLabel: "Outputs" },
];

const POOL_NAME: Record<Pool, string> = { transparent: "Transparent", sapling: "Sapling", orchard: "Orchard", ironwood: "Ironwood" };

const DEFAULT_FROM: Pool = "orchard";
const DEFAULT_TO: Pool = "orchard";

const toFields = (shape: TxShape) =>
  Object.fromEntries(Object.entries(shape).map(([k, v]) => [k, String(v)])) as Record<keyof TxShape, string>;

const fmt = (n: number) => n.toLocaleString("en-US");

export default function FeeCalculator() {
  const [fields, setFields] = useState(() => toFields(transferShape(DEFAULT_FROM, DEFAULT_TO)));
  const [from, setFrom] = useState<Pool>(DEFAULT_FROM);
  const [to, setTo] = useState<Pool>(DEFAULT_TO);
  const [schedule, setSchedule] = useState<FeeScheduleId>("zip2009");

  const shape = Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, parseCount(v)]),
  ) as unknown as TxShape;
  const current = FEE_SCHEDULES.find((s) => s.id === schedule)!;
  const other = FEE_SCHEDULES.find((s) => s.id !== schedule)!;
  const estimate = estimateFee(shape, current.marginalFee);
  const otherFee = estimate.actions.billed * other.marginalFee;
  const { actions } = estimate;
  const padded = estimate.transaction;

  function applyTransfer(nextFrom: Pool, nextTo: Pool) {
    setFrom(nextFrom);
    setTo(nextTo);
    setFields(toFields(transferShape(nextFrom, nextTo)));
  }

  const paddingNotes: string[] = [];
  if ((padded.nOutputsSapling ?? 0) > shape.saplingOutputs)
    paddingNotes.push(`Sapling is padded to ${padded.nOutputsSapling} outputs.`);
  if ((padded.nActionsOrchard ?? 0) > Math.max(shape.orchardSpends, shape.orchardOutputs))
    paddingNotes.push(`Orchard is padded to ${padded.nActionsOrchard} Actions.`);
  if ((padded.nActionsIronwood ?? 0) > Math.max(shape.ironwoodSpends, shape.ironwoodOutputs))
    paddingNotes.push(`Ironwood is padded to ${padded.nActionsIronwood} Actions.`);

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-xl bg-[#F4B728]/5 border border-[#F4B728]/10 px-4 py-3 text-sm text-zinc-500 dark:text-[#7a8a9e]">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#F4B728]" />
        <p className="m-0">
          The conventional fee from{" "}
          <a href="https://zips.z.cash/zip-0317" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#F4B728] hover:underline">
            ZIP 317
          </a>{" "}
          is the marginal fee × the number of logical actions, with a minimum of {GRACE_ACTIONS}. Each pool counts the larger of its spends
          and outputs, and shielded bundles are padded the way wallets build them.
        </p>
      </div>

      <div>
        <span className={LABEL_CLASS}>Start from a payment</span>
        <div className="grid grid-cols-1 gap-3 imd:grid-cols-2">
          <PoolSelect id="fee-from" label="Paying from" value={from} onChange={(p) => applyTransfer(p, to)} />
          <PoolSelect id="fee-to" label="Recipient in" value={to} onChange={(p) => applyTransfer(from, p)} />
        </div>
        <p className="mt-2 ml-1 text-xs text-zinc-400 dark:text-[#5a6a7e]">One note or UTXO spent, one payment, change back to the sender. Adjust the counts below for anything else.</p>
      </div>

      <fieldset className="space-y-3">
        <legend className={LABEL_CLASS}>Transaction</legend>
        {POOLS.map((row) => (
          <div key={row.pool} className="grid grid-cols-2 items-end gap-3 imd:grid-cols-[10rem_1fr_1fr]">
            <div className="col-span-2 text-sm font-semibold text-zinc-700 dark:text-[#c5d0dc] imd:col-span-1 imd:pb-3">{row.label}</div>
            <CountInput id={`fee-${row.spend}`} label={row.spendLabel} value={fields[row.spend]} onChange={(v) => setFields({ ...fields, [row.spend]: v })} />
            <CountInput id={`fee-${row.output}`} label={row.outputLabel} value={fields[row.output]} onChange={(v) => setFields({ ...fields, [row.output]: v })} />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFields(toFields(EMPTY_SHAPE))}
          className="text-xs font-medium text-zinc-500 hover:text-[#F4B728] dark:text-[#7a8a9e]"
        >
          Clear all
        </button>
      </fieldset>

      <fieldset>
        <legend className={LABEL_CLASS}>Marginal fee per logical action</legend>
        <div className="grid grid-cols-1 gap-2 imd:grid-cols-2">
          {FEE_SCHEDULES.map((s) => (
            <label
              key={s.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                schedule === s.id ? "border-[#F4B728]/60 bg-[#F4B728]/10" : "border-zinc-200 dark:border-[#243040] hover:border-[#F4B728]/40"
              }`}
            >
              <input type="radio" name="fee-schedule" value={s.id} checked={schedule === s.id} onChange={() => setSchedule(s.id)} className="mt-1 accent-[#F4B728]" />
              <span>
                <span className="block text-sm font-semibold text-zinc-900 dark:text-white">{s.label}</span>
                <span className="block text-xs text-zinc-500 dark:text-[#7a8a9e]">{s.note}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div aria-live="polite" className="space-y-4 rounded-xl border border-zinc-200 dark:border-[#243040] bg-zinc-50 dark:bg-[#0f1720] px-4 py-5 imd:px-5">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#F4B728]">Conventional fee</div>
          <div data-testid="fee-zec" className="mt-1 font-mono text-2xl font-bold text-zinc-900 dark:text-white">
            {zatsToZec(estimate.feeZats)} ZEC
          </div>
          <div className="text-sm text-zinc-500 dark:text-[#7a8a9e]">
            <span data-testid="fee-zats">{fmt(estimate.feeZats)}</span> zats = {fmt(actions.billed)} × {fmt(current.marginalFee)}. At {other.label} per action:{" "}
            {zatsToZec(otherFee)} ZEC.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 imd:grid-cols-4">
          {POOLS.map((row) => (
            <Stat key={row.pool} label={POOL_NAME[row.pool]} value={fmt(actions[row.pool])} />
          ))}
        </div>

        <ul className="m-0 list-none space-y-1 p-0 text-sm leading-relaxed text-zinc-600 dark:text-[#c5d0dc]">
          <li>
            {fmt(actions.total)} logical action{actions.total === 1 ? "" : "s"}
            {actions.billed > actions.total ? `, billed as the minimum of ${GRACE_ACTIONS}` : ""}.
          </li>
          {paddingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

        <p className="m-0 border-t border-zinc-200 dark:border-[#243040] pt-3 text-xs leading-relaxed text-zinc-400 dark:text-[#5a6a7e]">
          Transparent counts assume standard P2PKH inputs (150 bytes) and outputs (34 bytes); larger scripts count as more actions. Counts are
          capped at {fmt(MAX_COUNT)}. A wallet may pay more than the conventional fee, and a transaction paying less may not be mined.
        </p>
      </div>
    </div>
  );
}

function PoolSelect({ id, label, value, onChange }: { id: string; label: string; value: Pool; onChange: (pool: Pool) => void }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 ml-1 block text-xs text-zinc-500 dark:text-[#7a8a9e]">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as Pool)} className={INPUT_CLASS.replace("font-mono ", "")}>
        {POOLS.map((row) => (
          <option key={row.pool} value={row.pool}>
            {POOL_NAME[row.pool]}
          </option>
        ))}
      </select>
    </div>
  );
}

function CountInput({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 ml-1 block text-xs text-zinc-500 dark:text-[#7a8a9e]">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={MAX_COUNT}
        step={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLASS}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-[#243040] bg-white dark:bg-[#151e29] px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e]">{label}</div>
      <div className="text-sm font-bold text-zinc-900 dark:text-white tabular-nums">{value}</div>
    </div>
  );
}

/**
 * The fee calculator on /tools: turns the notes and UTXOs a person plans to
 * spend and create into the ZIP 317 inputs, then prices them at a chosen
 * marginal fee. The arithmetic itself stays in ./zip317.
 *
 * The marginal fee is a parameter because it changed: ZIP 2009 lowers it from
 * 5,000 to 1,000 zatoshis per logical action from FEE_REDUCTION_HEIGHT on, and
 * wallets that have not adopted it yet still pay the old rate.
 * Spec: https://zips.z.cash/zip-2009
 */

import {
  MIN_ORCHARD_ACTIONS,
  MIN_SAPLING_OUTPUTS,
  logicalActions,
  p2pkhInputsSize,
  p2pkhOutputsSize,
  type LogicalActions,
  type Pool,
  type Zip317Transaction,
} from "./zip317";

/**
 * Both rates are spelled out here rather than read from MARGINAL_FEE_ZATOSHIS,
 * so the "before ZIP 2009" option keeps meaning 5,000 whatever that constant
 * is set to.
 */
export const FEE_SCHEDULES = [
  {
    id: "zip2009",
    marginalFee: 1000,
    label: "1,000 zats",
    note: "ZIP 2009, from mainnet block 3,590,000",
  },
  {
    id: "zip317",
    marginalFee: 5000,
    label: "5,000 zats",
    note: "ZIP 317 before ZIP 2009; wallets that have not updated",
  },
] as const;

export type FeeScheduleId = (typeof FEE_SCHEDULES)[number]["id"];

/** Mainnet and testnet heights from which ZIP 2009's 1,000 zats apply. */
export const FEE_REDUCTION_HEIGHT = { mainnet: 3_590_000, testnet: 4_465_026 } as const;

export const ZATS_PER_ZEC = 100_000_000;

/** Upper bound for any one count, so a typo cannot produce a nonsense fee. */
export const MAX_COUNT = 10_000;

/** What a person knows about the transaction they are about to send. */
export interface TxShape {
  transparentInputs: number;
  transparentOutputs: number;
  saplingSpends: number;
  saplingOutputs: number;
  orchardSpends: number;
  orchardOutputs: number;
  ironwoodSpends: number;
  ironwoodOutputs: number;
}

export const EMPTY_SHAPE: TxShape = {
  transparentInputs: 0,
  transparentOutputs: 0,
  saplingSpends: 0,
  saplingOutputs: 0,
  orchardSpends: 0,
  orchardOutputs: 0,
  ironwoodSpends: 0,
  ironwoodOutputs: 0,
};

/** Reads a count field: whole, non-negative and capped; anything else is 0. */
export function parseCount(raw: string): number {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return 0;
  return Math.min(MAX_COUNT, Number(trimmed));
}

const count = (value: number) =>
  Number.isFinite(value) ? Math.min(MAX_COUNT, Math.max(0, Math.floor(value))) : 0;

/**
 * Builds the ZIP 317 fields the way wallet builders do. A shielded pool that is
 * used at all gets padded (Sapling to two outputs, Orchard and Ironwood to two
 * Actions), and that padding is billed. An Orchard-style Action carries one
 * spend and one output, so a bundle needs as many Actions as its busier side.
 */
export function shapeToTransaction(shape: TxShape): Zip317Transaction {
  const s = Object.fromEntries(
    Object.entries(shape).map(([key, value]) => [key, count(value)]),
  ) as unknown as TxShape;
  const actions = (spends: number, outputs: number) =>
    spends + outputs > 0 ? Math.max(spends, outputs, MIN_ORCHARD_ACTIONS) : 0;

  return {
    txInTotalSize: p2pkhInputsSize(s.transparentInputs),
    txOutTotalSize: p2pkhOutputsSize(s.transparentOutputs),
    nSpendsSapling: s.saplingSpends,
    nOutputsSapling:
      s.saplingSpends + s.saplingOutputs > 0
        ? Math.max(s.saplingOutputs, MIN_SAPLING_OUTPUTS)
        : 0,
    nActionsOrchard: actions(s.orchardSpends, s.orchardOutputs),
    nActionsIronwood: actions(s.ironwoodSpends, s.ironwoodOutputs),
  };
}

/**
 * The shape of a one-note payment: one note or UTXO spent from `from`, the
 * recipient paid in `to`, change back to `from`. Matches simpleTransfer() in
 * ./zip317 once it goes through shapeToTransaction().
 */
export function transferShape(from: Pool, to: Pool): TxShape {
  const shape = { ...EMPTY_SHAPE };
  const spends: Record<Pool, keyof TxShape> = {
    transparent: "transparentInputs",
    sapling: "saplingSpends",
    orchard: "orchardSpends",
    ironwood: "ironwoodSpends",
  };
  const outputs: Record<Pool, keyof TxShape> = {
    transparent: "transparentOutputs",
    sapling: "saplingOutputs",
    orchard: "orchardOutputs",
    ironwood: "ironwoodOutputs",
  };
  shape[spends[from]] += 1;
  shape[outputs[to]] += 1;
  shape[outputs[from]] += 1; // change
  return shape;
}

export interface FeeEstimate {
  transaction: Zip317Transaction;
  actions: LogicalActions;
  marginalFee: number;
  /** marginal_fee × max(grace_actions, logical_actions), in zatoshis. */
  feeZats: number;
}

export function estimateFee(shape: TxShape, marginalFee: number): FeeEstimate {
  const transaction = shapeToTransaction(shape);
  const actions = logicalActions(transaction);
  return { transaction, actions, marginalFee, feeZats: actions.billed * marginalFee };
}

/** Zatoshis as ZEC, exact, with trailing zeros trimmed. */
export function zatsToZec(zats: number): string {
  const whole = Math.floor(zats / ZATS_PER_ZEC);
  const frac = String(zats % ZATS_PER_ZEC).padStart(8, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : `${whole}`;
}

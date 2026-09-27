/**
 * ZIP 317 conventional transaction fee.
 *
 * Spec: https://zips.z.cash/zip-0317
 *
 *   conventional_fee = marginal_fee * max(grace_actions, logical_actions)
 *
 * The part that is easy to get wrong is logical_actions. It is not the number
 * of components a transaction touches: each pool contributes separately, and
 * inside a pool spends and outputs pair up so only the larger side counts.
 * Transparent inputs and outputs are measured in bytes and divided by the
 * standard P2PKH sizes below.
 */

export const MARGINAL_FEE_ZATOSHIS = 5000;
export const GRACE_ACTIONS = 2;
export const P2PKH_STANDARD_INPUT_SIZE = 150;
export const P2PKH_STANDARD_OUTPUT_SIZE = 34;

export type Pool = "transparent" | "sapling" | "orchard";

/** Field names follow ZIP 317 so this can be read side by side with the spec. */
export interface Zip317Transaction {
  /** Total size in bytes of the tx_in field. */
  txInTotalSize?: number;
  /** Total size in bytes of the tx_out field. */
  txOutTotalSize?: number;
  /** Number of Sprout JoinSplits. */
  nJoinSplit?: number;
  nSpendsSapling?: number;
  nOutputsSapling?: number;
  nActionsOrchard?: number;
  /** Revision 1 (NU6.3). Ironwood Actions have the same shape as Orchard ones. */
  nActionsIronwood?: number;
}

export interface LogicalActions {
  transparent: number;
  sprout: number;
  sapling: number;
  orchard: number;
  ironwood: number;
  /** Sum of the per-pool contributions. */
  total: number;
  /** What the fee is actually charged on: max(grace_actions, total). */
  billed: number;
}

const whole = (value: number | undefined) => Math.max(0, Math.floor(value ?? 0));

/** Bytes contributed by a number of standard P2PKH inputs. */
export const p2pkhInputsSize = (inputs: number) =>
  whole(inputs) * P2PKH_STANDARD_INPUT_SIZE;

/** Bytes contributed by a number of standard P2PKH outputs. */
export const p2pkhOutputsSize = (outputs: number) =>
  whole(outputs) * P2PKH_STANDARD_OUTPUT_SIZE;

export function logicalActions(tx: Zip317Transaction): LogicalActions {
  const transparent = Math.max(
    Math.ceil(whole(tx.txInTotalSize) / P2PKH_STANDARD_INPUT_SIZE),
    Math.ceil(whole(tx.txOutTotalSize) / P2PKH_STANDARD_OUTPUT_SIZE),
  );
  const sprout = 2 * whole(tx.nJoinSplit);
  const sapling = Math.max(whole(tx.nSpendsSapling), whole(tx.nOutputsSapling));
  const orchard = whole(tx.nActionsOrchard);
  const ironwood = whole(tx.nActionsIronwood);

  const total = transparent + sprout + sapling + orchard + ironwood;

  return {
    transparent,
    sprout,
    sapling,
    orchard,
    ironwood,
    total,
    billed: Math.max(GRACE_ACTIONS, total),
  };
}

/** The conventional fee in zatoshis. */
export function conventionalFee(tx: Zip317Transaction): number {
  return logicalActions(tx).billed * MARGINAL_FEE_ZATOSHIS;
}

/**
 * The transaction shape behind a one-note transfer: a single note or UTXO is
 * spent in `from`, the recipient is paid in `to`, and change goes back to the
 * sender's own pool.
 */
export function simpleTransfer(from: Pool, to: Pool): Zip317Transaction {
  const spendsIn = (pool: Pool) => (from === pool ? 1 : 0);
  // The recipient's output, plus the change output returned to the sender.
  const outputsIn = (pool: Pool) => (to === pool ? 1 : 0) + (from === pool ? 1 : 0);

  return {
    txInTotalSize: p2pkhInputsSize(spendsIn("transparent")),
    txOutTotalSize: p2pkhOutputsSize(outputsIn("transparent")),
    nSpendsSapling: spendsIn("sapling"),
    nOutputsSapling: outputsIn("sapling"),
    // An Orchard Action carries one spend and one output, so a bundle needs as
    // many Actions as the busier side, padded with dummies.
    nActionsOrchard: Math.max(spendsIn("orchard"), outputsIn("orchard")),
  };
}

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
 *
 * Revision 2 of ZIP 317 (ZIP 2009, https://zips.z.cash/zip-2009) cut
 * marginal_fee from 5,000 to 1,000 zatoshis per logical action from
 * FEE_REDUCTION_HEIGHT. grace_actions and the P2PKH sizes did not change.
 */

/** marginal_fee from revision 2 (ZIP 2009) on. */
export const MARGINAL_FEE_ZATOSHIS = 1000;
/** marginal_fee before revision 2. */
export const LEGACY_MARGINAL_FEE_ZATOSHIS = 5000;
/**
 * First block that uses the revision 2 fee. For a wallet the height that
 * counts is the block the transaction is expected to be mined in; for a node
 * it is the next block's height.
 */
export const FEE_REDUCTION_HEIGHT = {
  mainnet: 3_590_000,
  testnet: 4_465_026,
} as const;
export type FeeNetwork = keyof typeof FEE_REDUCTION_HEIGHT;
export const GRACE_ACTIONS = 2;
export const P2PKH_STANDARD_INPUT_SIZE = 150;
export const P2PKH_STANDARD_OUTPUT_SIZE = 34;

/**
 * Wallet builders pad shielded bundles so a lone spend or output does not
 * stand out: Sapling to at least two outputs (sapling-crypto
 * MIN_SHIELDED_OUTPUTS) and Orchard to at least two Actions (orchard
 * DEFAULT_MIN_ACTIONS). The padding goes on chain, so ZIP 317 bills it.
 */
export const MIN_SAPLING_OUTPUTS = 2;
export const MIN_ORCHARD_ACTIONS = 2;

export type Pool = "transparent" | "sapling" | "orchard" | "ironwood";

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

/** marginal_fee for a transaction mined at `height` on `network`. */
export function marginalFeeAt(height: number, network: FeeNetwork = "mainnet"): number {
  return height >= FEE_REDUCTION_HEIGHT[network]
    ? MARGINAL_FEE_ZATOSHIS
    : LEGACY_MARGINAL_FEE_ZATOSHIS;
}

/**
 * The conventional fee in zatoshis. Uses the current marginal_fee unless a
 * different one is passed, e.g. `marginalFeeAt(height)` for an older block.
 */
export function conventionalFee(
  tx: Zip317Transaction,
  marginalFee: number = MARGINAL_FEE_ZATOSHIS,
): number {
  return logicalActions(tx).billed * marginalFee;
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
  // A pool the transfer does not touch gets no bundle, so no padding either.
  const padded = (count: number, minimum: number, used: boolean) =>
    used ? Math.max(count, minimum) : 0;
  const uses = (pool: Pool) => from === pool || to === pool;

  return {
    txInTotalSize: p2pkhInputsSize(spendsIn("transparent")),
    txOutTotalSize: p2pkhOutputsSize(outputsIn("transparent")),
    nSpendsSapling: spendsIn("sapling"),
    nOutputsSapling: padded(outputsIn("sapling"), MIN_SAPLING_OUTPUTS, uses("sapling")),
    // An Orchard Action carries one spend and one output, so a bundle needs as
    // many Actions as the busier side, padded with dummies.
    nActionsOrchard: padded(
      Math.max(spendsIn("orchard"), outputsIn("orchard")),
      MIN_ORCHARD_ACTIONS,
      uses("orchard"),
    ),
    // Ironwood (NU6.3) reuses the Orchard Action, and its bundle is built and
    // padded the same way.
    nActionsIronwood: padded(
      Math.max(spendsIn("ironwood"), outputsIn("ironwood")),
      MIN_ORCHARD_ACTIONS,
      uses("ironwood"),
    ),
  };
}

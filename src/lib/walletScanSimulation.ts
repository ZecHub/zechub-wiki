/**
 * How a Zcash light wallet finds its money, as a small deterministic model.
 *
 * Everything here is fictional: the chain, the hashes, the ciphertexts and the
 * amounts. Nothing is random, so every reader sees the same chain and the
 * wallet-scanning visualizer can be tested.
 *
 * The model follows what a light wallet does:
 *
 * - It downloads every compact block from its birthday onward (ZIP 307). The
 *   server hands the same blocks to everyone, so it never learns which
 *   outputs belong to whom.
 * - It trial-decrypts every output with its incoming viewing keys (one for
 *   payments, one for its own change). An output that decrypts is a note it
 *   owns; every other output stays opaque.
 * - It recognises a spend of one of its notes by the note's nullifier. The
 *   wallet works out each note's nullifier from its full viewing key, and the
 *   transaction that spends the note publishes it. When a block lists a
 *   nullifier the wallet holds, that note is spent.
 * - It checks each block's previous hash against the last block it stored. A
 *   mismatch means the chain was reorganised, so it rewinds to the last block
 *   both chains share and scans the replacement blocks.
 *
 * Real wallets often scan the newest blocks first and keep a note commitment
 * tree so they can spend; this model scans in height order and leaves the tree
 * out.
 */

import { conventionalFee, simpleTransfer } from "@/lib/zip317";

export const ZATOSHIS_PER_ZEC = 100_000_000;

/** A two-action Ironwood payment, the fee the spend examples pay. */
export const PAYMENT_FEE = conventionalFee(simpleTransfer("ironwood", "ironwood"));

export interface SimNote {
  /** Short label the visualizer shows, such as "A". */
  id: string;
  /** Value in zatoshis. */
  value: number;
  /** Who paid it, for the visualizer's wording. */
  from: string;
  /** Change from the wallet's own payment, found with its internal key. */
  change?: boolean;
}

export interface SimOutput {
  /** Fictional note ciphertext, as hex. */
  ciphertext: string;
  /** The note inside, present only when this wallet's viewing keys open it. */
  note?: SimNote;
}

export interface SimBlock {
  height: number;
  hash: string;
  prevHash: string;
  outputs: SimOutput[];
  /** Nullifiers published by the spends in this block. */
  nullifiers: string[];
}

export interface WalletNote extends SimNote {
  receivedAt: number;
  nullifier: string;
  spentAt: number | null;
}

/** The height and hash the wallet keeps for each block it has scanned. */
export interface StoredBlock {
  height: number;
  hash: string;
}

export type ScanEvent =
  | { kind: "start"; from: number }
  | { kind: "empty"; height: number; outputs: number; nullifiers: number }
  | { kind: "found"; height: number; note: SimNote }
  | { kind: "spent"; height: number; note: SimNote }
  | {
      kind: "reorg";
      height: number;
      commonAncestor: number;
      /** Notes received above the common ancestor, now forgotten. */
      dropped: string[];
      /** Notes whose spend was above the common ancestor, unspent again. */
      unspent: string[];
    };

export interface ScanState {
  birthday: number;
  stored: StoredBlock[];
  notes: WalletNote[];
  events: ScanEvent[];
}

function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Deterministic hex that looks like a hash. It is not a real one. */
export function fakeHex(input: string, length = 16): string {
  let out = "";
  for (let round = 0; out.length < length; round++) {
    out += fnv1a(`${round}:${input}`).toString(16).padStart(8, "0");
  }
  return out.slice(0, length);
}

/**
 * Stands in for deriving a note's nullifier from the note and the wallet's
 * full viewing key: the wallet and the spending transaction arrive at the same
 * value, and nobody without the key can link it to the note.
 */
export const nullifierFor = (noteId: string) => fakeHex(`nullifier:${noteId}`);

export interface BlockSpec {
  /** Notes this wallet receives in the block, including its own change. */
  receive?: SimNote[];
  /** Ids of this wallet's notes spent in the block. */
  spend?: string[];
  /** Outputs to other people. */
  otherOutputs?: number;
  /** Spends by other people. */
  otherSpends?: number;
}

/**
 * Builds a linked chain from `start`. `salt` keeps two branches built from the
 * same parent apart, which is what a reorg needs.
 */
export function buildChain(
  specs: BlockSpec[],
  { start, parentHash, salt = "main" }: { start: number; parentHash: string; salt?: string },
): SimBlock[] {
  const blocks: SimBlock[] = [];
  let prevHash = parentHash;

  specs.forEach((spec, index) => {
    const height = start + index;
    const tag = `${salt}:${height}`;
    const foreign: SimOutput[] = Array.from({ length: spec.otherOutputs ?? 0 }, (_, i) => ({
      ciphertext: fakeHex(`ciphertext:${tag}:${i}`, 24),
    }));
    const mine: SimOutput[] = (spec.receive ?? []).map((note) => ({
      ciphertext: fakeHex(`ciphertext:${tag}:${note.id}`, 24),
      note,
    }));
    // Put the wallet's outputs somewhere in the middle, so they do not always
    // come first.
    const at = foreign.length === 0 ? 0 : height % (foreign.length + 1);
    const outputs = [...foreign.slice(0, at), ...mine, ...foreign.slice(at)];

    const nullifiers = [
      ...Array.from({ length: spec.otherSpends ?? 0 }, (_, i) =>
        fakeHex(`foreign-nullifier:${tag}:${i}`),
      ),
      ...(spec.spend ?? []).map(nullifierFor),
    ];

    const hash = fakeHex(
      `block:${tag}:${prevHash}:${outputs.map((o) => o.ciphertext).join()}:${nullifiers.join()}`,
    );
    blocks.push({ height, hash, prevHash, outputs, nullifiers });
    prevHash = hash;
  });

  return blocks;
}

export const firstHeight = (chain: SimBlock[]) => chain[0].height;
export const tipHeight = (chain: SimBlock[]) => chain[chain.length - 1].height;
export const blockAt = (chain: SimBlock[], height: number) =>
  chain.find((block) => block.height === height);

export function startScan(birthday: number): ScanState {
  return { birthday, stored: [], notes: [], events: [{ kind: "start", from: birthday }] };
}

/** The height the wallet will ask the server for next. */
export function nextHeight(state: ScanState): number {
  const last = state.stored[state.stored.length - 1];
  return last ? last.height + 1 : state.birthday;
}

/** The newest block the wallet has scanned, or null before the first one. */
export function scannedTip(state: ScanState): number | null {
  const last = state.stored[state.stored.length - 1];
  return last ? last.height : null;
}

export const isSynced = (state: ScanState, chain: SimBlock[]) =>
  nextHeight(state) > tipHeight(chain);

const asNote = ({ id, value, from, change }: WalletNote): SimNote =>
  change ? { id, value, from, change } : { id, value, from };

function rewind(state: ScanState, chain: SimBlock[], height: number): ScanState {
  // Walk back to the newest stored block the new chain still contains.
  let keep = state.stored.length;
  while (keep > 0 && blockAt(chain, state.stored[keep - 1].height)?.hash !== state.stored[keep - 1].hash) {
    keep--;
  }
  const stored = state.stored.slice(0, keep);
  const commonAncestor = keep > 0 ? stored[keep - 1].height : state.birthday - 1;

  const dropped = state.notes.filter((note) => note.receivedAt > commonAncestor);
  const unspent = state.notes.filter(
    (note) => note.receivedAt <= commonAncestor && note.spentAt !== null && note.spentAt > commonAncestor,
  );
  const notes = state.notes
    .filter((note) => note.receivedAt <= commonAncestor)
    .map((note) => (unspent.includes(note) ? { ...note, spentAt: null } : note));

  return {
    ...state,
    stored,
    notes,
    events: [
      ...state.events,
      {
        kind: "reorg",
        height,
        commonAncestor,
        dropped: dropped.map((note) => note.id),
        unspent: unspent.map((note) => note.id),
      },
    ],
  };
}

/**
 * Scans the next block. If that block does not build on the last one the
 * wallet stored, this step rewinds instead, and the following step scans the
 * first replacement block.
 */
export function scanNext(state: ScanState, chain: SimBlock[]): ScanState {
  const height = nextHeight(state);
  const block = blockAt(chain, height);
  if (!block) return state;

  const last = state.stored[state.stored.length - 1];
  if (last && block.prevHash !== last.hash) {
    return rewind(state, chain, height);
  }

  const events: ScanEvent[] = [];

  // A spent note's nullifier shows up on chain; nothing else about it does.
  const notes = state.notes.map((note) => {
    if (note.spentAt !== null || !block.nullifiers.includes(note.nullifier)) return note;
    events.push({ kind: "spent", height, note: asNote(note) });
    return { ...note, spentAt: height };
  });

  // Trial decryption: only outputs addressed to this wallet open.
  for (const output of block.outputs) {
    if (!output.note) continue;
    events.push({ kind: "found", height, note: output.note });
    notes.push({ ...output.note, receivedAt: height, nullifier: nullifierFor(output.note.id), spentAt: null });
  }

  if (events.length === 0) {
    events.push({
      kind: "empty",
      height,
      outputs: block.outputs.length,
      nullifiers: block.nullifiers.length,
    });
  }

  return {
    ...state,
    stored: [...state.stored, { height, hash: block.hash }],
    notes,
    events: [...state.events, ...events],
  };
}

export function scanToTip(state: ScanState, chain: SimBlock[]): ScanState {
  let current = state;
  // Each step either stores a block or rewinds below it, so this ends; the
  // bound is only a guard against a malformed chain.
  for (let i = 0; i < chain.length * 3 && !isSynced(current, chain); i++) {
    current = scanNext(current, chain);
  }
  return current;
}

export const walletBalance = (state: ScanState) =>
  state.notes.reduce((sum, note) => (note.spentAt === null ? sum + note.value : sum), 0);

/**
 * What this wallet really holds on `chain`: the balance after a full scan
 * from the first block. Only a simulation can show this; a real wallet has to
 * scan to know it.
 */
export const chainBalance = (chain: SimBlock[]) =>
  walletBalance(scanToTip(startScan(firstHeight(chain)), chain));

/** How many blocks deep a note is, counting the block it arrived in. */
export const confirmations = (state: ScanState, note: WalletNote) => {
  const tip = scannedTip(state);
  return tip === null ? 0 : tip - note.receivedAt + 1;
};

export const formatZec = (zatoshis: number) =>
  `${(zatoshis / ZATOSHIS_PER_ZEC).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })} ZEC`;

// The guided examples ---------------------------------------------------

export type ScenarioId = "receive" | "spend" | "incomplete" | "late-birthday" | "rescan" | "reorg";

export interface Scenario {
  id: ScenarioId;
  chain: SimBlock[];
  /** The birthday the example opens with. */
  birthday: number;
  /** The example opens with the wallet already synced from its birthday. */
  startSynced?: boolean;
  /** Sync is cut off after this height, as if the phone lost its connection. */
  haltAfter?: number;
  /** The earlier birthday the guided rescan goes back to. */
  rescanFrom?: number;
  /** The chain that replaces `chain` above `forkHeight`. */
  reorg?: { chain: SimBlock[]; forkHeight: number };
}

const GENESIS_PARENT = fakeHex("before-101");
const START = 101;

const note = (id: string, zec: number, from: string, change = false): SimNote => ({
  id,
  value: Math.round(zec * ZATOSHIS_PER_ZEC),
  from,
  ...(change ? { change } : {}),
});

/** Change left after paying `paid` out of `spent`, net of the fee. */
const changeOf = (spent: SimNote, paid: number) =>
  spent.value - Math.round(paid * ZATOSHIS_PER_ZEC) - PAYMENT_FEE;

function chainFrom(specs: BlockSpec[], salt?: string) {
  return buildChain(specs, { start: START, parentHash: GENESIS_PARENT, salt });
}

function buildScenarios(): Record<ScenarioId, Scenario> {
  const receiveA = note("A", 0.25, "Alice");

  const spendA = note("A", 0.5, "Alice");
  const spendB: SimNote = { id: "B", value: changeOf(spendA, 0.2), from: "your own payment", change: true };

  const cutA = note("A", 0.5, "Alice");
  const cutB: SimNote = { id: "B", value: changeOf(cutA, 0.2), from: "your own payment", change: true };
  const cutC = note("C", 0.15, "Carol");

  const lateA = note("A", 0.4, "Alice");
  const lateB = note("B", 0.1, "Bob");

  const rescanA = note("A", 0.4, "Alice");
  const rescanB: SimNote = { id: "B", value: changeOf(rescanA, 0.15), from: "your own payment", change: true };
  const rescanC = note("C", 0.1, "Carol");

  const reorgA = note("A", 0.3, "Alice");
  const reorgC = note("C", 0.2, "Carol");
  const reorgChain = chainFrom(
    [
      { otherOutputs: 2 },
      { otherOutputs: 1, otherSpends: 1 },
      { receive: [reorgA], otherOutputs: 2 },
      { otherOutputs: 3, otherSpends: 1 },
      { otherOutputs: 1 },
      { otherOutputs: 2, otherSpends: 2 },
      { otherOutputs: 1 },
      { otherOutputs: 2, otherSpends: 1 },
      { receive: [reorgC], otherOutputs: 2, otherSpends: 1 },
      { otherOutputs: 1 },
    ],
    "reorg-old",
  );
  const forkHeight = 108;
  const fork = blockAt(reorgChain, forkHeight)!;
  // A competing miner's branch: Carol's payment is mined one block later.
  const replacement = [
    ...reorgChain.filter((block) => block.height <= forkHeight),
    ...buildChain(
      [
        { otherOutputs: 3, otherSpends: 1 },
        { receive: [reorgC], otherOutputs: 1, otherSpends: 1 },
        { otherOutputs: 2 },
      ],
      { start: forkHeight + 1, parentHash: fork.hash, salt: "reorg-new" },
    ),
  ];

  return {
    receive: {
      id: "receive",
      birthday: 101,
      chain: chainFrom(
        [
          { otherOutputs: 2 },
          { otherOutputs: 3, otherSpends: 1 },
          { receive: [receiveA], otherOutputs: 2, otherSpends: 1 },
          { otherOutputs: 1 },
          { otherOutputs: 2, otherSpends: 2 },
          { otherOutputs: 1 },
        ],
        "receive",
      ),
    },
    spend: {
      id: "spend",
      birthday: 101,
      chain: chainFrom(
        [
          { otherOutputs: 1 },
          { receive: [spendA], otherOutputs: 2 },
          { otherOutputs: 2, otherSpends: 1 },
          { otherOutputs: 1 },
          // The payment to someone else is an output this wallet cannot open;
          // the change comes back to it.
          { spend: ["A"], receive: [spendB], otherOutputs: 1, otherSpends: 1 },
          { otherOutputs: 2 },
          { otherOutputs: 1, otherSpends: 1 },
        ],
        "spend",
      ),
    },
    incomplete: {
      id: "incomplete",
      birthday: 101,
      haltAfter: 104,
      chain: chainFrom(
        [
          { otherOutputs: 2 },
          { receive: [cutA], otherOutputs: 1 },
          { otherOutputs: 2, otherSpends: 1 },
          { otherOutputs: 1 },
          { otherOutputs: 3, otherSpends: 1 },
          // Spent from another device holding the same keys.
          { spend: ["A"], receive: [cutB], otherOutputs: 1 },
          { otherOutputs: 2, otherSpends: 1 },
          { otherOutputs: 1 },
          { receive: [cutC], otherOutputs: 2, otherSpends: 1 },
          { otherOutputs: 1 },
        ],
        "incomplete",
      ),
    },
    "late-birthday": {
      id: "late-birthday",
      birthday: 105,
      chain: chainFrom(
        [
          { otherOutputs: 1 },
          { otherOutputs: 2, otherSpends: 1 },
          { receive: [lateA], otherOutputs: 2 },
          { otherOutputs: 1, otherSpends: 1 },
          { otherOutputs: 2 },
          { otherOutputs: 1 },
          { receive: [lateB], otherOutputs: 1, otherSpends: 1 },
          { otherOutputs: 2 },
        ],
        "late-birthday",
      ),
    },
    rescan: {
      id: "rescan",
      birthday: 106,
      startSynced: true,
      rescanFrom: 101,
      chain: chainFrom(
        [
          { otherOutputs: 1 },
          { receive: [rescanA], otherOutputs: 2 },
          { otherOutputs: 1, otherSpends: 1 },
          { spend: ["A"], receive: [rescanB], otherOutputs: 1 },
          { otherOutputs: 2, otherSpends: 1 },
          { otherOutputs: 1 },
          { otherOutputs: 2 },
          { receive: [rescanC], otherOutputs: 1, otherSpends: 1 },
          { otherOutputs: 1 },
        ],
        "rescan",
      ),
    },
    reorg: {
      id: "reorg",
      birthday: 101,
      chain: reorgChain,
      reorg: { chain: replacement, forkHeight },
    },
  };
}

export const SCENARIOS = buildScenarios();

export const SCENARIO_ORDER: ScenarioId[] = [
  "receive",
  "spend",
  "incomplete",
  "late-birthday",
  "rescan",
  "reorg",
];

/** One guided example in progress. */
export interface ExampleState {
  id: ScenarioId;
  scan: ScanState;
  /** The chain the server is serving now. */
  chain: SimBlock[];
  /** Blocks the reorg replaced, kept so the visualizer can show them. */
  orphaned: SimBlock[];
  reorged: boolean;
  /** The reader carried on past the point where sync was cut off. */
  resumed: boolean;
}

export function openExample(id: ScenarioId, birthday?: number): ExampleState {
  const scenario = SCENARIOS[id];
  const from = birthday ?? scenario.birthday;
  const fresh = startScan(from);
  return {
    id,
    // Opening with the default birthday restores the example as written;
    // choosing another birthday always starts the scan from scratch.
    scan: scenario.startSynced && birthday === undefined ? scanToTip(fresh, scenario.chain) : fresh,
    chain: scenario.chain,
    orphaned: [],
    reorged: false,
    resumed: false,
  };
}

/** Starts the scan again from `birthday`, on the example's original chain. */
export const replayExample = (example: ExampleState, birthday: number): ExampleState => ({
  ...openExample(example.id),
  scan: startScan(birthday),
});

export type AutoAction = "scan" | "halt" | "reorg" | "rescan" | "done";

/** What the guided example does next when it is left to play. */
export function nextAutoAction(example: ExampleState): AutoAction {
  const scenario = SCENARIOS[example.id];
  const synced = isSynced(example.scan, example.chain);

  // Only a scan that has just reached the cut-off stops there; one that
  // started after it never hits it.
  if (
    scenario.haltAfter !== undefined &&
    !example.resumed &&
    !synced &&
    scannedTip(example.scan) === scenario.haltAfter
  ) {
    return "halt";
  }
  if (!synced) return "scan";
  if (scenario.reorg && !example.reorged) return "reorg";
  if (scenario.rescanFrom !== undefined && example.scan.birthday > scenario.rescanFrom) {
    return "rescan";
  }
  return "done";
}

export const scanExample = (example: ExampleState): ExampleState => ({
  ...example,
  scan: scanNext(example.scan, example.chain),
  resumed: example.resumed || nextAutoAction(example) === "halt",
});

/** Lets a cut-off sync carry on. */
export const resumeExample = (example: ExampleState): ExampleState => ({ ...example, resumed: true });

/** The server starts serving the replacement chain. */
export function reorgExample(example: ExampleState): ExampleState {
  const reorg = SCENARIOS[example.id].reorg;
  if (!reorg || example.reorged) return example;
  return {
    ...example,
    chain: reorg.chain,
    orphaned: example.chain.filter((block) => block.height > reorg.forkHeight),
    reorged: true,
  };
}

/**
 * Rescanning keeps the same keys and moves the starting point back: the
 * wallet forgets what it found and scans again from the earlier birthday.
 */
export function rescanExample(example: ExampleState, from: number): ExampleState {
  return { ...example, scan: startScan(from) };
}

export function applyAutoAction(example: ExampleState, action: AutoAction): ExampleState {
  switch (action) {
    case "scan":
      return scanExample(example);
    case "reorg":
      return reorgExample(example);
    case "rescan":
      return rescanExample(example, SCENARIOS[example.id].rescanFrom ?? example.scan.birthday);
    default:
      return example;
  }
}

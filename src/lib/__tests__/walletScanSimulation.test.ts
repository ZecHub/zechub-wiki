import { conventionalFee, simpleTransfer } from "@/lib/zip317";
import {
  PAYMENT_FEE,
  SCENARIOS,
  SCENARIO_ORDER,
  applyAutoAction,
  blockAt,
  buildChain,
  chainBalance,
  confirmations,
  fakeHex,
  formatZec,
  isSynced,
  nextAutoAction,
  nextHeight,
  nullifierFor,
  openExample,
  reorgExample,
  replayExample,
  rescanExample,
  resumeExample,
  scanExample,
  scanNext,
  scanToTip,
  startScan,
  tipHeight,
  walletBalance,
  type ExampleState,
  type ScanEvent,
  type ScenarioId,
  type SimBlock,
} from "@/lib/walletScanSimulation";

const zec = (amount: number) => Math.round(amount * 100_000_000);

const noteById = (example: ExampleState, id: string) =>
  example.scan.notes.find((note) => note.id === id);

const eventsOf = <K extends ScanEvent["kind"]>(events: ScanEvent[], kind: K) =>
  events.filter((event): event is Extract<ScanEvent, { kind: K }> => event.kind === kind);

/** Plays an example the way the visualizer does, resuming a cut-off sync. */
function playOut(example: ExampleState): ExampleState {
  let current = example;
  for (let i = 0; i < 200; i++) {
    const action = nextAutoAction(current);
    if (action === "done") return current;
    current = action === "halt" ? resumeExample(current) : applyAutoAction(current, action);
  }
  throw new Error(`${example.id} never finished`);
}

function scanWhile(example: ExampleState, keepGoing: (e: ExampleState) => boolean) {
  let current = example;
  while (keepGoing(current)) current = scanExample(current);
  return current;
}

const linked = (chain: SimBlock[]) =>
  chain.every((block, i) => i === 0 || block.prevHash === chain[i - 1].hash);

describe("the fictional chain", () => {
  it("is the same every time it is built", () => {
    const specs = [{ otherOutputs: 2 }, { otherOutputs: 1, otherSpends: 1 }];
    const options = { start: 101, parentHash: "00", salt: "x" };

    expect(buildChain(specs, options)).toEqual(buildChain(specs, options));
    expect(fakeHex("abc")).toBe(fakeHex("abc"));
    expect(fakeHex("abc")).toMatch(/^[0-9a-f]{16}$/);
    expect(fakeHex("abc", 24)).toHaveLength(24);
    expect(fakeHex("abc")).not.toBe(fakeHex("abd"));
  });

  it.each(SCENARIO_ORDER)("links every block of %s to its parent", (id) => {
    const { chain, reorg } = SCENARIOS[id];

    expect(linked(chain)).toBe(true);
    chain.forEach((block, i) => expect(block.height).toBe(chain[0].height + i));
    if (reorg) expect(linked(reorg.chain)).toBe(true);
  });

  it("gives every output a distinct ciphertext", () => {
    for (const id of SCENARIO_ORDER) {
      const ciphertexts = SCENARIOS[id].chain.flatMap((b) => b.outputs.map((o) => o.ciphertext));
      expect(new Set(ciphertexts).size).toBe(ciphertexts.length);
    }
  });

  it("charges the ZIP 317 fee for a two-action Ironwood payment", () => {
    expect(PAYMENT_FEE).toBe(conventionalFee(simpleTransfer("ironwood", "ironwood")));
    expect(PAYMENT_FEE).toBe(10_000);
  });
});

describe("scanning", () => {
  it("starts at the birthday and asks for one block at a time", () => {
    const { chain } = SCENARIOS.receive;
    let state = startScan(101);

    expect(nextHeight(state)).toBe(101);
    state = scanNext(state, chain);
    expect(nextHeight(state)).toBe(102);
    expect(state.stored).toEqual([{ height: 101, hash: chain[0].hash }]);
  });

  it("finds a payment by trial-decrypting the outputs, and nothing else", () => {
    const example = playOut(openExample("receive"));
    const block = blockAt(example.chain, 103)!;

    expect(example.scan.notes).toHaveLength(1);
    expect(noteById(example, "A")).toMatchObject({ value: zec(0.25), receivedAt: 103, spentAt: null });
    expect(walletBalance(example.scan)).toBe(zec(0.25));
    // Block 103 carries other people's outputs too, which stay opaque.
    expect(block.outputs.length).toBeGreaterThan(1);
    expect(block.outputs.filter((output) => output.note)).toHaveLength(1);
    expect(eventsOf(example.scan.events, "found")).toEqual([
      { kind: "found", height: 103, note: { id: "A", value: zec(0.25), from: "Alice" } },
    ]);
  });

  it("records the blocks with nothing for this wallet", () => {
    const state = scanNext(startScan(101), SCENARIOS.receive.chain);

    expect(state.events[state.events.length - 1]).toEqual({
      kind: "empty",
      height: 101,
      outputs: 2,
      nullifiers: 0,
    });
  });

  it("does nothing once it has reached the tip", () => {
    const { chain } = SCENARIOS.receive;
    const synced = scanToTip(startScan(101), chain);

    expect(isSynced(synced, chain)).toBe(true);
    expect(scanNext(synced, chain)).toBe(synced);
  });

  it("counts confirmations from the newest block it has scanned", () => {
    const { chain } = SCENARIOS.receive;
    let state = startScan(101);
    while (nextHeight(state) <= 103) state = scanNext(state, chain);
    const found = state.notes[0];

    expect(confirmations(state, found)).toBe(1);
    expect(confirmations(scanToTip(state, chain), found)).toBe(tipHeight(chain) - 103 + 1);
  });
});

describe("recognising a spent note", () => {
  it("marks note A spent when its nullifier appears, and finds the change", () => {
    const example = playOut(openExample("spend"));
    const spendBlock = blockAt(example.chain, 105)!;

    expect(spendBlock.nullifiers).toContain(nullifierFor("A"));
    expect(noteById(example, "A")).toMatchObject({ spentAt: 105, nullifier: nullifierFor("A") });
    expect(noteById(example, "B")).toMatchObject({
      receivedAt: 105,
      change: true,
      value: zec(0.5) - zec(0.2) - PAYMENT_FEE,
      spentAt: null,
    });
    expect(walletBalance(example.scan)).toBe(zec(0.2999));
    expect(eventsOf(example.scan.events, "spent").map((e) => [e.height, e.note.id])).toEqual([[105, "A"]]);
  });

  it("ignores nullifiers that are not its own", () => {
    const example = scanWhile(openExample("spend"), (e) => nextHeight(e.scan) <= 104);
    const block103 = blockAt(example.chain, 103)!;

    expect(block103.nullifiers).toHaveLength(1);
    expect(noteById(example, "A")?.spentAt).toBeNull();
  });

  it("counts a spent note until it reaches the block with the nullifier", () => {
    const before = scanWhile(openExample("spend"), (e) => nextHeight(e.scan) <= 104);
    const after = scanExample(before);

    expect(walletBalance(before.scan)).toBe(zec(0.5));
    expect(walletBalance(after.scan)).toBe(zec(0.2999));
  });
});

describe("an incomplete sync", () => {
  it("is cut off after block 104 when left to play", () => {
    const example = scanWhile(openExample("incomplete"), (e) => nextAutoAction(e) === "scan");

    expect(nextAutoAction(example)).toBe("halt");
    expect(nextHeight(example.scan)).toBe(105);
    expect(applyAutoAction(example, "halt")).toBe(example);
  });

  it("shows a balance that is wrong in both directions", () => {
    const halted = scanWhile(openExample("incomplete"), (e) => nextAutoAction(e) === "scan");
    const truth = chainBalance(halted.chain);

    // It still counts A, spent at 106 from another device, and has not seen C.
    expect(walletBalance(halted.scan)).toBe(zec(0.5));
    expect(truth).toBe(zec(0.2999) + zec(0.15));
    expect(walletBalance(halted.scan)).not.toBe(truth);
  });

  it("reaches the real balance once the sync carries on", () => {
    const halted = scanWhile(openExample("incomplete"), (e) => nextAutoAction(e) === "scan");
    const finished = playOut(halted);

    expect(walletBalance(finished.scan)).toBe(chainBalance(finished.chain));
    expect(noteById(finished, "A")?.spentAt).toBe(106);
  });

  it("does not cut off a scan whose birthday is after the cut-off", () => {
    const late = openExample("incomplete", 106);

    expect(nextAutoAction(late)).toBe("scan");
    expect(isSynced(playOut(late).scan, late.chain)).toBe(true);
    expect(eventsOf(playOut(late).scan.events, "found").map((e) => e.note.id)).toEqual(["B", "C"]);
  });

  it("lets a manual step continue past the cut-off", () => {
    const halted = scanWhile(openExample("incomplete"), (e) => nextAutoAction(e) === "scan");
    const stepped = scanExample(halted);

    expect(nextHeight(stepped.scan)).toBe(106);
    expect(nextAutoAction(stepped)).toBe("scan");
  });
});

describe("the birthday", () => {
  it("misses a payment that arrived before it", () => {
    const example = playOut(openExample("late-birthday"));

    expect(example.scan.birthday).toBe(105);
    expect(noteById(example, "A")).toBeUndefined();
    expect(walletBalance(example.scan)).toBe(zec(0.1));
    expect(chainBalance(example.chain)).toBe(zec(0.5));
    expect(example.scan.stored[0].height).toBe(105);
  });

  it("finds the payment when the birthday is at or below its block", () => {
    const opened = openExample("late-birthday");

    expect(noteById(playOut(replayExample(opened, 104)), "A")).toBeUndefined();
    expect(noteById(playOut(replayExample(opened, 103)), "A")).toMatchObject({ receivedAt: 103 });
    expect(walletBalance(playOut(replayExample(opened, 101)).scan)).toBe(zec(0.5));
  });

  it("starts a replay from scratch", () => {
    const scanned = playOut(openExample("receive"));
    const replayed = replayExample(scanned, 101);

    expect(replayed.scan.notes).toEqual([]);
    expect(replayed.scan.stored).toEqual([]);
    expect(nextHeight(replayed.scan)).toBe(101);
  });
});

describe("rescanning", () => {
  it("opens already synced from a birthday that was too late", () => {
    const example = openExample("rescan");

    expect(isSynced(example.scan, example.chain)).toBe(true);
    expect(walletBalance(example.scan)).toBe(zec(0.1));
    expect(nextAutoAction(example)).toBe("rescan");
  });

  it("rebuilds the history, spends included, from the earlier birthday", () => {
    const rescanned = applyAutoAction(openExample("rescan"), "rescan");

    expect(rescanned.scan.birthday).toBe(101);
    expect(rescanned.scan.notes).toEqual([]);

    const finished = playOut(rescanned);
    expect(noteById(finished, "A")?.spentAt).toBe(104);
    expect(noteById(finished, "B")?.change).toBe(true);
    expect(walletBalance(finished.scan)).toBe(zec(0.4) - zec(0.15) - PAYMENT_FEE + zec(0.1));
    expect(walletBalance(finished.scan)).toBe(chainBalance(finished.chain));
  });

  it("starts empty when the reader picks a birthday", () => {
    const example = openExample("rescan", 104);

    expect(example.scan.stored).toEqual([]);
    expect(nextHeight(example.scan)).toBe(104);
  });
});

describe("a reorg", () => {
  const syncedBeforeReorg = () => scanWhile(openExample("reorg"), (e) => nextAutoAction(e) === "scan");

  it("replaces the blocks above the fork with a longer branch", () => {
    const { chain, reorg } = SCENARIOS.reorg;

    expect(reorg!.chain.slice(0, 8)).toEqual(chain.slice(0, 8));
    expect(blockAt(reorg!.chain, 109)!.hash).not.toBe(blockAt(chain, 109)!.hash);
    expect(tipHeight(reorg!.chain)).toBeGreaterThan(tipHeight(chain));
  });

  it("happens after the wallet has synced the original chain", () => {
    const synced = syncedBeforeReorg();

    expect(nextAutoAction(synced)).toBe("reorg");
    expect(noteById(synced, "C")).toMatchObject({ receivedAt: 109 });
    expect(walletBalance(synced.scan)).toBe(zec(0.5));
  });

  it("notices the mismatch and rewinds to the common ancestor", () => {
    const reorged = reorgExample(syncedBeforeReorg());

    expect(reorged.orphaned.map((block) => block.height)).toEqual([109, 110]);
    expect(nextHeight(reorged.scan)).toBe(111);

    const rewound = scanExample(reorged);
    expect(rewound.scan.events[rewound.scan.events.length - 1]).toEqual({
      kind: "reorg",
      height: 111,
      commonAncestor: 108,
      dropped: ["C"],
      unspent: [],
    });
    expect(nextHeight(rewound.scan)).toBe(109);
    expect(noteById(rewound, "C")).toBeUndefined();
    expect(walletBalance(rewound.scan)).toBe(zec(0.3));
  });

  it("finds the payment again in its new block", () => {
    const finished = playOut(syncedBeforeReorg());

    expect(finished.reorged).toBe(true);
    expect(noteById(finished, "C")).toMatchObject({ receivedAt: 110 });
    expect(walletBalance(finished.scan)).toBe(zec(0.5));
    expect(finished.scan.stored.map((s) => s.hash)).toEqual(finished.chain.map((b) => b.hash));
  });

  it("follows the new chain without rewinding if it had not reached the fork", () => {
    const early = scanWhile(openExample("reorg"), (e) => nextHeight(e.scan) <= 105);
    const finished = playOut(reorgExample(early));

    expect(eventsOf(finished.scan.events, "reorg")).toEqual([]);
    expect(noteById(finished, "C")?.receivedAt).toBe(110);
  });

  it("unspends a note whose spend was in a replaced block", () => {
    const start = { start: 101, parentHash: "00" };
    const mine = { id: "A", value: zec(1), from: "Alice" };
    const old = buildChain([{ receive: [mine] }, {}, { spend: ["A"] }], { ...start, salt: "old" });
    const replacement = [
      ...old.slice(0, 2),
      ...buildChain([{}, {}], { start: 103, parentHash: old[1].hash, salt: "new" }),
    ];

    const spent = scanToTip(startScan(101), old);
    expect(walletBalance(spent)).toBe(0);

    const rewound = scanNext(spent, replacement);
    expect(eventsOf(rewound.events, "reorg")[0]).toMatchObject({ commonAncestor: 102, unspent: ["A"] });
    expect(walletBalance(rewound)).toBe(zec(1));
    expect(walletBalance(scanToTip(rewound, replacement))).toBe(zec(1));
  });

  it("falls back to the birthday when no stored block survives", () => {
    const old = buildChain([{}, {}], { start: 101, parentHash: "00", salt: "old" });
    const replacement = buildChain([{}, {}, {}], { start: 101, parentHash: "00", salt: "new" });
    const rewound = scanNext(scanToTip(startScan(102), old), replacement);

    expect(eventsOf(rewound.events, "reorg")[0]).toMatchObject({ commonAncestor: 101 });
    expect(nextHeight(rewound)).toBe(102);
  });
});

describe("the guided examples", () => {
  it.each(SCENARIO_ORDER)("%s plays through to the end", (id) => {
    expect(nextAutoAction(playOut(openExample(id)))).toBe("done");
  });

  it.each(SCENARIO_ORDER.filter((id): id is ScenarioId => id !== "late-birthday"))(
    "%s ends with the balance the chain really holds",
    (id) => {
      const finished = playOut(openExample(id));
      expect(walletBalance(finished.scan)).toBe(chainBalance(finished.chain));
    },
  );

  it("leaves the late birthday short, which is the point of it", () => {
    const finished = playOut(openExample("late-birthday"));
    expect(walletBalance(finished.scan)).toBeLessThan(chainBalance(finished.chain));
  });

  it("can be rescanned to any birthday without touching the chain", () => {
    const example = openExample("receive");
    const rescanned = rescanExample(example, 103);

    expect(rescanned.chain).toBe(example.chain);
    expect(nextHeight(rescanned.scan)).toBe(103);
  });
});

describe("formatZec", () => {
  it("shows whole and fractional amounts without float noise", () => {
    expect(formatZec(0)).toBe("0.00 ZEC");
    expect(formatZec(zec(0.25))).toBe("0.25 ZEC");
    expect(formatZec(zec(0.2999))).toBe("0.2999 ZEC");
    expect(formatZec(29_990_000 + 15_000_000)).toBe("0.4499 ZEC");
  });
});

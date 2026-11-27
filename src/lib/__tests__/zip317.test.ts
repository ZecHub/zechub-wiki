import {
  FEE_REDUCTION_HEIGHT,
  GRACE_ACTIONS,
  LEGACY_MARGINAL_FEE_ZATOSHIS,
  MARGINAL_FEE_ZATOSHIS,
  MIN_ORCHARD_ACTIONS,
  MIN_SAPLING_OUTPUTS,
  P2PKH_STANDARD_INPUT_SIZE,
  P2PKH_STANDARD_OUTPUT_SIZE,
  conventionalFee,
  logicalActions,
  marginalFeeAt,
  simpleTransfer,
} from "../zip317";

describe("ZIP 317 parameters", () => {
  it("matches the values published in the spec", () => {
    expect(MARGINAL_FEE_ZATOSHIS).toBe(1000);
    expect(LEGACY_MARGINAL_FEE_ZATOSHIS).toBe(5000);
    expect(GRACE_ACTIONS).toBe(2);
    expect(P2PKH_STANDARD_INPUT_SIZE).toBe(150);
    expect(P2PKH_STANDARD_OUTPUT_SIZE).toBe(34);
  });

  it("uses the ZIP 2009 activation heights", () => {
    expect(FEE_REDUCTION_HEIGHT.mainnet).toBe(3_590_000);
    expect(FEE_REDUCTION_HEIGHT.testnet).toBe(4_465_026);
  });

  it("matches the builders' shielded padding minimums", () => {
    expect(MIN_SAPLING_OUTPUTS).toBe(2);
    expect(MIN_ORCHARD_ACTIONS).toBe(2);
  });
});

describe("logicalActions", () => {
  it("counts transparent inputs and outputs as the larger of the two sides", () => {
    const actions = logicalActions({
      txInTotalSize: 10 * 150,
      txOutTotalSize: 2 * 34,
    });

    expect(actions.transparent).toBe(10);
    expect(actions.total).toBe(10);
  });

  it("rounds a partial standard size up to a whole action", () => {
    expect(logicalActions({ txOutTotalSize: 35 }).transparent).toBe(2);
    expect(logicalActions({ txInTotalSize: 151 }).transparent).toBe(2);
  });

  it("charges two actions per Sprout JoinSplit", () => {
    expect(logicalActions({ nJoinSplit: 3 }).sprout).toBe(6);
  });

  it("pairs Sapling spends with outputs instead of adding them", () => {
    expect(logicalActions({ nSpendsSapling: 2, nOutputsSapling: 1 }).sapling).toBe(2);
    expect(logicalActions({ nSpendsSapling: 2, nOutputsSapling: 5 }).sapling).toBe(5);
  });

  it("takes Orchard and Ironwood action counts directly", () => {
    const actions = logicalActions({ nActionsOrchard: 4, nActionsIronwood: 3 });

    expect(actions.orchard).toBe(4);
    expect(actions.ironwood).toBe(3);
  });

  it("sums one contribution per pool", () => {
    const actions = logicalActions({
      txInTotalSize: 150,
      nSpendsSapling: 1,
      nOutputsSapling: 2,
      nActionsOrchard: 2,
    });

    expect(actions.total).toBe(1 + 2 + 2);
  });

  it("bills the grace actions when a transaction is smaller than them", () => {
    expect(logicalActions({}).billed).toBe(2);
    expect(logicalActions({ nActionsOrchard: 1 }).billed).toBe(2);
    expect(logicalActions({ nActionsOrchard: 3 }).billed).toBe(3);
  });
});

describe("marginalFeeAt", () => {
  it("switches to 1,000 zatoshis at the Mainnet fee reduction height", () => {
    expect(marginalFeeAt(3_589_999)).toBe(5000);
    expect(marginalFeeAt(3_590_000)).toBe(1000);
    expect(marginalFeeAt(3_590_001, "mainnet")).toBe(1000);
  });

  it("uses the Testnet height on Testnet", () => {
    expect(marginalFeeAt(4_465_025, "testnet")).toBe(5000);
    expect(marginalFeeAt(4_465_026, "testnet")).toBe(1000);
    // A height that is past the switch on Mainnet is not on Testnet.
    expect(marginalFeeAt(4_000_000, "testnet")).toBe(5000);
  });
});

describe("conventionalFee", () => {
  it("is marginal_fee times max(grace_actions, logical_actions)", () => {
    expect(conventionalFee({})).toBe(2_000);
    expect(conventionalFee({ nActionsOrchard: 2 })).toBe(2_000);
    expect(conventionalFee({ nActionsOrchard: 10 })).toBe(10_000);
  });

  it("prices a ten input sweep into one output", () => {
    expect(
      conventionalFee({ txInTotalSize: 10 * 150, txOutTotalSize: 34 }),
    ).toBe(10_000);
  });

  it("ignores negative and fractional counts", () => {
    expect(conventionalFee({ nActionsOrchard: -5 })).toBe(2_000);
    expect(conventionalFee({ nSpendsSapling: 2.9 })).toBe(2_000);
  });

  it("charges the pre-ZIP 2009 fee for a block before the reduction", () => {
    expect(conventionalFee({}, marginalFeeAt(3_589_999))).toBe(10_000);
    expect(conventionalFee({ nActionsOrchard: 10 }, LEGACY_MARGINAL_FEE_ZATOSHIS)).toBe(50_000);
  });
});

describe("simpleTransfer", () => {
  // Logical actions per pair once the builders pad the shielded bundles:
  // Sapling to two outputs, Orchard to two Actions.
  it.each([
    ["transparent", "transparent", 2, 2_000],
    ["transparent", "sapling", 3, 3_000],
    ["transparent", "orchard", 3, 3_000],
    ["sapling", "transparent", 3, 3_000],
    ["sapling", "sapling", 2, 2_000],
    ["sapling", "orchard", 4, 4_000],
    ["orchard", "transparent", 3, 3_000],
    ["orchard", "sapling", 4, 4_000],
    ["orchard", "orchard", 2, 2_000],
    // NU6.3: Ironwood Actions are priced and padded like Orchard's.
    ["transparent", "ironwood", 3, 3_000],
    ["ironwood", "transparent", 3, 3_000],
    ["sapling", "ironwood", 4, 4_000],
    ["orchard", "ironwood", 4, 4_000],
    ["ironwood", "ironwood", 2, 2_000],
  ] as const)("prices %s to %s as %i logical actions", (from, to, total, fee) => {
    expect(logicalActions(simpleTransfer(from, to)).total).toBe(total);
    expect(conventionalFee(simpleTransfer(from, to))).toBe(fee);
  });

  it("keeps the recipient and the change in the pools they belong to", () => {
    expect(simpleTransfer("transparent", "transparent")).toMatchObject({
      txInTotalSize: 150,
      txOutTotalSize: 2 * 34,
    });

    expect(simpleTransfer("sapling", "sapling")).toMatchObject({
      nSpendsSapling: 1,
      nOutputsSapling: 2,
    });
  });

  it("pads a lone shielded output to the builder minimum", () => {
    expect(simpleTransfer("transparent", "orchard")).toMatchObject({
      txInTotalSize: 150,
      txOutTotalSize: 34,
      nActionsOrchard: MIN_ORCHARD_ACTIONS,
    });

    expect(simpleTransfer("orchard", "sapling")).toMatchObject({
      nSpendsSapling: 0,
      nOutputsSapling: MIN_SAPLING_OUTPUTS,
      nActionsOrchard: MIN_ORCHARD_ACTIONS,
    });
  });

  it("adds no bundle for a pool the transfer does not touch", () => {
    expect(simpleTransfer("transparent", "transparent")).toMatchObject({
      nSpendsSapling: 0,
      nOutputsSapling: 0,
      nActionsOrchard: 0,
      nActionsIronwood: 0,
    });
  });

  it("puts an Orchard-to-Ironwood payment's change back in Orchard", () => {
    // The sender's change may stay in Orchard (their own address); the
    // payment itself is an Ironwood output.
    expect(simpleTransfer("orchard", "ironwood")).toMatchObject({
      nActionsOrchard: MIN_ORCHARD_ACTIONS,
      nActionsIronwood: MIN_ORCHARD_ACTIONS,
    });
  });
});

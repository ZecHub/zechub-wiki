import {
  GRACE_ACTIONS,
  MARGINAL_FEE_ZATOSHIS,
  P2PKH_STANDARD_INPUT_SIZE,
  P2PKH_STANDARD_OUTPUT_SIZE,
  type Pool,
  conventionalFee,
  logicalActions,
  simpleTransfer,
} from "../zip317";

const POOLS: Pool[] = ["transparent", "sapling", "orchard"];

describe("ZIP 317 parameters", () => {
  it("matches the values published in the spec", () => {
    expect(MARGINAL_FEE_ZATOSHIS).toBe(5000);
    expect(GRACE_ACTIONS).toBe(2);
    expect(P2PKH_STANDARD_INPUT_SIZE).toBe(150);
    expect(P2PKH_STANDARD_OUTPUT_SIZE).toBe(34);
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

describe("conventionalFee", () => {
  it("is marginal_fee times max(grace_actions, logical_actions)", () => {
    expect(conventionalFee({})).toBe(10_000);
    expect(conventionalFee({ nActionsOrchard: 2 })).toBe(10_000);
    expect(conventionalFee({ nActionsOrchard: 10 })).toBe(50_000);
  });

  it("prices a ten input sweep into one output", () => {
    expect(
      conventionalFee({ txInTotalSize: 10 * 150, txOutTotalSize: 34 }),
    ).toBe(50_000);
  });

  it("ignores negative and fractional counts", () => {
    expect(conventionalFee({ nActionsOrchard: -5 })).toBe(10_000);
    expect(conventionalFee({ nSpendsSapling: 2.9 })).toBe(10_000);
  });
});

describe("simpleTransfer", () => {
  it.each(POOLS.flatMap((from) => POOLS.map((to) => [from, to] as const)))(
    "costs the 0.0001 ZEC minimum from %s to %s",
    (from, to) => {
      const actions = logicalActions(simpleTransfer(from, to));

      expect(actions.total).toBe(2);
      expect(conventionalFee(simpleTransfer(from, to))).toBe(10_000);
    },
  );

  it("keeps the recipient and the change in the pools they belong to", () => {
    expect(simpleTransfer("transparent", "orchard")).toMatchObject({
      txInTotalSize: 150,
      txOutTotalSize: 34,
      nActionsOrchard: 1,
    });

    expect(simpleTransfer("sapling", "sapling")).toMatchObject({
      nSpendsSapling: 1,
      nOutputsSapling: 2,
    });
  });
});

import { logicalActions, simpleTransfer, type Pool } from "../zip317";
import {
  EMPTY_SHAPE,
  FEE_REDUCTION_HEIGHT,
  FEE_SCHEDULES,
  MAX_COUNT,
  estimateFee,
  parseCount,
  shapeToTransaction,
  transferShape,
  zatsToZec,
} from "../zip317-calculator";

const fee = (id: string) => FEE_SCHEDULES.find((s) => s.id === id)!.marginalFee;
const POOLS: Pool[] = ["transparent", "sapling", "orchard", "ironwood"];

describe("fee schedules", () => {
  it("offers ZIP 2009's 1,000 zats and ZIP 317's original 5,000 zats", () => {
    expect(fee("zip2009")).toBe(1000);
    expect(fee("zip317")).toBe(5000);
  });

  it("uses the ZIP 2009 activation heights", () => {
    expect(FEE_REDUCTION_HEIGHT).toEqual({ mainnet: 3_590_000, testnet: 4_465_026 });
  });
});

describe("estimateFee", () => {
  // ZIP 317: a minimal transaction pays grace_actions × marginal_fee, which is
  // the original conventional fee of 10,000 zatoshis. ZIP 2009 cuts it to 2,000.
  it("prices a minimal transaction at the grace actions", () => {
    expect(estimateFee(EMPTY_SHAPE, fee("zip317")).feeZats).toBe(10_000);
    expect(estimateFee(EMPTY_SHAPE, fee("zip2009")).feeZats).toBe(2_000);
  });

  it("charges the larger side of a transparent sweep", () => {
    const sweep = { ...EMPTY_SHAPE, transparentInputs: 10, transparentOutputs: 1 };
    const estimate = estimateFee(sweep, fee("zip317"));

    expect(estimate.actions.transparent).toBe(10);
    expect(estimate.feeZats).toBe(50_000);
    expect(estimateFee(sweep, fee("zip2009")).feeZats).toBe(10_000);
  });

  it("adds one contribution per pool", () => {
    const shielding = { ...EMPTY_SHAPE, transparentInputs: 3, orchardOutputs: 1 };
    const estimate = estimateFee(shielding, fee("zip2009"));

    expect(estimate.actions).toMatchObject({ transparent: 3, orchard: 2, total: 5, billed: 5 });
    expect(estimate.feeZats).toBe(5_000);
  });
});

describe("shapeToTransaction", () => {
  it("pads a used Sapling bundle to two outputs and leaves unused pools empty", () => {
    expect(shapeToTransaction({ ...EMPTY_SHAPE, saplingSpends: 1 })).toEqual({
      txInTotalSize: 0,
      txOutTotalSize: 0,
      nSpendsSapling: 1,
      nOutputsSapling: 2,
      nActionsOrchard: 0,
      nActionsIronwood: 0,
    });
  });

  it("needs one Orchard or Ironwood Action per spend or output on the busier side", () => {
    const tx = shapeToTransaction({ ...EMPTY_SHAPE, orchardSpends: 5, orchardOutputs: 2, ironwoodOutputs: 1 });

    expect(tx.nActionsOrchard).toBe(5);
    expect(tx.nActionsIronwood).toBe(2);
  });

  it("sizes transparent counts as standard P2PKH", () => {
    expect(shapeToTransaction({ ...EMPTY_SHAPE, transparentInputs: 2, transparentOutputs: 3 })).toMatchObject({
      txInTotalSize: 300,
      txOutTotalSize: 102,
    });
  });

  it("ignores negative, fractional and oversized counts", () => {
    const tx = shapeToTransaction({ ...EMPTY_SHAPE, saplingSpends: -4, orchardSpends: 2.7, ironwoodOutputs: 1e9 });

    expect(tx.nSpendsSapling).toBe(0);
    expect(tx.nActionsOrchard).toBe(2);
    expect(tx.nActionsIronwood).toBe(MAX_COUNT);
  });
});

describe("transferShape", () => {
  // The payment presets must agree with the wallet model already in zip317.ts.
  it.each(POOLS.flatMap((from) => POOLS.map((to) => [from, to] as const)))(
    "matches simpleTransfer for %s to %s",
    (from, to) => {
      const tx = shapeToTransaction(transferShape(from, to));

      expect(logicalActions(tx)).toEqual(logicalActions(simpleTransfer(from, to)));
    },
  );

  it("prices an Orchard payment at 2,000 zats under ZIP 2009", () => {
    expect(estimateFee(transferShape("orchard", "orchard"), fee("zip2009")).feeZats).toBe(2_000);
    expect(estimateFee(transferShape("orchard", "sapling"), fee("zip2009")).feeZats).toBe(4_000);
  });
});

describe("parseCount", () => {
  it("accepts whole numbers only", () => {
    expect(parseCount(" 7 ")).toBe(7);
    expect(parseCount("")).toBe(0);
    expect(parseCount("-1")).toBe(0);
    expect(parseCount("1.5")).toBe(0);
    expect(parseCount("1e3")).toBe(0);
    expect(parseCount("999999")).toBe(MAX_COUNT);
  });
});

describe("zatsToZec", () => {
  it("converts exactly and trims trailing zeros", () => {
    expect(zatsToZec(10_000)).toBe("0.0001");
    expect(zatsToZec(2_000)).toBe("0.00002");
    expect(zatsToZec(100_000_000)).toBe("1");
    expect(zatsToZec(150_000_001)).toBe("1.50000001");
  });
});

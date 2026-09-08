import { parseNumber } from "../zips/grantParsers";
import { transformGrantData } from "../zips/transformGrantData";
import { computeFinancialStats, computeStats } from "../zips/helpers";
import type { RawGrantRow } from "@/types/grants";

describe("formatted ZEC disbursements", () => {
  it.each<[string, number]>([
    ["5,417.12", 5417.12],
    ["1,698.27", 1698.27],
    [" 1,234,567.12345678 ", 1234567.12345678],
    ["-1,234.5", -1234.5],
    ["1234.5", 1234.5],
    ["0.00000001", 0.00000001],
    ["0", 0],
  ])("parses %s as %s", (input, expected) => {
    expect(parseNumber(input)).toBe(expected);
  });

  it.each([undefined, "", " ", "N/A", "NaN", "Infinity", "1e999", "1,23.45", "1,,234"])(
    "treats missing or invalid input %s as unavailable",
    (input) => {
      expect(parseNumber(input)).toBeNull();
    },
  );

  it("retains grants with grouped amounts in both dashboard total paths", () => {
    // Amounts and project names from the public ZCG sheet (2026-09-08):
    // https://docs.google.com/spreadsheets/d/1FQ28rDCyRW0TiNxrm3rgD8ai2KGUsXAjPieQmI1kKKg/edit#gid=803214474
    const row = (project: string, milestone: string, zec: string): RawGrantRow => ({
      Project: project,
      Grantee: project,
      "Category (as determined by ZCG)": "Wallets",
      Milestone: milestone,
      "ZEC Disbursed": zec,
    });
    const grants = transformGrantData([
      row("YWallet", "1", "5,417.12"),
      row("Keystone Hardware Wallet", "2", "1,698.27"),
      row("Keystone Hardware Wallet", "3", "1,698.27"),
      row("Unpaid example", "1", "N/A"),
    ]);

    expect(grants[0].summary.totalZecDisbursed).toBeCloseTo(5417.12, 8);
    expect(grants[1].summary.totalZecDisbursed).toBeCloseTo(3396.54, 8);
    expect(grants[2].milestones[0].zecDisbursed).toBeNull();
    expect(grants[2].summary.completedMilestones).toBe(0);
    expect(computeStats(grants).totalZec).toBeCloseTo(8813.66, 8);
    expect(computeFinancialStats(grants).totalZecDisbursed).toBeCloseTo(8813.66, 8);
  });
});

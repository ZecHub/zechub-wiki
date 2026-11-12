import { disbursedOverTime, zecUsdRateOverTime } from "../helpers";
import { transformGrantData } from "../transformGrantData";
import { RawGrantRow } from "@/types/grants";

// Real sheet row: the date differs from the usual "d MMM yyyy" format.
const nighthawk: RawGrantRow = {
  Project: "Nighthawk Wallet Design & Development '21",
  Grantee: "NightHawk",
  "Category (as determined by ZCG)": "Wallets",
  Milestone: "3",
  "Amount (USD)": "$105,369.00",
  "Paid Out": "Oct 4, 2021",
  "ZEC Disbursed": "906.712187",
  "ZEC/USD": "$116.21",
  "Grant Status": "Completed",
};

function milestone(date: string, amount: string): RawGrantRow {
  return { ...nighthawk, "Paid Out": date, "Amount (USD)": amount };
}

describe("grant payout history", () => {
  it("includes the recorded month-first Nighthawk payout in disbursements", () => {
    expect(disbursedOverTime(transformGrantData([nighthawk]))).toEqual([
      { month: "2021-10", amount: 105369 },
    ]);
  });

  it("includes the same payout in the exchange-rate history", () => {
    expect(zecUsdRateOverTime(transformGrantData([nighthawk]))).toEqual([
      {
        date: "2021-10-04",
        rate: 116.21,
        project: nighthawk.Project,
        amount: 105369,
      },
    ]);
  });

  it("combines both date formats into one calendar-month total", () => {
    const grants = transformGrantData([
      nighthawk,
      milestone(" 5 Oct 2021 ", "$1,000"),
      milestone(" Oct 6, 2021 ", "$500"),
    ]);
    expect(disbursedOverTime(grants)).toEqual([
      { month: "2021-10", amount: 106869 },
    ]);
  });

  it("sorts months and rate dates across year boundaries", () => {
    const grants = transformGrantData([
      milestone("Jan 1, 2022", "$200"),
      milestone("31 Dec 2021", "$100"),
    ]);
    expect(disbursedOverTime(grants)).toEqual([
      { month: "2021-12", amount: 100 },
      { month: "2022-01", amount: 200 },
    ]);
    expect(zecUsdRateOverTime(grants).map(({ date }) => date)).toEqual([
      "2021-12-31",
      "2022-01-01",
    ]);
  });

  it("skips absent, malformed and impossible dates without rolling them forward", () => {
    const grants = transformGrantData([
      milestone("", "$100"),
      milestone("not a date", "$200"),
      milestone("29 Feb 2021", "$300"),
      milestone("Feb 29, 2021", "$400"),
      milestone("Feb 29, 2024", "$500"),
    ]);
    expect(disbursedOverTime(grants)).toEqual([
      { month: "2024-02", amount: 500 },
    ]);
    expect(zecUsdRateOverTime(grants).map(({ date }) => date)).toEqual([
      "2024-02-29",
    ]);
  });

  it("keeps empty grant histories empty", () => {
    expect(disbursedOverTime([])).toEqual([]);
    expect(zecUsdRateOverTime([])).toEqual([]);
  });
});

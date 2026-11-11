import type { ReactElement } from "react";
import { render, screen, within } from "@testing-library/react";
import SheetTreasuryTab from "../Charts/SheetTreasuryTab";

jest.mock("@/i18n/navigation", () => ({ Link: "a" }));

// JSDOM has no layout measurements; give the real chart a fixed viewport.
jest.mock("recharts", () => ({
  ...jest.requireActual("recharts"),
  ResponsiveContainer: ({ children }: { children: ReactElement }) =>
    jest.requireActual("react").cloneElement(children, { width: 500, height: 280 }),
}));

const treasurySheet = {
  table: {
    cols: [],
    rows: [
      { c: [{ v: "FPF" }, null, null] },
      { c: [{ v: "Category" }, null, { v: "Allocation" }] },
      { c: [{ v: "Global Ambassador Provisioning" }, { v: 0 }, { v: "0.00%" }] },
      { c: [{ v: "Hackathon" }, { v: 25 }, { v: "55.56%" }] },
      { c: [{ v: "Community Proposals" }, { v: 10 }, { v: "22.22%" }] },
      { c: [{ v: "Small Bounty Fund" }, { v: 10 }, { v: "22.22%" }] },
    ],
  },
};

describe("Treasury chart units", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("shows ZEC balances in the chart and percentages only in the allocation column", async () => {
    global.fetch = jest.fn(async (input) => {
      if (String(input).startsWith("https://docs.google.com/spreadsheets/")) {
        return { ok: true, text: async () => JSON.stringify(treasurySheet) };
      }
      if (String(input).startsWith("/api/prices/simple?")) {
        return { ok: true, json: async () => ({ zcash: { usd: 521 } }) };
      }
      throw new Error(`Unexpected fetch: ${input}`);
    }) as jest.Mock;

    render(<SheetTreasuryTab />);

    expect(await screen.findByText("25 ZEC")).toBeInTheDocument();
    expect(screen.getAllByText("10 ZEC")).toHaveLength(2);
    expect(screen.queryByText("55.56 ZEC")).not.toBeInTheDocument();
    expect(screen.queryByText("22.22 ZEC")).not.toBeInTheDocument();
    expect(screen.getByText("55.56%")).toBeInTheDocument();
    expect(screen.getAllByText("22.22%")).toHaveLength(2);
  });
});

// Representative balances and obligations from the public 2026 treasury sheet.
const pricingSheet = {
  table: {
    cols: [],
    rows: [
      { c: [{ v: "Zcash Price" }, { v: 1500 }] },
      { c: [{ v: "Penumbra Price" }, { v: 0.01 }] },
      { c: [{ v: "Namada Price" }, { v: 0.0007 }] },
      { c: [{ v: "FPF" }, null] },
      { c: [{ v: "Category" }, null, { v: "Allocation" }] },
      { c: [{ v: "Total ZEC Remaining (FPF)" }, { v: 40.07 }] },
      { c: [{ v: "Total USD Value" }, { v: 60105 }] },
      { c: [{ v: "USD Reserved" }, { v: 30870 }] },
      { c: [{ v: "Current ZEC Value" }, { v: 20.58 }] },
      { c: [{ v: "ZecHub Donations" }, null] },
      { c: [{ v: "Total ZEC Remaining" }, { v: 364.78 }] },
      { c: [{ v: "Total USD Value" }, { v: 547170 }] },
      { c: [{ v: "ZecHub Treasury (ZecHub Inc)" }, null] },
      { c: [{ v: "Total ZEC Remaining" }, { v: 71.131 }] },
      { c: [{ v: "Total USD Value" }, { v: 106696.5 }] },
      { c: [{ v: "Penumbra Threshold Custody" }, null] },
      { c: [{ v: "Total UM Remaining" }, { v: 819.1 }] },
      { c: [{ v: "Total USD Value" }, { v: 8.191 }] },
      { c: [{ v: "Namada Treasury" }, null] },
      { c: [{ v: "Total NAM Remaining" }, { v: 229162 }] },
      { c: [{ v: "Total USD Value" }, { v: 160.4134 }] },
      { c: [{ v: "Total Paid Out USD | ZEC" }, { v: 17850 }] },
      { c: [{ v: "To Be Paid Out USD | ZEC" }, { v: 30870 }] },
    ],
  },
};

describe("Treasury live ZEC pricing", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  function mockQuote(price: unknown, ok = true) {
    global.fetch = jest.fn(async (input) => {
      if (String(input).startsWith("https://docs.google.com/spreadsheets/")) {
        return { ok: true, text: async () => JSON.stringify(pricingSheet) };
      }
      if (String(input).startsWith("/api/prices/simple?")) {
        return { ok, status: ok ? 200 : 503, json: async () => ({ zcash: { usd: price } }) };
      }
      throw new Error(`Unexpected fetch: ${input}`);
    }) as jest.Mock;
  }

  function field(label: string) {
    return within(screen.getByText(label).parentElement!);
  }

  it("revalues ZEC holdings without changing other asset valuations", async () => {
    mockQuote(3000);
    render(<SheetTreasuryTab />);

    await screen.findByText("Treasury overview");
    expect(field("Zcash Price").getByText("$3,000")).toBeInTheDocument();
    expect(screen.getByText("$120,210")).toBeInTheDocument();
    expect(screen.getByText("$1,094,340")).toBeInTheDocument();
    expect(screen.getByText("$213,393")).toBeInTheDocument();
    expect(screen.getByText("$8.19")).toBeInTheDocument();
    expect(screen.getByText("$160.41")).toBeInTheDocument();
    expect(field("Penumbra Price").getByText("$0.01")).toBeInTheDocument();
    expect(field("Namada Price").getByText("$0.0007")).toBeInTheDocument();
  });

  it("preserves fixed dollar reserves and payouts when ZEC changes price", async () => {
    mockQuote(3000);
    render(<SheetTreasuryTab />);

    await screen.findByText("Treasury overview");
    expect(field("USD Reserved").getByText("$30,870")).toBeInTheDocument();
    expect(screen.getByText("$17,850")).toBeInTheDocument();
    expect(screen.getAllByText("$30,870")).toHaveLength(2);
  });

  it.each([0, -100, NaN, Infinity, undefined])(
    "keeps sheet valuations when the live quote is unavailable (%s)",
    async (price) => {
      mockQuote(price);
      render(<SheetTreasuryTab />);

      await screen.findByText("Treasury overview");
      expect(field("Zcash Price").getByText("$1,500")).toBeInTheDocument();
      expect(screen.getByText("$60,105")).toBeInTheDocument();
      expect(screen.getByText("$547,170")).toBeInTheDocument();
      expect(screen.getByText("$8.19")).toBeInTheDocument();
      expect(field("USD Reserved").getByText("$30,870")).toBeInTheDocument();
    },
  );

  it("keeps sheet valuations when the live quote request fails", async () => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    mockQuote(undefined, false);
    render(<SheetTreasuryTab />);

    await screen.findByText("Treasury overview");
    expect(field("Zcash Price").getByText("$1,500")).toBeInTheDocument();
    expect(screen.getByText("$60,105")).toBeInTheDocument();
    expect(screen.getByText("$160.41")).toBeInTheDocument();
  });
});

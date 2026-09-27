import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
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

import React, { type ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChainStatePage from "@/components/Charts/Zcash/ChainState/ChainStatePage";
import { topExpiryDeltas } from "@/lib/chart/chainState";

jest.mock("@/lib/chart/chainState", () => {
  const actual = jest.requireActual("@/lib/chart/chainState");
  return { ...actual, topExpiryDeltas: jest.fn(actual.topExpiryDeltas) };
});

// JSDOM has no layout measurements; give the charts a fixed viewport.
jest.mock("recharts", () => ({
  ...jest.requireActual("recharts"),
  ResponsiveContainer: ({ children }: { children: ReactElement }) =>
    jest.requireActual("react").cloneElement(children, { width: 800, height: 400 }),
}));

describe("topExpiryDeltas", () => {
  it("keeps the 30 most frequent deltas and folds the rest into one bar", () => {
    const histogram: Record<string, number> = {};
    for (let i = 1; i <= 40; i++) histogram[String(i * 10)] = i;

    const bars = topExpiryDeltas(histogram);

    expect(bars).toHaveLength(31);
    expect(bars[0]).toEqual({ delta: 400, count: 40 });
    expect(bars[29]).toEqual({ delta: 110, count: 11 });
    expect(bars[30]).toEqual({ delta: "other", count: 55 });
  });

  it("orders equal counts by delta", () => {
    expect(topExpiryDeltas({ "50": 2, "40": 2, "30": 5 }, 2)).toEqual([
      { delta: 30, count: 5 },
      { delta: 40, count: 2 },
      { delta: "other", count: 2 },
    ]);
  });

  it("adds no other bar when every delta fits", () => {
    expect(topExpiryDeltas({ "20": 1, "10": 3 })).toEqual([
      { delta: 10, count: 3 },
      { delta: 20, count: 1 },
    ]);
  });

  it("returns no bars without a histogram", () => {
    expect(topExpiryDeltas(undefined)).toEqual([]);
  });
});

const totals = () => ({
  expiry: { total: 2, zero: 0, nonzero: 2, pre_overwinter: 0, zero_fraction: 0 },
  counts: { blocks: 576, txs: 2 },
  shielded: {
    sapling_spends: 1,
    sapling_outputs: 1,
    orchard_actions: 0,
    ironwood_actions: 0,
    sprout_joinsplits: 0,
  },
  types: {
    v1: 0, v2: 0, v3: 0, v4: 2, v5: 0, v6: 0, other: 0,
    coinbase: 1, user: 1, fully_shielded: 0, mixed: 1, transparent_only: 1,
  },
  addresses: { unique_receivers: 1, total_receiving_outputs: 1 },
  blocks: { blocks: 576, total_txs: 2, avg_txs_per_block: 1, max_txs_per_block: 1 },
  locktime: { nonzero: 0, zero: 2, high_sequence: 2 },
  spends: {
    indexer_populated: false,
    probed: 0,
    outpoint_hits: 0,
    sapling_nullifier_hits: 0,
    orchard_nullifier_hits: 0,
    ironwood_nullifier_hits: 0,
    sprout_nullifier_hits: 0,
  },
});

const histogram = { "20": 3, "40": 1 };
const results = {
  ...totals(),
  expiry: { ...totals().expiry, delta_histogram: histogram },
  per_day: [0, 1, 2].map((i) => ({ day: i, start: i * 576, end: i * 576 + 575, ...totals() })),
};

describe("Chain State page", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.mocked(topExpiryDeltas).mockClear();
    global.fetch = jest.fn(async () => ({ json: async () => results })) as jest.Mock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("ranks the expiry histogram once per load, not on every render", async () => {
    const user = userEvent.setup();
    render(<ChainStatePage />);

    const log = await screen.findByRole("checkbox", { name: "Log" });
    await user.click(log);
    await user.click(log);
    const chart = screen.getByRole("combobox");
    await user.selectOptions(chart, "expiry_delta");
    await user.selectOptions(chart, "txs");

    const ranked = jest
      .mocked(topExpiryDeltas)
      .mock.calls.filter(([h]) => h === histogram);
    expect(ranked).toHaveLength(1);
  });
});

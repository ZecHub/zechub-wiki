import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ChainStatePage from "@/components/Charts/Zcash/ChainState/ChainStatePage";

// Recharts measures a real layout; jsdom has none. Render each chart's data
// as JSON instead so the series the page builds can be read back.
jest.mock("recharts", () => {
  const chart =
    (name: string) =>
    ({ data }: { data?: unknown[] }) => (
      <pre data-testid={name}>{JSON.stringify(data ?? [])}</pre>
    );
  const none = () => null;
  return {
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    LineChart: chart("line-chart"),
    BarChart: chart("bar-chart"),
    ComposedChart: chart("composed-chart"),
    Line: none,
    Bar: none,
    XAxis: none,
    YAxis: none,
    CartesianGrid: none,
    Tooltip: none,
    Legend: none,
  };
});

const NU7_HEIGHT = 3_543_405;
const SEED_ZATS = 36_858_933_920; // NU7 seed window in the published results.json
const FEE_ZATS = 10_000_000; // 0.1 ZEC per later window

type Window = { day: number; start: number; end: number; shielded: { nsm_value_balance: number } };

function buildResults() {
  const per_day: Window[] = [];
  // Pre-NU7 windows of 1,152 blocks from genesis, then 3,456-block windows.
  let start = 0;
  let day = 0;
  while (start + 1152 <= 3_542_304) {
    per_day.push({ day: day++, start, end: start + 1151, shielded: { nsm_value_balance: 0 } });
    start += 1152;
  }
  per_day.push({ day: day++, start: 3_542_304, end: 3_543_455, shielded: { nsm_value_balance: SEED_ZATS } });
  start = 3_543_456;
  for (let i = 0; i < 20; i++) {
    per_day.push({ day: day++, start, end: start + 3455, shielded: { nsm_value_balance: FEE_ZATS } });
    start += 3456;
  }
  const zeros = (keys: string[]) => Object.fromEntries(keys.map((k) => [k, 0]));
  return {
    expiry: { ...zeros(["total", "zero", "nonzero", "pre_overwinter", "zero_fraction"]), delta_histogram: {} },
    counts: zeros(["blocks", "txs"]),
    shielded: zeros([
      "sapling_spends", "sapling_outputs", "orchard_actions", "ironwood_actions", "sprout_joinsplits",
      "nsm_value_balance",
    ]),
    types: zeros([
      "v1", "v2", "v3", "v4", "v5", "v6", "other", "coinbase", "user", "fully_shielded", "mixed",
      "transparent_only", "shielded_coinbase", "transparent_coinbase",
    ]),
    addresses: zeros(["unique_receivers", "total_receiving_outputs"]),
    blocks: zeros(["blocks", "total_txs", "avg_txs_per_block", "max_txs_per_block"]),
    locktime: zeros(["nonzero", "zero", "high_sequence"]),
    spends: {
      indexer_populated: false,
      ...zeros([
        "probed", "outpoint_hits", "sapling_nullifier_hits", "orchard_nullifier_hits",
        "ironwood_nullifier_hits", "sprout_nullifier_hits",
      ]),
    },
    shielded_coinbases: [],
    per_day,
  };
}

const originalFetch = global.fetch;

beforeEach(() => {
  const results = buildResults();
  global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(results) }) as unknown as typeof fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
});

async function openChart(label: string) {
  render(<ChainStatePage />);
  const select = await screen.findByRole("combobox");
  fireEvent.change(select, { target: { value: label } });
}

function lineSeries(): Array<{ day: number; nsm_cumul: number }> {
  return JSON.parse(screen.getByTestId("line-chart").textContent || "[]");
}

describe("Chain State NSM chart", () => {
  it("keeps the cumulative reserve absolute when zoomed in", async () => {
    await openChart("nsm");
    expect(lineSeries()[0].nsm_cumul).toBeCloseTo(SEED_ZATS / 1e8, 4);

    fireEvent.click(screen.getByRole("button", { name: "Week" }));

    const zoomed = lineSeries();
    expect(zoomed.length).toBeGreaterThan(0);
    expect(zoomed[0].day).toBeGreaterThan(NU7_HEIGHT);
    // Every zoomed window still includes the NU7 seed and the fees before it.
    for (const row of zoomed) {
      const windowsSoFar = Math.round((row.day - 3_543_456) / 3456) + 1;
      expect(row.nsm_cumul).toBeCloseTo((SEED_ZATS + windowsSoFar * FEE_ZATS) / 1e8, 4);
    }
  });

  it("does not go blank when a pre-NU7 zoom from another chart is carried over", async () => {
    await openChart("txs");
    // Week zooms to the middle of the whole chain, long before NU7.
    fireEvent.click(screen.getByRole("button", { name: "Week" }));

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "nsm" } });

    const series = lineSeries();
    expect(series.length).toBe(21);
    expect(series[series.length - 1].nsm_cumul).toBeCloseTo((SEED_ZATS + 20 * FEE_ZATS) / 1e8, 4);
  });
});

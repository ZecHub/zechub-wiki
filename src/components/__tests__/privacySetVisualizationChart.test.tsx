import { createRef, type ReactElement } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import PrivacySetVisualizationChart from "../Charts/Zcash/PrivacySetVisualizationChart";
import { blockHeightToYear } from "@/lib/chart/helpers";

// JSDOM has no layout measurements; give the real chart a fixed viewport.
jest.mock("recharts", () => ({
  ...jest.requireActual("recharts"),
  ResponsiveContainer: ({ children }: { children: ReactElement }) =>
    jest.requireActual("react").cloneElement(children, { width: 800, height: 400 }),
}));

// flowbite-react pulls in an ESM-only dependency that Jest does not transform;
// the chart container only needs its loading spinner.
jest.mock("flowbite-react", () => ({ Spinner: () => null }));

// Daily samples from public/data/zcash/transaction_summary.json are keyed by
// block height. Mainnet year boundaries (first block of the year, UTC):
// 2019 -> 455,853, 2025 -> 2,770,557, 2026 -> 3,189,008.
const transactionSummary = [
  { height: 440064, sapling: 100, orchard: 0 }, // Dec 2018
  { height: 3000960, sapling: 300, orchard: 400 }, // Jul 2025
  { height: 3400704, sapling: 500, orchard: 600 }, // Aug 2026
];

describe("Shielded outputs by year", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn(async (input) => {
      if (String(input) === "/data/zcash/transaction_summary.json") {
        return { ok: true, json: async () => transactionSummary };
      }
      throw new Error(`Unexpected fetch: ${input}`);
    }) as jest.Mock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("buckets blocks into the calendar year they were mined in", async () => {
    render(
      <PrivacySetVisualizationChart chartRef={createRef<HTMLDivElement>()} />,
    );

    fireEvent.click(
      await screen.findByRole("button", { name: "Switch to Circular View" }),
    );

    // One label per pool cluster (Sapling + Orchard).
    expect(await screen.findAllByText("2026")).toHaveLength(2);
    expect(screen.getAllByText("2025")).toHaveLength(2);
    expect(screen.getAllByText("2018")).toHaveLength(2);
    // Late-2018 Sapling blocks are not 2019 blocks.
    expect(screen.queryByText("2019")).not.toBeInTheDocument();

    // Cumulative Sapling: 100 (2018) -> 400 (2025) -> 900 (2026).
    // Cumulative Orchard: 0 (2018) -> 400 (2025) -> 1000 (2026) = "1.0k".
    // Before the fix the 2025 circles showed 900 / 1.0k because 2026 blocks
    // were counted as 2025.
    expect(screen.getAllByText("400")).toHaveLength(2);
    expect(screen.getByText("900")).toBeInTheDocument();
    expect(screen.getByText("1.0k")).toBeInTheDocument();
  });

  it("labels tooltip values as transaction counts, not ZEC", async () => {
    const { container } = render(
      <PrivacySetVisualizationChart chartRef={createRef<HTMLDivElement>()} />,
    );
    await waitFor(() =>
      expect(container.querySelector(".recharts-wrapper")).not.toBeNull(),
    );

    await act(async () => {
      fireEvent.mouseMove(container.querySelector(".recharts-wrapper")!, {
        clientX: 100,
        clientY: 200,
      });
    });

    const tooltip = await waitFor(() => {
      const el = container.querySelector(".recharts-tooltip-wrapper");
      expect(el?.textContent).toContain("Sapling Pool");
      return el!;
    });
    expect(tooltip.textContent).not.toContain("ZEC");
  });
});

describe("blockHeightToYear", () => {
  it("uses the real first block of each year (UTC)", () => {
    expect(blockHeightToYear(419_328)).toBe(2018); // first Sapling sample
    expect(blockHeightToYear(455_852)).toBe(2018); // 2018-12-31 23:58:57
    expect(blockHeightToYear(455_853)).toBe(2019); // 2019-01-01 00:00:20
    expect(blockHeightToYear(3_189_007)).toBe(2025); // 2025-12-31 23:59:35
    expect(blockHeightToYear(3_189_008)).toBe(2026); // 2026-01-01 00:00:46
  });

  it("keeps advancing past the last known year", () => {
    expect(blockHeightToYear(3_490_560)).toBe(2026);
    expect(blockHeightToYear(3_189_008 + 1_152 * 365)).toBe(2027);
  });
});

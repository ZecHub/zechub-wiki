import { createRef, type ReactElement } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import TransactionsSummaryChart from "../Charts/Zcash/TransactionSummaryChart";

// JSDOM has no layout measurements; give the real chart a fixed viewport.
jest.mock("recharts", () => ({
  ...jest.requireActual("recharts"),
  ResponsiveContainer: ({ children }: { children: ReactElement }) =>
    jest
      .requireActual("react")
      .cloneElement(children, { width: 800, height: 400 }),
}));

// flowbite-react pulls in an ESM-only dependency that Jest does not transform;
// the chart container only needs its loading spinner.
jest.mock("flowbite-react", () => ({ Spinner: () => null }));

// Same shape as public/data/zcash/transaction_summary.json. The chart plots
// every 8,064th block plus the latest sample (25,000 here).
const sample = (height: number, sapling: number) => ({
  height,
  sapling,
  sapling_filter: sapling,
  orchard: 0,
  orchard_filter: 0,
  transactions: sapling,
  transactions_filter: sapling,
});
const transactionSummary = [
  sample(8064, 1000),
  sample(16128, 10),
  sample(24192, 20),
  sample(25000, 5000),
];

async function renderChart() {
  const utils = render(
    <TransactionsSummaryChart chartRef={createRef<HTMLDivElement>()} />,
  );
  await waitFor(() =>
    expect(utils.container.querySelector(".recharts-wrapper")).not.toBeNull(),
  );
  return utils;
}

describe("Transactions Summary height range", () => {
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

  it("does not add blocks below Start Height to the first bar", async () => {
    const { container } = await renderChart();

    fireEvent.change(screen.getByLabelText(/^Start Height/), {
      target: { value: "16000" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /Cumulative/ }));

    // Hover the first bar (#16128).
    await act(async () => {
      fireEvent.mouseMove(container.querySelector(".recharts-wrapper")!, {
        clientX: 150,
        clientY: 200,
      });
    });

    const tooltip = await waitFor(() => {
      const el = container.querySelector(".recharts-tooltip-wrapper");
      expect(el?.textContent).toContain("16128");
      return el!;
    });
    // Only block 16,128 is in range; the 1,000 txs at 8,064 are not.
    expect(tooltip.textContent).toMatch(/Sapling : 10(?!\d)/);
  });

  it.each([
    ["cumulative", false],
    ["per-period", true],
  ])(
    "does not plot the latest sample past End Height (%s)",
    async (_, uncheckCumulative) => {
      await renderChart();

      if (uncheckCumulative) {
        fireEvent.click(screen.getByRole("checkbox", { name: /Cumulative/ }));
      }
      expect(await screen.findByText("#25000")).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText(/^End Height/), {
        target: { value: "20000" },
      });

      await waitFor(() =>
        expect(screen.queryByText("#25000")).not.toBeInTheDocument(),
      );
      expect(screen.getByText("#16128")).toBeInTheDocument();
    },
  );
});

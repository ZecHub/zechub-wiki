import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import ChainStatePage from "../Charts/Zcash/ChainState/ChainStatePage";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <>{children}</>,
  LineChart: ({ children, data }: { children: ReactNode; data: { day: number }[] }) => (
    <>
      <output data-testid="chart-window-starts">
        {data.map(({ day }) => day).join(",")}
      </output>
      {children}
    </>
  ),
  BarChart: () => null,
  Line: ({ dataKey, dot }: { dataKey: string; dot: boolean }) =>
    dot ? <span data-testid={`point:${dataKey}`} /> : null,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
  Legend: () => null,
}));

const postNU7 = Array.from({ length: 8 }, (_, index) => {
  const start = 3_543_405 + index * 3_456;
  return { start, end: start + (index === 7 ? 106 : 3_455) };
});
const windows = [
  { start: 0, end: 575 },
  { start: 3_542_304, end: 3_543_404 },
  ...postNU7,
];
const report = {
  per_day: windows,
  expiry: { delta_histogram: {} },
  counts: { blocks: 15, txs: 60 },
  blocks: { avg_txs_per_block: 4, max_txs_per_block: 9 },
  types: {},
  shielded: {},
};
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({ json: async () => report });
});

afterEach(() => {
  global.fetch = originalFetch;
});

function expectWindows(expected: { start: number }[]) {
  expect(screen.getByTestId("chart-window-starts").textContent)
    .toBe(expected.map(({ start }) => start).join(","));
}

test("day and week zoom use recent data windows, including a partial window at the tip", async () => {
  render(<ChainStatePage />);
  fireEvent.click(await screen.findByRole("button", { name: "Day" }));
  expectWindows(postNU7.slice(-1));
  expect(screen.getByTestId("point:txs")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Week" }));
  expectWindows(postNU7.slice(-7));
  expect(screen.queryByTestId("point:txs")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Full" }));
  expectWindows(windows);
});

test("month zoom clamps to the available report windows for the NSM chart", async () => {
  render(<ChainStatePage />);
  fireEvent.change(await screen.findByRole("combobox"), { target: { value: "nsm" } });
  fireEvent.click(screen.getByRole("button", { name: "Month" }));
  expectWindows(postNU7);
});

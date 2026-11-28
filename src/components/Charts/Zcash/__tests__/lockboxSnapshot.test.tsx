import { render, screen } from "@testing-library/react";
import { createRef, type ReactNode } from "react";
import { getLockboxData } from "@/lib/chart/helpers";
import type { LockBox } from "@/lib/chart/types";
import LockboxChart from "../LockboxChart";

jest.mock("@/lib/chart/helpers");
jest.mock("../ChartContainer", () => ({
  __esModule: true,
  default: jest.requireActual<typeof import("react")>("react").forwardRef(
    ({ children }: { children: ReactNode }, _ref) => children,
  ),
}));
jest.mock("recharts", () => ({
  ...jest.requireActual("recharts"),
  AreaChart: ({ data }: { data: LockBox[] }) => (
    <div data-testid="chart-tail">{data.at(-1)?.Date}</div>
  ),
}));

const fetchLockbox = jest.mocked(getLockboxData);
const latestObserved = {
  Date: "11/15/2026",
  lockbox: 76431.68718108,
  coinholders_fund: 70862.87295,
};

it("does not present missing balances as zero while loading or if the feed fails", async () => {
  fetchLockbox.mockResolvedValueOnce([]);
  render(<LockboxChart chartRef={createRef<HTMLDivElement>()} />);

  expect(screen.getByText("Loading balances…")).toBeInTheDocument();
  expect(screen.queryByText("0")).not.toBeInTheDocument();
  expect(await screen.findByText("Balance data unavailable.")).toBeInTheDocument();
  expect(screen.queryByText("Grand Total")).not.toBeInTheDocument();
});

it("shows a genuine zero and identifies the source date", async () => {
  fetchLockbox.mockResolvedValueOnce([{ Date: "11/23/2024", lockbox: 0, coinholders_fund: 0 }]);
  render(<LockboxChart chartRef={createRef<HTMLDivElement>()} />);

  expect(await screen.findByText("Balances as of November 23, 2024")).toBeInTheDocument();
  expect(screen.getAllByText("0")).toHaveLength(3);
});

it("keeps the most recent known balance and chart point when downsampling", async () => {
  const earlier = Array.from({ length: 2399 }, (_, i) => ({
    Date: new Date(2010, 0, i + 1).toLocaleDateString("en-US"),
    lockbox: 1,
    coinholders_fund: 2,
  }));
  fetchLockbox.mockResolvedValueOnce([latestObserved, ...earlier]);
  render(<LockboxChart chartRef={createRef<HTMLDivElement>()} />);

  expect(await screen.findByText("Balances as of November 15, 2026")).toBeInTheDocument();
  expect(screen.getByTestId("chart-tail")).toHaveTextContent(latestObserved.Date);
  expect(screen.getByText((latestObserved.lockbox + latestObserved.coinholders_fund).toLocaleString()))
    .toBeInTheDocument();
});

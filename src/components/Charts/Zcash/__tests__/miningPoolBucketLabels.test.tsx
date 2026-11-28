import { fireEvent, render, screen } from "@testing-library/react";
import { createRef, type ReactNode } from "react";
import { getMiningPoolsDominance } from "@/lib/chart/helpers";
import MiningPoolsDominanceChart from "../MiningPoolsDominanceChart";

jest.mock("@/lib/chart/helpers");
jest.mock("@/context/LanguageContext", () => ({ useLanguage: () => ({ t: {} }) }));
jest.mock("@/hooks/useInMobile", () => ({ useInMobile: () => false }));
jest.mock("@/hooks/useResponsiveFontSize", () => ({ useResponsiveFontSize: () => 12 }));
jest.mock("@/components/DefaultSelect", () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (value: string) => void }) => (
    <button onClick={() => onChange("1w")}>1w</button>
  ),
}));
jest.mock("../ChartContainer", () => ({
  __esModule: true,
  default: jest.requireActual<typeof import("react")>("react").forwardRef(
    ({ loading, children }: { loading: boolean; children: ReactNode }, _ref) =>
      loading ? null : children,
  ),
}));
jest.mock("recharts", () => {
  const react = jest.requireActual<typeof import("react")>("react");
  const chartKey = react.createContext("");
  return {
    AreaChart: ({ data, children }: { data: { dateKey: string }[]; children: ReactNode }) => (
      <chartKey.Provider value={data[0]?.dateKey ?? ""}>{children}</chartKey.Provider>
    ),
    CartesianGrid: () => null,
    XAxis: ({ tickFormatter }: { tickFormatter: (key: string) => string }) => {
      const key = react.useContext(chartKey);
      return key ? <div data-testid="tick">{tickFormatter(key)}</div> : null;
    },
    YAxis: () => null,
    Area: () => null,
    Tooltip: ({ labelFormatter }: { labelFormatter: (key: string) => string }) => {
      const key = react.useContext(chartKey);
      return key ? <div data-testid="date-label">{labelFormatter(key)}</div> : null;
    },
  };
});

it("uses the actual midnight UTC bucket for the displayed date and range labels", async () => {
  const mockPoolData = jest.mocked(getMiningPoolsDominance);
  mockPoolData.mockImplementation(async (_url, range) => ({
    range,
    slug: null,
    buckets: [range === "1w"
      ? {
          timestamp: 1795737600,
          total_blocks: 3451,
          pools: [{ pool_name: "ViaBTC", block_count: 1026, share_percentage: 29.73 }],
        }
      : { timestamp: Date.UTC(2026, 10, 1) / 1000, total_blocks: 1, pools: [] }],
  }));
  render(<MiningPoolsDominanceChart chartRef={createRef<HTMLDivElement>()} />);

  expect(await screen.findByTestId("tick")).toHaveTextContent("Nov 2026");
  fireEvent.click(screen.getByRole("button", { name: "1w" }));
  const tip = await screen.findByTestId("date-label");
  expect(tip).toHaveTextContent(/November 27(?:th)?, 2026/);
  expect(screen.getByTestId("tick")).toHaveTextContent("Nov 27");
});

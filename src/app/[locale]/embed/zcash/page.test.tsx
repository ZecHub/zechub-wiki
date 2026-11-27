import { fireEvent, render, screen } from "@testing-library/react";
import ZcashEmbedPage from "./page";

let mockParams: URLSearchParams;
jest.mock("next/navigation", () => ({
  useSearchParams: () => mockParams,
}));
jest.mock("@/lib/chart/helpers", () => ({
  getLastUpdatedDate: jest.fn().mockResolvedValue("2026-11-27T12:00:00Z"),
}));
jest.mock("@/hooks/useExportDashboardAsPNG", () => ({
  __esModule: true,
  default: () => ({ divChartRef: { current: null }, handleSaveToPng: jest.fn() }),
}));
jest.mock("@/components/Charts/Zcash/ShieldedSupplyChart", () => () => <div>Supply plot</div>);
jest.mock("@/components/Charts/Zcash/DifficultyChart", () => () => <div>Difficulty plot</div>);
jest.mock("@/components/Charts/Zcash/IssuanceChart", () => () => null);
jest.mock("@/components/Charts/Zcash/LockboxChart", () => () => null);
jest.mock("@/components/Charts/Zcash/NetInflowsOutflowsChart", () => () => null);
jest.mock("@/components/Charts/Zcash/TransactionSummaryChart", () => () => null);
jest.mock("@/components/Charts/Zcash/PrivacySetVisualizationChart", () => () => null);
jest.mock("@/components/Charts/ChartFooter", () => () => <button>Download chart</button>);

afterEach(() => {
  document.documentElement.classList.remove("dark");
  document.body.classList.remove("bg-slate-900", "text-white", "transition", "duration-500");
});

it("hides the embed header, chart tabs, and export controls when requested", async () => {
  mockParams = new URLSearchParams("embed=true&hideHeader=true&hideControls=true&tab=Difficulty");
  render(<ZcashEmbedPage />);

  expect(await screen.findByText("Difficulty plot")).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Analytics Charts" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Supply" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Download chart" })).not.toBeInTheDocument();
});

it("shows the supply chart for an unknown tab even when the tabs are hidden", async () => {
  mockParams = new URLSearchParams("hideControls=true&tab=old-embed-tab");
  render(<ZcashEmbedPage />);

  expect(await screen.findByText("Supply plot")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Supply" })).not.toBeInTheDocument();
});

it("keeps the default visible header and working tab controls", async () => {
  mockParams = new URLSearchParams();
  render(<ZcashEmbedPage />);

  expect(await screen.findByRole("heading", { name: "Analytics Charts" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Download chart" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Difficulty" }));
  expect(screen.getByText("Difficulty plot")).toBeInTheDocument();
});

import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { DATA_URL, DATE_URL } from "@/lib/chart/data-url";
import ChartFooter from "./ChartFooter";

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({ text, onClick }: { text: ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{text}</button>
  ),
}));

const originalFetch = global.fetch;
const response = (body: unknown) =>
  ({ ok: true, json: async () => body }) as Response;

afterEach(() => {
  global.fetch = originalFetch;
});

it("does not report the Supply update date for Mining Pools and keeps export available", async () => {
  const get = jest.fn(async (url: RequestInfo | URL) => {
    if (url === DATA_URL.defaultUrl) return response([{ Date: "2025-06-01" }]);
    return response([{ commit: { committer: { date: "2025-06-03T12:00:00Z" } } }]);
  });
  global.fetch = get;
  const exportChart = jest.fn();
  const { rerender } = render(<ChartFooter lastUpdatedDate="supply" imgLabel="supply" handleSaveToPng={exportChart} />);

  expect(await screen.findByText(/Last updated:/)).toBeInTheDocument();
  get.mockClear();
  rerender(<ChartFooter lastUpdatedDate="mining pools" imgLabel="mining pools" handleSaveToPng={exportChart} />);
  expect(screen.queryByText(/Last updated:/)).not.toBeInTheDocument();
  await act(async () => {});
  expect(get).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Export PNG" }));
  expect(exportChart).toHaveBeenCalledWith("mining pools");
});

it("uses the matching commit when the Block Fees data are missing", async () => {
  const get = jest.fn(async (url: RequestInfo | URL) => {
    if (url === DATA_URL.blockFeesUrl) return response([]);
    return response([{ commit: { committer: { date: "2025-06-02T12:00:00Z" } } }]);
  });
  global.fetch = get;
  render(<ChartFooter lastUpdatedDate="block fees" imgLabel="fees" handleSaveToPng={jest.fn()} />);
  expect(await screen.findByText(/Last updated:/)).toBeInTheDocument();
  expect(get.mock.calls.map(([url]) => url)).toEqual([
    DATA_URL.blockFeesUrl,
    "/api/data-updated?path=public/data/zcash/blockFeesZEC.json",
  ]);
});

it("ignores a slow date response after changing charts", async () => {
  let finishFees!: (result: Response) => void;
  const feesPending = new Promise<Response>((resolve) => { finishFees = resolve; });
  global.fetch = jest.fn(async (url: RequestInfo | URL) => {
    if (url === DATA_URL.blockFeesUrl) return feesPending;
    return response([{ Date: "2025-06-09" }]);
  });
  const exportChart = jest.fn();
  const { rerender } = render(<ChartFooter lastUpdatedDate="block fees" imgLabel="fees" handleSaveToPng={exportChart} />);
  rerender(<ChartFooter lastUpdatedDate="difficulty" imgLabel="difficulty" handleSaveToPng={exportChart} />);
  const current = (await screen.findByText(/Last updated:/)).textContent;
  await act(async () => { finishFees(response([{ Date: "2025-06-03" }])); });
  expect(screen.getByText(/Last updated:/)).toHaveTextContent(current!);
});

it("reads Namada supply dates from Namada data", async () => {
  const get = jest.fn(async (url: RequestInfo | URL) =>
    response(url === DATA_URL.namadaSupplyUrl ? [{ Date: "2025-06-05" }] : []),
  );
  global.fetch = get;
  render(<ChartFooter lastUpdatedDate="namada supply" imgLabel="NAM" handleSaveToPng={jest.fn()} />);
  expect(await screen.findByText(/Last updated:/)).toBeInTheDocument();
  expect(get.mock.calls.map(([url]) => url)).toEqual([DATA_URL.namadaSupplyUrl]);
  expect(get).not.toHaveBeenCalledWith(DATE_URL.shieldedUrl, expect.anything());
});

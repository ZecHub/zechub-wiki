import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ShieldedSupplyChart from "../Charts/Zcash/ShieldedSupplyChart";

jest.mock("@/hooks/useInMobile", () => ({ useInMobile: () => false }));
jest.mock("@/hooks/useResponsiveFontSize", () => ({ useResponsiveFontSize: () => 12 }));
jest.mock("../Charts/Zcash/ChartContainer", () => ({
  __esModule: true,
  default: ({ loading, children }: any) =>
    loading ? <div role="status">Loading chart</div> : children,
}));
jest.mock("recharts", () => ({
  AreaChart: ({ data }: any) => <output>{JSON.stringify(data)}</output>,
  Area: () => null, Line: () => null, CartesianGrid: () => null,
  Legend: () => null, Tooltip: () => null, XAxis: () => null, YAxis: () => null,
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function response(supply: number) {
  return { ok: true, json: async () => [{ close: "10/15/2026", supply }] } as Response;
}

describe("shielded supply network requests", () => {
  const originalFetch = global.fetch;
  afterEach(() => { global.fetch = originalFetch; });

  function start() {
    const batches = [0, 1, 2].map(() => [0, 1, 2, 3].map(() => deferred<Response>()));
    const fetchMock = jest.fn();
    for (const batch of batches) for (const request of batch) fetchMock.mockReturnValueOnce(request.promise);
    global.fetch = fetchMock;
    render(<ShieldedSupplyChart chartRef={{ current: null }} />);
    const switchTo = (network: "Mainnet" | "Testnet") => {
      fireEvent.click(screen.getByRole("button", { name: network }));
    };
    const resolve = async (batch: number, supply: number) => {
      await act(async () => { batches[batch].forEach(request => request.resolve(response(supply))); });
    };
    const abort = async (batch: number) => {
      await act(async () => { batches[batch].forEach(request => request.reject(new DOMException("Aborted", "AbortError"))); });
    };
    return { batches, fetchMock, switchTo, resolve, abort };
  }

  it("keeps the selected network loading after old requests abort", async () => {
    const t = start();
    t.switchTo("Testnet");
    expect(t.fetchMock.mock.calls).toHaveLength(8);
    expect(t.fetchMock.mock.calls.slice(0, 4).every(call => call[1].signal.aborted)).toBe(true);
    expect(t.fetchMock.mock.calls.slice(4).every(call => call[0].includes("/zcash/testnet/"))).toBe(true);
    await t.abort(0);
    expect(screen.getByText("Loading chart")).toBeInTheDocument();
    await t.resolve(1, 25);
    expect(screen.getByText("Total Shielded: 100 ZEC")).toBeInTheDocument();
  });

  it("does not erase testnet data when the older mainnet abort completes", async () => {
    const t = start();
    t.switchTo("Testnet");
    await t.resolve(1, 25);
    await t.abort(0);
    expect(screen.getByText("Total Shielded: 100 ZEC")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent('"total":100');
  });

  it("does not show a late mainnet response under the testnet heading", async () => {
    const t = start();
    t.switchTo("Testnet");
    await t.resolve(1, 25);
    await t.resolve(0, 1000);
    expect(screen.getByText("Testnet Shielded Supply Overview")).toBeInTheDocument();
    expect(screen.getByText("Total Shielded: 100 ZEC")).toBeInTheDocument();
    expect(screen.getByRole("status")).not.toHaveTextContent('"total":4000');
  });

  it("hides the prior network's summary while the next network loads", async () => {
    const t = start();
    await t.resolve(0, 1000);
    expect(screen.getByText("Total Shielded: 4,000 ZEC")).toBeInTheDocument();
    t.switchTo("Testnet");
    expect(screen.queryByText("Total Shielded: 4,000 ZEC")).not.toBeInTheDocument();
    expect(screen.getByText("Loading supply…")).toBeInTheDocument();
    await t.resolve(1, 25);
    expect(screen.getByText("Total Shielded: 100 ZEC")).toBeInTheDocument();
  });

  it("keeps the latest mainnet selection through a round trip", async () => {
    const t = start();
    t.switchTo("Testnet");
    t.switchTo("Mainnet");
    await t.resolve(2, 50);
    await t.resolve(1, 25);
    await t.abort(0);
    expect(screen.getByText("Shielded Supply Overview")).toBeInTheDocument();
    expect(screen.getByText("Total Shielded: 200 ZEC")).toBeInTheDocument();
  });

  it("finishes loading when the active network requests fail", async () => {
    const t = start();
    await act(async () => { t.batches[0].forEach(request => request.resolve({ ok: false } as Response)); });
    expect(screen.queryByText("Loading chart")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("[]");
  });
});

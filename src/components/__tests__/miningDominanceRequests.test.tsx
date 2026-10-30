import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import MiningPoolsDominanceChart from "../Charts/Zcash/MiningPoolsDominanceChart";

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: undefined }),
}));
jest.mock("@/hooks/useInMobile", () => ({ useInMobile: () => false }));
jest.mock("@/hooks/useResponsiveFontSize", () => ({
  useResponsiveFontSize: () => 12,
}));
jest.mock("../Charts/Zcash/ChartContainer", () => ({
  __esModule: true,
  default: ({ loading, children }: any) =>
    loading ? <div role="status">Loading pools</div> : children,
}));
jest.mock("recharts", () => ({
  AreaChart: ({ data }: any) => <output>{JSON.stringify(data)}</output>,
  Area: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

function response(pool: string) {
  return {
    ok: true,
    json: async () => ({
      range: "1w",
      slug: null,
      buckets: [{
        timestamp: 1_760_000_000,
        total_blocks: 10,
        pools: [{ pool_name: pool, block_count: 10, share_percentage: 100 }],
      }],
    }),
  } as Response;
}

describe("mining dominance range requests", () => {
  const originalFetch = global.fetch;
  afterEach(() => { global.fetch = originalFetch; });

  function start() {
    const old = deferred<Response>();
    const current = deferred<Response>();
    const fetchMock = jest.fn()
      .mockReturnValueOnce(old.promise)
      .mockReturnValueOnce(current.promise);
    global.fetch = fetchMock;
    render(<MiningPoolsDominanceChart chartRef={{ current: null }} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1w" } });
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
    expect(fetchMock.mock.calls[1][0]).toContain("range=1w");
    return { old, current };
  }

  it("keeps loading the selected range when the previous fetch aborts", async () => {
    const { old, current } = start();
    await act(async () => { old.reject(new DOMException("Aborted", "AbortError")); });
    expect(screen.getByText("Loading pools")).toBeInTheDocument();
    await act(async () => { current.resolve(response("Current pool")); });
    expect(screen.queryByText("Loading pools")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Current pool");
  });

  it("does not erase the selected range when an older abort completes late", async () => {
    const { old, current } = start();
    await act(async () => { current.resolve(response("Current pool")); });
    expect(screen.getByRole("status")).toHaveTextContent("Current pool");
    await act(async () => { old.reject(new DOMException("Aborted", "AbortError")); });
    expect(screen.getByRole("status")).toHaveTextContent("Current pool");
  });

  it("ignores a stale successful response even if the transport finishes after abort", async () => {
    const { old, current } = start();
    await act(async () => { current.resolve(response("Current pool")); });
    await act(async () => { old.resolve(response("Old pool")); });
    expect(screen.getByRole("status")).toHaveTextContent("Current pool");
    expect(screen.getByRole("status")).not.toHaveTextContent("Old pool");
  });

  it("still finishes loading when the current request fails", async () => {
    const { old, current } = start();
    await act(async () => {
      old.reject(new DOMException("Aborted", "AbortError"));
      current.resolve({ ok: false } as Response);
    });
    expect(screen.queryByText("Loading pools")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("[]");
  });
});

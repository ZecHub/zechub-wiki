import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import NetworkUpgradesChart from "../Charts/Zcash/NetworkUpgradesChart";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(yes => { resolve = yes; });
  return { promise, resolve };
}

function response(name: string, height: number, lastUpdated?: string) {
  const upgrades = [{ id: name, name, activationHeight: height, status: "pending" }];
  return { ok: true, json: async () => lastUpdated ? { upgrades, lastUpdated } : upgrades } as Response;
}

describe("network upgrade requests", () => {
  const originalFetch = global.fetch;
  afterEach(() => { global.fetch = originalFetch; });

  function start() {
    const old = deferred<Response>();
    const current = deferred<Response>();
    const fetchMock = jest.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
    global.fetch = fetchMock;
    const view = render(<NetworkUpgradesChart />);
    const selectTestnet = () => fireEvent.click(screen.getByRole("button", { name: "Testnet" }));
    return { old, current, fetchMock, selectTestnet, ...view };
  }

  it("removes mainnet heights while testnet is loading", async () => {
    const t = start();
    await act(async () => { t.old.resolve(response("Main upgrade", 100)); });
    expect(screen.getByText("100")).toBeInTheDocument();
    t.selectTestnet();
    expect(screen.getByText(/Zcash testnet upgrade activation heights/)).toBeInTheDocument();
    expect(screen.queryByText("100")).not.toBeInTheDocument();
    expect(screen.queryByText("Source: getblockchaininfo")).not.toBeInTheDocument();
    await act(async () => { t.current.resolve(response("Test upgrade", 200)); });
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("does not leave mainnet rows under testnet after a failed switch", async () => {
    const t = start();
    await act(async () => { t.old.resolve(response("Main upgrade", 100)); });
    t.selectTestnet();
    await act(async () => { t.current.resolve({ ok: false } as Response); });
    expect(screen.getByText("Failed to load testnet data")).toBeInTheDocument();
    expect(screen.queryByText("100")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mainnet" })).toBeEnabled();
  });

  it("ignores an initial mainnet response that arrives after testnet", async () => {
    const t = start();
    t.selectTestnet();
    await act(async () => { t.current.resolve(response("Test upgrade", 200)); });
    await act(async () => { t.old.resolve(response("Main upgrade", 100)); });
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.queryByText("100")).not.toBeInTheDocument();
    expect(t.fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  });

  it("drops the previous network's update timestamp for array responses", async () => {
    const t = start();
    await act(async () => { t.old.resolve(response("Main upgrade", 100, "Yesterday on mainnet")); });
    expect(screen.getByText("Last updated: Yesterday on mainnet")).toBeInTheDocument();
    t.selectTestnet();
    await act(async () => { t.current.resolve(response("Test upgrade", 200)); });
    expect(screen.queryByText(/Yesterday on mainnet/)).not.toBeInTheDocument();
    expect(screen.getByText("Status varies on testnet")).toBeInTheDocument();
  });

  it("aborts the active request on unmount", () => {
    const t = start();
    t.unmount();
    expect(t.fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  });

  it("still renders the active network's empty result", async () => {
    const t = start();
    await act(async () => { t.old.resolve({ ok: true, json: async () => [] } as Response); });
    expect(screen.getByText("No upgrade data found.")).toBeInTheDocument();
  });
});

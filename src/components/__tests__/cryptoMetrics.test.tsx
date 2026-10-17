import React from "react";
import { render, screen } from "@testing-library/react";
import CryptoMetrics from "../Charts/Metric";

jest.mock("@/hooks/useInMobile", () => ({ useInMobile: () => false }));

describe("market metrics", () => {
  const originalFetch = global.fetch;
  afterEach(() => { global.fetch = originalFetch; jest.restoreAllMocks(); });

  async function load(volume: number | null | undefined = 123456.5) {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ Namada: { usd: 2, btc: 0.00002, usd_market_cap: 10000, usd_24h_vol: volume } }),
    })) as jest.Mock;
    render(<CryptoMetrics selectedCoin="Namada" />);
    await screen.findByText("Namada Metrics");
  }

  function card(label: string) {
    return screen.getByText(label).parentElement!;
  }

  it("does not fabricate a block count from randomness", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    await load();
    expect(card("Blocks")).toHaveTextContent("N/A");
    expect(card("Blocks")).not.toHaveTextContent("1,000,000");
  });

  it("labels the upstream dollar volume as volume, not a transaction count", async () => {
    await load();
    expect(screen.queryByText("24h Transactions")).not.toBeInTheDocument();
    expect(card("24h Volume (USD)")).toHaveTextContent("$123,456.5");
    expect(card("Market Cap")).toHaveTextContent("$10,000");
    expect(card("Market Price (USD)")).toHaveTextContent("$2.00");
  });

  it("preserves a reported zero volume", async () => {
    await load(0);
    expect(card("24h Volume (USD)")).toHaveTextContent("$0");
    expect(card("24h Volume (USD)")).not.toHaveTextContent("N/A");
  });

  it.each([null, NaN, Infinity])("does not invent a dollar volume for %s", async volume => {
    await load(volume);
    expect(card("24h Volume (USD)")).toHaveTextContent("N/A");
  });
});

import { render, screen } from "@testing-library/react";
import CryptoMetrics from "../Charts/Metric";

// The Namada and Penumbra dashboards render these tiles. "Blocks" used to be
// Math.floor(Math.random() * 2_000_000), shown even when the price request
// failed, and CoinGecko's 24h trading volume was labelled "24h Transactions".

describe("CryptoMetrics", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Makes the old fabricated block count recognisable: 1,000,000.
    jest.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("shows CoinGecko's 24h volume as USD volume, and no invented block count", async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        Penumbra: { usd: 2.5, btc: 0.00002, usd_market_cap: 1_000_000, usd_24h_vol: 123_456.7 },
      }),
    })) as jest.Mock;

    render(<CryptoMetrics selectedCoin="Penumbra" />);

    expect(await screen.findByText("24h Volume (USD)")).toBeInTheDocument();
    expect(screen.getByText("$123,457")).toBeInTheDocument();
    expect(screen.queryByText("24h Transactions")).not.toBeInTheDocument();
    expect(screen.queryByText("Blocks")).not.toBeInTheDocument();
    expect(screen.queryByText("1,000,000")).not.toBeInTheDocument();
  });

  it("shows no fabricated numbers when the price request fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = jest.fn(async () => ({ ok: false, status: 502 })) as jest.Mock;

    render(<CryptoMetrics selectedCoin="Penumbra" />);

    expect(await screen.findByText(/Error loading Penumbra chart/)).toBeInTheDocument();
    expect(screen.queryByText("Blocks")).not.toBeInTheDocument();
    expect(screen.queryByText("1,000,000")).not.toBeInTheDocument();
  });
});

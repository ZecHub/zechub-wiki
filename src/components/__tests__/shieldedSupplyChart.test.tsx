import { createRef, type ReactElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ShieldedSupplyChart from "../Charts/Zcash/ShieldedSupplyChart";

// JSDOM has no layout measurements; give the real chart a fixed viewport so
// the legend (which holds the pool toggles) is rendered.
jest.mock("recharts", () => ({
  ...jest.requireActual("recharts"),
  ResponsiveContainer: ({ children }: { children: ReactElement }) =>
    jest.requireActual("react").cloneElement(children, { width: 800, height: 400 }),
}));

// flowbite-react pulls in an ESM-only dependency that Jest does not transform;
// the chart container only needs its loading spinner.
jest.mock("flowbite-react", () => ({ Spinner: () => null }));

// Latest values from public/data/zcash/*_supply.json (09/21/2026).
const poolSupply: Record<string, { supply: number; close: string }[]> = {
  "/data/zcash/sprout_supply.json": [
    { supply: 22478, close: "09/20/2026" },
    { supply: 22478, close: "09/21/2026" },
  ],
  "/data/zcash/sapling_supply.json": [
    { supply: 504219, close: "09/20/2026" },
    { supply: 504256, close: "09/21/2026" },
  ],
  "/data/zcash/orchard_supply.json": [
    { supply: 409893, close: "09/20/2026" },
    { supply: 406818, close: "09/21/2026" },
  ],
  "/data/zcash/ironwood_supply.json": [
    { supply: 3974543, close: "09/20/2026" },
    { supply: 3981178, close: "09/21/2026" },
  ],
};

describe("Shielded supply summary", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn(async (input) => {
      const rows = poolSupply[String(input)];
      if (!rows) throw new Error(`Unexpected fetch: ${input}`);
      return { ok: true, json: async () => rows };
    }) as jest.Mock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("only sums the visible pools when one of the four pools is hidden", async () => {
    render(<ShieldedSupplyChart chartRef={createRef<HTMLDivElement>()} />);

    // All four pools visible: 22,478 + 504,256 + 406,818 + 3,981,178.
    expect(
      await screen.findByText("Total Shielded: 4,914,730 ZEC"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ironwood" }));

    // Ironwood hidden: the summary must not keep reporting Ironwood's ZEC.
    expect(
      screen.getByText("Sprout, Sapling and Orchard Shielded: 933,552 ZEC"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Total Shielded: 4,914,730 ZEC"),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ironwood" }));
    fireEvent.click(screen.getByRole("button", { name: "Sprout" }));

    expect(
      screen.getByText("Sapling, Orchard and Ironwood Shielded: 4,892,252 ZEC"),
    ).toBeInTheDocument();
  });

  it("keeps the two-pool label unchanged", async () => {
    render(<ShieldedSupplyChart chartRef={createRef<HTMLDivElement>()} />);
    await screen.findByText("Total Shielded: 4,914,730 ZEC");

    fireEvent.click(screen.getByRole("button", { name: "Sprout" }));
    fireEvent.click(screen.getByRole("button", { name: "Ironwood" }));

    expect(
      screen.getByText("Sapling and Orchard Shielded: 911,074 ZEC"),
    ).toBeInTheDocument();
  });
});

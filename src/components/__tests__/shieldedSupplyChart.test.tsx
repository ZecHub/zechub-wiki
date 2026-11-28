import { createRef, type ReactElement } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
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

  it("keeps January 1 in the published year in both pool views", async () => {
    const yearBoundary: typeof poolSupply = {
      "/data/zcash/sprout_supply.json": [
        { supply: 25511, close: "12/31/2025" },
        { supply: 25481, close: "01/01/2026" },
      ],
      "/data/zcash/sapling_supply.json": [
        { supply: 627846, close: "12/31/2025" },
        { supply: 627866, close: "01/01/2026" },
      ],
      "/data/zcash/orchard_supply.json": [
        { supply: 4412583, close: "12/31/2025" },
        { supply: 4411761, close: "01/01/2026" },
      ],
      "/data/zcash/ironwood_supply.json": [
        { supply: 0, close: "12/31/2025" },
        { supply: 0, close: "01/01/2026" },
      ],
    };
    jest.mocked(global.fetch).mockImplementation(async (input) =>
      ({ ok: true, json: async () => yearBoundary[String(input)] }) as Response,
    );
    render(<ShieldedSupplyChart chartRef={createRef<HTMLDivElement>()} />);
    await screen.findByText("Total Shielded: 5,065,108 ZEC");

    const [pool, year] = screen.getAllByRole("combobox");
    fireEvent.change(year, { target: { value: "2025" } });
    expect(screen.getByText("Total Shielded: 5,065,940 ZEC")).toBeInTheDocument();
    fireEvent.change(year, { target: { value: "2026" } });
    expect(screen.getByText("Total Shielded: 5,065,108 ZEC")).toBeInTheDocument();
    fireEvent.change(pool, { target: { value: "orchard" } });
    expect(year).toHaveValue("2026");
    expect(screen.getByText("Orchard Shielded: 4,411,761 ZEC")).toBeInTheDocument();
  });

  it("restores all years when the selected pool has no data for that year", async () => {
    const historicPools: typeof poolSupply = {
      "/data/zcash/sprout_supply.json": [{ supply: 2573, close: "01/02/2017" }],
      "/data/zcash/sapling_supply.json": [{ supply: 41124, close: "01/02/2019" }],
      "/data/zcash/orchard_supply.json": [],
      "/data/zcash/ironwood_supply.json": [],
    };
    jest.mocked(global.fetch).mockImplementation(async (input) =>
      ({ ok: true, json: async () => historicPools[String(input)] }) as Response,
    );
    render(<ShieldedSupplyChart chartRef={createRef<HTMLDivElement>()} />);
    await screen.findByText("Total Shielded: 43,697 ZEC");

    const [pool, year] = screen.getAllByRole("combobox");
    fireEvent.change(year, { target: { value: "2017" } });
    fireEvent.change(pool, { target: { value: "sapling" } });
    expect(within(year).queryByRole("option", { name: "2017" })).not.toBeInTheDocument();
    expect(year).toHaveValue("all");
    expect(screen.getByText("Sapling Shielded: 41,124 ZEC")).toBeInTheDocument();
  });
});

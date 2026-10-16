import { render, screen, waitFor } from "@testing-library/react";
import { createRef, type ReactElement } from "react";
import NodeCountChart from "@/components/Charts/Zcash/NodeCountChart";

// JSDOM has no layout measurements; give the real chart a fixed viewport so
// the legend (which holds the series toggles) is rendered.
jest.mock("recharts", () => ({
  ...jest.requireActual("recharts"),
  ResponsiveContainer: ({ children }: { children: ReactElement }) =>
    jest.requireActual("react").cloneElement(children, { width: 800, height: 400 }),
}));

// flowbite-react pulls in an ESM-only dependency that Jest does not transform;
// the chart container only needs its loading spinner.
jest.mock("flowbite-react", () => ({ Spinner: () => null }));

// Shape matches public/data/zcash/nodecount.json: rows written before the
// crawler carry Date + nodecount only, rows written by it add the breakdown.
const LEGACY_ROWS = [
  { Date: "06/14/2026", nodecount: "119" },
  { Date: "07/04/2026", nodecount: "102" },
];

const MIXED_ROWS = [
  { Date: "07/04/2026", nodecount: "102" },
  { Date: "10/16/2026", nodecount: "10", zebra: "9", zcashd: "0", other: "1" },
];

function mockFetch(rows: unknown) {
  global.fetch = jest.fn(async (input: any) => {
    if (String(input) === "/data/zcash/nodecount.json") {
      return {
        ok: true,
        status: 200,
        json: async () => rows,
      } as unknown as Response;
    }
    return { ok: false, status: 404, json: async () => ({}) } as unknown as Response;
  }) as unknown as typeof fetch;
}

describe("NodeCountChart", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the census caveat so the number is not read as the network size", async () => {
    mockFetch(LEGACY_ROWS);
    render(<NodeCountChart chartRef={createRef<HTMLDivElement>()} />);

    await waitFor(() => {
      expect(screen.getByText(/reachable mainnet nodes/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/not the network size/i)).toBeInTheDocument();
  });

  it("shows the latest census total and its date", async () => {
    mockFetch(LEGACY_ROWS);
    render(<NodeCountChart chartRef={createRef<HTMLDivElement>()} />);

    await waitFor(() => {
      expect(screen.getByText("Latest census: 07/04/2026")).toBeInTheDocument();
    });
    // 102 is the last row's count and shows in the summary card.
    expect(screen.getAllByText("102").length).toBeGreaterThan(0);
  });

  it("does not offer a breakdown legend while only legacy rows exist", async () => {
    mockFetch(LEGACY_ROWS);
    render(<NodeCountChart chartRef={createRef<HTMLDivElement>()} />);

    await waitFor(() => {
      expect(screen.getByText(/reachable mainnet nodes/i)).toBeInTheDocument();
    });
    // A legend entry that never plots would read as "zcashd = 0".
    expect(screen.queryByRole("button", { name: /zebra/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /zcashd/i })).not.toBeInTheDocument();
  });

  it("offers the breakdown once a crawler row carries one", async () => {
    mockFetch(MIXED_ROWS);
    render(<NodeCountChart chartRef={createRef<HTMLDivElement>()} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /zebra/i })).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /zcashd/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /other/i })).toBeInTheDocument();
  });

  it("survives a response that is not an array", async () => {
    mockFetch({ not: "an array" });
    render(<NodeCountChart chartRef={createRef<HTMLDivElement>()} />);

    // Renders the frame with no rows rather than throwing.
    await waitFor(() => {
      expect(screen.getByText(/reachable mainnet nodes/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Latest census/)).not.toBeInTheDocument();
  });

  it("renders with an empty data set without crashing", async () => {
    mockFetch([]);
    render(<NodeCountChart chartRef={createRef<HTMLDivElement>()} />);

    await waitFor(() => {
      expect(screen.getByText(/reachable mainnet nodes/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Latest census/)).not.toBeInTheDocument();
  });
});
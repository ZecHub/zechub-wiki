import { createRef, type ReactElement } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import ShieldedStats from "../Charts/Zcash/Shielded/ShieldedStatsPro";

// JSDOM has no layout measurements; give the real chart a fixed viewport.
jest.mock("recharts", () => ({
  ...jest.requireActual("recharts"),
  ResponsiveContainer: ({ children }: { children: ReactElement }) =>
    jest
      .requireActual("react")
      .cloneElement(children, { width: 800, height: 400 }),
}));

// Last two weekly rows of public/data/zcash/shieldedStatsJSON.json.
const shieldedStats = [
  {
    Dates: "2026/09/13",
    Transactions: 66034,
    Total_Node_Count: 99,
    Closing_Price: 1061.77,
    Shielded_Market_Cap: 5264979787.14,
    Shielded_Transaction_Percentage: 0.47,
  },
  {
    Dates: "2026/09/20",
    Transactions: 103820,
    Total_Node_Count: 115,
    Closing_Price: 1508.84,
    Shielded_Market_Cap: 7507589506.24,
    Shielded_Transaction_Percentage: 0.56,
  },
];

async function hoverChart(container: HTMLElement, clientX: number) {
  await act(async () => {
    fireEvent.mouseMove(container.querySelector(".recharts-wrapper")!, {
      clientX,
      clientY: 200,
    });
  });
  return waitFor(() => {
    const el = container.querySelector(".recharts-tooltip-wrapper");
    expect(el?.textContent).toContain("2026/09/20");
    return el!;
  });
}

describe("Shielded Stats price tab", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn(async (input) => {
      if (String(input) === "/data/zcash/shieldedStatsJSON.json") {
        return { ok: true, json: async () => shieldedStats };
      }
      throw new Error(`Unexpected fetch: ${input}`);
    }) as jest.Mock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("shows closing price and market cap as USD in the tooltip", async () => {
    const { container } = render(
      <ShieldedStats chartRef={createRef<HTMLDivElement>()} />,
    );

    fireEvent.click(
      await screen.findByRole("button", { name: "Price & Market Cap" }),
    );

    // Hover the right-hand (latest) data point.
    const tooltip = await hoverChart(container, 700);

    expect(tooltip.textContent).toContain("Closing Price: $1508.84");
    expect(tooltip.textContent).toContain("Shielded Market Cap: $7.51B");
  });

  it("keeps plain counts on the other tabs", async () => {
    const { container } = render(
      <ShieldedStats chartRef={createRef<HTMLDivElement>()} />,
    );

    fireEvent.click(
      await screen.findByRole("button", { name: "Network Nodes" }),
    );

    const tooltip = await hoverChart(container, 700);

    expect(tooltip.textContent).toContain("Total Nodes: 115");
    expect(tooltip.textContent).not.toContain("$");
  });
});

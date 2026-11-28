import { render, screen, within } from "@testing-library/react";
import { DATA_URL } from "@/lib/chart/data-url";
import { ZcashMetrics } from "./ZcashMetrics";

jest.mock("@/hooks/useInMobile", () => ({ useInMobile: () => false }));
jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: jest.requireActual("../../../../../dictionaries/en.json") }),
}));

const base = { sprout: 0, sapling: 79, orchard: 17, ironwood: 847 };
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });

function mockMetrics(records: unknown[]) {
  global.fetch = jest.fn(async (input: RequestInfo | URL) => ({
    ok: true,
    json: async () => input === DATA_URL.shieldedTxCountUrl ? records : {},
  } as Response));
}

it("shows the observation date alongside the static shielded counts", async () => {
  mockMetrics([
    { ...base, ironwood: 686, timestamp: "11/26/2026" },
    { ...base, timestamp: "11/27/2026" },
  ]);
  render(<ZcashMetrics />);
  expect(await screen.findByText("Shielded transactions")).toBeInTheDocument();
  const time = screen.getByText("2026-11-27");
  expect(time).toHaveAttribute("datetime", "2026-11-27");
  expect(screen.getByText(/Ironwood: 847/)).toBeInTheDocument();
  expect(screen.queryByText("Shielded TX (24h)")).not.toBeInTheDocument();
});

it.each([
  { scenario: "invalid date", records: [{ ...base, timestamp: "11/31/2026" }] },
  { scenario: "empty data", records: [] },
])("marks the shielded card unavailable with $scenario", async ({ records }) => {
  mockMetrics(records);
  render(<ZcashMetrics />);
  const label = await screen.findByText("Shielded transactions");
  expect(within(label.parentElement!).getByText("N/A")).toBeInTheDocument();
  expect(screen.queryByText(/Ironwood: 847/)).not.toBeInTheDocument();
  expect(document.querySelector("time")).toBeNull();
});

import { render, screen } from "@testing-library/react";
import { HalvingMeter } from "./halving-meter";

const originalFetch = global.fetch;

beforeEach(() => {
  jest.useFakeTimers({ now: new Date("2026-11-27T22:00:00Z") });
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  global.fetch = originalFetch;
});

function mockChainHeight(blocks: number) {
  const payload = { data: { blocks } };
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => payload });
}

it("estimates the next halving from the public post-NU7 block height", async () => {
  mockChainHeight(3_618_676);
  render(<HalvingMeter />);

  expect(await screen.findByText("Target block 6,132,390")).toBeInTheDocument();
  expect(screen.getByText("2,513,714")).toBeInTheDocument();
  expect(screen.getByText("2028-11-24")).toBeInTheDocument();
  expect(screen.getByText("727d 08h 20m 50s to go!")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /ZIP 237/ })).toHaveAttribute("href", "https://zips.z.cash/zip-0237");
});

it.each([
  [3_543_404, "749d 03h 05m 00s to go!"],
  [3_543_405, "749d 03h 03m 45s to go!"],
])("uses both block spacings around activation at height %d", async (height, expected) => {
  mockChainHeight(height);
  render(<HalvingMeter />);

  expect(await screen.findByText(expected)).toBeInTheDocument();
});

it("rolls to the following interval when the first post-NU7 halving has occurred", async () => {
  mockChainHeight(6_132_390);
  render(<HalvingMeter />);

  expect(await screen.findByText("Target block 11,172,390")).toBeInTheDocument();
  expect(screen.getByText("5,040,000")).toBeInTheDocument();
  expect(screen.getByText("0.00%")).toBeInTheDocument();
});

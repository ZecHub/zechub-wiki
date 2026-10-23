import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CodePulse from "../CodePulse";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  LineChart: () => null,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}));

const radicle = [
  { date: "2026-10-15", projects: [{ name: "Radicle project", seeding: 4 }] },
];
const github = [
  { date: "2026-10-15", projects: [{ name: "GitHub project", stars: 8 }] },
];
const linkHealth = [
  {
    date: "2026-10-15",
    generatedAt: "2026-10-15T00:00:00.000Z",
    filesScanned: 4,
    serious: 1,
    totals: { broken: 1 },
  },
];
const response = (body: unknown, ok = true) => ({ ok, json: async () => body });
const originalFetch = global.fetch;
let fetchMock: jest.Mock;
let consoleError: jest.SpyInstance;

beforeEach(() => {
  fetchMock = jest.fn();
  global.fetch = fetchMock;
  consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  global.fetch = originalFetch;
  consoleError.mockRestore();
});

test.each([
  "network",
  "http",
  "json",
  "shape",
  "null-entry",
  "invalid-projects",
  "null-project",
  "invalid-project-metric",
  "invalid-summary-total",
  "empty",
])(
  "keeps the GitHub view reachable when the Radicle feed is %s",
  async (failure) => {
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/data/github/")) return response(github);
      if (url.includes("/data/link-health/history")) return response([]);
      if (url.includes("/data/link-health/latest")) return response({});
      if (failure === "network") throw new Error("offline");
      if (failure === "json") {
        return { ok: true, json: async () => { throw new SyntaxError("bad JSON"); } };
      }
      if (failure === "http") return response(radicle, false);
      if (failure === "null-entry") return response([null]);
      if (failure === "invalid-projects") {
        return response([{ date: "2026-10-15", projects: {} }]);
      }
      if (failure === "null-project") {
        return response([{ date: "2026-10-15", projects: [null] }]);
      }
      if (failure === "invalid-project-metric") {
        return response([
          { date: "2026-10-15", projects: [{ name: "Radicle project", stars: "8" }] },
        ]);
      }
      if (failure === "invalid-summary-total") {
        return response([
          { date: "2026-10-15", summary: { total_seeding: "4" }, projects: [] },
        ]);
      }
      return response(failure === "shape" ? {} : []);
    });

    render(<CodePulse />);
    fireEvent.click(await screen.findByRole("tab", { name: /github/i }));
    expect(
      await screen.findByRole("heading", { name: "GitHub project" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /radicle/i }));
    expect(
      await screen.findByRole(failure === "empty" ? "status" : "alert"),
    ).toHaveTextContent(
      failure === "empty"
        ? "No Radicle data available yet."
        : "Could not load the Radicle feed.",
    );
  },
);

test("a healthy feed can be opened while the other feed is still pending", async () => {
  fetchMock.mockImplementation((input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/data/radicle/")) return new Promise(() => {});
    if (url.includes("/data/github/")) return Promise.resolve(response(github));
    if (url.includes("/data/link-health/history")) return Promise.resolve(response([]));
    if (url.includes("/data/link-health/latest")) return Promise.resolve(response({}));
    throw new Error(`Unexpected URL: ${url}`);
  });

  render(<CodePulse />);
  expect(screen.getByRole("status")).toHaveTextContent("Loading Radicle feed");
  expect(screen.getByRole("tab", { name: /github/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: /github/i }));
  expect(
    await screen.findByRole("heading", { name: "GitHub project" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /link health/i })).toBeInTheDocument();
});

test("a failed GitHub feed leaves the loaded Radicle view available", async () => {
  fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/data/radicle/")) return response(radicle);
    if (url.includes("/data/github/")) throw new Error("offline");
    if (url.includes("/data/link-health/history")) return response([]);
    if (url.includes("/data/link-health/latest")) return response({});
    throw new Error(`Unexpected URL: ${url}`);
  });

  render(<CodePulse />);
  expect(
    await screen.findByRole("heading", { name: "Radicle project" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: /github/i }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Could not load the GitHub feed.",
  );
  fireEvent.click(screen.getByRole("tab", { name: /radicle/i }));
  expect(
    screen.getByRole("heading", { name: "Radicle project" }),
  ).toBeInTheDocument();
});

test("Link Health still renders its history after its independent load", async () => {
  fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/data/radicle/")) return response(radicle);
    if (url.includes("/data/github/")) return response(github);
    if (url.includes("/data/link-health/history")) return response(linkHealth);
    if (url.includes("/data/link-health/latest")) {
      return response({ findings: [] });
    }
    throw new Error(`Unexpected URL: ${url}`);
  });

  render(<CodePulse />);
  fireEvent.click(screen.getByRole("tab", { name: /link health/i }));
  expect(await screen.findByText("4 pages scanned.")).toBeInTheDocument();
});

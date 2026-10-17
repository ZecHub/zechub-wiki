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

const radicle = [{ date: "2026-10-15", projects: [{ name: "Radicle project", seeding: 4 }] }];
const github = [{ date: "2026-10-15", projects: [{ name: "GitHub project", stars: 8 }] }];
const response = (body: unknown, ok = true) => ({ ok, json: async () => body });
const originalFetch = global.fetch;
let fetchMock: jest.Mock;

beforeEach(() => {
  fetchMock = jest.fn();
  global.fetch = fetchMock;
});
afterEach(() => {
  global.fetch = originalFetch;
});

test.each(["empty", "network", "http", "json", "shape"])(
  "the GitHub view remains reachable when the Radicle feed is %s",
  async (failure) => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes("github")) return response(github);
      if (failure === "network") throw new Error("offline");
      if (failure === "json") return { ok: true, json: async () => { throw new SyntaxError("bad JSON"); } };
      return response(failure === "http" ? radicle : failure === "shape" ? {} : [], failure !== "http");
    });
    render(<CodePulse />);
    await screen.findByRole("tab", { name: /github/i });
    fireEvent.click(screen.getByRole("tab", { name: /github/i }));
    expect(await screen.findByRole("heading", { name: "GitHub project" })).toBeVisible();
    fireEvent.click(screen.getByRole("tab", { name: /radicle/i }));
    expect(screen.queryByRole("heading", { name: "Radicle project" })).not.toBeInTheDocument();
    expect(screen.getByRole(failure === "empty" ? "status" : "alert")).toHaveTextContent(
      failure === "empty" ? "No Radicle data available yet." : "Could not load the Radicle feed.",
    );
    expect(screen.queryByRole("region", { name: "Current Code Pulse summary" })).not.toBeInTheDocument();
  },
);

test("an unavailable GitHub view can return to the loaded Radicle view", async () => {
  fetchMock.mockImplementation(async (url: string) => response(url.includes("github") ? [] : radicle));
  render(<CodePulse />);
  await screen.findByRole("heading", { name: "Radicle project" });
  fireEvent.click(screen.getByRole("tab", { name: /github/i }));
  fireEvent.click(screen.getByRole("tab", { name: /radicle/i }));
  expect(screen.getByRole("heading", { name: "Radicle project" })).toBeVisible();
});

test("a rejected GitHub request preserves the loaded Radicle view", async () => {
  fetchMock.mockImplementation(async (url: string) => {
    if (url.includes("github")) throw new Error("offline");
    return response(radicle);
  });
  render(<CodePulse />);
  expect(await screen.findByRole("heading", { name: "Radicle project" })).toBeVisible();
});

test("the available feed renders while the other request is still pending", async () => {
  fetchMock.mockImplementation((url: string) => url.includes("github")
    ? Promise.resolve(response(github)) : new Promise(() => {}));
  render(<CodePulse />);
  expect(screen.getByRole("status")).toHaveTextContent("Loading Radicle feed");
  fireEvent.click(screen.getByRole("tab", { name: /github/i }));
  expect(await screen.findByRole("heading", { name: "GitHub project" })).toBeVisible();
});

// Preserve the upstream refresh when both feeds are available.
test("both loaded feeds keep the refreshed dashboard and repository control", async () => {
  fetchMock.mockImplementation(async (url: string) => response(url.includes("github") ? github : radicle));
  render(<CodePulse />);
  expect(await screen.findByRole("heading", { name: "Radicle project" })).toBeVisible();
  expect(screen.getByRole("heading", { name: "See what is moving." })).toBeVisible();
  fireEvent.click(screen.getByRole("tab", { name: /github/i }));
  expect(await screen.findByRole("heading", { name: "GitHub project" })).toBeVisible();
  expect(screen.getByRole("combobox", { name: "Select repository" })).toBeVisible();
  expect(screen.getByRole("heading", { name: "Activity over time" })).toBeVisible();
});

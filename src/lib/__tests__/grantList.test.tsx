import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GrantList } from "@/components/ZipsGrants/GrantList";
import { Grant } from "@/types/grants";

const grants: Grant[] = [
  {
    id: "alpha",
    project: "Alpha education project",
    url: "https://example.com/alpha",
    grantee: "Alpha team",
    category: "Education",
    reportingFrequency: null,
    status: "Open",
    milestones: [],
    summary: {
      totalMilestones: 0,
      totalAmountUSD: 0,
      totalUsdDisbursed: 0,
      totalZecDisbursed: 0,
      completedPercent: 0,
      completedMilestones: 0,
    },
  },
  {
    id: "beta",
    project: "Beta infrastructure project",
    url: "https://example.com/beta",
    grantee: "Beta team",
    category: "Infrastructure",
    reportingFrequency: null,
    status: "Completed",
    milestones: [],
    summary: {
      totalMilestones: 0,
      totalAmountUSD: 0,
      totalUsdDisbursed: 0,
      totalZecDisbursed: 0,
      completedPercent: 0,
      completedMilestones: 0,
    },
  },
];

const defaultProps = {
  grants,
  error: "",
  isLoading: false,
  setError: jest.fn(),
  setIsLoading: jest.fn(),
};
const noMatches = "No grants match your search or filters.";

afterEach(cleanup);

it("keeps category controls usable when a status change leaves no matches", async () => {
  const user = userEvent.setup();
  render(<GrantList {...defaultProps} />);

  await user.click(screen.getByRole("button", { name: "Education" }));
  await user.click(screen.getByRole("button", { name: "Completed" }));

  expect(screen.queryByText(grants[0].project)).not.toBeInTheDocument();
  expect(screen.queryByText(grants[1].project)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Education" })).toBeVisible();
  expect(screen.getAllByRole("button", { name: "All" })).toHaveLength(2);
  expect(screen.getByText(noMatches)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Infrastructure" }));
  expect(screen.getByText(grants[1].project)).toBeInTheDocument();
  expect(screen.queryByText(grants[0].project)).not.toBeInTheDocument();
  expect(screen.queryByText(noMatches)).not.toBeInTheDocument();
});

it("shows one accurate search-empty message and restores results after clearing", async () => {
  const user = userEvent.setup();
  render(<GrantList {...defaultProps} />);
  const search = screen.getByPlaceholderText("Search grants...");

  await user.type(search, "not a matching project");

  expect(screen.queryByText(/Unable to fetch grants|Failed to load Grants/)).not.toBeInTheDocument();
  expect(screen.getAllByText(noMatches)).toHaveLength(1);
  expect(screen.getByRole("button", { name: "Education" })).toBeVisible();
  expect(screen.queryByText(grants[0].project)).not.toBeInTheDocument();

  await user.clear(search);
  expect(screen.getByText(grants[0].project)).toBeInTheDocument();
  expect(screen.getByText(grants[1].project)).toBeInTheDocument();
  expect(screen.queryByText(noMatches)).not.toBeInTheDocument();
});

it("reports an empty loaded dataset without claiming a fetch failure", () => {
  render(<GrantList {...defaultProps} grants={[]} />);

  expect(screen.getByText("No grants available.")).toBeInTheDocument();
  expect(screen.queryByText(noMatches)).not.toBeInTheDocument();
  expect(screen.queryByText(/Unable to fetch grants|Failed to load Grants/)).not.toBeInTheDocument();
});

it("does not show empty-result feedback while loading", async () => {
  const user = userEvent.setup();
  render(<GrantList {...defaultProps} grants={[]} isLoading />);

  await user.type(screen.getByPlaceholderText("Search grants..."), "missing");

  expect(screen.getByText("Loading Grants...")).toBeInTheDocument();
  expect(screen.queryByText(/No grants|No Grant\(s\)|Unable to fetch grants/)).not.toBeInTheDocument();
});

it("shows the supplied fetch error without adding no-match feedback", async () => {
  const user = userEvent.setup();
  render(<GrantList {...defaultProps} grants={[]} error="Request failed" />);

  await user.type(screen.getByPlaceholderText("Search grants..."), "missing");

  expect(screen.getByText("Failed to load Grants!")).toBeInTheDocument();
  expect(screen.queryByText(/No grants|No Grant\(s\)|Unable to fetch grants/)).not.toBeInTheDocument();
});

it.each([
  { isLoading: true, error: "", feedback: "Loading Grants..." },
  { isLoading: false, error: "Request failed", feedback: "Failed to load Grants!" },
])("preserves retained cards and filters alongside $feedback", ({ feedback, ...state }) => {
  render(<GrantList {...defaultProps} {...state} />);

  expect(screen.getByText(feedback)).toBeInTheDocument();
  expect(screen.getByText(grants[0].project)).toBeInTheDocument();
  expect(screen.getByText(grants[1].project)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Education" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Infrastructure" })).toBeVisible();
  expect(screen.queryByText(noMatches)).not.toBeInTheDocument();
});

import { fireEvent, render, screen } from "@testing-library/react";
import ZipTracker from "./ZipTracker";
import type { Zip } from "./types";

jest.mock("./sandboxes", () => ({
  SANDBOXES: {},
  hasSandbox: () => false,
}));

const proposals: Zip[] = [
  { num: 237, title: "Halving-Preserving Issuance", status: "Final", tags: ["consensus"] },
  { num: 317, title: "Proportional Transfer Fee", status: "Active", tags: ["consensus"] },
  { num: 2009, title: "Reduce Marginal Fee", status: "Draft", tags: ["consensus"] },
];

function searchProposal(query: string) {
  render(<ZipTracker zips={proposals} lastSyncedAt="2026-11-27T00:00:00Z" source="live" embedded />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: query } });
}

it.each(["ZIP-0237", "ZIP 0237", "0237", "ZIP-237", "237"])(
  "finds the same proposal with %s",
  (query) => {
    searchProposal(query);
    expect(screen.getByRole("button", { name: /ZIP 0237 Halving-Preserving Issuance/ })).toBeVisible();
    expect(screen.queryByRole("button", { name: /ZIP 0317 Proportional/ })).not.toBeInTheDocument();
  },
);

it("keeps matching keywords and the existing status filters", () => {
  searchProposal("marginal fee");
  expect(screen.getByRole("button", { name: /ZIP 2009 Reduce Marginal Fee/ })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: /Active/ }));
  expect(screen.getByText("No ZIPs match your filters")).toBeVisible();
});

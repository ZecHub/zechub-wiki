import { type ReactElement } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { AnalyticsDashboard } from "../Proposals/analytics-dashboard";
import type { FlatProposal } from "../Proposals/proposals-list-client";

// JSDOM has no layout measurements; give the real chart a fixed viewport.
jest.mock("recharts", () => ({
  ...jest.requireActual("recharts"),
  ResponsiveContainer: ({ children }: { children: ReactElement }) =>
    jest
      .requireActual("react")
      .cloneElement(children, { width: 800, height: 400 }),
}));

// Proposals 177 and 178 from public/data/juno/zechub.json.
const proposal = (
  id: number,
  createdAt: string,
  votes: { yes: string; no: string; abstain: string },
): FlatProposal => ({
  id,
  createdAt,
  coreAddress: "juno1core",
  proposalModuleAddress: "juno1module",
  daoName: "ZecHub",
  proposal: {
    id,
    title: `Proposal ${id}`,
    description: "",
    status: "executed",
    proposer: "juno1proposer",
    votes,
    total_power: "23",
    threshold: {
      threshold_quorum: {
        threshold: { percent: "0.67" },
        quorum: { percent: "0.4" },
      },
    },
  },
});

const proposals = [
  proposal(177, "2026-09-11T07:07:04.890Z", {
    yes: "11",
    no: "0",
    abstain: "4",
  }),
  proposal(178, "2026-09-12T20:32:29.903Z", {
    yes: "15",
    no: "0",
    abstain: "0",
  }),
];

async function openTabAndHover(tab: string) {
  const { container } = render(<AnalyticsDashboard proposals={proposals} />);
  fireEvent.click(screen.getByRole("button", { name: tab }));

  await act(async () => {
    fireEvent.mouseMove(container.querySelector(".recharts-wrapper")!, {
      clientX: 700,
      clientY: 200,
    });
  });

  return waitFor(() => {
    const el = container.querySelector(".recharts-tooltip-wrapper");
    expect(el?.textContent).toMatch(/\S/);
    return el!;
  });
}

describe("Governance analytics tooltips", () => {
  it("shows voting power as a count, not a percentage", async () => {
    const tooltip = await openTabAndHover("Voting Power");

    expect(tooltip.textContent).toContain("Total Voting Power: 23");
    expect(tooltip.textContent).toContain("Votes Cast: 15");
    expect(tooltip.textContent).not.toContain("%");
  });

  it.each([
    // (11 / 15 + 15 / 15) / 2 = 86.7% of votes cast were yes
    ["Approval Rate", "Approval Rate: 86.7%"],
    // 15 of 23 voting power cast on both proposals = 65.2%
    ["Voter Turnout", "Avg Turnout: 65.2%"],
  ])("keeps the percent sign on the %s chart", async (tab, expected) => {
    const tooltip = await openTabAndHover(tab);

    expect(tooltip.textContent).toContain(expected);
  });
});

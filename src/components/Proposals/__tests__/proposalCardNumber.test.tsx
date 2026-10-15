import { render, screen } from "@testing-library/react";
import { ProposalCard } from "@/components/Proposals/proposal-card";
import type { FlatProposal } from "@/components/Proposals/proposals-list-client";

// The DAO export keeps the proposal number beside the proposal, not inside it:
// { id: 149, proposal: { title, votes, ... } } (public/data/juno/zechub.json).
const card = {
  id: 149,
  createdAt: "2026-07-01T00:00:00.000Z",
  coreAddress: "juno1core",
  proposalModuleAddress: "juno1module",
  daoName: "ZecHub",
  proposal: {
    title: "Improve ZecHub privacy and translation quality",
    description: "",
    status: "executed",
    proposer: "juno1proposer",
    votes: { yes: "12", no: "4", abstain: "3" },
    total_power: "27",
    threshold: {
      threshold_quorum: {
        quorum: { percent: "0.4" },
        threshold: { percent: "0.67" },
      },
    },
  },
} as unknown as FlatProposal;

describe("DAO proposal card", () => {
  it("shows the proposal's number", () => {
    render(<ProposalCard data={card} />);

    expect(screen.getByText("#149")).toBeInTheDocument();
  });
});

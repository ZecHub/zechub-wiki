import { fireEvent, render, screen } from "@testing-library/react";
import { ProposalCard } from "@/components/Proposals/proposal-card";
import {
  ProposalsListClient,
  type DaoJsonSchema,
  type FlatProposal,
} from "@/components/Proposals/proposals-list-client";

// The list also carries the Treasury tab, whose cards use the locale-aware Link.
jest.mock("@/i18n/navigation", () => ({ Link: "a" }));

// ZecHub's DAO uses threshold_quorum: 40% quorum, 67% threshold. In DAO DAO
// (dao-proposal-single, is_passed) abstentions count towards the quorum but
// not the threshold: yes votes are compared with yes + no.
function proposal(
  title: string,
  status: string,
  votes: { yes: number; no: number; abstain: number },
  totalPower: number,
) {
  return {
    title,
    description: "",
    status,
    proposer: "juno1proposer",
    votes: {
      yes: String(votes.yes),
      no: String(votes.no),
      abstain: String(votes.abstain),
    },
    total_power: String(totalPower),
    threshold: {
      threshold_quorum: {
        quorum: { percent: "0.4" },
        threshold: { percent: "0.67" },
      },
    },
  };
}

function card(raw: ReturnType<typeof proposal>, id = 1) {
  return {
    id,
    createdAt: "2026-07-01T00:00:00.000Z",
    coreAddress: "juno1core",
    proposalModuleAddress: "juno1module",
    daoName: "ZecHub",
    proposal: raw,
  } as unknown as FlatProposal;
}

function outcomeOf(raw: ReturnType<typeof proposal>) {
  const { container, unmount } = render(<ProposalCard data={card(raw)} />);
  const labels = ["Passed", "Failed Threshold", "Failed Quorum", "Voting Open"];
  const found = labels.filter((label) =>
    Array.from(container.querySelectorAll("span")).some(
      (span) => span.textContent === label,
    ),
  );
  unmount();
  return found;
}

describe("DAO proposal outcome", () => {
  it.each([
    // #33 "New member request." — executed with 5 yes, 5 abstain
    ["#33", { yes: 5, no: 0, abstain: 5 }, 17],
    // #56 and #58 — executed with 5 yes, 3 abstain
    ["#56", { yes: 5, no: 0, abstain: 3 }, 19],
    // #149 — executed with 12 yes, 4 no, 3 abstain
    ["#149", { yes: 12, no: 4, abstain: 3 }, 27],
  ])(
    "does not count abstentions against the threshold (%s, executed)",
    (_id, votes, totalPower) => {
      expect(
        outcomeOf(proposal("Executed", "executed", votes, totalPower)),
      ).toEqual(["Passed"]);
    },
  );

  it("still fails a proposal whose yes votes miss the threshold", () => {
    expect(
      outcomeOf(
        proposal("Split", "rejected", { yes: 3, no: 3, abstain: 1 }, 10),
      ),
    ).toEqual(["Failed Threshold"]);
  });

  it("does not pass a proposal on abstentions alone", () => {
    expect(
      outcomeOf(
        proposal("Abstain", "closed", { yes: 0, no: 0, abstain: 8 }, 17),
      ),
    ).toEqual(["Failed Threshold"]);
  });

  it("still reports a missed quorum", () => {
    expect(
      outcomeOf(proposal("Quiet", "closed", { yes: 1, no: 0, abstain: 0 }, 17)),
    ).toEqual(["Failed Quorum"]);
  });

  it("lists executed proposals with abstentions under the Passed filter", () => {
    const dao: DaoJsonSchema = {
      dao_data: {
        dao_address: "juno1core",
        name: "ZecHub",
        description: "",
        member_count: 17,
        proposal_count: 2,
        config: {
          name: "ZecHub",
          dao_uri: null,
          image_url: "",
          description: "",
          automatically_add_cw20s: false,
          automatically_add_cw721s: false,
        },
        proposals: [
          {
            id: 33,
            proposal: proposal(
              "New member request.",
              "executed",
              { yes: 5, no: 0, abstain: 5 },
              17,
            ),
          },
          {
            id: 34,
            proposal: proposal(
              "Rejected idea",
              "rejected",
              { yes: 3, no: 5, abstain: 0 },
              17,
            ),
          },
        ] as unknown as DaoJsonSchema["dao_data"]["proposals"],
      },
      subdao_count: 0,
      subdao_data: [],
    };

    render(<ProposalsListClient proposals={dao} />);
    fireEvent.click(screen.getByRole("button", { name: /^Passed/ }));

    expect(screen.getByText("New member request.")).toBeInTheDocument();
    expect(screen.queryByText("Rejected idea")).not.toBeInTheDocument();
  });

  it("does not put an open revotable proposal in the Passed filter", () => {
    // Valid threshold_quorum state: quorum is met, but revoting keeps the
    // proposal open until expiration. DAO DAO is_passed explicitly returns
    // false when allow_revoting && !expiration.is_expired(block).
    const dao = {
      dao_data: {
        dao_address: "juno1core",
        name: "ZecHub",
        description: "",
        member_count: 20,
        proposal_count: 1,
        config: {
          name: "ZecHub",
          dao_uri: null,
          image_url: "",
          description: "",
          automatically_add_cw20s: false,
          automatically_add_cw721s: false,
        },
        proposals: [
          {
            id: 182,
            createdAt: "2026-10-09T00:00:00.000Z",
            proposal: {
              title: "Still collecting revotable votes",
              description: "",
              status: "open",
              proposer: "juno1proposer",
              votes: { yes: "4", no: "1", abstain: "5" },
              total_power: "20",
              allow_revoting: true,
              expiration: { at_time: "1893456000000000000" },
              min_voting_period: null,
              threshold: {
                threshold_quorum: {
                  quorum: { percent: "0.4" },
                  threshold: { percent: "0.67" },
                },
              },
            },
          },
        ],
      },
      subdao_count: 0,
      subdao_data: [],
    } as unknown as DaoJsonSchema;

    render(<ProposalsListClient proposals={dao} />);
    expect(screen.getByText("Voting Open")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Passed/ }));
    expect(
      screen.queryByText("Still collecting revotable votes"),
    ).not.toBeInTheDocument();
  });

  it("leaves an open proposal out of the Passed filter even with only yes votes", () => {
    // This fixture allows revoting, so its open proposal cannot
    // pass before it expires, however many yes votes it already has. Its card
    // shows "Voting Open"; the filter has to agree.
    const dao = {
      dao_data: {
        dao_address: "juno1core",
        name: "ZecHub",
        description: "",
        member_count: 20,
        proposal_count: 1,
        config: {
          name: "ZecHub",
          dao_uri: null,
          image_url: "",
          description: "",
          automatically_add_cw20s: false,
          automatically_add_cw721s: false,
        },
        proposals: [
          {
            id: 183,
            proposal: {
              ...proposal(
                "Early yes votes",
                "open",
                { yes: 10, no: 0, abstain: 0 },
                20,
              ),
              allow_revoting: true,
              expiration: { at_time: "1893456000000000000" },
            },
          },
        ],
      },
      subdao_count: 0,
      subdao_data: [],
    } as unknown as DaoJsonSchema;

    render(<ProposalsListClient proposals={dao} />);
    expect(screen.getByText("Voting Open")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Passed/ }));

    expect(screen.queryByText("Early yes votes")).not.toBeInTheDocument();
  });
});

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProtocolParametersPage from "../../app/[locale]/protocol-parameters/page";

const DATA_URL = "https://raw.githubusercontent.com/ZecHub/Namada/main/public/data";
const PARAMETERS_URL = `${DATA_URL}/protocol_parameters.json`;
const PROPOSALS_URL = `${DATA_URL}/props.json`;

// Trimmed copies of the files published by ZecHub/Namada.
const parameters = {
  Governance_Parameters: [{ Min_proposal_voting_period: "12 epochs" }],
  Public_Goods_Funding_Parameters: [
    { Pgf_inflation_rate: 0.1, Steward_inflation_rate: 0, Max_number_of_stewards: 5 },
  ],
  Protocol_Parameters: [
    {
      Epochs_per_year: 1460,
      Is_native_token_transferable: true,
      VP_allowlist: ["vp-hash"],
      Transactions_allowlist: ["tx-hash"],
      Protocol_Parameters: [{ id: "tnam1fee", per_gas_unit: "1" }],
    },
  ],
  Proof_Of_Stake_Parameters: [{ Max_consensus_validator_slots: 255, Max_inflation_rate: 0.0275 }],
  IBC_Parameters: [{ Default_mint_limit: 0 }],
};

const proposals = {
  Last_committed_epoch: 2663,
  Proposal: [
    {
      id: 42,
      Type: "Default",
      Author: "tnam1author",
      Start_Epoch: "1827",
      End_Epoch: "1867",
      Activation_Epoch: "1868",
    },
  ],
};

const originalFetch = global.fetch;

function serve(files: Record<string, unknown>) {
  const fetchMock = jest.fn(async (input: RequestInfo | URL) => {
    const body = files[String(input)];
    return {
      ok: body !== undefined,
      status: body === undefined ? 404 : 200,
      json: async () => body,
    } as Response;
  });
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

async function renderPage(files: Record<string, unknown>) {
  const fetchMock = serve(files);
  render(<ProtocolParametersPage />);
  await waitFor(() => expect(screen.queryByText("Governance Parameters")).toBeInTheDocument());
  return fetchMock;
}

const valueOf = (label: string) => screen.getByText(label).nextElementSibling?.textContent;

afterEach(() => {
  global.fetch = originalFetch;
});

describe("/protocol-parameters", () => {
  it("loads the parameters and proposals from the ZecHub/Namada repo", async () => {
    const fetchMock = await renderPage({
      [PARAMETERS_URL]: [parameters],
      [PROPOSALS_URL]: [proposals],
    });

    expect(fetchMock).toHaveBeenCalledWith(PARAMETERS_URL);
    expect(fetchMock).toHaveBeenCalledWith(PROPOSALS_URL);
    expect(screen.queryByText("Error:")).not.toBeInTheDocument();
  });

  it("renders every parameter section, including Proof of Stake", async () => {
    await renderPage({ [PARAMETERS_URL]: [parameters], [PROPOSALS_URL]: [proposals] });

    expect(valueOf("Min proposal voting period")).toBe("12 epochs");
    expect(valueOf("Epochs per year")).toBe("1460");
    expect(valueOf("Is native token transferable")).toBe("Yes");
    expect(valueOf("Max consensus validator slots")).toBe("255");
    expect(valueOf("Max inflation rate")).toBe("2.75%");
    expect(screen.getByText("vp-hash")).toBeInTheDocument();
    expect(screen.getByText("tx-hash")).toBeInTheDocument();
  });

  it("shows the steward cap as a count and only the rates as percentages", async () => {
    await renderPage({ [PARAMETERS_URL]: [parameters], [PROPOSALS_URL]: [proposals] });

    expect(valueOf("Max number of stewards")).toBe("5");
    expect(valueOf("Pgf inflation rate")).toBe("10%");
    expect(valueOf("Steward inflation rate")).toBe("0%");
  });

  it("lists the governance proposals", async () => {
    await renderPage({ [PARAMETERS_URL]: [parameters], [PROPOSALS_URL]: [proposals] });

    fireEvent.click(screen.getByRole("button", { name: "Governance Proposals" }));

    expect(await screen.findByText("tnam1author")).toBeInTheDocument();
    expect(screen.getByText("2663")).toBeInTheDocument();
  });

  it("keeps the other sections when one is missing from the file", async () => {
    const withoutProofOfStake: Partial<typeof parameters> = { ...parameters };
    delete withoutProofOfStake.Proof_Of_Stake_Parameters;

    await renderPage({ [PARAMETERS_URL]: [withoutProofOfStake], [PROPOSALS_URL]: [proposals] });

    expect(valueOf("Max number of stewards")).toBe("5");
    expect(screen.queryByText("Max consensus validator slots")).not.toBeInTheDocument();
  });
});

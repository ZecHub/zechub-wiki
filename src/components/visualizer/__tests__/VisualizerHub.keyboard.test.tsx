import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VisualizerHub } from "../VisualizerHub";

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: {} }),
}));

jest.mock("framer-motion", () => {
  const React = require("react");
  const motion = new Proxy(
    {},
    {
      get: (_target, element) => {
        const Tag = typeof element === "string" ? element : "div";
        return React.forwardRef(
          (
            {
              children,
              initial,
              animate,
              transition,
              whileHover,
              whileTap,
              ...props
            }: Record<string, unknown>,
            ref: React.Ref<HTMLElement>,
          ) => React.createElement(Tag, { ...props, ref }, children as React.ReactNode),
        );
      },
    },
  );
  return { motion };
});

jest.mock("@/components/UI/shadcn/button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

function stubVisualizer(testId: string) {
  return function Stub() {
    return <div data-testid={testId}>{testId}</div>;
  };
}

jest.mock("../zcash-wallet", () => ({
  WalletVisualizer: stubVisualizer("visualizer-zcash-wallet"),
}));
jest.mock("../zcash-pool-visualizer", () => ({
  ZcashPoolVisualizer: stubVisualizer("visualizer-pool"),
}));
jest.mock("../pay-with-zcash", () => ({
  PayWithZcashVisualizer: stubVisualizer("visualizer-pay-with-zcash"),
}));
jest.mock("../zcash-dex-visualizer/ZcashDexVisualizer", () => ({
  ZcashDexVisualizer: stubVisualizer("visualizer-zcash-dex"),
}));
jest.mock("../hash-function-visualizer", () => ({
  HashFunctionVisualizer: stubVisualizer("visualizer-hash-function"),
}));
jest.mock("../blockchain-foundation", () => ({
  BlockchainFoundationVisualizer: stubVisualizer("visualizer-blockchain-foundation"),
}));
jest.mock("../distributed-databases/DistributedDatabaseVisualizer", () => ({
  __esModule: true,
  default: stubVisualizer("visualizer-distributed-database"),
}));
jest.mock("../zk-SNARK-proof/ZK-SNARKProofVisualizer", () => ({
  __esModule: true,
  default: stubVisualizer("visualizer-zkproof"),
}));
jest.mock("../BuildShieldedTransaction", () => ({
  BuildShieldedTransactionVisualizer: stubVisualizer(
    "visualizer-build-shielded-transaction",
  ),
}));
jest.mock("../CrosslinkProtocol", () => ({
  __esModule: true,
  default: stubVisualizer("visualizer-CrossLink-Protocol"),
}));
jest.mock("../zcash-key-visualizer", () => ({
  ZcashKeyVisualizer: stubVisualizer("visualizer-zcash-key"),
}));
jest.mock("../zcash-infrastructure-visualizer", () => ({
  ZcashInfrastructureVisualizer: stubVisualizer("visualizer-infrastructure"),
}));
jest.mock("../consensus-visualizer", () => ({
  ConsensusVisualizer: stubVisualizer("visualizer-consensus"),
}));
jest.mock("../MiningHalo", () => ({
  MiningHaloVisualizer: stubVisualizer("visualizer-mining-halo"),
}));
jest.mock("../PrivacyUsecases", () => ({
  PrivacyUseCasesVisualizer: stubVisualizer("visualizer-privacy-use-cases"),
}));
jest.mock("../Governance", () => ({
  GovernanceVisualizer: stubVisualizer("visualizer-governance"),
}));
jest.mock("../frost-multisig", () => ({
  FrostMultisigVisualizer: stubVisualizer("visualizer-frost-multisig"),
}));
jest.mock("../contribution-visualizer", () => ({
  ContributionVisualizer: stubVisualizer("visualizer-zechub-bounties"),
}));
jest.mock("../DAOProposals", () => ({
  DAOProposalVisualizer: stubVisualizer("visualizer-dao-proposal"),
}));
jest.mock("../zcash-community-grants", () => ({
  ZcashCommunityGrantsVisualizer: stubVisualizer(
    "visualizer-zcash-community-grants",
  ),
}));
jest.mock("../coinholder-grants", () => ({
  CoinholderGrantsVisualizer: stubVisualizer("visualizer-coinholder-grants"),
}));
jest.mock("../open-source-repos", () => ({
  OpenSourceReposVisualizer: stubVisualizer("visualizer-open-source-repos"),
}));
jest.mock("../zkav-club", () => ({
  ZkavClubVisualizer: stubVisualizer("visualizer-zkav-club"),
}));
jest.mock("../QuizModule", () => ({
  QuizCard: ({ title }: { title: string }) => <div>{title}</div>,
  QuizModule: () => null,
}));

async function openCardByKeyboard(name: RegExp) {
  const user = userEvent.setup();
  const card = screen.getByRole("button", { name });
  card.focus();
  expect(card).toHaveFocus();
  await user.keyboard("{Enter}");
}

async function returnToHub() {
  const user = userEvent.setup();
  const back = screen.getByRole("button", { name: "Back to Visualizer Hub" });
  back.focus();
  await user.keyboard("{Enter}");
  expect(
    screen.getByRole("heading", { name: "Zcash Visualizers" }),
  ).toBeInTheDocument();
}

describe("VisualizerHub keyboard navigation", () => {
  it("opens a Basic card with Enter and returns to the grid", async () => {
    render(<VisualizerHub />);
    await openCardByKeyboard(/Introduction to Zcash Wallets/i);
    expect(screen.getByTestId("visualizer-zcash-wallet")).toBeInTheDocument();
    await returnToHub();
  });

  it("opens an Advanced card with Space and returns to the grid", async () => {
    const user = userEvent.setup();
    render(<VisualizerHub />);
    const card = screen.getByRole("button", { name: /zk-SNARKs/i });
    card.focus();
    await user.keyboard(" ");
    expect(screen.getByTestId("visualizer-zkproof")).toBeInTheDocument();
    await returnToHub();
  });

  it("opens a Contributor card with Enter and returns to the grid", async () => {
    render(<VisualizerHub />);
    await openCardByKeyboard(/ZecHub Bounties/i);
    expect(screen.getByTestId("visualizer-zechub-bounties")).toBeInTheDocument();
    await returnToHub();
  });
});

import { render, screen } from "@testing-library/react";
import { useLanguage } from "@/context/LanguageContext";
import { Difficulty } from "../visualizer/blockchain-foundation/Difficulty";
import { Miners } from "../visualizer/blockchain-foundation/Miners";
import { stages } from "../visualizer/blockchain-foundation/types";
import en from "../../../dictionaries/en.json";
import fr from "../../../dictionaries/fr.json";
import zh from "../../../dictionaries/zh.json";

jest.mock("@/context/LanguageContext", () => ({ useLanguage: jest.fn() }));

const mockLanguage = (dictionary: unknown) => {
  jest.mocked(useLanguage).mockReturnValue({
    t: dictionary,
  } as ReturnType<typeof useLanguage>);
};

describe("Blockchain Foundation mainnet facts after NU7", () => {
  it.each<[unknown, string, string]>([
    [en, "25 seconds", "Target: 25 sec"],
    [fr, "25 secondes", "Cible : 25 sec"],
    [zh, "25 秒", "目标：25 秒"],
    [{}, "25 seconds", "Target: 25 sec"],
  ])("shows the current target in the card and diagram", (dictionary, card, diagram) => {
    mockLanguage(dictionary);
    render(<Difficulty />);
    expect(screen.getByText(card)).toBeInTheDocument();
    expect(screen.getByText(diagram)).toBeInTheDocument();
  });

  it("describes the same target in the difficulty step", () => {
    expect(stages.find(({ blockchainType }) => blockchainType === "difficulty")?.description)
      .toContain("25-second");
  });

  it("shows the post-NU7 subsidy and the existing allocation ratios", () => {
    render(<Miners />);
    expect(screen.getByRole("heading", { name: /0\.52083333 ZEC/ })).toBeInTheDocument();
    expect(screen.getByText("Miners (80%)")).toBeInTheDocument();
    expect(screen.getByText("Zcash Community Grants Committee (ZCG) (8%)")).toBeInTheDocument();
    expect(screen.getByText("Lockbox (12%)")).toBeInTheDocument();
  });
});

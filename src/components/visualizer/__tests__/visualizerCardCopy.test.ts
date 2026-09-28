import { visualizerCardCopy } from "../visualizerCardCopy";

const englishCard = {
  id: "zcash-wallet" as const,
  title: "Introduction to Zcash Wallets",
  description: "Providing Shielded Functionality",
};

const newerCard = {
  id: "frost-multisig" as const,
  title: "FROST & Private Multi Signatures",
  description: "Secure multisig without a single point of failure",
};

describe("visualizerCardCopy", () => {
  it("uses visualizer-section labels when present", () => {
    const t = {
      visualizer: {
        wallets: {
          title: "Carteiras Zcash",
          description: "Funcionalidade shielded",
        },
      },
    };
    expect(visualizerCardCopy(t, englishCard)).toEqual({
      title: "Carteiras Zcash",
      description: "Funcionalidade shielded",
    });
  });

  it("falls back to the English card copy when the locale has no entry", () => {
    expect(visualizerCardCopy({ visualizer: {} }, englishCard)).toEqual({
      title: englishCard.title,
      description: englishCard.description,
    });
  });

  it("falls back to English for newer modules without a dictionary key", () => {
    const t = {
      visualizer: {
        wallets: { title: "Carteiras Zcash", description: "Shielded" },
      },
    };
    expect(visualizerCardCopy(t, newerCard)).toEqual({
      title: newerCard.title,
      description: newerCard.description,
    });
  });
});

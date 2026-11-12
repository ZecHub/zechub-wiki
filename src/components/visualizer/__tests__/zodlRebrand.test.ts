import { slides } from "../pay-with-zcash/PayWithZcashContent";
import { WALLET_INTEGRATIONS } from "../zcash-dex-visualizer/ZcashDexVisualizer";

describe("ZODL visualizer copy", () => {
  it("uses the current ZODL name and live site in the Pay with Zcash visualizer", () => {
    const flexaSlide = slides.find((slide) => slide.id === "flexa-zodl");

    expect(flexaSlide).toBeDefined();
    expect(flexaSlide).toMatchObject({
      title: "Flexa in ZODL Wallet",
      link: "https://zodl.com/",
      linkText: "Download ZODL Wallet",
    });
    expect(flexaSlide?.steps).toContain(
      "Open ZODL wallet on your mobile device",
    );
  });

  it("does not keep the retired Zashi name or dead zashi.cash link in visualizer data", () => {
    const payWithZcashText = slides
      .flatMap((slide) => [
        slide.id,
        slide.title,
        slide.link,
        slide.linkText,
        ...slide.steps,
      ])
      .join("\n");
    const dexWalletText = WALLET_INTEGRATIONS.join("\n");

    expect(payWithZcashText).not.toContain("Zashi");
    expect(payWithZcashText).not.toContain("zashi.cash");
    expect(dexWalletText).not.toContain("Zashi");
  });

  it("lists ZODL Wallet as a DEX wallet integration", () => {
    expect(WALLET_INTEGRATIONS).toContain("ZODL Wallet");
  });
});

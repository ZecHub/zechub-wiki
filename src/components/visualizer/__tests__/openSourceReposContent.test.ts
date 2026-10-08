import { slides } from "../open-source-repos/OpenSourceReposContent";

const slideText = slides
  .flatMap((slide) => [slide.title, slide.link, slide.linkText, ...slide.steps])
  .join("\n");

describe("OpenSourceReposContent slides", () => {
  it("does not send contributors to the archived zcashd repository", () => {
    expect(slideText).not.toContain("github.com/zcash/zcash");
    expect(slideText).not.toContain("zcash/zcash");
  });

  it("points newcomers at active Zcash repositories that accept pull requests", () => {
    expect(slideText).toContain("ZcashFoundation/zebra");
    expect(slideText).toContain("zcash/zallet");
    expect(slideText).toContain("zcash/librustzcash");

    expect(slides.find((slide) => slide.id === "pr")?.link).toBe(
      "https://github.com/ZcashFoundation/zebra/pulls",
    );
    expect(slides.find((slide) => slide.id === "review")?.link).toBe(
      "https://github.com/ZcashFoundation/zebra/blob/main/CONTRIBUTING.md",
    );
  });

  it("describes Zebra as the recommended full node, not an alternative node", () => {
    expect(slideText).toContain("recommended full node");
    expect(slideText.toLowerCase()).not.toContain("alternative node");
  });
});

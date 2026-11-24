import { bulletizeLinkParagraphs } from "@/lib/normalizeMdx";

describe("bulletizeLinkParagraphs", () => {
  it("turns consecutive link-only paragraphs into a bullet list", () => {
    const input = "## Resources\n\n[One](https://a.test)\n\n[Two](/two)\n\n[Three](/three)\n\nText";
    expect(bulletizeLinkParagraphs(input)).toBe(
      "## Resources\n\n- [One](https://a.test)\n- [Two](/two)\n- [Three](/three)\n\nText",
    );
  });

  it("leaves a single link, inline links, lists and code alone", () => {
    const single = "Intro\n\n[Only](/only)\n\nMore";
    expect(bulletizeLinkParagraphs(single)).toBe(single);
    const mixed = "[A](/a) and text\n\n[B](/b)";
    expect(bulletizeLinkParagraphs(mixed)).toBe(mixed);
    const code = "```\n[A](/a)\n\n[B](/b)\n```";
    expect(bulletizeLinkParagraphs(code)).toBe(code);
    const list = "- [A](/a)\n- [B](/b)";
    expect(bulletizeLinkParagraphs(list)).toBe(list);
  });
});

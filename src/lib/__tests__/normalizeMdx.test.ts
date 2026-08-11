import { normalizeResearchMdx } from "../normalizeMdx";

describe("normalizeResearchMdx", () => {
  it("puts a localized details summary on its own MDX lines", () => {
    const source = [
      "A question.",
      "",
      "<details><summary>Antwort</summary>",
      "",
      "The answer.",
      "</details>",
    ].join("\n");

    expect(normalizeResearchMdx(source)).toBe(
      "A question.\n\n<details>\n<summary>Antwort</summary>\n\nThe answer.\n\n</details>",
    );
  });

  it("preserves localized summary text and attributes", () => {
    const source =
      '<details open><summary data-label="localized">Réponse</summary>Text</details>';

    expect(normalizeResearchMdx(source)).toBe(
      '<details open>\n<summary data-label="localized">Réponse</summary>\n\nText\n\n</details>',
    );
  });
});

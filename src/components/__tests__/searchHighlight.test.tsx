import { render } from "@testing-library/react";
import { HighlightMatch } from "../SearchBar/HighlightMatch";

describe("HighlightMatch", () => {
  it.each(["confidentialite", "Confidentialité"])("highlights the original French title for %s", (query) => {
    const title = "Confidentialité du minage et du staking";
    const { container } = render(<HighlightMatch text={title} query={query} />);

    expect(container.textContent).toBe(title);
    expect(container.querySelector("mark")).toHaveTextContent("Confidentialité");
  });

  it("keeps combining accents attached to the match", () => {
    const text = "Un cafe\u0301 ici";
    const { container } = render(<HighlightMatch text={text} query="café" />);

    expect(container.textContent).toBe(text);
    expect(container.querySelector("mark")?.textContent).toBe("cafe\u0301");
  });

  it("renders a decomposed ligature only once when several tokens match it", () => {
    const { container } = render(<HighlightMatch text="oﬃce" query="f i" />);

    expect(container.textContent).toBe("oﬃce");
    expect(Array.from(container.querySelectorAll("mark"), (mark) => mark.textContent)).toEqual(["ﬃ"]);
  });

  it("preserves ordinary substring matches and surrounding punctuation", () => {
    const { container } = render(<HighlightMatch text="Guide (MINAGE)" query="min" />);

    expect(container.textContent).toBe("Guide (MINAGE)");
    expect(container.querySelector("mark")).toHaveTextContent("MIN");
  });
});

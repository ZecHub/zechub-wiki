import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SkipToContent, {
  MAIN_CONTENT_ID,
  SKIP_TO_CONTENT_FALLBACK,
} from "../SkipToContent";

describe("SkipToContent", () => {
  it("points at the shared content wrapper", () => {
    render(<SkipToContent />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `#${MAIN_CONTENT_ID}`,
    );
  });

  it("uses the localized label and falls back to English", () => {
    const { unmount } = render(<SkipToContent label="Saltar al contenido" />);
    expect(screen.getByRole("link")).toHaveTextContent("Saltar al contenido");
    unmount();

    // A locale with no entry for the key, or a whitespace-only one, must not
    // render an empty link — getDictionary returns undefined for missing keys.
    for (const label of [undefined, "", "   "]) {
      const { unmount: u } = render(<SkipToContent label={label} />);
      expect(screen.getByRole("link")).toHaveTextContent(
        SKIP_TO_CONTENT_FALLBACK,
      );
      u();
    }
  });

  it("is hidden until focused, then revealed", () => {
    render(<SkipToContent />);
    const link = screen.getByRole("link");

    // Visually hidden but still in the accessibility tree and tab order, which
    // is what lets a keyboard user reach it.
    expect(link).toHaveClass("sr-only");
    expect(link).not.toHaveAttribute("aria-hidden");
    expect(link).not.toHaveAttribute("tabindex");

    // Revealed on focus, above the sticky header (z-200) and drawer (z-201).
    expect(link.className).toContain("focus:not-sr-only");
    expect(link.className).toContain("focus:z-[300]");
    // globals.css resets outline with !important, so the focus affordance has
    // to come from a ring/background rather than an outline.
    expect(link.className).toContain("focus:ring-2");
    expect(link.className).toContain("focus:bg-white");
    // Logical inset so the link flips side in RTL locales.
    expect(link.className).toContain("focus:start-4");
  });

  it("is the first element a keyboard user reaches", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipToContent />
        <header>
          <a href="#wallets">Wallets</a>
          <button type="button">Search</button>
        </header>
        <div id={MAIN_CONTENT_ID} tabIndex={-1}>
          <a href="#in-content">In content</a>
        </div>
      </>,
    );

    await user.tab();

    expect(screen.getByRole("link", { name: SKIP_TO_CONTENT_FALLBACK })).toHaveFocus();
  });

  it("moves focus into the content wrapper when activated", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipToContent />
        <header>
          <a href="#wallets">Wallets</a>
        </header>
        <div id={MAIN_CONTENT_ID} tabIndex={-1}>
          <a href="#in-content">In content</a>
        </div>
      </>,
    );

    const target = document.getElementById(MAIN_CONTENT_ID)!;
    // jsdom does not implement fragment navigation, so assert the contract the
    // browser relies on: the target is programmatically focusable, and the next
    // tab stop from there is inside the content rather than back in the header.
    expect(target).toHaveAttribute("tabindex", "-1");
    target.focus();
    expect(target).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: "In content" })).toHaveFocus();
  });
});

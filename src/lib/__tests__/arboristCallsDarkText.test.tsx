import { render } from "@testing-library/react";
import ArboristCallsPage from "@/app/[locale]/arborist-calls/ArboristCallsPage";

jest.mock("@/lib/helpers", () => ({ genMetadata: () => ({}) }));

// Mid and dark shades that read fine on white but fall well below WCAG AA on
// the dark theme's slate-900 page (gray-700 is 1.7:1, gray-600 2.4:1).
const LIGHT_ONLY_TEXT =
  /^text-(gray|slate|zinc|neutral|stone|blue|red)-(500|600|700|800|900)$/;

const hasOwnText = (el: Element) =>
  Array.from(el.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
  );

function textWithoutDarkVariant(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("*"))
    .filter((el) => {
      const classes = Array.from(el.classList);
      return (
        hasOwnText(el) &&
        classes.some((c) => LIGHT_ONLY_TEXT.test(c)) &&
        !classes.some((c) => c.startsWith("dark:text-"))
      );
    })
    .map(
      (el) =>
        `${el.tagName.toLowerCase()}: ${el.textContent?.trim().slice(0, 40)}`,
    );
}

describe("Arborist call archive in the dark theme", () => {
  it("gives every grey or coloured text a dark-theme colour", () => {
    const { container } = render(<ArboristCallsPage />);

    expect(textWithoutDarkVariant(container)).toEqual([]);
  });
});

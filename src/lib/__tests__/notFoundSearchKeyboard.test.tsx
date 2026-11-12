import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import NotFoundSearch from "@/components/NotFoundSearch";

const mockPush = jest.fn();
const mockSuggest = jest.fn();
jest.mock("@/i18n/navigation", () => ({
  Link: React.forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(function MockLink(props, ref) { return <a {...props} ref={ref} />; }),
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/es/no-such-page",
}));
jest.mock("@/context/LanguageContext", () => ({ useLanguage: () => ({ t: { common: {} } }) }));
jest.mock("@/hooks/useDarkModeContext", () => ({ useDarkModeContext: () => ({ dark: false }) }));
jest.mock("next-intl/routing", () => ({ defineRouting: (config: unknown) => config }));
jest.mock("@/lib/notFoundSuggestions", () => ({ suggestPages: (...args: unknown[]) => mockSuggest(...args) }));
const items = [
  { name: "Zcash Alpha", desc: "First", url: "/guides/alpha" },
  { name: "Zcash Beta", desc: "Second", url: "/guides/beta" },
  { name: "Zcash Gamma", desc: "Third", url: "/guides/gamma" },
];
beforeEach(() => { mockPush.mockClear(); mockSuggest.mockReturnValue(items); });
const key = (input: HTMLElement, value: string) => fireEvent.keyDown(input, { key: value });
function setup(query = "") {
  render(<NotFoundSearch searchItems={items} />);
  const input = screen.getByRole("searchbox", { name: "Search" });
  if (query) fireEvent.change(input, { target: { value: query } });
  return input;
}
it.each(["", "zcash"])("selects and opens the second %s result while retaining input focus", (query) => {
  const input = setup(query); input.focus();
  key(input, "ArrowDown"); key(input, "ArrowDown");
  expect(screen.getAllByRole("link")[1]).toHaveAttribute("aria-current", "true");
  const second = screen.getAllByRole("link")[1];
  expect(screen.getByRole("status")).toHaveTextContent("2 / 3:");
  expect(input).toHaveFocus();
  key(input, "Enter"); expect(mockPush).toHaveBeenCalledWith(second.getAttribute("href"));
});
it("wraps both directions and Escape clears selection", () => {
  const input = setup(); key(input, "ArrowUp");
  expect(screen.getAllByRole("link")[2]).toHaveAttribute("aria-current", "true");
  key(input, "ArrowDown"); expect(screen.getAllByRole("link")[0]).toHaveAttribute("aria-current", "true");
  key(input, "ArrowUp"); key(input, "Escape");
  expect(screen.getByRole("status")).toBeEmptyDOMElement();
  key(input, "Enter"); expect(mockPush).toHaveBeenCalledWith(items[0].url);
});
it("query changes reset selection, and unmatched queries do not navigate", () => {
  const input = setup("zcash"); key(input, "ArrowDown"); key(input, "ArrowDown");
  fireEvent.change(input, { target: { value: "gamma" } });
  expect(screen.getByRole("status")).toBeEmptyDOMElement();
  key(input, "Enter"); expect(mockPush).toHaveBeenLastCalledWith(items[2].url);
  mockPush.mockClear(); fireEvent.change(input, { target: { value: "qqqqxxxxzzzz" } });
  key(input, "ArrowDown"); key(input, "ArrowUp"); key(input, "Enter"); expect(mockPush).not.toHaveBeenCalled();
});
it("does not consume composing arrows or Enter, and uses the locale-aware router", () => {
  const input = setup();
  fireEvent.keyDown(input, { key: "ArrowDown", isComposing: true });
  fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
  expect(screen.getByRole("status")).toBeEmptyDOMElement(); expect(mockPush).not.toHaveBeenCalled();
  key(input, "ArrowUp"); key(input, "Enter"); expect(mockPush).toHaveBeenCalledWith("/guides/gamma");
  expect(mockSuggest).toHaveBeenCalledWith(items, "/es/no-such-page", expect.any(Object));
});
it("changed result lists clear stale selection", () => {
  const { rerender } = render(<NotFoundSearch searchItems={items} />);
  const input = screen.getByRole("searchbox"); key(input, "ArrowUp");
  mockSuggest.mockReturnValue([items[0]]);
  rerender(<NotFoundSearch searchItems={[items[0]]} />);
  expect(screen.getByRole("status")).toBeEmptyDOMElement();
  key(input, "Enter"); expect(mockPush).toHaveBeenCalledWith(items[0].url);
});

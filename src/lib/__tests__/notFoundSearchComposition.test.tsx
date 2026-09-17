import React from "react";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import NotFoundSearch from "@/components/NotFoundSearch";

const mockPush = jest.fn();

jest.mock("@/i18n/navigation", () => ({
  Link: (props: React.ComponentProps<"a">) => <a {...props} />,
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/guides/japanese-intro.html",
}));

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: { common: {} } }),
}));

jest.mock("@/hooks/useDarkModeContext", () => ({
  useDarkModeContext: () => ({ dark: false }),
}));

// Keep the application routing configuration while isolating the ESM factory.
jest.mock("next-intl/routing", () => ({
  defineRouting: (config: unknown) => config,
}));

const items = [
  { name: "日本語 入門", desc: "Japanese introduction", url: "/guides/japanese-intro" },
  { name: "日本語 道具", desc: "Japanese tools", url: "/guides/japanese-tools" },
];

function press(input: HTMLElement, init: KeyboardEventInit) {
  const event = createEvent.keyDown(input, { ...init, bubbles: true, cancelable: true });
  fireEvent(input, event);
  return event;
}

beforeEach(() => mockPush.mockClear());

describe.each(["suggestions", "search results"])("404 search IME with %s", (mode) => {
  it.each(["composing", "final keyCode 229"])("leaves %s Enter to the IME and resumes normal navigation", (phase) => {
    render(<NotFoundSearch searchItems={items} />);
    const input = screen.getByRole("searchbox", { name: "Search" });
    if (mode === "search results") {
      fireEvent.change(input, { target: { value: "日本語" } });
    }
    expect(screen.getByRole("heading", {
      name: mode === "suggestions" ? "Suggested pages" : "Results",
    })).toBeInTheDocument();
    const firstUrl = screen.getAllByRole("link")[0].getAttribute("href");
    expect(firstUrl).toBe(items[0].url);
    input.focus();
    fireEvent.compositionStart(input);
    if (phase === "final keyCode 229") {
      fireEvent.compositionEnd(input, { data: "日本語" });
    }
    const event = press(input, {
      key: "Enter",
      isComposing: phase === "composing",
      keyCode: phase === "final keyCode 229" ? 229 : 13,
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
    expect(input).toHaveFocus();
    expect(input).toHaveValue(mode === "suggestions" ? "" : "日本語");

    if (phase === "composing") {
      fireEvent.compositionEnd(input, { data: "日本語" });
    }
    const ordinary = press(input, { key: "Enter", isComposing: false, keyCode: 13 });
    expect(ordinary.defaultPrevented).toBe(true);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(firstUrl);
  });
});

it("keeps ordinary Enter from navigating when the query has no matches", () => {
  render(<NotFoundSearch searchItems={items} />);
  const input = screen.getByRole("searchbox", { name: "Search" });
  fireEvent.change(input, { target: { value: "zzzzqqqqxxxx" } });
  expect(screen.getByText("No matching pages")).toBeInTheDocument();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
  press(input, { key: "Enter" });
  expect(mockPush).not.toHaveBeenCalled();
});

import React from "react";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";

const mockPush = jest.fn();

jest.mock("@/i18n/navigation", () => ({
  Link: React.forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
    function Link(props, ref) {
      return <a {...props} ref={ref} />;
    },
  ),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: { common: {} } }),
}));

jest.mock("@/hooks/useDarkModeContext", () => ({
  useDarkModeContext: () => ({ dark: false }),
}));

jest.mock("@/components/AIAssistant", () => ({
  __esModule: true,
  default: ({ autoSendQuery, autoSendNonce }: {
    autoSendQuery: string;
    autoSendNonce: number;
  }) => (
    <div
      data-testid="ai-panel"
      data-query={autoSendQuery}
      data-nonce={autoSendNonce}
    />
  ),
}));

const items = [
  { name: "日本語 入門", desc: "Getting started", url: "/start-here/intro" },
  { name: "日本語 道具", desc: "Using tools", url: "/guides/tools" },
  { name: "日本語 資料", desc: "Further reading", url: "/guides/reference" },
];

async function openSearch() {
  const onClose = jest.fn();
  render(<SearchBar openSearch setOpenSearch={onClose} searchItems={items} />);
  const input = await screen.findByRole("searchbox", { name: "Search" });
  fireEvent.change(input, { target: { value: "日本語" } });
  return { input, onClose };
}

function press(input: HTMLElement, init: KeyboardEventInit) {
  const event = createEvent.keyDown(input, { ...init, bubbles: true, cancelable: true });
  fireEvent(input, event);
  return event;
}

function selectedLink() {
  return screen.getAllByRole("link").find((link) => link.dataset.selected === "true");
}

beforeEach(() => {
  mockPush.mockClear();
});

describe("SearchBar IME composition", () => {
  it("leaves composing Enter to the IME, then opens the result after composition ends", async () => {
    const { input, onClose } = await openSearch();
    fireEvent.compositionStart(input);
    const composing = press(input, { key: "Enter", isComposing: true });

    expect(mockPush).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(composing.defaultPrevented).toBe(false);
    expect(input).toHaveValue("日本語");

    fireEvent.compositionEnd(input, { data: "日本語" });
    const committed = press(input, { key: "Enter", isComposing: false });
    expect(committed.defaultPrevented).toBe(true);
    expect(mockPush).toHaveBeenCalledWith(items[0].url);
    expect(onClose).toHaveBeenCalledWith(false);
  });

  it.each(["ArrowDown", "ArrowUp"])("does not change the selected result for composing %s", async (key) => {
    const { input } = await openSearch();
    press(input, { key: "ArrowDown" });
    const selected = selectedLink();
    expect(selected).toHaveAttribute("href", items[1].url);

    fireEvent.compositionStart(input);
    const event = press(input, { key, isComposing: true });

    expect(selectedLink()).toBe(selected);
    expect(event.defaultPrevented).toBe(false);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it.each(["ctrlKey", "metaKey"] as const)("does not send an AI query for composing %s+Enter", async (modifier) => {
    const { input, onClose } = await openSearch();
    fireEvent.compositionStart(input);
    const event = press(input, { key: "Enter", [modifier]: true, isComposing: true });

    expect(screen.getByTestId("ai-panel")).toHaveAttribute("data-nonce", "0");
    expect(event.defaultPrevented).toBe(false);
    expect(screen.getByRole("searchbox", { name: "Search" })).toBe(input);
    expect(mockPush).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it.each([false, true])("ignores the final keyCode 229 Enter when isComposing is already false (Ctrl: %s)", async (ctrlKey) => {
    const { input, onClose } = await openSearch();
    fireEvent.compositionStart(input);
    fireEvent.compositionEnd(input, { data: "日本語" });
    const event = press(input, { key: "Enter", keyCode: 229, isComposing: false, ctrlKey });

    expect(mockPush).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByTestId("ai-panel")).toHaveAttribute("data-nonce", "0");
    expect(event.defaultPrevented).toBe(false);
    expect(screen.getByRole("searchbox", { name: "Search" })).toBe(input);
  });

  it("preserves ordinary arrow selection and Enter navigation", async () => {
    const { input, onClose } = await openSearch();
    expect(press(input, { key: "ArrowDown" }).defaultPrevented).toBe(true);
    press(input, { key: "ArrowDown" });
    expect(selectedLink()).toHaveAttribute("href", items[2].url);
    expect(press(input, { key: "ArrowUp" }).defaultPrevented).toBe(true);
    expect(selectedLink()).toHaveAttribute("href", items[1].url);

    press(input, { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith(items[1].url);
    expect(onClose).toHaveBeenCalledWith(false);
  });

  it.each(["ctrlKey", "metaKey"] as const)("preserves %s+Enter after composition ends", async (modifier) => {
    const { input, onClose } = await openSearch();
    fireEvent.compositionStart(input);
    fireEvent.compositionEnd(input, { data: "日本語" });
    const event = press(input, { key: "Enter", [modifier]: true, isComposing: false });

    expect(event.defaultPrevented).toBe(true);
    expect(screen.queryByRole("searchbox", { name: "Search" })).not.toBeInTheDocument();
    expect(screen.getByTestId("ai-panel")).toHaveAttribute("data-query", "日本語");
    expect(screen.getByTestId("ai-panel")).toHaveAttribute("data-nonce", "1");
    expect(mockPush).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});

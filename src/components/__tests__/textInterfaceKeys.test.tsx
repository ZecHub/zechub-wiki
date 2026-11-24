import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextInterfaceKeys, { TEXT_KEYS_KEY, jumpToHeading } from "@/components/TextInterfaceKeys";
import { applyInterface } from "@/lib/interfaces";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

function press(key: string, init: KeyboardEventInit = {}, target: Element = document.body) {
  fireEvent.keyDown(target, { key, bubbles: true, ...init });
}

describe("Text interface keys", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-interface");
    document.body.innerHTML = "";
    mockPush.mockClear();
    window.scrollTo = jest.fn() as unknown as typeof window.scrollTo;
  });

  it("renders nothing and ignores keys unless Text is active", () => {
    const search = jest.fn();
    window.addEventListener("zechub:open-search", search);
    render(<TextInterfaceKeys locale="en" />);
    expect(screen.queryByRole("button", { name: /Keys/ })).toBeNull();
    press("/");
    expect(search).not.toHaveBeenCalled();
    window.removeEventListener("zechub:open-search", search);
  });

  it("shows the key list from the button and from ?", async () => {
    render(<TextInterfaceKeys locale="en" />);
    act(() => applyInterface("text"));
    const button = await screen.findByRole("button", { name: /Keys/ });
    await user.click(button);
    expect(screen.getByRole("region", { name: "Keyboard shortcuts" })).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");
    press("Escape");
    expect(screen.queryByRole("region", { name: "Keyboard shortcuts" })).toBeNull();
    press("?");
    expect(screen.getByRole("region", { name: "Keyboard shortcuts" })).toBeInTheDocument();
  });

  it("opens search with /, goes home with h and to the top with t", async () => {
    const search = jest.fn();
    window.addEventListener("zechub:open-search", search);
    render(<TextInterfaceKeys locale="fr" />);
    act(() => applyInterface("text"));
    await screen.findByRole("button", { name: /Keys/ });
    press("/");
    expect(search).toHaveBeenCalledTimes(1);
    press("h");
    expect(mockPush).toHaveBeenCalledWith("/fr");
    press("t");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
    window.removeEventListener("zechub:open-search", search);
  });

  it("leaves keys alone while typing, with modifiers, or inside a dialog", async () => {
    const search = jest.fn();
    window.addEventListener("zechub:open-search", search);
    render(<TextInterfaceKeys locale="en" />);
    act(() => applyInterface("text"));
    await screen.findByRole("button", { name: /Keys/ });

    const input = document.createElement("input");
    document.body.appendChild(input);
    press("/", {}, input);
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    const inside = document.createElement("button");
    dialog.appendChild(inside);
    document.body.appendChild(dialog);
    press("/", {}, inside);
    press("/", { ctrlKey: true });
    press("h", { metaKey: true });

    expect(search).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
    window.removeEventListener("zechub:open-search", search);
  });

  it("turns the single-key shortcuts off and remembers it", async () => {
    const search = jest.fn();
    window.addEventListener("zechub:open-search", search);
    const { unmount } = render(<TextInterfaceKeys locale="en" />);
    act(() => applyInterface("text"));
    await user.click(await screen.findByRole("button", { name: /Keys/ }));
    await user.click(screen.getByRole("button", { name: "Turn keys off" }));
    expect(localStorage.getItem(TEXT_KEYS_KEY)).toBe("off");
    press("/");
    expect(search).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /Keys \(off\)/ })).toBeInTheDocument();
    unmount();

    render(<TextInterfaceKeys locale="en" />);
    await screen.findByRole("button", { name: /Keys \(off\)/ });
    press("/");
    expect(search).not.toHaveBeenCalled();
    window.removeEventListener("zechub:open-search", search);
  });

  it("jumps to the next and previous heading below the header", () => {
    document.body.innerHTML = `<header></header><main><h1 id="a">A</h1><h2 id="b">B</h2><h2 id="c">C</h2></main>`;
    const tops: Record<string, number> = { a: -300, b: 40, c: 500 };
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("h1, h2"))) {
      el.getBoundingClientRect = () => ({ top: tops[el.id] }) as DOMRect;
      el.getClientRects = () => [{}] as unknown as DOMRectList;
    }
    const header = document.querySelector("header") as HTMLElement;
    header.getBoundingClientRect = () => ({ height: 72 }) as DOMRect;
    Object.defineProperty(window, "scrollY", { value: 1000, configurable: true });

    jumpToHeading(1);
    // header 72 + 8 = 80 line; next heading below it is c at 500.
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1000 + 500 - 80 });
    expect(document.activeElement?.id).toBe("c");

    jumpToHeading(-1);
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1000 + 40 - 80 });
    expect(document.activeElement?.id).toBe("b");
  });
});

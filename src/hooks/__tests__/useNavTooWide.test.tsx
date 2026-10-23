import { useRef } from "react";
import { act, render, screen } from "@testing-library/react";
import { useNavTooWide } from "../useNavTooWide";

// jsdom has no layout: widths are set by hand and the ResizeObserver callback
// is fired by the test.
let resize: () => void = () => {};
class FakeResizeObserver {
  constructor(cb: () => void) { resize = cb; }
  observe() {}
  disconnect() {}
}

function setWidth(el: Element, prop: "clientWidth" | "scrollWidth" | "offsetWidth", value: number) {
  Object.defineProperty(el, prop, { value, configurable: true });
}

function Header({ labels }: { labels: string }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const tooWide = useNavTooWide(rowRef, navRef, labels);
  return (
    <>
      <div ref={rowRef} data-testid="row">
        <a data-testid="logo">logo</a>
        <nav ref={navRef} data-testid="nav"><div data-testid="inner">{labels}</div></nav>
        <div data-testid="right">buttons</div>
      </div>
      <output>{tooWide ? "menu-button" : "bar"}</output>
    </>
  );
}

// Layout of a 1280px header: 100px logo, 320px of buttons, 64px nav margins.
function layout(needed: number, row = 1248) {
  const available = Math.min(1024, row - 100 - 320 - 64);
  setWidth(screen.getByTestId("row"), "clientWidth", row);
  setWidth(screen.getByTestId("logo"), "offsetWidth", 100);
  setWidth(screen.getByTestId("right"), "offsetWidth", 320);
  setWidth(screen.getByTestId("nav"), "clientWidth", available);
  setWidth(screen.getByTestId("inner"), "scrollWidth", Math.max(needed, available));
}

describe("useNavTooWide", () => {
  beforeEach(() => {
    (global as unknown as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
    window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
  });

  it("keeps the bar when the labels fit", () => {
    render(<Header labels="short" />);
    layout(700);
    act(() => resize());
    expect(screen.getByRole("status")).toHaveTextContent("bar");
  });

  it("switches to the menu button when the labels overflow, and back when there is room again", () => {
    render(<Header labels="long" />);
    layout(950);
    act(() => resize());
    expect(screen.getByRole("status")).toHaveTextContent("menu-button");

    layout(950, 1300); // available 816: still too narrow
    act(() => resize());
    expect(screen.getByRole("status")).toHaveTextContent("menu-button");

    layout(950, 1440); // available 956: fits, but within the 16px margin
    act(() => resize());
    expect(screen.getByRole("status")).toHaveTextContent("menu-button");

    layout(950, 1500); // available 1016: fits
    act(() => resize());
    expect(screen.getByRole("status")).toHaveTextContent("bar");
  });

  it("measures again when the labels change", () => {
    const { rerender } = render(<Header labels="long" />);
    layout(950);
    act(() => resize());
    expect(screen.getByRole("status")).toHaveTextContent("menu-button");

    // Shorter labels in the new language: the bar is shown again and re-measured.
    layout(700);
    rerender(<Header labels="short" />);
    expect(screen.getByRole("status")).toHaveTextContent("bar");
  });

  it("does nothing below the desktop breakpoint", () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
    render(<Header labels="long" />);
    layout(950);
    act(() => resize());
    expect(screen.getByRole("status")).toHaveTextContent("bar");
  });
});

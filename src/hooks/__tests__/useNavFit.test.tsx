import { useRef } from "react";
import { act, render, screen } from "@testing-library/react";
import { navMaxBarLevel, useNavFit } from "../useNavFit";

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

const MAX = navMaxBarLevel(4); // 5: full, compact, icon buttons, 3 menus moved
// Content width of the bar at each level, for a long language.
const WIDTHS = [1100, 1040, 960, 860, 760, 660];
let lastLevel = 0;

function Header({ labels, widths = WIDTHS }: { labels: string; widths?: number[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const level = useNavFit(rowRef, navRef, labels, MAX);
  lastLevel = level;
  return (
    <>
      <div ref={rowRef} data-testid="row">
        <a data-testid="logo">logo</a>
        <nav ref={navRef} data-testid="nav">
          <div data-testid="inner" data-content={level <= MAX ? widths[level] : 0}>{labels}</div>
        </nav>
        <div data-testid="right">buttons{level > MAX && <button data-nav-menu-button="" data-testid="menu">☰</button>}</div>
      </div>
      <output>{level}</output>
    </>
  );
}

// The nav gets the row minus logo, buttons and margins (no max width).
// Before layout() runs the elements have no size, as before the first paint.
let navWidth = 0;
let laidOut = false;
function layout(row: number) {
  laidOut = true;
  navWidth = row - 100 - 320 - 32;
  setWidth(screen.getByTestId("row"), "clientWidth", row);
  setWidth(screen.getByTestId("logo"), "offsetWidth", 100);
  setWidth(screen.getByTestId("right"), "offsetWidth", 320);
  setWidth(screen.getByTestId("nav"), "clientWidth", navWidth);
}

// scrollWidth follows the content of the level being rendered.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get(this: HTMLElement) {
      const c = this.dataset.content;
      return c === undefined || !laidOut ? 0 : Math.max(Number(c), navWidth);
    },
  });
});

beforeEach(() => {
  laidOut = false;
  navWidth = 0;
  (global as unknown as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
  window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
});

const level = () => Number(screen.getByRole("status").textContent);

describe("useNavFit", () => {
  it("keeps the full bar when the labels fit", () => {
    render(<Header labels="short" widths={[700, 650, 600, 500, 400, 300]} />);
    layout(1400);
    act(() => resize());
    expect(level()).toBe(0);
  });

  it("gives up room one step at a time and stops at the first level that fits", () => {
    render(<Header labels="long" />);
    layout(1440); // nav 988: 1100 and 1040 overflow, 960 fits
    act(() => resize());
    expect(level()).toBe(2);

    layout(1300); // nav 848: 860 overflows, 760 fits
    act(() => resize());
    expect(level()).toBe(4);
  });

  it("goes back a level only when that level fits with the margin", () => {
    render(<Header labels="long" />);
    layout(1300);
    act(() => resize());
    expect(level()).toBe(4);

    layout(1320); // nav 868: level 3 needs 860 + 16
    act(() => resize());
    expect(level()).toBe(4);

    layout(1330); // nav 878 >= 876
    act(() => resize());
    expect(level()).toBe(3);

    layout(1600); // nav 1148: room for the full bar
    act(() => resize());
    expect(level()).toBe(0);
  });

  it("falls back to the menu button only when even the smallest bar does not fit", () => {
    render(<Header labels="long" widths={[1100, 1040, 960, 860, 760, 700]} />);
    layout(1100); // nav 648 < 700
    act(() => resize());
    expect(level()).toBe(MAX + 1);

    // The menu button (56px + gap) is room the bar gets back:
    // 1180 - 100 - 376 + 68 - 32 = 740 >= 700 + 16.
    layout(1180);
    setWidth(screen.getByTestId("right"), "offsetWidth", 376);
    setWidth(screen.getByTestId("menu"), "offsetWidth", 56);
    act(() => resize());
    expect(level()).toBe(MAX);
  });

  it("measures again from the full bar when the labels change", () => {
    const { rerender } = render(<Header labels="long" />);
    layout(1300);
    act(() => resize());
    expect(level()).toBe(4);

    rerender(<Header labels="short" widths={[700, 650, 600, 500, 400, 300]} />);
    act(() => resize());
    expect(level()).toBe(0);
  });

  it("does nothing below the desktop breakpoint", () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
    render(<Header labels="long" />);
    layout(1100);
    act(() => resize());
    expect(level()).toBe(0);
    expect(lastLevel).toBe(0);
  });
});

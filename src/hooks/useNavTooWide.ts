"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";

// The desktop menu bar needs more room in some languages ("Fa Zcash di dwuma",
// "Панель управления"). When its labels do not fit on one line next to the
// logo and the header buttons, the header falls back to the menu button, as
// on narrower screens, instead of wrapping or overlapping. The measurement is
// redone on every resize and whenever the labels change (language switch).
const NAV_MAX_WIDTH = 1024; // max-w-5xl
const NAV_MARGINS = 64; // mx-8
// Extra room required before showing the bar again, so a width right at the
// limit cannot flip the header back and forth.
const HYSTERESIS = 16;
export function useNavTooWide(
  rowRef: RefObject<HTMLDivElement | null>,
  navRef: RefObject<HTMLElement | null>,
  labels: unknown,
) {
  const [tooWide, setTooWide] = useState(false);
  const neededRef = useRef(0);
  const tooWideRef = useRef(false);
  tooWideRef.current = tooWide;

  // New labels: show the bar again so they get measured.
  useLayoutEffect(() => {
    neededRef.current = 0;
    setTooWide(false);
  }, [labels]);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const nav = navRef.current;
    if (!row || !nav) return;
    const check = () => {
      if (!window.matchMedia("(min-width: 1280px)").matches) return;
      if (!tooWideRef.current) {
        const inner = nav.firstElementChild as HTMLElement | null;
        if (!inner) return;
        neededRef.current = inner.scrollWidth;
        if (inner.scrollWidth > nav.clientWidth + 1) setTooWide(true);
        return;
      }
      // Row layout: logo, nav, header buttons.
      const logo = row.firstElementChild as HTMLElement | null;
      const right = row.lastElementChild as HTMLElement | null;
      const available = Math.min(
        NAV_MAX_WIDTH,
        row.clientWidth - (logo?.offsetWidth ?? 0) - (right?.offsetWidth ?? 0) - NAV_MARGINS,
      );
      if (neededRef.current && available >= neededRef.current + HYSTERESIS) setTooWide(false);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(row);
    if (nav.firstElementChild) observer.observe(nav.firstElementChild);
    document.fonts?.ready.then(check).catch(() => {});
    return () => observer.disconnect();
  }, [rowRef, navRef, labels, tooWide]);

  return tooWide;
}

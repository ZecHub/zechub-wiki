"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";

// The desktop menu bar needs more room in some languages ("Fa Zcash di dwuma",
// "Использовать Zcash"). Instead of dropping the whole bar as soon as it does
// not fit, it gives up room one step at a time ("priority+" navigation):
//
//   level 0  full bar
//   level 1  compact spacing
//   level 2  the Bounties / Dashboard buttons show only their icon
//   level 3+ the last primary menus move into the "More" row, one per level
//   above maxBarLevel: the bar no longer fits at all and the header falls
//            back to the menu button, as on narrower screens
//
// The level is raised while the bar's content is wider than the nav, and
// lowered again when the width the previous level needed (measured when it
// overflowed) fits with a margin. Measured again on every resize and whenever
// the labels change (language switch).
// Extra room required before going back a level, so a width right at the
// limit cannot flip the bar back and forth.
export const HYSTERESIS = 16;
// The bar (and this hook) works from 480px. Narrower than that, or when even
// the smallest bar does not fit, the header uses the menu button.
export const DESKTOP_NAV_QUERY = "(min-width: 480px)";

export function navMaxBarLevel(primaryCount: number) {
  // The first primary menu always stays in the bar.
  return 2 + Math.max(0, primaryCount - 1);
}

export function useNavFit(
  rowRef: RefObject<HTMLDivElement | null>,
  navRef: RefObject<HTMLElement | null>,
  labels: unknown,
  maxBarLevel: number,
  // Called when the bar is showing and fits at the current level.
  onBarFits?: () => void,
) {
  const onBarFitsRef = useRef(onBarFits);
  onBarFitsRef.current = onBarFits;
  const [level, setLevel] = useState(0);
  // needed[l] = content width of level l, recorded when it overflowed.
  const neededRef = useRef<number[]>([]);
  const labelsRef = useRef(labels);
  // Row width at which even the smallest bar overflowed. The room estimate in
  // the fallback is approximate, so the bar comes back only once the row is
  // wider than that (otherwise it could flip between bar and button forever).
  const fallbackRowRef = useRef(0);

  useLayoutEffect(() => {
    // New labels: start again from the full bar so every level is re-measured.
    if (labelsRef.current !== labels) {
      labelsRef.current = labels;
      neededRef.current = [];
      fallbackRowRef.current = 0;
      if (level !== 0) {
        setLevel(0);
        return;
      }
    }
    const row = rowRef.current;
    const nav = navRef.current;
    if (!row || !nav) return;
    let cancelled = false;
    const check = () => {
      // A callback from an older run (fonts loading) must not measure the DOM
      // of a different level.
      if (cancelled) return;
      if (!window.matchMedia(DESKTOP_NAV_QUERY).matches) return;
      const needed = neededRef.current;
      let available: number;
      if (level <= maxBarLevel) {
        const inner = nav.firstElementChild as HTMLElement | null;
        if (!inner) return;
        available = nav.clientWidth;
        if (inner.scrollWidth > available + 1) {
          needed[level] = inner.scrollWidth;
          if (level === maxBarLevel) fallbackRowRef.current = row.clientWidth;
          setLevel(level + 1);
          return;
        }
      } else {
        // Menu-button fallback: the nav is hidden, so work out the room it
        // would get from the row (logo, nav, header buttons).
        const logo = row.firstElementChild as HTMLElement | null;
        const right = row.lastElementChild as HTMLElement | null;
        // The menu button disappears with the bar, so its width (and its gap)
        // is room the bar gets back.
        const menuButton = right?.querySelector<HTMLElement>("[data-nav-menu-button]");
        // Margins and gaps are read from the page (they are rem-based, so
        // they grow with the browser's font size).
        const navStyle = getComputedStyle(nav);
        const margins = (parseFloat(navStyle.marginLeft) || 0) + (parseFloat(navStyle.marginRight) || 0);
        // The button plus the gap before it: the distance from the previous
        // header button's edge to its own (either direction, for RTL).
        let menuButtonRoom = menuButton?.offsetWidth ?? 0;
        // The nearest header button that is actually laid out (the Donate
        // button is hidden on narrower windows and has no box).
        let prev = menuButton?.previousElementSibling ?? null;
        while (prev && prev.getClientRects().length === 0) prev = prev.previousElementSibling;
        if (menuButton && prev && menuButtonRoom) {
          const b = menuButton.getBoundingClientRect();
          const p = prev.getBoundingClientRect();
          menuButtonRoom = Math.max(menuButtonRoom, b.right - p.right, p.left - b.left);
        }
        available =
          row.clientWidth - (logo?.offsetWidth ?? 0) - (right?.offsetWidth ?? 0) + menuButtonRoom - margins;
      }
      if (level > maxBarLevel && row.clientWidth < fallbackRowRef.current + HYSTERESIS) return;
      let target = level;
      while (target > 0 && needed[target - 1] !== undefined && needed[target - 1] + HYSTERESIS <= available) {
        target--;
        // From the menu button, come back to the smallest bar only: the next
        // check measures the real bar before giving any more room back.
        if (level > maxBarLevel) break;
      }
      if (target !== level) setLevel(target);
      else if (level <= maxBarLevel) onBarFitsRef.current?.();
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(row);
    if (nav.firstElementChild) observer.observe(nav.firstElementChild);
    document.fonts?.ready.then(check).catch(() => {});
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [rowRef, navRef, labels, level, maxBarLevel]);

  return level;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DATA_ATTRIBUTE } from "@/lib/interfaces";

/** Saved "off" when the visitor turns the single-key shortcuts off (WCAG 2.1.4). */
export const TEXT_KEYS_KEY = "zechub-text-keys";

const SHORTCUTS: ReadonlyArray<[string, string]> = [
  ["j", "Next heading"],
  ["k", "Previous heading"],
  ["/", "Search"],
  ["t", "Back to top"],
  ["h", "Home"],
  ["?", "Show or hide these keys"],
];

function keysOff(): boolean {
  try {
    return localStorage.getItem(TEXT_KEYS_KEY) === "off";
  } catch {
    return false;
  }
}

/** True while the visitor is typing or working inside a dialog such as search. */
function isBusy(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return true;
  return Boolean(target.closest('[role="dialog"]'));
}

function headerOffset(): number {
  const header = document.querySelector("header");
  return (header?.getBoundingClientRect().height ?? 0) + 8;
}

/** Scrolls to the next (1) or previous (-1) visible heading of the page. */
export function jumpToHeading(direction: 1 | -1): void {
  const scope = document.querySelector("main") ?? document.body;
  const headings = Array.from(scope.querySelectorAll<HTMLElement>("h1, h2, h3")).filter(
    (h) => h.getClientRects().length > 0,
  );
  const line = headerOffset();
  const target =
    direction === 1
      ? headings.find((h) => h.getBoundingClientRect().top > line + 2)
      : [...headings].reverse().find((h) => h.getBoundingClientRect().top < line - 2);
  if (!target) {
    if (direction === -1) window.scrollTo({ top: 0 });
    return;
  }
  window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - line });
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/**
 * Keyboard shortcuts and a small key list for the Text interface. Renders
 * nothing and listens to nothing unless data-interface="text" is set.
 */
export default function TextInterfaceKeys({ locale }: { locale: string }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setActive(root.getAttribute(DATA_ATTRIBUTE) === "text");
    sync();
    setEnabled(!keysOff());
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: [DATA_ATTRIBUTE] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) setOpen(false);
  }, [active]);

  const toggleEnabled = useCallback(() => {
    setEnabled((was) => {
      const next = !was;
      try {
        if (next) localStorage.removeItem(TEXT_KEYS_KEY);
        else localStorage.setItem(TEXT_KEYS_KEY, "off");
      } catch {
        /* storage unavailable: the choice lasts for this page only */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }
      if (!enabled || e.defaultPrevented || e.repeat) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isBusy(e.target)) return;
      switch (e.key) {
        case "j":
          e.preventDefault();
          jumpToHeading(1);
          break;
        case "k":
          e.preventDefault();
          jumpToHeading(-1);
          break;
        case "/":
          e.preventDefault();
          window.dispatchEvent(new Event("zechub:open-search"));
          break;
        case "t":
          e.preventDefault();
          window.scrollTo({ top: 0 });
          break;
        case "h":
          e.preventDefault();
          router.push(locale === "en" ? "/" : `/${locale}`);
          break;
        case "?":
          e.preventDefault();
          setOpen((was) => !was);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, enabled, open, locale, router]);

  if (!active) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[150] hidden text-sm md:block">
      {open && (
        <section
          id="text-interface-keys"
          aria-label="Keyboard shortcuts"
          className="mb-2 w-64 border border-current bg-page p-3 dark:bg-surface"
        >
          <p className="mb-2 font-bold">Keyboard</p>
          <dl className="grid grid-cols-[2.5ch_1fr] gap-x-3 gap-y-1">
            {SHORTCUTS.map(([key, label]) => (
              <div key={key} className="contents">
                <dt>
                  <kbd>{key}</kbd>
                </dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 opacity-75">Esc closes this list.</p>
          <button
            type="button"
            onClick={toggleEnabled}
            aria-pressed={!enabled}
            className="mt-3 underline"
          >
            {enabled ? "Turn keys off" : "Turn keys on"}
          </button>
        </section>
      )}
      <button
        type="button"
        onClick={() => setOpen((was) => !was)}
        aria-expanded={open}
        aria-controls="text-interface-keys"
        className="border border-current bg-page px-2 py-1 dark:bg-surface"
      >
        [?] Keys{enabled ? "" : " (off)"}
      </button>
    </div>
  );
}

/**
 * Site-wide "skip to content" link (WCAG 2.4.1 Bypass Blocks).
 *
 * Rendered as the first child of <body> in the locale layout so it is the first
 * focusable element on every page, ahead of the header, menus and search. It is
 * hidden until focused, then pinned to the top of the viewport above the sticky
 * header, and moves focus to the shared content wrapper when activated.
 *
 * Two styling constraints shape the classes below:
 *   - globals.css resets `outline` to none with !important on every element, so
 *     the focused state has to be carried by background, border and ring
 *     (box-shadow) rather than an outline.
 *   - the header is `sticky top-0 z-200` and the mobile drawer is z-201, so the
 *     focused link sits above both.
 *
 * No client JavaScript: the target carries tabIndex={-1}, which is what lets a
 * plain in-page anchor move focus and not just scroll.
 */

/** id of the element the skip link targets. Imported by the content wrapper so
 * the link and its target cannot drift apart. */
export const MAIN_CONTENT_ID = "main-content";

export const SKIP_TO_CONTENT_FALLBACK = "Skip to content";

export default function SkipToContent({ label }: { label?: string }) {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      data-testid="skip-to-content"
      className={[
        // Hidden during normal browsing, but present for keyboard users.
        "sr-only",
        // Revealed on focus, above the sticky header and the mobile drawer.
        "focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[300]",
        "focus:inline-flex focus:items-center focus:h-auto focus:w-auto",
        "focus:px-4 focus:py-2 focus:m-0 focus:overflow-visible focus:whitespace-nowrap",
        "focus:rounded-md focus:text-sm focus:font-medium focus:no-underline",
        "focus:bg-white focus:text-slate-900",
        "dark:focus:bg-slate-900 dark:focus:text-white",
        "focus:border focus:border-slate-300 dark:focus:border-slate-600",
        "focus:shadow-lg focus:ring-2 focus:ring-[#F4B728]",
      ].join(" ")}
    >
      {label?.trim() || SKIP_TO_CONTENT_FALLBACK}
    </a>
  );
}

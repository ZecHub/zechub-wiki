import { ArrowUpRight } from "lucide-react";

const BUTTON =
  "mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:text-brand-soft dark:hover:text-white dark:focus-visible:ring-offset-slate-900";

// An exchange entry from the markdown (**[Name](url)** + description) shown as
// a card: name, description and one fixed-size "Visit website" button, so every
// entry looks the same regardless of the name's length.
// Produced by rehypeWikiPatterns on the "Using Zcash" pages.
export default function ExchangeLinkCard(props: Record<string, unknown>) {
  const name = String(props.exname ?? "");
  const url = String(props.exurl ?? "#");
  const text = String(props.extext ?? "");
  return (
    <div className="my-4 max-w-3xl rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <p className="m-0 text-lg font-semibold leading-tight text-slate-900 dark:text-white">{name}</p>
      <p className="mb-0 mt-2 px-0.5 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">{text}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${name} (opens in a new tab)`}
        className={BUTTON}
      >
        Visit website
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </a>
    </div>
  );
}

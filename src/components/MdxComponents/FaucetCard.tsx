import { ArrowUpRight } from "lucide-react";

// One faucet entry: network label + name + outlined "Visit website" button.
export default function FaucetCard(props: Record<string, unknown>) {
  const network = String(props.network ?? "");
  const name = String(props.name ?? "");
  const href = String(props.href ?? "");
  const isMainnet = /^main/i.test(network);
  return (
    <div className="not-prose my-3 flex max-w-3xl flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex min-w-0 flex-col items-start gap-1.5">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isMainnet
              ? "bg-brand/15 text-brand dark:text-brand-soft"
              : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
          }`}
        >
          {network}
        </span>
        <span className="truncate text-lg font-semibold text-slate-900 dark:text-white">{name}</span>
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white"
        >
          Visit website
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

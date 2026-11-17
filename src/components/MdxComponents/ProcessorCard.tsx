import { ArrowUpRight } from "lucide-react";

const BADGE: Record<string, string> = {
  shielded: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30 dark:text-emerald-300",
  transparent: "bg-rose-500/10 text-rose-700 ring-rose-500/30 dark:text-rose-300",
  unclear: "bg-amber-500/10 text-amber-700 ring-amber-500/30 dark:text-amber-300",
};

// Square logo tile: every provider gets the same frame. The mark is centred and never stretched;
// when only a wordmark exists the tile shows the provider's initial instead.
export function ProcessorLogo(props: Record<string, unknown>) {
  const logo = String(props.logo ?? "");
  const initial = String(props.initial ?? "");
  // Inside a heading the tile sits on the text line; inside a card the card's flex row places it.
  const place = String(props.inline ?? "") === "true" ? "mr-3 align-middle" : "";
  return logo ? (
    <span aria-hidden="true" className={`${place} inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 ring-1 ring-slate-200 dark:ring-white/10`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt="" className="m-0 h-full w-full object-contain" />
    </span>
  ) : (
    <span aria-hidden="true" className={`${place} inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-lg font-semibold text-slate-700 ring-1 ring-slate-300/60 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10`}>
      {initial}
    </span>
  );
}

export function ProcessorGrid({ children }: { children?: React.ReactNode }) {
  return <div className="not-prose my-6 grid grid-cols-1 gap-4 lg:grid-cols-2">{children}</div>;
}

// One payment processor as a card: privacy status first, then the facts a merchant compares.
export function ProcessorCard(props: Record<string, unknown>) {
  let rows: [string, string][] = [];
  try {
    rows = JSON.parse(String(props.rows ?? "[]"));
  } catch {
    rows = [];
  }
  const status = String(props.status ?? "unclear");
  const name = String(props.name ?? "");
  const href = String(props.href ?? "");
  const anchor = String(props.anchor ?? "");
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <ProcessorLogo logo={props.logo} initial={props.initial} />
        <p className="m-0 min-w-0 flex-1 text-lg font-semibold leading-tight text-slate-900 dark:text-white">{name}</p>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${BADGE[status] ?? BADGE.unclear}`}>
          {String(props.statusLabel ?? "")}
        </span>
      </div>
      <dl className="mb-0 mt-4 flex flex-col divide-y divide-slate-200 text-sm dark:divide-white/10">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5 py-2 first:pt-0 imd:flex-row imd:gap-4">
            <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 imd:w-28 imd:pt-0.5">{label}</dt>
            <dd className="m-0 min-w-0 text-slate-800 dark:text-slate-200">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
        <a href={`#${anchor}`} className="text-sm font-semibold text-brand no-underline hover:underline dark:text-brand-soft">
          Read the details
        </a>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-slate-600 no-underline hover:text-brand dark:text-slate-300"
        >
          Visit site
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
      <p className="mb-0 mt-3 text-xs text-slate-500 dark:text-slate-400">Verified {String(props.verified ?? "")}</p>
    </article>
  );
}

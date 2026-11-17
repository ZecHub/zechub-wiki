// Numbered key points (e.g. "#1 Security: ...") shown as one bordered list with a number badge,
// a short title and the explanation. Used for comparison sections inside wiki guides.
export function PointList({ children }: { children?: React.ReactNode }) {
  return (
    <div className="not-prose my-6 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.03]">
      {children}
    </div>
  );
}

export function PointItem({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) {
  return (
    <div className="flex gap-4 p-4 sm:p-5">
      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand/50 bg-brand/10 text-sm font-semibold text-brand dark:text-brand-soft"
      >
        {String(props.n ?? "")}
      </span>
      <div className="min-w-0">
        <h4 className="m-0 text-base font-semibold text-slate-900 dark:text-white">{String(props.title ?? "")}</h4>
        <div className="mt-1 flex flex-col gap-3 text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300 [&_p]:m-0">{children}</div>
      </div>
    </div>
  );
}

// "Jump to" index for long pages. Items arrive as a JSON string: [{label, hint, href}].
export default function JumpNav(props: Record<string, unknown>) {
  let items: { label: string; hint?: string; href: string }[] = [];
  try {
    items = JSON.parse(String(props.items ?? "[]"));
  } catch {}
  return (
    <nav aria-label="On this page" className="not-prose my-8 border-y border-slate-200 py-4 dark:border-white/10">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {String(props.title || "On this page")}
      </p>
      <ul className="m-0 grid list-none gap-x-8 gap-y-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <li key={r.href} className="m-0 min-w-0 p-0">
            <a
              href={r.href}
              className="group flex min-w-0 flex-col gap-0.5 py-1 no-underline"
            >
              <span className="self-start text-sm font-semibold text-slate-900 underline decoration-slate-300 decoration-1 underline-offset-4 transition-colors group-hover:text-brand group-hover:decoration-brand dark:text-white dark:decoration-white/25 dark:group-hover:text-brand-soft">
                {r.label}
              </span>
              {r.hint && <span className="min-w-0 text-xs leading-snug text-slate-500 dark:text-slate-400">{r.hint}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import { ArrowDown } from "lucide-react";

// "Jump to" shortcuts for long pages. Items arrive as a JSON string: [{label, hint, href}].
export default function JumpNav(props: Record<string, unknown>) {
  let items: { label: string; hint?: string; href: string }[] = [];
  try {
    items = JSON.parse(String(props.items ?? "[]"));
  } catch {}
  return (
    <nav aria-label="On this page" className="not-prose my-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        Quick answers
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((r) => (
          <a
            key={r.href}
            href={r.href}
            className="flex items-center justify-between gap-3 rounded-xl border border-yellow-500/50 px-4 py-3 text-left no-underline transition-colors hover:border-yellow-500 hover:bg-yellow-400/10"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-yellow-700 dark:text-yellow-400">{r.label}</span>
              {r.hint && <span className="block text-xs text-slate-600 dark:text-slate-400">{r.hint}</span>}
            </span>
            <ArrowDown aria-hidden="true" className="h-4 w-4 shrink-0 text-yellow-700 dark:text-yellow-400" />
          </a>
        ))}
      </div>
    </nav>
  );
}

// "Quick answers" strip for the top of the FAQ: four short facts that each link to the full answer.
type Item = { label: string; text: string; href?: string };

export default function FaqGlance({ items }: { items?: string }) {
  let list: Item[] = [];
  try {
    const parsed = JSON.parse(items ?? "[]");
    if (Array.isArray(parsed)) list = parsed;
  } catch {
    list = [];
  }
  if (!list.length) return null;
  return (
    <ul className="not-prose my-5 grid list-none grid-cols-1 gap-3 p-0 imd:grid-cols-2">
      {list.map((it) => {
        const Tag = (it.href ? "a" : "div") as "a";
        return (
        <li key={it.href ?? it.label} className="m-0">
          <Tag
            href={it.href}
            className="block h-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 no-underline transition-colors hover:border-brand/60 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand-soft/60"
          >
            <span className="block font-mono text-xs font-semibold uppercase tracking-wide text-brand dark:text-brand-soft">{it.label}</span>
            <span className="mt-1 block text-[0.95rem] leading-snug text-slate-800 dark:text-slate-200">{it.text}</span>
          </Tag>
        </li>
        );
      })}
    </ul>
  );
}

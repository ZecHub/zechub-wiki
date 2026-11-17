// One question and its answer for FAQ pages, always visible (no clicking to read). The question is a real
// h3 with the same anchor id the markdown heading would get, so "On this page" and #links keep working.
const slug = (q: string) => q.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s/g, "-");

export default function FaqItem({ q = "", children }: { q?: string; children?: React.ReactNode }) {
  return (
    <section className="my-7 border-l-2 border-brand/50 pl-4 sm:pl-5">
      <h3 id={slug(q)} className="m-0 scroll-mt-24 font-mono text-[1.05rem] font-semibold leading-snug text-slate-900 dark:text-white">
        {q}
      </h3>
      <div className="mt-2 text-[0.95rem] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

// Landing page of the Glossary & FAQs section. It replaces the generic banner and the
// "Open Navigation" placeholder with an index: look something up, or browse the extras.
// Descriptions are taken from each page's own opening text.

type Entry = { href: string; title: string; text: string };

const LOOKUP: Entry[] = [
  {
    href: "/glossary-and-faqs/faq",
    title: "Frequently Asked Questions",
    text: "The most common questions about Zcash, with a quick index at the top of the page.",
  },
  {
    href: "/glossary-and-faqs/zcash-library",
    title: "Zcash Library",
    text: "The glossary: key terms, concepts and resources, for looking up words from release notes, forum threads or wallet changelogs.",
  },
];

const MORE: Entry[] = [
  {
    href: "/glossary-and-faqs/zechub-hackathon-builders-guide",
    title: "Hackathon builder's guide",
    text: "What to know before you open your editor: choosing a problem, keeping the scope small and shipping a demo.",
  },
  {
    href: "/glossary-and-faqs/gallery",
    title: "Wallpaper Gallery",
    text: "Zcash wallpapers and infographics.",
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

function Rows({ items }: { items: Entry[] }) {
  return (
    <ul className="m-0 list-none divide-y divide-slate-200 border-y border-slate-200 p-0 dark:divide-white/10 dark:border-white/10">
      {items.map((e) => (
        <li key={e.href} className="m-0 p-0">
          <Link
            href={e.href}
            className={`group -mx-3 flex items-start gap-4 rounded-lg px-3 py-5 no-underline transition-colors hover:bg-slate-100 dark:hover:bg-white/5 ${focusRing}`}
          >
            <div className="min-w-0 flex-1">
              <h2 className="m-0 text-lg font-semibold text-slate-900 dark:text-white">{e.title}</h2>
              <p className="m-0 mt-1 max-w-[60ch] text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">{e.text}</p>
            </div>
            <ArrowRight
              aria-hidden="true"
              className="mt-1.5 h-5 w-5 shrink-0 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-brand"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function GlossaryHub() {
  return (
    <div className="not-prose mx-auto w-full max-w-3xl px-4 py-10 md:px-0 md:py-14">
      <h1 className="m-0 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
        Glossary &amp; FAQs
      </h1>
      <p className="m-0 mt-3 max-w-[56ch] text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        Answers to common questions and a plain-language glossary of Zcash terms.
      </p>

      <section aria-labelledby="lookup" className="mt-10">
        <p id="lookup" className="m-0 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Look something up
        </p>
        <Rows items={LOOKUP} />
      </section>

      <section aria-labelledby="more" className="mt-12">
        <p id="more" className="m-0 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Also in this section
        </p>
        <Rows items={MORE} />
      </section>
    </div>
  );
}

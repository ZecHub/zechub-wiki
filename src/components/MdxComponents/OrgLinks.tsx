// Row of official links shown under the intro of an organization page: one pill per link with a small icon.
// Used from markdown as <OrgLinks items='[{"label":"Website","href":"https://example.org"}]' />.
import { ArrowUpRight, BookOpen, FileText, Globe, MessageSquare, Play, Users } from "lucide-react";
import type { ReactNode } from "react";

type Item = { label: string; href: string };

const GithubMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

const XMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
  </svg>
);

const YoutubeMark = () => <Play className="h-4 w-4" aria-hidden="true" />;

function iconFor(label: string, href: string): ReactNode {
  const l = label.toLowerCase();
  let host = "";
  try {
    host = new URL(href).hostname.replace(/^www\./, "");
  } catch {
    host = "";
  }
  if (host === "github.com" || l.includes("github")) return <GithubMark />;
  if (host === "x.com" || host === "twitter.com" || /\bx\b|twitter/.test(l)) return <XMark />;
  if (host.includes("youtube") || host === "youtu.be" || l.includes("youtube")) return <YoutubeMark />;
  if (host.startsWith("forum.") || l.includes("forum") || l.includes("announcement")) return <MessageSquare className="h-4 w-4" aria-hidden="true" />;
  if (l.includes("committee") || l.includes("team")) return <Users className="h-4 w-4" aria-hidden="true" />;
  if (l.includes("report") || l.includes("projects") || l.includes("grants") || l.includes("funded")) return <FileText className="h-4 w-4" aria-hidden="true" />;
  if (l.includes("about") || l.includes("docs") || l.includes("zebra") || l.includes("frost")) return <BookOpen className="h-4 w-4" aria-hidden="true" />;
  return <Globe className="h-4 w-4" aria-hidden="true" />;
}

export default function OrgLinks({ items }: { items?: string }) {
  let list: Item[] = [];
  try {
    const parsed = JSON.parse(items ?? "[]");
    if (Array.isArray(parsed)) list = parsed.filter((i) => i && typeof i.label === "string" && typeof i.href === "string");
  } catch {
    list = [];
  }
  if (!list.length) return null;
  return (
    <ul className="not-prose my-6 flex list-none flex-wrap gap-2 p-0">
      {list.map((it) => (
        <li key={it.href} className="m-0">
          <a
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/60 px-3.5 py-1.5 text-sm font-medium text-slate-700 no-underline transition-colors hover:border-brand/60 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-brand-soft/60 dark:hover:text-brand-soft"
          >
            <span className="text-slate-500 transition-colors group-hover:text-brand dark:text-slate-400 dark:group-hover:text-brand-soft">{iconFor(it.label, it.href)}</span>
            {it.label}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

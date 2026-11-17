import { Pencil } from "lucide-react";

// "Edit this page" link shown above the title. It replaces the blue shields.io "Edit" badge that the
// content repo puts at the top of every page, so the link matches the wiki and no image is requested
// from a third-party site. Only GitHub edit URLs are accepted.
export default function EditPageLink({ href }: { href: string }) {
  if (!/^https:\/\/github\.com\/[^/]+\/[^/]+\/(edit|blob)\//i.test(href)) return null;
  return (
    <p className="not-prose mb-4 mt-0">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-brand/40 px-2.5 py-1 text-xs font-medium text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:text-brand-soft dark:focus-visible:ring-offset-slate-900"
      >
        <Pencil className="h-3 w-3" aria-hidden="true" />
        Edit this page
        <span className="sr-only"> on GitHub (opens in a new tab)</span>
      </a>
    </p>
  );
}

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

// Standalone outlined button (internal link, or external when href starts with http).
export default function LinkButton(props: Record<string, unknown>) {
  const href = String(props.href ?? "");
  const label = String(props.label ?? "");
  // `emphasis="strong"` is for the one main call to action on a page: solid border and a tinted fill.
  const strong = String(props.emphasis ?? "") === "strong";
  const cls = strong
    ? "not-prose my-3 flex w-full items-center justify-center gap-2.5 imd:my-4 imd:mr-3 imd:inline-flex imd:w-auto rounded-lg border border-brand bg-brand/10 px-5 py-2.5 text-sm font-semibold text-brand no-underline transition-colors hover:bg-brand/20 dark:text-white dark:hover:bg-brand/30"
    : "not-prose my-3 flex w-full items-center justify-center gap-2.5 imd:my-4 imd:mr-3 imd:inline-flex imd:w-auto rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white";
  return /^https?:/.test(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {label}
      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </a>
  ) : (
    <Link href={href} className={cls}>
      {label}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}

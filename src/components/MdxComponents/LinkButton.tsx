import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

// Standalone outlined button (internal link, or external when href starts with http).
export default function LinkButton(props: Record<string, unknown>) {
  const href = String(props.href ?? "");
  const label = String(props.label ?? "");
  const cls =
    "not-prose my-4 mr-3 inline-flex items-center gap-2.5 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white";
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

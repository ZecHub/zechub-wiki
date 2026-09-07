import { Link } from "@/i18n/navigation";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /** Accessible name for the nav landmark. */
  label?: string;
};

/**
 * The trail above an article. Markup and classes match the one the research
 * layout already renders, so both variants look the same; the last item is the
 * current page and is not a link.
 */
export default function Breadcrumbs({
  items,
  label = "Breadcrumb",
}: BreadcrumbsProps) {
  if (items.length < 2) return null;

  return (
    <nav
      className="mb-6 text-xs font-medium text-muted-foreground"
      aria-label={label}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isCurrent = i === items.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden className="text-muted-foreground/80">
                  /
                </span>
              )}
              {isCurrent ? (
                <span aria-current="page" className="text-foreground/90">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

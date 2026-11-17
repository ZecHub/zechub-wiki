import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";

type ShopButtonProps = {
  shopUrl: string;
  hasBorder?: boolean;
};

// Same look as the call-to-action buttons on the home page: solid brand blue
// in light mode, a tinted blue that sits quietly on the navy theme in dark mode.
export const ShopButton = ({ shopUrl }: ShopButtonProps) => {
  return (
    <Link
      href={shopUrl}
      referrerPolicy="origin"
      target="_blank"
      className="inline-flex items-center gap-1.5 rounded-lg border border-brand bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-brand/40 dark:bg-brand/15 dark:text-brand-soft dark:hover:border-brand/70 dark:hover:bg-brand/25 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
    >
      Shop
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
};

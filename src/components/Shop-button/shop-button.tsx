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
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#1984c7] bg-[#1984c7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1574af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1984c7] focus-visible:ring-offset-2 dark:border-[#1984c7]/40 dark:bg-[#1984c7]/15 dark:text-[#9fd2f5] dark:hover:border-[#1984c7]/70 dark:hover:bg-[#1984c7]/25 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
    >
      Shop
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
};

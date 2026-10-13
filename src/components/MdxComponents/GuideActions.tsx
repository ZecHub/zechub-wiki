import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

// Quick actions shown under a guide's introduction: one primary step and two secondary ones.
const ACTIONS = [
  { label: "Buy ZEC", href: "/using-zcash/buying-zec", primary: true },
  { label: "Choose a wallet", href: "/wallets" },
  { label: "Join the forum", href: "https://forum.zcashcommunity.com/", external: true },
];

const base =
  "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";
const primary = `${base} btn-brand`;
const secondary = `${base} border border-brand/50 text-brand hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white`;

export default function GuideActions() {
  return (
    <div className="my-6 flex flex-wrap gap-3">
      {ACTIONS.map((a) =>
        a.external ? (
          <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" className={secondary}>
            {a.label}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        ) : (
          <Link key={a.label} href={a.href} className={a.primary ? primary : secondary}>
            {a.label}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        ),
      )}
    </div>
  );
}

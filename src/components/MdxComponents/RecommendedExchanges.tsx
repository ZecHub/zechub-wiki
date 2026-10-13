import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

// Swap services and DEXes recommended on the "Obtaining Zcash" page. Links come
// from the wiki's own exchange directory (/dex); the full list lives there.
const EXCHANGES = [
  {
    name: "NEAR Intents",
    url: "https://app.near-intents.org/",
    type: "DEX",
    description:
      "Fast cross-chain exchange supported by NEAR. Deposit and swap a wide range of assets, including ZEC.",
  },
  {
    name: "Bison Wallet",
    url: "https://dex.decred.org/",
    type: "DEX · Decred Project",
    description:
      "Decentralized exchange built by the Decred project. Trade peer to peer with no trading fees and no KYC.",
  },
  {
    name: "Firo DEX",
    url: "https://github.com/firoorg/FiroDEX-Desktop",
    type: "DEX · Desktop",
    description:
      "Trustless decentralized swaps using atomic swaps, built by the Firo project.",
  },
  {
    name: "Trocador",
    url: "https://trocador.app/",
    type: "Swap service",
    description:
      "Privacy-oriented exchange for trading cryptocurrency without registration. Prepaid debit cards are also available.",
  },
  {
    name: "StealthEX",
    url: "https://stealthex.io/",
    type: "Swap service",
    description:
      "Instant exchange that requires no registration and does not store users' funds on the platform.",
  },
  {
    name: "ChangeNOW",
    url: "https://changenow.io/?from=usdterc20&to=zec",
    type: "Swap service",
    description:
      "Simple and fast instant swaps, described by the service as custody-free.",
  },
] as const;

const BUTTON =
  "mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:text-brand-soft dark:hover:text-white dark:focus-visible:ring-offset-slate-900";

// Built from <span>s so it stays valid inside a paragraph (no hydration error).
// The square tile shows the initial until official logo files are added.
export default function RecommendedExchanges() {
  return (
    <span className="my-6 block max-w-3xl">
      <span className="grid gap-4 sm:grid-cols-2">
        {EXCHANGES.map((x) => (
          <span
            key={x.name}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <span className="block">
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-2xl font-semibold text-brand dark:text-brand-soft"
                >
                  {x.name[0]}
                </span>
                <span className="block min-w-0">
                  <span className="block text-lg font-semibold leading-tight text-slate-900 dark:text-white">
                    {x.name}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {x.type}
                  </span>
                </span>
              </span>
              <span className="mt-3 block px-0.5 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                {x.description}
              </span>
            </span>
            <a
              href={x.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${x.name} (opens in a new tab)`}
              className={BUTTON}
            >
              Visit website
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </span>
        ))}
      </span>
      <span className="mt-4 block text-sm text-slate-600 dark:text-slate-400">
        Looking for more options?{" "}
        <Link
          href="/dex"
          className="font-medium text-brand underline decoration-brand/40 underline-offset-[3px] hover:decoration-brand dark:text-brand-soft"
        >
          See all exchanges
        </Link>
        .
      </span>
    </span>
  );
}

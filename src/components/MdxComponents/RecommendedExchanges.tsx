import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

// Swap services and DEXes recommended on the "Obtaining Zcash" page. Links come
// from the wiki's own exchange directory (/dex); the full list lives there.
const EXCHANGES: readonly {
  name: string;
  url: string;
  logo: string;
  type: string;
  description: string;
  dark?: boolean;
}[] = [
  {
    name: "NEAR Intents",
    url: "https://app.near-intents.org/",
    logo: "/Logo/near.png",
    type: "DEX",
    description:
      "Fast cross-chain exchange supported by NEAR. Deposit and swap a wide range of assets, including ZEC.",
  },
  {
    name: "THORChain",
    url: "https://swap.thorchain.org/",
    logo: "/thorchain-logo.jpg",
    type: "DEX · Cross-chain",
    description:
      "Decentralized layer 1 exchange. Swap native assets such as ZEC, BTC and ETH without bridges, wrapped tokens or intermediaries.",
  },
  {
    name: "LeoDex",
    url: "https://leodex.io",
    logo: "/leodex-logo.png",
    type: "Swap aggregator",
    dark: true,
    description:
      "Cross-chain swaps into and out of ZEC, routed across THORChain, Maya Protocol, Chainflip, NEAR Intents and others. No account or KYC on supported routes.",
  },
  {
    name: "Bison Wallet",
    url: "https://dex.decred.org/",
    logo: "/bisonwallet-logo.png",
    type: "DEX · Decred Project",
    description:
      "Decentralized exchange built by the Decred project. Trade peer to peer with no trading fees and no KYC.",
  },
  {
    name: "StealthEX",
    url: "https://stealthex.io/",
    logo: "/stealth_ex.png",
    type: "Swap service",
    description:
      "Instant exchange that requires no registration and does not store users' funds on the platform.",
  },
  {
    name: "Changelly",
    url: "https://changelly.com/",
    logo: "/changelly.png",
    type: "Swap service",
    description:
      "Instant-execution crypto exchange covering a wide range of coins, advertising fees of up to 0.25%.",
  },
] as const;

const BUTTON =
  "mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:text-brand-soft dark:hover:text-white dark:focus-visible:ring-offset-slate-900";

// Built from <span>s so it stays valid inside a paragraph (no hydration error).
// Logos are the files already shipped in /public; wordmarks sit on a light chip.
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={x.logo}
                  alt={`${x.name} logo`}
                  width={96}
                  height={64}
                  loading="lazy"
                  className={`!my-0 h-16 w-24 shrink-0 rounded-xl border border-slate-200 object-contain p-2 dark:border-white/10 ${x.dark ? "bg-slate-900" : "bg-white"}`}
                />
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

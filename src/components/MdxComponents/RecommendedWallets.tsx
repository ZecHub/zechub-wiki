import { ArrowUpRight } from "lucide-react";

// Wallets recommended on the "Obtaining Zcash" page. Logos and links come from
// the wiki's own wallet directory (/wallets); descriptions are short summaries.
const WALLETS = [
  {
    name: "Zodl",
    url: "https://zodl.com/",
    logo: "/content-images/198608b2-9059-4cb7-aeb8-9354971376fd-d67c2d46f5.webp",
    platforms: "Mobile",
    team: "Zcash Open Development Lab",
    // Dark glyph on a transparent background: flip it in the dark theme.
    invertOnDark: true,
    description:
      "New name of Zashi, announced in February 2026. Built by the former Electric Coin Company team, which formed ZODL in January 2026.",
  },
  {
    name: "Vizor",
    url: "https://vizor.cash/",
    logo: "/content-images/Vizorphoto-6ade2417a5.webp",
    platforms: "Desktop · Mobile",
    team: "Keplr team",
    description:
      "Self-custodial wallet from the team behind the Keplr wallet, shielding funds by default. Supports multiple accounts and hardware wallets, including Keystone and Ledger.",
  },
  {
    name: "Zingo!",
    url: "https://www.zingolabs.org/",
    logo: "/content-images/zingocard-9a2546668d.webp",
    platforms: "Mobile · Desktop",
    team: "Zingo Labs",
    description:
      "Open-source wallet from Zingo Labs, the team behind the Zingolib SDK and the Zaino indexer. Runs on Android, iOS and desktop, with a command-line version for developers.",
  },
  {
    name: "Zkool",
    url: "https://github.com/hhanh00/zkool2/",
    logo: "/content-images/zkool-1-22ab388e65.webp",
    platforms: "Mobile · Desktop",
    team: "hhanh00",
    description:
      "Successor to YWallet. Adds multiple and hidden accounts, FROST multisig, Tor support and transparent address rotation. The interface is more basic than other wallets and it has no address book.",
  },
] as readonly {
  name: string;
  url: string;
  logo: string;
  platforms: string;
  team: string;
  description: string;
  invertOnDark?: boolean;
}[];

const BUTTON =
  "mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:text-brand-soft dark:hover:text-white dark:focus-visible:ring-offset-slate-900";

// Built from <span>s so it stays valid when the markdown renderer places it
// inside a paragraph (a <div> there would be a hydration error).
export default function RecommendedWallets() {
  return (
    <span className="my-6 grid max-w-3xl gap-4 sm:grid-cols-2">
      {WALLETS.map((w) => (
        <span
          key={w.name}
          className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03]"
        >
          <span className="block">
            <span className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.logo}
                alt={`${w.name} logo`}
                width={64}
                height={64}
                loading="lazy"
                className={`!my-0 h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover dark:border-white/10 ${w.invertOnDark ? "dark:invert" : ""}`}
              />
              <span className="block min-w-0">
                <span className="block text-lg font-semibold leading-tight text-slate-900 dark:text-white">
                  {w.name}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {w.platforms} · {w.team}
                </span>
              </span>
            </span>
            <span className="mt-3 block px-0.5 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              {w.description}
            </span>
          </span>
          <a
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${w.name} (opens in a new tab)`}
            className={BUTTON}
          >
            Visit website
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </span>
      ))}
    </span>
  );
}

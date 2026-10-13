import { ArrowUpRight } from "lucide-react";

// Wallets recommended on the "Obtaining Zcash" page. Logos and links come from
// the wiki's own wallet directory (/wallets); descriptions are short summaries.
const WALLETS = [
  {
    name: "Zodl",
    url: "https://zodl.com/",
    logo: "/content-images/198608b2-9059-4cb7-aeb8-9354971376fd-d67c2d46f5.webp",
    platforms: "Mobile",
    description:
      "Mobile wallet focused on simple, private ZEC payments, with shielded transactions and Ironwood support.",
  },
  {
    name: "Vizor",
    url: "https://vizor.cash/",
    logo: "/content-images/Vizorphoto-6ade2417a5.webp",
    platforms: "Desktop · Mobile",
    description:
      "Wallet for desktop and mobile that supports transparent and shielded (Sapling) addresses.",
  },
  {
    name: "Zingo!",
    url: "https://www.zingolabs.org/",
    logo: "/content-images/zingocard-9a2546668d.webp",
    platforms: "Mobile · Desktop",
    description:
      "Wallet from Zingo Labs for mobile and desktop, built around shielded transactions and Ironwood support.",
  },
  {
    name: "Zkool",
    url: "https://github.com/hhanh00/zkool2/",
    logo: "/content-images/zkool-1-22ab388e65.webp",
    platforms: "Mobile · Desktop",
    description:
      "Open-source wallet for mobile and desktop, with support for multiple accounts and shielded funds.",
  },
] as const;

const BUTTON =
  "mt-4 flex w-full items-center justify-between rounded-lg border border-brand bg-brand px-5 py-3 text-base font-semibold !text-on-brand no-underline transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-brand/40 dark:bg-brand/15 dark:!text-brand-soft dark:hover:border-brand/70 dark:hover:bg-brand/25 dark:hover:!text-white dark:focus-visible:ring-offset-slate-900";

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
                width={56}
                height={56}
                loading="lazy"
                className="!my-0 h-14 w-14 shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-1.5 dark:border-white/10"
              />
              <span className="block min-w-0">
                <span className="block text-lg font-semibold leading-tight text-slate-900 dark:text-white">
                  {w.name}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {w.platforms}
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
            <ArrowUpRight aria-hidden="true" className="h-[18px] w-[18px]" />
          </a>
        </span>
      ))}
    </span>
  );
}

"use client";
import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { useLanguage } from "@/context/LanguageContext";

type HomeProps = {
  text: string;
};

type Item = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

// Brand blue kept from the current design (#1984c7 / hover #1574af).
const BRAND = "#1984c7";

// The three main intents. Everything else on the home hangs off these.
const paths: Item[] = [
  {
    title: "Learn",
    description: "What Zcash is, how its privacy works, and where to start.",
    href: "/start-here",
  },
  {
    title: "Use",
    description: "Buy ZEC, pick a wallet and make private payments.",
    href: "/using-zcash/buying-zec",
  },
  {
    title: "Build",
    description: "Run a node, explore the tools and contribute.",
    href: "/developers",
  },
];

// The 12 topics of the wiki, one line each. Same destinations as the old
// "Explore Zcash" list, with Wallets promoted from the old card row.
const topics: Item[] = [
  {
    title: "Start Here",
    description: "New user guide and basics",
    href: "/start-here/new-user-guide",
  },
  {
    title: "Wallets",
    description: "Receive and spend ZEC privately",
    href: "/wallets",
  },
  {
    title: "Using Zcash",
    description: "Buying, transactions, memos, payments",
    href: "/using-zcash/buying-zec",
  },
  {
    title: "Tutorials",
    description: "Step-by-step video tutorials",
    href: "/zechub-tutorial",
  },
  {
    title: "Guides",
    description: "Nodes, tools, DeFi and more",
    href: "/guides/raspberry-pi-4-full-node",
  },
  {
    title: "Zcash Tech",
    description: "zk-SNARKs and the protocol",
    href: "/zcash-tech/zk-snarks",
  },
  {
    title: "Privacy Tools",
    description: "Hardware 2FA, VPNs and more",
    href: "/privacy-tools/2fa-hardware-devices",
  },
  {
    title: "Research",
    description: "Papers and technical reading",
    href: "/research",
  },
  {
    title: "Organizations",
    description: "ECC, Zcash Foundation, ZCG and others",
    href: "/zcash-organizations/electric-coin-company",
  },
  {
    title: "Community",
    description: "Links, blogs, projects, ambassadors",
    href: "/zcash-community/community-links",
  },
  {
    title: "Glossary & FAQs",
    description: "Quick answers and definitions",
    href: "/glossary-and-faqs/faq",
  },
  {
    title: "Contribute",
    description: "Help build ZecHub",
    href: "/contribute/help-build-zechub",
  },
];

// Secondary destinations that used to be big image blocks on the home.
const featured: Item[] = [
  {
    title: "ZecHub Visualizer",
    description: "Interactive tools for Zcash privacy tech",
    href: "/visualizer",
  },
  {
    title: "ZecMap",
    description: "Merchants and ATMs that accept Zcash",
    href: "https://zecmap.com",
    external: true,
  },
  {
    title: "Pay with Zcash",
    description: "Where can I pay with ZEC?",
    href: "https://paywithz.cash",
    external: true,
  },
  {
    title: "Global Ambassadors",
    description: "Community leaders around the world",
    href: "/zcash-global-ambassadors",
  },
  {
    title: "ZKAV Club",
    description: "Zero-knowledge audio and video",
    href: "https://zkav.club",
    external: true,
  },
  {
    title: "Hackathon Archive",
    description: "Projects from the 2026 hackathon",
    href: "/hackathon",
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1984c7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950";

function SmartLink({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

const Home = ({ text }: HomeProps) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      {/* Hero: one idea, one action */}
      <section id="hero" className="py-16 sm:py-24">
        <p
          className="mb-4 text-sm font-medium uppercase tracking-widest"
          style={{ color: BRAND }}
        >
          ZecHub Wiki
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          {t.home?.heroTitle || "Welcome to ZecHub"}
        </h1>

        <p
          className={`mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          {text}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={`mt-2 rounded text-sm font-medium hover:underline ${focusRing}`}
          style={{ color: BRAND }}
        >
          {expanded ? "Show less" : "Read more"}
        </button>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#topics"
            className={`rounded-lg bg-[#1984c7] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#1574af] ${focusRing}`}
          >
            {t.home?.exploreEcosystem || "Explore Zcash"}
          </a>
          <Link
            href="/wallets"
            className={`rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-[#1984c7] hover:text-[#1984c7] dark:border-slate-700 dark:text-slate-200 ${focusRing}`}
          >
            Pick a wallet
          </Link>
        </div>
      </section>

      {/* Three ways in */}
      <section id="paths" aria-label="Start with" className="pb-16 sm:pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {paths.map((item) => (
            <SmartLink
              key={item.title}
              href={item.href}
              external={item.external}
              className={`group rounded-xl border border-slate-200 p-6 transition-colors hover:border-[#1984c7] dark:border-slate-800 ${focusRing}`}
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                  style={{ color: BRAND }}
                >
                  →
                </span>
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
            </SmartLink>
          ))}
        </div>
      </section>

      {/* All topics, on one screen, with a quick filter */}
      <section id="topics" className="scroll-mt-24 pb-16 sm:pb-24">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Topics
          </h2>
          <div className="w-full sm:w-72">
            <label htmlFor="topic-filter" className="sr-only">
              Filter topics
            </label>
            <input
              id="topic-filter"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter topics"
              className={`w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:text-slate-100 ${focusRing}`}
            />
          </div>
        </div>

        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTopics.map((item) => (
              <SmartLink
                key={item.title}
                href={item.href}
                external={item.external}
                className={`rounded-lg border border-slate-200 px-5 py-4 transition-colors hover:border-[#1984c7] hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 ${focusRing}`}
              >
                <span className="block font-medium text-slate-900 dark:text-slate-100">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                  {item.description}
                </span>
              </SmartLink>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">
            No topics match &ldquo;{query}&rdquo;.
          </p>
        )}
      </section>

      {/* Community and tools: compact rows instead of large image blocks */}
      <section id="more" className="pb-24">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Community &amp; tools
        </h2>
        <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {featured.map((item) => (
            <li key={item.title}>
              <SmartLink
                href={item.href}
                external={item.external}
                className={`group flex items-center justify-between gap-4 py-4 ${focusRing}`}
              >
                <span>
                  <span className="block font-medium text-slate-900 group-hover:text-[#1984c7] dark:text-slate-100">
                    {item.title}
                  </span>
                  <span className="block text-sm text-slate-500 dark:text-slate-400">
                    {item.description}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#1984c7]"
                >
                  {item.external ? "↗" : "→"}
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Home;

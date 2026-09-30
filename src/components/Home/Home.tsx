"use client";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  Code,
  Coins,
  Compass,
  Cpu,
  CreditCard,
  Eye,
  FlaskConical,
  Globe,
  GraduationCap,
  HeartHandshake,
  Info,
  Map as MapIcon,
  Play,
  Search,
  Shield,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { socialNav } from "@/constants/navigation";

type HomeProps = {
  text: string;
};

type Item = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
  tag?: string;
};

type Path = {
  title: string;
  description: string;
  icon: LucideIcon;
  links: { label: string; href: string }[];
};

/* Brand blue kept from the current design: #1984c7 (hover #1574af). */

// Three ways in. Each one is a block with a few direct links.
const paths: Path[] = [
  {
    title: "Learn",
    description: "What Zcash is, how its privacy works, and where to start.",
    icon: GraduationCap,
    links: [
      { label: "What is Zcash?", href: "/start-here/what-is-zec-and-zcash" },
      { label: "Zcash technology", href: "/zcash-tech/zk-snarks" },
      { label: "Glossary & FAQs", href: "/glossary-and-faqs/faq" },
    ],
  },
  {
    title: "Use",
    description: "Get ZEC, pick a wallet and make private payments.",
    icon: Wallet,
    links: [
      { label: "Buying ZEC", href: "/using-zcash/buying-zec" },
      { label: "Pick a wallet", href: "/wallets" },
      { label: "Transactions", href: "/using-zcash/transactions" },
    ],
  },
  {
    title: "Build",
    description: "Run a node, explore the tools and contribute to the wiki.",
    icon: Code,
    links: [
      { label: "Developers", href: "/developers" },
      { label: "Run a node", href: "/guides/raspberry-pi-4-full-node" },
      { label: "Contribute", href: "/contribute/help-build-zechub" },
    ],
  },
];

// The 12 topics of the wiki (same destinations as the official site's list).
const topics: Item[] = [
  {
    title: "Start Here",
    description: "New user guide and the basics",
    href: "/start-here/new-user-guide",
    icon: Compass,
  },
  {
    title: "Wallets",
    description: "Receive and spend ZEC privately",
    href: "/wallets",
    icon: Wallet,
  },
  {
    title: "Using Zcash",
    description: "Buying, transactions, memos, payments",
    href: "/using-zcash/buying-zec",
    icon: Coins,
  },
  {
    title: "Tutorials",
    description: "Step-by-step video tutorials",
    href: "/zechub-tutorial",
    icon: Play,
  },
  {
    title: "Guides",
    description: "Nodes, tools, DeFi and more",
    href: "/guides/raspberry-pi-4-full-node",
    icon: BookOpen,
  },
  {
    title: "Zcash Tech",
    description: "zk-SNARKs and the protocol",
    href: "/zcash-tech/zk-snarks",
    icon: Cpu,
  },
  {
    title: "Privacy Tools",
    description: "Tools to help protect your privacy",
    href: "/privacy-tools/2fa-hardware-devices",
    icon: Shield,
  },
  {
    title: "Research",
    description: "Articles and research on Zcash",
    href: "/research",
    icon: FlaskConical,
  },
  {
    title: "Organizations",
    description: "ECC, Zcash Foundation, ZCG and others",
    href: "/zcash-organizations/electric-coin-company",
    icon: Building2,
  },
  {
    title: "Community",
    description: "Links, blogs, projects, ambassadors",
    href: "/zcash-community/community-links",
    icon: Users,
  },
  {
    title: "Glossary & FAQs",
    description: "Quick answers and definitions",
    href: "/glossary-and-faqs/faq",
    icon: Info,
  },
  {
    title: "Contribute",
    description: "Help build ZecHub",
    href: "/contribute/help-build-zechub",
    icon: HeartHandshake,
  },
];

// Tools and community projects that used to be large image blocks.
const featured: Item[] = [
  {
    title: "ZecHub Visualizer",
    description: "Interactive tools to understand Zcash privacy technology.",
    href: "/visualizer",
    icon: Eye,
    tag: "Tool",
  },
  {
    title: "ZecMap",
    description:
      "Community-maintained map of merchants and ATMs that accept Zcash.",
    href: "https://zecmap.com",
    icon: MapIcon,
    external: true,
    tag: "Map",
  },
  {
    title: "Pay with Zcash",
    description: "A free directory of where you can pay with ZEC.",
    href: "https://paywithz.cash",
    icon: CreditCard,
    external: true,
    tag: "Directory",
  },
  {
    title: "Global Ambassadors",
    description: "Community leaders promoting Zcash education worldwide.",
    href: "/zcash-global-ambassadors",
    icon: Globe,
    tag: "Community",
  },
  {
    title: "ZKAV Club",
    description: "An organization in the Zcash ecosystem.",
    href: "https://zkav.club",
    icon: Users,
    external: true,
    tag: "Community",
  },
  {
    title: "Hackathon Archive",
    description: "Projects submitted to the 2026 ZecHub Hackathon.",
    href: "/hackathon",
    icon: Trophy,
    tag: "Archive",
  },
];

const wrap = "mx-auto w-full max-w-6xl px-4 md:px-6";
const card =
  "rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/30";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1984c7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

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

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1984c7]/10 text-[#1984c7]">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

function SectionHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function LinkCard({ item }: { item: Item }) {
  const Arrow = item.external ? ArrowUpRight : ArrowRight;
  return (
    <SmartLink
      href={item.href}
      external={item.external}
      className={`group flex h-full flex-col gap-4 p-5 transition-colors hover:border-[#1984c7] ${card} ${focusRing}`}
    >
      <div className="flex items-start justify-between gap-3">
        <IconBadge icon={item.icon} />
        {item.tag ? (
          <span className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {item.tag}
          </span>
        ) : null}
      </div>
      <div>
        <h3 className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
          {item.title}
          <Arrow
            aria-hidden="true"
            className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-[#1984c7]"
          />
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {item.description}
        </p>
      </div>
    </SmartLink>
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
    <main className="flex flex-col">
      {/* Hero */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1984c7]/10 via-transparent to-transparent"
        />
        <div className={`${wrap} relative py-16 md:py-24`}>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-6xl">
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
            className={`mt-2 rounded text-sm font-medium text-[#1984c7] hover:underline ${focusRing}`}
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
        </div>
      </section>

      {/* Three ways in */}
      <section id="paths" className={`${wrap} py-16 md:py-20`}>
        <SectionHeader
          title="Start here"
          subtitle="Pick the path that matches what you want to do."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {paths.map((path) => (
            <div key={path.title} className={`flex flex-col p-6 ${card}`}>
              <IconBadge icon={path.icon} />
              <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-slate-100">
                {path.title}
              </h3>
              <p className="mb-6 mt-2 text-slate-600 dark:text-slate-400">
                {path.description}
              </p>
              <ul className="mt-auto space-y-1 border-t border-slate-200 pt-4 dark:border-slate-800">
                {path.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`group -mx-2 flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#1984c7] dark:text-slate-200 dark:hover:bg-slate-800/60 ${focusRing}`}
                    >
                      {link.label}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1984c7]"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* All topics */}
      <section
        id="topics"
        className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-950/30 md:py-20"
      >
        <div className={wrap}>
          <SectionHeader
            title="Explore topics"
            subtitle="Everything in the wiki, in one place."
          >
            <div className="relative w-full md:w-72">
              <label htmlFor="topic-filter" className="sr-only">
                Filter topics
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                id="topic-filter"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter topics"
                className={`w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${focusRing}`}
              />
            </div>
          </SectionHeader>

          {filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 imd:grid-cols-2 lg:grid-cols-3">
              {filteredTopics.map((item) => (
                <LinkCard key={item.title} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">
              No topics match &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      </section>

      {/* Tools and community projects */}
      <section id="more" className={`${wrap} py-16 md:py-20`}>
        <SectionHeader
          title="Tools & community"
          subtitle="Projects that help you use and understand Zcash."
        />
        <div className="grid grid-cols-1 gap-4 imd:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <LinkCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      {/* Community */}
      <section id="community" className={`${wrap} pb-16`}>
        <div
          className={`flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between ${card}`}
        >
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-2xl">
              Join the community
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Follow ZecHub and talk with other Zcash users.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {socialNav.map((social) => {
              const SocialIcon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#1984c7] hover:text-[#1984c7] dark:border-slate-700 dark:text-slate-200 ${focusRing}`}
                >
                  <SocialIcon className="h-4 w-4" aria-hidden="true" />
                  {social.name}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section id="contribute" className={`${wrap} pb-24`}>
        <div className="rounded-2xl bg-slate-900 p-8 text-white dark:border dark:border-slate-700 dark:bg-slate-800/60 md:p-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Help build ZecHub
          </h2>
          <p className="mt-3 max-w-xl text-slate-300">
            ZecHub is community-driven. Add content, pick up a bounty or
            support the project.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contribute/help-build-zechub"
              className={`rounded-lg bg-[#1984c7] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#1574af] ${focusRing}`}
            >
              Contribute
            </Link>
            <Link
              href="/donation"
              className={`rounded-lg border border-slate-500 px-6 py-3 font-semibold text-white transition-colors hover:border-white ${focusRing}`}
            >
              Donate
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

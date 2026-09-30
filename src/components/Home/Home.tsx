"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  Code,
  Coins,
  Cpu,
  CreditCard,
  Eye,
  FlaskConical,
  Globe,
  GraduationCap,
  Info,
  Landmark,
  Map as MapIcon,
  Play,
  Search,
  Shield,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useDarkModeContext } from "@/hooks/useDarkModeContext";
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

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  links: { label: string; href: string }[];
};

type Group = {
  title: string;
  subtitle: string;
  items: Item[];
};

/* Brand blue kept from the current design: #1984c7 (hover #1574af). */

/* ---------------------------------------------------------------------------
   Page structure. Every page of the wiki is listed ONCE on this home:
     1. FEATURED  - the essentials for someone new (top of the page).
     2. GROUPS    - everything else, grouped by what the reader wants to do.
   Keep it that way: if a destination is promoted to FEATURED, remove it from
   GROUPS so the two sections never repeat each other.
   --------------------------------------------------------------------------- */

// 1. Essentials for newcomers, in the order most people need them.
const featured: Feature[] = [
  {
    title: "Learn",
    description: "What Zcash is, how its privacy works, and where to start.",
    icon: GraduationCap,
    links: [
      { label: "New user guide", href: "/start-here/new-user-guide" },
      { label: "What is Zcash?", href: "/start-here/what-is-zec-and-zcash" },
      { label: "Network upgrades", href: "/start-here/network-upgrades" },
    ],
  },
  {
    title: "Pick a wallet",
    description: "A wallet lets you receive and spend ZEC privately.",
    icon: Wallet,
    links: [
      { label: "All wallets", href: "/wallets" },
      { label: "Mobile wallets", href: "/mobile-wallets" },
      { label: "Hardware wallets", href: "/hardware-wallets" },
    ],
  },
  {
    title: "Use ZEC",
    description: "Get ZEC, send it, and find places that accept it.",
    icon: Coins,
    links: [
      { label: "Buying ZEC", href: "/using-zcash/buying-zec" },
      { label: "Transactions", href: "/using-zcash/transactions" },
      {
        label: "Places to spend ZEC",
        href: "/using-zcash/spend-zcash/top-10-places-to-spend-zec",
      },
    ],
  },
  {
    title: "Build",
    description: "Developer resources, tools and ways to contribute to the wiki.",
    icon: Code,
    links: [
      { label: "Developers", href: "/developers" },
      { label: "Zcash Devtool", href: "/guides/zcash-devtool" },
      { label: "Contribute", href: "/contribute/help-build-zechub" },
    ],
  },
];

// 2. The rest of the wiki, grouped.
const groups: Group[] = [
  {
    title: "Go Deeper",
    subtitle: "Tutorials, guides and research for when you want more detail.",
    items: [
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
        title: "Research",
        description: "Articles and research on Zcash",
        href: "/research",
        icon: FlaskConical,
      },
      {
        title: "Privacy Tools",
        description: "Tools to help protect your privacy",
        href: "/privacy-tools/2fa-hardware-devices",
        icon: Shield,
      },
      {
        title: "Glossary & FAQs",
        description: "Quick answers and definitions",
        href: "/glossary-and-faqs/faq",
        icon: Info,
      },
    ],
  },
  {
    title: "Tools to Try",
    subtitle: "Interactive tools and directories built around Zcash.",
    items: [
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
    ],
  },
  {
    title: "Community & Organizations",
    subtitle: "The people and groups behind the Zcash ecosystem.",
    items: [
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
        title: "Global Ambassadors",
        description: "Community leaders promoting Zcash education worldwide.",
        href: "/zcash-global-ambassadors",
        icon: Globe,
      },
      {
        title: "Hackathon Archive",
        description: "Projects submitted to the 2026 ZecHub Hackathon.",
        href: "/hackathon",
        icon: Trophy,
        tag: "Archive",
      },
    ],
  },
];

// Two looks for the cards, so they can be compared side by side:
//   filled  (default)        -> tinted fill, no border
//   outline (?cards=outline) -> thin border
type CardStyle = {
  base: string;
  hover: string;
  divider: string;
  rowHover: string;
};
const cardStyles: Record<"filled" | "outline", CardStyle> = {
  filled: {
    base: "rounded-xl bg-slate-100 dark:bg-slate-800/60",
    hover: "transition-colors hover:bg-slate-200/70 dark:hover:bg-slate-800",
    divider: "border-slate-200 dark:border-slate-700",
    rowHover: "hover:bg-black/5 dark:hover:bg-white/5",
  },
  outline: {
    base: "rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/30",
    hover: "transition-colors hover:border-[#1984c7]",
    divider: "border-slate-200 dark:border-slate-800",
    rowHover: "hover:bg-slate-50 dark:hover:bg-slate-800/60",
  },
};

const wrap = "mx-auto w-full max-w-6xl px-4 md:px-6";
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

function LinkCard({ item, styles }: { item: Item; styles: CardStyle }) {
  const Arrow = item.external ? ArrowUpRight : ArrowRight;
  return (
    <SmartLink
      href={item.href}
      external={item.external}
      className={`group flex h-full flex-col gap-4 p-5 ${styles.hover} ${styles.base} ${focusRing}`}
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
        <h4 className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
          {item.title}
          <Arrow
            aria-hidden="true"
            className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-[#1984c7]"
          />
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {item.description}
        </p>
      </div>
    </SmartLink>
  );
}

const Home = (_props: HomeProps) => {
  const { t } = useLanguage();
  const { dark } = useDarkModeContext();
  const [query, setQuery] = useState("");
  const [variant, setVariant] = useState<"filled" | "outline">("filled");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("cards") === "outline") {
      setVariant("outline");
    }
  }, []);
  const styles = cardStyles[variant];

  // The filter searches every group and hides the ones with no match.
  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .map((group) => ({
        ...group,
        items: q
          ? group.items.filter(
              (item) =>
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q),
            )
          : group.items,
      }))
      .filter((group) => group.items.length > 0);
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
        <div className={`${wrap} relative py-10 text-center md:py-16`}>
          <Image
            src={
              dark
                ? "/hero-dark-transparent.png"
                : "/hero-white-transparent.png"
            }
            alt="ZecHub"
            width={1504}
            height={424}
            priority
            unoptimized
            className="mx-auto mb-8 h-auto w-full max-w-2xl"
          />
          <h1 className="sr-only">ZecHub</h1>
          <p className="mx-auto max-w-xl text-lg text-slate-600 dark:text-slate-400 md:text-xl">
            The community wiki for learning, using and building with{" "}
            <span className="font-medium text-[#1984c7]">Zcash</span>.
          </p>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("zechub:open-search"))
            }
            className={`mx-auto mt-8 flex w-full max-w-xl items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-500 transition-colors hover:border-[#1984c7] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 ${focusRing}`}
          >
            <Search aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span className="flex-1">Search the wiki or ask ZecHub AI</span>
          </button>
          {variant === "filled" ? (
            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {["Open source", "Community-driven", "Education hub for Zcash"].map(
                (chip) => (
                  <li
                    key={chip}
                    className="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-600 dark:bg-slate-800/70 dark:text-slate-300"
                  >
                    {chip}
                  </li>
                ),
              )}
            </ul>
          ) : null}
        </div>
      </section>

      {/* 1. Essentials for newcomers */}
      <section id="start" className={`${wrap} py-16 md:py-20`}>
        <SectionHeader
          title="Start Here"
          subtitle="New to Zcash? Begin with these four."
        />
        <div className="grid gap-4 imd:grid-cols-2 lg:grid-cols-4">
          {featured.map((feature) => (
            <div
              key={feature.title}
              className={`flex flex-col p-6 ${styles.base}`}
            >
              <IconBadge icon={feature.icon} />
              <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="mb-6 mt-2 text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
              <ul
                className={`mt-auto space-y-1 border-t pt-4 ${styles.divider}`}
              >
                {feature.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`group -mx-2 flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-slate-700 transition-colors ${styles.rowHover} hover:text-[#1984c7] dark:text-slate-200 ${focusRing}`}
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

      {/* 2. Everything else, grouped */}
      <section
        id="topics"
        className="scroll-mt-24 border-t border-slate-200 py-16 dark:border-slate-800 md:py-20"
      >
        <div className={wrap}>
          <SectionHeader
            title="More to Explore"
            subtitle="Guides, research, tools and the wider Zcash community."
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

          {filteredGroups.length > 0 ? (
            <div className="space-y-12">
              {filteredGroups.map((group) => (
                <div key={group.title}>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {group.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {group.subtitle}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 imd:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((item, i) => (
                      <div
                        key={item.title}
                        className={
                          // a lone last card is centred under the row of three
                          group.items.length % 3 === 1 &&
                          i === group.items.length - 1
                            ? "lg:col-start-2"
                            : ""
                        }
                      >
                        <LinkCard item={item} styles={styles} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">
              No topics match &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      </section>

      {/* DAO, community and contribution in one band */}
      <section id="community" className={`${wrap} pb-24`}>
        <div
          className={`grid gap-8 p-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-slate-200 md:p-0 dark:md:divide-slate-700/60 ${styles.base}`}
        >
          <div className="flex flex-col md:p-8">
            <IconBadge icon={Landmark} />
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              ZecHub DAO
            </h2>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              The community that governs ZecHub: its members, how decisions are
              made and open proposals.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
              <Link
                href="/dao"
                className={`inline-flex items-center gap-1 rounded text-[#1984c7] hover:underline ${focusRing}`}
              >
                Meet the DAO <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/proposals"
                className={`inline-flex items-center gap-1 rounded text-[#1984c7] hover:underline ${focusRing}`}
              >
                Proposals <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:p-8">
            <IconBadge icon={Users} />
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Join the community
            </h2>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Follow ZecHub and talk with other Zcash users.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socialNav.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-[#1984c7] hover:text-[#1984c7] dark:border-slate-700 dark:text-slate-200 ${focusRing}`}
                  >
                    <SocialIcon className="h-4 w-4" aria-hidden="true" />
                    {social.name}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col md:p-8">
            <IconBadge icon={Code} />
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Help build ZecHub
            </h2>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              ZecHub is community-driven. Add content, pick up a bounty or
              support the project.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/contribute/help-build-zechub"
                className={`rounded-lg bg-[#1984c7] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#1574af] ${focusRing}`}
              >
                Contribute
              </Link>
              <Link
                href="/donation"
                className={`rounded-lg border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:border-[#1984c7] hover:text-[#1984c7] dark:border-slate-700 dark:text-slate-200 ${focusRing}`}
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

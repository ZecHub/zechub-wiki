"use client";
import { useEffect, useState, type ReactNode } from "react";
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
  Shield,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import ZcashStats from "./ZcashStats";
import PriceTrend from "@/components/Charts/PriceTrend";
import VideoStrip from "./VideoStrip";
import { useDarkModeContext } from "@/hooks/useDarkModeContext";
import { useLanguage } from "@/context/LanguageContext";
import { socialNav } from "@/constants/navigation";

// Artwork lives in /public/explore/{dark,light}/. A plain string is the same
// file name in both folders; use {dark, light} when the names differ, and a
// leading "/" for a full path (needed when a file sits in the other folder).
type HomeLanding = typeof import("../../../dictionaries/en.json")["homeLanding"];
type Art = string | { dark: string; light: string };

type Item = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
  // optional artwork under /public/explore/{dark,light}/, shown faintly
  art?: Art;
};

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  links: { label: string; href: string }[];
  art?: Art;
};

type Group = {
  title: string;
  subtitle: string;
  items: Item[];
};

/* Brand blue kept from the current design: #147DF6 (hover #0F62C0). */

/* ---------------------------------------------------------------------------
   Page structure. Every page of the wiki is listed ONCE on this home:
     1. FEATURED  - the essentials for someone new (top of the page).
     2. GROUPS    - everything else, grouped by what the reader wants to do.
   Keep it that way: if a destination is promoted to FEATURED, remove it from
   GROUPS so the two sections never repeat each other.
   --------------------------------------------------------------------------- */

// 1. Essentials for newcomers, in the order most people need them.
const featured = (h?: HomeLanding): Feature[] => [
  {
    title: h?.featured?.learn?.title ?? "Learn",
    description: h?.featured?.learn?.description ?? "What Zcash is, how its privacy works, and where to start.",
    icon: GraduationCap,
    art: "start-here.png",
    links: [
      { label: h?.featured?.learn?.links?.first ?? "New user guide", href: "/start-here/new-user-guide" },
      { label: h?.featured?.learn?.links?.second ?? "What is Zcash?", href: "/start-here/what-is-zec-and-zcash" },
      { label: h?.featured?.learn?.links?.third ?? "Network upgrades", href: "/start-here/network-upgrades" },
    ],
  },
  {
    title: h?.featured?.wallet?.title ?? "Pick a wallet",
    description: h?.featured?.wallet?.description ?? "A wallet lets you receive and spend ZEC privately.",
    icon: Wallet,
    art: "pick-a-wallet.png",
    links: [
      { label: h?.featured?.wallet?.links?.first ?? "All wallets", href: "/wallets" },
      { label: h?.featured?.wallet?.links?.second ?? "Mobile wallets", href: "/mobile-wallets" },
      { label: h?.featured?.wallet?.links?.third ?? "Hardware wallets", href: "/hardware-wallets" },
    ],
  },
  {
    title: h?.featured?.use?.title ?? "Use ZEC",
    description: h?.featured?.use?.description ?? "Get ZEC, send it, and find places that accept it.",
    icon: Coins,
    art: "what-is-zcash.png",
    links: [
      { label: h?.featured?.use?.links?.first ?? "Buying ZEC", href: "/using-zcash/buying-zec" },
      { label: h?.featured?.use?.links?.second ?? "Transactions", href: "/using-zcash/transactions" },
      {
        label: h?.featured?.use?.links?.third ?? "Places to spend ZEC",
        href: "/using-zcash/spend-zcash/top-10-places-to-spend-zec",
      },
    ],
  },
  {
    title: h?.featured?.build?.title ?? "Build",
    description: h?.featured?.build?.description ?? "Developer resources, tools and ways to contribute to the wiki.",
    icon: Code,
    links: [
      { label: h?.featured?.build?.links?.first ?? "Developers", href: "/developers" },
      { label: h?.featured?.build?.links?.second ?? "Zcash Devtool", href: "/guides/zcash-devtool" },
      { label: h?.featured?.build?.links?.third ?? "Contribute", href: "/contribute/help-build-zechub" },
    ],
  },
];

// 2. The rest of the wiki, grouped.
const groups = (h?: HomeLanding): Group[] => [
  {
    title: h?.groups?.deeper?.title ?? "Go Deeper",
    subtitle: h?.groups?.deeper?.subtitle ?? "Tutorials, guides and research for when you want more detail.",
    items: [
      {
        title: h?.items?.tutorials?.title ?? "Tutorials",
        description: h?.items?.tutorials?.description ?? "Step-by-step video tutorials",
        href: "/zechub-tutorial",
        icon: Play,
        art: "tutorials.png",
      },
      {
        title: h?.items?.guides?.title ?? "Guides",
        description: h?.items?.guides?.description ?? "Nodes, tools, DeFi and more",
        href: "/guides/raspberry-pi-4-full-node",
        icon: BookOpen,
        art: "guides.png",
      },
      {
        title: h?.items?.tech?.title ?? "Zcash Tech",
        description: h?.items?.tech?.description ?? "zk-SNARKs and the protocol",
        href: "/zcash-tech/zk-snarks",
        icon: Cpu,
        art: "zcash-tech.png",
      },
      {
        title: h?.items?.research?.title ?? "Research",
        description: h?.items?.research?.description ?? "Articles and research on Zcash",
        href: "/research",
        icon: FlaskConical,
        art: "research.png",
      },
      {
        title: h?.items?.privacy?.title ?? "Privacy Tools",
        description: h?.items?.privacy?.description ?? "Tools to help protect your privacy",
        href: "/privacy-tools/2fa-hardware-devices",
        icon: Shield,
        art: "privacy-tools.png",
      },
      {
        title: h?.items?.glossary?.title ?? "Glossary & FAQs",
        description: h?.items?.glossary?.description ?? "Quick answers and definitions",
        href: "/glossary-and-faqs/faq",
        icon: Info,
        art: "glossary-faq.png",
      },
    ],
  },
  {
    title: h?.groups?.tools?.title ?? "Tools to Try",
    subtitle: h?.groups?.tools?.subtitle ?? "Interactive tools and directories built around Zcash.",
    items: [
      {
        title: "ZecHub Visualizer",
        description: h?.items?.visualizer?.description ?? "Interactive tools to understand Zcash privacy technology.",
        href: "/visualizer",
        icon: Eye,
        art: "research.png",
      },
      {
        title: "ZecMap",
        description: h?.items?.map?.description ?? "Community-maintained map of merchants and ATMs that accept Zcash.",
        href: "https://zecmap.com",
        icon: MapIcon,
        art: "start-here.png",
        external: true,
      },
      {
        title: "Pay with Zcash",
        description: h?.items?.pay?.description ?? "A free directory of where you can pay with ZEC.",
        href: "https://paywithz.cash",
        icon: CreditCard,
        art: "pay-with-zcash.png",
        external: true,
      },
    ],
  },
  {
    title: h?.groups?.community?.title ?? "Community & Organizations",
    subtitle: h?.groups?.community?.subtitle ?? "The people and groups behind the Zcash ecosystem.",
    items: [
      {
        title: h?.items?.organizations?.title ?? "Organizations",
        description: h?.items?.organizations?.description ?? "ZODL, Zcash Foundation, ZCG and others",
        href: "/zcash-organizations/electric-coin-company",
        icon: Building2,
        art: "zcash-organizations.png",
      },
      {
        title: h?.items?.community?.title ?? "Community",
        description: h?.items?.community?.description ?? "Links, blogs, projects, ambassadors",
        href: "/zcash-community/community-links",
        icon: Users,
        art: "zcash-community.png",
      },
      {
        title: h?.items?.ambassadors?.title ?? "Global Ambassadors",
        description: h?.items?.ambassadors?.description ?? "Community leaders promoting Zcash education worldwide.",
        href: "/zcash-global-ambassadors",
        icon: Globe,
        art: "zga.png",
      },
      {
        title: h?.items?.hackathon?.title ?? "Hackathon Archive",
        description: h?.items?.hackathon?.description ?? "Projects submitted to the 2026 ZecHub Hackathon.",
        href: "/hackathon",
        icon: Trophy,
        // the files are named the other way round: _w is the white art (for dark)
        art: {
          dark: "/explore/light/Hackathon_w.png",
          light: "/explore/dark/Hackathon_b.png",
        },
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
    hover: "transition-colors hover:border-brand",
    divider: "border-slate-200 dark:border-slate-800",
    rowHover: "hover:bg-slate-50 dark:hover:bg-slate-800/60",
  },
};

const wrap = "mx-auto w-full max-w-6xl px-4 md:px-6";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

// Buttons in the closing "Get Involved" band: solid brand blue in light mode,
// a tinted blue that sits quietly on the navy background in dark mode.
const ctaButton = `inline-flex items-center justify-center rounded-lg border border-brand bg-brand px-4 py-2 text-center text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover dark:border-brand/40 dark:bg-brand/15 dark:text-brand-soft dark:hover:border-brand/70 dark:hover:bg-brand/25 dark:hover:text-white ${focusRing}`;
const quietLink = `rounded text-sm font-medium text-brand hover:underline ${focusRing}`;

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
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
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
          <p className="mt-2 max-w-xl text-slate-700 dark:text-slate-200">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

// Faint artwork behind a card: whole picture, right side, fading out towards
// the text. `place` controls where it sits inside the card.
function CardArt({
  art,
  place = "inset-y-0 right-0 h-full w-[36%]",
}: {
  art: Art;
  place?: string;
}) {
  const dark = typeof art === "string" ? art : art.dark;
  const light = typeof art === "string" ? art : art.light;
  const base = `pointer-events-none absolute ${place} object-contain object-right p-2 transition-opacity [mask-image:linear-gradient(to_left,black_35%,transparent_100%)]`;
  return (
    <>
      <Image
        src={dark.startsWith("/") ? dark : `/explore/dark/${dark}`}
        alt=""
        aria-hidden="true"
        width={240}
        height={240}
        unoptimized
        className={`${base} hidden opacity-45 group-hover:opacity-60 dark:block`}
      />
      <Image
        src={light.startsWith("/") ? light : `/explore/light/${light}`}
        alt=""
        aria-hidden="true"
        width={240}
        height={240}
        unoptimized
        className={`${base} opacity-30 group-hover:opacity-45 dark:hidden`}
      />
    </>
  );
}

function LinkCard({ item, styles }: { item: Item; styles: CardStyle }) {
  const Arrow = item.external ? ArrowUpRight : ArrowRight;
  return (
    <SmartLink
      href={item.href}
      external={item.external}
      className={`group relative flex h-full flex-col gap-4 overflow-hidden p-5 ${styles.hover} ${styles.base} ${focusRing}`}
    >
      {item.art ? <CardArt art={item.art} /> : null}
      <div className="flex items-start justify-between gap-3">
        <IconBadge icon={item.icon} />
      </div>
      <div className={item.art ? "max-w-[66%]" : undefined}>
        <h4 className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
          {item.title}
          <Arrow
            aria-hidden="true"
            className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-brand"
          />
        </h4>
        <p className="mt-1 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
          {item.description}
        </p>
      </div>
    </SmartLink>
  );
}

// Keep the brand highlight from the English hero without assuming where a
// translator places the product name in the sentence.
function brandTagline(tagline: string): ReactNode {
  const brand = tagline.indexOf("Zcash");
  if (brand < 0) return tagline;
  return <>{tagline.slice(0, brand)}<span className="font-medium text-brand">Zcash</span>{tagline.slice(brand + "Zcash".length)}</>;
}

const Home = () => {
  const { t } = useLanguage();
  const { dark } = useDarkModeContext();
  const h = t?.homeLanding;
  const [variant, setVariant] = useState<"filled" | "outline">("filled");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("cards") === "outline") {
      setVariant("outline");
    }
  }, []);
  const styles = cardStyles[variant];

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800"
      >
        <PriceTrend background />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/10 via-transparent to-transparent"
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
          <p className="mx-auto max-w-xl text-lg text-slate-700 dark:text-slate-200 md:text-xl">
            {brandTagline(h?.hero?.tagline ?? "The community wiki for learning, using and building with Zcash.")}
          </p>
          {variant === "filled" ? (
            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                h?.hero?.openSource ?? "Open source",
                h?.hero?.communityDriven ?? "Community-driven",
                h?.hero?.educationHub ?? "Education hub for Zcash",
              ].map(
                (chip) => (
                  <li
                    key={chip}
                    className="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-600 dark:bg-slate-800/70 dark:text-slate-200"
                  >
                    {chip}
                  </li>
                ),
              )}
            </ul>
          ) : null}
        </div>
      </section>

      {/* Live chain numbers (hidden if the feed is unavailable) */}
      <section id="stats" className={`${wrap} pt-10`}>
        <ZcashStats className={`mb-12 ${styles.base}`} />
        <PriceTrend compact />
      </section>

      {/* 1. Essentials for newcomers */}
      <section id="start" className={`${wrap} py-16 md:py-20`}>
        <SectionHeader
          title={h?.start?.title ?? "Start Here"}
          subtitle={h?.start?.subtitle ?? "New to Zcash? Begin with these four."}
        />
        <div className="grid gap-4 imd:grid-cols-2 lg:grid-cols-4">
          {featured(h).map((feature) => (
            <div
              key={feature.title}
              className={`group relative flex flex-col overflow-hidden p-6 ${styles.base}`}
            >
              {feature.art ? (
                <CardArt
                  art={feature.art}
                  place="right-4 top-3 h-[4.5rem] w-28"
                />
              ) : null}
              <IconBadge icon={feature.icon} />
              <h3 className="mt-7 text-xl font-semibold text-slate-900 dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="mb-6 mt-2 text-slate-700 dark:text-slate-200">
                {feature.description}
              </p>
              <ul
                className={`mt-auto space-y-1 border-t pt-4 ${styles.divider}`}
              >
                {feature.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`group -mx-2 flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-slate-700 transition-colors ${styles.rowHover} hover:text-brand dark:text-slate-200 ${focusRing}`}
                    >
                      {link.label}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 1b. Video path for newcomers */}
      <div className={wrap}>
        <hr className="border-slate-200 dark:border-slate-800" />
      </div>

      <section id="videos" className={`${wrap} py-16 md:py-20`}>
        <VideoStrip />
      </section>

      {/* 2. Everything else, grouped */}
      <div className={wrap}>
        <hr className="border-slate-200 dark:border-slate-800" />
      </div>

      <section
        id="topics"
        className="scroll-mt-24 py-16 md:py-20"
      >
        <div className={wrap}>
          <SectionHeader
            title={h?.explore?.title ?? "More to Explore"}
            subtitle={h?.explore?.subtitle ?? "Guides, research, tools and the wider Zcash community."}
          />

          <div className="space-y-12">
            {groups(h).map((group) => (
              <div key={group.title}>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {group.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
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
        </div>
      </section>

      {/* DAO, community and contribution in one band */}
      <div className={wrap}>
        <hr className="border-slate-200 dark:border-slate-800" />
      </div>

      <section id="community" className={`${wrap} pb-24 pt-16 md:pt-20`}>
        <SectionHeader
          title={h?.involved?.title ?? "Get Involved"}
          subtitle={h?.involved?.subtitle ?? "Join the DAO, meet the community and help build the wiki."}
        />
        <div
          className={`grid gap-8 p-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-slate-200 md:p-0 dark:md:divide-slate-700/60 ${styles.base}`}
        >
          <div className="flex flex-col md:p-8">
            <IconBadge icon={Landmark} />
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              ZecHub DAO
            </h2>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {h?.involved?.dao?.description ?? "How ZecHub makes decisions, and the proposals open for a vote."}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/dao" className={`${ctaButton} px-5`}>
                {h?.involved?.dao?.meet ?? "Meet the DAO"}
              </Link>
              <Link href="/proposals" className={quietLink}>
                {h?.involved?.dao?.proposals ?? "See proposals"}
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:p-8">
            <IconBadge icon={Users} />
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              {h?.involved?.community?.title ?? "Join the community"}
            </h2>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {h?.involved?.community?.description ?? "Talk with other Zcash users and follow what ZecHub is doing."}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={socialNav.find((s) => s.name === "Discord")?.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${ctaButton} px-5`}
              >
                {h?.involved?.community?.discord ?? "Join Discord"}
              </a>
              <div className="flex items-center gap-1">
                {socialNav
                  .filter((s) => s.name !== "Discord")
                  .map((social) => {
                    const SocialIcon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        title={social.name}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-black/5 hover:text-brand dark:text-slate-300 dark:hover:bg-white/10 ${focusRing}`}
                      >
                        <SocialIcon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:p-8">
            <IconBadge icon={Code} />
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              {h?.involved?.contribute?.title ?? "Help build ZecHub"}
            </h2>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {h?.involved?.contribute?.description ?? "ZecHub is community-driven. Add content or pick up a bounty."}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/contribute/help-build-zechub" className={`${ctaButton} px-5`}>
                {h?.involved?.contribute?.action ?? "Contribute"}
              </Link>
              <Link href="/donation" className={quietLink}>
                {h?.involved?.contribute?.support ?? "Support the project"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

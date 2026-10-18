import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { routing } from "@/i18n/routing";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import BuildingShell from "./BuildingShell";
import {
  Rocket,
  CalendarDays,
  Wallet,
  FileText,
  BarChart3,
  Handshake,
  TrendingUp,
  WalletCards,
  PenLine,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Community Building | ZecHub",
    description:
      "A practical path for people who want to organize local or regional Zcash community activity — from first event to established presence.",
    url: `https://zechub.wiki${localePrefix}/zcash-community/building`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/zcash-community/building", locale),
  });
}

const cards: {
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  {
    href: "/zcash-community/building#where-to-start",
    icon: Rocket,
    title: "Where to start",
    desc: "Pick the path that matches what you actually want to do.",
  },
  {
    href: "/zcash-community/building/event",
    icon: CalendarDays,
    title: "Run a first event",
    desc: "Minimum viable meetup, workshop, or online AMA.",
  },
  {
    href: "/zcash-community/building/funding",
    icon: Wallet,
    title: "Funding routes",
    desc: "Which door to knock on for a workshop vs a larger project.",
  },
  {
    href: "/zcash-community/building/proposals",
    icon: FileText,
    title: "Proposal examples",
    desc: "What good (and incomplete) community proposals look like.",
  },
  {
    href: "/zcash-community/building/reporting",
    icon: BarChart3,
    title: "Reporting",
    desc: "What funders and the community expect after an activity.",
  },
  {
    href: "/zcash-community/building/mentoring",
    icon: Handshake,
    title: "Mentoring",
    desc: "Where to ask for advice before you run something.",
  },
  {
    href: "/zcash-community/building/progression",
    icon: TrendingUp,
    title: "Progression",
    desc: "From one event to a recognized regional presence.",
  },
];

export default function BuildingLanding() {
  return (
    <BuildingShell
      title="Build local Zcash community"
      description="A practical path for organizers."
      showBack={false}
    >
      <div className="mb-12 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              href={c.href}
              className="group rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#1984c7]/40 hover:shadow-md dark:border-white/10 dark:bg-[#111b27]/95 dark:hover:border-[#1984c7]/60"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1984c7]/10 text-[#1984c7] dark:bg-[#1984c7]/20 dark:text-[#5eb4e8]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-white">
                {c.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-[#8aa0b4]">{c.desc}</p>
            </Link>
          );
        })}
      </div>

      <section
        id="where-to-start"
        className="rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/95 sm:p-8"
      >
        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
          Where to start
        </h2>
        <p className="mb-6 text-zinc-600 dark:text-[#8aa0b4]">
          Pick the closest match. You can always switch paths later.
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Link
            href="/start-here/new-user-guide"
            className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-[#1984c7]/50 dark:border-white/10 dark:bg-[#0b1520]/80 md:block"
          >
            <WalletCards className="mt-0.5 h-5 w-5 shrink-0 text-[#1984c7] md:mb-2 md:mt-0" />
            <div className="font-semibold text-zinc-900 dark:text-white">
              Use ZEC
            </div>
            <div className="text-sm text-zinc-600 dark:text-[#8aa0b4]">
              New User Guide — buy, shield, send.
            </div>
          </Link>
          <Link
            href="/contribute/contributing-guide"
            className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-[#1984c7]/50 dark:border-white/10 dark:bg-[#0b1520]/80 md:block"
          >
            <PenLine className="mt-0.5 h-5 w-5 shrink-0 text-[#1984c7] md:mb-2 md:mt-0" />
            <div className="font-semibold text-zinc-900 dark:text-white">
              Contribute content
            </div>
            <div className="text-sm text-zinc-600 dark:text-[#8aa0b4]">
              Wiki pages, videos, translations, bounties.
            </div>
          </Link>
          <Link
            href="/zcash-community/building/event"
            className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-[#1984c7]/50 dark:border-white/10 dark:bg-[#0b1520]/80 md:block"
          >
            <Users className="mt-0.5 h-5 w-5 shrink-0 text-[#1984c7] md:mb-2 md:mt-0" />
            <div className="font-semibold text-zinc-900 dark:text-white">
              Organize locally
            </div>
            <div className="text-sm text-zinc-600 dark:text-[#8aa0b4]">
              Run an event, grow a regional group.
            </div>
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link
            href="/zcash-community/community-links"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:border-[#1984c7]/40 dark:border-white/10 dark:bg-[#0b1520]/60 dark:text-[#c5d4e0]"
          >
            Community Links
          </Link>
          <Link
            href="/zcash-global-ambassadors"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:border-[#1984c7]/40 dark:border-white/10 dark:bg-[#0b1520]/60 dark:text-[#c5d4e0]"
          >
            Existing Ambassadors
          </Link>
          <Link
            href="/zcash-community/building/mentoring"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:border-[#1984c7]/40 dark:border-white/10 dark:bg-[#0b1520]/60 dark:text-[#c5d4e0]"
          >
            Ask for advice
          </Link>
        </div>
      </section>
    </BuildingShell>
  );
}

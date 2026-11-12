import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { routing } from "@/i18n/routing";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import BuildingShell from "../BuildingShell";
import { Target, Scale, Receipt, ClipboardList, ExternalLink } from "lucide-react";
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
    title: "Community Proposal Examples | ZecHub",
    description:
      "What community and event proposals tend to include — annotated patterns drawn from public ZecHub DAO and ZCG processes.",
    url: `https://zechub.wiki${localePrefix}/zcash-community/building/proposals`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales(
      "/zcash-community/building/proposals",
      locale
    ),
  });
}

const patterns: {
  icon: LucideIcon;
  title: string;
  good: string;
  weak: string;
}[] = [
  {
    icon: Target,
    title: "Clear outcome",
    good: "“Run 2 university workshops; leave participants with a working shielded wallet and a follow-up Discord.”",
    weak: "“Raise awareness about privacy.”",
  },
  {
    icon: Scale,
    title: "Realistic scope",
    good: "Dates, locations or platforms, rough headcount, and what materials you will reuse.",
    weak: "Open-ended series with no end date or success criteria.",
  },
  {
    icon: Receipt,
    title: "Budget tied to activities",
    good: "Line items for venue, materials, travel, or content production with amounts.",
    weak: "Single lump sum with no breakdown.",
  },
  {
    icon: ClipboardList,
    title: "Reporting plan",
    good: "Short public write-up, privacy-safe photos or notes, link to materials created.",
    weak: "No plan for sharing what happened.",
  },
];

export default function ProposalsPage() {
  return (
    <BuildingShell
      title="Proposal examples"
      description="Patterns that show up in stronger community proposals. Look at public ZecHub DAO and ZCG proposals for full examples."
    >
      <div className="mb-8 grid gap-4">
        {patterns.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1984c7]/10 text-[#1984c7] dark:bg-[#1984c7]/20 dark:text-[#5eb4e8]">
                  <Icon className="h-4 w-4" />
                </div>
                <h2 className="font-semibold text-zinc-900 dark:text-white">
                  {p.title}
                </h2>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-100">
                <span className="font-medium">Stronger: </span>
                {p.good}
              </div>
              <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100">
                <span className="font-medium">Weaker: </span>
                {p.weak}
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
        <h2 className="mb-3 font-semibold text-zinc-900 dark:text-white">
          Where to look at real proposals
        </h2>
        <div className="flex flex-col gap-2">
          <Link
            href="/dao"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            ZecHub DAO
          </Link>
          <Link
            href="/governance-howto"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            DAO governance howto
          </Link>
          <Link
            href="/zips-grants"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            ZIPs & Grants tracker
          </Link>
          <a
            href="https://zcashcommunitygrants.org/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            ZCG site
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    </BuildingShell>
  );
}

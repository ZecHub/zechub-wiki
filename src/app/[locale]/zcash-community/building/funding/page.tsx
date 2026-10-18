import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { routing } from "@/i18n/routing";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import BuildingShell from "../BuildingShell";
import { Coins, Landmark, Gift } from "lucide-react";
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
    title: "Funding Routes for Community Work | ZecHub",
    description:
      "Practical decision guide for funding Zcash community events and small projects — ZecHub bounties/DAO vs ZCG vs other paths.",
    url: `https://zechub.wiki${localePrefix}/zcash-community/building/funding`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales(
      "/zcash-community/building/funding",
      locale
    ),
  });
}

const routes: {
  icon: LucideIcon;
  title: string;
  when: string;
  speed: string;
  link: string;
  linkLabel: string;
}[] = [
  {
    icon: Coins,
    title: "ZecHub bounties / DAO",
    when: "Small education, one event, short content series, translations",
    speed: "Usually faster",
    link: "/contribute/contributing-guide",
    linkLabel: "Contributing guide",
  },
  {
    icon: Landmark,
    title: "Zcash Community Grants (ZCG)",
    when: "Larger multi-month work, sustained regional programs, protocol-adjacent projects",
    speed: "Formal application + committee",
    link: "/zcash-organizations/zcash-community-grants",
    linkLabel: "ZCG overview",
  },
  {
    icon: Gift,
    title: "Retroactive / other",
    when: "Work already done, or local sponsorship outside the protocol fund",
    speed: "Case by case",
    link: "/zcash-community/zcash-governance",
    linkLabel: "Funding & governance context",
  },
];

export default function FundingPage() {
  return (
    <BuildingShell
      title="Funding routes"
      description="Protocol-level pages explain the Dev Fund. This page is the short decision layer for community activity."
    >
      <div className="mb-8 grid gap-4">
        {routes.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.title}
              className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1984c7]/10 text-[#1984c7] dark:bg-[#1984c7]/20 dark:text-[#5eb4e8]">
                  <Icon className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {r.title}
                </h2>
              </div>
              <p className="mb-2 text-sm text-zinc-600 dark:text-[#c5d4e0]">
                <span className="font-medium text-zinc-800 dark:text-white">
                  Best for:
                </span>{" "}
                {r.when}
              </p>
              <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500 dark:text-[#8aa0b4]">
                {r.speed}
              </p>
              <Link
                href={r.link}
                className="text-sm text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
              >
                {r.linkLabel}
              </Link>
            </div>
          );
        })}
      </div>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
        <h2 className="mb-2 font-semibold text-zinc-900 dark:text-white">
          Quick rule of thumb
        </h2>
        <ul className="space-y-1 text-zinc-700 dark:text-[#c5d4e0]">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1984c7]" />
            One workshop or short content piece — start with ZecHub.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1984c7]" />
            Ongoing regional program or multi-person team — look at ZCG.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1984c7]" />
            Already did the work — retroactive path via DAO or public write-up.
          </li>
        </ul>
        <div className="mt-4">
          <Link
            href="/start-here/development-fund"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            Development Fund background
          </Link>
        </div>
      </section>
    </BuildingShell>
  );
}

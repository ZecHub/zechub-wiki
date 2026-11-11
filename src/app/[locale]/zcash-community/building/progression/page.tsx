import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { routing } from "@/i18n/routing";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import BuildingShell from "../BuildingShell";
import { Calendar, Repeat, Globe2, Building2 } from "lucide-react";
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
    title: "Community Progression | ZecHub",
    description:
      "From a first Zcash event to a recognized regional presence — a practical progression map.",
    url: `https://zechub.wiki${localePrefix}/zcash-community/building/progression`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales(
      "/zcash-community/building/progression",
      locale
    ),
  });
}

const steps: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Calendar,
    title: "One event",
    desc: "Meetup, workshop, or AMA. Write a short report.",
  },
  {
    icon: Repeat,
    title: "Recurring activity",
    desc: "Second and third events, or a small content series. People know how to find you.",
  },
  {
    icon: Globe2,
    title: "Recognized regional presence",
    desc: "Listed with Global Ambassadors or equivalent. Consistent local language or region focus.",
  },
  {
    icon: Building2,
    title: "More formal structure",
    desc: "Recurring funding, dedicated site or brand, or a SubDAO for a sustained effort.",
  },
];

export default function ProgressionPage() {
  return (
    <BuildingShell
      title="Progression"
      description="Not every group needs to climb this. Most value is in the first two steps."
    >
      <div className="mb-8 space-y-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1984c7] text-white">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 rounded-2xl border border-zinc-200/80 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
                <h2 className="font-semibold text-zinc-900 dark:text-white">
                  {s.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-[#8aa0b4]">
                  {s.desc}
                </p>
                {i < steps.length - 1 && (
                  <div className="mt-2 text-xs text-zinc-400 dark:text-[#5a6a7e]">
                    ↓
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
        <h2 className="mb-3 font-semibold text-zinc-900 dark:text-white">
          See the later stages
        </h2>
        <div className="flex flex-col gap-2">
          <Link
            href="/zcash-global-ambassadors"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            Global Ambassadors (current established groups)
          </Link>
          <Link
            href="/dao"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            ZecHub DAO & SubDAOs
          </Link>
          <Link
            href="/zcash-organizations/brand"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            Brand assets for regional groups
          </Link>
        </div>
      </section>
    </BuildingShell>
  );
}

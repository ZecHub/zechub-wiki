import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { routing } from "@/i18n/routing";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import BuildingShell from "../BuildingShell";
import { MessageSquare, GraduationCap, Coffee, Check } from "lucide-react";
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
    title: "How to Run a First Event | ZecHub",
    description:
      "Minimum viable formats for a Zcash meetup, workshop, or online AMA — logistics, brand, privacy, and reporting.",
    url: `https://zechub.wiki${localePrefix}/zcash-community/building/event`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales(
      "/zcash-community/building/event",
      locale
    ),
  });
}

const formats: {
  icon: LucideIcon;
  title: string;
  effort: string;
  items: string[];
}[] = [
  {
    icon: MessageSquare,
    title: "Online AMA / office hours",
    effort: "Lowest",
    items: [
      "1–2 hours on Discord or a public call",
      "Simple agenda: intro, demo, Q&A",
      "Record or take notes if people consent",
    ],
  },
  {
    icon: GraduationCap,
    title: "University or community workshop",
    effort: "Medium",
    items: [
      "60–90 min hands-on (wallet setup, send shielded)",
      "Bring devices or use a shared demo",
      "Leave materials people can revisit",
    ],
  },
  {
    icon: Coffee,
    title: "Local meetup",
    effort: "Medium",
    items: [
      "Small group, conversation-first",
      "Optional short talk or demo",
      "Focus on relationships over production",
    ],
  },
];

const checklist = [
  "One clear goal (e.g. “3 people leave with a shielded wallet”)",
  "Short agenda shared ahead of time",
  "Brand assets from the wiki if you use logos",
  "Privacy plan: no attendance lists shared publicly, photos only with consent",
  "Way for people to follow up (Discord, Forum, Telegram)",
  "Plan a short write-up even if unfunded",
];

export default function EventPage() {
  return (
    <BuildingShell
      title="How to run a first event"
      description="Start smaller than you think. One clear outcome beats a big production."
    >
      <div className="mb-8 grid gap-4">
        {formats.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1984c7]/10 text-[#1984c7] dark:bg-[#1984c7]/20 dark:text-[#5eb4e8]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="font-semibold text-zinc-900 dark:text-white">
                    {f.title}
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 dark:border-white/10 dark:bg-[#0b1520] dark:text-[#8aa0b4]">
                  {f.effort}
                </span>
              </div>
              <ul className="space-y-1 text-sm text-zinc-600 dark:text-[#c5d4e0]">
                {f.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1984c7]" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <section className="mb-6 rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
          Checklist
        </h2>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-[#c5d4e0]">
          {checklist.map((item) => (
            <li key={item} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1984c7]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
          Existing material
        </h2>
        <div className="flex flex-col gap-2 text-sm">
          <Link
            href="/zcash-global-ambassadors"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            Global Ambassadors — what organizers already do
          </Link>
          <Link
            href="/zcash-organizations/brand"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            Brand assets
          </Link>
          <Link
            href="/zcash-community/zcon-archive"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            Zcon Archive — larger event examples
          </Link>
          <Link
            href="/zcash-community/building/reporting"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            Reporting expectations
          </Link>
        </div>
      </section>
    </BuildingShell>
  );
}

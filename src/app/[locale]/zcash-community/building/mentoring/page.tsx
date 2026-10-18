import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { routing } from "@/i18n/routing";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import BuildingShell from "../BuildingShell";
import { MessageCircle, Radio, ListChecks } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Mentoring for Community Organizers | ZecHub",
    description:
      "Where to find advice before running a Zcash community event or starting a regional group.",
    url: `https://zechub.wiki${localePrefix}/zcash-community/building/mentoring`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales(
      "/zcash-community/building/mentoring",
      locale
    ),
  });
}

export default function MentoringPage() {
  return (
    <BuildingShell
      title="Mentoring"
      description="There is no formal pairing program yet. Use the places that already exist for questions and feedback."
    >
      <div className="mb-6 grid gap-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
          <div className="mb-2 flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1984c7]/10 text-[#1984c7] dark:bg-[#1984c7]/20 dark:text-[#5eb4e8]">
              <MessageCircle className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              Ask early
            </h2>
          </div>
          <p className="text-sm text-zinc-700 dark:text-[#c5d4e0]">
            Post a short plan (format, date, goal, rough budget if any) in
            Discord or the Forum before you commit resources. People who have
            run events will usually reply.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
          <div className="mb-3 flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1984c7]/10 text-[#1984c7] dark:bg-[#1984c7]/20 dark:text-[#5eb4e8]">
              <Radio className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              Existing channels
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-zinc-700 dark:text-[#c5d4e0]">
            <li>
              <Link
                href="/zcash-community/community-links"
                className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
              >
                Community Links
              </Link>{" "}
              — Discord, Forum, Telegram
            </li>
            <li>
              <Link
                href="/zcash-community/arborist-calls"
                className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
              >
                Arborist Calls
              </Link>
            </li>
            <li>
              <Link
                href="/zcash-global-ambassadors"
                className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
              >
                Regional Ambassadors
              </Link>{" "}
              — people already organizing in your area or language
            </li>
          </ul>
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
        <div className="mb-2 flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1984c7]/10 text-[#1984c7] dark:bg-[#1984c7]/20 dark:text-[#5eb4e8]">
            <ListChecks className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-zinc-900 dark:text-white">
            What to bring
          </h2>
        </div>
        <ul className="space-y-1 text-zinc-700 dark:text-[#c5d4e0]">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1984c7]" />
            One paragraph on what you want to do
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1984c7]" />
            Who it is for
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1984c7]" />
            What help you actually need (review, co-host, materials, funding pointer)
          </li>
        </ul>
      </section>
    </BuildingShell>
  );
}

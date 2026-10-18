import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { routing } from "@/i18n/routing";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import BuildingShell from "../BuildingShell";
import { ClipboardCheck, Shield, ExternalLink } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Reporting Community Activity | ZecHub",
    description:
      "What good reporting looks like after a Zcash community event or small project — short, privacy-aware, and useful.",
    url: `https://zechub.wiki${localePrefix}/zcash-community/building/reporting`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales(
      "/zcash-community/building/reporting",
      locale
    ),
  });
}

const reportItems = [
  "What you did (format, date, place or platform)",
  "Rough numbers (attendance, new wallets, follow-ups) — no personal data",
  "What materials you created or reused (slides, guide, recording)",
  "What you would change next time",
  "Link to where people can continue (Discord, Forum thread, Telegram)",
];

const privacyItems = [
  "Photos only with consent",
  "No public attendance lists or contact details",
  "Prefer aggregate numbers over individual stories that identify people",
];

export default function ReportingPage() {
  return (
    <BuildingShell
      title="Reporting"
      description="Even unfunded activity is more useful if people can see what happened. Keep it short and privacy-aware."
    >
      <section className="mb-6 rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
        <div className="mb-3 flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1984c7]/10 text-[#1984c7] dark:bg-[#1984c7]/20 dark:text-[#5eb4e8]">
            <ClipboardCheck className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-zinc-900 dark:text-white">
            Minimum useful report
          </h2>
        </div>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-[#c5d4e0]">
          {reportItems.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1984c7]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6 rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
        <div className="mb-3 flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1984c7]/10 text-[#1984c7] dark:bg-[#1984c7]/20 dark:text-[#5eb4e8]">
            <Shield className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-zinc-900 dark:text-white">Privacy</h2>
        </div>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-[#c5d4e0]">
          {privacyItems.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1984c7]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#111b27]/80">
        <h2 className="mb-3 font-semibold text-zinc-900 dark:text-white">
          Where reports usually live
        </h2>
        <div className="flex flex-col gap-2">
          <Link
            href="/zcash-community/community-blogs"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            Community Blogs
          </Link>
          <Link
            href="/zcash-community/zcon-archive"
            className="text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            Zcon / event archives
          </Link>
          <a
            href="https://forum.zcashcommunity.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[#1984c7] hover:underline dark:text-[#5eb4e8]"
          >
            Zcash Community Forum
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    </BuildingShell>
  );
}

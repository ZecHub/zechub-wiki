import Dashboard from "@/components/Charts";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { loadZips } from "@/lib/zips/load-zips.server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale).catch(() => ({}))) as {
    pages?: {
      dashboard?: {
        title?: string;
        description?: string;
      };
    };
  };

  const localePrefix = locale && locale !== routing.defaultLocale ? `/${locale}` : "";
  const d = dict.pages?.dashboard;

  return genMetadata({
    title: d?.title ? `${d.title} | ZecHub` : "Zcash & ZecHub Ecosystem Dashboard & Metrics | ZecHub",
    description:
      d?.description ??
      "Live analytics, metrics, shielded pool statistics, DAO treasury status, YouTube stats, and ZCG grants tracking for the Zcash ecosystem.",
    url: `https://zechub.wiki${localePrefix}/dashboard`,
    image: getBanner("tools") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/dashboard", locale),
  });
}

type DashboardDictionary = {
  pages?: {
    dashboard?: {
      charts?: {
        headerTitle?: string;
        headerSubtitle?: string;
        shieldedNetworks?: string;
        currentYoutubeChannel?: string;
        totalVideos?: string;
        totalViews?: string;
        mostViewed?: string;
        viewsSuffix?: string;
        searchPlaceholder?: string;
        top15ByViews?: string;
        latest15Videos?: string;
        sortByNewest?: string;
        sortByViews?: string;
        top15VideosByViews?: string;
        latest15VideosSortedByViews?: string;
        tabs?: {
          zechubDashboard?: string;
          daodaoDashboard?: string;
          treasuryDashboard?: string;
          zcgDashboard?: string;
          youtubeDashboard?: string;
        };
      };
    };
  };
};

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [dict, zipsData] = await Promise.all([
    getDictionary(locale) as Promise<DashboardDictionary>,
    loadZips(),
  ]);

  return <Dashboard dict={dict} zipsData={zipsData} />;
}

export const dynamic = "force-dynamic";

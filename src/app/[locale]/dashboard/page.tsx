import Dashboard from "@/components/Charts";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { loadZips } from "@/lib/zips/load-zips.server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as {
    pages?: {
      dashboard?: {
        title?: string;
      };
    };
  };

  return genMetadata({
    title: dict.pages?.dashboard?.title || "Dashboard | Zechub",
    url: "https://zechub.wiki/dashboard",
  }) as Metadata;
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

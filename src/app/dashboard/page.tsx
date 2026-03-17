import Dashboard from "@/components/Charts";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import { getDictionary } from '@/lib/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dict = (await getDictionary()) as {
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
          zcgDashboard?: string;
          youtubeDashboard?: string;
        };
      };
    };
  };
};

export default async function DashboardPage() {
  const dict = (await getDictionary()) as DashboardDictionary;
  return <Dashboard dict={dict} />;
}

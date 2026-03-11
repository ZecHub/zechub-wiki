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

export default function DashboardPage() {
  return <Dashboard />;
}

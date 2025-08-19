import Dashboard from "@/components/Charts";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "Dashboard | Zechub",
  url: "https://zechub.wiki/dashboard",
});

export default function DashboardPage() {
  return <Dashboard />;
}

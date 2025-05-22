import ClientDashboard from "@/components/ShieldedPool";
import ShieldedPoolDashboard from "../../components/ShieldedPool/ShieldedPoolDashboard";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "Dashboard | Zechub",
  url: "https://zechub.wiki/dashboard",
});

export default function DashboardPage() {
  return (
    <div>
      <ClientDashboard />
    </div>
  );
}

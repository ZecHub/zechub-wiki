import Header from "@/components/DaoComponents/header";
import BeliefsSection from "@/components/DaoComponents/beliefs-section";
import UniqueFeatures from "@/components/DaoComponents/unique-features";
import GovernanceSection from "@/components/DaoComponents/governance-section";
import MembersSection from "@/components/DaoComponents/members-section";
import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "ZecHub DAO Members & Governance | ZecHub",
    description:
      "Meet the active members, core contributors, and governance structure of the ZecHub Decentralized Autonomous Organization.",
    url: `https://zechub.wiki${localePrefix}/dao`,
    image: getBanner("governance") || "/content-banners/bannerorgs.jpg",
    locale,
    alternates: buildAlternates("/dao", locale, [locale]),
  });
}

const DaoMembers: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <Header />
        <BeliefsSection />
        <UniqueFeatures />
        <GovernanceSection />
        <MembersSection />
      </div>
    </main>
  );
};

export default DaoMembers;

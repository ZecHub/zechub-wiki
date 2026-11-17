import Header from "@/components/DaoComponents/header";
import BeliefsSection from "@/components/DaoComponents/beliefs-section";
import UniqueFeatures from "@/components/DaoComponents/unique-features";
import GovernanceSection from "@/components/DaoComponents/governance-section";
import MembersSection from "@/components/DaoComponents/members-section";
import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
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
    alternates: buildAlternatesAllLocales("/dao", locale),
  });
}

const DaoMembers: React.FC = () => {
  return (
    <main>
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 md:py-12">
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

import Header from "@/components/DaoComponents/header";
import BeliefsSection from "@/components/DaoComponents/beliefs-section";
import UniqueFeatures from "@/components/DaoComponents/unique-features";
import GovernanceSection from "@/components/DaoComponents/governance-section";
import MembersSection from "@/components/DaoComponents/members-section";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "DAO Members | Zechub",
  // url: "https://zechub.wiki/dao",
});

const DaoMembers: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br  from-slate-100 via-white to-slate-50  dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
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

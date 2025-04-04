import Dao from "@/components/DAO";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "DAO Members | Zechub",
  // url: "https://zechub.wiki/dao",
});

const DaoMembers: React.FC = () => {
  return (
    <main>
      <Dao />
    </main>
  );
};

export default DaoMembers;

import ZcashProjectsComp from "@/components/ZcashProjects/ZcashProjects";
import { Metadata } from "next";
import { genMetadata } from "@/lib/helpers";
import { getDictionary } from '@/lib/getDictionary';

type ProjectsDictionary = {
  pages?: {
    zcashProjects?: {
      title?: string;
    };
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const dict = (await getDictionary()) as ProjectsDictionary;
  return genMetadata({
    title: dict.pages?.zcashProjects?.title || "Zcash Projects | ZecHub",
    url: "https://zechub.wiki/zcash-projects",
  }) as Metadata;
}

const ZcashProject = () => {
  return (
    <main>
      <ZcashProjectsComp />
    </main>
  );
};

export default ZcashProject;

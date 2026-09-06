import ZcashProjectsComp from "@/components/ZcashProjects/ZcashProjects";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { getDictionary } from "@/lib/getDictionary";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";

type ProjectsDictionary = {
  pages?: {
    zcashProjects?: {
      title?: string;
      description?: string;
    };
  };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale).catch(() => ({}))) as ProjectsDictionary;
  const zp = dict.pages?.zcashProjects;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  const title = zp?.title
    ? `${zp.title} | ZecHub`
    : "Zcash Projects & Ecosystem Showcase | ZecHub";

  const description =
    zp?.description ??
    "Discover active development projects, grants, privacy applications, and tools being built within the Zcash ecosystem.";

  return genMetadata({
    title,
    description,
    url: `https://zechub.wiki${localePrefix}/zcash-projects`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/zcash-projects", locale),
  });
}

const ZcashProject = () => {
  return (
    <main>
      <ZcashProjectsComp />
    </main>
  );
};

export default ZcashProject;

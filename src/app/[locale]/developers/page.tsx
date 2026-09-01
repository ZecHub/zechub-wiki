import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import DeveloperPage from "./DeveloperPage";
import { getDictionary } from "@/lib/getDictionary";

type DevelopersDictionary = {
  pages?: {
    developers?: {
      title?: string;
      description?: string;
    };
  };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale).catch(() => ({}))) as DevelopersDictionary;
  const localePrefix = locale && locale !== routing.defaultLocale ? `/${locale}` : "";
  const dev = dict.pages?.developers;

  return genMetadata({
    title: dev?.title ? `${dev.title} | ZecHub` : "Zcash Developer Hub, SDKs & APIs | ZecHub",
    description:
      dev?.description ??
      "Comprehensive developer documentation, SDKs, light client libraries, node software, and API resources for building on Zcash.",
    url: `https://zechub.wiki${localePrefix}/developers`,
    image: getBanner("developers") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/developers", locale),
  });
}

export default function Page() {
  return <DeveloperPage />;
}

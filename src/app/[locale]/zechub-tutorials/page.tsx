import React from "react";
import { Metadata } from "next";
import { getRootCached } from "@/lib/authAndFetch";
import { getBanner, genMetadata } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import ListTutorial from "./ListTutorial";
import WikiSectionBanner from "@/components/WikiSectionBanner/WikiSectionBanner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "ZecHub Tutorials & Video Walkthroughs | ZecHub",
    description:
      "Hands-on tutorials, video guides, and step-by-step walkthroughs for using Zcash wallets, mining tools, node software, and privacy features.",
    url: `https://zechub.wiki${localePrefix}/zechub-tutorials`,
    image: getBanner("tutorials") || "/content-banners/bannertutorials.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/zechub-tutorials", locale),
  });
}

const ZechubTutorial = async () => {
  const slug = "tutorials";
  const urlRoot = `/site/tutorials`;
  const roots = await getRootCached(urlRoot);

  return (
    <main>
      <WikiSectionBanner id="tutorials" />

      <div
        id="content"
        className={`flex flex-col space-y-5 ${
          roots && roots.length > 0 ? "md:flex-row md:space-x-5" : "md:flex-col"
        } h-auto w-full p-5`}
      >
        {roots && roots.length > 0 && (
          <div className="relative">
            <ListTutorial folder={slug} roots={roots} />
          </div>
        )}
      </div>
    </main>
  );
};

export default ZechubTutorial;

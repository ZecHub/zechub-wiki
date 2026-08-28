import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { getRootCached } from "@/lib/authAndFetch";
import { getBanner, genMetadata } from "@/lib/helpers";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import ListTutorial from "./ListTutorial";

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
    alternates: buildAlternates("/zechub-tutorials", locale, [locale]),
  });
}

const ZechubTutorial = async () => {
  const slug = "tutorials";
  const urlRoot = `/site/tutorials`;
  const roots = await getRootCached(urlRoot);
  const imgUrl = getBanner(slug);

  return (
    <main>
      <div className="flex justify-center w-full mb-5 bg-transparent rounded pb-4">
        <Image
          className="w-full mb-5 object-cover"
          alt="wiki-banner"
          width={800}
          height={50}
          src={imgUrl != undefined ? imgUrl : "/wiki-banner.avif"}
        />
      </div>

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

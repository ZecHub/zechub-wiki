import ZebraComponent from "./ZebraComponent";
import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
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
    title: "Zebra: Run a Zcash Full Node in Rust | ZecHub",
    description:
      "Zebra is the Zcash full node written in Rust. Download it, follow the Raspberry Pi 4 setup guide and see how running a node strengthens the network.",
    url: `https://zechub.wiki${localePrefix}/zebra`,
    image: getBanner("zcash-tech") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/zebra", locale),
  });
}

export default function zebra() {
  return(
    <ZebraComponent />
  )
}
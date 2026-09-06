import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import DonationClientWrapper from "@/components/DonationClientWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Donate to ZecHub | Support Open Zcash Education",
    description:
      "Support ZecHub's open-source mission to provide unbiased, global educational materials and tutorials for the Zcash ecosystem.",
    url: `https://zechub.wiki${localePrefix}/donation`,
    image: getBanner("zcash-community") || "/content-banners/bannercommunity.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/donation", locale),
  });
}

const Donation = () => {
  return (
    <main>
      <DonationClientWrapper />
    </main>
  );
};

export default Donation;

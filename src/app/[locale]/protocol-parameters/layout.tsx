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
    title: "Namada Protocol Parameters & Governance | ZecHub",
    description:
      "Namada governance, public goods funding, protocol and proof-of-stake parameters, plus the list of on-chain governance proposals.",
    url: `https://zechub.wiki${localePrefix}/protocol-parameters`,
    image: getBanner("governance") || "/content-banners/bannerorgs.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/protocol-parameters", locale),
  });
}

export default function ProtocolParametersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

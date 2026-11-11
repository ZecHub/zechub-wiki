import { Metadata } from "next";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { ZcashPaymentURINextJs } from "../tools/zcash-payment-widget/adapters/nextjs";

const API_BASE_URL =
  process.env.NODE_DEV === "production"
    ? `https://zechub.wiki/api`
    : `http://localhost:3000/api`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Payment URI Widget & SDK Demo | ZecHub",
    description:
      "Interactive demo of the Zcash Payment URI widget and SDK adapter for Next.js, enabling seamless shielded donation and payment integration.",
    url: `https://zechub.wiki${localePrefix}/zcash-payment-uri`,
    image: getBanner("tools") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/zcash-payment-uri", locale),
  });
}

export default function ZcashPaymentClient() {
  return (
    <div className="flex flex-col justify-center items-center mx-auto mt-12 gap-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-medium">Zcash Payment URI Widget</h1>
        <p className="text-[18px] font-md">
          This button component demonstrates the usage of the Zcash payment uri
          sdk for Next.js Adapter demo
        </p>
      </div>

      <ZcashPaymentURINextJs
        apiBase={API_BASE_URL}
        address="u1rz9rtqcwmtn4rrgjtkn3suntd0xdjtm0qar2at0kyx4kje7ygf58sah8j07vjhl222hhqmklqk943zz6ljcdde8jjgchgxtasug0flxx"
        amount={0.031415926535}
        label="Donate with Zcash"
        theme="dark"
        disabled={false}
      />
    </div>
  );
}

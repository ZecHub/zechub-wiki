import PaymentProcessorList from "@/components/PaymentProcessor/PaymentProcessorList";
import { getLocalizedFileContentCached, getRootCached } from "@/lib/authAndFetch";
import { genMetadata, getBanner } from "@/lib/helpers";
import { parseProcessorMarkdown } from "@/lib/parseProcessorMarkdown";
import { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { buildAlternates } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { getDictionary } from "@/lib/getDictionary";

const imgUrl = getBanner(`using-zcash`);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";

  return genMetadata({
    title: "Zcash Payment Processors & POS Integrations | ZecHub",
    description:
      "Explore non-custodial and custodial crypto payment gateways supporting shielded and transparent Zcash (ZEC) payments for e-commerce and merchants.",
    url: `https://zechub.wiki${localePrefix}/payment-processors`,
    image: imgUrl || "/content-banners/usingzcash.png",
    locale,
    alternates: buildAlternates("/payment-processors", locale, [locale]),
  });
}

export default async function Page(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  headers();

  const params = await props.params;
  const locale = params.locale || "en";
  const url = "site/Using_Zcash/Payment_Processors.md";
  const urlRoot = `/site/using-zcash`;

  const [markdown, roots, dict] = await Promise.all([
    getLocalizedFileContentCached(url, locale),
    getRootCached(urlRoot),
    getDictionary(locale),
  ] as const);
  const typedDict = dict as { pages?: { paymentProcessors?: { noData?: string } } };
  const content = markdown ?? (typedDict?.pages?.paymentProcessors?.noData ?? "No Data or Wrong file");

  const paymentProcessors = parseProcessorMarkdown(String(content));

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
        className={`flex flex-col space-y-5 container m-auto h-auto w-full py-5`}
      >
        <section className="h-auto w-full px-4">
          <PaymentProcessorList allProcessors={paymentProcessors} />
        </section>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";

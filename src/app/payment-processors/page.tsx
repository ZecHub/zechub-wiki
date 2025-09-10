import PaymentProcessorList from "@/components/PaymentProcessor/PaymentProcessorList";
import { getFileContentCached } from "@/lib/authAndFetch";
import { genMetadata, getBanner } from "@/lib/helpers";
import { parseProcessorMarkdown } from "@/lib/parseProcessorMarkdown";
import { Metadata } from "next";
import Image from "next/image";
const imgUrl = getBanner(`using-zcash`);

export const metadata: Metadata = genMetadata({
  title: "Payment Processors | Zechub",
  url: "https://zechub.wiki/using-zcash/using-zcash/payment-processors",
  image: imgUrl,
});

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const url = "site/Using_Zcash/Payment_Processors.md";

  const [markdown, roots] = await Promise.all([
    getFileContentCached(url),
    // getRootCached(urlRoot),
    "",
  ]);
  const content = markdown ? markdown : "No Data or Wrong file";

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
        className={`flex flex-col space-y-5 container m-auto ${
          roots && roots.length > 0 ? "md:flex-row md:space-x-5" : "md:flex-col"
        } h-auto w-full py-5`}
      >
        <section className="h-auto w-full px-4">
          <PaymentProcessorList allProcessors={paymentProcessors} />
        </section>
      </div>
    </main>
  );
}

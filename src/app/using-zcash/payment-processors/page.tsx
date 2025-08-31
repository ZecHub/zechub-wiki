// src/app/payment-processors/page.tsx
import React from "react";
import Image from "next/image";
import {
  getFileContent,
  getFileContentCached,
  getRoot,
  getRootCached,
} from "@/lib/authAndFetch";
import { getBanner } from "@/lib/helpers";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import PaymentProcessorList from "@/components/PaymentProcessor/PaymentProcessorList";
import { parseProcessorMarkdown } from "@/lib/parseProcessorMarkdown";

const imgUrl = getBanner(`using-zcash`);

export const metadata: Metadata = genMetadata({
  title: "Payment Processors | Zechub",
  url: "https://zechub.wiki/payment-processors",
  image: imgUrl,
});

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const url = "site/Using_Zcash/Payment_Processors.md";

  // const markdown = await getFileContent(url);
  const markdown = await getFileContentCached(url);
  console.log("Markdown Content:", markdown); // Check fetched markdown content

  const content = markdown ? markdown : "No Data or Wrong file";
  const urlRoot = "site/using-zcash";
  // const roots = await getRoot(urlRoot);
  const roots = await getRootCached(urlRoot);

  const paymentProcessors = parseProcessorMarkdown(content);
  console.log("Parsed Payment Processors:", paymentProcessors); // Check parsed markdown output

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
        <section className="h-auto w-full">
          <h1>Payment Processor</h1>
          <div>
            {/* <PaymentProcessorList allProcessors={paymentProcessors} /> */}
          </div>
        </section>
      </div>
    </main>
  );
}

// src/app/wallets/page.tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getFileContent, getRoot } from "@/lib/authAndFetch";
import { getBanner } from "@/lib/helpers";
import { parseMarkdown } from "@/lib/parseMarkdown";
import WalletList from "@/components/Wallet/WalletList";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

const imgUrl = getBanner(`using-zcash`);

export const metadata: Metadata = genMetadata({
  title: "Wallets",
  url: "https://zechub.wiki/wallets",
  image: imgUrl,
});

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const url = `/site/Using_Zcash/Wallets.md`;

  const markdown = await getFileContent(url);

  const content = markdown ? markdown : "No Data or Wrong file";
  const urlRoot = `/site/using-zcash`;
  const roots = await getRoot(urlRoot);

  const walletsParsed = parseMarkdown(content);
  // console.log("Parsed Wallets:", walletsParsed); // Check parsed markdown output

  return (
    <main>
      <div className="flex justify-center w-full  mb-5 bg-transparent rounded pb-4">
        <Image
          className="w-full mb-5 object-cover "
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
        } h-auto w-full py-5`}
      >
        <section className="h-auto w-full">
          <div>
            <WalletList allWallets={walletsParsed} />
          </div>
        </section>
      </div>
    </main>
  );
}

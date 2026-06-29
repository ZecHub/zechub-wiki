// src/app/wallets/page.tsx
import React from "react";
import Image from "next/image";
import { getFileContentCached, getRootCached } from "@/lib/authAndFetch";
import { getDictionary } from "@/lib/getDictionary";
import { getBanner } from "@/lib/helpers";
import { parseMarkdown } from "@/lib/parseMarkdown";
import WalletList from "@/components/Wallet/WalletList";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

const imgUrl = getBanner(`using-zcash`);

type WalletsDictionary = {
  pages?: {
    wallets?: {
      title?: string;
      noData?: string;
      bannerAlt?: string;
    };
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const dict = (await getDictionary()) as WalletsDictionary;
  return genMetadata({
    title: dict.pages?.wallets?.title || "Wallets | Zechub",
    url: "https://zechub.wiki/wallets",
    image: imgUrl,
  }) as Metadata;
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const url = `/site/Using_Zcash/Wallets.md`;
  const urlRoot = `/site/using-zcash`;

  const [markdown, roots] = await Promise.all([
    getFileContentCached(url),
    getRootCached(urlRoot),
  ]);

  const dict = (await getDictionary()) as WalletsDictionary;
  const content = markdown
    ? markdown
    : (dict.pages?.wallets?.noData ?? "No Data or Wrong file");
  const walletsParsed = parseMarkdown(String(content));

  return (
    <main>
      <div className="flex justify-center w-full  mb-5 bg-transparent rounded pb-4">
        <Image
          className="w-full mb-5 object-cover "
          alt={dict.pages?.wallets?.bannerAlt || "wiki-banner"}
          width={800}
          height={50}
          src={imgUrl != undefined ? imgUrl : "/wiki-banner.avif"}
        />
      </div>

      <div
        id="content"
        className={`flex flex-col space-y-5 px-4 ${
          roots && roots.length > 0 ? "md:flex-row md:space-x-5" : "md:flex-col"
        } h-auto w-full py-5 2xl:w-[50%] m-auto`}
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

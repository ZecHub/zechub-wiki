import React from "react";
import { getLocalizedFileContentCached, getRootCached } from "@/lib/authAndFetch";
import { getDictionary } from "@/lib/getDictionary";
import { getBanner } from "@/lib/helpers";
import { parseMarkdown } from "@/lib/parseMarkdown";
import WalletList from "@/components/Wallet/WalletList";
import { genMetadata } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";

const imgUrl = getBanner(`using-zcash`); // still used for metadata

type WalletsDictionary = {
  pages?: {
    wallets?: {
      title?: string;
      description?: string;
      noData?: string;
      bannerAlt?: string;
    };
  };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale).catch(() => ({}))) as WalletsDictionary;
  const localePrefix = locale && locale !== routing.defaultLocale ? `/${locale}` : "";
  const w = dict.pages?.wallets;

  return genMetadata({
    title: w?.title ? `${w.title} | ZecHub` : "Zcash Wallets Directory (Mobile, Desktop, Hardware) | ZecHub",
    description:
      w?.description ??
      "Find and compare secure Zcash wallets supporting shielded addresses, unified addresses, and privacy features on mobile, desktop, and hardware devices.",
    url: `https://zechub.wiki${localePrefix}/wallets`,
    image: imgUrl || "/content-banners/usingzcash.png",
    locale,
    alternates: buildAlternatesAllLocales("/wallets", locale),
  });
}

export default async function Page(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const params = await props.params;
  const { slug, locale } = params;
  const url = `/site/Using_Zcash/Wallets.md`;
  const urlRoot = `/site/using-zcash`;

  const [markdown, roots] = await Promise.all([
    getLocalizedFileContentCached(url, locale || "en"),
    getRootCached(urlRoot),
  ]);

  const dict = (await getDictionary(locale).catch(() => ({}))) as WalletsDictionary;
  const content = markdown
    ? markdown
    : (dict.pages?.wallets?.noData ?? "No Data or Wrong file");
  // Wallets hidden from the directory (still present in the content repo).
  const hiddenWallets = new Set(["ezcash", "zcashd"]);
  const walletsParsed = parseMarkdown(String(content)).filter(
    (w: { title: string }) => !hiddenWallets.has(w.title.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );

  return (
    <main>
      <header className="container mx-auto px-4 pb-2 pt-10">
        <h1 className="mb-3 mt-0 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
          {(dict.pages?.wallets?.title ?? "Wallets").replace(/\s*\|\s*ZecHub\s*$/, "")}
        </h1>
        {dict.pages?.wallets?.description ? (
          <p className="m-0 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            {dict.pages.wallets.description}
          </p>
        ) : null}
      </header>

      <div
        id="content"
        className={`flex flex-col space-y-5 px-4 ${
          roots && roots.length > 0 ? "md:flex-row md:space-x-5" : "md:flex-col"
        } container mx-auto h-auto w-full py-5`}
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

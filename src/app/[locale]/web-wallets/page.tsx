import { redirect } from "next/navigation";
import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "Web Wallets for Zcash | ZecHub",
  description:
    "Discover web-based and browser extension wallets for interacting with Zcash.",
  url: "https://zechub.wiki/web-wallets",
  image: getBanner("using-zcash") || "/content-banners/usingzcash.png",
});

export default async function Page() {
  redirect("/wallets");
}

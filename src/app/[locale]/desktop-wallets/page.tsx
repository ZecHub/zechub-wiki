import { redirect } from "next/navigation";
import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "Desktop Wallets for Zcash | ZecHub",
  description:
    "Explore secure desktop wallets supporting Zcash (ZEC), including full node wallets and light clients for Mac, Windows, and Linux.",
  url: "https://zechub.wiki/desktop-wallets",
  image: getBanner("using-zcash") || "/content-banners/usingzcash.png",
});

export default async function Page() {
  redirect("/wallets");
}

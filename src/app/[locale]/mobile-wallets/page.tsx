import { redirect } from "next/navigation";
import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "Mobile Wallets for Zcash | ZecHub",
  description:
    "Find mobile wallets supporting Zcash (ZEC) shielded transactions on iOS and Android.",
  url: "https://zechub.wiki/mobile-wallets",
  image: getBanner("using-zcash") || "/content-banners/usingzcash.png",
});

export default async function Page() {
  redirect("/wallets");
}

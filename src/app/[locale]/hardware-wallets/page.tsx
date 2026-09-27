import { redirect } from "next/navigation";
import { genMetadata, getBanner } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "Hardware Wallets for Zcash | ZecHub",
  description:
    "Secure your Zcash with hardware wallets supporting cold storage and shielded addresses.",
  url: "https://zechub.wiki/hardware-wallets",
  image: getBanner("using-zcash") || "/content-banners/usingzcash.png",
});

export default async function Page() {
  redirect("/wallets");
}

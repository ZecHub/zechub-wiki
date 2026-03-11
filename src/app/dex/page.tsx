import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import DexClient from "./DexClient";

export const metadata: Metadata = genMetadata({
  title: "Decentralised Exchanges",
  url: "https://zechub.wiki/using-zcash/dex",
});

export default function Page() {
  return <DexClient />;
}

import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import GlobalAmbassadorsClient from "./GlobalAmbassadorsClient";

export const metadata: Metadata = genMetadata({
  title: "Global Ambassadors",
  url: "https://zechub.wiki/using-zcash/zcash-global-ambassadors",
});

export default function Page() {
  return <GlobalAmbassadorsClient />;
}

import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import OmniflixClient from "./OmniflixClient";

export const metadata: Metadata = genMetadata({
  title: "Omniflix Media",
  url: "https://zechub.wiki/using-zcash/dex",
});

export default function Page() {
  return <OmniflixClient />;
}

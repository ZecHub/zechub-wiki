import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import DexClient from "./DexClient";

export const metadata: Metadata = genMetadata({
  title: "Decentralised Exchanges",
  url: "https://zechub.wiki/using-zcash/dex",
});

// Render the locale-aware client so the DEX page picks up dictionary strings
// (pages.dex.*) instead of hardcoded English. Metadata stays server-rendered.
const DecentralisedExchanges = () => <DexClient />;

export default DecentralisedExchanges;

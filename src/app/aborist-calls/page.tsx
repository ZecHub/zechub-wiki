import { Metadata } from "next";
import { genMetadata } from "@/lib/helpers";
import ArboristCallsPage from "./ArboristCallsPage";

export const metadata: Metadata = genMetadata({
  title: "ZecHub Aborist Calls",
  url: "https://zechub.wiki/aborist-calls",
});

export default function Page() {
  return <ArboristCallsPage />;
}

import { Metadata } from "next";
import { genMetadata } from "@/lib/helpers";
import ArboristCallsPage from "./ArboristCallsPage";

export const metadata: Metadata = genMetadata({
  title: "ZecHub Arborist Calls",
  url: "https://github.com/ZcashCommunityGrants/arboretum-notes",
});

export default function Page() {
  return <ArboristCallsPage />;
}

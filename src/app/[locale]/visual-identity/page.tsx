import { Metadata } from "next";
import { genMetadata } from "@/lib/helpers";
import VisualIdentityPage from "./VisualIdentityPage";

export const metadata: Metadata = genMetadata({
  title: "ZecHub Visual Identity",
  url: "https://zechub.wiki/visual-identity",
});

export default function Page() {
  return <VisualIdentityPage />;
}
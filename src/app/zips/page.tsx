import type { Metadata } from "next";
import ZipTracker from "./ZipTracker";
import { loadZips } from "./lib/load-zips";

export const metadata: Metadata = {
  title: "ZIP Tracker | ZecHub",
  description:
    "Track every Zcash Improvement Proposal — Draft to Final — and explore interactive sandboxes for NU7 candidate ZIPs (231 memo bundles, 234/233 issuance smoothing & burns, 235 fee burning, 226/227 ZSAs, 230 v6 tx format).",
  openGraph: {
    title: "Zcash ZIP Tracker",
    description:
      "Every Zcash Improvement Proposal in one place — kept in sync with zcash/zips. Plus interactive sandboxes for NU7-candidate ZIPs.",
  },
};

export const revalidate = 3600;

export default async function ZipsPage() {
  const { zips, lastSyncedAt, source } = await loadZips();
  return <ZipTracker zips={zips} lastSyncedAt={lastSyncedAt} source={source} />;
}

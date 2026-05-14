import { ZipAndGrantsGovernance } from "./ZipAndGrantsGovernance";
import { loadZips } from "../zips/lib/load-zips";

export const revalidate = 3600;

export default async function GovernancePage() {
  const { zips, lastSyncedAt, source } = await loadZips();
  return (
    <div className="mx-auto max-w-7xl min-h-screen bg-background">
      <ZipAndGrantsGovernance zipsData={{ zips, lastSyncedAt, source }} />
    </div>
  );
}

"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getZCGrantsData } from "../actions/google-sheets.action";
import { DashboardSection } from "./components/DashboardSection";
import { GrantList } from "./components/GrantList";
import { StatusBar } from "./components/StatusBar";
import { ZIPList } from "./components/ZIPList";
import { useZIPs } from "./hooks/use-zips";
import { Grant } from "./types/grants";

const queryClient = new QueryClient();

export const ZipAndGrants = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardSection />
      <ZipAndGrantsGovernance />
    </QueryClientProvider>
  );
};

function ZipAndGrantsGovernance() {
  const { data: zips, isLoading: isLoadingZip, error: zipError } = useZIPs();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [grantError, setGrantError] = useState("");

  const totalGrantFunding = 200;

  useEffect(() => {
    const handleFetchZCGrants = async () => {
      setIsLoading(true);

      try {
        const data = await getZCGrantsData();
        if (data) {
          console.log(data);
          setGrants(data);
        }
      } catch (err: any) {
        console.error("AppError:", err);
        setGrantError(err);
      } finally {
        setIsLoading(false);
      }
    };

    handleFetchZCGrants();
  }, []);

  return (
    <section className="flex flex-col min-h-screen container mx-auto px-4 py-8 space-y-8">
      <StatusBar zips={zips} totalGrantFunding={totalGrantFunding} />

      <div className="flex-1 grid gap-8 xl:grid-cols-2">
        <ZIPList error={zipError} isLoading={isLoadingZip} zips={zips} />
        <GrantList
          grants={grants}
          error={grantError}
          isLoading={isLoading}
          setError={setGrantError}
          setIsLoading={setIsLoading}
        />
      </div>

      <div className="text-center py-6 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Data sourced from{" "}
          <a
            href="https://github.com/zcash/zips/blob/main/README.rst"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub/zcash/zips
          </a>{" "}
          and curated grants records from{" "}
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Grants Link
          </a>{" "}
        </p>
      </div>
    </section>
  );
}

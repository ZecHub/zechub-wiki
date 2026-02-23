"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import * as config from "../../config";
import { getZCGrantsData } from "../actions/google-sheets.action";
import { DashboardSection } from "./components/DashboardSection";
import { GrantList } from "./components/GrantList";
import { StatusBar } from "./components/StatusBar";
import { ZIPList } from "./components/ZIPList";
import { useZIPs } from "./hooks/use-zips";
import { Grant } from "./types/grants";

const queryClient = new QueryClient();

export const ZipAndGrantsGovernance = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardSection />
      <ZipAndGrants />
    </QueryClientProvider>
  );
};

function ZipAndGrants() {
  const { data: zips, isLoading: isLoadingZip, error: zipError } = useZIPs();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [grantError, setGrantError] = useState("");

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

  const totalFundingInUsd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(
    useMemo(
      () => grants.reduce((acc, row) => acc + row.summary.totalAmountUSD, 0),
      [grants],
    ),
  );

  const activeGrants = useMemo(() => {
    return grants.reduce((acc, rows) => {
      if (rows.summary.overallStatus === "In progress") {
        acc++;
      }
      return acc;
    }, 0);
  }, [grants]);

  const totalGrantee = useMemo(() => {
    return grants
      .map((g) => g.grantee)
      .filter((g, i, arr) => arr.indexOf(g) === i);
  }, [grants]);

  return (
    <section className="flex flex-col min-h-screen container mx-auto px-4 py-8 space-y-8">
      <StatusBar
        zips={zips}
        totalGrantFunding={totalFundingInUsd}
        activeGrants={activeGrants}
        totalGrantee={totalGrantee.length}
      />

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
            href={config.ZIPs_URL_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub/zcash/zips
          </a>{" "}
          and curated grants records from{" "}
          <a
            href={config.GOOGLE_ZCG_SPREADSHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Zcash Grants (Google Sheet)
          </a>{" "}
        </p>
      </div>
    </section>
  );
}

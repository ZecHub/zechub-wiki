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
import { CardContent } from "@/components/UI/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/Charts/Tabs";

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
  const [activeTab, setActiveTab] = useState("zips");

  useEffect(() => {
    const handleFetchZCGrants = async () => {
      setIsLoading(true);

      try {
        const data = await getZCGrantsData();
        if (data) {
          setGrants(data);
        }
      } catch (err: any) {
        console.error("handleFetchZCGrants:", err);
        setGrantError(err);
      } finally {
        setIsLoading(false);
      }
    };

    handleFetchZCGrants();
  }, []);

  const tabLabels = ["ZIPs", "Grants"];

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
    return grants.filter((g) => g.status === "Open").length;
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {({ activeTab, setActiveTab }: any) => (
          <>
            <TabsList>
              {tabLabels.map((label) => (
                <TabsTrigger
                  key={label}
                  value={label.toLowerCase()}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="zips" activeTab={activeTab}>
              <ZIPList error={zipError} isLoading={isLoadingZip} zips={zips} />
            </TabsContent>

            <TabsContent value="grants" activeTab={activeTab}>
              <GrantList
                grants={grants}
                error={grantError}
                isLoading={isLoading}
                setError={setGrantError}
                setIsLoading={setIsLoading}
              />
            </TabsContent>
          </>
        )}
      </Tabs>

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

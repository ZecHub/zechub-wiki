"use client";
import {
  Tabs,
  TabsContent,
  TabsList2,
  TabsTrigger,
} from "@/components/Charts/Tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import * as config from "../../config";
import { getZCGrantsData } from "../actions/google-sheets.action";
import { ZipAndGrantsChart } from "./components/charts";
import { GrantList } from "./components/GrantList";
import { ZIPList } from "./components/ZIPList";
import { useZIPs } from "./hooks/use-zips";
import { Grant } from "./types/grants";

const queryClient = new QueryClient();

export const ZipAndGrantsGovernance = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <DashboardSection /> */}
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

  const tabLabels = ["ZIPs", "Grants", "Charts"];

  return (
    <section className="flex flex-col min-h-screen container mx-auto px-4 py-8 space-y-16">
      <div className="container flex py-8">
        <div className="flex justify-start gap-3">
          {/* <div className="gradient-zcash rounded-lg p-2">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div> */}
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Zcash <span className="text-gradient-zcash">Governance</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              ZIPs · Grants Proposals
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {({ activeTab, setActiveTab }: any) => (
          <>
            <TabsList2 className="dark:bg-inherit bg-inherit dark:text-primary border-b">
              {tabLabels.map((label) => (
                <TabsTrigger
                  key={label}
                  value={label.toLowerCase()}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  borderBottom={true}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList2>
            <div className="mt-8">
              <TabsContent value="zips" activeTab={activeTab}>
                <ZIPList
                  error={zipError}
                  isLoading={isLoadingZip}
                  zips={zips}
                />
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

              <TabsContent value="charts" activeTab={activeTab}>
                <ZipAndGrantsChart grants={grants} />
              </TabsContent>
            </div>
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

"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardSection } from "./components/DashboardSection";
import { GrantList } from "./components/GrantList";
import { StatusBar } from "./components/StatusBar";
import { ZIPList } from "./components/ZIPList";

const queryClient = new QueryClient();

export const Governance = () => (
  <QueryClientProvider client={queryClient}>
    <DashboardSection />
    <section className="flex flex-col min-h-screen container mx-auto px-4 py-8 space-y-8">
      <StatusBar />

      <div className="flex-1 grid gap-8 xl:grid-cols-2">
        <ZIPList />
        <GrantList />
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
  </QueryClientProvider>
);

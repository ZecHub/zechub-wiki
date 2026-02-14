'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardSection } from "./components/DashboardSection";
import { StatusBar } from "./components/StatusBar";

const queryClient = new QueryClient();

export const Governance = () => (
  <QueryClientProvider client={queryClient}>
    <DashboardSection />
    <section className="container mx-auto px-4 py-8 space-y-8">
      <StatusBar />
    </section>
  </QueryClientProvider>
);

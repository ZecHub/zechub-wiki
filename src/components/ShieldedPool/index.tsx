"use client";

import dynamic from 'next/dynamic';

const ShieldedPoolDashboard = dynamic(
  () => import("./ShieldedPoolDashboard"),
  { 
    ssr: false,
    loading: () => <p>Loading dashboard...</p>
  }
);

export default function ClientDashboard() {
  return <ShieldedPoolDashboard />;
}
import type { Metadata } from "next";
import ZipSimulator from "@/components/ZipSimulator/ZipSimulator";

export const metadata: Metadata = {
  title: "ZIP Simulator — ZecHub",
  description: "Interactively explore Zcash Improvement Proposals (ZIPs).",
  openGraph: {
    title: "ZIP Simulator — ZecHub",
    description: "Play with sliders and watch how each ZIP changes Zcash in real-time.",
    url: "https://zechub.wiki/governance/zip-simulator",
  },
};

export default function ZipSimulatorPage() {
  return <ZipSimulator />;
}
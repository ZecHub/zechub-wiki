import { Button } from "@/components/ui/shadcn/button";
import { useState } from "react";

import "./index.css";

import NamadaChart from "./NamadaChart";
import PenumbraChart from "./PenumbraChart";
import ZcashChart from "./ZcashChart";

const Dashboard = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("zcash");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="mt-12">
            <h1 className="text-3xl font-bold text-foreground">
              Privacy Cryptocurrency Dashboard
            </h1>
            <p className="text-muted-foreground">
              Analyze privacy coin metrics and trends
            </p>
          </div>

          {/* Crypto Selector */}
          <div className="flex gap-2">
            <Button
              className="bg-orange-400/75 text-white"
              variant={selectedCrypto === "zcash" ? "default" : "outline"}
              onClick={() => setSelectedCrypto("zcash")}
            >
              Zcash
            </Button>
            <Button
              className="bg-purple-500/75 text-white"
              variant={selectedCrypto === "penumbra" ? "default" : "outline"}
              onClick={() => setSelectedCrypto("penumbra")}
              disabled
            >
              Penumbra
            </Button>
            <Button
              className="bg-yellow-300/75 text-white"
              variant={selectedCrypto === "namada" ? "default" : "outline"}
              onClick={() => setSelectedCrypto("namada")}
            >
              Namada
            </Button>
          </div>
        </div>

        {/* Zcash Dashboard */}
        {selectedCrypto === "zcash" && <ZcashChart />}

        {/* Namada Dashboard */}
        {selectedCrypto === "namada" && <NamadaChart />}

        {/* Penumbra Dashboard */}
        {selectedCrypto === "penumbra" && <PenumbraChart />}
      </div>
    </div>
  );
};

export default Dashboard;

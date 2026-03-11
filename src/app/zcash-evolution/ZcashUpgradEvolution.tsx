"use client";

import { EvolutinCard } from "./data/EvolutionCard";
import { networkUpgrades } from "./data/networkUpgrade";
import { PrivacyMeter } from "./data/PrivacyMeter";
import { UpgradEvolutionHero } from "./data/UpgradEvolutionHero";
import "../../app/globals.css";

export function ZcashUpgradEvolution() {
  const currentEra = networkUpgrades.find((u) => u.status === "current");

  return (
    <div className="mx-auto max-w-7xl min-h-screen bg-background">
      <main className="container px-4 py-8 max-w-3xl">
        <UpgradEvolutionHero
          currentEra={currentEra}
          networkUpgrades={networkUpgrades}
        />
        <div className="relative">
          {networkUpgrades.map((u, i) => (
            <EvolutinCard key={u.id + i} upgrade={u} index={i} />
          ))}
        </div>

        <PrivacyMeter networkUpgrades={networkUpgrades}/>
      </main>
    </div>
  );
}

import { Shield } from "lucide-react";
import { NetworkUpgrade } from "./networkUpgrade"

interface HeroProp {
  currentEra: NetworkUpgrade | undefined;
  networkUpgrades: NetworkUpgrade[];
}
export function UpgradEvolutionHero(props: HeroProp) {
  return (
    <div className="text-center my-10 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        The Evolution of <span className="text-gradient-zcash">Privacy</span>
      </h1>
      <p className="text-muted-foreground mt-3 text-sm max-x-lg mx-auto leading-relaxed">
        From the first shielded transaction to trustless zero-knowledge proofs —
        trace Zcash&apos;s journey through {props.networkUpgrades.length - 1}{" "}
        network upgrades and beyond.
      </p>
      {props.currentEra && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-card px-4 py-2 glow-zcash bg-primary/10">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground">
            We are in the{" "}
            <span className="text-primary font-bold">
              {props.currentEra.name}
            </span>{" "}
            Era
          </span>
        </div>
      )}
    </div>
  );
}

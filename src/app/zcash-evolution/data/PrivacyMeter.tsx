import { NetworkUpgrade } from "./networkUpgrade";

interface PrivacyMeterProps {
  networkUpgrades: NetworkUpgrade[];
}

export function PrivacyMeter(props: PrivacyMeterProps) {
  const pastAndCurrent = props.networkUpgrades.filter(
    (u) => u.status !== "future",
  );

  return (
    <section
      className="mt-12 animate-fade-in"
      style={{ animationDelay: "600ms" }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Privacy Evolution
      </h3>

      <div className="flex rounded-lg overflow-hidden h-8 border border-border bg-secondary">
        {pastAndCurrent.map((u, i) => (
          <div
            className="relative group flex items-center justify-center transition-all"
            key={u.id}
            style={{
              width: `${100 / pastAndCurrent.length}%`,
              backgroundColor: `hsl(${u.eraColor}/ 0.7)`,
              borderRight:
                i < pastAndCurrent.length - 1
                  ? "1px solid hsl(var(--background))"
                  : undefined,
            }}
          >
            <span className="text-[9px] md:text-[10px] font-semibold text-primary-foreground truncate px-1">
              {u.name.split("/")[0].trim()}
            </span>
            
          </div>
        ))}
      </div>
    </section>
  );
}

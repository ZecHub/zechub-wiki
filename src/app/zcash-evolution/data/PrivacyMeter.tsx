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
      className=" mt-12 animate-fade-in"
      style={{ animationDelay: "600ms" }}
    >
      <div className="w-[92%] mx-auto">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Privacy Evolution
        </h3>
        <div className=" flex rounded-lg  h-8 bg-secondary">
          {pastAndCurrent.map((u, i) => (
            <div
              title={`${u.name} — ${u.privacyLabel}`}
              className="relative group flex-1 flex items-center justify-center transition-all"
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
              {/* Tooltip */}
              <div
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
              opacity-0 group-hover:opacity-100 group-hover:visible
             transition-opacity duration-200 z-20 pointer-events-none"
              >
                <div className="bg-popover border border-border rounded-md px-3 py-2 max-w-50 text-center text-xs whitespace-nowrap shadow-lg">
                  <p className="font-semibold text-foreground">{u.name}</p>
                  <p className="text-muted-foreground">{u.privacyLabel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span>2016 - Basic Shielded</span>
          <span>2025 - Sustainable Privacy</span>
        </div>
      </div>
    </section>
  );
}

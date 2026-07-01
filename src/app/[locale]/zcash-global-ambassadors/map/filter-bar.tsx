import { BASE_COLOR, REGION_COLORS, REGION_LABELS, RegionFilter } from "./constants";

interface FilterBarProps {
  active: RegionFilter;
  counts: Record<string, number>;
  onChange: (r: RegionFilter) => void;
}

export function FilterBar(props: FilterBarProps) {
  const { active, counts, onChange } = props;
  
  const regions = Object.keys(REGION_LABELS) as RegionFilter[];
  const ACTIVE_COLOR = BASE_COLOR;

  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        left: 14,
        zIndex: 900,
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
      }}
    >
      {regions.map((r) => {
        const isActive = r === active;
        const count =
          r === "all"
            ? Object.values(counts).reduce((a, b) => a + b, 0)
            : (counts[r] ?? 0);

        if (r !== "all" && count === 0) return null;

        return (
          <button
            key={r}
            onClick={() => onChange(r)}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              border: isActive
                ? `1.5px solid ${REGION_COLORS[r] ?? ACTIVE_COLOR}`
                : `1.5px solid rgba(255,255,255,0.12)`,
              background: isActive
                ? (REGION_COLORS[r] ?? ACTIVE_COLOR) + "22"
                : "rgba(13,17,23,0.82)",
              color: isActive
                ? (REGION_COLORS[r] ?? ACTIVE_COLOR)
                : "rgba(255,255,255,0.65)",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 5,
              letterSpacing: "0.01em",
            }}
          >
            {REGION_LABELS[r]}
            <span
              style={{
                fontSize: 10,
                opacity: 0.7,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "1px 5px",
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

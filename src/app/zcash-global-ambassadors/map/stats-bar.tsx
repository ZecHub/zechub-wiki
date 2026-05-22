import { REGION_COLORS } from "./constants";

interface StatsBarProps {
  total: number;
  visible: number;
}

export function StatsBar(props: StatsBarProps) {
  const { total, visible } = props;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 14,
        left: 14,
        zIndex: 900,
        background: "rgba(13,17,23,0.88)",
        borderRadius: 10,
        border: "1px solide rgba(255,255,255,0.1",
        padding: "8px 14px",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Stat value={total} label="total ambassadors" />
      <div
        style={{
          width: 1,
          height: 20,
          background: "rgba(255,255,255,0.1)",
        }}
      />
      <Stat value={visible} label="shown" accent={"#1DAEEE"} />
      <div
        style={{
          width: 1,
          height: 20,
          background: "rgba(255,255,255,0.1)",
        }}
      />
      <Stat value={Object.values(REGION_COLORS).length} label="regions" />
    </div>
  );
}

interface StatProps {
  value: number;
  label: string;
  accent?: string;
}
function Stat(props: StatProps) {
  const { value, label, accent } = props;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 5,
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: accent ?? "#e8edf3",
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </span>

      <span style={{ fontSize: 11, color: "#8B9EB7" }}>{label}</span>
    </div>
  );
}

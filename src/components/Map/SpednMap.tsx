interface RawLocaion {
  address: string;
  coordinates: { lat: number; lon: number };
}

type RawData = Record<string, Record<string, Record<string, RawLocaion[]>>>;

interface StoreEntry {
  id: string;
  brand: string;
  state: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  country: string;
}

const BRAND_COLORS: Record<string, string> = {
  BancoAgricola: "#1D9E75",
  "Barnes & Noble": "#185FA5",
  "Baskin-Robbins": "#D4537E",
  "CoCo Bubble Tea": "#BA7517",
  "Famous Footwear": "#D85A30",
  Fresh: "#639922",
  GameStop: "#E24B4A",
  "International Shoppes": "#7F77DD",
  Nordstrom: "#185FA5",
  "Nordstrom Rack": "#0C447C",
  Regal: "#7F77DD",
  Sheetz: "#BA7517",
  "Ulta Beauty": "#D4537E",
};

const DEFAULT_PIN_COLOR = "#888780";

interface BadgeProps {
  label: string;
  variant: "teal" | "blue" | "amber" | "gray";
}

function Badge(props: BadgeProps) {
  const styles: Record<string, { bg: string; color: string }> = {
    teal: {
      bg: "var(--color-background-success)",
      color: "var(--color-text-success)",
    },
    blue: {
      bg: "var(--color-background-info)",
      color: "var(--color-text-info)",
    },
    amber: { bg: "#FAEEDA", color: "#854F0B" },
    gray: {
      bg: "var(--color-background-secondary)",
      color: "var(--color-text-secondary)",
    },
  };

  const s = styles[props.variant];

  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 500,
        padding: "2px 7px",
        borderRadius: 10,
        background: s.bg,
        color: s.color,
        flexShrink: 0,
      }}
    >
      {props.label}
    </span>
  );
}

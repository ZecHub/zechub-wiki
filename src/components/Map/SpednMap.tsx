import { getBrandColor } from "./helpers";

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

interface StoreListItemProps {
  store: StoreEntry;
  isActive: boolean;
  onClick: () => void;
}
function StoreListItem(props: StoreListItemProps) {
  return (
    <div
      role="listitem"
      tabIndex={0}
      onClick={props.onClick}
      onKeyDown={(e) => e.key === "Enter" && props.onClick()}
      style={{
        padding: "11px 14px",
        cursor: "pointer",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        background: props.isActive
          ? "var(--color-background-info)"
          : "transparent",
        borderLeft: props.isActive
          ? "2px solid var(--color-text-info)"
          : "2px solid transparent",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        if (!props.isActive) {
          (e.currentTarget as HTMLDivElement).style.background =
            "var(--color-background-secondary)";
        }
      }}
      onMouseLeave={(e) => {
        if (props.isActive) {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }
      }}
    >
      {/* Brand dot + name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: 3,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: getBrandColor(props.store.brand),
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--color-text-primary)",
          }}
        >
          {props.store.brand}
        </span>
      </div>

      {/* city / state */}
      <div
        style={{
          fontSize: 11,
          color: "var(--color-text-secondary)",
          marginBottom: 6,
          marginLeft: 15,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {props.store.city}, {props.store.state}
      </div>
    </div>
  );
}

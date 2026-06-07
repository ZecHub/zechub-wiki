import { getBrandColor } from "../helpers";
import { StoreEntry } from "../SpednMap";

interface DetailPanelProps {
  store: StoreEntry | null;
  onClose: () => void;
}
export function DetailPanel(props: DetailPanelProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 14,
        right: 14,
        width: 250,
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-secondary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "14px 14px 16px",
        zIndex: 900,
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      }}
    >
      {/* close */}
      <button
        onClick={props.onClose}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--color-text-secondary)",
          fontSize: 14,
          padding: 2,
        }}
      >
        x
      </button>

      {/* Brand name */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--color-text-primary)",
          marginBottom: 5,
          paddingRight: 20,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: getBrandColor(props.store?.brand!),
            marginRight: 7,
            flexShrink: 0,
          }}
        />
        {props.store?.brand}
      </div>

      {/* Address */}
      <p
        style={{
          fontSize: 12,
          color: "var(--color-text-secondary)",
          lineHeight: 1.55,
          marginBottom: 10,
          paddingLeft: 15,
        }}
      >
        {props.store?.address}
      </p>

      {/*  */}
      {[
        {
          icon: "📍",
          label: `${props.store?.lat.toFixed(4)}, ${props.store?.lng.toFixed(4)}`,
        },
        { icon: "💳", label: "Accepts ZEC via Flexa" },
        ...(props.store?.country !== "United States"
          ? [{ icon: "🌎", label: props.store?.country }]
          : []),
      ].map((m, i) => (
        <div
          style={{
            display: "flex",
            gap: 7,
            alignItems: "flex-start",
            fontSize: 12,
            color: "var(--color-text-secondary)",
            marginBottom: 5,
          }}
          key={m.label + "_" + i}
        >
          <span style={{ flexShrink: 0 }}>{m.icon}</span>
          <span style={{ lineHeight: 1.4 }}>{m.label}</span>
        </div>
      ))}
    </div>
  );
}

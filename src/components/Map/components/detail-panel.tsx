import { getBrandColor } from "../helpers";
import { StoreEntry } from "../SpednMap";

interface DetailPanelProps {
  store: StoreEntry | null;
  onClose: () => void;
}
export function DetailPanel(props: DetailPanelProps) {
  if (!props.store) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 14,
        right: 14,
        width: 250,
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-secondary)",
        borderRadius: 10,
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
          display: "flex",
          alignItems: "center",
          gap: 7,
          fontSize: 13,
          fontWeight: 500,
          color: "var(--color-text-primary)",
          marginBottom: 5,
          paddingRight: 20,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: getBrandColor(props.store?.brand!),
            flexShrink: 0,
          }}
        />

        <span
          style={{
            fontSize: 13,
            color: "var(--color-text-primary)",
            fontWeight: 500,
          }}
        >
          {props.store?.brand}
        </span>
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
          <span style={{ flexShrink: 0, lineHeight: 1.5 }}>{m.icon}</span>
          <span style={{ lineHeight: 1.4 }}>{m.label}</span>
        </div>
      ))}
    </div>
  );
}

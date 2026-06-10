import { getBrandColor } from "../helpers";
import { StoreEntry } from "../SpednMap";
import { Badge } from "./badge";

interface StoreListItemProps {
  store: StoreEntry;
  isActive: boolean;
  onClick: () => void;
}
export function StoreListItem(props: StoreListItemProps) {
  return (
    <div
      role="listitem"
      tabIndex={0}
      onClick={props.onClick}
      onKeyDown={(e) => e.key === "Enter" && props.onClick()}
      style={{
        padding: "11px 14px",
        cursor: "pointer",
        borderBottom: "0.25px solid var(--spedn-border)",
        background: props.isActive ? "var(--spedn-bg-hover)" : "transparent",
        borderLeft: props.isActive
          ? "3px solid var(--spedn-text-info)"
          : "transparent",
        transition: "background 0.1s",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        if (!props.isActive) {
          (e.currentTarget as HTMLDivElement).style.background =
            "var(--spedn-bg-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (!props.isActive) {
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
            color: "var(--spedn-text-primary)",
          }}
        >
          {props.store.brand}
        </span>
      </div>

      {/* city / state */}
      <div
        style={{
          fontSize: 11,
          color: "var(--spedn-text-faint)",
          marginBottom: 6,
          marginLeft: 15,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {props.store.city}, {props.store.state}
      </div>

      {/* Badge */}
      <div
        style={{ display: "flex", gap: 5, marginLeft: 15, flexWrap: "wrap" }}
      >
        <Badge label="ZEC" variant="teal" />
        <Badge label="Flexa" variant="blue" />
        {props.store.country !== "United States" && (
          <Badge label={props.store.country} variant="amber" />
        )}
      </div>
    </div>
  );
}

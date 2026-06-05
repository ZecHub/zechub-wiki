import { getBrandColor } from "../helpers";
import { StoreEntry } from "../SpednMap";

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

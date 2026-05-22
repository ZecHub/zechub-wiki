import Image from "next/image";
import { REGION_COLORS, REGION_LABELS, RegionFilter } from "./constants";
import { AmbassadorProps } from "./GlobalAmbassadorsMap";
import { LinkRow } from "./link-row";
import { MetaRow } from "./meta-row";

interface PinDetailsProps {
  ambassador: AmbassadorProps;
  onClose: () => void;
}

export function PinDetails(props: PinDetailsProps) {
  const { ambassador, onClose } = props;
    console.log(ambassador);

  if (!ambassador) return null;

  const regionColor = REGION_COLORS[ambassador.region] ?? "#1DAEEE";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "min(360px, 100%)",
        height: "100%",
        background: "var(--panel-bg, #0D1117",
        borderLeft: `1px solid var(--panel-border, #1E2A38)`,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
        animation: "slideIn 0.22s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "relative",
          height: 180,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Gradient overlay on image */}
        <Image
          src={ambassador.image}
          alt={ambassador.name}
          width={100}
          height={100}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.55)",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.2) 100%)`,
          }}
        />

        {/* Region */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: regionColor,
          }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            position: "absolute",
            top: 14,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          *
        </button>
        {/* Name + flag */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 18,
            right: 18,
          }}
        >
          <div
            style={{
              fontSize: 18,
              marginBottom: 4,
            }}
          >
            {ambassador.flag}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {ambassador.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: regionColor,
              marginTop: 4,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {REGION_LABELS[ambassador.region as RegionFilter] ??
              ambassador.region}
            {" . "}
            {ambassador.language}
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Description */}
        <p
          style={{
            fontSize: 13.5,
            color: "var(--text-secondary, #8B9EB7)",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {ambassador.description}
        </p>

        {/* Links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <LinkRow
            href={ambassador.twitter}
            label="Follow on X"
            icon="𝕏"
            color={regionColor}
          />

          {ambassador.blog && (
            <LinkRow
              href={ambassador.blog}
              label="Read the blog"
              icon="✦"
              color={regionColor}
            />
          )}

          {ambassador.projectSite && (
            <LinkRow
              href={ambassador.projectSite}
              label="Project site"
              icon="⬡"
              color={regionColor}
            />
          )}
        </div>

        {/* Meta */}
        <div
          style={{
            borderTop: "1px solid var(--panel-border, #1E2A38)",
            paddingTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <MetaRow label="Country" value={ambassador.country_code} />
          <MetaRow label="Pin" value={ambassador.pin_note} />
          <MetaRow label="Coords source" value={ambassador.coords_source} />
          <MetaRow label="Last updated" value={ambassador.last_update} />
        </div>
      </div>
    </div>
  );
}

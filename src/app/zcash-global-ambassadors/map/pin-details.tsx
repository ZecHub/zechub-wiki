import Image from "next/image";
import { REGION_COLORS, REGION_LABELS, RegionFilter } from "./constants";
import { AmbassadorProps } from "./GlobalAmbassadorsMap";

interface PinDetailsProps {
  ambassador: AmbassadorProps;
  onClose: () => void;
}

export function PinDetails(props: PinDetailsProps) {
  if (!props.ambassador) return null;

  const regionColor = REGION_COLORS[props.ambassador.region] ?? "#1DAEEE";

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
          src={props.ambassador.image}
          alt={props.ambassador.name}
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
          onClick={props.onClose}
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
            {props.ambassador.flag}
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
            {props.ambassador.name}
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
            {REGION_LABELS[props.ambassador.region as RegionFilter] ??
              props.ambassador.region}
            {" . "}
            {props.ambassador.language}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex:1,
        overflow:'auto',
        padding: '20px 18px',
        display:'flex',
        flexDirection:'column',
        gap:20
      }}>
        {/* Description */}
        <p style={{
            fontSize:13.5,
            color:'var(--text-primary-secondary, #8B9EB7)',
            lineHeight:1.65,
            margin:0,
        }}>
            {props.ambassador.description}
        </p>

    {/* Links */}
    <div style={{
        display:'flex', flexDirection:'column', gap:10
    }}>
        

        {/* TODO: */}
    </div>
      </div>
    </div>
  );
}

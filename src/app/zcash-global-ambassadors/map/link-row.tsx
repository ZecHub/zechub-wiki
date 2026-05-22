interface LinkRowProps {
  href: string;
  label: string;
  icon: string;
  color: string;
}
export function LinkRow(props: LinkRowProps) {
  const { color, href, label, icon } = props;
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 8,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        color: "#e8edf3",
        textDecoration: "none",
        fontSize: 13,
        fontWeight: 500,
        transition: "background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background =
          "rgba(255,255,255,0.08)";

        (e.currentTarget as HTMLAnchorElement).style.borderColor =
          "rgba(255,255,255,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
          "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor =
          "rgba(255,255,255,0.07)";
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: color + "22",
          border: `1px solid ${color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      {label}
      <span
        style={{
          marginLeft: "auto",
          opacity: 0.4,
          fontSize: 11,
        }}
      >
        ↗
      </span>
    </a>
  );
}

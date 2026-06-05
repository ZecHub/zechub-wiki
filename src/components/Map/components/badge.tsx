interface BadgeProps {
  label: string;
  variant: "teal" | "blue" | "amber" | "gray";
}

export function Badge(props: BadgeProps) {
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

interface MetaRowProps {
  label: string;
  value: string;
}
export function MetaRow(props: MetaRowProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        fontSize: 12,
      }}
    >
      <span style={{ color: "var(--text-secondary, #8B9EB7)", minWidth: 110 }}>
        {props.label}
      </span>
      <span style={{ color: "var(--text-primary, #CBD5E1)" }}>
        {props.value}
      </span>
    </div>
  );
}

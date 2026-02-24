interface Props {
  search: string;
  setStatusFilter: (sf: string) => void;
  statusFilter: string;
}

export function FilterButton(props: Props) {
    console.log(props.search)
  return (
    <button
      key={props.search}
      onClick={() => props.setStatusFilter(props.search)}
      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
        props.statusFilter === props.search
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
      }`}
    >
      {props.search}
    </button>
  );
}

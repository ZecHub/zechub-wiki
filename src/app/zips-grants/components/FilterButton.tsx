interface Props {
  search: string;
  onClick: (sf: string) => void;
  filter: string;
}

export function FilterButton(props: Props) {
  return (
    <button
      key={props.search}
      onClick={() => props.onClick(props.search)}
      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
        props.filter === props.search
          ? "bg-primary text-primary-foreground border-primary"
          : "dark:bg-slate-800 bg-gray-500 text-slate-100 dark:text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
      }`}
    >
      {props.search}
    </button>
  );
}

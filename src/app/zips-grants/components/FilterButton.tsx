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
      className={`px-3 py-1.5 text-xs font-medium bg-amber-400 rounded-full border dark:border-slate-800 border-slate-100/50 transition-colors hover:cursor-pointer ${
        props.filter === props.search
          ? "bg-primary text-primary-foreground dark:border-primary"
          : "bg-inherit"
      }`}
    >
      {props.search}
    </button>
  );
}

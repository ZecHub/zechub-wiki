import { Input } from "@/components/UI/shadcn/input";
import { Search } from "lucide-react";

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

export function SearchFilter(props: SearchFilterProps) {
  return (
    <div className="grid grid-cols-1 gap-3 items-start sm:items-center mb-8 imd:flex imd:flex-row">
      <div className="relative flex-1 w-full ">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 to-muted-foreground" />
        <Input
          value={props.search}
          onChange={(e) => props.onSearchChange(e.target.value)}
          placeholder={props.placeholder || "Search..."}
          className="pl-9 bg-slate-200 dark:bg-slate-700 board-border border-slate-400 dark:border-slate-600 focus:ring-primary"
        />
      </div>
      {props.children && (
        <div className="grid grid-cols-3 imd:grid-cols-5 gap-2 imd:flex imd:flex-wrap">
          {props.children}
        </div>
      )}
    </div>
  );
}

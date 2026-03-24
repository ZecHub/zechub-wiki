"use client";
import { SearchInputProps } from "@/types";
import { Search } from "lucide-react";
import { forwardRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ searchInput, handleSearch, onKeyDown, id = "wiki-search-input" }, ref) => {
    const { t } = useLanguage();
    const label = t.common?.search || "Search";

    return (
      <form
        role="search"
        className="w-full"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            aria-hidden
          />
          <input
            ref={ref}
            type="search"
            id={id}
            name="q"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={searchInput}
            onChange={handleSearch}
            onKeyDown={onKeyDown}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-900 dark:focus:ring-blue-400/25"
            placeholder={`${label}…`}
            aria-describedby="wiki-search-hint"
          />
        </div>
      </form>
    );
  },
);

SearchInput.displayName = "SearchInput";

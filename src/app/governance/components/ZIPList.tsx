import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ZIPData } from "../lib/github";
import { FilterButton } from "./FilterButton";
import { SearchFilter } from "./SearchFilter";
import { StatusBadge } from "./StatusBadge";

const STATUS_FILTERS = ["All", "Active", "Final", "Draft", "Withdrawn"];
interface Props {
  zips: ZIPData[] | undefined;
  isLoading: boolean;
  error: Error | null;
}
export function ZIPList(props: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    if (!props.zips) return [];

    return props.zips.filter((zip) => {
      const matchesSearch =
        zip.title.toLowerCase().includes(search.toLowerCase()) ||
        zip.number.includes(search) ||
        zip.authors?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        zip.status.toLowerCase().includes(statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  }, [props.zips, search, statusFilter]);

  return (
    <section className="">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Zcash Improvement Proposals
        </h2>
        {props.zips && (
          <span className="text-xs to-muted-foreground ml-1">
            ({filtered.length})
          </span>
        )}
      </div>

      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search ZIPS by number, title or author..."
      >
        {STATUS_FILTERS.map((sf) => (
          <FilterButton
            key={sf}
            search={sf}
            filter={statusFilter}
            onClick={setStatusFilter}
          />
        ))}
      </SearchFilter>

      {props.isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground text-sm">
            Loading ZIPs from GitHub...
          </span>
        </div>
      )}

      {props.error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 mt-4">
          <p className="text-sm text-destructive">
            Failed to load ZIPs. GitHub API rate limit may have been reached.
          </p>
        </div>
      )}

      {!props.isLoading && !props.error && (
        <div
          className={`my-4 max-h-[640px] ${filtered && filtered.length < 5 ? "overscroll-none" : "overflow-y-scroll"} pr-2`}
        >
          <ul className="space-y-2">
            {filtered.map((zip, i) => (
              <li key={zip.number}>
                <a
                  href={zip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-lg border border-border bg-slate-300 dark:bg-slate-800 p-4 hover:border-primary/40 hover:glow-zcash transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="font-mono text-sm text-primary font-semibold shrink-0">
                      #{zip.number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {zip.title}
                      </p>
                      {zip.authors && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {zip.authors}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <StatusBadge status={zip.status} />
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && !props.isLoading && (
            <p className="text-center py-8 text-muted-foreground text-sm">
              No ZIPs match your search.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

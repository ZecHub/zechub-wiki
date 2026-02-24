import { Coins, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Grant } from "../types/grants";
import { FilterButton } from "./FilterButton";
import { GrantCard } from "./grants/GrantCard";
import { SearchFilter } from "./SearchFilter";

interface Props {
  grants: Grant[];
  error: string | any;
  setError: (err: string | any) => void;
  isLoading: boolean;
  setIsLoading: (l: boolean) => void;
}

export function GrantList(props: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const CATEGORY_FILTER = props.grants
    .map((d) => d.category)
    .filter((c, i, arr) => arr.indexOf(c) === i);

  const STATUS_FILTERS = props.grants
    .map((d) => d.status)
    .filter((s, i, arr) => arr.indexOf(s) === i);

  const filteredGrants = useMemo(() => {
    if (!props.grants) return [];

    return props.grants.filter((grant) => {
      const matchesSearch =
        grant.grantee.toLowerCase().includes(search.toLowerCase()) ||
        grant.project.includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        grant.status.toLowerCase().includes(statusFilter.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        grant.category.toLowerCase().includes(categoryFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [props.grants, search, statusFilter, categoryFilter]);

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Grants & Funding
        </h2>
        <span className="text-xs text-muted-foreground ml-1">
          ({props.grants.length})
        </span>
      </div>
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search grants..."
      >
        {["All", ...STATUS_FILTERS].map((sf, i) => (
          <FilterButton
            key={sf + i}
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
            Loading Grants...
          </span>
        </div>
      )}

      {props.error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 mt-4">
          <p className="text-sm text-destructive">Failed to load Grants!</p>
        </div>
      )}

      {search !== "" && filteredGrants.length === 0 && !props.isLoading && (
        <p className="text-center py-8 text-muted-foreground text-sm">
          Unable to fetch grants!
        </p>
      )}

      {filteredGrants.length > 0 && (
        <div className="my-8">
          <div className="flex flex-row gap-2 flex-wrap mt-3">
            {[...CATEGORY_FILTER, "All"].sort().map((cf, i) => (
              <FilterButton
                key={cf + i}
                search={cf}
                filter={categoryFilter}
                onClick={setCategoryFilter}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className={`max-h-[640px] ${filteredGrants && filteredGrants.length < 5 ? "overscroll-none" : "overflow-y-scroll"}`}
      >
        <div className="mt-4 grid gap-3 sm:grid-cols-2 ">
          {filteredGrants.map((grant, i) => (
            <GrantCard key={grant.id} grant={grant} index={i} />
          ))}
        </div>
      </div>

      {search !== "" && filteredGrants.length === 0 && !props.isLoading && (
        <p className="text-center py-8 text-muted-foreground text-sm">
          No Grant(s) match your search!
        </p>
      )}
    </section>
  );
}

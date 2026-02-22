import { getZCGrantsData } from "@/app/actions/google-sheets.action";
import { Coins, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Grant, MilestoneStatus } from "../types/grants";
import { GrantCard } from "./grants/GrantCard";
import { SearchFilter } from "./SearchFilter";

export function GrantList() {
  const [search, setSearch] = useState("");
  const [grants, setGrants] = useState<Grant[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const CATEGORY_FILTER = grants
    .map((d) => d.category)
    .filter((c, i, arr) => arr.indexOf(c) === i);

  const STATUS_FILTERS: MilestoneStatus[] = [
    "Completed",
    "In progress",
    "Pending",
  ]; //TODO: Sort this from live data

  const filteredGrants = useMemo(() => {
    if (!grants) return [];

    return grants.filter((grant) => {
      const matchesSearch =
        grant.grantee.toLowerCase().includes(search.toLowerCase()) ||
        grant.project.includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        grant.summary.overallStatus
          .toLowerCase()
          .includes(statusFilter.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        grant.category.toLowerCase().includes(categoryFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [grants, search, statusFilter, categoryFilter]);

  useEffect(() => {
    const handleFetchZCGrants = async () => {
      setIsLoading(true);

      try {
        const data = await getZCGrantsData();
        if (data) {
          console.log(data);
          setGrants(data);
        }
      } catch (err: any) {
        console.error("AppError:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    handleFetchZCGrants();
  }, []);

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Grants & Funding
        </h2>
        <span className="text-xs text-muted-foreground ml-1">
          ({grants.length})
        </span>
      </div>
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search grants..."
      >
        {["All", ...STATUS_FILTERS].map((sf) => (
          <button
            key={sf}
            onClick={() => setStatusFilter(sf)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              statusFilter === sf
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {sf}
          </button>
        ))}
      </SearchFilter>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground text-sm">
            Loading Grants...
          </span>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 mt-4">
          <p className="text-sm text-destructive">Failed to load Grants!</p>
        </div>
      )}

      {search !== "" && filteredGrants.length === 0 && !isLoading && (
        <p className="text-center py-8 text-muted-foreground text-sm">
          Unable to fetch grants!
        </p>
      )}

      {filteredGrants.length > 0 && (
        <div>
          <ul className="flex flex-row gap-2 flex-wrap mt-3">
            {[...CATEGORY_FILTER, "All"].sort().map((cf) => (
              <li key={cf}>
                <button
                  onClick={() => setCategoryFilter(cf)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors  ${
                    categoryFilter === cf
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {cf}
                </button>
              </li>
            ))}
          </ul>
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

      {search !== "" && filteredGrants.length === 0 && !isLoading && (
        <p className="text-center py-8 text-muted-foreground text-sm">
          No Grant(s) match your search!
        </p>
      )}
    </section>
  );
}

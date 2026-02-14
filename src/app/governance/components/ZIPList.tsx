import { FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { useZIPs } from "../hooks/use-zips";
import { SearchFilter } from "./SearchFilter";

const STATUS_FILTERS = ["All", "Active", "Final", "Draft", "Withdrawn"];

export function ZIPList() {
  const { data: zips, isLoading, error } = useZIPs();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    if (!zips) return [];

    return zips.filter((zip) => {
      const matchesSearch =
        zip.title.toLowerCase().includes(search.toLowerCase()) ||
        zip.zipNumber.includes(search) ||
        zip.authors?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        zip.status.toLowerCase().includes(statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  }, [zips, search, statusFilter]);

  return (
    <section className="">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Zcash Improvement Proposals
        </h2>
        {zips && (
          <span className="text-xs to-muted-foreground ml-1">
            ({filtered.length})
          </span>
        )}

        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          placeholder="Search ZIPS by number, title or author..."
        ></SearchFilter>
      </div>
    </section>
  );
}

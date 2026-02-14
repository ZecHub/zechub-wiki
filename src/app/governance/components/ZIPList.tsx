import { useMemo, useState } from "react";
import { useZIPs } from "../hooks/use-zips";

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


}

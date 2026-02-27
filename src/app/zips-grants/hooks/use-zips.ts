import { useQuery } from "@tanstack/react-query";
import { fetchZIPs, ZIPData } from "../lib/github";

export function useZIPs() {
  return useQuery<ZIPData[]>({
    queryKey: ["zcash-zips"],
    queryFn: fetchZIPs,
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
}

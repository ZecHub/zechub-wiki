import { Issuance } from "@/lib/chart/types";
import { useEffect, useState } from "react";

export const useIssuanceData = (url: string) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((raw) => {
        const parsed = raw
          .filter((_, i: number) => i % 7 === 0) // weekly sampling
          .map((d: Issuance) => ({
            date: d.Date.split(" ")[0],
            issuance: parseFloat(d["ZEC Issuance"]),
            inflation: parseFloat(d["Current Inflation (%)"]),
          }));

        setData(parsed);
      });
  }, []);

  return data;
};

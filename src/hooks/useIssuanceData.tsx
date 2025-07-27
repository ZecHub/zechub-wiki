import { Issuance } from "@/lib/chart/types";
import { useEffect, useState } from "react";

export const useIssuanceData = (url: string) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((raw) => {
        const parsed = raw
          .filter((_: any, i: number) => i % 7 === 0) // weekly sampling
          .map((d: Issuance) => ({
            date: d.Date.split(" ")[0],
            issuance: parseFloat(d["ZEC Issuance"]),
            inflation: parseFloat(d["Current Inflation (%)"]),
          }));

        setData(parsed);
        setLoading(false);
      });
  }, []);

  return {data, loading};
};

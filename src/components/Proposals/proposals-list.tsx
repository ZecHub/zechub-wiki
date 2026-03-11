"use client";

import { ProposalsListClient } from "@/components/Proposals/proposals-list-client";
import type { DaoJsonSchema } from "@/components/Proposals/proposals-list-client";
import { useState, useEffect } from "react";
import { DATA_URL } from "@/lib/chart/data-url";
import "./index.css";

export function ProposalsList() {
  const [daoData, setDaoData] = useState<DaoJsonSchema | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const res = await fetch(DATA_URL.daoProps, {
          signal: controller.signal,
        });
        const json: DaoJsonSchema = await res.json();
        setDaoData(json);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching DAO data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading || !daoData) return null;

  return <ProposalsListClient proposals={daoData} />;
}

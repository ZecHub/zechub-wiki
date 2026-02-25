"use client";

import { ProposalsListClient } from "@/components/Proposals/proposals-list-client";
import { DaoProps } from "@/lib/chart/types";
import { getDaoProps } from "@/lib/chart/helpers";
import { useState, useEffect } from "react";
import { DATA_URL } from "@/lib/chart/data-url";
import "./index.css";

export function ProposalsList() {
  const [daoProps, setDaoProps] = useState<DaoProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [blockFeesData] = await Promise.all([
          getDaoProps(DATA_URL.daoProps, controller.signal),
        ]);

        if (blockFeesData) {
          setDaoProps(blockFeesData);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    return () => {
      controller.abort();
    };
  }, []);

  return <ProposalsListClient proposals={daoProps} />;
}

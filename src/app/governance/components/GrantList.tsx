import { getZCGrantsData } from "@/app/actions/google-sheets.action";
import { Coins, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Grant, MilestoneStatus } from "../types/grants";
import { GrantCard } from "./grants/GrantCard";
import { SearchFilter } from "./SearchFilter";

const data = [
  {
    id: "2-years-of-lightwalletd-infra-hosting-&-maintenance::nighthawk",
    project: "2 years of Lightwalletd Infra hosting & maintenance",
    grantee: "NightHawk",
    category: "Infrastructure",
    reportingFrequency: "NA",
    milestones: [
      {
        number: 1,
        amountUSD: 10440,
        estimateUSD: null,
        status: "Completed",
        paidOutDate: " 10 Feb 2021",
        usdDisbursed: null,
        zecDisbursed: 96.9180354,
        zecUsdRate: 107.72,
      },
      {
        number: 2,
        amountUSD: 10440,
        estimateUSD: null,
        status: "Completed",
        paidOutDate: " 2 Mar 2021",
        usdDisbursed: null,
        zecDisbursed: 86.4239411,
        zecUsdRate: 120.8,
      },
      {
        number: 3,
        amountUSD: 13920,
        estimateUSD: null,
        status: "Completed",
        paidOutDate: " 21 Dec 2021",
        usdDisbursed: null,
        zecDisbursed: 87.8401697,
        zecUsdRate: 158.47,
      },
    ],
    summary: {
      totalMilestones: 3,
      completedMilestones: 3,
      totalUsdDisbursed: 0,
      totalAmountUSD: 34800,
      totalZecDisbursed: 271.1821462,
      completedPercent: 100,
      overallStatus: "Completed",
    },
  },
  {
    id: "moeda.casa---smart-brazilian-fiat-to-crypto-over-zcash::moeda.casa",
    project: "Moeda.casa - Smart Brazilian Fiat-to-Crypto over Zcash",
    grantee: "Moeda.casa",
    category: "Integration",
    reportingFrequency: "NA",
    milestones: [
      {
        number: 1,
        amountUSD: 6950,
        estimateUSD: null,
        status: "Completed",
        paidOutDate: " 26 Jan 2021",
        usdDisbursed: null,
        zecDisbursed: 80.7764831,
        zecUsdRate: 86.04,
      },
    ],
    summary: {
      totalMilestones: 1,
      completedMilestones: 1,
      totalUsdDisbursed: 0,
      totalAmountUSD: 6950,
      totalZecDisbursed: 80.7764831,
      completedPercent: 100,
      overallStatus: "Completed",
    },
  },
  {
    id: "zecwallet-infra-costs::zecwallet",
    project: "Zecwallet Infra costs",
    grantee: "ZecWallet",
    category: "Infrastructure",
    reportingFrequency: "NA",
    milestones: [
      {
        number: 1,
        amountUSD: 9750,
        estimateUSD: null,
        status: "Completed",
        paidOutDate: " 16 Feb 2021",
        usdDisbursed: null,
        zecDisbursed: 58.0461797,
        zecUsdRate: 167.97,
      },
      {
        number: 2,
        amountUSD: 9750,
        estimateUSD: null,
        status: "Completed",
        paidOutDate: " 24 Feb 2021",
        usdDisbursed: null,
        zecDisbursed: 76.4946865,
        zecUsdRate: 127.46,
      },
    ],
    summary: {
      totalMilestones: 2,
      completedMilestones: 2,
      totalUsdDisbursed: 0,
      totalAmountUSD: 19500,
      totalZecDisbursed: 134.5408662,
      completedPercent: 100,
      overallStatus: "Completed",
    },
  },
  {
    id: "zcashzeal::zcashzeal",
    project: "ZcashZeal",
    grantee: "ZcashZeal",
    category: "Community",
    reportingFrequency: "NA",
    milestones: [
      {
        number: 1,
        amountUSD: 2754,
        estimateUSD: null,
        status: "In progress",
        paidOutDate: " 22 Feb 2021",
        usdDisbursed: null,
        zecDisbursed: 15.3230845,
        zecUsdRate: 179.73,
      },
      {
        number: 2,
        amountUSD: null,
        estimateUSD: null,
        status: "In progress",
        paidOutDate: null,
        usdDisbursed: null,
        zecDisbursed: null,
        zecUsdRate: null,
      },
      {
        number: 3,
        amountUSD: null,
        estimateUSD: null,
        status: "In progress",
        paidOutDate: null,
        usdDisbursed: null,
        zecDisbursed: null,
        zecUsdRate: null,
      },
      {
        number: 4,
        amountUSD: null,
        estimateUSD: null,
        status: "In progress",
        paidOutDate: null,
        usdDisbursed: null,
        zecDisbursed: null,
        zecUsdRate: null,
      },
    ],
    summary: {
      totalMilestones: 4,
      completedMilestones: 0,
      totalUsdDisbursed: 0,
      totalAmountUSD: 2754,
      totalZecDisbursed: 15.3230845,
      completedPercent: 0,
      overallStatus: "Pending",
    },
  },
] as Grant[];

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
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
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

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {filteredGrants.map((grant, i) => (
          <GrantCard key={grant.id} grant={grant} index={i} />
        ))}
      </div>

      {search !== "" && filteredGrants.length === 0 && !isLoading && (
        <p className="text-center py-8 text-muted-foreground text-sm">
          No Grant(s) match your search!
        </p>
      )}
    </section>
  );
}

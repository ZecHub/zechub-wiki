import { getZCGrantsData } from "@/app/actions/google-sheets.action";
import { Coins, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Grant } from "../types/grants";
import { GrantCard } from "./grants/GrantCard";
import { SearchFilter } from "./SearchFilter";
import { StatusBadge } from "./StatusBadge";

export type GrantStatus2 = "funded" | "in-progress" | "completed" | "proposed";
const CATEGORY_FILTER2 = [
  "All",
  "Wallets",
  "Infrastructure",
  "Protocol",
  "Education",
  "Security",
];

export interface Grant2 {
  id: string;
  title: string;
  organization: string;
  status: GrantStatus;
  amount: string;
  description: string;
  category: string;
  date: string;
  link?: string;
}

export const curatedGrants: Grant2[] = [
  {
    id: "g1",
    title: "Zcash Wallet Community Developer",
    organization: "Zcash Community Grants",
    status: "funded",
    amount: "$150,000",
    description:
      "Development and maintenance of open-source Zcash wallet software for multiple platforms.",
    category: "Wallets",
    date: "2025-01",
    link: "https://zcashcommunitygrants.org/",
  },
  {
    id: "g2",
    title: "Zebra Node Implementation",
    organization: "Zcash Foundation",
    status: "completed",
    amount: "$500,000",
    description:
      "An independent Zcash node implementation written in Rust for improved network diversity.",
    category: "Infrastructure",
    date: "2024-06",
    link: "https://github.com/ZcashFoundation/zebra",
  },
  {
    id: "g3",
    title: "Zcash Shielded Assets (ZSA)",
    organization: "QEDIT",
    status: "in-progress",
    amount: "$700,000",
    description:
      "Enable custom asset issuance on Zcash with full shielded privacy for tokens.",
    category: "Protocol",
    date: "2024-09",
  },
];

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

const CATEGORY_FILTER = data
  .map((d) => d.category)
  .filter((c, i, arr) => arr.indexOf(c) === i);

export type GrantStatus = "funded" | "in-progress" | "completed" | "proposed";

export function GrantList() {
  const [search, setSearch] = useState("");
  const [grants, setGrants] = useState<Grant[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredGrants = useMemo(() => {
    if (!data) return [];

    return data.filter((grant) => {
      const matchesSearch =
        grant.grantee.toLowerCase().includes(search.toLowerCase()) ||
        grant.project.includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        grant.summary.overallStatus
          .toLowerCase()
          .includes(statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const handleFetchZCGrants = async () => {
    try {
      const data = await getZCGrantsData();
      if (data) {
        console.log(data);
        setGrants(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setGrants(data);
  }, []);

  return (
    <section>
      <div>
        <button
          className="p-4 border border-red-400"
          onClick={handleFetchZCGrants}
        >
          Get Data
        </button>
      </div>
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
      
        <button
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize bg-primary text-primary-foreground border-primary`}
        >
          All
        </button>
        <button
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize text-muted-foreground `}
        >
          Funded
        </button>
        <button
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize text-muted-foreground `}
        >
          In Progress
        </button>
        <button
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize text-muted-foreground `}
        >
          Completed
        </button>
      </SearchFilter>

      <div>
        <ul className="flex flex-row gap-2 flex-wrap mt-3">
          {[...CATEGORY_FILTER, "All"].map((cf) => (
            <li key={cf}>
              <button
                onClick={() => {}}
                className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors`}
              >
                {cf}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {curatedGrants.map((grant, i) => (
          <div
            key={grant.id}
            className="bg-slate-200 dark:bg-slate-800 rounded-lg border border-border p-5 hover:border-primary/40 hover:glow-zcash transition-all animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-semibold text-foreground leading-tight">
                {grant.title}
              </h3>
              <StatusBadge status={grant.status} />
            </div>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {grant.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-primary">
                  {grant.amount}
                </span>
                <span className="text-sm text-muted-foreground">
                  {grant.organization}
                </span>
              </div>
              {grant.link && (
                <a
                  href={grant.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {grant.category}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {grant.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {filteredGrants.map((grant, i) => (
          <GrantCard key={grant.id} grant={grant} index={i} />
        ))}
      </div>
    </section>
  );
}

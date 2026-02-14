import { Coins, ExternalLink } from "lucide-react";
import { useState } from "react";
import { SearchFilter } from "./SearchFilter";
import { StatusBadge } from "./StatusBadge";

export type GrantStatus = "funded" | "in-progress" | "completed" | "proposed";
const CATEGORY_FILTER = [
  "All",
  "Wallets",
  "Infrastructure",
  "Protocol",
  "Education",
  "Security",
];

export interface Grant {
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

export const curatedGrants: Grant[] = [
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

export function GrantList() {
  const [search, setSearch] = useState("");

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Grants & Funding
        </h2>
        <span className="text-xs text-muted-foreground ml-1">
          ({curatedGrants.length})
        </span>
      </div>
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search grants..."
      ></SearchFilter>

      <div>
        <ul className="flex flex-row gap-2 flex-wrap mt-3">
          {CATEGORY_FILTER.map((cf) => (
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
              <span className="text-[10px] text-muted-foreground">{grant.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

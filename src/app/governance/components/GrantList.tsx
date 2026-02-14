import { Coins } from "lucide-react";
import { useState } from "react";
import { SearchFilter } from "./SearchFilter";

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

 
    </section>
  );
}

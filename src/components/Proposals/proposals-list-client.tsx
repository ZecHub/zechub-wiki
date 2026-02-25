"use client";

import { useState, useMemo } from "react";
import { ProposalCard } from "@/components/Proposals/proposal-card";
import { AnalyticsDashboard } from "@/components/Proposals/analytics-dashboard";
import { cn } from "@/lib/util";
import { Search, X } from "lucide-react";
import { DaoProps } from "@/lib/chart/types";

const STATUS_FILTERS = ["All", "Executed", "Passed", "Rejected"] as const;
const TOP_TABS = ["Proposals", "Charts"] as const;

interface ProposalsListClientProps {
  proposals: DaoProps[];
}

export function ProposalsListClient({ proposals }: ProposalsListClientProps) {
  const [topTab, setTopTab] = useState<(typeof TOP_TABS)[number]>("Proposals");
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = proposals;

    // Filter by status
    if (filter !== "All") {
      list = list.filter(
        (p) => p.proposal.status.toLowerCase() === filter.toLowerCase(),
      );
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.proposal.proposer.toLowerCase().includes(q) ||
          p.coreAddress.toLowerCase().includes(q) ||
          p.proposalModuleAddress.toLowerCase().includes(q) ||
          p.proposal.title.toLowerCase().includes(q),
      );
    }

    // Filter out entries without 'votes' attribute
    list = list.filter(
      (p) =>
        p.proposal.votes.yes &&
        p.proposal.votes.no &&
        p.proposal.votes.abstain !== undefined,
    );

    return list;
  }, [filter, search, proposals]);

  const totalVotingPower = proposals.reduce(
    (acc, p) => acc + parseInt(p.proposal.total_power, 10),
    0,
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="mt-12">
          <h1 className="text-3xl font-bold text-foreground">DAO Governance</h1>
          <p className="text-muted-foreground">
            {proposals.length} proposals &middot; {totalVotingPower} cumulative
            voting power
          </p>
        </div>
      </div>

      {/* Top-level tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {TOP_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setTopTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              topTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {topTab === "Charts" && <AnalyticsDashboard proposals={proposals} />}

      {topTab === "Proposals" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-medium text-foreground">Proposals</h2>
            <div className="flex items-center gap-1">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                    filter === s
                      ? "bg-slate-300 dark:bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by juno address, title..."
              className="w-full bg-secondary rounded-lg border border-border pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-sm bg-vote-yes" />
              Yes
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-sm bg-vote-no" />
              No
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-sm bg-vote-abstain" />
              Abstain
            </span>
            {search && (
              <span className="ml-auto text-primary">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm rounded-lg border border-border bg-card">
                {search
                  ? `No proposals match "${search}"`
                  : "No proposals match this filter."}
              </div>
            ) : (
              filtered.map((p) => (
                <ProposalCard key={`${p.id}-${p.createdAt}`} data={p} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

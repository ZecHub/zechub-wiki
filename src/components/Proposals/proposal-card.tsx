"use client";

import { useState } from "react";
import { DaoProps } from "@/lib/chart/types";
import { VoteTally } from "@/components/Proposals/vote-tally";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/util";

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    executed: {
      label: "Executed",
      className: "bg-vote-yes/10 text-vote-yes",
    },
    passed: {
      label: "Passed",
      className: "bg-vote-yes/10 text-vote-yes",
    },
    rejected: {
      label: "Rejected",
      className: "bg-vote-no/10 text-vote-no",
    },
    open: {
      label: "Open",
      className: "bg-primary/10 text-primary",
    },
  };

  const c = config[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ${c.className}`}
    >
      {c.label}
    </span>
  );
}

function truncateAddress(addr: string) {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 10)}...${addr.slice(-4)}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getQuorumPercent(proposal: DaoProps["proposal"]) {
  const yes = parseInt(proposal.votes.yes, 10);
  const no = parseInt(proposal.votes.no, 10);
  const abstain = parseInt(proposal.votes.abstain, 10);
  const total = parseInt(proposal.total_power, 10);
  if (total === 0) return 0;
  return Math.round(((yes + no + abstain) / total) * 100);
}

export function ProposalCard({ data }: { data: DaoProps }) {
  const [expanded, setExpanded] = useState(false);
  const { proposal } = data;
  const quorum = getQuorumPercent(proposal);

  return (
    <div
      className="group border border-border rounded-lg bg-card transition-colors hover:border-primary/30 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setExpanded(!expanded);
        }
      }}
      aria-expanded={expanded}
    >
      {/* Compact row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Proposal # */}
        <span className="text-sm font-mono text-muted-foreground w-7 shrink-0">
          #{data.id}
        </span>

        {/* Title + status */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <h3 className="text-md font-medium text-card-foreground truncate">
            {proposal.title}
          </h3>
          <StatusBadge status={proposal.status} />
        </div>

        {/* Vote numbers */}
        <VoteTally
          yes={parseInt(proposal.votes.yes, 10)}
          no={parseInt(proposal.votes.no, 10)}
          abstain={parseInt(proposal.votes.abstain, 10)}
        />

        {/* Expand icon */}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span>
              Proposer:{" "}
              <span className="font-mono text-accent-background">
                {truncateAddress(proposal.proposer)}
              </span>
            </span>
            <span>
              Created:{" "}
              <span className="text-accent-background">
                {formatDate(data.createdAt)}
              </span>
            </span>
            {data.completedAt && (
              <span>
                Completed:{" "}
                <span className="text-accent-background">
                  {formatDate(data.completedAt)}
                </span>
              </span>
            )}
            <span>
              Quorum:{" "}
              <span className="text-accent-background font-medium">
                {quorum}%
              </span>
            </span>
            <span>
              Threshold:{" "}
              <span className="text-accent-background font-medium">
                {Math.round(
                  parseFloat(
                    proposal.threshold.threshold_quorum.threshold.percent,
                  ) * 100,
                )}
                %
              </span>
            </span>
            {proposal.allow_revoting && (
              <span className="text-primary/70">Revoting allowed</span>
            )}
          </div>

          {/* Description */}
          <p className="text-md text-muted-foreground leading-relaxed whitespace-pre-line">
            {proposal.description.length > 280
              ? proposal.description.slice(0, 280) + "..."
              : proposal.description}
          </p>

          {/* Turnout bar */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Turnout</span>
            <div className="flex-1 h-1 rounded-full bg-slate-300 dark:bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-yellow-500 dark:bg-primary/60 transition-all"
                style={{ width: `${quorum}%` }}
              />
            </div>
            <span className="text-sm font-mono text-muted-foreground">
              {quorum}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

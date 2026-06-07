"use client";

import { useState } from "react";
import type { FlatProposal } from "@/components/Proposals/proposals-list-client";
import { VoteTally } from "@/components/Proposals/vote-tally";
import { ChevronDown, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/util";

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    executed: { label: "Executed", className: "bg-vote-yes/10 text-vote-yes" },
    passed: { label: "Passed", className: "bg-vote-yes/10 text-vote-yes" },
    rejected: { label: "Rejected", className: "bg-vote-no/10 text-vote-no" },
    closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
    open: { label: "Open", className: "bg-primary/10 text-primary" },
  };
  const c = config[status.toLowerCase()] ?? {
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

function getQuorumPercent(p: FlatProposal["proposal"]) {
  const yes = parseInt(p.votes.yes, 10);
  const no = parseInt(p.votes.no, 10);
  const abstain = parseInt(p.votes.abstain, 10);
  const total = parseInt(p.total_power, 10);
  if (total === 0) return 0;
  return Math.round(((yes + no + abstain) / total) * 100);
}

// ── NEW: Calculate if proposal passed quorum + threshold ───────────────────
function getProposalOutcome(proposal: FlatProposal["proposal"]) {
  const yes = parseInt(proposal.votes?.yes || "0", 10);
  const no = parseInt(proposal.votes?.no || "0", 10);
  const abstain = parseInt(proposal.votes?.abstain || "0", 10);
  const totalPower = parseInt(proposal.total_power || "0", 10);

  if (totalPower === 0) {
    return { label: "Unknown", icon: null, color: "text-muted-foreground" };
  }

  const participation = (yes + no + abstain) / totalPower;
  const approvalRate = (yes + no + abstain) > 0 
    ? yes / (yes + no + abstain) 
    : 0;

  const requiredQuorum = parseFloat(
    proposal.threshold?.threshold_quorum?.quorum?.percent || "0"
  );
  const requiredThreshold = parseFloat(
    proposal.threshold?.threshold_quorum?.threshold?.percent || "0"
  );

  const passedQuorum = participation >= requiredQuorum;
  const passedThreshold = approvalRate >= requiredThreshold;

  if (proposal.status.toLowerCase() === "open") {
    return { label: "Voting Open", icon: Clock, color: "text-primary" };
  }

  if (passedQuorum && passedThreshold) {
    return { label: "Passed", icon: CheckCircle, color: "text-vote-yes" };
  } else if (!passedQuorum) {
    return { label: "Failed Quorum", icon: XCircle, color: "text-vote-no" };
  } else {
    return { label: "Failed Threshold", icon: AlertTriangle, color: "text-orange-400" };
  }
}

export function ProposalCard({ data }: { data: FlatProposal }) {
  const [expanded, setExpanded] = useState(false);
  const { proposal } = data;
  const quorum = getQuorumPercent(proposal);
  const outcome = getProposalOutcome(proposal);

  const yes = parseInt(proposal.votes.yes, 10);
  const no = parseInt(proposal.votes.no, 10);
  const abstain = parseInt(proposal.votes.abstain, 10);
  const totalPower = parseInt(proposal.total_power, 10);

  // Threshold display
  const thresholdPct = proposal.threshold?.threshold_quorum?.threshold?.percent
    ? Math.round(
        parseFloat(proposal.threshold.threshold_quorum.threshold.percent) * 100,
      )
    : null;

  const OutcomeIcon = outcome.icon;

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
        <span className="text-sm font-mono text-muted-foreground w-7 shrink-0">
          #{proposal.id}
        </span>

        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <h3 className="text-md font-medium text-card-foreground truncate">
            {proposal.title}
          </h3>
          <StatusBadge status={proposal.status} />

          {/* NEW: Outcome indicator with icon */}
          {OutcomeIcon && (
            <div className={`flex items-center gap-1 text-xs font-medium ${outcome.color}`}>
              <OutcomeIcon className="h-3.5 w-3.5" />
              <span>{outcome.label}</span>
            </div>
          )}
        </div>

        <VoteTally
          yes={yes}
          no={no}
          abstain={abstain}
        />

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
            {thresholdPct !== null && (
              <span>
                Threshold:{" "}
                <span className="text-accent-background font-medium">
                  {thresholdPct}%
                </span>
              </span>
            )}
            {proposal.allow_revoting && (
              <span className="text-primary/70">Revoting allowed</span>
            )}
          </div>

          <p className="text-md text-muted-foreground leading-relaxed whitespace-pre-line">
            {proposal.description.length > 280
              ? proposal.description.slice(0, 280) + "..."
              : proposal.description}
          </p>

          {/* Participation bar */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Participation</span>
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
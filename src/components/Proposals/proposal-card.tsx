"use client";

import { useState } from "react";
import type { FlatProposal } from "@/components/Proposals/proposals-list-client";
import { VoteTally } from "@/components/Proposals/vote-tally";
import { ChevronDown, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/util";

function StatusBadge({ status, className }: { status: string; className?: string }) {
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
      className={cn(
        `inline-flex items-center rounded-full px-1.5 py-px text-[8px] font-medium uppercase tracking-wider sm:px-2 sm:py-0.5 sm:text-[10px] ${c.className}`,
        className
      )}
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

function getProposalOutcome(proposal: FlatProposal["proposal"]) {
  const yes = parseInt(proposal.votes?.yes || "0", 10);
  const no = parseInt(proposal.votes?.no || "0", 10);
  const abstain = parseInt(proposal.votes?.abstain || "0", 10);
  const totalPower = parseInt(proposal.total_power || "0", 10);
  if (totalPower === 0) {
    return { label: "Unknown", icon: null, color: "text-muted-foreground" };
  }
  const participation = (yes + no + abstain) / totalPower;
  const approvalRate = (yes + no + abstain) > 0 ? yes / (yes + no + abstain) : 0;
  const requiredQuorum = parseFloat(proposal.threshold?.threshold_quorum?.quorum?.percent || "0");
  const requiredThreshold = parseFloat(proposal.threshold?.threshold_quorum?.threshold?.percent || "0");
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

  const thresholdPct = proposal.threshold?.threshold_quorum?.threshold?.percent
    ? Math.round(parseFloat(proposal.threshold.threshold_quorum.threshold.percent) * 100)
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
      {/* Compact header */}
      <div className="px-3 py-2.5">
        {/* Top row: # + Title (wraps to 2 lines on mobile) */}
        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0 text-[9px] font-mono text-muted-foreground">
            #{proposal.id}
          </span>
          <h3 className="flex-1 text-sm font-medium leading-snug text-card-foreground line-clamp-2">
            {proposal.title}
          </h3>
          <ChevronDown
            className={cn(
              "mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </div>

        {/* Bottom row: Status + Outcome + Votes */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <StatusBadge status={proposal.status} className="shrink-0" />

          {OutcomeIcon && (
            <div className={`flex shrink-0 items-center gap-1 text-[8px] font-medium whitespace-nowrap sm:text-[10px] ${outcome.color}`}>
              <OutcomeIcon className="h-2.5 w-2.5" />
              <span>{outcome.label}</span>
            </div>
          )}

          <div className="flex-1" />

          <VoteTally yes={yes} no={no} abstain={abstain} />
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span>
              Proposer: <span className="font-mono text-accent-background">{truncateAddress(proposal.proposer)}</span>
            </span>
            <span>
              Created: <span className="text-accent-background">{formatDate(data.createdAt)}</span>
            </span>
            {data.completedAt && (
              <span>
                Completed: <span className="text-accent-background">{formatDate(data.completedAt)}</span>
              </span>
            )}
            <span>
              Quorum: <span className="font-medium text-accent-background">{quorum}%</span>
            </span>
            {thresholdPct !== null && (
              <span>
                Threshold: <span className="font-medium text-accent-background">{thresholdPct}%</span>
              </span>
            )}
            {proposal.allow_revoting && <span className="text-primary/70">Revoting allowed</span>}
          </div>

          <p className="text-md leading-relaxed whitespace-pre-line text-muted-foreground">
            {proposal.description.length > 280
              ? proposal.description.slice(0, 280) + "..."
              : proposal.description}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Participation</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-300 dark:bg-muted">
              <div
                className="h-full rounded-full bg-yellow-500 transition-all dark:bg-primary/60"
                style={{ width: `${quorum}%` }}
              />
            </div>
            <span className="font-mono text-sm text-muted-foreground">{quorum}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
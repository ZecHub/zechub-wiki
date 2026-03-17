"use client";

import { useState, useMemo } from "react";
import { ProposalCard } from "@/components/Proposals/proposal-card";
import { AnalyticsDashboard } from "@/components/Proposals/analytics-dashboard";
import { cn } from "@/lib/util";
import { Search, X } from "lucide-react";
import { ipfsToHttp } from "@/lib/chart/helpers";
import TreasuryTab from "@/components/DAO/TreasuryTab";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DaoConfig {
  name: string;
  dao_uri: string | null;
  image_url: string;
  description: string;
  automatically_add_cw20s: boolean;
  automatically_add_cw721s: boolean;
}

export interface ProposalVotes {
  yes: string;
  no: string;
  abstain: string;
}

export interface ProposalThreshold {
  threshold_quorum: {
    threshold: { percent: string };
    quorum: { percent: string };
  };
}

export interface Proposal {
  id: number;
  title: string;
  description: string;
  status: string;
  proposer: string;
  votes: ProposalVotes;
  total_power: string;
  threshold: ProposalThreshold;
  allow_revoting?: boolean;
}

export interface DaoData {
  dao_address: string;
  name: string;
  description: string;
  member_count: number;
  proposal_count: number;
  config: DaoConfig;
  proposals: Proposal[];
}

export interface DaoJsonSchema {
  dao_data: DaoData;
  subdao_count: number;
  subdao_data: DaoData[];
}

// ── Flattened shape used internally by child components ───────────────────────

export interface FlatProposal {
  id: number;
  createdAt: string;
  completedAt?: string;
  coreAddress: string;
  proposalModuleAddress: string;
  daoName: string;
  proposal: Proposal;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ["All", "Executed", "Passed", "Rejected"] as const;
const TOP_TABS = ["Proposals", "Charts", "Treasury"] as const;

function flattenDao(dao: DaoData): FlatProposal[] {
  return dao.proposals
    .map((raw: any) => {
      if (raw.proposal && raw.proposal.votes !== undefined) {
        return {
          id: raw.id ?? raw.proposal.id,
          createdAt:
            raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
          completedAt: raw.completedAt ?? raw.completed_at,
          coreAddress: raw.coreAddress ?? dao.dao_address,
          proposalModuleAddress: raw.proposalModuleAddress ?? dao.dao_address,
          daoName: dao.name,
          proposal: raw.proposal,
        } as FlatProposal;
      }
      return {
        id: raw.id,
        createdAt: raw.created_at ?? new Date().toISOString(),
        completedAt: raw.completed_at,
        coreAddress: dao.dao_address,
        proposalModuleAddress: dao.dao_address,
        daoName: dao.name,
        proposal: raw,
      } as FlatProposal;
    })
    .filter(
      (p) =>
        p.proposal?.votes !== undefined &&
        p.proposal.votes?.yes !== undefined &&
        p.proposal.votes?.no !== undefined &&
        p.proposal.votes?.abstain !== undefined,
    );
}

function applyFilters(
  list: FlatProposal[],
  filter: string,
  search: string,
): FlatProposal[] {
  if (filter !== "All")
    list = list.filter(
      (p) => p.proposal.status.toLowerCase() === filter.toLowerCase(),
    );
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.proposal.proposer.toLowerCase().includes(q) ||
        p.coreAddress.toLowerCase().includes(q) ||
        p.proposal.title.toLowerCase().includes(q),
    );
  }
  return list;
}

// ── Sub-DAO grouped view ──────────────────────────────────────────────────────

function SubDaoGroup({
  dao,
  filter,
  search,
}: {
  dao: DaoData;
  filter: string;
  search: string;
}) {
  const flat = useMemo(() => flattenDao(dao).reverse(), [dao]);
  const filtered = useMemo(
    () => applyFilters(flat, filter, search),
    [flat, filter, search],
  );

  // Hide the whole group if search/filter yields nothing
  if (filtered.length === 0) return null;

  const imageUrl = dao.config?.image_url
    ? ipfsToHttp(dao.config.image_url)
    : null;
  const description = dao.config?.description || dao.description || null;

  return (
    <div className="space-y-2">
      {/* Sub-DAO header */}
      <div className="flex items-start gap-3 px-1 pt-2">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={dao.name}
            className="w-9 h-9 rounded-full object-cover border border-border shrink-0 mt-0.5"
          />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {dao.name}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {filtered.length} proposal{filtered.length !== 1 ? "s" : ""}
              {" · "}
              {dao.member_count} member{dao.member_count !== 1 ? "s" : ""}
            </span>
          </div>
          {description && (
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Proposals for this sub-DAO */}
      <div className="space-y-1.5 pl-0">
        {filtered.map((p) => (
          <ProposalCard key={`${p.id}-${p.coreAddress}`} data={p} />
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface ProposalsListClientProps {
  proposals: DaoJsonSchema;
}

export function ProposalsListClient({ proposals }: ProposalsListClientProps) {
  const { dao_data, subdao_count, subdao_data } = proposals;

  const [topTab, setTopTab] = useState<(typeof TOP_TABS)[number]>("Proposals");
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showSubDaos, setShowSubDaos] = useState(false);

  // Flatten + reverse so the most recent proposal appears first
  const primaryFlat = useMemo(() => flattenDao(dao_data).reverse(), [dao_data]);
  const subDaoFlat = useMemo(
    () => subdao_data.flatMap((sub) => flattenDao(sub).reverse()),
    [subdao_data],
  );
  const allFlat = useMemo(
    () => [...primaryFlat, ...subDaoFlat],
    [primaryFlat, subDaoFlat],
  );

  // Primary DAO filtered list (only used when showSubDaos is false)
  const filtered = useMemo(
    () => applyFilters(primaryFlat, filter, search),
    [primaryFlat, filter, search],
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mt-12 flex items-start gap-4">
        {dao_data.config.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ipfsToHttp(dao_data.config.image_url)}
            alt={dao_data.name}
            className="w-14 h-14 rounded-full object-cover mt-1 border border-border"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {dao_data.name}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {dao_data.proposal_count} proposals &middot; {dao_data.member_count}{" "}
            members
            {subdao_count > 0 && (
              <>
                {" "}
                &middot; {subdao_count} sub-DAO{subdao_count !== 1 ? "s" : ""}
              </>
            )}
          </p>
          {dao_data.description && (
            <p className="text-muted-foreground text-sm mt-1 max-w-xl line-clamp-2">
              {dao_data.description}
            </p>
          )}
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

      {/* Charts tab */}
      {topTab === "Charts" && <AnalyticsDashboard proposals={allFlat} />}

      {/* Proposals tab */}
      {topTab === "Proposals" && (
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-medium text-foreground">
                {showSubDaos
                  ? "Sub-DAO Proposals"
                  : `${dao_data.name} Proposals`}
              </h2>

              {/* Sub-DAO toggle */}
              {subdao_data.length > 0 && (
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showSubDaos}
                      onChange={(e) => setShowSubDaos(e.target.checked)}
                    />
                    <div
                      className={cn(
                        "w-8 h-4 rounded-full transition-colors",
                        showSubDaos
                          ? "bg-primary"
                          : "bg-slate-300 dark:bg-slate-600",
                      )}
                    />
                    <div
                      className={cn(
                        "absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200",
                        showSubDaos && "translate-x-4",
                      )}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Sub-DAOs
                  </span>
                </label>
              )}
            </div>

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

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by address, title, proposer..."
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

          {/* Legend */}
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
                {showSubDaos
                  ? `${subdao_data.reduce((acc, sub) => acc + applyFilters(flattenDao(sub).reverse(), filter, search).length, 0)} result(s)`
                  : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
              </span>
            )}
          </div>

          {/* ── Primary DAO proposal list ── */}
          {!showSubDaos && (
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm rounded-lg border border-border bg-card">
                  {search
                    ? `No proposals match "${search}"`
                    : "No proposals match this filter."}
                </div>
              ) : (
                filtered.map((p) => (
                  <ProposalCard key={`${p.id}-${p.coreAddress}`} data={p} />
                ))
              )}
            </div>
          )}

          {/* ── Sub-DAO grouped view ── */}
          {showSubDaos && (
            <div className="space-y-6 pt-1">
              {subdao_data.map((sub) => (
                <SubDaoGroup
                  key={sub.dao_address}
                  dao={sub}
                  filter={filter}
                  search={search}
                />
              ))}
              {/* Empty state when every group is hidden by filters */}
              {subdao_data.every(
                (sub) =>
                  applyFilters(flattenDao(sub).reverse(), filter, search)
                    .length === 0,
              ) && (
                <div className="text-center py-12 text-muted-foreground text-sm rounded-lg border border-border bg-card">
                  {search
                    ? `No sub-DAO proposals match "${search}"`
                    : "No sub-DAO proposals match this filter."}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {topTab === "Treasury" && <TreasuryTab />}
    </div>
  );
}

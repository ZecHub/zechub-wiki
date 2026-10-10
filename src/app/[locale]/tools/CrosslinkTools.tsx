"use client";

import { useState } from "react";

type Kind = "hosted" | "local" | "spec";

interface CrosslinkTool {
  group: "Watch" | "Run locally";
  title: string;
  description: string;
  url: string;
  kind: Kind;
  note?: string;
}

const BOOK = "https://shieldedlabs.github.io/crosslink_book/";

const TOOLS: CrosslinkTool[] = [
  {
    group: "Watch",
    kind: "hosted",
    title: "Staker Space",
    description:
      "Live dashboard for the current cTAZ testnet. Height, miners, solution rate, staking-day countdown, and finality. No node required.",
    note: "Independent community tool. The operator also runs a finalizer.",
    url: "https://crosslink.staker.space/",
  },
  {
    group: "Watch",
    kind: "hosted",
    title: "Holdfast",
    description:
      "Hosted Crosslink explorer. No node required.",
    note: "Independent community explorer.",
    url: "https://holdfast.crosslink.encapsulate.xyz/",
  },
  {
    group: "Watch",
    kind: "hosted",
    title: "cTAZ",
    description:
      "Crosslink v14 mining production, finalizer roster, peers, and staking-address name claims.",
    note: "Read APIs at /v14/api/miners and /v14/api/roster.",
    url: "https://ctaz.cash/",
  },
  {
    group: "Run locally",
    kind: "local",
    title: "zcash-explorer",
    description:
      "Phoenix LiveView explorer against a local Zebra or zebra-crosslink node. /live/crosslink shows activation, finality lag, the roster, and staking positions.",
    note: "crosslink branch. Plain Zebra still runs; Crosslink fields show as unavailable.",
    url: "https://github.com/dismad/zcash-explorer/tree/crosslink",
  },
  {
    group: "Run locally",
    kind: "local",
    title: "crosslink_indexer",
    description:
      "SQLite index of a Crosslink node: PoW blocks, VCrosslink bonds and unbonds, and finalizer behavior from pos.chain.",
    note: "v0.1.0. Needs a sibling monolith checkout. pos.chain handling and byte order matter.",
    url: "https://github.com/JustShieldMe/crosslink_indexer/releases/tag/v0.1.0",
  },
];

const GROUPS = ["Watch", "Run locally"] as const;

const KIND_LABEL: Record<Kind, string> = {
  hosted: "Hosted",
  local: "Local",
  spec: "Spec",
};

export default function CrosslinkTools() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("tool", "crosslink");
    url.hash = "";
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#F4B728]/15 bg-[#F4B728]/5 px-4 py-3 text-sm leading-relaxed text-zinc-600 dark:text-[#7a8a9e]">
        cTAZ testnet only. Not mainnet ZEC. Staking on this network does not
        move ZEC. Protocol reference:{" "}
        <a
          href={BOOK}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#F4B728] hover:underline"
        >
          Crosslink book
        </a>
        .
      </div>

      {GROUPS.map((group) => (
        <section key={group}>
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-[#5a6a7e]">
            {group}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TOOLS.filter((tool) => tool.group === group).map((tool) => (
              <a
                key={tool.url}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 transition-colors hover:border-[#F4B728]/40 dark:border-[#243040] dark:bg-[#0f1720] dark:hover:border-[#F4B728]/30"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-[#e8eef5]">
                    {tool.title}
                  </span>
                  <span className="shrink-0 rounded border border-[#F4B728]/20 bg-[#F4B728]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#F4B728]">
                    {KIND_LABEL[tool.kind]}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-[#7a8a9e]">
                  {tool.description}
                </p>
                {tool.note && (
                  <p className="mt-2 text-[12px] leading-relaxed text-zinc-400 dark:text-[#5a6a7e]">
                    {tool.note}
                  </p>
                )}
                <span className="mt-3 text-[12px] font-semibold text-[#F4B728] group-hover:underline">
                  Open
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 dark:border-[#1e2d3d] sm:flex-row sm:items-center sm:justify-between">
        <a
          href={BOOK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-[#F4B728] hover:underline"
        >
          Shielded Labs Crosslink book
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="w-fit rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-semibold text-zinc-600 transition-colors hover:border-[#F4B728]/40 hover:text-zinc-900 dark:border-[#243040] dark:text-[#7a8a9e] dark:hover:text-[#e8eef5]"
        >
          {copied ? "Link copied" : "Copy share link"}
        </button>
      </div>
    </div>
  );
}

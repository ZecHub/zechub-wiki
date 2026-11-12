"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, ThumbsDown, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "Zcash Developer Resources",
  url: "https://zechub.wiki/using-zcash/blockchain-explorers",
});

type Resource = {
  title: string;
  description: string;
  url: string;
};

type ResourceGroup = { label: string; indexes: number[] };

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      title={resource.description}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-4 no-underline transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40"
    >
      <span className="flex items-start justify-between gap-2 font-semibold text-foreground">
        {resource.title}
        <ArrowUpRight
          aria-hidden="true"
          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand dark:group-hover:text-brand-soft"
        />
      </span>
      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {resource.description}
      </p>
    </a>
  );
}

function ResourcePanel({
  resources,
  groups,
}: {
  resources: Resource[];
  groups: ResourceGroup[];
}) {
  return (
    <div className="space-y-10">
      {groups.map((g) => {
        const items = g.indexes
          .map((i) => resources[i])
          .filter((r): r is Resource => Boolean(r));
        if (!items.length) return null;
        return (
          <div key={g.label}>
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand dark:text-brand-soft">
              {g.label}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((r) => (
                <ResourceCard key={`${r.title}-${r.url}`} resource={r} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DeveloperPage() {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isHelpful, setIsHelpful] = useState(false);
  const [tab, setTab] = useState(0);
  const { t } = useLanguage();

  const handleFeedback = (helpful: boolean) => {
    setIsHelpful(helpful);
    setFeedbackSubmitted(true);
  };

  const cardsConfig = [
    {
      title:
        t?.pages?.developers?.cards?.learnTitle ?? "Learn Zcash Development",
      content:
        t?.pages?.developers?.cards?.learnContent ??
        "Explore the official documentation and learn the basics of Zcash technology.",
      url: "https://zcash.readthedocs.io/",
      blank: true,
      svg: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      buttonText: t?.pages?.developers?.cards?.learnButton ?? "Read the Docs",
    },
    {
      title:
        t?.pages?.developers?.cards?.tutorialsTitle ??
        "Learn Through Tutorials",
      content:
        t?.pages?.developers?.cards?.tutorialsContent ??
        "Follow step-by-step tutorials to build on Zcash, from creating wallets to integrating Zcash into your applications.",
      url: "/zechub-tutorial",
      blank: true,
      svg: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      buttonText:
        t?.pages?.developers?.cards?.tutorialsButton ?? "View Tutorials",
    },
    {
      title:
        t?.pages?.developers?.cards?.quickStartTitle ?? "Quick Start Guide",
      content:
        t?.pages?.developers?.cards?.quickStartContent ??
        "Get up and running with Zcash development quickly. Learn installation, configuration, and basic operations.",
      url: "/developers/quick-start",
      blank: false,
      svg: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      buttonText:
        t?.pages?.developers?.cards?.quickStartButton ?? "Quick Start Guide",
    },
  ];

  const introductions: Resource[] = [
    {
      title:
        t?.pages?.developers?.introLinks?.introToZcash ?? "Intro to Zcash",
      description:
        t?.pages?.developers?.introLinks?.introToZcashDesc ??
        "Learn about Zcash, its history, and its core principles.",
      url: "https://zechub.wiki/start-here/what-is-zec-and-zcash#content",
    },
    {
      title: t?.pages?.developers?.introLinks?.introToZec ?? "Intro to ZEC",
      description:
        t?.pages?.developers?.introLinks?.introToZecDesc ??
        "Discover the use cases and benefits of ZEC, Zcash's native cryptocurrency.",
      url: "https://zechub.wiki/start-here/zec-use-cases#content",
    },
    {
      title:
        t?.pages?.developers?.advancedLinks?.introToStack ??
        "Intro to the Stack",
      description:
        t?.pages?.developers?.advancedLinks?.introToStackDesc ??
        "Understand the architecture and components of the Zcash software stack.",
      url: "https://zcash.readthedocs.io/en/latest/rtd_pages/librustzcash_arch.html",
    },
    {
      title:
        t?.pages?.developers?.introLinks?.introToZebra ?? "Intro to Zebra",
      description:
        t?.pages?.developers?.introLinks?.introToZebraDesc ??
        "Understand how Zebra powers the Zcash network as a modular, secure Rust implementation.",
      url: "https://zebra.zfnd.org/",
    },
    {
      title: t?.pages?.developers?.introLinks?.zecd ?? "zecd",
      description:
        t?.pages?.developers?.introLinks?.zecdDesc ??
        "Explore zecd, a shielded-first Zcash wallet server built on librustzcash and exposed through a Bitcoin Core-style RPC interface.",
      url: "https://github.com/zecrocks/zecd",
    },
    {
      title: t?.pages?.developers?.introLinks?.zecdBook ?? "The zecd Book",
      description:
        t?.pages?.developers?.introLinks?.zecdBookDesc ??
        "Read the zecd documentation for architecture, setup, configuration, deployment, and RPC usage.",
      url: "https://zecd.org/introduction.html",
    },
    {
      title:
        t?.pages?.developers?.introLinks?.introToLightwalletd ??
        "Intro to Lightwalletd",
      description:
        t?.pages?.developers?.introLinks?.introToLightwalletdDesc ??
        "Learn how lightwalletd serves compact blockchain data to Zcash light clients through gRPC.",
      url: "https://github.com/zcash/lightwalletd",
    },
    {
      title:
        t?.pages?.developers?.introLinks?.zalletBook ?? "The Zallet Book",
      description:
        t?.pages?.developers?.introLinks?.zalletBookDesc ??
        "Introduction to Zallet, a full-node Zcash wallet written in Rust and designed as a replacement for the zcashd wallet.",
      url: "https://zcash.github.io/zallet/",
    },
    {
      title:
        t?.pages?.developers?.fundamentalsLinks?.addressEncoding ??
        "Address Encoding",
      description:
        t?.pages?.developers?.fundamentalsLinks?.addressEncodingDesc ??
        "Learn how Zcash addresses and keys are encoded.",
      url: "https://zips.z.cash/protocol/protocol.pdf#5.6%20Encodings%20of%20Addresses%20and%20Keys",
    },
    {
      title:
        t?.pages?.developers?.fundamentalsLinks?.transactions ??
        "Transactions",
      description:
        t?.pages?.developers?.fundamentalsLinks?.transactionsDesc ??
        "Understand how transactions work in Zcash.",
      url: "https://zechub.wiki/using-zcash/transactions",
    },
    {
      title: t?.pages?.developers?.fundamentalsLinks?.fees ?? "Fees",
      description:
        t?.pages?.developers?.fundamentalsLinks?.feesDesc ??
        "Learn about transaction fees and how they are calculated.",
      url: "https://zips.z.cash/zip-0317",
    },
    {
      title:
        t?.pages?.developers?.fundamentalsLinks?.nodesZcashd ??
        "Nodes (zcashd)",
      description:
        t?.pages?.developers?.fundamentalsLinks?.nodesZcashdDesc ??
        "Set up and manage Zcash nodes using zcashd.",
      url: "https://zcash.github.io/zcash/",
    },
    {
      title:
        t?.pages?.developers?.fundamentalsLinks?.nodesZebrad ??
        "Nodes (zebrad)",
      description:
        t?.pages?.developers?.fundamentalsLinks?.nodesZebradDesc ??
        "Explore Zebra, the Rust implementation of a Zcash consensus node.",
      url: "https://zebra.zfnd.org/",
    },
    {
      title:
        t?.pages?.developers?.fundamentalsLinks?.lightwalletServers ??
        "Lightwallet Servers",
      description:
        t?.pages?.developers?.fundamentalsLinks?.lightwalletServersDesc ??
        "Learn about lightwalletd and the infrastructure used by Zcash light wallets.",
      url: "https://zcash.readthedocs.io/en/latest/lightwalletd/index.html",
    },
    {
      title:
        t?.pages?.developers?.fundamentalsLinks?.blockExplorers ??
        "Block Explorers",
      description:
        t?.pages?.developers?.fundamentalsLinks?.blockExplorersDesc ??
        "Explore Zcash blockchain data using open-source block explorer software.",
      url: "https://github.com/nighthawk-apps/zcash-explorer",
    },
    {
      title:
        t?.pages?.developers?.introLinks?.developerResources ??
        "Developer Resources",
      description:
        t?.pages?.developers?.introLinks?.developerResourcesDesc ??
        "Find additional links to Zcash technical documentation and developer resources.",
      url: "https://github.com/ZecHub/zechub/blob/main/site/Start_Here/Developer_Resources.md",
    },
  ];

  const sdks: Resource[] = [
    {
      title:
        t?.pages?.developers?.advancedLinks?.introToZingolib ?? "Zingolib",
      description:
        t?.pages?.developers?.advancedLinks?.introToZingolibDesc ??
        "Rust libraries and tooling for building Zcash light-wallet applications using lightwalletd.",
      url: "https://github.com/zingolabs/zingolib",
    },
    {
      title: t?.pages?.developers?.advancedLinks?.webZjs ?? "WebZjs",
      description:
        t?.pages?.developers?.advancedLinks?.webZjsDesc ??
        "A JavaScript and TypeScript library for building Zcash-enabled web applications using WebAssembly.",
      url: "https://github.com/ChainSafe/WebZjs",
    },
    {
      title:
        t?.pages?.developers?.advancedLinks?.noirWalletSdk ??
        "Noir Wallet SDK",
      description:
        t?.pages?.developers?.advancedLinks?.noirWalletSdkDesc ??
        "TypeScript SDK and example dApp for integrating Zcash applications with the Noir Wallet browser extension.",
      url: "https://github.com/NoirWallet/noir-wallet-sdk",
    },
    {
      title: "Zcash Android Wallet SDK",
      description:
        "Native Android SDK for building Zcash light-client wallet functionality, including shielded sends and receives.",
      url: "https://github.com/zcash/zcash-android-wallet-sdk",
    },
    {
      title: "Zcash JS",
      description:
        "Experimental TypeScript SDK from Zcash Labs for building Zcash applications on web, server, and mobile. Provides public and light clients, local wallets, scanning, signing, and payment recovery.",
      url: "https://zcashlabs.github.io/zcashjs/",
    },
    {
      title: "Zcash Swift Wallet SDK",
      description:
        "iOS light-client framework for integrating Zcash wallet functionality into Swift applications.",
      url: "https://github.com/zcash/zcash-swift-wallet-sdk",
    },
    {
      title: "librustzcash",
      description:
        "Core Rust crates for working with Zcash protocol data, keys, transactions, and light-client components.",
      url: "https://github.com/zcash/librustzcash",
    },
    {
      title: "Zcash Router SDK",
      description:
        "Modular TypeScript SDK for managing swaps to and from Zcash, including routing, quotes, and transaction state.",
      url: "https://github.com/nufi-official/zcash-router-sdk",
    },
    {
      title: "zaddr-wasm-parser",
      description:
        "WebAssembly utility for parsing, validating, and classifying Zcash addresses, including Unified Addresses.",
      url: "https://github.com/ruzcash/zaddr-wasm-parser",
    },
    {
      title: "Zodl Android Reference Wallet",
      description:
        "Android reference wallet implementation for Zodl and Zcash mobile development.",
      url: "https://github.com/zodl-inc/zodl-android",
    },
    {
      title: "Zodl iOS Reference Wallet",
      description:
        "iOS reference wallet implementation for Zodl and Zcash mobile development.",
      url: "https://github.com/zodl-inc/zodl-ios",
    },
    {
      title: "Nym Zcash SDK",
      description:
        "Developer documentation and tooling for routing Zcash application traffic through the Nym mixnet to improve network-level privacy and protect connection metadata.",
      url: "https://zcash-sdk.nym.com/",
    },
  ];

  const advanced: Resource[] = [
    {
      title: t?.pages?.developers?.advancedLinks?.zecDev ?? "ZecDev",
      description:
        t?.pages?.developers?.advancedLinks?.zecDevDesc ??
        "Projects, resources, and tools maintained through Zcash developer-relations work, including the community wishlist.",
      url: "https://zecdev.github.io/",
    },
    {
      title:
        t?.pages?.developers?.advancedLinks?.zcashIka ?? "zcash-ika",
      description:
        t?.pages?.developers?.advancedLinks?.zcashIkaDesc ??
        "Split-key custody for Zcash and multichain agents using 2PC-MPC, spend policies, privacy attestations, and a ZIP 244 transaction builder.",
      url: "https://github.com/Frontier-Compute/zcash-ika",
    },
    {
      title:
        t?.pages?.developers?.fundamentalsLinks?.shadeAgent ??
        "Shade Agent - Notion",
      description:
        t?.pages?.developers?.fundamentalsLinks?.shadeAgentDesc ??
        "Learn about autonomous agents on NEAR that use secure TEEs and decentralised Chain Signatures to manage assets and execute multichain transactions.",
      url: "https://fringe-brow-647.notion.site/Shade-Agents-19a09959836d8091bb8febb318cc09fd",
    },
    {
      title:
        t?.pages?.developers?.advancedLinks?.developmentGuidelines ??
        "Development Guidelines",
      description:
        t?.pages?.developers?.advancedLinks?.developmentGuidelinesDesc ??
        "Follow recommended practices for contributing to and developing Zcash software.",
      url: "https://zcash.readthedocs.io/en/latest/rtd_pages/development_guidelines.html",
    },
    {
      title:
        t?.pages?.developers?.advancedLinks?.arboristCalls ??
        "Arborist Calls Page",
      description:
        t?.pages?.developers?.advancedLinks?.arboristCallsDesc ??
        "Notes from bi-weekly protocol development meetings covering deployment logistics, consensus implementations, and protocol research.",
      url: "https://github.com/ZcashCommunityGrants/arboretum-notes",
    },
    {
      title: "Zakura",
      description:
        "Open-source Zcash full node written in Rust, built for scale.",
      url: "https://github.com/zakura-core/zakura",
    },
    {
      title: "Zinder",
      description:
        "Alpha-stage open-source Zcash chain indexer: indexes the chain once from a Zebra full node and serves wallets over its native WalletQuery API and a lightwalletd-compatible mode.",
      url: "https://github.com/ZcashFoundation/zinder",
    },
    {
      title: "ZPay",
      description:
        "Open-source Zcash payments stack for agents and the services they pay, with x402 v2 and MPP wire adapters over a protocol-neutral core.",
      url: "https://github.com/gustavovalverde/zpay",
    },
    {
      title: "Ztreamer",
      description:
        "Zcash indexer and lightwallet-protocol implementation, backed by an embedded Zakura node.",
      url: "https://github.com/distractedm1nd/ztreamer",
    },
  ];

  const docTabs: { label: string; resources: Resource[]; groups: ResourceGroup[] }[] = [
    {
      label: t?.pages?.developers?.introductionsTitle ?? "Introductions",
      resources: introductions,
      groups: [
        { label: "Fundamentals", indexes: [0, 1, 2, 8, 9, 10, 15] },
        { label: "Nodes and servers", indexes: [3, 11, 12, 6, 13, 14] },
        { label: "Wallet software", indexes: [4, 5, 7] },
      ],
    },
    {
      label: "SDKs",
      resources: sdks,
      groups: [
        { label: "Core libraries", indexes: [5, 0, 10] },
        { label: "Mobile", indexes: [3, 4, 8, 9] },
        { label: "Web and JavaScript", indexes: [1, 2, 6, 7] },
      ],
    },
    {
      label: t?.pages?.developers?.advancedTitle ?? "Advanced",
      resources: advanced,
      groups: [
        { label: "Community and protocol", indexes: [0, 3, 4] },
        { label: "Agents and custody", indexes: [1, 2] },
        { label: "Reference applications", indexes: [5, 6, 7] },
      ],
    },
  ];

  const card = "rounded-xl border border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[0.03]";
  const feedbackBtn = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-brand bg-brand/10 text-brand dark:text-white"
        : "border-slate-300 text-foreground hover:border-brand/50 dark:border-white/15"
    }`;
  const discord = (
    <a
      href="https://discord.gg/zcash"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-brand underline-offset-2 hover:underline dark:text-brand-soft"
    >
      Discord
    </a>
  );

  return (
    <div className="text-foreground">
      {/* Hero */}
      <header className="border-b border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
          <p className="mb-4 font-mono text-sm font-semibold text-brand dark:text-brand-soft">
            &gt; Developers
          </p>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            {t?.pages?.developers?.heroImageAlt ?? "Zcash Developer Resources"}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A builders manual for Zcash. By builders, for builders.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 md:px-6">
        {/* Get started */}
        <section id="cardLinks" className="py-12 md:py-16">
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
            {t?.pages?.developers?.cardSectionTitle ??
              "How would you like to get started?"}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {cardsConfig.map((c) => (
              <div key={c.title} className={`${card} flex flex-col p-6`}>
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand dark:text-brand-soft">
                  {c.svg}
                </span>
                <h3 className="mb-2 text-lg font-semibold">{c.title}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {c.content}
                </p>
                <a
                  href={c.url}
                  target={c.blank ? "_blank" : "_self"}
                  rel={c.blank ? "noopener noreferrer" : undefined}
                  className="inline-flex w-fit items-center gap-2 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white"
                >
                  {c.buttonText}
                  {c.blank ? (
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  )}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Documentation */}
        <section
          id="exploreDocumentation"
          className="border-t border-slate-200 py-12 dark:border-white/10 md:py-16"
        >
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
            {t?.pages?.developers?.exploreDocsTitle ??
              "Explore the Documentation"}
          </h2>

          <div
            role="tablist"
            aria-label="Documentation categories"
            className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-white/10"
          >
            {docTabs.map((d, i) => (
              <button
                key={d.label}
                type="button"
                role="tab"
                id={`doc-tab-${i}`}
                aria-selected={tab === i}
                aria-controls={`doc-panel-${i}`}
                onClick={() => setTab(i)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === i
                    ? "border-brand bg-brand/10 text-brand dark:text-white"
                    : "border-slate-300 text-muted-foreground hover:border-brand/50 hover:text-foreground dark:border-white/15"
                }`}
              >
                {d.label}
                <span className="font-mono text-xs opacity-70">{d.resources.length}</span>
              </button>
            ))}
          </div>

          {docTabs.map((d, i) => (
            <div
              key={d.label}
              role="tabpanel"
              id={`doc-panel-${i}`}
              aria-labelledby={`doc-tab-${i}`}
              hidden={tab !== i}
            >
              <ResourcePanel resources={d.resources} groups={d.groups} />
            </div>
          ))}
        </section>

        {/* Feedback */}
        <section
          id="feedback"
          className="border-t border-slate-200 py-10 dark:border-white/10"
        >
          <h2 className="mb-4 text-lg font-semibold">
            {t?.pages?.developers?.feedbackTitle ?? "Was this page helpful?"}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleFeedback(true)}
              aria-pressed={feedbackSubmitted && isHelpful}
              className={feedbackBtn(feedbackSubmitted && isHelpful)}
            >
              <ThumbsUp aria-hidden="true" className="h-4 w-4" />
              {t?.pages?.developers?.feedbackYes ?? "Yes"}
            </button>
            <button
              type="button"
              onClick={() => handleFeedback(false)}
              aria-pressed={feedbackSubmitted && !isHelpful}
              className={feedbackBtn(feedbackSubmitted && !isHelpful)}
            >
              <ThumbsDown aria-hidden="true" className="h-4 w-4" />
              {t?.pages?.developers?.feedbackNo ?? "No"}
            </button>
          </div>

          {feedbackSubmitted && (
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              {isHelpful
                ? t?.pages?.developers?.feedbackHelpful ??
                  "Thank you for your feedback! Make this page even better by answering a few questions. If you need help, you can reach out to the community on our"
                : t?.pages?.developers?.feedbackNotHelpful ??
                  "Sorry to hear that. Please let us know how we can improve this page. You can reach out to the community on our"}{" "}
              {discord}.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

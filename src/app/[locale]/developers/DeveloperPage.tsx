"use client";

import React, { useState } from "react";
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

type ResourceColumnProps = {
  title: string;
  resources: Resource[];
};

function ResourceColumn({ title, resources }: ResourceColumnProps) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-3xl font-semibold mb-6">{title}</h3>
      <ul className="space-y-5">
        {resources.map((resource) => (
          <li key={`${resource.title}-${resource.url}`}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline font-medium"
            >
              {resource.title}
            </a>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {resource.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DeveloperPage() {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isHelpful, setIsHelpful] = useState(false);
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
          className="w-12 h-12 text-blue-500"
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
          className="w-12 h-12 text-green-500"
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
          className="w-12 h-12 text-orange-500"
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
        "Open-source Zcash wallet and reference implementation for developers building privacy-focused applications.",
      url: "https://github.com/zakura-core/zakura",
    },
    {
      title: "Zinder",
      description:
        "Open-source Zcash messaging and wallet application demonstrating private payments and messaging capabilities.",
      url: "https://github.com/gustavovalverde/zinder",
    },
    {
      title: "ZPay",
      description:
        "Open-source Zcash payment application demonstrating how to integrate ZEC payments into wallet and merchant software.",
      url: "https://github.com/gustavovalverde/zpay",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="flex 2xl:h-[60vh] flex-col md:flex-row relative overflow-hidden">
        <img
          src="/developer_resources_white.jpg"
          alt={t?.pages?.developers?.heroImageAlt ?? "Zcash Developer Resources"}
          className="inset-0 w-full h-full object-contain 2xl:object-cover dark:hidden"
        />
        <img
          src="/developer_resources_dark.jpg"
          alt={t?.pages?.developers?.heroImageAlt ?? "Zcash Developer Resources"}
          className="inset-0 w-full h-full object-contain 2xl:object-cover hidden dark:block"
        />
      </div>

      {/* Cards Section */}
      <section id="cardLinks" className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-bold mb-12">
            {t?.pages?.developers?.cardSectionTitle ??
              "How would you like to get started?"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cardsConfig.map((card) => (
              <div
                key={card.title}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="flex items-center justify-center p-6">
                  {card.svg}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                  <p className="dark:text-gray-300 text-gray-700 mb-4 h-[100px]">
                    {card.content}
                  </p>
                  <a
                    href={card.url}
                    target={card.blank ? "_blank" : "_self"}
                    rel={card.blank ? "noopener noreferrer" : undefined}
                    className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    {card.buttonText}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section
        id="exploreDocumentation"
        className="bg-white dark:bg-gray-800 py-12"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">
            {t?.pages?.developers?.exploreDocsTitle ??
              "Explore the Documentation"}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            <ResourceColumn
              title={
                t?.pages?.developers?.introductionsTitle ?? "Introductions"
              }
              resources={introductions}
            />
            <ResourceColumn title="SDKs" resources={sdks} />
            <ResourceColumn
              title={t?.pages?.developers?.advancedTitle ?? "Advanced"}
              resources={advanced}
            />
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section
        id="feedback"
        className="bg-gray-100 dark:bg-gray-800 py-12 mt-6"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">
            {t?.pages?.developers?.feedbackTitle ?? "Was this page helpful?"}
          </h2>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleFeedback(true)}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 cursor-pointer"
            >
              <span>👍</span>
              <span>{t?.pages?.developers?.feedbackYes ?? "Yes"}</span>
            </button>

            <button
              onClick={() => handleFeedback(false)}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 cursor-pointer"
            >
              <span>👎</span>
              <span>{t?.pages?.developers?.feedbackNo ?? "No"}</span>
            </button>
          </div>

          {feedbackSubmitted && (
            <div className="mt-4">
              {isHelpful ? (
                <p className="text-green-600">
                  {t?.pages?.developers?.feedbackHelpful ??
                    "Thank you for your feedback! Make this page even better by answering a few questions. If you need help, you can reach out to the community on our"}{" "}
                  <a
                    href="https://discord.gg/zcash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Discord
                  </a>
                  .
                </p>
              ) : (
                <p className="text-red-600">
                  {t?.pages?.developers?.feedbackNotHelpful ??
                    "Sorry to hear that. Please let us know how we can improve this page. You can reach out to the community on our"}{" "}
                  <a
                    href="https://discord.gg/zcash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Discord
                  </a>
                  .
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

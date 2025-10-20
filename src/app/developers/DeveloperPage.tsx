"use client";
import React, { useState } from "react";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";

export const metadata: Metadata = genMetadata({
  title: "Zcash Developer Resources",
  url: "https://zechub.wiki/using-zcash/blockchain-explorers",
});

export default function DeveloperPage() {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isHelpful, setIsHelpful] = useState(false);

  // Handle feedback submission
  const handleFeedback = (helpful: boolean) => {
    setIsHelpful(helpful);
    setFeedbackSubmitted(true);
  };

  // Card data with custom button text and SVG icons
  const cardsConfig = [
    {
      title: "Learn Zcash Development",
      content:
        "Explore the official documentation and learn the basics of Zcash technology.",
      url: "https://zcash.readthedocs.io/",
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
      ), // SVG for "Learn Zcash Development"
      buttonText: "Read the Docs", // Custom button text
    },
    {
      title: "Learn Through Tutorials",
      content:
        "Follow step-by-step tutorials to build on Zcash, from creating wallets to integrating Zcash into your applications.",
      url: "https://www.youtube.com/playlist?list=PL6_epn0lASLFF28ePj7P5TvtMG_WE7p3O",
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
      ), // SVG for "Learn Through Tutorials"
      buttonText: "View Tutorials", // Custom button text
    },
    {
      title: "Quick Start Guide",
      content:
        "Get up and running with Zcash development quickly. Learn installation, configuration, and basic operations.",
      url: "/developers/quick-start",
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
      ), // SVG for "Quick Start Guide"
      buttonText: "Quick Start Guide", // Custom button text
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div
        className="min-h-[50vh] flex flex-col md:flex-row"
        style={{
          backgroundImage: `url('zecbg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full md:w-1/2 h-[50vh] relative">
          <div className="absolute inset-0 bg-white bg-opacity-50"></div>

          <div className="absolute inset-0 flex flex-col items-start justify-center p-8 text-black max-w-md mx-auto md:ml-16">
            <h1 className="text-2xl md:text-5xl font-bold mb-4">Developers</h1>
            <h2 className="text-4xl md:text-3xl font-semibold mb-4">
              Zcash Developer Resources
            </h2>
            <p className="text-lg md:text-xl">
              A builders manual for Zcash. By builders, for builders.
            </p>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <section id="cardLinks" className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-bold mb-12">
            How would you like to get started?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cardsConfig.map((card, index) => (
              <div
                key={index}
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
            Explore the Documentation
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Introductions Column */}
            <div className="flex-1">
              <h3 className="text-3xl font-semibold mb-4">Introductions</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://zechub.wiki/start-here/what-is-zec-and-zcash#content"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Intro to Zcash
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Learn about Zcash, its history, and its core principles.
                  </p>
                </li>

                <li>
                  <a
                    href="https://zechub.wiki/start-here/zec-use-cases#content"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Intro to ZEC
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Discover the use cases and benefits of ZEC, Zcash native
                    cryptocurrency.
                  </p>
                </li>

                <li>
                  <a
                    href="https://zebra.zfnd.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Intro to Zebra
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Understanding how Zebra powers the Zcash network with a
                    modular and secure Rust-based implementation
                  </p>
                </li>

                <li>
                  <a
                    href="https://github.com/zcash/lightwalletd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Intro to Lightwalletd
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Understanding the lightwalletd project—a scalable server
                    written in Go that efficiently serves compact blockchain
                    data to Zcash light clients via gRPC.
                  </p>
                </li>
              </ul>
            </div>

            {/* Fundamentals Column */}
            <div className="flex-1">
              <h3 className="text-3xl font-semibold mb-4">Fundamentals</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://zips.z.cash/protocol/protocol.pdf#5.6%20Encodings%20of%20Addresses%20and%20Keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Address Encoding
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Learn how Zcash addresses and keys are encoded.
                  </p>
                </li>

                <li>
                  <a
                    href="https://zechub.wiki/using-zcash/transactions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Transactions
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Understand how transactions work in Zcash.
                  </p>
                </li>

                <li>
                  <a
                    href="https://zips.z.cash/zip-0317"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Fees
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Learn about transaction fees and how they are calculated.
                  </p>
                </li>

                <li>
                  <a
                    href="https://zcash.github.io/zcash/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Nodes (zcashd)
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Set up and manage Zcash nodes using zcashd.
                  </p>
                </li>

                <li>
                  <a
                    href="https://zebra.zfnd.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Nodes (zebrad)
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Explore Zebra, an alternative Zcash node implementation.
                  </p>
                </li>

                <li>
                  <a
                    href="https://zcash.readthedocs.io/en/latest/lightwalletd/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Lightwallet Servers
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Learn about lightwalletd, a lightweight Zcash wallet server.
                  </p>
                </li>

                <li>
                  <a
                    href="https://github.com/nighthawk-apps/zcash-explorer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Block Explorers
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Explore Zcash blockchains using block explorers.
                  </p>
                </li>

                <li>
                  <a
                    href="https://fringe-brow-647.notion.site/Shade-Agents-19a09959836d8091bb8febb318cc09fd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Shade Agent - Notion
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Learn about Shade Agents—the first truly autonomous AI
                    agents on NEAR—powered by secure TEEs and decentralized
                    Chain Signatures to manage assets, access LLMs, and execute
                    multichain transactions independently.
                  </p>
                </li>
              </ul>
            </div>

            {/* Advanced Column */}
            <div className="flex-1">
              <h3 className="text-3xl font-semibold mb-4">Advanced</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://zcash.readthedocs.io/en/latest/rtd_pages/librustzcash_arch.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Intro to the Stack
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Understand the architecture and components of the Zcash
                    stack.
                  </p>
                </li>

                <li>
                  <a
                    href="https://zecdev.github.io/community"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Zcash Community Wishlist
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Explore the Zcash Community Wishlist to discover project
                    ideas, priorities, and contributions from the broader Zcash
                    ecosystem.
                  </p>
                  Link:{" "}
                  <a
                    href="https://zecdev.github.io/community"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Zcash Community Wishlist
                  </a>
                </li>

                <li>
                  <a
                    href="https://github.com/zingolabs/zingolib"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Intro to Zingolib
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Understanding the zingolib repository—a Rust-based API and
                    CLI for interacting with zcashd via Lightwalletd.
                  </p>
                </li>

                <li>
                  <a
                    href="https://zcash.readthedocs.io/en/latest/rtd_pages/development_guidelines.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Development Guidelines
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    Follow best practices for developing on Zcash.
                  </p>
                </li>

                <li>
                  <a
                    href="https://github.com/ZcashCommunityGrants/arboretum-notes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Arborist Calls Page
                  </a>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                    The Zcash Arborist Calls are bi-weekly protocol development
                    meetings focused on tracking upcoming protocol deployment
                    logistics, consensus node implementation issues, and
                    protocol research.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Advanced */}
          <div className="container mx-auto px-4">

        <div className="flex-1  ">
          <h3 className="text-3xl font-semibold mb-4">Advanced</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://zecdev.github.io/community"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Zcash Community Wishlist
              </a>
              <p className="text-gray-600 text-sm mt-1 mb-2">
                Explore open ideas and community priorities for future Zcash
                development.
              </p>
            </li>
          </ul>
              </div>

        </div>
      </section>

      {/* Feedback Section */}
      <section
        id="feedback"
        className="bg-gray-100 dark:bg-gray-800 py-12 mt-6"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Was this page helpful?</h2>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleFeedback(true)}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              <span>👍</span>
              <span>Yes</span>
            </button>

            <button
              onClick={() => handleFeedback(false)}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              <span>👎</span>
              <span>No</span>
            </button>
          </div>

          {feedbackSubmitted && (
            <div className="mt-4">
              {isHelpful ? (
                <p className="text-green-600">
                  Thank you for your feedback! Make this page even better by
                  answering a few questions. If you need help, you can reach out
                  to the community on our{" "}
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
                  Sorry to hear that. Please let us know how we can improve this
                  page. You can reach out to the community on our{" "}
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

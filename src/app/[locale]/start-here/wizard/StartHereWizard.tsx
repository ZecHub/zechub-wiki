"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

type PathStep = {
  title: string;
  url: string;
  note: string;
};

type TrackOption = {
  label: string;
  hint: string;
  steps: PathStep[];
};

type Track = {
  id: string;
  label: string;
  blurb: string;
  icon: string;
  question: string;
  options: TrackOption[];
};

/**
 * Every URL below is an existing wiki article (all targets verified against
 * the content repo). No new articles are created; the wizard only points
 * newcomers at the right existing pages, in order.
 */
const TRACKS: Track[] = [
  {
    id: "buy",
    label: "I want to buy ZEC",
    blurb: "Get your first ZEC from an exchange or a swap.",
    icon: "💰",
    question: "How would you like to pay for your ZEC?",
    options: [
      {
        label: "With dollars or euros",
        hint: "Bank transfer or card on a regular exchange",
        steps: [
          {
            title: "Zcash Basics",
            url: "/start-here/what-is-zec-and-zcash",
            note: "What ZEC is and why it exists, in plain language.",
          },
          {
            title: "Obtaining Zcash",
            url: "/using-zcash/buying-zec",
            note: "Every way to buy ZEC, compared side by side.",
          },
          {
            title: "Custodial Exchanges",
            url: "/using-zcash/custodial-exchanges",
            note: "Pick a reputable exchange to make the purchase.",
          },
          {
            title: "Wallets",
            url: "/using-zcash/wallets",
            note: "Move your ZEC off the exchange into a wallet you control.",
          },
        ],
      },
      {
        label: "With crypto I already hold",
        hint: "Swap another coin for ZEC",
        steps: [
          {
            title: "Zcash Basics",
            url: "/start-here/what-is-zec-and-zcash",
            note: "What ZEC is and why it exists, in plain language.",
          },
          {
            title: "Obtaining Zcash",
            url: "/using-zcash/buying-zec",
            note: "Every way to get ZEC, compared side by side.",
          },
          {
            title: "Non-Custodial Exchanges",
            url: "/using-zcash/non-custodial-exchanges",
            note: "Swap your crypto for ZEC without handing over custody.",
          },
          {
            title: "Wallets",
            url: "/using-zcash/wallets",
            note: "Receive your swapped ZEC in a wallet you control.",
          },
        ],
      },
    ],
  },
  {
    id: "private",
    label: "I want to hold and use ZEC privately",
    blurb: "Wallets, shielded addresses, and spending without a paper trail.",
    icon: "🛡️",
    question: "What do you want to do first?",
    options: [
      {
        label: "Get set up and transacting",
        hint: "Wallet first, theory later",
        steps: [
          {
            title: "Zcash Basics",
            url: "/start-here/what-is-zec-and-zcash",
            note: "What ZEC is and why it exists, in plain language.",
          },
          {
            title: "Wallets",
            url: "/using-zcash/wallets",
            note: "Choose a wallet that supports shielded addresses.",
          },
          {
            title: "My First Zcash Workbook",
            url: "/guides/my-first-zcash-workbook",
            note: "A hands-on walkthrough: your first shielded transaction.",
          },
          {
            title: "Using ZEC, privately",
            url: "/guides/using-zec-privately",
            note: "Day-to-day habits that keep your activity private.",
          },
        ],
      },
      {
        label: "Understand the privacy first",
        hint: "How shielded payments actually work",
        steps: [
          {
            title: "Who Can See Your Zcash Payment?",
            url: "/start-here/who-can-see-your-zcash-payment",
            note: "Exactly what is hidden by a shielded payment, and from whom.",
          },
          {
            title: "Zcash Value Pools",
            url: "/using-zcash/shielded-pools",
            note: "Where shielded ZEC actually lives on the chain.",
          },
          {
            title: "Using ZEC, privately",
            url: "/guides/using-zec-privately",
            note: "Put the theory into practice, step by step.",
          },
          {
            title: "Wallets",
            url: "/using-zcash/wallets",
            note: "Pick your wallet now that you know what to look for.",
          },
        ],
      },
    ],
  },
  {
    id: "accept",
    label: "I want to accept ZEC payments",
    blurb: "Take Zcash as a business, freelancer, or creator.",
    icon: "🧾",
    question: "Who are you accepting payments as?",
    options: [
      {
        label: "A business or online store",
        hint: "Checkout, invoicing, and processors",
        steps: [
          {
            title: "Accept Payments as a Merchant with Zcash",
            url: "/zcash-use-cases/accept-payments-as-a-merchant",
            note: "The merchant overview: every option at a glance.",
          },
          {
            title: "Zcash Payment Processors",
            url: "/using-zcash/payment-processors",
            note: "Compare processors that handle ZEC for you.",
          },
          {
            title: "ZGo Payment Processor",
            url: "/guides/zgo-payment-processor",
            note: "Accept Zcash without giving up custody — full guide.",
          },
          {
            title: "BTCPay Server with Zcash Support",
            url: "/guides/btcpayserver-zcash-plugin",
            note: "Self-hosted invoicing with the BTCPay Server Zcash plugin.",
          },
        ],
      },
      {
        label: "A freelancer or creator",
        hint: "Tips, donations, and client invoices",
        steps: [
          {
            title: "Receive Donations Privately with Zcash",
            url: "/zcash-use-cases/receive-donations-privately",
            note: "Set up a shielded address for tips and donations.",
          },
          {
            title: "Accept Payments as a Merchant with Zcash",
            url: "/zcash-use-cases/accept-payments-as-a-merchant",
            note: "The broader picture: invoicing and checkout options.",
          },
          {
            title: "Zcash Payment Request URIs",
            url: "/using-zcash/payment-request-uris",
            note: "Share payment links that open straight in wallets.",
          },
          {
            title: "Wallets",
            url: "/using-zcash/wallets",
            note: "Receive and manage what you earn.",
          },
        ],
      },
    ],
  },
  {
    id: "node",
    label: "I want to run a node",
    blurb: "Help secure the network and verify your own transactions.",
    icon: "🖥️",
    question: "What will you run your node on?",
    options: [
      {
        label: "My own computer or server",
        hint: "The maintained Zebra node software",
        steps: [
          {
            title: "Full Nodes",
            url: "/zcash-tech/full-nodes",
            note: "What a full node does and why it matters.",
          },
          {
            title: "Zebra Full Node",
            url: "/zcash-tech/zebra-full-node",
            note: "The maintained node software: system requirements and setup.",
          },
          {
            title: "Zakura Node",
            url: "/zcash-tech/zakura-node",
            note: "A Rust full-node alternative, if you want options.",
          },
        ],
      },
      {
        label: "A Raspberry Pi",
        hint: "A small, always-on node at home",
        steps: [
          {
            title: "Full Nodes",
            url: "/zcash-tech/full-nodes",
            note: "What a full node does and why it matters.",
          },
          {
            title: "Run a Full Node on a Raspberry Pi 4 (Zebra + Zallet)",
            url: "/guides/raspberry-pi-4-full-node",
            note: "The complete Pi build guide, start to finish.",
          },
          {
            title: "Zebra Full Node",
            url: "/zcash-tech/zebra-full-node",
            note: "Reference: network configuration for your Pi.",
          },
        ],
      },
      {
        label: "I'm migrating from zcashd",
        hint: "zcashd reached end of support",
        steps: [
          {
            title: "Migration Guide: From zcashd to Zebrad/Zallet",
            url: "/guides/migration-guide-zcashd-to-zebrad-zallet",
            note: "Step-by-step: move off zcashd onto the maintained stack.",
          },
          {
            title: "Zebra Full Node",
            url: "/zcash-tech/zebra-full-node",
            note: "System requirements and network configuration for Zebra.",
          },
          {
            title: "Full Nodes",
            url: "/zcash-tech/full-nodes",
            note: "Understand what your new node is actually doing.",
          },
        ],
      },
    ],
  },
];

export default function StartHereWizard() {
  const [track, setTrack] = useState<Track | null>(null);
  const [option, setOption] = useState<TrackOption | null>(null);

  const restart = () => {
    setTrack(null);
    setOption(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Progress */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {option
          ? "Your reading path"
          : track
            ? "Question 2 of 2"
            : "Question 1 of 2"}
      </p>

      {!track && (
        <>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Where do you want to start?
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Pick the one that sounds most like you. We will point you at a
            short, ordered list of pages that already exist on this wiki — no
            need to learn the whole site first.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTrack(t)}
                className="text-left p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition cursor-pointer"
              >
                <div className="text-3xl mb-2" aria-hidden="true">
                  {t.icon}
                </div>
                <div className="font-semibold text-lg mb-1">{t.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t.blurb}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {track && !option && (
        <>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {track.question}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            One more, so we can narrow the path down.
          </p>
          <div className="grid gap-4">
            {track.options.map((o) => (
              <button
                key={o.label}
                onClick={() => setOption(o)}
                className="text-left p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition cursor-pointer"
              >
                <div className="font-semibold text-lg">{o.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {o.hint}
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setTrack(null)}
            className="mt-6 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            ← Back to the first question
          </button>
        </>
      )}

      {track && option && (
        <>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Your reading path
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Read these in order — each one builds on the last.{" "}
            <span className="font-medium">
              {track.label} · {option.label}.
            </span>
          </p>
          <ol className="space-y-4">
            {option.steps.map((step, i) => (
              <li
                key={step.url}
                className="flex gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-400 text-black font-bold flex items-center justify-center"
                  aria-hidden="true"
                >
                  {i + 1}
                </div>
                <div>
                  <Link
                    href={step.url}
                    className="font-semibold text-lg text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {step.title}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {step.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setOption(null)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              ← Change your answer
            </button>
            <button
              onClick={restart}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Start over
            </button>
          </div>
        </>
      )}
    </div>
  );
}

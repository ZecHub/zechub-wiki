/* src/app/zcash-use-case/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Use Zcash in the Real World — Privacy Playbooks for Every Scenario",
  description:
    "Step-by-step guides for using Zcash in everyday situations: receiving donations, sending money privately, freelancing, accepting merchant payments, running community treasuries, and protecting journalist sources.",
  openGraph: {
    title: "Real-World Zcash Use Cases — Privacy Playbooks",
    description:
      "Practical, step-by-step guides for using Zcash shielded transactions in real-world scenarios. From beginner to advanced.",
    type: "article",
    url: "https://zechub.wiki/zcash-use-case",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real-World Zcash Use Cases — Privacy Playbooks",
    description:
      "Practical, step-by-step guides for using Zcash shielded transactions in real-world scenarios.",
  },
};

type GuideCard = {
  slug: string;
  emoji: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  next?: string;
};

const guides: GuideCard[] = [
  {
    slug: "receive-donations-privately",
    emoji: "🤝",
    title: "Receive Donations Privately",
    description:
      "Set up a shielded Zcash address to receive donations without exposing your identity or financial history. Ideal for nonprofits, creators, and mutual-aid organizers.",
    level: "Beginner",
    next: "send-money-privately",
  },
  {
    slug: "send-money-privately",
    emoji: "🔒",
    title: "Send Money Without Linking Identity",
    description:
      "Learn how to send Zcash privately using shielded addresses — keeping the sender, recipient, and amount invisible on the blockchain.",
    level: "Beginner",
    next: "freelancer-privacy-setup",
  },
  {
    slug: "freelancer-privacy-setup",
    emoji: "💼",
    title: "Freelancer Privacy Setup",
    description:
      "Protect your income from public scrutiny. Set up Zcash invoicing and payments as a freelancer without linking wallet activity to your identity.",
    level: "Intermediate",
    next: "accept-merchant-payments",
  },
  {
    slug: "accept-merchant-payments",
    emoji: "🏪",
    title: "Accept Payments as a Merchant",
    description:
      "Configure your store to accept Zcash via BTCPay Server or direct wallet integration. Shielded payments keep your sales data private from competitors and data brokers.",
    level: "Intermediate",
    next: "private-community-treasury",
  },
  {
    slug: "private-community-treasury",
    emoji: "🏛️",
    title: "Run a Private Community Treasury",
    description:
      "Manage a shared Zcash treasury with multi-sig controls, shielded accounting, and transparent governance — without exposing the full balance on-chain.",
    level: "Advanced",
    next: "journalist-privacy-setup",
  },
  {
    slug: "journalist-privacy-setup",
    emoji: "🛡️",
    title: "Journalist Privacy Setup",
    description:
      "A complete OPSEC guide for journalists: shielded Zcash payments, source protection, secure communications, and operational security best practices.",
    level: "Advanced",
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="select-none text-[11px] tracking-wide uppercase rounded-md border border-zinc-300/70 bg-zinc-100 px-1.5 py-0.5 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  );
}

function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Beginner: "border-green-300/60 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300",
    Intermediate: "border-amber-300/60 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
    Advanced: "border-red-300/60 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300",
  };
  return (
    <span className={`select-none text-[11px] tracking-wide uppercase rounded-md border px-1.5 py-0.5 ${colors[level] || colors.Beginner}`}>
      {level}
    </span>
  );
}

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10 py-8">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          🌍 Use Zcash in the Real World
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300 text-lg">
          Practical, step-by-step playbooks for using Zcash shielded transactions in everyday scenarios.
          Each guide is designed to preserve your financial privacy.
        </p>
        <div className="mt-4 rounded-md border border-blue-300/40 bg-blue-50 dark:bg-blue-900/20 p-4 text-sm leading-relaxed">
          <strong>💡 How to use these guides:</strong> Start from the top if you&apos;re new to Zcash,
          or jump to the guide that matches your needs. Each guide builds on concepts from the previous ones.
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((g, i) => (
          <Link
            key={g.slug}
            href={`/zcash-use-case/${g.slug}`}
            className="group rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{g.emoji}</span>
              <div className="flex gap-2">
                <LevelBadge level={g.level} />
              </div>
            </div>
            <h2 className="text-lg font-semibold group-hover:text-zinc-700 dark:group-hover:text-zinc-200 mb-2">
              {i + 1}. {g.title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {g.description}
            </p>
            {g.next && (
              <div className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                Next → {guides.find(x => x.slug === g.next)?.title}
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
        <h2 className="text-xl font-semibold mb-4">📚 Related Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Link href="https://zechub.wiki/wallets" target="_blank" className="flex items-center gap-2 hover:underline">
            🪙 Zcash Wallet Compatibility List
          </Link>
          <Link href="https://zechub.wiki/guides/btcpay-zcash" className="flex items-center gap-2 hover:underline">
            💳 BTCPay Server with Zcash Support
          </Link>
          <Link href="https://zecash.net/" target="_blank" className="flex items-center gap-2 hover:underline">
            🔐 Zcash Protocol Documentation
          </Link>
          <Link href="https://zec.rocks/" target="_blank" className="flex items-center gap-2 hover:underline">
            🔍 Zcash Block Explorer (zec.rocks)
          </Link>
        </div>
      </div>
    </div>
  );
}

/* src/app/zcash-use-case/send-money-privately/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Send Money Privately with Zcash — Beginner Guide",
  description:
    "Learn how to send Zcash privately using shielded addresses. Keep the sender, recipient, and amount invisible on the blockchain. Step-by-step guide for beginners.",
  openGraph: {
    title: "Send Money Privately with Zcash",
    description:
      "Step-by-step guide to sending Zcash privately. Protect financial privacy for both sender and recipient.",
    type: "article",
    url: "https://zechub.wiki/zcash-use-case/send-money-privately",
  },
  twitter: {
    card: "summary_large_image",
    title: "Send Money Privately with Zcash",
    description:
      "Step-by-step guide to sending Zcash privately using shielded addresses.",
  },
};

type TocItem = { id: string; label: string; indent?: boolean };

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="select-none text-[11px] tracking-wide uppercase rounded-md border border-zinc-300/70 bg-zinc-100 px-1.5 py-0.5 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  );
}

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  return (
    <div className="relative my-4">
      <div className="absolute left-2 top-2">
        <Badge>{language}</Badge>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 p-4 text-sm leading-relaxed dark:border-zinc-700 dark:bg-zinc-900">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const sections: TocItem[] = [
  { id: "Why-Send-Money-Privately", label: "Why Send Money Privately" },
  { id: "Prerequisites", label: "Prerequisites" },
  { id: "Step-by-Step-Send-Process", label: "Step-by-Step Send Process" },
  { id: "Mobile-Wallet-Sending", label: "Sending from Mobile Wallets" },
  { id: "Desktop-Wallet-Sending", label: "Sending from Desktop Wallets" },
  { id: "Transaction-Fees-and-Speed", label: "Transaction Fees and Speed" },
  { id: "Privacy-Tips-for-Senders", label: "Privacy Tips for Senders" },
  { id: "Next-Steps", label: "Next Steps" },
  { id: "Resources", label: "Resources" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <>
      <h2 id={id} className="scroll-mt-24 group text-2xl md:text-3xl font-semibold mt-12 mb-4">
        <a href={`#${id}`} className="no-underline">{children}</a>
        <span className="opacity-0 group-hover:opacity-100 align-middle pl-2 text-sm text-zinc-400">#</span>
      </h2>
      <hr className="border-zinc-200 dark:border-zinc-700 mb-6" />
    </>
  );
}

function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="scroll-mt-24 group text-xl md:text-2xl font-semibold mt-10 mb-3">
      <a href={`#${id}`} className="no-underline">{children}</a>
      <span className="opacity-0 group-hover:opacity-100 align-middle pl-2 text-sm text-zinc-400">#</span>
    </h3>
  );
}

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/zcash-use-case" className="text-sm text-zinc-500 hover:underline">&larr; Back to Use Cases</Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          🔒 Send Money Without Linking Identity
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          Learn how to send Zcash privately using shielded addresses — keeping the sender, recipient, and amount invisible on the blockchain.
        </p>
        <div className="mt-4 rounded-md border border-green-300/40 bg-green-50 dark:bg-green-900/20 p-4 text-sm">
          <strong>🟢 Beginner Level:</strong> Builds on receiving donations. You&apos;ll learn to send shielded transactions in under 10 minutes.
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8">
        <aside className="lg:sticky lg:top-24 self-start hidden lg:block">
          <nav className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-3">On this page</p>
            <ol className="space-y-2 text-sm list-decimal pl-5">
              {sections.filter(s => !s.indent).map(top => (
                <li key={top.id}>
                  <a className="hover:underline" href={`#${top.id}`}>{top.label}</a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="prose prose-zinc dark:prose-invert max-w-none prose-pre:overflow-x-auto prose-code:break-words">
          <H2 id="Why-Send-Money-Privately">Why Send Money Privately</h2>
          <p>When you send cryptocurrency on a transparent blockchain, everyone can see:</p>
          <ul>
            <li><strong>Who sent the money</strong> — your address is visible</li>
            <li><strong>Who received it</strong> — the recipient&apos;s address is visible</li>
            <li><strong>How much was sent</strong> — the exact amount is public</li>
            <li><strong>Your total balance</strong> — all transactions link together</li>
          </ul>
          <p>This creates problems for:</p>
          <ul>
            <li>Freelancers receiving payments from clients</li>
            <li>People sending money to family without exposing their finances</li>
            <li>Anyone who doesn&apos;t want their spending habits public</li>
            <li>Organizations that need to protect payment recipients</li>
          </ul>
          <p><strong>Zcash shielded transactions solve all of this.</strong> With zk-SNARKs, the sender, recipient, and amount are all encrypted. Only the parties involved know the details.</p>

          <H2 id="Prerequisites">Prerequisites</h2>
          <ul>
            <li>A Zcash wallet with some ZEC balance (see <Link href="/zcash-use-case/receive-donations-privately">Receive Donations</Link>)</li>
            <li>The recipient&apos;s shielded Zcash address (starts with <code>zs1</code>)</li>
            <li>Your wallet must be synced to the network</li>
          </ul>
          <div className="rounded-md border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm my-4">
            <strong>⚠️ Important:</strong> Always send to a <strong>shielded address</strong> (<code>zs1...</code>). Sending to a transparent address (<code>t1...</code>) exposes the transaction publicly. If you must send to a transparent address, be aware the transaction will be visible.
          </div>

          <H2 id="Step-by-Step-Send-Process">Step-by-Step Send Process</h2>

          <H3 id="Mobile-Wallet-Sending">Sending from Mobile Wallets</h3>

          <h3>Step 1: Open Your Wallet</h3>
          <p>Open your Zcash wallet app (<Link href="https://ywallet.app/installation" target="_blank">YWallet</Link>, <Link href="https://zingolabs.org/" target="_blank">Zingo!</Link>, or <Link href="https://nighthawkwallet.com/" target="_blank">Nighthawk</Link>).</p>

          <h3>Step 2: Navigate to Send</h3>
          <p>Tap the <strong>Send</strong> button. This is usually on the main screen or in the bottom navigation bar.</p>

          <h3>Step 3: Enter Recipient Address</h3>
          <p>Paste the recipient&apos;s shielded address, or scan their QR code using the camera icon.</p>
          <CodeBlock language="text" code={`Recipient address (zs1...):\nzs1abcdefghijklmnopqrstuvwxyz0123456789abcdef0123456789abcdef012345`} />

          <h3>Step 4: Enter Amount</h3>
          <p>Enter the amount of ZEC to send. Most wallets let you switch between ZEC and USD equivalents.</p>

          <h3>Step 5: Add a Memo (Optional)</h3>
          <p>Some wallets support encrypted memos in shielded transactions. You can add a message like &quot;Invoice #42&quot; that only the recipient can decrypt.</p>

          <h3>Step 6: Review and Confirm</h3>
          <p>Double-check the address and amount. Once confirmed, the transaction cannot be reversed.</p>

          <h3>Step 7: Wait for Confirmation</h3>
          <p>Zcash blocks are approximately 75 seconds. Your transaction should confirm within a few minutes. The recipient will see the funds once confirmed.</p>

          <H3 id="Desktop-Wallet-Sending">Sending from Desktop Wallets</h3>
          <p>The process is similar on desktop wallets like <Link href="https://ywallet.app/installation" target="_blank">YWallet Desktop</Link>:</p>
          <ol>
            <li>Open YWallet and unlock with your password or seed</li>
            <li>Click <strong>Send</strong> in the sidebar</li>
            <li>Paste the shielded address or paste a URI</li>
            <li>Enter the amount and optional memo</li>
            <li>Review the transaction details</li>
            <li>Click <strong>Send</strong> and confirm</li>
          </ol>

          <H2 id="Transaction-Fees-and-Speed">Transaction Fees and Speed</h2>
          <p>Zcash transaction fees are very low — typically a fraction of a cent. Unlike Bitcoin, fees don&apos;t spike during network congestion.</p>
          <ul>
            <li><strong>Shielded → Shielded:</strong> ~0.00001 ZEC fee (nearly free), fully private</li>
            <li><strong>Shielded → Transparent:</strong> ~0.00001 ZEC fee, partially private (recipient is visible)</li>
            <li><strong>Transparent → Shielded:</strong> ~0.00001 ZEC fee, partially private (sender is visible)</li>
          </ul>
          <p><strong>Block time:</strong> ~75 seconds. Most transactions confirm within 2–5 minutes.</p>

          <H2 id="Privacy-Tips-for-Senders">Privacy Tips for Senders</h2>
          <ul>
            <li><strong>Always send from shielded to shielded</strong> — this maximizes privacy for both parties</li>
            <li><strong>Verify addresses carefully</strong> — transactions are irreversible</li>
            <li><strong>Use QR codes when possible</strong> — reduces copy-paste errors</li>
            <li><strong>Keep your wallet synced</strong> — an unsynced wallet may show incorrect balances</li>
            <li><strong>Shield transparent funds immediately</strong> — if you receive ZEC to a transparent address, send it to your shielded address right away</li>
            <li><strong>Consider funding sources</strong> — if you bought ZEC on a KYC exchange, the initial transparent transaction links your identity. Always shield immediately after purchase</li>
          </ul>

          <div className="rounded-md border border-blue-300/40 bg-blue-50 dark:bg-blue-900/20 p-4 text-sm my-4">
            <strong>🔐 Shielding Your ZEC:</strong> If you purchased ZEC on an exchange, it likely arrived at a transparent address. Immediately send it to your shielded address (<code>zs1...</code>) to protect your privacy going forward.
          </div>

          <H2 id="Next-Steps">Next Steps</h2>
          <p>Now that you know how to send and receive Zcash privately, you&apos;re ready for more advanced use cases:</p>
          <ul>
            <li><Link href="/zcash-use-case/freelancer-privacy-setup">Freelancer Privacy Setup</Link> — set up private invoicing and payment workflows</li>
            <li><Link href="/zcash-use-case/accept-merchant-payments">Accept Payments as a Merchant</Link> — configure your store for shielded payments</li>
          </ul>

          <H2 id="Resources">Resources</h2>
          <ul>
            <li><Link href="https://zechub.wiki/wallets" target="_blank">Zcash Wallet Compatibility List</Link></li>
            <li><Link href="https://ywallet.app/installation" target="_blank">YWallet Download</Link></li>
            <li><Link href="https://zingolabs.org/" target="_blank">Zingo! Wallet Download</Link></li>
            <li><Link href="https://nighthawkwallet.com/" target="_blank">Nighthawk Wallet Download</Link></li>
            <li><Link href="/zcash-use-case/receive-donations-privately">← Previous: Receive Donations Privately</Link></li>
            <li><Link href="/zcash-use-case/freelancer-privacy-setup">Next: Freelancer Privacy Setup →</Link></li>
          </ul>
        </article>
      </div>
    </div>
  );
}

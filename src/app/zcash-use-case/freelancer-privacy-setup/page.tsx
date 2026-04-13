/* src/app/zcash-use-case/freelancer-privacy-setup/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Freelancer Privacy Setup with Zcash — Intermediate Guide",
  description:
    "Protect your income from public scrutiny. Set up Zcash invoicing and payments as a freelancer without linking wallet activity to your identity.",
  openGraph: {
    title: "Freelancer Privacy Setup with Zcash",
    description:
      "Set up private invoicing, shielded payments, and financial privacy workflows for freelance work.",
    type: "article",
    url: "https://zechub.wiki/zcash-use-case/freelancer-privacy-setup",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelancer Privacy Setup with Zcash",
    description:
      "Set up private invoicing, shielded payments, and financial privacy workflows for freelance work.",
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
  { id: "Why-Freelancers-Need-Privacy", label: "Why Freelancers Need Privacy" },
  { id: "Set-Up-Dedicated-Wallet", label: "Set Up a Dedicated Freelance Wallet" },
  { id: "Create-ZEC-Invoices", label: "Create ZEC Invoices for Clients" },
  { id: "Client-Onboarding", label: "Client Onboarding: Helping Them Pay" },
  { id: "Track-Payments-Privately", label: "Track Payments Privately" },
  { id: "Convert-ZEC-to-Fiat", label: "Convert ZEC to Local Currency" },
  { id: "Tax-Considerations", label: "Tax Considerations" },
  { id: "Advanced-Privacy-Tips", label: "Advanced Privacy Tips" },
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
          💼 Freelancer Privacy Setup with Zcash
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          Protect your income from public scrutiny. Set up Zcash invoicing and payments as a freelancer without linking wallet activity to your identity.
        </p>
        <div className="mt-4 rounded-md border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm">
          <strong>🟡 Intermediate Level:</strong> Assumes you can send and receive Zcash. This guide covers invoicing, client onboarding, and privacy workflows.
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
          <H2 id="Why-Freelancers-Need-Privacy">Why Freelancers Need Privacy</h2>
          <p>If you freelance and accept payments on transparent blockchains, anyone can:</p>
          <ul>
            <li>See exactly how much you earn from each client</li>
            <li>Calculate your total income by analyzing your address</li>
            <li>Identify your clients by tracing payment patterns</li>
            <li>Use this information for social engineering, targeted attacks, or competitive intelligence</li>
          </ul>
          <p>Zcash shielded payments eliminate all of these risks. Your clients pay you privately, and no one else can see the details.</p>

          <H2 id="Set-Up-Dedicated-Wallet">Set Up a Dedicated Freelance Wallet</h2>
          <h3>Step 1: Create a Separate Wallet</h3>
          <p>Use a different wallet for freelance income than your personal wallet. This keeps your business and personal finances separate.</p>
          <ul>
            <li>Recommended: <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link> for desktop management</li>
            <li>Mobile companion: <Link href="https://zingolabs.org/" target="_blank">Zingo!</Link> for quick checks on the go</li>
          </ul>

          <h3>Step 2: Generate a New Shielded Address</h3>
          <p>Create a fresh shielded address (<code>zs1...</code>) specifically for receiving freelance payments. Use this address on invoices and contracts.</p>

          <h3>Step 3: Set Up a Viewing Key (Optional)</h3>
          <p>If you use <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link>, you can export a <strong>viewing key</strong> that lets you monitor incoming payments on another device without exposing spending capability. This is useful for accounting.</p>

          <H2 id="Create-ZEC-Invoices">Create ZEC Invoices for Clients</h2>
          <h3>Step 4: Design Your Invoice Template</h3>
          <p>Create a professional invoice that includes ZEC payment details:</p>
          <CodeBlock language="text" code={`INVOICE #2024-042
Date: 2024-01-15
Due: 2024-01-29

Services: Web Development - January Sprint
Amount: 2,500 USD
ZEC Amount: 25.0 ZEC (locked at invoice time)

Payment Details:
  Network: Zcash (Mainnet)
  Address: zs1your-shielded-address-here
  Memo: INV-2024-042

Notes:
  - Please send the exact ZEC amount shown above
  - Use a shielded transaction for privacy
  - Payment confirmed within ~5 minutes
  - Get a Zcash wallet: https://zechub.wiki/wallets`} />

          <h3>Step 5: Lock the Exchange Rate</h3>
          <p>To avoid volatility disputes, agree on a ZEC amount at the time of invoicing. Use a reliable price source like <Link href="https://www.coingecko.com/en/coins/zcash" target="_blank">CoinGecko</Link>.</p>

          <h3>Step 6: Include a QR Code</h3>
          <p>Generate a QR code of your shielded address so clients can scan it from their mobile wallet. This reduces copy-paste errors.</p>

          <H2 id="Client-Onboarding">Client Onboarding: Helping Them Pay</h2>
          <h3>Step 7: Provide a Simple Payment Guide</h3>
          <p>Many clients may be new to Zcash. Include these instructions with your invoice:</p>

          <h3>For Clients New to Zcash</h3>
          <ol>
            <li>Download a Zcash wallet: <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link> (Desktop/Android) or <Link href="https://nighthawkwallet.com/" target="_blank">Nighthawk</Link> (iOS/Android)</li>
            <li>Create a wallet and back up your seed phrase</li>
            <li>Buy ZEC from an exchange (Coinbase, Kraken, etc.)</li>
            <li>Send ZEC to your wallet&apos;s shielded address first</li>
            <li>From your shielded balance, send payment to the invoice address</li>
          </ol>

          <div className="rounded-md border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm my-4">
            <strong>💡 Pro Tip:</strong> If your client already has ZEC on an exchange, they should withdraw to their own shielded wallet first, then send to your shielded address. This maximizes privacy for both parties.
          </div>

          <H2 id="Track-Payments-Privately">Track Payments Privately</h2>
          <h3>Step 8: Use Memos for Invoice Matching</h3>
          <p>Shielded Zcash transactions support encrypted memos. Ask clients to include the invoice number as a memo so you can match payments to invoices easily.</p>

          <h3>Step 9: Keep Private Records</h3>
          <p>Maintain a spreadsheet or accounting software that tracks:</p>
          <ul>
            <li>Invoice number and date</li>
            <li>Client name (stored securely)</li>
            <li>ZEC amount received</li>
            <li>Transaction ID (for your records only)</li>
            <li>USD value at time of payment (for taxes)</li>
          </ul>

          <H2 id="Convert-ZEC-to-Fiat">Convert ZEC to Local Currency</h2>
          <h3>Step 10: Choose an Exchange</h3>
          <p>When you need to convert ZEC to fiat currency:</p>
          <ul>
            <li><strong>KYC Exchanges:</strong> Kraken, Coinbase — require identity verification</li>
            <li><strong>Non-KYC Options:</strong> Some decentralized exchanges and P2P platforms allow conversion without KYC</li>
            <li><strong>ZecSwap and DEXs:</strong> Check <Link href="https://zechub.wiki/decentralized-exchanges" target="_blank">ZecHub DEX List</Link> for current options</li>
          </ul>

          <h3>Step 11: Shield Before Converting</h3>
          <p>Always send your ZEC from your freelance wallet to a shielded address before converting. This prevents the exchange from seeing your full transaction history.</p>

          <H2 id="Tax-Considerations">Tax Considerations</h2>
          <div className="rounded-md border border-red-300/40 bg-red-50 dark:bg-red-900/20 p-4 text-sm my-4">
            <strong>⚠️ Disclaimer:</strong> This is not tax advice. Consult a tax professional in your jurisdiction.
          </div>
          <ul>
            <li>Cryptocurrency income is typically taxable in most jurisdictions</li>
            <li>Record the fair market value (USD) at the time of each payment</li>
            <li>Privacy features don&apos;t exempt you from tax obligations</li>
            <li>Keep thorough records for tax filing purposes</li>
          </ul>

          <H2 id="Advanced-Privacy-Tips">Advanced Privacy Tips</h2>
          <ul>
            <li><strong>Use separate addresses per client</strong> — generate a new shielded address for each client to prevent linking payments</li>
            <li><strong>Don&apos;t reuse your freelance address</strong> for personal transactions</li>
            <li><strong>Shield immediately</strong> — if a client sends to a transparent address by mistake, shield the funds right away</li>
            <li><strong>Consider BTCPay Server</strong> — for high-volume invoicing, see our <Link href="/guides/btcpay-zcash">BTCPay Server guide</Link></li>
            <li><strong>Use encrypted communication</strong> — send invoices via encrypted email or Signal, not plain text</li>
          </ul>

          <H2 id="Next-Steps">Next Steps</h2>
          <p>Ready to scale your privacy setup? Learn how to <Link href="/zcash-use-case/accept-merchant-payments">accept payments as a merchant</Link> with automated invoicing and checkout.</p>

          <H2 id="Resources">Resources</h2>
          <ul>
            <li><Link href="https://zechub.wiki/wallets" target="_blank">Zcash Wallet Compatibility List</Link></li>
            <li><Link href="https://ywallet.app/installation" target="_blank">YWallet Download</Link></li>
            <li><Link href="https://zingolabs.org/" target="_blank">Zingo! Wallet Download</Link></li>
            <li><Link href="https://nighthawkwallet.com/" target="_blank">Nighthawk Wallet Download</Link></li>
            <li><Link href="/guides/btcpay-zcash">BTCPay Server with Zcash Support</Link></li>
            <li><Link href="/zcash-use-case/send-money-privately">← Previous: Send Money Privately</Link></li>
            <li><Link href="/zcash-use-case/accept-merchant-payments">Next: Accept Merchant Payments →</Link></li>
          </ul>
        </article>
      </div>
    </div>
  );
}

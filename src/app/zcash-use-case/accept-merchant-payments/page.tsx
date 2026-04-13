/* src/app/zcash-use-case/accept-merchant-payments/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accept Zcash Payments as a Merchant — Intermediate Guide",
  description:
    "Configure your store to accept Zcash via BTCPay Server or direct wallet integration. Shielded payments keep your sales data private from competitors and data brokers.",
  openGraph: {
    title: "Accept Zcash Payments as a Merchant",
    description:
      "Set up your online or physical store to accept private Zcash payments using BTCPay Server or wallet integration.",
    type: "article",
    url: "https://zechub.wiki/zcash-use-case/accept-merchant-payments",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accept Zcash Payments as a Merchant",
    description:
      "Set up your store to accept private Zcash payments using BTCPay Server or wallet integration.",
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
  { id: "Why-Merchants-Choose-Zcash", label: "Why Merchants Choose Zcash" },
  { id: "Choose-Your-Payment-Setup", label: "Choose Your Payment Setup" },
  { id: "BTCPay-Server-Setup", label: "BTCPay Server Setup (Recommended)" },
  { id: "Direct-Wallet-Integration", label: "Direct Wallet Integration (Simple)" },
  { id: "In-Store-Payments", label: "In-Store / POS Payments" },
  { id: "E-Commerce-Integration", label: "E-Commerce Platform Integration" },
  { id: "Pricing-and-Volatility", label: "Pricing and Volatility Management" },
  { id: "Reconciling-Payments", label: "Reconciling Payments Privately" },
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
          🏪 Accept Payments as a Merchant with Zcash
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          Configure your store to accept Zcash via BTCPay Server or direct wallet integration.
          Shielded payments keep your sales data private from competitors and data brokers.
        </p>
        <div className="mt-4 rounded-md border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm">
          <strong>🟡 Intermediate Level:</strong> Assumes familiarity with basic Zcash sending/receiving. This guide covers merchant setups from simple to advanced.
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
          <H2 id="Why-Merchants-Choose-Zcash">Why Merchants Choose Zcash</h2>
          <p>On transparent blockchains, your competitors can see:</p>
          <ul>
            <li>Your total revenue from public address analysis</li>
            <li>Your customer base and payment patterns</li>
            <li>Your pricing and discount strategies</li>
            <li>Your supplier relationships from outgoing payments</li>
          </ul>
          <p><strong>Zcash shielded payments hide all of this.</strong> Your sales volume, customer list, and financial relationships stay private — while you still get the benefits of fast, global, trustless payments.</p>

          <h4>Benefits for Merchants</h4>
          <ul>
            <li><strong>No chargebacks:</strong> Zcash transactions are irreversible</li>
            <li><strong>Low fees:</strong> Fraction-of-a-cent transaction fees</li>
            <li><strong>Global reach:</strong> Accept payments from anywhere in the world</li>
            <li><strong>No intermediaries:</strong> Payments go directly to your wallet</li>
            <li><strong>Private:</strong> Sales data invisible to competitors and data brokers</li>
          </ul>

          <H2 id="Choose-Your-Payment-Setup">Choose Your Payment Setup</h2>
          <p>You have two main options for accepting Zcash as a merchant:</p>

          <div className="my-6 overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-2 px-3 font-semibold">Feature</th>
                  <th className="text-left py-2 px-3 font-semibold">BTCPay Server</th>
                  <th className="text-left py-2 px-3 font-semibold">Direct Wallet</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <td className="py-2 px-3">Auto-generated invoices</td>
                  <td className="py-2 px-3">✅ Yes</td>
                  <td className="py-2 px-3">❌ Manual</td>
                </tr>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <td className="py-2 px-3">Payment detection</td>
                  <td className="py-2 px-3">✅ Automatic</td>
                  <td className="py-2 px-3">⚠️ Manual check</td>
                </tr>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <td className="py-2 px-3">E-commerce integration</td>
                  <td className="py-2 px-3">✅ WooCommerce, etc.</td>
                  <td className="py-2 px-3">❌ None</td>
                </tr>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <td className="py-2 px-3">Setup complexity</td>
                  <td className="py-2 px-3">Medium</td>
                  <td className="py-2 px-3">Easy</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Best for</td>
                  <td className="py-2 px-3">Online stores, high volume</td>
                  <td className="py-2 px-3">Simple shops, low volume</td>
                </tr>
              </tbody>
            </table>
          </div>

          <H2 id="BTCPay-Server-Setup">BTCPay Server Setup (Recommended)</h2>
          <p>For serious merchants, <Link href="/guides/btcpay-zcash">BTCPay Server</Link> is the gold standard. It provides automated invoicing, payment detection, and e-commerce integration — all self-hosted.</p>

          <h3>Step 1: Deploy BTCPay Server</h3>
          <p>Follow our complete <Link href="/guides/btcpay-zcash">BTCPay Server + Zcash guide</Link> for deployment. Key steps:</p>
          <ol>
            <li>Set up a VPS (Ubuntu, 2+ CPU, 4 GB RAM)</li>
            <li>Deploy BTCPay Server with Docker</li>
            <li>Enable the Zcash plugin</li>
            <li>Connect your Zcash viewing key</li>
          </ol>

          <h3>Step 2: Create a Store</h3>
          <p>In the BTCPay dashboard:</p>
          <ol>
            <li>Create a new store</li>
            <li>Set your default currency (USD, EUR, etc.)</li>
            <li>Enable ZEC as a payment method</li>
            <li>Configure your exchange rate source</li>
          </ol>

          <h3>Step 3: Generate Payment Requests</h3>
          <p>BTCPay generates unique invoices with:</p>
          <ul>
            <li>A unique shielded address per order</li>
            <li>Real-time exchange rate conversion</li>
            <li>A payment timer (typically 15 minutes)</li>
            <li>Automatic payment detection</li>
          </ul>

          <H2 id="Direct-Wallet-Integration">Direct Wallet Integration (Simple)</h2>
          <p>For smaller operations, you can accept Zcash directly using a wallet.</p>

          <h3>Step 1: Set Up Your Merchant Wallet</h3>
          <p>Use <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link> for desktop management. Create a dedicated wallet for business transactions.</p>

          <h3>Step 2: Generate Unique Addresses</h3>
          <p>Generate a new shielded address for each order. This lets you track which customer paid which order.</p>

          <h3>Step 3: Display Payment Details</h3>
          <p>Show the address and amount on your checkout page or send it via email/message:</p>
          <CodeBlock language="text" code={`Order #12345
Amount: 50.00 USD = 0.50 ZEC
ZEC Address: zs1customer-unique-address
Please send within 30 minutes.`} />

          <h3>Step 4: Confirm Payment Manually</h3>
          <p>Check your wallet periodically for incoming transactions. Match the amount to the order.</p>

          <H2 id="In-Store-Payments">In-Store / POS Payments</h2>
          <p>For physical stores, you can accept Zcash at the point of sale:</p>

          <h3>Option A: BTCPay Server POS Mode</h3>
          <p>BTCPay Server has a built-in Point of Sale interface:</p>
          <ol>
            <li>Open the POS view on a tablet or computer</li>
            <li>Enter the sale amount</li>
            <li>Show the QR code to the customer</li>
            <li>Wait for confirmation (~2–5 minutes)</li>
          </ol>

          <h3>Option B: Mobile Wallet</h3>
          <p>Use <Link href="https://zingolabs.org/" target="_blank">Zingo!</Link> or <Link href="https://nighthawkwallet.com/" target="_blank">Nighthawk</Link> on your phone to display a QR code for in-person payments.</p>

          <div className="rounded-md border border-blue-300/40 bg-blue-50 dark:bg-blue-900/20 p-4 text-sm my-4">
            <strong>💡 Tip:</strong> For small in-store purchases, you might accept transparent payments (<code>t1</code> addresses) for speed, then immediately shield the funds to your <code>zs1</code> address. For larger purchases, insist on shielded payments.
          </div>

          <H2 id="E-Commerce-Integration">E-Commerce Platform Integration</h2>
          <h3>WooCommerce (WordPress)</h3>
          <ol>
            <li>Install the BTCPay Server plugin for WooCommerce</li>
            <li>Connect to your BTCPay Server instance</li>
            <li>Enable ZEC as a payment method in WooCommerce settings</li>
            <li>Customers see a Zcash payment option at checkout</li>
          </ol>

          <h3>Other Platforms</h3>
          <p>BTCPay Server has plugins for Shopify (via custom integration), Magento, and custom websites using their API. See the <Link href="/guides/btcpay-zcash">BTCPay guide</Link> for details.</p>

          <H2 id="Pricing-and-Volatility">Pricing and Volatility Management</h2>
          <h3>Lock Exchange Rates at Checkout</h3>
          <p>BTCPay Server locks the exchange rate for 15 minutes (configurable). The customer pays the ZEC amount shown on the invoice.</p>

          <h3>Auto-Convert to Stablecoin (Optional)</h3>
          <p>If you want to avoid ZEC volatility, you can periodically convert ZEC to a stablecoin using <Link href="https://zechub.wiki/decentralized-exchanges" target="_blank">decentralized exchanges</Link>.</p>

          <H2 id="Reconciling-Payments">Reconciling Payments Privately</h2>
          <h3>Using Viewing Keys for Accounting</h3>
          <p>If you use <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link>, export a viewing key to a separate accounting wallet. This lets you:</p>
          <ul>
            <li>See incoming payments without spending capability</li>
            <li>Reconcile orders with payments safely</li>
            <li>Share read-only access with your accountant</li>
          </ul>

          <h3>Keep Private Records</h3>
          <ul>
            <li>Log each order with its unique ZEC address</li>
            <li>Record the USD value at time of payment</li>
            <li>Store transaction IDs for your records (not public)</li>
            <li>Use encrypted storage for your financial records</li>
          </ul>

          <H2 id="Next-Steps">Next Steps</h2>
          <p>Ready for the next level? Learn how to <Link href="/zcash-use-case/private-community-treasury">run a private community treasury</Link> with multi-sig controls and governance.</p>

          <H2 id="Resources">Resources</h2>
          <ul>
            <li><Link href="/guides/btcpay-zcash">BTCPay Server with Zcash — Full Guide</Link></li>
            <li><Link href="https://zechub.wiki/wallets" target="_blank">Zcash Wallet Compatibility List</Link></li>
            <li><Link href="https://ywallet.app/installation" target="_blank">YWallet Download</Link></li>
            <li><Link href="https://zingolabs.org/" target="_blank">Zingo! Wallet Download</Link></li>
            <li><Link href="https://nighthawkwallet.com/" target="_blank">Nighthawk Wallet Download</Link></li>
            <li><Link href="/zcash-use-case/freelancer-privacy-setup">← Previous: Freelancer Privacy Setup</Link></li>
            <li><Link href="/zcash-use-case/private-community-treasury">Next: Private Community Treasury →</Link></li>
          </ul>
        </article>
      </div>
    </div>
  );
}

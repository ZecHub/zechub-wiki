/* src/app/zcash-use-case/receive-donations-privately/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Receive Donations Privately with Zcash — Beginner Guide",
  description:
    "Set up a shielded Zcash address to receive donations without exposing your identity, donor information, or financial history. Step-by-step guide for nonprofits, creators, and mutual-aid organizers.",
  openGraph: {
    title: "Receive Donations Privately with Zcash",
    description:
      "Step-by-step guide to receiving Zcash donations privately using shielded addresses. Protect both donor and recipient privacy.",
    type: "article",
    url: "https://zechub.wiki/zcash-use-case/receive-donations-privately",
  },
  twitter: {
    card: "summary_large_image",
    title: "Receive Donations Privately with Zcash",
    description:
      "Step-by-step guide to receiving Zcash donations privately using shielded addresses.",
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
  { id: "Why-Receive-Donations-with-Zcash", label: "Why Receive Donations with Zcash" },
  { id: "Choose-a-Zcash-Wallet", label: "Choose a Zcash Wallet" },
  { id: "Set-Up-Your-Wallet", label: "Set Up Your Wallet" },
  { id: "Generate-a-Shielded-Receiving-Address", label: "Generate a Shielded Receiving Address" },
  { id: "Share-Your-Donation-Address", label: "Share Your Donation Address" },
  { id: "Verify-Incoming-Donations", label: "Verify Incoming Donations" },
  { id: "Best-Practices-for-Privacy", label: "Best Practices for Privacy" },
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
          🤝 Receive Donations Privately with Zcash
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          A beginner&apos;s guide to receiving donations using Zcash shielded addresses — protecting both your privacy and your donors&apos; privacy.
        </p>
        <div className="mt-4 rounded-md border border-green-300/40 bg-green-50 dark:bg-green-900/20 p-4 text-sm">
          <strong>🟢 Beginner Level:</strong> No prior Zcash experience needed. You&apos;ll have a working donation setup in under 15 minutes.
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
          <H2 id="Why-Receive-Donations-with-Zcash">Why Receive Donations with Zcash</H2>
          <p>When you receive donations on a transparent blockchain like Bitcoin or Ethereum, every transaction is publicly visible. Donor identities can potentially be linked, donation amounts become public, and your total fundraising becomes traceable.</p>
          <p><strong>Zcash solves this with shielded (private) addresses.</strong> Using zk-SNARK technology, shielded transactions hide the sender, recipient, and amount on-chain. Only you and your donors know the details.</p>

          <h4>Who This Is For</h4>
          <ul>
            <li>Nonprofit organizations that want donor privacy</li>
            <li>Content creators and streamers accepting crypto donations</li>
            <li>Mutual-aid groups and community organizers</li>
            <li>Political activists in restrictive environments</li>
            <li>Anyone who values financial privacy for their supporters</li>
          </ul>

          <H2 id="Choose-a-Zcash-Wallet">Choose a Zcash Wallet</H2>
          <p>First, you need a Zcash wallet that supports <strong>shielded addresses</strong> (starting with <code>zs1</code>). Here are the top recommendations:</p>

          <div className="my-6 overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-2 px-3 font-semibold">Wallet</th>
                  <th className="text-left py-2 px-3 font-semibold">Platform</th>
                  <th className="text-left py-2 px-3 font-semibold">Shielded Support</th>
                  <th className="text-left py-2 px-3 font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <td className="py-2 px-3"><Link href="https://ywallet.app/installation" target="_blank">YWallet</Link></td>
                  <td className="py-2 px-3">Android, Desktop</td>
                  <td className="py-2 px-3">✅ Full Orchard + Sapling</td>
                  <td className="py-2 px-3">Power users, viewing keys</td>
                </tr>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <td className="py-2 px-3"><Link href="https://zingolabs.org/" target="_blank">Zingo!</Link></td>
                  <td className="py-2 px-3">Android</td>
                  <td className="py-2 px-3">✅ Sapling + Orchard</td>
                  <td className="py-2 px-3">Mobile-first simplicity</td>
                </tr>
                <tr>
                  <td className="py-2 px-3"><Link href="https://nighthawkwallet.com/" target="_blank">Nighthawk</Link></td>
                  <td className="py-2 px-3">Android, iOS</td>
                  <td className="py-2 px-3">✅ Sapling</td>
                  <td className="py-2 px-3">iOS users</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>See the full list at <Link href="https://zechub.wiki/wallets" target="_blank">ZecHub Wallet Compatibility</Link>.</p>

          <H2 id="Set-Up-Your-Wallet">Set Up Your Wallet</H2>
          <h3>Step 1: Download and Install</h3>
          <p>Download your chosen wallet from the official sources above. Verify the download if checksums are provided.</p>

          <h3>Step 2: Create a New Wallet</h3>
          <p>Open the wallet and select &quot;Create New Wallet.&quot; You will be given a <strong>seed phrase</strong> (usually 24 words).</p>

          <div className="rounded-md border border-red-300/40 bg-red-50 dark:bg-red-900/20 p-4 text-sm my-4">
            <strong>⚠️ Critical:</strong> Write down your seed phrase on paper and store it securely. Never store it digitally or share it with anyone. This is the only way to recover your wallet.
          </div>

          <h3>Step 3: Wait for Sync</h3>
          <p>After creating your wallet, it needs to sync with the Zcash blockchain. This may take a few minutes on mobile. Desktop wallets with full nodes may take longer.</p>

          <H2 id="Generate-a-Shielded-Receiving-Address">Generate a Shielded Receiving Address</h2>
          <h3>Step 4: Find Your Shielded Address</h3>
          <p>In your wallet, navigate to the <strong>Receive</strong> screen. Make sure you are generating a <strong>shielded address</strong> (starts with <code>zs1</code> for Orchard or <code>zs1</code> for Sapling).</p>

          <div className="rounded-md border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm my-4">
            <strong>💡 Tip:</strong> Always use shielded addresses (<code>zs1...</code>) for receiving donations. Transparent addresses (<code>t1...</code>) reveal all transaction details on-chain.
          </div>

          <h3>Step 5: Copy and Save Your Address</h3>
          <p>Copy your shielded address. You can use this address publicly — it won&apos;t reveal the amounts you receive or link transactions together.</p>
          <CodeBlock language="text" code={`Your shielded address looks like this:\nzs1abcdefghijklmnopqrstuvwxyz0123456789abcdef0123456789abcdef012345`} />

          <H2 id="Share-Your-Donation-Address">Share Your Donation Address</h2>
          <h3>Step 6: Add to Your Website or Social Media</h3>
          <p>You can display your shielded Zcash address publicly. Unlike transparent blockchains, this doesn&apos;t expose your financial history.</p>

          <h3>Step 7: Create a Donation Button</h3>
          <p>Here&apos;s a simple HTML snippet you can add to your website:</p>
          <CodeBlock language="html" code={`<div style="border: 1px solid #ccc; padding: 16px; border-radius: 8px; max-width: 400px;">
  <h3>🤝 Support Us with Zcash</h3>
  <p>We accept Zcash for private, secure donations.</p>
  <p><strong>Shielded Address:</strong></p>
  <code style="word-break: break-all; background: #f5f5f5; padding: 4px 8px; border-radius: 4px;">
    zs1your-shielded-address-here
  </code>
  <p style="margin-top: 12px; font-size: 0.9em; color: #666;">
    <a href="https://zechub.wiki/wallets">Get a Zcash wallet</a> if you don&apos;t have one.
  </p>
</div>`} />

          <h3>Step 8: QR Code (Optional)</h3>
          <p>Generate a QR code of your address using any QR generator. Most Zcash wallets can also scan QR codes for sending.</p>

          <H2 id="Verify-Incoming-Donations">Verify Incoming Donations</h2>
          <h3>Step 9: Check Your Balance</h3>
          <p>Open your wallet to view your shielded balance. Incoming donations will appear once confirmed (typically within a few minutes on Zcash).</p>

          <h3>Step 10: View Transaction History</h3>
          <p>Your wallet shows your incoming and outgoing shielded transactions. Note that only <em>you</em> can see these — they are not publicly visible on the blockchain.</p>

          <div className="rounded-md border border-blue-300/40 bg-blue-50 dark:bg-blue-900/20 p-4 text-sm my-4">
            <strong>🔍 Block Explorer:</strong> You can verify transactions on <Link href="https://zec.rocks/" target="_blank">zec.rocks</Link> by searching your transaction ID, though only the sender can link transactions to your address.
          </div>

          <H2 id="Best-Practices-for-Privacy">Best Practices for Privacy</h2>
          <ul>
            <li><strong>Always receive to shielded addresses</strong> — never <code>t1</code> transparent addresses</li>
            <li><strong>Rotate addresses periodically</strong> — generate new addresses for different campaigns to prevent linking</li>
            <li><strong>Shield incoming funds</strong> — if you ever receive to a transparent address, immediately send to your shielded address</li>
            <li><strong>Use Orchard</strong> — prefer Orchard (<code>zs1</code>) addresses over Sapling for the latest privacy technology</li>
            <li><strong>Back up your seed phrase</strong> — store copies in multiple secure locations</li>
            <li><strong>Consider a dedicated device</strong> — use a separate phone or computer for your donation wallet</li>
          </ul>

          <H2 id="Next-Steps">Next Steps</h2>
          <p>Now that you can receive donations privately, learn how to <Link href="/zcash-use-case/send-money-privately">send money privately</Link> to vendors, freelancers, or other recipients without linking your identity.</p>

          <H2 id="Resources">Resources</h2>
          <ul>
            <li><Link href="https://zechub.wiki/wallets" target="_blank">Zcash Wallet Compatibility List</Link></li>
            <li><Link href="https://ywallet.app/installation" target="_blank">YWallet Download</Link></li>
            <li><Link href="https://zingolabs.org/" target="_blank">Zingo! Wallet Download</Link></li>
            <li><Link href="https://nighthawkwallet.com/" target="_blank">Nighthawk Wallet Download</Link></li>
            <li><Link href="https://zecash.net/" target="_blank">Zcash Protocol Documentation</Link></li>
            <li><Link href="/zcash-use-case/send-money-privately">Next Guide: Send Money Privately →</Link></li>
          </ul>
        </article>
      </div>
    </div>
  );
}

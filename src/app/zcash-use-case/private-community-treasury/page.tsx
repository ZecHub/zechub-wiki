/* src/app/zcash-use-case/private-community-treasury/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Run a Private Community Treasury with Zcash — Advanced Guide",
  description:
    "Manage a shared Zcash treasury with multi-sig controls, shielded accounting, and transparent governance — without exposing the full balance on-chain.",
  openGraph: {
    title: "Run a Private Community Treasury with Zcash",
    description:
      "Set up a shielded community treasury with multi-sig, governance, and private financial management.",
    type: "article",
    url: "https://zechub.wiki/zcash-use-case/private-community-treasury",
  },
  twitter: {
    card: "summary_large_image",
    title: "Run a Private Community Treasury with Zcash",
    description:
      "Set up a shielded community treasury with multi-sig, governance, and private financial management.",
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
  { id: "What-is-a-Community-Treasury", label: "What is a Community Treasury" },
  { id: "Treasury-Architecture", label: "Treasury Architecture" },
  { id: "Multi-Signature-Setup", label: "Multi-Signature Setup" },
  { id: "Shielded-Treasury-Wallet", label: "Shielded Treasury Wallet" },
  { id: "Governance-and-Voting", label: "Governance and Voting" },
  { id: "Disbursing-Funds", label: "Disbursing Funds" },
  { id: "Transparent-Reporting", label: "Transparent Reporting (Without Exposing Everything)" },
  { id: "Security-Considerations", label: "Security Considerations" },
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
          🏛️ Run a Private Community Treasury with Zcash
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          Manage a shared Zcash treasury with multi-sig controls, shielded accounting, and transparent governance — without exposing the full balance on-chain.
        </p>
        <div className="mt-4 rounded-md border border-red-300/40 bg-red-50 dark:bg-red-900/20 p-4 text-sm">
          <strong>🔴 Advanced Level:</strong> Requires deep understanding of Zcash wallets, OPSEC, and multi-party coordination. Not for beginners.
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
          <H2 id="What-is-a-Community-Treasury">What is a Community Treasury</h2>
          <p>A community treasury is a shared fund managed by a group — used for:</p>
          <ul>
            <li>Funding open-source development</li>
            <li>Supporting community grants and bounties</li>
            <li>Emergency reserves for DAOs or organizations</li>
            <li>Charitable donations with collective decision-making</li>
          </ul>
          <p><strong>The challenge:</strong> On transparent blockchains, the entire treasury balance is public. Competitors, attackers, and speculators can see exactly how much you have and track every transaction.</p>
          <p><strong>Zcash solves this with shielded addresses.</strong> Your treasury balance and transaction history remain private, while you maintain accountability through internal reporting and governance processes.</p>

          <H2 id="Treasury-Architecture">Treasury Architecture</h2>
          <h3>Recommended Setup</h3>
          <ol>
            <li><strong>Cold storage wallet:</strong> Primary treasury wallet on an air-gapped device</li>
            <li><strong>Hot wallet:</strong> Small operational wallet for day-to-day expenses</li>
            <li><strong>Viewing key:</strong> Shared with auditors and governance participants for transparency</li>
            <li><strong>Governance system:</strong> On-chain or off-chain voting for fund allocation</li>
          </ol>

          <H2 id="Multi-Signature-Setup">Multi-Signature Setup</h2>
          <p>Multi-signature (multi-sig) requires multiple parties to approve transactions, preventing any single person from draining the treasury.</p>

          <h3>Zcash Multi-Sig Options</h3>
          <div className="rounded-md border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm my-4">
            <strong>⚠️ Current Limitation:</strong> Native Zcash multi-sig for shielded addresses is still evolving. Current approaches use wallet-level coordination or external tools. Always verify the latest status at <Link href="https://zechub.wiki/wallets" target="_blank">ZecHub Wallets</Link>.
          </div>

          <h3>Approach 1: Wallet-Level Multi-Party Coordination</h3>
          <ol>
            <li>Use <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link> which supports viewing keys and partial transaction signing</li>
            <li>Set up a shared viewing key for all signers to monitor the treasury</li>
            <li>Establish a governance process where multiple signers must approve before any single signer sends funds</li>
            <li>Document all approvals in your governance records</li>
          </ol>

          <h3>Approach 2: Hardware Security Module (HSM)</h3>
          <p>For larger treasuries, consider using an HSM to store keys and require multiple authorizations:</p>
          <ul>
            <li>Deploy an HSM (e.g., Ledger, Trezor, or enterprise HSM)</li>
            <li>Distribute authorization tokens to multiple signers</li>
            <li>Require M-of-N signatures for any transaction</li>
          </ul>

          <H2 id="Shielded-Treasury-Wallet">Shielded Treasury Wallet</h2>
          <h3>Step 1: Create the Treasury Wallet</h3>
          <p>Use <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link> to create a dedicated treasury wallet:</p>
          <ol>
            <li>Install YWallet on an air-gapped (offline) computer</li>
            <li>Create a new wallet and record the 24-word seed phrase</li>
            <li>Store the seed phrase in a fireproof safe or safety deposit box</li>
            <li>Generate a shielded address (<code>zs1...</code>) for receiving donations</li>
          </ol>

          <h3>Step 2: Generate a Viewing Key</h3>
          <p>Export a viewing key to share with governance participants:</p>
          <ul>
            <li>In YWallet, go to Settings → Export Viewing Key</li>
            <li>Share the viewing key with authorized auditors only</li>
            <li>Auditors can see incoming and outgoing transactions but cannot spend</li>
          </ul>

          <h3>Step 3: Set Up Operational Hot Wallet</h3>
          <p>Create a separate hot wallet with a small balance for routine operations:</p>
          <ul>
            <li>Fund the hot wallet from the cold treasury (shielded → shielded)</li>
            <li>Set a maximum balance (e.g., 5% of total treasury)</li>
            <li>Use <Link href="https://zingolabs.org/" target="_blank">Zingo!</Link> for mobile access</li>
          </ul>

          <H2 id="Governance-and-Voting">Governance and Voting</h2>
          <h3>On-Chain Governance</h3>
          <p>Some Zcash community projects use on-chain voting mechanisms. Check the <Link href="https://zechub.wiki/" target="_blank">ZecHub wiki</Link> for current community governance tools.</p>

          <h3>Off-Chain Governance (Recommended)</h3>
          <ol>
            <li><strong>Proposal submission:</strong> Anyone can submit a funding proposal</li>
            <li><strong>Discussion period:</strong> 7–14 days for community feedback</li>
            <li><strong>Voting:</strong> Token-weighted or one-person-one-vote via Snapshot or similar</li>
            <li><strong>Execution:</strong> If approved, treasury signers execute the payment</li>
          </ol>

          <h3>Example Proposal Format</h3>
          <CodeBlock language="text" code={`Treasury Proposal #42
Title: Q2 Developer Grants
Requested: 100 ZEC
Recipient: zs1developer-shielded-address
Justification: Fund 3 developers for 2 months
Voting deadline: 2024-02-15
Status: Approved (78% yes, 22% no)
Executed: 2024-02-16 (TX ID: recorded internally)`} />

          <H2 id="Disbursing-Funds">Disbursing Funds</h2>
          <h3>Step 4: Transfer from Cold to Hot</h3>
          <p>When a payment is approved:</p>
          <ol>
            <li>Access the cold storage wallet</li>
            <li>Send the approved amount to the hot wallet (shielded → shielded)</li>
            <li>Record the transaction in your internal ledger</li>
          </ol>

          <h3>Step 5: Send to Recipient</h3>
          <p>From the hot wallet, send to the approved recipient&apos;s shielded address:</p>
          <ul>
            <li>Use <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link> or <Link href="https://zingolabs.org/" target="_blank">Zingo!</Link></li>
            <li>Include a memo identifying the payment (e.g., &quot;Grant #42&quot;)</li>
            <li>Record the transaction ID in your governance records</li>
          </ul>

          <H2 id="Transparent-Reporting">Transparent Reporting (Without Exposing Everything)</h2>
          <p>You can maintain accountability without making your full treasury public:</p>

          <h3>Quarterly Transparency Reports</h3>
          <ul>
            <li>Publish total income and expenses (without revealing individual transactions)</li>
            <li>List approved grants and recipients (community can verify independently)</li>
            <li>Provide a viewing key to a trusted auditor who confirms the balance</li>
            <li>The auditor publishes a confirmation without revealing specific amounts</li>
          </ul>

          <h3>Internal Ledger</h3>
          <p>Maintain an encrypted ledger with:</p>
          <ul>
            <li>All transaction IDs</li>
            <li>Amounts and purposes</li>
            <li>Approval records</li>
            <li>Current balance</li>
          </ul>

          <H2 id="Security-Considerations">Security Considerations</h2>
          <ul>
            <li><strong>Air-gap the cold wallet:</strong> Never connect the cold storage device to the internet</li>
            <li><strong>Multi-party key distribution:</strong> Split seed phrase storage among trusted parties</li>
            <li><strong>Regular audits:</strong> Schedule periodic reviews by independent auditors</li>
            <li><strong>Incident response plan:</strong> Have a plan for compromised keys or unauthorized access</li>
            <li><strong>Operational security:</strong> Use secure communication channels for treasury discussions</li>
            <li><strong>Backup keys securely:</strong> Use metal seed plates for physical durability</li>
          </ul>

          <div className="rounded-md border border-red-300/40 bg-red-50 dark:bg-red-900/20 p-4 text-sm my-4">
            <strong>🔴 Critical:</strong> Never store your treasury seed phrase digitally. Use physical backups (paper, metal plates) in multiple secure locations.
          </div>

          <H2 id="Next-Steps">Next Steps</h2>
          <p>The final guide covers the most demanding privacy scenario: <Link href="/zcash-use-case/journalist-privacy-setup">Journalist Privacy Setup</Link> — a complete OPSEC guide for high-risk use cases.</p>

          <H2 id="Resources">Resources</h2>
          <ul>
            <li><Link href="https://zechub.wiki/wallets" target="_blank">Zcash Wallet Compatibility List</Link></li>
            <li><Link href="https://ywallet.app/installation" target="_blank">YWallet Download</Link></li>
            <li><Link href="https://zingolabs.org/" target="_blank">Zingo! Wallet Download</Link></li>
            <li><Link href="/zcash-use-case/accept-merchant-payments">← Previous: Accept Merchant Payments</Link></li>
            <li><Link href="/zcash-use-case/journalist-privacy-setup">Next: Journalist Privacy Setup →</Link></li>
          </ul>
        </article>
      </div>
    </div>
  );
}

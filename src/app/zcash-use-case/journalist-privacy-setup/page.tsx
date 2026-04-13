/* src/app/zcash-use-case/journalist-privacy-setup/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Journalist Privacy Setup with Zcash — Advanced OPSEC Guide",
  description:
    "A complete OPSEC guide for journalists: shielded Zcash payments, source protection, secure communications, and operational security best practices.",
  openGraph: {
    title: "Journalist Privacy Setup with Zcash",
    description:
      "Complete OPSEC guide for journalists using Zcash — source protection, shielded payments, secure communications, and digital security.",
    type: "article",
    url: "https://zechub.wiki/zcash-use-case/journalist-privacy-setup",
  },
  twitter: {
    card: "summary_large_image",
    title: "Journalist Privacy Setup with Zcash",
    description:
      "Complete OPSEC guide for journalists using Zcash — source protection, shielded payments, secure communications.",
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
  { id: "Why-Journalists-Need-Zcash", label: "Why Journalists Need Zcash" },
  { id: "Threat-Modeling", label: "Threat Modeling" },
  { id: "Device-and-Communication-Security", label: "Device and Communication Security" },
  { id: "Source-Protection-Payments", label: "Protecting Sources Through Payments" },
  { id: "Receiving-Secure-Tips", label: "Receiving Secure Tips and Payments" },
  { id: "Paying-Sources-Safely", label: "Paying Sources Safely" },
  { id: "Emergency-Protocols", label: "Emergency Protocols" },
  { id: "OPSEC-Checklist", label: "OPSEC Checklist" },
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
          🛡️ Journalist Privacy Setup with Zcash
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          A complete OPSEC guide for journalists: shielded Zcash payments, source protection, secure communications, and operational security best practices.
        </p>
        <div className="mt-4 rounded-md border border-red-300/40 bg-red-50 dark:bg-red-900/20 p-4 text-sm">
          <strong>🔴 Advanced Level:</strong> This guide covers high-risk scenarios. Always assess your specific threat model before implementing these measures.
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
          <H2 id="Why-Journalists-Need-Zcash">Why Journalists Need Zcash</H2>
          <p>Journalists face unique financial privacy challenges:</p>
          <ul>
            <li><strong>Source protection:</strong> Paying sources or receiving tips via transparent blockchains creates a permanent public record linking identities</li>
            <li><strong>Financial surveillance:</strong> Adversaries (governments, corporations, criminals) can trace payment flows to identify sources and collaborators</li>
            <li><strong>Asset protection:</strong> In hostile environments, visible cryptocurrency holdings can make you a target for seizure or extortion</li>
            <li><strong>Press freedom:</strong> Financial privacy is essential for investigative journalism, especially when covering powerful interests</li>
          </ul>
          <p><strong>Zcash provides the strongest available financial privacy technology.</strong> Shielded transactions using zk-SNARKs hide sender, recipient, and amount — protecting both journalists and their sources.</p>

          <H2 id="Threat-Modeling">Threat Modeling</H2>
          <p>Before implementing any security measures, identify your threats:</p>

          <H3 id="Assess-Your-Risk-Level">Assess Your Risk Level</H3>
          <ul>
            <li><strong>Low risk:</strong> General reporting, no controversial subjects → Basic shielded wallet is sufficient</li>
            <li><strong>Medium risk:</strong> Investigative reporting, corporate exposure → Full OPSEC with dedicated devices</li>
            <li><strong>High risk:</strong> Conflict zones, state-level adversaries → Air-gapped systems, multi-sig, emergency protocols</li>
          </ul>

          <div className="rounded-md border border-red-300/40 bg-red-50 dark:bg-red-900/20 p-4 text-sm my-4">
            <strong>⚠️ Disclaimer:</strong> This guide provides technical information, not legal advice. Consult with legal counsel and security professionals for your specific situation. Organizations like the <Link href="https://www.cpj.org/" target="_blank">Committee to Protect Journalists</Link> can provide additional resources.
          </div>

          <H2 id="Device-and-Communication-Security">Device and Communication Security</H2>

          <H3 id="Step-1-Dedicated-Device">Step 1: Dedicated Device</H3>
          <p>Use a separate device for Zcash operations:</p>
          <ul>
            <li>A dedicated phone or laptop used only for financial operations</li>
            <li>Never use your personal device for Zcash transactions related to sources</li>
            <li>Keep the device physically secure</li>
            <li>Use full-disk encryption</li>
          </ul>

          <H3 id="Step-2-Secure-Communication-Channels">Step 2: Secure Communication Channels</H3>
          <p>Never discuss financial arrangements over unencrypted channels:</p>
          <ul>
            <li><strong>Signal:</strong> End-to-end encrypted messaging for coordination</li>
            <li><strong>SecureDrop:</strong> For anonymous source communication and document submission</li>
            <li><strong>Tor Browser:</strong> For anonymous browsing and research</li>
            <li><strong>PGP Email:</strong> For encrypted email communication</li>
          </ul>

          <H3 id="Step-3-Compartmentalization">Step 3: Compartmentalization</H3>
          <p>Keep different aspects of your work separate:</p>
          <ul>
            <li>Separate wallets for different projects or sources</li>
            <li>Never reuse addresses across contexts</li>
            <li>Use different communication channels for different sources</li>
          </ul>

          <H2 id="Source-Protection-Payments">Protecting Sources Through Payments</H2>

          <H3 id="The-Fundamental-Rule">The Fundamental Rule</H3>
          <p><strong>Never link a source&apos;s identity to a blockchain transaction.</strong> On transparent blockchains, this is impossible to avoid with direct payments. With Zcash shielded transactions, it&apos;s mathematically prevented.</p>

          <H3 id="How-Zcash-Protects-Sources">How Zcash Protects Sources</H3>
          <ul>
            <li>The source&apos;s shielded address is not publicly linked to their identity</li>
            <li>The amount transferred is not visible on the blockchain</li>
            <li>The transaction timing cannot be linked to your communications</li>
            <li>Even if a source&apos;s device is seized, only they can see their own transaction history</li>
          </ul>

          <H2 id="Receiving-Secure-Tips">Receiving Secure Tips and Payments</H2>

          <H3 id="Step-4-Set-Up-Secure-Receiving">Step 4: Set Up a Secure Receiving System</H3>
          <ol>
            <li>Install <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link> on your dedicated device</li>
            <li>Create a new wallet and back up the seed phrase physically (never digitally)</li>
            <li>Generate a fresh shielded address for tip reception</li>
            <li>Publish this address through a SecureDrop or other anonymous channel</li>
          </ol>

          <H3 id="Step-5-Publish-Your-Tip-Address">Step 5: Publish Your Tip Address Securely</H3>
          <p>Share your shielded Zcash address through anonymous channels:</p>
          <ul>
            <li>Your publication&apos;s SecureDrop instance</li>
            <li>Anonymous social media accounts</li>
            <li>Through trusted intermediaries</li>
          </ul>

          <div className="rounded-md border border-green-300/40 bg-green-50 dark:bg-green-900/20 p-4 text-sm my-4">
            <strong>✅ Best Practice:</strong> Generate a new shielded address for each source. Never reuse addresses. This prevents correlation even if one address is somehow linked to an identity.
          </div>

          <H2 id="Paying-Sources-Safely">Paying Sources Safely</H2>

          <H3 id="Step-6-Obtain-the-Source-Address">Step 6: Obtain the Source&apos;s Shielded Address</H3>
          <p>The source must provide a Zcash shielded address (<code>zs1...</code>):</p>
          <ul>
            <li>Guide them to install <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link>, <Link href="https://zingolabs.org/" target="_blank">Zingo!</Link>, or <Link href="https://nighthawkwallet.com/" target="_blank">Nighthawk</Link></li>
            <li>Instruct them to generate a shielded receiving address</li>
            <li>Communicate the address through encrypted channels only (Signal, PGP)</li>
          </ul>

          <H3 id="Step-7-Send-Funds">Step 7: Send Funds</H3>
          <ol>
            <li>Open your Zcash wallet on your dedicated device</li>
            <li>Enter the source&apos;s shielded address</li>
            <li>Send the agreed amount (shielded → shielded transaction)</li>
            <li>Do not include identifying memos</li>
          </ol>

          <div className="rounded-md border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm my-4">
            <strong>⚠️ Important:</strong> Always send shielded → shielded. Transparent → shielded or shielded → transparent transactions leak partial information on the blockchain.
          </div>

          <H2 id="Emergency-Protocols">Emergency Protocols</H2>

          <H3 id="Duress-Wallet">Duress Wallet</H3>
          <p>Maintain a separate wallet with a small amount of funds that you can reveal if coerced:</p>
          <ul>
            <li>This wallet should look like your primary wallet</li>
            <li>Keep only a small, plausible balance</li>
            <li>Never use this wallet for source-related transactions</li>
          </ul>

          <H3 id="Burn-Procedure">Burn Procedure</H3>
          <p>If your device is compromised or you believe you are being targeted:</p>
          <ol>
            <li>Transfer all funds to a pre-established emergency wallet on a separate device</li>
            <li>Wipe the compromised device</li>
            <li>Generate new wallet addresses on a clean device</li>
            <li>Notify affected sources through alternate secure channels</li>
          </ol>

          <H2 id="OPSEC-Checklist">OPSEC Checklist</H2>
          <CodeBlock language="text" code={`Journalist Zcash OPSEC Checklist
=====================================

DEVICE SECURITY
[ ] Dedicated device for Zcash operations
[ ] Full-disk encryption enabled
[ ] Strong device password / biometric lock
[ ] OS and apps updated regularly
[ ] No personal accounts on this device

WALLET SECURITY
[ ] Shielded-only addresses (zs1...)
[ ] Seed phrase backed up physically (metal plate recommended)
[ ] No digital copies of seed phrase
[ ] Separate wallets per source/project
[ ] Never reuse addresses

COMMUNICATION SECURITY
[ ] Signal for all source communication
[ ] PGP email for formal correspondence
[ ] Tor Browser for research
[ ] No financial discussions on unencrypted channels

TRANSACTION SECURITY
[ ] Always shielded → shielded
[ ] No identifying memos
[ ] Vary transaction timing
[ ] Vary transaction amounts slightly
[ ] Verify recipient address twice before sending

EMERGENCY PREPAREDNESS
[ ] Duress wallet established
[ ] Emergency wallet on separate device
[ ] Burn procedure documented
[ ] Alternate contact methods for sources`} />

          <H2 id="Resources">Resources</H2>
          <ul>
            <li><Link href="https://zechub.wiki/wallets" target="_blank">Zcash Wallet Compatibility List</Link></li>
            <li><Link href="https://ywallet.app/installation" target="_blank">YWallet Download</Link></li>
            <li><Link href="https://zingolabs.org/" target="_blank">Zingo! Wallet Download</Link></li>
            <li><Link href="https://nighthawkwallet.com/" target="_blank">Nighthawk Wallet Download</Link></li>
            <li><Link href="https://www.cpj.org/" target="_blank">Committee to Protect Journalists</Link></li>
            <li><Link href="https://freedom.press/" target="_blank">Freedom of the Press Foundation</Link></li>
            <li><Link href="/zcash-use-case/private-community-treasury">← Previous: Private Community Treasury</Link></li>
          </ul>

          <div className="mt-8 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
            <p className="text-lg font-semibold mb-2">🎓 You&apos;ve Completed the Zcash Privacy Journey</p>
            <p className="text-zinc-600 dark:text-zinc-300">
              You&apos;ve gone from basic receiving to advanced journalist OPSEC. Share these guides, stay safe, and help others discover financial privacy with Zcash.
            </p>
            <div className="mt-4 flex gap-4">
              <Link href="/zcash-use-case" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">&larr; Back to All Use Cases</Link>
              <Link href="https://zechub.wiki" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">ZecHub Wiki →</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

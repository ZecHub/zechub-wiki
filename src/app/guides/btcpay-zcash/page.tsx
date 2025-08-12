/* src/app/guides/btcpay-zcash/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";

export const metadata: Metadata = {
  title:
    "BTCPay Server with Zcash Support: Full Installation and Integration Guide",
  description:
    "End-to-end guide for running BTCPay Server with native Zcash shielded payments: full node (Zebra + lightwalletd), external lightwalletd, Cloudflare Tunnel, and web/API integration.",
  openGraph: {
    title: "BTCPay Server + Zcash — Installation & Integration Guide",
    description:
      "How to deploy BTCPay Server with Zcash shielded payments, connect via viewing keys, run Zebra + lightwalletd, or use an external lightwalletd.",
    type: "article",
    url: "https://zechub.wiki/guides/btcpay-zcash",
  },
  twitter: {
    card: "summary_large_image",
    title: "BTCPay Server + Zcash — Installation & Integration Guide",
    description:
      "How to deploy BTCPay Server with Zcash shielded payments, connect via viewing keys, run Zebra + lightwalletd, or use an external lightwalletd.",
  },
};

/* --- UI helpers --- */
type TocItem = { id: string; label: string; indent?: boolean };

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="select-none text-[11px] tracking-wide uppercase rounded-md border border-zinc-300/70 bg-zinc-100 px-1.5 py-0.5 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // noop
    }
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      className="absolute right-2 top-2 rounded-md border border-zinc-300 bg-white/80 px-2 py-1 text-xs text-zinc-700 backdrop-blur hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200"
      aria-label="Copy to clipboard"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({
  code,
  language = "bash",
}: {
  code: string;
  language?: string;
}) {
  return (
    <div className="relative my-4">
      <div className="absolute left-2 top-2">
        <Badge>{language}</Badge>
      </div>
      <CopyButton text={code} />
      <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 p-4 text-sm leading-relaxed dark:border-zinc-700 dark:bg-zinc-900">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const sections: TocItem[] = [
  { id: "Why-Use-BTCPay-Server-with-Zcash", label: "Why Use BTCPay Server with Zcash" },
  { id: "How-BTCPay-Server-Works", label: "How BTCPay Server Works" },
  {
    id: "Where-Are-Funds-Stored-Who-Controls-the-Private-Keys",
    label: "Where Are Funds Stored? Who Controls the Private Keys?",
  },
  {
    id: "How-to-Set-Up-BTCPay-Server-for-Accepting-Zcash",
    label: "How to Set Up BTCPay Server for Accepting Zcash",
  },
  { id: "Deploying-BTCPay-Server-with-Zcash-Support", label: "Deploying BTCPay Server with Zcash Support", indent: true },
  { id: "Running-Your-Own-Zcash-Full-Node-Zebra--Lightwalletd", label: "Running Your Own Zcash Full Node (Zebra + Lightwalletd)", indent: true },
  { id: "Connecting-to-an-External-lightwalletd-Node-Custom-Configuration", label: "Connecting to an External lightwalletd Node", indent: true },
  { id: "Hosting-BTCPay-Server-at-Home-with-Cloudflare-Tunnel", label: "Hosting at Home with Cloudflare Tunnel", indent: true },
  { id: "Configuring-the-Zcash-Plugin-in-the-BTCPay-Server-Web-Interface", label: "Configuring the Zcash Plugin (Web UI)" },
  { id: "Integrating-BTCPay-Server-with-Your-Website", label: "Integrating BTCPay Server with Your Website" },
  { id: "API-Integration", label: "API Integration", indent: true },
  { id: "Generating-an-API-Key", label: "Generating an API Key", indent: true },
  { id: "Example-Creating-an-Invoice-via-API", label: "Example: Creating an Invoice via API", indent: true },
  { id: "Setting-Up-a-Webhook-Optional", label: "Setting Up a Webhook (Optional)", indent: true },
  { id: "CMS-Integration", label: "CMS Integration", indent: true },
  { id: "Payment-Button-or-Iframe-No-CMS-or-API-Needed", label: "Payment Button or Iframe", indent: true },
  { id: "Conclusion", label: "Conclusion" },
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
      {/* Title */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          BTCPay Server with Zcash Support: Full Installation and Integration Guide
        </h1>

        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          BTCPay Server allows online businesses to accept cryptocurrency payments directly, without intermediaries or custodians.
          This guide walks you through the complete process of setting up BTCPay Server with native support for Zcash shielded payments.
        </p>

        <div className="mt-4 rounded-md border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm leading-relaxed">
          <strong>⚠️ Note:</strong> This documentation focuses on integrating Zcash into your BTCPay Server instance.
          It supports both <strong>full node (Zebra)</strong> and <strong>lightwalletd-based</strong> setups.
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8">
        {/* TOC */}
        <aside className="lg:sticky lg:top-24 self-start hidden lg:block">
          <nav className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-3">On this page</p>
            {/* Numbered top-level; bulleted sub-items */}
            <ol className="space-y-2 text-sm list-decimal pl-5">
              {sections.filter(s => !s.indent).map(top => (
                <li key={top.id}>
                  <a className="hover:underline" href={`#${top.id}`}>{top.label}</a>
                  <ul className="mt-1 ml-3 list-disc">
                    {sections.filter(s => s.indent).filter(s => {
                      const groups: Record<string, string[]> = {
                        "How-to-Set-Up-BTCPay-Server-for-Accepting-Zcash": [
                          "Deploying-BTCPay-Server-with-Zcash-Support",
                          "Running-Your-Own-Zcash-Full-Node-Zebra--Lightwalletd",
                          "Connecting-to-an-External-lightwalletd-Node-Custom-Configuration",
                          "Hosting-BTCPay-Server-at-Home-with-Cloudflare-Tunnel",
                        ],
                        "Integrating-BTCPay-Server-with-Your-Website": [
                          "API-Integration",
                          "Generating-an-API-Key",
                          "Example-Creating-an-Invoice-via-API",
                          "Setting-Up-a-Webhook-Optional",
                          "CMS-Integration",
                          "Payment-Button-or-Iframe-No-CMS-or-API-Needed",
                        ],
                      };
                      const childIds = groups[top.id] || [];
                      return childIds.includes(s.id);
                    }).map(sub => (
                      <li key={sub.id} className="pl-1">
                        <a className="hover:underline" href={`#${sub.id}`}>{sub.label}</a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        {/* Content */}
        <article className="prose prose-zinc dark:prose-invert max-w-none prose-pre:overflow-x-auto prose-code:break-words">
          <H2 id="Why-Use-BTCPay-Server-with-Zcash">Why Use BTCPay Server with Zcash</H2>
          <p>Online commerce increasingly accepts cryptocurrency. It is fast, global, and operates without banks. These traits benefit both merchants and customers.</p>
          <p>The catch: most blockchains are public. During checkout, customers usually provide personal details such as name, shipping address, and phone number. If their payment goes over a transparent chain (Bitcoin, Ethereum, or stablecoins), the transaction becomes permanently visible and linkable.</p>
          <p>As a result, anyone can:</p>
          <ul>
            <li>see when and how much was paid,</li>
            <li>trace where funds came from and where they go,</li>
            <li>and link an address to a person if any correlating data leaks.</li>
          </ul>
          <p>This exposure also affects merchants: once an address appears on-chain, competitors and data brokers can estimate revenue, map counterparties, and infer business flows.</p>
          <p><strong>BTCPay Server + Zcash solves this.</strong> BTCPay is a free self-hosted payment processor. It does not custody funds. Payments go straight to the merchant’s wallet (single user or multisig).</p>
          <p>BTCPay coordinates the flow:</p>
          <ul>
            <li>generates a unique address per order,</li>
            <li>monitors for payment and links it to the order,</li>
            <li>issues receipts/notifications,</li>
            <li>and provides the customer checkout UI.</li>
          </ul>
          <p>Zcash uses zero-knowledge proofs to support private transactions. With shielded addresses, sender, recipient, and amounts are not revealed on-chain.</p>
          <p>For stores, this means:</p>
          <ul>
            <li>buyers pay without exposing financial history,</li>
            <li>sellers receive funds without revealing sales volume,</li>
            <li>and outsiders cannot link the payment to the order.</li>
          </ul>

          <h4>Practical Example</h4>
          <p>With Bitcoin or USDT, the site shows a payment address. Once paid, that address becomes public forever and may be tied to a customer.</p>
          <p>With Zcash, BTCPay provides a shielded address. The buyer pays, the server detects it, and the order completes—without public metadata to analyze.</p>

          <H2 id="How-BTCPay-Server-Works">How BTCPay Server Works</H2>
          <ol>
            <li>Customer places an order on your site.</li>
            <li>Your store requests an invoice from BTCPay (amount, timer, Zcash address).</li>
            <li>Customer pays the provided ZEC address.</li>
            <li>BTCPay monitors the chain and validates the payment.</li>
            <li>Once confirmed, BTCPay notifies your store.</li>
            <li>Customer sees confirmation (optionally receives a receipt).</li>
          </ol>
          <p>This is fully automated. BTCPay never holds private keys or funds.</p>

          <H2 id="Where-Are-Funds-Stored-Who-Controls-the-Private-Keys">Where Are Funds Stored? Who Controls the Private Keys?</H2>
          <p>BTCPay Server is <strong>not</strong> a wallet and does <strong>not</strong> require private keys. Funds go directly to your wallet, while BTCPay operates with a <strong>viewing key</strong>.</p>
          <h3>How It Works</h3>
          <ul>
            <li>Create your wallet in advance. Recommended: <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link> or <Link href="https://zingolabs.org/" target="_blank">Zingo! Wallet</Link>. See <Link href="https://zechub.wiki/wallets" target="_blank">ZecHub Wallets</Link>.</li>
            <li>Provide BTCPay a read-only viewing key. It derives new receiving addresses and detects incoming funds but cannot spend.</li>
            <li>BTCPay queries a <code>lightwalletd</code> endpoint (public like <code>https://zec.rocks</code> or your own Zebra + lightwalletd).</li>
            <li>Each invoice gets a unique address (no reuse; easy tracking).</li>
            <li>Compromise of the server cannot move funds.</li>
          </ul>

          <H2 id="How-to-Set-Up-BTCPay-Server-for-Accepting-Zcash">How to Set Up BTCPay Server for Accepting Zcash</H2>
          <p>You can deploy from scratch, add ZEC to an existing instance, use a public <code>lightwalletd</code>, or run your own full node. We’ll cover all paths below.</p>

          <H2 id="Deploying-BTCPay-Server-with-Zcash-Support">Deploying BTCPay Server with Zcash Support</H2>
          <p>Already running BTCPay? Just install the ZEC plugin. Docs: <Link href="https://github.com/btcpay-zcash/btcpayserver-zcash-plugin" target="_blank">btcpayserver-zcash-plugin</Link>.</p>

          <h3>Recommended VPS Configuration</h3>
          <ul>
            <li>Ubuntu 22.04+, domain → server IP via DNS</li>
            <li><code>git</code>, <code>docker</code>, <code>docker compose</code>, SSH access</li>
          </ul>

          <details>
            <summary className="cursor-pointer font-semibold">Preparing Your Server (click to expand)</summary>
            <div className="mt-3 space-y-3">
              <p><strong>1) VPS:</strong> 2 CPU / 4 GB RAM / 40 GB disk (more if full node).</p>
              <p><strong>2) DNS:</strong> Create an A record (e.g. <code>btcpay.example.com</code>).</p>
              <p><strong>3) SSH:</strong> <code>ssh root@YOUR_SERVER_IP</code></p>
              <CodeBlock
                language="bash"
                code={`sudo apt update && sudo apt upgrade -y
sudo apt install git curl docker.io docker-compose-plugin -y
sudo systemctl enable docker`}
              />
            </div>
          </details>

          <h3>Step 1: Clone the Repository</h3>
          <p>Create a working directory and download the BTCPay Server Docker deployment:</p>
          <CodeBlock
            language="bash"
            code={`mkdir BTCPayServer
cd BTCPayServer
git clone https://github.com/btcpayserver/btcpayserver-docker
cd btcpayserver-docker`}
          />

          <h3>Step 2: Export Environment Variables</h3>
          <p>Replace <code>btcpay.example.com</code> with your actual domain:</p>
          <CodeBlock
            language="bash"
            code={`export BTCPAY_HOST="btcpay.example.com"
export NBITCOIN_NETWORK="mainnet"
export BTCPAYGEN_CRYPTO1="btc"
export BTCPAYGEN_CRYPTO2="zec"
export BTCPAYGEN_REVERSEPROXY="nginx"
export BTCPAYGEN_LIGHTNING="none"`}
          />

          <h3>Step 3: Run the Installer</h3>
          <CodeBlock language="bash" code={`. ./btcpay-setup.sh -i`} />
          <p>When finished, visit <code>https://btcpay.example.com</code>.</p>

          <H2 id="Running-Your-Own-Zcash-Full-Node-Zebra--Lightwalletd">Running Your Own Zcash Full Node (Zebra + Lightwalletd)</H2>
          <p>Ensure you have ample disk (≥400 GB recommended for payments-only). Sync time can be lengthy on small VPSes.</p>
          <CodeBlock
            language="bash"
            code={`export BTCPAYGEN_EXCLUDE_FRAGMENTS="zcash"
export BTCPAYGEN_ADDITIONAL_FRAGMENTS="zcash-fullnode"
. ./btcpay-setup.sh -i`}
          />

          <H2 id="Connecting-to-an-External-lightwalletd-Node-Custom-Configuration">
            Connecting to an External <code>lightwalletd</code> Node (Custom Configuration)
          </H2>
          <p>Use an external endpoint (default is <code>https://zec.rocks:443</code>) or your own hosted service.</p>

          <h3>Step 1: Custom Docker Fragment</h3>
          <CodeBlock
            language="yaml"
            code={`# docker-compose-generator/docker-fragments/zcash-lightwalletd.custom.yml
exclusive:
- zcash`}
          />

          <h3>Step 2: Environment</h3>
          <CodeBlock
            language="bash"
            code={`export BTCPAYGEN_EXCLUDE_FRAGMENTS="$BTCPAYGEN_EXCLUDE_FRAGMENTS;zcash"
export BTCPAYGEN_ADDITIONAL_FRAGMENTS="$BTCPAYGEN_ADDITIONAL_FRAGMENTS;zcash-lightwalletd.custom"`}
          />

          <h3>Step 3: .env</h3>
          <CodeBlock language="dotenv" code={`ZCASH_LIGHTWALLETD=https://lightwalletd.example:443`} />

          <h3>Step 4: Apply</h3>
          <CodeBlock language="bash" code={`. ./btcpay-setup.sh -i`} />

          <H2 id="Hosting-BTCPay-Server-at-Home-with-Cloudflare-Tunnel">Hosting BTCPay Server at Home with Cloudflare Tunnel</H2>
          <ol>
            <li>Install and authenticate: <code>cloudflared tunnel login</code></li>
            <li>Create tunnel: <code>cloudflared tunnel create btcpay</code></li>
            <li>Config file (<code>/etc/cloudflared/config.yml</code>):</li>
          </ol>
          <CodeBlock
            language="yaml"
            code={`tunnel: btcpay
credentials-file: /root/.cloudflared/btcpay.json
ingress:
  - hostname: btcpay.example.com
    service: http://127.0.0.1:80
  - service: http_status:404`}
          />
          <p>Add the CNAME in Cloudflare DNS and enable proxy (orange cloud).</p>
          <CodeBlock
            language="bash"
            code={`sudo cloudflared service install
sudo systemctl enable --now cloudflared`}
          />
          <p>Set <code>BTCPAY_HOST</code> and rerun setup to finalize domain/SSL.</p>

          <H2 id="Configuring-the-Zcash-Plugin-in-the-BTCPay-Server-Web-Interface">Configuring the Zcash Plugin in the BTCPay Server Web Interface</H2>
          <ol>
            <li>Log in to your instance.</li>
            <li><strong>Plugins → Browse Plugins</strong> → install <strong>Zcash (ZEC)</strong> → restart.</li>
            <li><strong>Zcash → Settings</strong> → paste your viewing key and current block height → Save.</li>
          </ol>
          <p>Recommended wallets for viewing keys: <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link> and <Link href="https://zingolabs.org/" target="_blank">Zingo! Wallet</Link>. See <Link href="https://zechub.wiki/wallets" target="_blank">ZecHub Wallets</Link>.</p>

          <h3>Test Your ZEC Payment Flow</h3>
          <ol>
            <li>Invoices → Create New → small ZEC amount.</li>
            <li>Pay from a different wallet.</li>
            <li>Invoice should switch to <strong>Paid</strong>.</li>
          </ol>

          <H2 id="Integrating-BTCPay-Server-with-Your-Website">Integrating BTCPay Server with Your Website</H2>
          <p>Pick the approach that fits your stack:</p>
          <ul>
            <li><strong>API Integration</strong> — full control for custom sites.</li>
            <li><strong>CMS Plugins</strong> — quickest path (e.g., WooCommerce).</li>
            <li><strong>Payment Button/Iframe</strong> — simplest for static pages.</li>
          </ul>

          <H3 id="API-Integration">API Integration</H3>
          <p>Generate an API key and use the Greenfield API for invoices, tracking, and webhooks.</p>

          <H3 id="Generating-an-API-Key">Generating an API Key</H3>
          <ol>
            <li>User menu → <strong>API Keys</strong> → Create.</li>
            <li>Grant: <code>Can create invoice</code>, <code>Can view invoice</code>.</li>
            <li>Copy the token and store it securely.</li>
          </ol>

          <H3 id="Example-Creating-an-Invoice-via-API">Example: Creating an Invoice via API</H3>
          <CodeBlock
            language="http"
            code={`POST /api/v1/stores/{storeId}/invoices
Authorization: token {apiKey}
Content-Type: application/json`}
          />
          <CodeBlock
            language="json"
            code={`{
  "amount": 5,
  "currency": "ZEC",
  "checkout": {
    "speedPolicy": "HighSpeed",
    "paymentMethods": ["Zcash"]
  }
}`}
          />

          <H3 id="Setting-Up-a-Webhook-Optional">Setting Up a Webhook (Optional)</H3>
          <ol>
            <li>Store → <strong>Webhooks</strong> → add your endpoint.</li>
            <li>Receive POST callbacks on invoice state changes.</li>
          </ol>

          <H3 id="CMS-Integration">CMS Integration</H3>
          <p>WordPress + WooCommerce has first-class support via the BTCPay plugin.</p>

          <H3 id="Payment-Button-or-Iframe-No-CMS-or-API-Needed">Payment Button or Iframe (No CMS or API Needed)</H3>
          <h4>Payment Button</h4>
          <CodeBlock
            language="html"
            code={`<a href="https://btcpay.example.com/i/abc123" target="_blank">Pay with ZEC</a>`}
          />
          <h4>Embedded Invoice (Iframe)</h4>
          <CodeBlock
            language="html"
            code={`<iframe src="https://btcpay.example.com/i/abc123" width="600" height="350" frameborder="0"></iframe>`}
          />

          <H2 id="Conclusion">Conclusion</H2>
          <p>BTCPay gives you private ZEC payments without intermediaries. Host multiple stores, assign roles, customize checkout, and automate with webhooks—all under your control.</p>

          <H2 id="Resources">Resources</H2>
          <ul>
            <li><Link href="https://btcpayserver.org/" target="_blank">BTCPay Server Official Website</Link></li>
            <li><Link href="https://docs.btcpayserver.org/FAQ/" target="_blank">BTCPay FAQ</Link></li>
            <li><Link href="https://github.com/btcpayserver/btcpayserver" target="_blank">BTCPay Server GitHub Repository</Link></li>
            <li><Link href="https://mainnet.demo.btcpayserver.org/login?ReturnUrl=%2F" target="_blank">BTCPay Server Mainnet Demo</Link></li>
            <li><Link href="https://github.com/btcpay-zcash/btcpayserver-zcash-plugin" target="_blank">Zcash Plugin for BTCPay (GitHub)</Link></li>
            <li><Link href="https://github.com/btcpay-zcash/btcpayserver-zcash-plugin/blob/master/docs/installation.md" target="_blank">Zcash Plugin Installation Guide</Link></li>
            <li><Link href="https://github.com/btcpay-zcash/btcpayserver-zcash-plugin/blob/master/docs/zcash-lightwalletd.custom.yml" target="_blank">Custom zcash-lightwalletd.custom.yml Example</Link></li>
            <li><Link href="https://github.com/ZcashFoundation/zebra/blob/main/docker/docker-compose.lwd.yml" target="_blank">Lightwalletd Docker Compose File (Zebra)</Link></li>
            <li><Link href="https://docs.btcpayserver.org/API/Greenfield/v1/#tag/API-Keys" target="_blank">BTCPay API Key Docs (Greenfield API)</Link></li>
            <li><Link href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-remote-tunnel/" target="_blank">Create a Cloudflare Tunnel</Link></li>
            <li><Link href="https://zechub.wiki/wallets" target="_blank">Zcash Wallet Compatibility List (ZecHub)</Link></li>
            <li><Link href="https://free2z.com/ZecHub/zpage/zcash-101-zebra-lightwalletd-sync-journal-on-raspberry-pi-5" target="_blank">Zebra + Lightwalletd on Raspberry Pi 5 (ZecHub)</Link></li>
          </ul>
        </article>
      </div>
    </div>
  );
}

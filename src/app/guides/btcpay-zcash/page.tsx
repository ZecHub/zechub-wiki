/* src/app/guides/btcpay-zcash/page.tsx */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BTCPay Server with Zcash Support: Full Installation and Integration Guide",
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

const sections = [
  { id: "Why-Use-BTCPay-Server-with-Zcash", label: "Why Use BTCPay Server with Zcash" },
  { id: "How-BTCPay-Server-Works", label: "How BTCPay Server Works" },
  { id: "Where-Are-Funds-Stored-Who-Controls-the-Private-Keys", label: "Where Are Funds Stored? Who Controls the Private Keys?" },
  { id: "How-to-Set-Up-BTCPay-Server-for-Accepting-Zcash", label: "How to Set Up BTCPay Server for Accepting Zcash" },
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
    <h2 id={id} className="scroll-mt-24 group text-2xl md:text-3xl font-semibold mt-12 mb-4">
      <a href={`#${id}`} className="no-underline">
        {children}
      </a>
      <span className="opacity-0 group-hover:opacity-100 align-middle pl-2 text-sm text-zinc-400">#</span>
    </h2>
  );
}

function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="scroll-mt-24 group text-xl md:text-2xl font-semibold mt-10 mb-3">
      <a href={`#${id}`} className="no-underline">
        {children}
      </a>
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
        <div className="mt-4 rounded-md border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm">
          <strong>⚠️ Note:</strong> This documentation focuses on integrating Zcash into your BTCPay Server instance. It supports both{" "}
          <strong>full node (Zebra)</strong> and <strong>lightwalletd-based</strong> setups.
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8">
        {/* TOC */}
        <aside className="lg:sticky lg:top-24 self-start hidden lg:block">
          <nav className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-3">On this page</p>
            <ul className="space-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.id} className={s.indent ? "pl-4" : ""}>
                  <a className="hover:underline" href={`#${s.id}`}>{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <article className="prose prose-zinc dark:prose-invert max-w-none prose-pre:overflow-x-auto prose-code:break-words">
          <H2 id="Why-Use-BTCPay-Server-with-Zcash">Why Use BTCPay Server with Zcash</H2>
          <p>Online commerce increasingly accepts cryptocurrency. It’s fast, global, and works without banks. This benefits both merchants and customers. But there’s an important detail that many overlook.</p>
          <p>
            When placing an order, the customer typically provides personal information: name, shipping address, and phone number. If the payment is made using a public
            blockchain — such as Bitcoin, Ethereum, or stablecoins on Ethereum or Tron — the transaction becomes permanently visible for analysis.
          </p>
          <p>Anyone, even without knowing what was ordered, can:</p>
          <ul>
            <li>see when and how much was paid</li>
            <li>trace where the funds came from and where they went</li>
            <li>
              link a cryptocurrency address to a real person if there is any point of correlation (for example, a leaked email or shipping name)
            </li>
          </ul>
          <p>This means that a single purchase may reveal a customer’s entire financial history.</p>
          <p>
            And it works the other way as well. If a merchant’s address has ever appeared on-chain, they become exposed. Competitors and third-party observers can track
            payment volumes, supplier activity, and the structure of business flows.
          </p>
          <p><strong>The combination of BTCPay Server and Zcash can solve this.</strong></p>
          <p>
            BTCPay Server is a free and decentralized system for receiving cryptocurrency payments.
            It is not a payment intermediary and does not hold any funds. All payments go directly to the merchant’s wallet. This can be a personal wallet or a multisig setup within an organization.
          </p>
          <p>The server handles coordination tasks:</p>
          <ul>
            <li>generates a unique address for each order</li>
            <li>tracks when payment is received and links it to the order</li>
            <li>issues receipts and notifications</li>
            <li>provides a payment interface for the customer</li>
          </ul>
          <p>Everything runs under the control of the store owner, without relying on third-party services.</p>
          <p>
            Zcash is a cryptocurrency built on zero-knowledge proofs. It supports a fully private transaction model. When using shielded addresses (hereafter simply called “addresses”),
            the sender, the recipient, and the transaction amount are not revealed on the blockchain.
          </p>
          <p>For online stores, this means:</p>
          <ul>
            <li>The buyer can complete the payment without revealing their financial history</li>
            <li>The seller receives payment without exposing their address, sales volume, or transaction structure</li>
            <li>No external observer can link the payment to the order or to customer data</li>
          </ul>
          <h4>Practical Example</h4>
          <p>
            A user places an order and selects Bitcoin or USDT as the payment method. The website generates a payment address and displays the amount. After the payment is made,
            this address is stored on the blockchain and becomes public. An attacker only needs to link one order to the address to gain long-term visibility into its entire transaction history.
          </p>
          <p>
            Now imagine the same situation with Zcash. BTCPay Server generates a shielded address. The buyer sends the payment. From the blockchain’s perspective, nothing happens.
            There is no public data to analyze. The server receives confirmation, links it to the order, and completes the process. For any outsider, it looks like nothing occurred.
          </p>
          <p>This solution doesn’t compromise automation or usability. Everything works the same as with other cryptocurrencies, just without the risk of data leaks.</p>

          <H2 id="How-BTCPay-Server-Works">How BTCPay Server Works</H2>
          <ol>
            <li><strong>The customer places an order</strong> on your website (e.g. WooCommerce, Magento, or any platform with BTCPay integration).</li>
            <li>
              <strong>The store requests a payment invoice</strong> from BTCPay Server. The server generates a unique invoice with: the order amount, a countdown timer,
              and a Zcash address (e.g. a shielded <code>zs…</code> address).
            </li>
            <li><strong>The customer sees the payment page</strong> and sends ZEC to the provided address.</li>
            <li>
              <strong>BTCPay Server monitors the blockchain</strong>, checking the payment against the expected amount, the receiving address, and the invoice timestamp.
            </li>
            <li><strong>Once the transaction is detected and confirmed</strong>, BTCPay notifies the store.</li>
            <li><strong>The customer receives a payment confirmation</strong>. Optionally, the server can send a receipt via email.</li>
          </ol>
          <p>
            This entire process happens <strong>automatically</strong>, with no intermediaries or custodians. BTCPay Server does <strong>not hold any funds</strong> — it simply connects
            the order system to the blockchain securely and privately.
          </p>

          <H2 id="Where-Are-Funds-Stored-Who-Controls-the-Private-Keys">
            Where Are Funds Stored? Who Controls the Private Keys?
          </H2>
          <p>
            BTCPay Server is <strong>not</strong> a wallet and does <strong>not require private keys</strong>. All funds go <strong>directly</strong> to the merchant’s wallet.
            Security is ensured by using a <strong>viewing key-based architecture</strong>.
          </p>
          <h3>How It Works</h3>
          <ul>
            <li>
              <strong>The wallet is created in advance.</strong> Use a Zcash wallet that supports viewing keys — such as{" "}
              <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link> or{" "}
              <Link href="https://zingolabs.org/" target="_blank">Zingo! Wallet</Link>. A broader list is at{" "}
              <Link href="https://zechub.wiki/wallets" target="_blank">ZecHub.wiki/wallets</Link>.
            </li>
            <li>
              <strong>BTCPay connects via a viewing key.</strong> A viewing key is read-only: it detects incoming payments and generates new receiving addresses, but cannot spend funds.
            </li>
            <li>
              <strong>Blockchain data</strong> is accessed through a <code>lightwalletd</code> server (public like <code>https://zec.rocks</code> or your own Zebra + lightwalletd).
            </li>
            <li><strong>Each order gets a unique address.</strong> Prevents address reuse and enables reliable tracking.</li>
            <li><strong>You retain full control over funds.</strong> Even if the server is compromised, funds cannot be spent.</li>
          </ul>

          <H2 id="How-to-Set-Up-BTCPay-Server-for-Accepting-Zcash">
            How to Set Up BTCPay Server for Accepting Zcash
          </H2>
          <p>
            This chapter covers everything from minimal setups that use a public <code>lightwalletd</code> to fully sovereign deployments with your own full node.
            We’ll also cover Cloudflare Tunnel hosting and web/CMS integration.
          </p>

          <H2 id="Deploying-BTCPay-Server-with-Zcash-Support">Deploying BTCPay Server with Zcash Support</H2>
          <p>
            If you already have BTCPay Server running, you can just enable the ZEC plugin. Official plugin docs:{" "}
            <Link href="https://github.com/btcpay-zcash/btcpayserver-zcash-plugin" target="_blank">btcpayserver-zcash-plugin</Link>.
          </p>

          <h3>Recommended VPS Configuration</h3>
          <ul>
            <li>Ubuntu 22.04+, domain pointing to your server</li>
            <li><code>git</code>, <code>docker</code>, <code>docker compose</code>, SSH access</li>
          </ul>

          <details>
            <summary className="cursor-pointer font-semibold">Preparing Your Server (click to expand)</summary>
            <div className="mt-3">
              <p><strong>1) VPS</strong>: 2 CPU / 4 GB RAM / 40 GB disk (more if full node).</p>
              <p><strong>2) DNS</strong>: <code>A</code> record (e.g. <code>btcpay.example.com</code>).</p>
              <p><strong>3) SSH</strong>: <code>ssh root@YOUR_SERVER_IP</code></p>
              <pre><code>{`sudo apt update && sudo apt upgrade -y
sudo apt install git curl docker.io docker-compose-plugin -y
sudo systemctl enable docker`}</code></pre>
            </div>
          </details>

          <h3>Step 1: Clone the Repository</h3>
          <pre><code>{`mkdir BTCPayServer
cd BTCPayServer
git clone https://github.com/btcpayserver/btcpayserver-docker
cd btcpayserver-docker`}</code></pre>

          <h3>Step 2: Export Environment Variables</h3>
          <pre><code>{`export BTCPAY_HOST="btcpay.example.com"
export NBITCOIN_NETWORK="mainnet"
export BTCPAYGEN_CRYPTO1="btc"
export BTCPAYGEN_CRYPTO2="zec"
export BTCPAYGEN_REVERSEPROXY="nginx"
export BTCPAYGEN_LIGHTNING="none"`}</code></pre>
          <p>Add more coins if you like, then rerun the setup script to apply.</p>

          <h3>Step 3: Run the Installer</h3>
          <pre><code>{`. ./btcpay-setup.sh -i`}</code></pre>
          <p>After a few minutes, your instance will be up at <code>https://btcpay.example.com</code>.</p>

          <H2 id="Running-Your-Own-Zcash-Full-Node-Zebra--Lightwalletd">
            Running Your Own Zcash Full Node (Zebra + Lightwalletd)
          </H2>
          <p>Ensure ample disk (recommend 400 GB+ for payments-only; more if co-hosting other services).</p>
          <pre><code>{`export BTCPAYGEN_EXCLUDE_FRAGMENTS="zcash"
export BTCPAYGEN_ADDITIONAL_FRAGMENTS="zcash-fullnode"
. ./btcpay-setup.sh -i`}</code></pre>
          <p>Full sync can take time; shielded payments are available once synced.</p>

          <H2 id="Connecting-to-an-External-lightwalletd-Node-Custom-Configuration">
            Connecting to an External <code>lightwalletd</code> Node (Custom Configuration)
          </H2>
          <p>Use an external endpoint (default is <code>https://zec.rocks:443</code>) or your own.</p>
          <h3>Step 1: Custom Docker Fragment</h3>
          <pre><code>{`# docker-compose-generator/docker-fragments/zcash-lightwalletd.custom.yml
exclusive:
- zcash`}</code></pre>
          <h3>Step 2: Environment</h3>
          <pre><code>{`export BTCPAYGEN_EXCLUDE_FRAGMENTS="$BTCPAYGEN_EXCLUDE_FRAGMENTS;zcash"
export BTCPAYGEN_ADDITIONAL_FRAGMENTS="$BTCPAYGEN_ADDITIONAL_FRAGMENTS;zcash-lightwalletd.custom"`}</code></pre>
          <h3>Step 3: .env</h3>
          <pre><code>{`ZCASH_LIGHTWALLETD=https://lightwalletd.example:443`}</code></pre>
          <h3>Step 4: Apply</h3>
          <pre><code>{`. ./btcpay-setup.sh -i`}</code></pre>

          <H2 id="Hosting-BTCPay-Server-at-Home-with-Cloudflare-Tunnel">
            Hosting BTCPay Server at Home with Cloudflare Tunnel
          </H2>
          <ol>
            <li>Install <code>cloudflared</code> and authenticate: <code>cloudflared tunnel login</code></li>
            <li>Create tunnel: <code>cloudflared tunnel create btcpay</code></li>
            <li>Config (<code>/etc/cloudflared/config.yml</code>):</li>
          </ol>
          <pre><code>{`tunnel: btcpay
credentials-file: /root/.cloudflared/btcpay.json
ingress:
  - hostname: btcpay.example.com
    service: http://127.0.0.1:80
  - service: http_status:404`}</code></pre>
          <p>Add the CNAME in Cloudflare DNS (orange cloud on).</p>
          <pre><code>{`sudo cloudflared service install
sudo systemctl enable --now cloudflared`}</code></pre>
          <p>Set <code>BTCPAY_HOST</code> then run setup to finalize domain/SSL.</p>

          <H2 id="Configuring-the-Zcash-Plugin-in-the-BTCPay-Server-Web-Interface">
            Configuring the Zcash Plugin in the BTCPay Server Web Interface
          </H2>
          <ol>
            <li>Log in at <code>https://btcpay.example.com</code>.</li>
            <li>Plugins → <strong>Browse Plugins</strong> → install <strong>Zcash (ZEC)</strong> → restart.</li>
            <li>Zcash → <strong>Settings</strong> → paste your <strong>viewing key</strong> and current block height → Save.</li>
          </ol>
          <p>Recommended wallets for viewing keys: <Link href="https://ywallet.app/installation" target="_blank">YWallet</Link>,{" "}
            <Link href="https://zingolabs.org/" target="_blank">Zingo! Wallet</Link>. See{" "}
            <Link href="https://zechub.wiki/wallets" target="_blank">ZecHub Wallets</Link>.
          </p>
          <h3>Test Your ZEC Payment Flow</h3>
          <ol>
            <li>Invoices → Create New → small ZEC amount.</li>
            <li>Pay from a different wallet.</li>
            <li>Invoice should flip to <strong>Paid</strong>.</li>
          </ol>

          <H2 id="Integrating-BTCPay-Server-with-Your-Website">Integrating BTCPay Server with Your Website</H2>
          <p>Choose API, CMS plugin, or simple button/iframe.</p>

          <H3 id="API-Integration">API Integration</H3>
          <p>Generate an API key, then use the Greenfield API.</p>

          <H3 id="Generating-an-API-Key">Generating an API Key</H3>
          <ol>
            <li>User menu → <strong>API Keys</strong> → Create.</li>
            <li>Allow: <code>Can create invoice</code>, <code>Can view invoice</code>.</li>
          </ol>

          <H3 id="Example-Creating-an-Invoice-via-API">Example: Creating an Invoice via API</H3>
          <pre><code>{`POST /api/v1/stores/{storeId}/invoices
Authorization: token {apiKey}
Content-Type: application/json

{
  "amount": 5,
  "currency": "ZEC",
  "checkout": {
    "speedPolicy": "HighSpeed",
    "paymentMethods": ["Zcash"]
  }
}`}</code></pre>

          <H3 id="Setting-Up-a-Webhook-Optional">Setting Up a Webhook (Optional)</H3>
          <ol>
            <li>Store → <strong>Webhooks</strong> → add your backend URL.</li>
            <li>Receive POST callbacks on invoice state changes.</li>
          </ol>

          <H3 id="CMS-Integration">CMS Integration</H3>
          <p>WordPress + WooCommerce has first-class support (BTCPay plugin).</p>

          <H3 id="Payment-Button-or-Iframe-No-CMS-or-API-Needed">
            Payment Button or Iframe (No CMS or API Needed)
          </H3>
          <p>Quickest way to accept ZEC for static sites.</p>
          <h4>Payment Button</h4>
          <pre><code>{`<a href="https://btcpay.example.com/i/abc123" target="_blank">Pay with ZEC</a>`}</code></pre>
          <h4>Embedded Invoice (Iframe)</h4>
          <pre><code>{`<iframe src="https://btcpay.example.com/i/abc123" width="600" height="350" frameborder="0"></iframe>`}</code></pre>

          <H2 id="Conclusion">Conclusion</H2>
          <p>
            BTCPay offers flexible, private ZEC payments without intermediaries. Host multiple stores, use custom roles, set up webhooks/Tor, and theme your checkout—all under your control.
          </p>

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

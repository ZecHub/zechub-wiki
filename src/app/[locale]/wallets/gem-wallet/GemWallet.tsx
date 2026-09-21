import Image from "next/image";
import { Link } from "@/i18n/navigation";

/**
 * Gem Wallet page.
 *
 * Claims below are drawn from the sources listed at the bottom
 * (gemwallet.com pages, docs.gemwallet.com, and the Zcash Community Forum
 * thread), all fetched live on 2026-09-21. Where the sources were silent,
 * the page says so instead of guessing.
 */

type Fact = { label: string; value: string };

const FACTS: Fact[] = [
  { label: "Devices", value: "Mobile" },
  { label: "Operating System", value: "iOS, Android (APK download available)" },
  { label: "Pools", value: "Transparent only (t-addresses)" },
  {
    label: "Custody",
    value: "Self-custodial; no accounts, no tracking",
  },
  {
    label: "Features",
    value:
      "Send, receive, swap ZEC (BTC <-> ZEC through the built-in DEX; additional ZEC swap routing through THORChain/MayaChain), buy ZEC with 30+ payment methods (Moonpay, Mercuryo, Paybis; exact options depend on country and provider)",
  },
  {
    label: "Ironwood",
    value:
      "No formal compatibility claim published. The team reports a transparent ZEC transaction completed after Ironwood activation with its backend synced past the activation height; shielded transactions and Orchard-to-Ironwood migration are not supported.",
  },
  { label: "Sync Speed", value: "Could not verify (not published)" },
];

const SOURCES: { label: string; url: string }[] = [
  {
    label: "Gem Wallet Zcash page (gemwallet.com/zcash-wallet)",
    url: "https://gemwallet.com/zcash-wallet/",
  },
  {
    label: "Gem Wallet buy-ZEC page (gemwallet.com/buy-zcash)",
    url: "https://gemwallet.com/buy-zcash/",
  },
  {
    label:
      "Gem Wallet knowledge base: Zcash support (docs.gemwallet.com/blockchains/zcash)",
    url: "https://docs.gemwallet.com/blockchains/zcash/",
  },
  {
    label:
      "Zcash Community Forum: Gem Wallet Zcash integration thread (announcement Nov 18, 2025; team updates on transparent-only scope, THORChain/MayaChain routing, NU6.2 verification, and post-Ironwood transparent transaction test)",
    url: "https://forum.zcashcommunity.com/t/gem-wallet-integration-with-zcash/53206",
  },
];

export default function GemWallet() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold md:text-4xl">Gem Wallet</h1>
      <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
        Open-source, self-custodial multi-coin mobile wallet with Zcash (ZEC)
        support. Transparent ZEC addresses only.
      </p>

      <div className="mb-8 overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800">
        <Image
          src="/content-images/GemWallet-4f8a2c1d9e.webp"
          alt="Gem Wallet logo"
          width={640}
          height={220}
          className="h-auto w-full object-contain"
        />
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">Wallet facts</h2>
        <dl className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          {FACTS.map((f, i) => (
            <div
              key={f.label}
              className={`grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4 ${
                i % 2 === 1 ? "bg-zinc-50 dark:bg-zinc-900" : ""
              }`}
            >
              <dt className="font-medium text-zinc-700 dark:text-zinc-300">
                {f.label}
              </dt>
              <dd className="text-zinc-600 dark:text-zinc-400">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">What it is</h2>
        <p className="mb-3 text-zinc-700 dark:text-zinc-300">
          Gem Wallet is a self-custodial, open-source multi-coin wallet for
          iOS and Android, also available as an APK download. It requires no
          account and the project states there is no tracking. ZEC integration
          was announced on the Zcash Community Forum on 18 November 2025.
        </p>
        <p className="text-zinc-700 dark:text-zinc-300">
          The code is publicly available on GitHub, backups are encrypted,
          and the app was audited by CertiK in April 2026. The app supports
          25+ languages.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">
          Important: transparent ZEC only
        </h2>
        <p className="mb-3 text-zinc-700 dark:text-zinc-300">
          Gem Wallet currently supports <strong>transparent</strong> Zcash
          addresses and transactions only. Shielded Sapling and Orchard
          addresses, shielded balances, and shielded transactions are not
          currently supported, per the wallet&apos;s own documentation and the
          team&apos;s forum updates.
        </p>
        <p className="text-zinc-700 dark:text-zinc-300">
          On the network-upgrade front: the team says it is verifying
          compatibility with the NU6.2 upgrade before making a formal
          compatibility claim, and separately reports completing a transparent
          ZEC transaction after Ironwood activation with its public Zcash
          backend synced past the activation height. If you need shielded
          (private) ZEC, use a shielded-capable wallet from the{" "}
          <Link href="/wallets" className="underline">
            wallets directory
          </Link>{" "}
          instead.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">What you can do with ZEC</h2>
        <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
          <li>Receive and send ZEC with a transparent Zcash address.</li>
          <li>
            Swap ZEC to other crypto: BTC &lt;-&gt; ZEC through the built-in
            DEX, with additional ZEC swap routing through THORChain/MayaChain.
          </li>
          <li>
            Buy ZEC inside the app with 30+ payment methods via Moonpay,
            Mercuryo, and Paybis. Exact options depend on your country and
            provider. ZEC bought or swapped in-app lands on a transparent
            address, since that is all the wallet supports.
          </li>
          <li>
            Secure the wallet with a PIN or biometrics; backups are encrypted.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">Getting started</h2>
        <ol className="list-decimal space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
          <li>
            Download Gem Wallet for iOS, Android, or as an APK from the
            official site.
          </li>
          <li>
            Set up the wallet, keep your backup safe (backups are encrypted),
            and enable PIN or biometric authentication.
          </li>
          <li>
            Use your transparent Zcash address to receive and send ZEC.
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">Official links</h2>
        <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
          <li>
            <a
              href="https://gemwallet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              gemwallet.com
            </a>{" "}
            (official site)
          </li>
          <li>
            <a
              href="https://gemwallet.com/zcash-wallet/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Zcash wallet page
            </a>
          </li>
          <li>
            <a
              href="https://docs.gemwallet.com/blockchains/zcash/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Zcash knowledge base (support scope)
            </a>
          </li>
          <li>
            <a
              href="https://github.com/gemwalletcom/wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              GitHub repository
            </a>{" "}
            (open-source code)
          </li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="mb-3 text-2xl font-semibold">Sources</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm text-zinc-600 dark:text-zinc-400">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Facts verified 2026-09-21. Wallet software changes fast; check the
          official links above for the latest support status before moving
          funds.
        </p>
      </section>
    </main>
  );
}

import Image from "next/image";
import { Link } from "@/i18n/navigation";

/**
 * Freedom Wallet page.
 *
 * Claims below are drawn from the wallet's official site
 * (freedomwallet.com), fetched live on 2026-09-21. Where the site was
 * silent, the page says so instead of guessing.
 */

type Fact = { label: string; value: string };

const FACTS: Fact[] = [
  { label: "Devices", value: "Mobile, Desktop" },
  {
    label: "Operating System",
    value: "iOS, Android, macOS, Windows, Linux",
  },
  {
    label: "Pools",
    value:
      "Not specified by pool. The site does not name Transparent, Sapling, Orchard, or Ironwood support; it states Zcash keeps transactions confidential \u201cwhen you use shielded addresses.\u201d",
  },
  {
    label: "Custody",
    value:
      "Self-custodial. Your recovery phrase and private keys stay on your device; Freedom Wallet cannot move your funds or recover a lost phrase.",
  },
  {
    label: "Features",
    value:
      "Send and receive; built-in swaps between supported assets (independent providers; review the rate and fees before confirming); private payroll (desktop only). Mobile supports Zano, Monero, Zcash, Bitcoin, Ethereum, fUSD, plus ERC-20 tokens including USDT and USDC. Desktop covers the same assets except Zcash.",
  },
  { label: "Ironwood", value: "Could not verify (not published)" },
  {
    label: "Sync Speed",
    value:
      "You do not need to store the full blockchain on your device; restoring a wallet, syncing its history, and waiting for network confirmations can still take time.",
  },
];

const SOURCES: { label: string; url: string }[] = [
  {
    label:
      "Freedom Wallet official site (freedomwallet.com): platforms, supported assets, self-custody, swaps, private payroll, sync behavior",
    url: "https://www.freedomwallet.com/",
  },
  {
    label: "Freedom Wallet brand kit (freedomwallet.com/brand-kit): official logo",
    url: "https://www.freedomwallet.com/brand-kit",
  },
];

export default function FreedomWallet() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold md:text-4xl">Freedom Wallet</h1>
      <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
        Self-custodial multi-asset wallet for iPhone, Android, and desktop,
        with Zcash support on mobile. &ldquo;Private money. Everywhere you
        go.&rdquo;
      </p>

      <div className="mb-8 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800">
        <Image
          src="/content-images/FreedomWallet-logo.webp"
          alt="Freedom Wallet official logo"
          width={1280}
          height={242}
          className="h-auto w-full object-cover"
        />
        <p className="px-4 py-2 text-xs text-zinc-500 dark:text-zinc-400">
          Official Freedom Wallet logo, from the project&apos;s{" "}
          <a
            href="https://www.freedomwallet.com/brand-kit"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            brand kit
          </a>
          .
        </p>
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
          Freedom Wallet is a self-custodial wallet for iPhone, Android, and
          desktop (macOS, Windows, Linux). The iPhone and Android apps support
          Zano, Monero, Zcash, Bitcoin, Ethereum, and fUSD, along with ERC-20
          tokens including USDT and USDC. The desktop app covers the same
          assets except Zcash, and adds private payroll.
        </p>
        <p className="text-zinc-700 dark:text-zinc-300">
          It is free to download; network fees apply to transactions, and
          independent swap providers may charge fees.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">
          Privacy and self-custody notes
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
          <li>
            Zano and Monero keep transactions confidential by default, and
            Zcash does when you use shielded addresses. Bitcoin and Ethereum
            use public ledgers. In the site&apos;s own words: &ldquo;Using a
            wallet does not make every asset private.&rdquo; The site does not
            publish which Zcash pools the app itself supports.
          </li>
          <li>
            You hold the keys: your recovery phrase and private keys stay on
            your device. Freedom Wallet cannot move your funds or recover a
            lost phrase, so keep a secure, offline copy of your recovery
            phrase.
          </li>
          <li>
            Built-in swaps move between supported assets, but swaps use
            independent providers. Review the rate and any provider fees
            before you confirm.
          </li>
          <li>
            You do not need to store the full blockchain on your device; the
            wallet connects to nodes. Restoring a wallet, syncing its history,
            and waiting for network confirmations can still take time.
          </li>
        </ul>
        <p className="mt-3 text-zinc-700 dark:text-zinc-300">
          For other Zcash wallets, see the{" "}
          <Link href="/wallets" className="underline">
            wallets directory
          </Link>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">Official links</h2>
        <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
          <li>
            <a
              href="https://www.freedomwallet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              freedomwallet.com
            </a>{" "}
            (official site; download from the links there and keep your
            recovery phrase to yourself)
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
          official link above for the latest support status before moving
          funds.
        </p>
      </section>
    </main>
  );
}

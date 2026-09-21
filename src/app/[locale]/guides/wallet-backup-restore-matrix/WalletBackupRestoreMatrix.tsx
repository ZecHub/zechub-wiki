import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type Source = { label: string; url: string };

type WalletRow = {
  name: string;
  kind: string;
  backup: string[];
  seedRestores: string[];
  seedMisses: string[];
  restore: string[];
  notes: string[];
  sources: Source[];
};

/**
 * Every claim below was verified against a live documentation page fetched on
 * 2026-09-21. Where docs were silent, the page says so instead of guessing.
 * Sources are linked per wallet and consolidated at the bottom of the page.
 */
const WALLETS: WalletRow[] = [
  {
    name: "Zodl (formerly Zashi)",
    kind: "Mobile wallet (iOS / Android)",
    backup: [
      "Your 24-word BIP-39 secret recovery phrase. It is shown during onboarding (\"Your Secret Recovery Phrase\" then \"Verify Your Backup\") and later under Settings → Backup wallet. On iOS, revealing it requires Face ID / Touch ID.",
      "Your wallet birthday height, or at least the rough date you created the wallet. The restore flow includes a birthday-height estimator.",
      "On Android, the encrypted address book is backed up separately through Android Auto Backup to your Google Drive. It is not part of the seed phrase.",
    ],
    seedRestores: [
      "All funds and addresses derived from the seed. Transaction history re-syncs from the chain starting at the birthday height.",
    ],
    seedMisses: [
      "The address book. On Android it lives in the separate Google Drive backup; on iOS no documented address-book backup was found.",
      "If you move to a new iPhone using an iCloud device backup, the wallet database transfers but the keys in the iOS keychain do not. Current Zodl versions detect the mismatch, remove the stale database, and re-sync the correct wallet automatically (changelog MOB-1512); on older builds you had to re-restore from the seed phrase plus birthday height manually.",
    ],
    restore: [
      "Install Zodl on the new device, choose restore, enter the 24-word phrase and your wallet birthday height, and let it sync.",
    ],
    notes: [
      "Zashi was rebranded to Zodl in February 2026 when the ECC team formed the Zcash Open Development Lab. Same app, same seed phrase, no new download needed.",
      "Restoring a Zashi/Zodl seed in Cake Wallet will not show all funds, per Cake's own migration tutorial, because wallets can handle change addresses differently.",
      "Zodl can pair with a Keystone hardware wallet, and that flow also asks for the wallet birthday height so history restores correctly.",
    ],
    sources: [
      { label: "Zashi → Zodl rebrand announcement", url: "https://zashi.app" },
      {
        label: "zodl-ios CHANGELOG (restore flow, birthday height, Keystone flow)",
        url: "https://github.com/zodl-inc/zodl-ios/blob/HEAD/CHANGELOG.md",
      },
      {
        label: "zodl-android Auto Backup docs (address book backup)",
        url: "https://github.com/zodl-inc/zodl-android/blob/HEAD/docs/Auto%20Backup.md",
      },
      {
        label: "zashi-ios issue #1024 (iOS keychain keys do not transfer to a new device)",
        url: "https://github.com/Electric-Coin-Company/zashi-ios/issues/1024",
      },
      {
        label: "Cake Wallet Zashi migration tutorial (cross-wallet restore caveat)",
        url: "https://github.com/cake-tech/cake-docs/blob/HEAD/docs/tutorials/zashi.md",
      },
    ],
  },
  {
    name: "Cake Wallet",
    kind: "Multi-coin mobile wallet (documents Zashi-seed import for migration)",
    backup: [
      "Your Cake Wallet seed phrase, backed up per Cake Wallet's own backup docs.",
    ],
    seedRestores: [
      "Cake's own wallets restore from its seed phrase.",
    ],
    seedMisses: [
      "Not all funds when restoring a Zashi/Zodl seed in Cake Wallet. Cake's own migration tutorial warns that a restored Zashi seed will not show all funds, because wallets can handle change addresses differently.",
    ],
    restore: [
      "Restore from the seed phrase in the app. For a Zashi/Zodl seed, follow Cake's migration tutorial and expect the change-address caveat above.",
    ],
    notes: [
      "Cake appears here as the cross-wallet restore case: it is the wallet whose migration tutorial documents the Zashi-seed caveat.",
    ],
    sources: [
      {
        label: "Cake Wallet Zashi migration tutorial",
        url: "https://github.com/cake-tech/cake-docs/blob/HEAD/docs/tutorials/zashi.md",
      },
    ],
  },
  {
    name: "Zingo",
    kind: "Mobile wallet + zingo-pc (desktop)",
    backup: [
      "Your 24-word BIP-39 seed phrase.",
      "Your birthday height and your account count. Together with the seed these form the minimum restore data (\"RecoveryInfo\").",
      "The mobile app prompts you to save the seed when switching wallets, creates a backup every time you open or create a wallet, and offers a \"Restore Last Wallet Backup\" menu option. Wallet files (v32+) also embed the recovery fields in the file header as a last-resort salvage.",
    ],
    seedRestores: [
      "Funds and on-chain transaction data, re-synced from the birthday height.",
    ],
    seedMisses: [
      "Local transaction metadata. Restoring from seed forfeits locally stored wallet metadata and forces a full rescan.",
      "A view-only (UFVK) wallet has no seed and no RecoveryInfo, and it can never spend.",
    ],
    restore: [
      "Restore from the seed phrase, always supplying the birthday height explicitly. A manual \"Rescan from the Wallet menu\" is also supported in zingo-pc.",
    ],
    notes: [
      "Zingo documents rebuilding a view-only wallet from a Unified Full Viewing Key (UFVK): it scans the chain, detects received funds and reports balances. That is a viewing-key path rather than a seed restore, so it lives here in the notes, not in the seed column.",
    ],
    sources: [
      {
        label: "zingolib CONTEXT.md (RecoveryInfo, birthday, view-only wallets)",
        url: "https://github.com/zingolabs/zingolib/blob/HEAD/zingolib/CONTEXT.md",
      },
      {
        label: "zingo-pc README (seed restore, UFVK import, rescan)",
        url: "https://github.com/zingolabs/zingo-pc/blob/HEAD/README.md",
      },
      {
        label: "zingolib ADR-0015 (wallet file format, embedded recovery fields)",
        url: "https://github.com/zingolabs/zingolib/blob/HEAD/docs/adr/0015-landing-in-dev-ships-the-wallet-file-format.md",
      },
      {
        label: "zingolib ADR-0007 (library birthday)",
        url: "https://github.com/zingolabs/zingolib/blob/HEAD/docs/adr/0007-library-birthday.md",
      },
      {
        label: "ZingoLabs free2z guide (mobile backup behavior)",
        url: "https://free2z.cash/zingolabs/zpage/open-another-wallet-and-restore-backup",
      },
    ],
  },
  {
    name: "Zkool",
    kind: "Mobile + desktop wallet (successor to YWallet, by hhanh00)",
    backup: [
      "Your seed phrase (12, 15, 18, 21 or 24 words), plus the optional extra passphrase and the account index if you used them. Back the phrase up before you send any funds to the account; keys live only in the on-device database.",
      "For FROST multisig accounts there is no seed phrase at all. Export the account (\"Export account as encrypted file\") or save the whole database file instead.",
      "The database holds all application data including account keys. Zkool's own docs recommend enabling the built-in encryption, and per-account encrypted export is available from the Account Edit page. Note the default zkool database is the unencrypted fallback and cannot be encrypted in place.",
    ],
    seedRestores: [
      "The account is rebuilt from seed plus passphrase plus account index, and its transactions sync from the chain.",
    ],
    seedMisses: [
      "FROST multisig accounts. They cannot be backed up like a regular account; only an account export or the database file preserves them.",
    ],
    restore: [
      "Restore from seed phrase, entering the birth height if you know roughly when the wallet was first used. Leave it blank and the wallet scans from the start of the chain: slower, but it will not miss anything. Zkool supports Sapling and later pools, but not the legacy Sprout pool. If your funds predate the Sapling upgrade (October 2018) and sit in Sprout addresses, a Zkool restore will not find them: use Argos instead, as the wiki's Recovering Funds guide describes.",
    ],
    notes: [
      "Zkool also restores from a Sapling secret key or a transparent extended key (xpub/xpriv).",
      "View-only accounts can be created from a Unified Viewing Key or Sapling extended viewing key. That is a viewing-key path rather than a seed restore, so it lives here in the notes.",
      "Under Advanced Options, Zkool offers a \"Use Internal Change\" toggle (ZIP-316): when restoring from another wallet's seed, it controls which change addresses the scan looks at. The wiki's Recovering Funds guide explains when to switch it.",
      "ZecHub's fund-recovery walkthroughs were rebuilt on Zkool, so its restore screens are the ones pictured in the wiki's recovery guide.",
    ],
    sources: [
      {
        label: "zkool2 README (seed formats, restore sources, view-only accounts)",
        url: "https://github.com/hhanh00/zkool2",
      },
      {
        label: "Zkool getting-started guide (backup warning)",
        url: "https://hhanh00.github.io/zkool2/guide/start.html",
      },
      {
        label: "zkool2 QUICKSTART (encrypted export, encryption notes)",
        url: "https://github.com/hhanh00/zkool2/blob/HEAD/QUICKSTART.md",
      },
      {
        label: "Zkool FROST docs (multisig accounts have no seed phrase)",
        url: "https://hhanh00.github.io/zkool2/frost/overview.html",
      },
      {
        label: "ZecHub Recovering Funds page (birth-height guidance, Sprout recovery)",
        url: "https://github.com/ZecHub/zechub/blob/main/site/Using_Zcash/Recovering_Funds.md",
      },
      {
        label: "Zkool announcement (successor to YWallet)",
        url: "https://forum.zcashcommunity.com/t/zkool-the-successor-to-ywallet/51139",
      },
    ],
  },
  {
    name: "Keystone + companion app",
    kind: "Hardware wallet (air-gapped, QR signing)",
    backup: [
      "The 24-word seed phrase generated on the device itself. Write it down and verify the words in order on the device screen. Newer Cypherpunk firmware also supports a 33-word SLIP39 Shamir backup.",
      "Never import a seed that was generated online (for example in a phone app) into the Keystone and expect it to be protected offline. Never type a Keystone-created phrase into a phone, browser, or computer.",
      "The companion app (Zodl, Vizor, Noir) holds sync state and account metadata, but the keys never leave the device. The QR pairing codes share only public keys and viewing information.",
    ],
    seedRestores: [
      "Everything. On device loss, all assets are restored from the seed phrase, then the device is re-paired with a companion app which re-syncs from the birthday height.",
    ],
    seedMisses: [
      "Nothing key-related. But what each companion app displays (accounts, pools, history, balances) depends on that app's integration, so the same Keystone can look different in different apps.",
    ],
    restore: [
      "Restore the seed phrase onto the Keystone, then pair it with a companion app over QR codes. In the Zodl pairing flow you can set the wallet birthday height so transaction history restores correctly.",
    ],
    notes: [
      "Shielded ZEC needs the Cypherpunk firmware. Compatible shielded companions: Zodl (mobile), Vizor (desktop/mobile), Noir (browser). Keystone Nexus is transparent-only and needs the Multi-Coin firmware.",
      "Moving from a hot wallet to cold storage: Keystone's own guidance is to create a fresh phrase offline on the device, verify the backup, and move a small test amount before moving the rest. Importing a previously-online seed cannot undo its earlier exposure.",
    ],
    sources: [
      {
        label: "Keystone Zcash page (companions, firmware, pairing, FAQ)",
        url: "https://keyst.one/zcash",
      },
      {
        label: "Keystone firmware page (Cypherpunk vs Multi-Coin vs Bitcoin-Only)",
        url: "https://keyst.one/firmware",
      },
      {
        label: "Keystone get-started guide (seed backup procedure)",
        url: "https://guide.keyst.one/docs/get-started",
      },
      {
        label: "Keystone3 firmware CHANGELOG (shielded ZEC, Ironwood, SLIP39)",
        url: "https://github.com/keystonehq/keystone3-firmware/blob/HEAD/CHANGELOG.md",
      },
    ],
  },
  {
    name: "Ledger",
    kind: "Hardware wallet",
    backup: [
      "The 24-word Secret Recovery Phrase generated on the device. Keep it offline and protected.",
    ],
    seedRestores: [
      "Transparent-ZEC accounts and other assets through Ledger Wallet.",
    ],
    seedMisses: [
      "Shielded balances are not in Ledger Wallet at all. Ledger's own support pages state that Ledger Wallet only creates unshielded (t-) addresses and cannot send to shielded (z-) addresses.",
    ],
    restore: [
      "Restore the phrase onto a Ledger device. For shielded ZEC, use the standalone \"Zcash Shielded\" app with a companion wallet such as Zkool or Vizor (supported on Nano S Plus, Stax and Flex; not on Nano X or Gen5 models).",
    ],
    notes: [
      "Ledger's integration team reported in August 2026 that native shielded send and receive in Ledger Wallet was complete in internal builds and in QA hardening, with the device app awaiting an independent security audit. Check Ledger's current support pages before relying on this.",
      "Ledger rotates transparent addresses, so a plain seed import may not recover everything. The documented fallback is Zkool's \"Find other transparent addresses\" scan: the wiki's Recovering Funds guide covers sweeping a transparent-only wallet (including Ledger seeds) with Zkool.",
    ],
    sources: [
      {
        label: "Ledger support: Zcash transparent-only in Ledger Wallet",
        url: "https://support.ledger.com/article/115005177269-zd",
      },
      {
        label: "Ledger support: no sending to shielded addresses",
        url: "https://support.ledger.com/article/7497812374941-zd",
      },
      {
        label: "ZecHub Recovering Funds page (sweeping transparent-only wallets with Zkool)",
        url: "https://github.com/ZecHub/zechub/blob/main/site/Using_Zcash/Recovering_Funds.md",
      },
      {
        label: "Crypto Briefing: Zcash Shielded app with Zkool/Vizor companions",
        url: "https://cryptobriefing.com/zcash-ledger-shielded-transactions-support/",
      },
      {
        label: "Zcash forum: Ledger shielded integration status (Aug 2026)",
        url: "https://forum.zcashcommunity.com/t/a-path-forward-for-ledger-and-zcash/50951",
      },
    ],
  },
  {
    name: "Zallet",
    kind: "Node-operator wallet (Zcash Foundation, replaces zcashd)",
    backup: [
      "wallet.db at {datadir}/wallet.db. The SQLite database holds everything: accounts, transaction history, viewing keys, and all key material including the key store.",
      "The age encryption identity file (default {datadir}/encryption-identity.txt). It decrypts the key material inside wallet.db. Lose it, or forget its passphrase, and the key material in every copy of wallet.db becomes permanently undecryptable.",
      "Each mnemonic phrase independently. Zallet uses BIP-39 mnemonics (created with zallet generate-mnemonic), and each one is an independent root of spend authority.",
      "Per-account metadata: the seed fingerprint (seedfp), the ZIP-32 account index, the account name, and the birthday height.",
    ],
    seedRestores: [
      "Only the accounts derived from that mnemonic.",
    ],
    seedMisses: [
      "Everything not derived from the seed: spending keys imported with z_importkey, and watch-only material imported with z_importaddress or carried over from a zcashd migration. Those exist only in wallet.db. There is currently no single command or RPC that produces a complete wallet backup.",
    ],
    restore: [
      "Full restore: stop Zallet, place your backed-up wallet.db and encryption-identity file at the configured datadir locations, start Zallet. The wallet resumes from the backed-up state and syncs forward. This is the only restore path that recovers imported keys and watch-only material.",
      "Mnemonic-only restore: on a fresh setup, run generate-encryption-identity, init-wallet-encryption, then import-mnemonic, then re-create each account with the z_recoveraccounts RPC, passing the account name, seed fingerprint (seedfp), ZIP-32 account index and birthday height.",
    ],
    notes: [
      "wallet.db as a whole is not encrypted: transaction history and viewing keys are stored in the clear, only the key material is age-encrypted. Treat the file accordingly.",
      "Migrating from zcashd: run a zebrad node, install Zallet, migrate-zcash-conf, initialize wallet encryption before any keys exist, then migrate-zcashd-wallet, then start and sync. Migration carries mnemonic seeds and derived keys, standalone imported Sapling spending keys and transparent keys, transparent watch-only entries that include their public key or redeem script, and account birthdays. It does not migrate Sprout spending keys or funds (move those first), address book entries, watch-only entries without a public key or redeem script, uncompressed-pubkey entries, or regtest wallets. Keep your original zcashd wallet.dat.",
    ],
    sources: [
      {
        label: "Zallet book: backup guide",
        url: "https://github.com/zcash/zallet/blob/HEAD/book/src/guide/backup.md",
      },
      {
        label: "Zallet book: setup guide (generate-mnemonic)",
        url: "https://github.com/zcash/zallet/blob/HEAD/book/src/guide/setup.md",
      },
      {
        label: "Zallet book: encryption concepts (what is stored in the clear)",
        url: "https://github.com/zcash/zallet/blob/HEAD/book/src/concepts/encryption.md",
      },
      {
        label: "Zallet book: migrate-zcashd-wallet CLI reference",
        url: "https://github.com/zcash/zallet/blob/HEAD/book/src/cli/migrate-zcashd-wallet.md",
      },
      {
        label: "Zallet book: zcashd migration guide",
        url: "https://github.com/zcash/zallet/blob/HEAD/book/src/zcashd/README.md",
      },
    ],
  },
  {
    name: "ZECD",
    kind: "Wallet server (by zec.rocks; sits between apps and a local Zebra node)",
    backup: [
      "The 24-word mnemonic. It is shown once at zecd init. Funds are recoverable from the mnemonic alone; everything else is convenience.",
      "keys.toml (<wallet dir>/keys.toml): the age-encrypted mnemonic plus network and birthday height.",
      "identity.txt: the age identity that decrypts keys.toml. This is spend authority, so store its backup separately from keys.toml backups.",
      "The birthday height. It lives inside keys.toml, and it is worth recording alongside the mnemonic.",
    ],
    seedRestores: [
      "Everything fund-related. Server restore: place keys.toml and identity.txt back in their configured paths and start the daemon; with bootstrap_from_keys on (the default), the account is recreated from keys.toml and the database rebuilds by rescanning from the stored birthday.",
    ],
    seedMisses: [
      "Transparent funds outside the configured gap limit / initial-scan window: shielded funds recover unconditionally from the seed, but transparent funds are only picked up within the configured gap limit, per zecd.org. data.sqlite and the blocks cache are disposable and rebuild by rescan; the .cookie file is ephemeral.",
    ],
    restore: [
      "Server restore: place keys.toml and identity.txt back in their configured paths and start the daemon, as above.",
      "From-seed restore: zecd init --datadir /var/lib/zecd --restore --birthday <height>. Pass --birthday at or before the wallet's first transaction. Without it, the restore scans from Sapling activation: safe, never misses notes, but slow on mainnet. Balances are not final until /readyz reports ready.",
    ],
    notes: [
      "Watch-only instance: export the viewing key on the spending wallet with zecd export-ufvk, then run zecd init --ufvk \"uview1...\" --birthday <height> on the watch-only host. A watch-only wallet has no mnemonic; it is fully reconstructable from the UFVK plus birthday, so record both. That is a viewing-key path rather than a seed restore.",
      "ZECD is a wallet daemon, not a full node: it exposes a Bitcoin Core style JSON-RPC interface, uses Ironwood by default (at the wallet's Orchard receiver), and uses ZIP-317 fees.",
      "A rescan deletes only the wallet database and block cache. keys.toml (seed, network, birthday, UFVK pin) is kept, so the next start rebuilds the account from the seed and rescans from the wallet birthday.",
    ],
    sources: [
      {
        label: "zecd OPERATIONS.md (backup artifacts, restore, birthday behavior)",
        url: "https://github.com/zecrocks/zecd/blob/HEAD/docs/OPERATIONS.md",
      },
      {
        label: "zecd repository",
        url: "https://github.com/zecrocks/zecd",
      },
      {
        label: "zecd.org (Ironwood by default, gap-limit recovery, stateless restore)",
        url: "https://zecd.org",
      },
      {
        label: "ZecHub ZECD page (quick-start restore command)",
        url: "https://github.com/ZecHub/zechub/blob/main/site/Zcash_Tech/ZECD.md",
      },
    ],
  },
  {
    name: "zcashd (legacy)",
    kind: "Full node wallet (being replaced by Zebra + Zallet)",
    backup: [
      "wallet.dat at ~/.zcash/wallet.dat, a Berkeley DB file holding keys and transactions. Keep it private and back it up regularly.",
      "On zcashd v4.7.0 and later, the BIP-39 emergency recovery phrase (from z_exportwallet output). Confirm the backup with the zcashd-wallet-tool utility, which checks it without exposing the phrase to shell history.",
    ],
    seedRestores: [
      "Only funds in addresses generated after the 4.7.0 upgrade, and only if those funds were moved to the new addresses. All new addresses derive from the HD seed under ZIP-32 and ZIP-316.",
    ],
    seedMisses: [
      "Funds tied to pre-existing addresses, unless they were moved to newly generated addresses after the 4.7.0 upgrade. The release notes are explicit: existing funds are not recoverable from the emergency recovery phrase unless moved.",
      "Imported and legacy keys still require wallet.dat itself.",
      "A backupwallet copy is an exact snapshot: addresses generated after the backup are not in it.",
    ],
    restore: [
      "Official methods: backupwallet (exact copy, recommended), z_exportwallet / z_importwallet (human-readable bundle of all private keys), or per-key z_exportkey / z_importkey and dumpprivkey / importprivkey.",
    ],
    notes: [
      "Included here because migration to Zallet starts from a zcashd wallet.dat. Keep the original file even after migrating. For recovering pre-4.7.0 or Sprout funds, see the wiki's Recovering Funds guide (Argos).",
    ],
    sources: [
      {
        label: "zcashd docs: files (wallet.dat)",
        url: "https://zcash.readthedocs.io/en/latest/rtd_pages/files.html",
      },
      {
        label: "zcashd docs: wallet backup methods",
        url: "https://zcash.readthedocs.io/en/latest/rtd_pages/wallet_backup.html",
      },
      {
        label: "zcashd v4.7.0 release notes (emergency recovery phrase)",
        url: "https://github.com/zcash/zcash/blob/HEAD/doc/release-notes/release-notes-4.7.0.md",
      },
    ],
  },
  {
    name: "Watch-only / viewing-key setups",
    kind: "Read-only tracking (any compatible wallet)",
    backup: [
      "The viewing key itself: in zcashd, z_exportviewingkey (Sapling viewing keys begin with \"zxviews\"); unified viewing keys look like \"uview1...\".",
      "The birthday height, so the watching wallet knows where to start scanning.",
    ],
    seedRestores: [
      "Not applicable in the seed sense. Importing the viewing key (z_importviewingkey) restores the ability to see balances and transactions. z_getbalance shows the balance of an imported Sapling viewing key; z_gettotalbalance includes watch-only balances when includeWatchonly is true (RPC behavior in the releases fetched for this guide; flags may differ across versions).",
    ],
    seedMisses: [
      "Spend authority, always. A viewing key grants read access, never the ability to spend. That is the entire point of selective disclosure.",
      "Accurate balances after outgoing spends, for incoming viewing keys: they cannot detect spends, so a balance can look wrong once funds have been sent from the address. Full Sapling viewing keys track both sent and received transactions.",
    ],
    restore: [
      "Import the viewing key into the watching wallet and rescan from the birthday height. Zingo documents UFVK import as a read-only mode, Zkool creates view-only accounts from a Unified Viewing Key or Sapling extended viewing key, and ZECD accepts zecd init --ufvk.",
    ],
    notes: [
      "Viewing keys are how you let someone (an accountant, a co-signer, yourself on a second device) monitor an address without any risk of the funds moving.",
      "Ordinary watch-only import in Zodl/Zashi and the Zingo mobile app was not documented in the pages fetched for this guide; the confirmed watch-only paths are the ones named above.",
    ],
    sources: [
      {
        label: "zcashd docs glossary (viewing key definition)",
        url: "https://zcash.readthedocs.io/en/latest/rtd_pages/glossary.html",
      },
      {
        label: "zcashd docs: Zcash basics (selective disclosure)",
        url: "https://zcash.readthedocs.io/en/master/rtd_pages/basics.html",
      },
      {
        label: "zcashd v1.0.14 release notes (incoming viewing keys cannot spend)",
        url: "https://github.com/zcash/zcash/blob/HEAD/doc/release-notes/release-notes-1.0.14.md",
      },
      {
        label: "zcashd v2.1.2 release notes (z_exportviewingkey / z_importviewingkey)",
        url: "https://github.com/zcash/zcash/blob/HEAD/doc/release-notes/release-notes-2.1.2-rc1.md",
      },
    ],
  },
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function SourceLinks({ sources }: { sources: Source[] }) {
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
      Sources:{" "}
      {sources.map((s, i) => (
        <span key={s.url}>
          {i > 0 && " · "}
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {s.label}
          </a>
        </span>
      ))}
    </p>
  );
}

function Callout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="p-5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 my-6">
      <p className="font-semibold mb-2">{title}</p>
      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function WalletBackupRestoreMatrix() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        <Link href="/guides" className="hover:underline">
          Guides
        </Link>{" "}
        / Wallet backup and restore
      </p>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Zcash Wallet Backup and Restore Matrix
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        &ldquo;Write down your seed phrase&rdquo; used to be the whole backup
        advice for Zcash. It is not anymore. Since the move from{" "}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">
          zcashd
        </code>{" "}
        to Zebra plus Zallet, different wallets keep different pieces of your
        recovery in different places: seed phrases, database files, encryption
        identity files, birthday heights, imported keys, viewing keys. This
        guide shows, wallet by wallet, what you must actually save to get your
        funds back.
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Every claim on this page was checked against a live documentation page
        in September 2026. Where the docs were silent, the page says so instead
        of guessing. Links to every source are at the bottom.
      </p>

      <Callout title="The one-sentence version">
        <p>
          Your seed phrase is the root of your spending power, but it only
          restores what was <em>derived from it</em>. Anything imported later,
          any watch-only setup, and any wallet-specific extras live in files or
          backups you must save separately. Check your wallet&apos;s row below.
        </p>
      </Callout>

      <h2 className="text-2xl font-bold mt-10 mb-4">The matrix</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Read your wallet&apos;s row across: what to back up, what the seed
        phrase brings back, what it does not, and the fine print. Scroll the
        table sideways on small screens. Details and sources for each wallet
        follow below.
      </p>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 mb-10">
        <table className="w-full text-sm min-w-[880px]">
          <caption className="sr-only">
            Backup and restore matrix: what each wallet requires you to back
            up, what a seed phrase restores, what it does not restore, and
            the fine print.
          </caption>
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-left">
              <th scope="col" className="p-3 font-semibold align-top">Wallet / setup</th>
              <th scope="col" className="p-3 font-semibold align-top">Back up this</th>
              <th scope="col" className="p-3 font-semibold align-top">
                Seed phrase restores
              </th>
              <th scope="col" className="p-3 font-semibold align-top">
                Seed phrase does NOT restore
              </th>
              <th scope="col" className="p-3 font-semibold align-top">Fine print</th>
            </tr>
          </thead>
          <tbody>
            {WALLETS.map((w) => (
              <tr
                key={w.name}
                className="border-t border-gray-200 dark:border-gray-700 align-top"
              >
                <td className="p-3">
                  <p className="font-semibold">{w.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {w.kind}
                  </p>
                </td>
                <td className="p-3">
                  <BulletList items={w.backup} />
                </td>
                <td className="p-3">
                  <BulletList items={w.seedRestores} />
                </td>
                <td className="p-3">
                  <BulletList items={w.seedMisses} />
                </td>
                <td className="p-3">
                  <BulletList items={w.notes} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-2">Wallet-by-wallet details</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        The full backup list, restore steps, and sources for each row in the
        matrix.
      </p>
      <div className="space-y-6">
        {WALLETS.map((w) => (
          <section
            key={w.name}
            className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <h3 className="text-xl font-bold">{w.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {w.kind}
            </p>
            <div className="grid md:grid-cols-2 gap-5 text-sm">
              <div>
                <p className="font-semibold mb-2">Back up this</p>
                <BulletList items={w.backup} />
              </div>
              <div>
                <p className="font-semibold mb-2">Restore steps</p>
                <BulletList items={w.restore} />
              </div>
              <div>
                <p className="font-semibold mb-2 text-emerald-700 dark:text-emerald-400">
                  Seed restores
                </p>
                <BulletList items={w.seedRestores} />
              </div>
              <div>
                <p className="font-semibold mb-2 text-red-700 dark:text-red-400">
                  Seed does NOT restore
                </p>
                <BulletList items={w.seedMisses} />
              </div>
            </div>
            {w.notes.length > 0 && (
              <div className="mt-4 text-sm">
                <p className="font-semibold mb-2">Notes</p>
                <BulletList items={w.notes} />
              </div>
            )}
            <SourceLinks sources={w.sources} />
          </section>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">
        What a seed phrase restores, and what it does not
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Zcash wallets derive addresses hierarchically from a seed (ZIP-32, with
        unified addresses under ZIP-316). A one-time backup of the seed, usually
        written down as a BIP-39 mnemonic phrase, can recover funds from all
        future addresses derived from it. That is the good news, and it is why
        the phrase is the single most important thing you own.
      </p>
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="p-5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40">
          <p className="font-semibold mb-2 text-emerald-800 dark:text-emerald-300">
            A seed phrase restores
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>
              Spending power over every account and address derived from that
              seed.
            </li>
            <li>
              Your funds, by re-scanning the blockchain from your birthday
              height.
            </li>
            <li>
              Transaction history, rebuilt from chain data during that scan.
            </li>
          </ul>
        </div>
        <div className="p-5 rounded-xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/40">
          <p className="font-semibold mb-2 text-red-800 dark:text-red-300">
            A seed phrase does NOT restore
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>
              Keys you imported separately (for example with{" "}
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
                z_importkey
              </code>
              ). These were never derived from your seed.
            </li>
            <li>
              Watch-only addresses and imported viewing keys. Read-only by
              design, and stored apart from the seed.
            </li>
            <li>
              Wallet-specific extras: address books, labels, and other local
              metadata. Zingo&apos;s docs state it plainly: restoring from seed
              forfeits local transaction metadata.
            </li>
            <li>
              Funds tied to keys from before a wallet adopted HD seeds, unless
              you moved them to new addresses (the zcashd 4.7.0 case above).
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">
        wallet.db vs keys.toml: when the file matters
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Node and server wallets keep a database or config file alongside the
        seed. Here is when that file is load-bearing and when it is just a
        cache.
      </p>
      <ul className="space-y-4 text-gray-600 dark:text-gray-300 mb-8">
        <li className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Zallet&apos;s wallet.db (and zcashd&apos;s wallet.dat before it)
          </p>
          <p className="text-sm">
            This file matters whenever you have anything the seed does not
            cover: imported spending keys, imported addresses, watch-only
            entries. It is also the only restore path that brings back
            transaction history without a full rescan. Zallet encrypts the key
            material inside it with age, so the file alone is useless without
            the encryption identity file. And note: the database file itself is
            not encrypted at rest, so history and viewing keys inside are
            readable to anyone holding the file.
          </p>
        </li>
        <li className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            ZECD&apos;s keys.toml
          </p>
          <p className="text-sm">
            This file matters because it bundles the age-encrypted mnemonic
            with the network and birthday height, and its companion{" "}
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
              identity.txt
            </code>{" "}
            is what decrypts it. Keep the two files&apos; backups separate:
            the identity file alone is spend authority. ZECD&apos;s actual
            chain-data cache (
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
              data.sqlite
            </code>
            ) is disposable and rebuilds from a rescan.
          </p>
        </li>
        <li className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            The rule of thumb
          </p>
          <p className="text-sm">
            If everything you own was derived from one seed and you are happy
            to wait through a rescan, the seed plus the birthday height is
            enough. The moment you import a key, add a watch-only address, or
            want your history back fast, you also need the wallet&apos;s files.
          </p>
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">
        Birthday heights, in plain language
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        A birthday height is simply the block number where your wallet starts
        looking for your money. ZIP-326 (NU6.3 Consequences for Wallets, a
        draft ZIP) uses the definition in passing: a lower bound on the height
        of the first block in which your account could have received funds.
        When you restore, the wallet scans the chain from that height forward
        instead of from the very beginning.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-8">
        <li>
          <strong className="text-gray-900 dark:text-gray-100">
            Set it too late and you lose money.
          </strong>{" "}
          If you first received ZEC in 2021 but start scanning from 2024, the
          wallet may never see the earlier receipt it needs to reconstruct your
          funds.
        </li>
        <li>
          <strong className="text-gray-900 dark:text-gray-100">
            Set it too early, or leave it blank, and the restore is just slow.
          </strong>{" "}
          Scanning from the start of the chain is safe and never misses notes,
          but it takes much longer on mainnet. When in doubt, guess early, not
          late.
        </li>
        <li>
          <strong className="text-gray-900 dark:text-gray-100">
            Most software wallets in this guide ask for it at restore time.
          </strong>{" "}
          Zodl has a birthday estimator in the restore flow, Zingo requires you
          to supply it explicitly, Zkool lets you enter a birth height (or
          blank for a full scan), ZECD takes{" "}
          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
            --birthday
          </code>
          , and Zallet&apos;s recovery RPC takes a birthday height per account.
          Hardware wallets are the exception: Ledger and Keystone restore the
          phrase on the device itself with no birthday prompt. zcashd&apos;s
          backupwallet is an exact file copy, so no birthday height is
          involved there either.
        </li>
        <li>
          <strong className="text-gray-900 dark:text-gray-100">
            Write it down with your seed phrase.
          </strong>{" "}
          The date you created the wallet is enough to pick a safe height. A
          slightly-early guess is the correct kind of wrong.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">
        How to test a restore without risking funds
      </h2>
      <Callout title="Honest caveat first">
        <p>
          No official Zcash, wallet, or ZecHub documentation page found during
          research describes a backup-verification procedure. The steps below
          are general self-custody practice, not a sourced wallet feature.
          Where a wallet documents something related, it is called out.
        </p>
      </Callout>
      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-8">
        <li>
          <strong className="text-gray-900 dark:text-gray-100">
            Restore somewhere separate.
          </strong>{" "}
          Install the wallet fresh on a second device (or a fresh install) and
          restore from your written seed phrase and birthday height. Do not
          wipe the original until the test is done.
        </li>
        <li>
          <strong className="text-gray-900 dark:text-gray-100">
            Compare addresses and balance.
          </strong>{" "}
          The restored wallet should show the same receive addresses and, after
          syncing, the same balance as the original.
        </li>
        <li>
          <strong className="text-gray-900 dark:text-gray-100">
            Move a tiny amount first.
          </strong>{" "}
          Keystone&apos;s own Zcash guidance says it directly: verify the
          backup, then transfer a small test amount before moving the rest.
          Zkool&apos;s docs likewise insist on backing up the seed phrase
          before sending any funds to the account.
        </li>
        <li>
          <strong className="text-gray-900 dark:text-gray-100">
            Test watch-only separately.
          </strong>{" "}
          If you rely on a viewing key, import it into the watching wallet and
          confirm it sees the expected balance. Remember an incoming viewing
          key cannot detect spends, so test with an address that has only
          received funds.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Quick backup checklist</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-8">
        <li>Seed phrase written down on paper (or steel), stored offline.</li>
        <li>Birthday height, or the date the wallet was created, written with it.</li>
        <li>
          Any extra files your wallet needs: Zallet&apos;s wallet.db plus its
          encryption identity file; ZECD&apos;s keys.toml plus identity.txt
          stored separately; zcashd&apos;s wallet.dat.
        </li>
        <li>
          A record of anything imported: standalone keys, watch-only addresses,
          multisig exports.
        </li>
        <li>
          For hardware wallets: the phrase generated on the device, verified on
          the device screen, never typed into a phone or computer.
        </li>
        <li>
          One successful test restore, on a separate device, before you need it
          for real.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">
        What this guide could not verify
      </h2>
      <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 mb-8">
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li>
            Whether Trezor supports shielded Zcash today. No official Trezor
            documentation page confirming its current status was found during
            research; treat it as unknown until checked live.
          </li>
          <li>
            Whether the Zodl iOS app backs up the address book anywhere. Only
            the Android Auto Backup behavior is documented.
          </li>
          <li>
            Ordinary watch-only / viewing-key import in the Zodl mobile app.
            Confirmed watch-only paths are Zingo (UFVK import), Zkool
            (view-only accounts), ZECD (<code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">--ufvk</code>),
            zcashd (<code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">z_importviewingkey</code>),
            and Zallet (imported viewing keys in wallet.db).
          </li>
          <li>
            Whether ZECD has ever been renamed. Its repository, docs, and
            changelog consistently call it ZECD; no rename was found.
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">Related wiki pages</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-8">
        <li>
          <Link
            href="/using-zcash/recovering-funds"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Zcash Wallet Fund Recovery
          </Link>{" "}
          — step-by-step recovery walkthroughs, rebuilt on Zkool.
        </li>
        <li>
          <Link
            href="/using-zcash/wallets"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Zcash Wallets
          </Link>{" "}
          — the wiki&apos;s wallet directory.
        </li>
        <li>
          <Link
            href="/guides/keystone-zashi"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Keystone Zashi User Guide
          </Link>{" "}
          — pairing a Keystone with Zashi/Zodl over QR codes.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Sources</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Every source below is a documentation page fetched and checked in
        September 2026.
      </p>
      <ul className="space-y-2 text-sm mb-12">
        {WALLETS.flatMap((w) => w.sources).map((s) => (
          <li key={s.url} className="text-gray-600 dark:text-gray-300">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {s.url}
            </a>{" "}
            <span className="text-gray-500 dark:text-gray-400">
              — {s.label}
            </span>
          </li>
        ))}
        <li className="text-gray-600 dark:text-gray-300">
          <a
            href="https://github.com/zcash/zips/blob/HEAD/zips/zip-0326.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
          >
            https://github.com/zcash/zips/blob/HEAD/zips/zip-0326.md
          </a>{" "}
          <span className="text-gray-500 dark:text-gray-400">
            — ZIP-326 (NU6.3 Consequences for Wallets; uses the birthday-height definition in passing)
          </span>
        </li>
        <li className="text-gray-600 dark:text-gray-300">
          <a
            href="https://github.com/zcash/zips/blob/HEAD/zips/zip-0032.rst"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
          >
            https://github.com/zcash/zips/blob/HEAD/zips/zip-0032.rst
          </a>{" "}
          <span className="text-gray-500 dark:text-gray-400">
            — ZIP-32 (hierarchical deterministic wallets)
          </span>
        </li>
      </ul>
    </div>
  );
}

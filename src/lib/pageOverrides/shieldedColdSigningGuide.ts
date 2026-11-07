// Rewrite of the Shielded Cold Signing page (checked 6 Nov 2026). The source ran to ~670 lines with the same
// key-isolation explanation repeated four times, a duplicated device table, an unfinished "Image companion vs hardware
// capabilities" line, raw YouTube and forum URLs in the body, a forum user's missing-funds report that is unrelated to
// cold signing, and statements about Ledger written before September (device list "as of 21 July", Zondax app
// "being withdrawn on 5 November", a Brave fee bug). What this version keeps: the key model (spending key, UFVK), the
// companion/hardware split, PCZT roles, and the three signers.
// Verified today: Ledger Wallet Desktop supports shielded Zcash for Ironwood ZEC only, each transfer confirmed on the
// device, announced September 23-24, 2026, with the Zondax "Zcash Shielded" app planned to stop being offered on
// November 5 (BingX report of Ledger's notice); Keystone 3 Pro Cypherpunk firmware 3.0.2 is required for Ironwood and
// adds batch PCZT signing, with Zodl 3.9.0+, Vizor 0.0.39+ and Noir named as companions (Keystone migration guide,
// updated Aug 11, 2026); Ironwood activated July 28, 2026 at block 3,428,143 (this wiki). Version numbers for Ledger
// (Wallet Desktop 4.21+, Zcash app 3.9.4+), the PCZT v2 / v6 sighash details and Hito's status come from the original
// page and were not re-verified. If the page no longer has this shape, the original markdown is returned untouched.
export function rewriteShieldedColdSigning(original: string): string {
  if (!/^# Shielded Cold Signing\s*$/im.test(original)) return original;
  if (!original.includes("## PCZT") || !original.includes("## 2. Keystone")) return original;

  const fig = (file: string, alt: string) =>
    `<div className="my-5 mx-auto max-w-[560px]"><img src="/content-images/${file}" alt="${alt}" className="h-auto w-full rounded-lg border border-slate-200 dark:border-slate-700" /></div>`;
  for (const f of ["key-derivation-diagrams", "cold-signing-process", "key-isolation", "hardware-wallet-implementations", "keystone-zashi-viewing-flow", "keystone-spend-flow", "hito-onboarding", "hito-signing-flow", "orchard-to-ironwood-evolution"]) {
    if (!original.includes(`/content-images/${f}.webp`)) return original;
  }

  return `# Shielded Cold Signing

> **Key idea:** a companion wallet sees what it needs to build and monitor a shielded transaction. Only the hardware wallet holds the authority to approve a spend. That split is the whole point of shielded cold signing.

## TL;DR

- Cold signing keeps the spending key on a hardware wallet and lets an online companion wallet do everything else.
- The companion holds a viewing key (UFVK). It can see your shielded activity and prepare transactions, but it cannot sign a spend.
- Transactions travel between the two as a PCZT (Partially Created Zcash Transaction). The device checks it, signs it, and returns it.
- Today shielded cold signing works with Ledger, Keystone and Hito, and all three are adapting to Ironwood.

## Status by device

| Device | Companion | Link to the companion | Ironwood |
|---|---|---|---|
| Ledger | Ledger Wallet Desktop; the older Zondax app is being withdrawn | USB or Bluetooth | Ironwood only |
| Keystone 3 Pro | Zodl, Vizor, Noir | QR codes (air-gapped) | Firmware 3.0.2 or newer |
| Hito | Hito's own Android wallet | QR codes and Bluetooth | In development |

## Why the work is split

A shielded transaction is heavier than a transparent one. It involves notes, nullifiers, zero-knowledge proofs and signatures. A hardware wallet has little memory and computing power, so it should not do all of it. Cold signing divides the work by what needs to be trusted:

| Step | What it does | Where it runs |
|---|---|---|
| Construction | Picks the notes to spend, sets inputs, outputs and fees, derives nullifiers | Companion wallet |
| Proving | Generates the zero-knowledge proof (Halo 2 for Orchard and Ironwood, Groth16 for Sapling) | Companion wallet |
| Signing | Produces the signature that authorizes the spend | Hardware wallet |

Proving and signing are different things. A proof shows that the transaction follows the protocol rules. A signature shows that the owner approves this specific transfer. Proving is expensive and needs no secret authority. Signing is cheap and needs the spending key, which is why it belongs on the device.

![Shielded cold signing process](/content-images/cold-signing-process.webp)

## Keys: what the companion can and cannot have

Every shielded pool derives its keys as a tree from one root. Spending authority and viewing ability are two separate branches, and derivation only goes one way: a viewing key cannot be turned back into a spending key.

- **Spending key.** Authorizes spends. In cold signing it stays inside the hardware wallet and is never exported.
- **Full viewing key (FVK), shared as a Unified Full Viewing Key (UFVK).** Derived from the spending key. It lets software detect and decrypt the wallet's shielded activity, including outgoing payments, and compute balances. It cannot authorize a spend.
- **Diversified addresses.** Many unlinkable addresses share one viewing key, so generating more of them does not add scanning work.

${fig("key-derivation-diagrams.webp", "Key derivation in Sapling and Orchard: a spending key branches into a spend-authorizing key and a full viewing key")}

Zcash already separates the two at the protocol level, so hardware wallet makers build on the existing structure instead of inventing their own.

> **Privacy caveat.** A companion wallet holding the UFVK cannot steal your funds, but it can see all of your shielded activity. It has viewing authority, not just "public information". Install companion software you trust.

## Key isolation

Key isolation means the keys that can authorize a spend never leave the hardware wallet. If the computer or phone running the companion wallet is compromised, an attacker may be able to watch what you do or alter an unsigned transaction before it is signed, but cannot extract the spending key from the device. That is why the device must show you what it is about to sign and verify it itself, instead of signing whatever the companion sends.

${fig("key-isolation.webp", "Key isolation: the companion wallet prepares the transaction, and only the hardware wallet can sign it")}

## PCZT: the hand-off format

PCZT stands for Partially Created Zcash Transaction. It is a standard container that carries a transaction between the participants who build it, so a powerful computer can assemble and prove the transaction while a constrained device only checks and signs.

| # | Role | What it does |
|---|---|---|
| 1 | Creator | Starts the PCZT with global data such as transaction version, consensus branch id and pool flags |
| 2 | Constructor | Adds the intended inputs and outputs across the transparent, Sapling, Orchard or Ironwood pools |
| 3 | IO Finalizer | Declares inputs and outputs complete, computes binding signature data and signs dummy spends where needed |
| 4 | Updater | Attaches context for later roles, such as viewing keys, anchors and Merkle witnesses |
| 5 | Prover and Signer | Generate the proof and the signatures. In current PCZT versions these two roles are independent and can run in sequence or in parallel |
| 6 | Combiner | Merges PCZTs when different devices work on the same transaction |
| 7 | Spend Finalizer and Extractor | Checks that everything required is present, strips intermediate data and produces the final transaction ready to broadcast |

A signer cannot accept an arbitrary blob and sign it. It needs enough data to confirm that what it signs matches what you intend to approve, such as the amounts and recipient addresses, while staying within strict limits on memory and firmware size. Delegating proving also means the prover sees note values, recipients and commitments, though it never gains the authority to spend.

Two proposals aim at the same constraint from different sides: a research grant on a constant-time proving pipeline for open-source hardware wallets ([Grant #423](https://forum.zcashcommunity.com/t/grant-application-research-on-a-fully-constant-time-proving-pipeline-for-open-source-hardware-wallet-architectures-reusable-for-standard-computers/57555)) and the proposed [Zcash SeedSigner](https://forum.zcashcommunity.com/t/grant-application-zcash-seedsigner-a-diy-open-source-air-gapped-signer-for-shielded-zec/57381), an open-source air-gapped signer that passes a PCZT across an air gap. Both are proposals, not shipped products.

A June 2026 proposal for a shared PCZT interoperability test suite was not funded by Zcash Community Grants, so there is no common test suite across implementations today ([forum thread](https://forum.zcashcommunity.com/t/pczt-interoperability-test-suite-feedback-before-at-grant-submission/55931)).

## Ledger

Ledger devices have a Secure Element that keeps key material isolated from the host. A Ledger device needs an app for each currency, and Zcash has had two.

**Legacy app: Zondax "Zcash Shielded".** Built by Zondax, a third-party developer, and used with companion wallets such as Zkool. Ledger announced that it would stop offering it on November 5, 2026, and told users to move funds before then. Check Ledger's support pages for its current status.

**Native support: Ledger Wallet Desktop.** Since September 2026, Ledger Wallet Desktop supports shielded Zcash directly, with every transfer approved on the Ledger device. It covers ZEC held in Ironwood only. It does not show or manage Orchard or Sapling funds. According to the original page, it needs Ledger Wallet Desktop 4.21 or newer and Zcash device app 3.9.4 or newer, and supports private-to-private transfers, shielding, unshielding and memos. Shielded ZEC is not yet on Ledger's mobile app.

**What leaves the device.** The Ledger Zcash app can export a viewing key, either a UFVK or an Orchard FVK. It has no function that returns the spending key. The computer stores the UFVK to sync and track the balance. The device produces the spend authorization signature, and the host receives only that signature. The host handles proving, the binding signature and final assembly.

**Account compatibility.** The legacy app used a different derivation scheme for shielded accounts, so its Sapling accounts cannot simply be reproduced by the new app. This is why the retirement of the legacy app matters for anyone who used it.

**Zkool.** Zkool is the successor to Ywallet, which stopped receiving updates, and it relied on the Zondax app to talk to Ledger devices. The sources I could open do not say how Zkool will connect to Ledger devices once the legacy app is gone.

${fig("hardware-wallet-implementations.webp", "Ledger, Keystone and Hito: what the companion receives and what stays on the device")}

## Keystone

Keystone is an air-gapped hardware wallet: it exchanges data with the companion only through QR codes, never over a cable or wireless link during signing.

When you connect Keystone to a companion wallet such as Zodl (formerly Zashi), the UFVK is transferred from Keystone to the app. The app uses it to find incoming shielded transactions, work out balances and read shielded activity. The seed and spending keys stay in Keystone, and nothing that leaves the device is enough to move funds. This is why the pairing counts as shielded cold storage.

${fig("keystone-zashi-viewing-flow.webp", "Keystone sends its viewing key to the companion app as a QR code")}

To spend, the companion builds the transaction and shows an unsigned QR code. Keystone scans it, parses it, shows the details on its screen for you to verify, signs, and returns the signed result as a QR code for the app to broadcast.

${fig("keystone-spend-flow.webp", "Keystone spending flow: unsigned QR to the device, signed QR back to the app")}

For Ironwood, Keystone's migration guide requires firmware 3.0.2 or newer on the Keystone 3 Pro, which is the Cypherpunk firmware. You cannot go back to the Multi-Coin or Bitcoin-Only firmware once you move to it. Firmware 3.0.2 adds batch PCZT signing for Zcash. The guide names Zodl 3.9.0 or later, Vizor 0.0.39 or later, and Noir as companions, and says Orchard funds do not expire and there is no migration deadline. See Keystone's [Ironwood migration guide](https://keyst.one/zcash/updates/keystone-ironwood-migration-guide-2026-07).

## Hito

Hito follows a similar model, but ships with its own Android wallet. When onboarding the hardware account, the app receives the UFVK, the Unified Address, the ZIP-32 seed fingerprint and the network. The seed fingerprint only identifies which account is which and gives no spending ability. The app never receives the seed or spending keys.

${fig("hito-onboarding.webp", "Hito onboarding: the Android app receives the viewing key, address, seed fingerprint and network")}

According to Hito's published development milestones, the workflow of creating the unsigned PCZT, exporting it, signing offline and importing the signed PCZT back is operational, with Bluetooth transport and BBQr QR export of the signed PCZT. Stable firmware and a broader release were still in progress when this page was last reviewed.

${fig("hito-signing-flow.webp", "Hito signing flow: the app creates the PCZT, Hito signs offline, the app imports the signed PCZT")}

## What Ironwood changed for signers

Ironwood (NU6.3) activated on July 28, 2026 at block 3,428,143. It is a new shielded pool built from the Orchard protocol, with its own commitment tree, nullifier set and value pool. Orchard became spend-only, so new shielded funds go to Ironwood. See [Ironwood](/zcash-tech/ironwood) for why.

For hardware wallets this means:

- **Viewing keys keep working.** [ZIP 326](https://zips.z.cash/zip-0326) scopes a receiver and its incoming viewing key to the Orchard protocol rather than to one pool, so the same key decrypts both Orchard and Ironwood notes. Wallets and devices still had to update to handle the new pool.
- **A new PCZT version.** According to the original page, Ironwood added PCZT v2 with a separate Ironwood bundle, version 6 transactions and a new sighash. In that sighash the Orchard and Ironwood anchors are excluded, so the device must recompute the sighash itself instead of trusting what the companion says it is approving. The isolation model is unchanged: the device still returns only the spend authorization signature.
- **Migration means many signatures.** The amount crossing between pools is public, so wallets can split a migration into several transactions over time. That is why batch PCZT signing matters for hardware wallets. Keystone's guide describes Zodl's "Migrate with Privacy" option, which splits the balance into standard amounts and staggers the broadcasts, and notes that a full-balance migration in one transaction reveals the full amount.

${fig("orchard-to-ironwood-evolution.webp", "How hardware wallet support moved from Sapling to Orchard to Ironwood")}

## Common questions

<FaqItem q="Can the companion wallet spend my funds?">

No. It holds a viewing key, which can see activity but cannot create the spend authorization signature. Only the hardware wallet can.

</FaqItem>

<FaqItem q="Can the companion wallet see my balance and transactions?">

Yes. A UFVK exposes all shielded activity for the pools it covers, including outgoing payments. Cold signing protects your funds, not your privacy from the companion app.

</FaqItem>

<FaqItem q="What if my computer has malware?">

An attacker could watch what you do or alter an unsigned transaction. The protection is the device screen: check the amount and recipient there, because the device verifies and signs on its own.

</FaqItem>

<FaqItem q="Why can't the hardware wallet do everything?">

Shielded proofs need more memory and computing power than a signing device has. Proving needs no secret authority, so the companion does it, and the device only signs.

</FaqItem>

<FaqItem q="Do I need to do anything about the Ledger app change?">

If you used the legacy Zondax "Zcash Shielded" app, Ledger said it would stop offering it on November 5, 2026 and advised moving funds before then. Ledger Wallet Desktop supports Ironwood ZEC only, so check Ledger's support pages before moving Sapling or Orchard funds.

</FaqItem>

## Resources

- [Keystone: Zcash Ironwood migration guide](https://keyst.one/zcash/updates/keystone-ironwood-migration-guide-2026-07)
- [Ledger: how to use your private ZEC balance in Ledger Wallet Desktop](https://support.ledger.com/article/How-to-use-your-private-ZEC-balance-through-Ledger-Wallet-desktop)
- [A path forward for Ledger and Zcash (forum)](https://forum.zcashcommunity.com/t/a-path-forward-for-ledger-and-zcash/50951/177)
- [Ironwood: updated wallets and libraries (forum)](https://forum.zcashcommunity.com/t/ironwood-is-here-updated-wallets-libraries-aug-20/56557/40)
- [Hito hardware wallet grant application (forum)](https://forum.zcashcommunity.com/t/grant-application-hito-hardware-wallet-zcash-cold-signing-orchard/55539)

## Related pages

- [Viewing Keys](/zcash-tech/viewing-keys) - what a viewing key can and cannot do
- [Ironwood](/zcash-tech/ironwood) - the pool whose adoption changed hardware wallet support
- [Halo](/zcash-tech/halo) - the proof system behind Orchard and Ironwood
- [Zcash Wallet Syncing](/zcash-tech/zcash-wallet-syncing) - how a companion wallet finds your notes
`;
}

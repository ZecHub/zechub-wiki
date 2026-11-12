
export const SUMMARIES: Record<number, string> = {
  0: "Documents the Zcash Improvement Proposal process itself — how ZIPs are written, reviewed, and ratified.",
  32: "Defines the HD-wallet derivation scheme used by Zcash shielded wallets, analogous to BIP-32.",
  220: "Original ZSA proposal — superseded by ZIP 226 / ZIP 227.",
  224: "Specifies the Orchard shielded protocol, activated in NU5.",
  226: "Extends Orchard with multi-asset notes and per-asset conservation rules. NU7 candidate.",
  227: "Defines issuance keys and the transparent issuance map for ZSAs. NU7 candidate.",
  229: "The version 6 transaction format, which adds the Ironwood component. Deployed with NU6.3 on 28 Jul 2026.",
  230: "Withdrawn earlier v6 transaction format. Superseded by ZIP 229.",
  231: "Encrypted memo bundles — richer messaging for shielded transactions.",
  255: "NU6.1 activated at mainnet block 3,146,400 on 24 Nov 2025.",
  312: "Threshold signatures for shielded spends — production-ready and integrated into Zashi.",
  316: "Unified Addresses bundle multiple receiver types (Orchard / Sapling / transparent) behind a single string.",
  321: "Standardised payment-request URI format (zcash:...) — the basis of QR-based payments.",
  1016: "Activated as part of NU6.1 alongside ZIP 271.",
  2005: "Quantum recoverability for funds in the Ironwood pool, introduced with NU6.3."
};

// Update of the Zallet page (checked 7 Nov 2026). Sources: the Zebra book page on Zallet (zebra.zfnd.org/user/zallet.html:
// beta.3 reads database format 28 written by Zebra 6.x and cannot read Zebra 7.0.0-rc.0 state (format 29); the release after
// beta.3 keeps only the Zebra backend; same machine as zebrad, zebrad built with the indexer feature (release binaries and
// images lack it), ports 8232/8230, unauthenticated indexer gRPC, no remote backend yet), the Zallet Book (beta warnings),
// and the Zcash Community Forum wallet tracker of Aug 20, 2026 (Zallet v0.1.0-beta.2, July 28, Ironwood-capable; beta.1
// around July 13). NU7 is not mentioned in any of them. YWallet replaced by Zkool in the comparison table (YWallet will
// not be updated for Ironwood). Not verified (original text kept): the zcashd halt block 3417100, zecd comparison cells,
// the RPC lists. Every edit is optional: if its text is not found it is skipped.
const LINKS: Record<string, string> = {
  Zebra_Full_Node: "/zcash-tech/zebra-full-node",
  Zakura_Node: "/zcash-tech/zakura-node",
  Zaino: "/zcash-tech/zaino",
  Lightwallet_Nodes: "/zcash-tech/lightwallet-nodes",
  Full_Nodes: "/zcash-tech/full-nodes",
  ZECD: "/zcash-tech/zecd",
  Zcash_Wallet_Syncing: "/zcash-tech/zcash-wallet-syncing",
  Viewing_Keys: "/zcash-tech/viewing-keys",
};

const REQUIREMENTS = [
  "## Requirements and known issues",
  "",
  "From the [Zebra book page on Zallet](https://zebra.zfnd.org/user/zallet.html):",
  "",
  "- **Match the versions.** Zallet 0.1.0-beta.3 reads database format 28, which Zebra 6.x writes. Zebra 7.0.0 writes format 29, so beta.3's `zebra` backend cannot read its state (the Zebra upgrading guide says the `zaino` backend is not affected). NU7 needs Zebra 7.0.0 or later, so check Zallet's release notes for the supported Zebra version before upgrading either one.",
  "- **Same machine.** Zallet reads zebrad's cache directory directly, so it must run on the same machine as zebrad. A remote backend is only a proposal ([zcash/wallet issue 899](https://github.com/zcash/wallet/issues/899)).",
  "- **Indexer build.** zebrad must be built with the `indexer` feature. Release binaries and the published Docker images do not include it. Without it, Zallet starts but reads an empty spending-transaction index.",
  "- **Keep the indexer private.** The indexer gRPC service has no authentication. Bind it to loopback (the book uses 127.0.0.1:8230, with JSON-RPC on 127.0.0.1:8232).",
  "- **Backends.** The book says that from the release after beta.3, Zebra is Zallet's only chain backend. The Zaino backend described below applies to beta.3 and earlier.",
  "",
].join("\n");

const EDITS: Array<[string, string]> = [
  [
    "- Latest published release as of late August 2026: **v0.1.0-beta.3**.",
    "- Latest release this page was checked against: **v0.1.0-beta.3**. Beta releases are frequent, so check the [releases page](https://github.com/zcash/zallet/releases).\n- **Match your Zebra version.** With its `zebra` backend, beta.3 cannot read the database that Zebra 7.x writes (the `zaino` backend is not affected), and NU7 needs Zebra 7.0.0 or later. See Requirements below.",
  ],
  [
    "Zallet is in **beta**.\n\nWhat that means in practice:",
    "Zallet is in **beta**. Zallet v0.1.0-beta.2 (July 28, 2026) is listed as Ironwood-capable in the [Zcash Community Forum wallet tracker](https://forum.zcashcommunity.com/t/ironwood-is-here-updated-wallets-libraries-aug-20/56557). Neither that tracker nor the Zallet Book mentions NU7.\n\nWhat that means in practice:",
  ],
  ["## Getting started", REQUIREMENTS + "\n---\n\n## Getting started"],
  ["| | Zallet | zecd | Zashi / ZODL / YWallet |", "| | Zallet | zecd | Zashi / ZODL / Zkool |"],
];

export function rewriteZalletGuide(original: string): string {
  if (!/^# Zallet\s*$/im.test(original)) return original;
  let t = original.replace(/\((\w+)\.md\)/g, (m, n: string) => (LINKS[n] ? "(" + LINKS[n] + ")" : m));
  for (const [a, b] of EDITS) if (t.includes(a)) t = t.replace(a, b);
  return t;
}

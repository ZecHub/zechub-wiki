// Targeted edits to the Zaino vs Ztreamer benchmark page (checked 5 Nov 2026). The page is recent and well
// structured, so only claims that the numbers or sources do not support are changed:
// - "independent" is dropped: the benchmark repository belongs to a third party and nobody on the wiki re-ran it.
// - "13-17x" did not match the table (about 16-17x single client, about 1.6-2x with 128 clients).
// - "one-line fix" was the author's inference; the report only shows the delay disappears when the option is set from outside.
// - Added what the reader needs to date the numbers: Zaino 0.10.1 is still the latest release, Zebra and Zakura moved on.
// The four links ending in .md opened the raw markdown instead of the page, so they point to the page slugs.
// Every replacement must match exactly, otherwise the original markdown is returned untouched.
const EDITS: [string, string][] = [
  ["This page summarises an independent, reproducible comparison of the two:",
   "This page summarises a reproducible comparison of the two, published on GitHub by a third party (the `pearl-max468` account). The wiki has not re-run it:"],
  ["\n## TL;DR\n",
   "\n> **How current is this?** The results were published on October 10, 2026. Zaino 0.10.1 was still the latest Zaino release on November 5, 2026, but Zebra and Zakura have newer versions than the ones measured (Zebra 6.4.2 and Zakura 1.5.1). Treat the numbers as a snapshot of the versions in the table below.\n\n## TL;DR\n"],
  ["* Ztreamer serves faster in every scenario measured: 13–17× more blocks per second for a full wallet download.",
   "* Ztreamer serves faster in every scenario measured: about 16–17× more blocks per second for a single client downloading block ranges or a full wallet, and about 1.6–2× with 128 clients."],
  ["It is a one-line fix.", "Setting the option from outside removed the delay in the benchmark."],
  ["* **Not measured:** reorgs",
   "* **Not independently verified.** The figures come from the benchmark's own report and raw data; this page does not confirm them.\n* **Versions have moved on.** Ztreamer v0.1.0 is the latest tag the benchmark used, and the Zebra and Zakura versions it ran against have since been superseded.\n* **Speed is one criterion.** The benchmark does not compare maturity, support or how each project is maintained.\n* **Not measured:** reorgs"],
];

export function rewriteIndexerBenchmark(original: string): string {
  if (!/^# Indexer Benchmark: Zaino vs Ztreamer\s*$/im.test(original)) return original;
  let text = original
    .replace("(Zebra_Full_Node.md)", "(/zcash-tech/zebra-full-node)")
    .replace("(Z3_Stack.md)", "(/zcash-tech/z3-stack)")
    .replace("(Zaino.md)", "(/zcash-tech/zaino)")
    .replace("(Zakura_Node.md)", "(/zcash-tech/zakura-node)");
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return text;
}

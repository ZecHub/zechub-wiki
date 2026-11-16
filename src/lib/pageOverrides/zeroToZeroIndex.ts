// Keeps the series index in step with the rewritten pages: the Hash Functions page now lists four
// properties (not three), and the Lelantus page now covers its successor Spark. Each edit is optional:
// if its text is not found it is skipped.
const EDITS: Array<[string, string]> = [
  ["Any input becomes a fixed output. The three properties a hash must have.", "Any input becomes a fixed output, and the properties a hash must have."],
  ["The protocol behind Firo, and how it compares with Zcash.", "The protocol behind Firo, its successor Spark, and how they compare with Zcash."],
];

export function rewriteZeroToZeroIndex(original: string): string {
  let out = original;
  for (const [from, to] of EDITS) out = out.replace(from, to);
  return out;
}

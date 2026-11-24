// Small fixes to three organization pages. Each is skipped if its anchor text is not found.
// - Zcash Community Grants: "currently five people" and "Recent projects" age badly; the funding paragraph said the stream ends at
//   block 4,406,400 "under the current block spacing", which NU7 changed (ZIP 214 rev 3: block 6,132,390).
// - Financial Privacy Foundation: the page describes the FPF x FPF program announced on 18 March 2024 and never said whether a round is open.
// - Sovright: "(Coming Soon)" heading and "current testnet" wording replaced.
export function rewriteZcgPage(original: string): string {
  if (!original.includes("# ") || !original.includes("Zcash Community Grants")) return original;
  return original
    .replace("managed by a committee, which currently consists of five people.", "managed by a committee. Its members are listed on the committee page.")
    .replace("This community reviews and approves grant applications", "The committee reviews and approves grant applications")
    .replace("Recent projects that have been approved by the ZCG are", "Projects approved by ZCG over the years include")
    .replace(
      "and runs until Zcash's third halving at block 4,406,400 under the current block spacing.",
      "and runs until Zcash's third halving. NU7 changed the block spacing to 25 seconds, and [ZIP 214](https://zips.z.cash/zip-0214) revision 3 sets the end height at block 6,132,390, which is about the same date as before.",
    );
}

export function rewriteFpfPage(original: string): string {
  if (!original.includes("Financial Privacy Foundation")) return original;
  let text = original.replace("is currently creating a grant program", "created a grant program");
  const note =
    "> **About this page.** It describes the FPF x FPF grant program as announced on 18 March 2024. It does not say whether a round is open. See the [FPF grants page](https://www.financialprivacyfoundation.org/grants) for the status of any program.\n\n";
  if (text.includes("## About FPF") && !text.includes("**About this page.**")) text = text.replace("## About FPF", note + "## About FPF");
  const role =
    "## FPF and Zcash Community Grants\n\nFPF is named in the ZIPs that define the Zcash Community Grants funding stream ([ZIP 1015](https://zips.z.cash/zip-1015), [ZIP 214](https://zips.z.cash/zip-0214)). See [Zcash Community Grants](/zcash-organizations/zcash-community-grants).\n\n";
  if (text.includes("## Resources") && !text.includes("## FPF and Zcash Community Grants")) text = text.replace("## Resources", role + "## Resources");
  return text;
}

export function rewriteSovrightPage(original: string): string {
  if (!original.includes("Sovright")) return original;
  return original
    .replace("The current testnet version does not provide payouts and is intended for testing only.", "The testnet version of the pool does not provide payouts and is intended for testing only. See mining.sovright.com for its status.")
    .replace("## (Coming Soon)", "## Areas of focus");
}

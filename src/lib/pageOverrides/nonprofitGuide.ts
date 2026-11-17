// Editorial tidy-up of the "Accept private ZEC donations as a US nonprofit" guide. The legal and
// tax content is kept word for word from the ZecHub/zechub repo; only the repeated summary
// sections are removed and the opening is tightened. If the source no longer has the expected
// sections, the original markdown is returned untouched.
const dropSection = (md: string, title: string): string =>
  md.replace(new RegExp("^## (?:<img[^>]*>\\s*)?" + title + "\\s*\\n[\\s\\S]*?(?=^## |(?![\\s\\S]))", "im"), "");

export function rewriteNonprofitGuide(original: string): string {
  if (!/accept private zec donations as a us nonprofit/i.test(original)) return original;
  if (!/^## TL;DR\s*$/im.test(original)) return original;

  let md = original;
  md = dropSection(md, "TL;DR");
  md = dropSection(md, "Who is this for\\?");
  md = dropSection(md, "Result");

  const lead = `US charities can accept ZEC while keeping donors and balances private. Hold gifts in a shielded wallet the organization controls, give donors the acknowledgments and IRS forms they need, and keep records your accountant can check.

This guide is for treasurers, bookkeepers and board members of 501(c)(3) charities, churches and community groups, and for donors who want to know what a nonprofit needs from them. For individuals and creators, see [Receive Donations Privately](/zcash-use-cases/receive-donations-privately).

`;
  // Insert the opening after the level pill and the legal disclaimer, before the first section.
  md = md.replace(/^## /m, lead + "## ");

  md = md.replace(
    /## Next step\s*\n\s*\n- \[Run a Private Community Treasury\]\(\/zcash-use-cases\/private-community-treasury\)/i,
    "## Next step\n\n- [Where to Donate ZEC](/zcash-use-cases/where-to-donate-zec)",
  );
  return md;
}

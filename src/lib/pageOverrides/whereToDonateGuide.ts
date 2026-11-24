// Editorial tidy-up of the "Where to donate ZEC" guide. The organization tables, dates and tax
// notes are kept word for word from the ZecHub/zechub repo; only the repeated summary sections
// are removed and the opening and closing are tightened. If the source no longer has the
// expected sections, the original markdown is returned untouched.
const dropSection = (md: string, title: string): string =>
  md.replace(new RegExp("^## (?:<img[^>]*>\\s*)?" + title + "\\s*\\n[\\s\\S]*?(?=^## |(?![\\s\\S]))", "im"), "");

export function rewriteWhereToDonateGuide(original: string): string {
  if (!/^# (?:<img[^>]*>\s*)?where to donate zec/im.test(original)) return original;
  if (!/^## TL;DR\s*$/im.test(original)) return original;

  let md = original;
  md = dropSection(md, "TL;DR");
  md = dropSection(md, "Who is this for\\?");

  // "Result" repeated the introduction; keep only its closing invitation to contribute.
  md = md.replace(
    /^## (?:<img[^>]*>\s*)?Result\s*\n[\s\S]*?^(Know a nonprofit[^\n]*)\n/im,
    "## Suggest an organization\n\n$1\n",
  );

  const lead = `Nine nonprofits publish a ZEC address, and five of them use a shielded address, so your gift stays private on-chain. Four well-known nonprofits accept ZEC only at a transparent address: EFF, Freedom of the Press Foundation, the Tor Project and the Internet Archive. Donation platforms such as The Giving Block and Every.org accept ZEC for thousands of charities, but none says it supports shielded ZEC. If you need a tax receipt, read each organization's note before you give.

If you run a nonprofit and want to accept ZEC, see [Accept Private Donations as a US Nonprofit](/zcash-use-cases/accept-private-donations-as-a-us-nonprofit).

`;
  // Insert the opening after the level pill and the "last checked" note, before the first section.
  md = md.replace(/^## /m, lead + "## ");

  // Add the usual progress box and point to the next guide on the recommended path.
  md = md.replace(
    /^## Next step\s*\n\s*\n- \[Accept Private Donations as a US Nonprofit\]\(\/zcash-use-cases\/accept-private-donations-as-a-us-nonprofit\)/im,
    "## Progress\n\n**Step 7 of 8**\n\nYou know where to give ZEC and how to keep the gift private.\n\n## Next step\n\n- [Journalist Privacy Setup](/zcash-use-cases/journalist-privacy-setup)",
  );
  return md;
}

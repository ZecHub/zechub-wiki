// Editorial tidy-up of the "Pay for AI Services Privately with Shielded ZEC" guide. The technical
// content (routes, steps, screenshots and the pool table) is kept word for word from the
// ZecHub/zechub repo; only the repeated summary sections are removed and the opening is
// tightened. If the source no longer has the expected sections, the original is returned.
const dropSection = (md: string, title: string): string =>
  md.replace(new RegExp("^## (?:<img[^>]*>\\s*)?" + title + "\\s*\\n[\\s\\S]*?(?=^## |(?![\\s\\S]))", "im"), "");

export function rewritePayForAiGuide(original: string): string {
  if (!/pay for ai services privately/i.test(original)) return original;
  if (!/^## TL;DR\s*$/im.test(original)) return original;

  let md = original;
  md = dropSection(md, "TL;DR");
  md = dropSection(md, "Who is this for\\?");
  md = dropSection(md, "The Problem");
  md = dropSection(md, "Result");
  md = dropSection(md, "Progress");

  const lead = `NanoGPT accepts shielded ZEC directly, with no account and no email, and CrossPay lets you pay services that do not take ZEC at all. This guide covers both routes and what each one reveals on chain.

Paying for AI with a card ties every prompt you write to your legal identity, and the payment processor sees it too. Paying from shielded ZEC avoids that. It is for anyone who does not want an AI subscription tied to their name, developers paying for inference without a corporate card, and people in countries where card payments to AI services fail.

`;
  // Insert the opening after the level pill, before the first section.
  md = md.replace(/^## /m, lead + "## ");
  return md;
}

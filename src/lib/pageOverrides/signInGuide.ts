// Editorial tidy-up of the "Sign in with Zcash" guide. The technical content (approaches,
// trade-offs table and project list) is kept word for word from the ZecHub/zechub repo; only
// the repeated summary sections are removed and the opening is tightened. If the source no
// longer has the expected sections, the original markdown is returned untouched.
const dropSection = (md: string, title: string): string =>
  md.replace(new RegExp("^## (?:<img[^>]*>\\s*)?" + title + "\\s*\\n[\\s\\S]*?(?=^## |(?![\\s\\S]))", "im"), "");

export function rewriteSignInGuide(original: string): string {
  if (!/^# (?:<img[^>]*>\s*)?sign in with zcash/im.test(original)) return original;
  if (!/^## TL;DR\s*$/im.test(original)) return original;

  let md = original;
  md = dropSection(md, "TL;DR");
  md = dropSection(md, "Who is this for\\?");

  const lead = `Log in by proving you control a Zcash address, instead of using a password. Because shielded addresses hide balances and history, proving control does not expose your finances. Two designs are in use today: signing a challenge, or sending a shielded payment with a code in the memo. The pattern is still early, with no ratified standard, and implementations do not interoperate.

This guide is for developers who want passwordless login without collecting personal data, and for users who would rather not hand an email address to every site.

`;
  // Insert the opening after the level pill, before the first section.
  md = md.replace(/^## /m, lead + "## ");
  return md;
}

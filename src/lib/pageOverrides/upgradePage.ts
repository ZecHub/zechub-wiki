// Shared reading-order rewrite for the network-upgrade pages in zcash-tech (Canopy, and the pages written
// to the same template). The facts, ZIP links and diagrams stay exactly as in the ZecHub repo. What
// changes: an "At a glance" table up front (supplied per page), the lead and "Why it matters" as their own
// blocks, FAQ answers always visible, the quiz answer left open, and Resources / See also as plain lists.
// If a page does not follow the template, the original markdown is returned untouched.
// Every upgrade page carries the same notice: it records the rules as they were at activation, and
// later upgrades may have changed them. It names no later change, so it never goes stale.
export function historicalNote(title: string, activated: string): string {
  return `> **Historical record.** This page describes ${title} as it was when it activated on ${activated}. Later network upgrades may have changed these rules. For the current state, see [Network Upgrades](/start-here/network-upgrades).`;
}

export function rewriteUpgradePage(original: string, title: string, glance: string, activated: string, note?: string): string {
  if (!new RegExp(`^# ${title}\\s*$`, "im").test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const lead = original.match(/^> (.+)$/m)?.[1];
  const takeaway = original.match(/^What you'll take away: (.+)$/m)?.[1];
  const firstH2 = original.search(/^## /m);
  const introStart = original.indexOf("What you'll take away:");
  if (!lead || !takeaway || firstH2 < 0 || introStart < 0) return original;

  const intro = original.slice(introStart, firstH2).replace(/^What you'll take away:.*\n+/, "").trim();
  const [about, whyRest] = intro.split(/\n\s*Why this matters\.\s*/);
  if (!about || !whyRest) return original;

  const rest = original.slice(firstH2);
  const faqAt = rest.search(/^## FAQ\s*$/m);
  const quizAt = rest.search(/^## Test your understanding\s*$/m);
  const resAt = rest.search(/^### Resources\s*$/m);
  const seeAt = rest.search(/^### See also\s*$/m);
  // The Series line may follow a rule directly, or a Related Pages table (newer source pages).
  const serAt = rest.search(/^Series:/m);
  // "See also" is optional (NU7 has only Resources and a Related Pages table).
  const nextAfterRes = seeAt >= 0 ? seeAt : serAt;
  if ([faqAt, quizAt, resAt, serAt].some((i) => i < 0) || !(faqAt < quizAt && quizAt < resAt && resAt < nextAfterRes && nextAfterRes <= serAt)) return original;

  // The "TL;DR" block is dropped: the At a glance table and the sections below carry the same points.
  const body = rest.slice(0, faqAt).replace(/^## TL;DR\s*\n[\s\S]*?(?=^## )/m, "").trim();
  const faqRaw = rest.slice(faqAt, quizAt).replace(/^## FAQ\s*/, "").trim();
  const quizRaw = rest.slice(quizAt, resAt).replace(/^## Test your understanding\s*/, "").trim();
  const toList = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => `- ${l}`).join("\n");
  // Resources end at the first rule or heading; anything after that is kept as written (see below).
  const resSlice = rest.slice(resAt, nextAfterRes).replace(/^### Resources\s*/, "");
  const resCut = resSlice.search(/^(---\s*$|## )/m);
  const resources = toList(resCut < 0 ? resSlice : resSlice.slice(0, resCut));
  const resTail = resCut < 0 ? "" : resSlice.slice(resCut);
  // "See also" ends at the first horizontal rule; whatever sits between it and the Series line (a Related Pages
  // table on most pages) is kept as written instead of being turned into list items. Without a "See also" section
  // the same applies to what follows Resources.
  const tail = rest.slice(nextAfterRes, serAt);
  const ruleAt = tail.search(/^---\s*$/m);
  const seeBlock = seeAt >= 0 ? (ruleAt < 0 ? tail : tail.slice(0, ruleAt)).replace(/^### See also\s*/, "") : "";
  const seeAlso = toList(seeBlock);
  const related =
    seeAt >= 0
      ? ruleAt < 0
        ? ""
        : tail.slice(ruleAt).replace(/^---\s*/, "").trim()
      : resTail.replace(/^\s*---\s*/, "").trim();
  const series = rest.slice(serAt).match(/Series:[^\n]*/)?.[0] ?? "";

  const faq = faqRaw
    .split(/\n\s*\n/)
    .map((p) => p.trim().replace(/^\*\*([^*]+\?)\*\*\s+/, "$1 "))
    .filter(Boolean)
    .map((p) => {
      const i = p.indexOf("? ");
      if (i < 0) return null;
      return `<FaqItem q=${JSON.stringify(p.slice(0, i + 1))}>\n\n${p.slice(i + 2)}\n\n</FaqItem>`;
    });
  if (faq.some((f) => f === null) || faq.length < 3) return original;

  // The quiz is either one question with a <details> answer, or a numbered list followed by an "Answers:" line.
  let quizQ = quizRaw.split("<details>")[0].trim();
  let quizA = quizRaw.match(/<\/summary>\s*([\s\S]*?)\s*<\/details>/)?.[1]?.trim();
  let quizBlock = quizQ && quizA ? `**${quizQ}**\n\n${quizA}` : "";
  if (!quizBlock) {
    const m = quizRaw.match(/^([\s\S]*?)\n\s*Answers?:\s*([\s\S]+)$/);
    if (m && /^\s*1\. /m.test(m[1])) quizBlock = `${m[1].trim()}\n\n**Answers:** ${m[2].trim()}`;
  }
  if (!quizBlock) return original;

  return `${fm}
${edit}

# ${title}

${lead}

${note ?? historicalNote(title, activated)}

${about}

## At a glance

${glance.trim()}

## Why it matters

${whyRest.trim()}

${body}

## Common questions

${faq.join("\n\n")}

## Check your understanding

${quizBlock}

## Resources

${resources}

${seeAlso ? `## See also\n\n${seeAlso}\n\n` : ""}${related ? related + "\n\n" : ""}---

${series}
`;
}

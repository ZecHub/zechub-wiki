// Editorial restructure of the "Frequently Asked Questions" page. Answers are kept as written in the
// ZecHub/zechub repo. What changes: the pill list of 12 anchors and the card wrappers go, questions are
// grouped under four headings (so "On this page" shows the groups), and the misconceptions HTML table
// becomes a plain markdown table. If the source no longer has these questions, the original is returned.
export function rewriteFaqPage(original: string): string {
  if (!/^# Frequently Asked Questions\s*$/im.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const body = original.slice(fm.length);
  const intro = body.match(/^# Frequently Asked Questions\s*\n+([^\n]+)\n/m)?.[1];
  const footer = body.match(/\n---\s*\n+(\*\*Last updated:\*\*[\s\S]*)$/)?.[1]?.trim();
  if (!intro || !footer) return original;

  const parts = body.split(/^## /m).slice(1);
  const qa = new Map<string, string>();
  for (const p of parts) {
    const nl = p.indexOf("\n");
    const title = p.slice(0, nl).trim();
    const text = p
      .slice(nl + 1)
      .replace(/\n---\s*\n+\*\*Last updated:[\s\S]*$/, "")
      .replace(/^<div className="rounded-2xl[^\n]*>\s*$/gm, "")
      .replace(/^<\/div>\s*$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    qa.set(title, text);
  }

  const groups: Array<[string, string[]]> = [
    [
      "The basics",
      [
        "What is Zcash?",
        "How can I acquire Zcash?",
        "What is the difference between Zcash and other cryptocurrencies?",
        "Is Zcash really Private?",
        "How is the Zcash protocol governed?",
      ],
    ],
    ["Sending and receiving", ["Where is my Transaction?"]],
    [
      "Software and upgrades",
      [
        "zcashd stopped working, what do I run now?",
        "How do I move my zcashd wallet to Zallet?",
        "What is Ironwood, and do I need to do anything?",
        "Which full node should I run?",
        "Where do I look up a term from a release note?",
      ],
    ],
  ];
  const needed = groups.flatMap(([, q]) => q).concat("A few common misconceptions");
  if (needed.some((q) => !qa.has(q))) return original;

  const table = (() => {
    const html = qa.get("A few common misconceptions")!;
    const rows = [...html.matchAll(/<tr[\s\S]*?<\/tr>/g)].map((r) =>
      [...r[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => c[1].replace(/\s+/g, " ").trim()),
    );
    if (rows.length < 2 || rows.some((r) => r.length !== 2)) return null;
    return [`| ${rows[0].join(" | ")} |`, "| --- | --- |", ...rows.slice(1).map((r) => `| ${r.join(" | ")} |`)].join("\n");
  })();
  if (!table) return original;

  const fix = (t: string) =>
    t.replace(
      "Transactions expire after approximately 25 minutes (20 blocks) and funds are returned automatically.",
      "Transactions expire after about 50 minutes (40 blocks) and funds are returned automatically.",
    );

  const glance = [
    { label: "Buy ZEC", text: "On exchanges, DEXs or swap platforms.", href: "#how-can-i-acquire-zcash" },
    { label: "Privacy", text: "Shielded transactions hide sender, amount and recipient.", href: "#is-zcash-really-private" },
    { label: "zcashd", text: "Retired. Run Zebra, Zaino and Zallet instead.", href: "#zcashd-stopped-working-what-do-i-run-now" },
    { label: "Ironwood", text: "Live since 28 July 2026. Shielded funds may need to move.", href: "#what-is-ironwood-and-do-i-need-to-do-anything" },
  ];
  let out = `${fm}\n# Frequently Asked Questions\n\n${intro}\n\n## Quick answers\n\n<FaqGlance items='${JSON.stringify(glance).replace(/'/g, "&#39;")}' />\n`;
  for (const [heading, qs] of groups) {
    out += `\n## ${heading}\n`;
    for (const q of qs) out += `\n<FaqItem q=${JSON.stringify(q)}>\n\n${fix(qa.get(q)!)}\n\n</FaqItem>\n`;
  }
  out += `\n## A few common misconceptions\n\n${table}\n\n${footer}\n`;
  return out;
}

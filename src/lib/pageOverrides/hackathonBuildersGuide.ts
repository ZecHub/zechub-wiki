// Editorial restructure of "ZecHub hackathon builder's guide". The wording of every section is kept as
// written in the ZecHub/zechub repo; what changes is the shape: the <br/> spacers go, the audience line
// becomes a lead, and the seven loose sections are grouped into Before / While / After so the page has a
// clear order. If the source no longer has these sections, the original markdown is returned untouched.
export function rewriteHackathonBuildersGuide(original: string): string {
  if (!/^# ZecHub hackathon builder's guide\s*$/im.test(original)) return original;

  const clean = original.replace(/^<br\s*\/?>\s*$/gim, "");
  const fm = clean.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const body = clean.slice(fm.length);

  const parts = body.split(/^## /m);
  const sections = new Map<string, string>();
  for (const p of parts.slice(1)) {
    const nl = p.indexOf("\n");
    sections.set(p.slice(0, nl).trim(), p.slice(nl + 1).trim());
  }
  const need = [
    "TL;DR",
    "Who is this for",
    "Start with why",
    "Learn the stack first",
    "Understand what mainnet means",
    "Keep it simple",
    "Win the first 30 seconds",
    "Look at the harder and thinner tracks",
    "After the hackathon",
    "Related pages",
  ];
  if (need.some((n) => !sections.has(n))) return original;
  const s = (k: string) => sections.get(k)!;

  const audience = s("Who is this for")
    .split("\n")
    .map((l) => l.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);
  const note = body.match(/<small>[\s\S]*?<\/small>/)?.[0] ?? "";
  const related = s("Related pages").replace(/\]\(https:\/\/zechub\.wiki\//g, "](/");

  return `${fm}
# ZecHub hackathon builder's guide

A short playbook for building something people will use. It is written for ${audience.map((a) => a.replace(/^(\w)/, (c) => c.toLowerCase()).replace(/\.$/, "")).join(", ").replace(/, ([^,]*)$/, ", and $1")}.

## Before you build

### Start with why

${s("Start with why")}

### Learn the stack first

${s("Learn the stack first")}

### Understand what mainnet means

${s("Understand what mainnet means")}

## While you build

### Keep it simple

${s("Keep it simple")}

### Pick a less crowded track

${s("Look at the harder and thinner tracks")}

### Win the first 30 seconds

${s("Win the first 30 seconds")}

## After the hackathon

${s("After the hackathon")}

## Related pages

${related}

${note ? `${note}\n` : ""}`;
}

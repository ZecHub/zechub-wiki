// Editorial restructure of "Zcash Wallet Fund Recovery". Procedures, commands, tables and links are left
// exactly as written in the ZecHub/zechub repo. Only the order and the opening change:
//  - the time-sensitive NU7 notice comes first (it was buried under a heading further down);
//  - the second H1 ("Security and Responsibility") becomes a section, merged with the paragraph that repeated it;
//  - the table keyed on "what you have" now comes before the one keyed on "which pool", because most
//    readers know what they hold before they know which pool it sits in;
//  - the "Edit" badge is dropped.
// If the source no longer has the expected sections, the original markdown is returned untouched.
export function rewriteRecoveringFundsGuide(original: string): string {
  const h1 = original.match(/^# Zcash Wallet Fund Recovery[ \t]*$/m);
  const why = original.match(/^\*\*Why keep your recovery material\?\*\*[ \t]*\n\n([\s\S]*?)(?=^# Security and Responsibility)/m);
  const sec = original.match(/^# Security and Responsibility[ \t]*\n\n([^\n]+)\n/m);
  const legacy = original.match(
    /^## Legacy shielded funds: Sprout, Sapling and Orchard[ \t]*\n\n([^\n]+)\n\n(> \*\*NU7[\s\S]*?)(?=^## The answer in one page)/m,
  );
  const answer = original.match(/^## The answer in one page[ \t]*\n([\s\S]*?)(?=^### Five-question decision flow)/m);
  const flow = original.match(/^### Five-question decision flow[\s\S]*?(?=^> \*\*Before you start:\*\*)/m);
  const start = original.match(/^> \*\*Before you start:\*\*[\s\S]*?(?=^## Fund Recovery with Zkool)/m);
  const rest = original.search(/^## Fund Recovery with Zkool/m);
  if (!h1 || h1.index === undefined || !why || !sec || !legacy || !answer || !flow || !start || rest < 0) return original;

  const paras = why[1].trim().split(/\n\n+/);
  if (paras.length !== 2) return original;

  const head = original
    .slice(0, h1.index)
    .replace(/<a\b[^>]*>\s*<img\b[^>]*alt="Edit Page"[^>]*\/?>\s*<\/a>\s*/i, "");

  return `${head}# Zcash Wallet Fund Recovery

${legacy[2].trim()}

Which recovery path works depends on what you still have and where the funds sit. ${paras[0].trim()}

## Security and responsibility

${sec[1].trim()} ${paras[1].trim()}

## Start with what you have

${start[0].trim()}

## Legacy shielded funds: Sprout, Sapling and Orchard

${legacy[1].trim()}

### Which route for which pool

${answer[1].trim()}

${flow[0].trim()}

${original.slice(rest)}`;
}

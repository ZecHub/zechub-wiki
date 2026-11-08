// Wallets page: adds a TL;DR and a short "How to choose" guide, shrinks the oversized logo boxes,
// notes that ZODL is the former Zashi, and puts the Zafu entry in the same format as the other entries.
// Wallet data itself is left as written upstream. Everything here is optional: if the page shape changes,
// each step is skipped and the original text is returned.

const INTRO = `# Wallets

## TL;DR

- Pick a wallet that lists **Sapling** or **Ironwood** under Pools. Those are the shielded pools, so your balance and payments stay private.
- A wallet that lists only **Transparent** works like Bitcoin: everything is public on the blockchain.
- Each entry shows the devices it runs on, what it supports, which pools it can use, and whether it is ready for Ironwood.
- Wallets marked **Deprecated** (Ywallet, zcashd) no longer follow the network. Do not use them for new funds.

## How to choose

| If you want | Look for |
| --- | --- |
| Private everyday payments on a phone | A mobile wallet with Shielded Memo and Ironwood marked Ready, such as ZODL, Zingo!, Zkool, Cake, Edge or Unstoppable |
| To keep funds on a hardware device | A wallet with Hardware under Wallet Support, or a hardware wallet entry such as Keystone or Ledger |
| To run your own node | Full Node under Wallet Support, such as Zallet, which runs with a Zebra node |
| To hold many coins in one app | Multi Coin, but check the Pools line: many multi-coin apps support only the transparent pool |

Before you send a large amount, send a small test payment first. Wallet details change between releases, so open the wallet's own site (linked in each heading) for its current status.

---
`;

function fixZafu(text: string): string {
  const old = [
    "- Devices: Desktop Browser (Browser Extension)",
    "- Operating System: Windows | macOS | Linux (via compatible Chromium-based browsers)",
  ];
  if (!old.every((o) => text.includes(o))) return text;
  return text.replace(old[0], "- Devices: Web (browser extension)").replace(old[1], "- Operating System: Browser (Chromium-based)");
}

// Each wallet entry becomes: heading with the small icon at the left of the name, then the bullets with
// Status first. "Stage:" and "Status:" are merged into one "Status:" line (only the values the page already gives).
function entry(block: string): string {
  const lines = block.split("\n");
  const hi = lines.findIndex((l) => /^## /.test(l));
  if (hi < 0) return block;
  const heading = lines[hi].replace(/^## /, "");
  const li = lines.findIndex((l, k) => k > hi && /^!\[logo\]/.test(l));
  let icon = "";
  if (li >= 0) {
    const m = lines[li].match(/^!\[logo\]\((\/content-images\/wallets\/[^\s)]+)\.webp\s+"([^"]*)"\)/);
    if (m) icon = `<img src="${m[1]}-icon.webp" alt="${m[2]} logo" width="40" height="40" className="!inline-block !m-0 mr-4 align-middle" /> `;
    else return block;
  }
  const bullets = lines.filter((l, k) => k > hi && k !== li && /^- /.test(l));
  const rest = lines.filter((l, k) => k > hi && k !== li && !/^- /.test(l) && l.trim() !== "");
  const status: string[] = [];
  const others: string[] = [];
  for (const b of bullets) {
    const m = b.match(/^- (Status|Stage): (.*)$/);
    if (m) status.push(m[2].replace(/^Beta \(Continuous Development\)$/, "Beta"));
    else others.push(b);
  }
  const hm = heading.match(/^\[([^\]]+)\]\(([^)]+)\)(.*)$/);
  const title = hm && icon ? `${icon}[${hm[1]}](${hm[2]})${hm[3]}` : `${icon}${heading}`;
  const out = [`## ${title}`, ""];
  if (status.length) out.push(`- **Status:** ${status.join(" | ")}`);
  out.push(...others);
  if (rest.length) out.push("", ...rest);
  return out.join("\n");
}

function entries(text: string): string {
  return text
    .split(/\n---[ \t]*\n/)
    .map((b) => (/^\s*## /m.test(b) ? "\n" + entry(b.replace(/^\s+/, "")) + "\n" : b))
    .join("\n---\n");
}

export function rewriteWalletsGuide(original: string): string {
  if (!/^# Wallets\s*$/m.test(original)) return original;
  let text = original.replace(/^# Wallets\s*\n/m, INTRO + "\n");
  text = text.replace("## [ZODL](https://zodl.com)", "## [ZODL](https://zodl.com) (formerly Zashi)");
  text = fixZafu(text);
  // INTRO ends with a rule; entries start after it.
  const at = text.indexOf("## [ZODL]");
  if (at < 0) return text;
  return text.slice(0, at) + entries(text.slice(at));
}

// Who Can See Your Zcash Payment (start-here/who-can-see-your-zcash-payment). The page says there are "four paths" and
// shows them only in a picture, so the four paths become a table with what each one reveals, and the three kinds of key
// become a table too. Each table is a stack of cards on phones, where a wide table would be cut off. The TL;DR is dropped (the sections below say the same). Every other sentence and link is kept.
// Skipped, returning the original, if any of the anchors below is missing.

const CARD =
  "rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2";

// Wide tables are cut off on phones, so each one is a table on larger screens and a stack of cards on phones.
const responsive = (table: string, cards: string) =>
  `<div className="hidden md:block">\n\n${table}\n\n</div>\n\n<div className="md:hidden my-4 space-y-3">\n\n${cards}\n\n</div>`;

const PATH_ROWS: Array<[string, string, string, string, string]> = [
  ["Transparent", "Transparent", "Public", "Public", "Public"],
  ["Transparent", "Shielded", "Public", "Hidden", "Public"],
  ["Shielded", "Transparent", "Hidden", "Public", "Public"],
  ["Shielded", "Shielded", "Hidden", "Hidden", "Hidden"],
];

const PATHS = `${responsive(
  [
    "| From | To | Sender | Receiver | Amount |",
    "| --- | --- | --- | --- | --- |",
    ...PATH_ROWS.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n"),
  PATH_ROWS.map(
    ([f, t, a, b, c]) =>
      `<div className="${CARD}">\n\n**${f} to ${t}**\n\nSender: ${a}\n\nReceiver: ${b}\n\nAmount: ${c}\n\n</div>`,
  ).join("\n\n"),
)}

The fee is public in every case.`;

const KEY_ROWS: Array<[string, string, string]> = [
  ["Spending key", "Sees everything and moves funds. This is the money.", "Nobody. It stays with you and is never shared, for any reason."],
  ["Full Viewing Key", "Read-only. Shows incoming and outgoing activity and balances, but cannot spend a single zatoshi.", "An auditor or accountant."],
  ["Incoming Viewing Key", "Narrower still: shows only payments arriving.", "An exchange or a merchant that needs to confirm a deposit landed, while the spending key stays on hardware that never touches the internet."],
];

const KEYS = responsive(
  [
    "| Key | What it can do | Who gets it |",
    "| --- | --- | --- |",
    ...KEY_ROWS.map(([k, w, g]) => `| **${k}** | ${w} | ${g} |`),
  ].join("\n"),
  KEY_ROWS.map(
    ([k, w, g]) => `<div className="${CARD}">\n\n**${k}**\n\n${w}\n\n*Who gets it:* ${g}\n\n</div>`,
  ).join("\n\n"),
);

export function rewriteWhoCanSeePaymentPage(original: string): string {
  const tldr = original.match(/## TL;DR\n[\s\S]*?\n---\n\n/);
  const pattern = "The pattern is simpler than it looks: **whatever touches a transparent address becomes public.**";
  const keysAt = original.indexOf("**Spending key.**");
  const orderAt = original.indexOf("The order matters.");
  if (!tldr || !original.includes(pattern) || keysAt < 0 || orderAt < keysAt) return original;

  let out = original.replace(tldr[0], "");
  out = out.replace(pattern, `${PATHS}\n\n${pattern}`);
  const k = out.indexOf("**Spending key.**");
  const o = out.indexOf("The order matters.");
  out = out.slice(0, k) + KEYS + "\n\n" + out.slice(o);
  return out;
}

// Who Can See Your Zcash Payment (start-here/who-can-see-your-zcash-payment). The page says there are "four paths" and
// shows them only in a picture, so the four paths become a table with what each one reveals, and the three kinds of key
// become a table too. The TL;DR is dropped (the sections below say the same). Every other sentence and link is kept.
// Skipped, returning the original, if any of the anchors below is missing.

const PATHS = `| From | To | Sender | Receiver | Amount |
| --- | --- | --- | --- | --- |
| Transparent | Transparent | Public | Public | Public |
| Transparent | Shielded | Public | Hidden | Public |
| Shielded | Transparent | Hidden | Public | Public |
| Shielded | Shielded | Hidden | Hidden | Hidden |

The fee is public in every case.`;

const KEYS = `| Key | What it can do | Who gets it |
| --- | --- | --- |
| **Spending key** | Sees everything and moves funds. This is the money. | Nobody. It stays with you and is never shared, for any reason. |
| **Full Viewing Key** | Read-only. Shows incoming and outgoing activity and balances, but cannot spend a single zatoshi. | An auditor or accountant. |
| **Incoming Viewing Key** | Narrower still: shows only payments arriving. | An exchange or a merchant that needs to confirm a deposit landed, while the spending key stays on hardware that never touches the internet. |`;

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

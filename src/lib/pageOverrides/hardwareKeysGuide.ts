// Editorial restructure of "2FA Hardware Devices". Wording and images come from the ZecHub/zechub repo;
// what changes: the question-style headings become plain topic headings, one sentence that the intro
// said twice is dropped, the three product reviews get a comparison table up top, and the Google
// steps become numbered items. If the source no longer has these sections, the original is returned.
export function rewriteHardwareKeysGuide(original: string): string {
  if (!/^# 2FA Hardware Devices\s*$/im.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const rest = original.slice(fm.length);
  const edit = rest.match(/^\[!\[Edit Page\][^\n]*\n/m)?.[0] ?? "";
  const body = rest.replace(edit, "");
  const intro = body.match(/^# 2FA Hardware Devices\s*\n+([^\n]+)\n/m)?.[1];
  if (!intro) return original;

  const sec = new Map<string, string>();
  for (const p of body.split(/^## /m).slice(1)) {
    const nl = p.indexOf("\n");
    sec.set(p.slice(0, nl).trim(), p.slice(nl + 1).trim());
  }
  const need = [
    "What are hardware security keys?",
    "How a hardware security key works",
    "What are the benefits of using a hardware security key?",
    "Are hardware security keys compatible with all devices and operating systems?",
    "Can a hardware security key be used with multiple accounts?",
    "What happens if I lose my hardware security key?",
    "Examples of 2FA Hardware",
    "Binding your 2FA Hardware Key to your Google account",
  ];
  if (need.some((n) => !sec.has(n))) return original;
  const g = (k: string) => sec.get(k)!;

  // The first paragraph already says "work in conjunction with your username and password".
  const what = g(need[0]).replace(
    /These keys are designed to work in conjunction with your username and password to ensure that only authorized users can access your accounts and data\. They come/,
    "They come",
  );

  const products = g(need[6]);
  const exIntro = products.split("\n\n")[0];
  const reviews = [...products.matchAll(/\*\*([^*]+)\*\*\n\n(!\[[^\n]*\n)\n([\s\S]*?)(?=\n\n\*\*[^*]+\*\*\n\n!\[|$)/g)];
  if (reviews.length !== 3) return original;
  const review = (r: RegExpMatchArray) => `### ${r[1]}\n\n${r[2]}\n${r[3].replace(/ {2}\n/g, "\n\n")}\n`;

  const stepsSrc = g(need[7]);
  const stepsIntro = stepsSrc.split("\n\n")[0];
  const steps = [...stepsSrc.matchAll(/\*\*Step (\d+)\*\*[ \t]*\n([^\n]+)(?:\n|$)(?:\n(!\[[^\n]*\))(?:\n|$))?/g)];
  if (steps.length < 5) return original;
  const stepItems = steps
    .map((m) => {
      const title = m[2].replace(/\*\*/g, "").trim().replace(/"/g, "'");
      return `<PointItem n="${m[1]}" title="${title}">\n\n${m[3] ?? ""}\n\n</PointItem>`;
    })
    .join("\n\n");

  return `${fm}${edit}
# 2FA Hardware Devices

${intro}

## What a hardware key is

${what}

## How it works

${g(need[1])}

## Why use one

${g(need[2])}

## Before you buy

### Compatibility

${g(need[3])}

### One key, many accounts

${g(need[4])}

### If you lose your key

${g(need[5])}

## Three keys compared

${exIntro}

| Key | Connection | Standards | Worth knowing |
| --- | --- | --- | --- |
| Yubico YubiKey 5 NFC | USB-A (USB-C with adapter) or NFC | FIDO U2F and many services | Compact, durable and waterproof |
| Thetis Fido U2F | USB, folding design | FIDO U2F only | Best value; no Bluetooth, UAF or OTP |
| CryptoTrust OnlyKey | USB with onboard keypad | FIDO2 U2F, Yubico OTP, TOTP | Stores 24 OTP accounts, passwords and usernames; the interface is clunky |

${reviews.map(review).join("\n")}
## Add a key to your Google account

${stepsIntro}

<PointList>

${stepItems}

</PointList>
`;
}

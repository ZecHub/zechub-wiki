// Layout pass on "Nym Mixnet Anonymity for Zcash". The content is recent (verified 18 October 2026 in the
// source) and is kept as written; what changes is how it reads: the "last verified" quote and the source
// line fold into one status callout, the speed comparison becomes a table, and the two bold run-in
// paragraphs of the application-layer section become headings. If the source is not this page any more,
// the original markdown is returned untouched.
export function rewriteNymZcashGuide(original: string): string {
  if (!/^# Nym Mixnet Anonymity for Zcash\s*$/im.test(original)) return original;
  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/^<a href="https:\/\/github\.com\/[^"]*\/edit\/[^"]*"[^>]*>\s*<img[^>]*Edit[^>]*>\s*<\/a>\s*\n/m)?.[0] ?? "";
  const verified = original.match(/^> Last verified: ([^\n]+)$/m)?.[1];
  const intro = original.match(/^Zcash shielded pools hide amounts[^\n]+$/m)?.[0];
  const sourceLine = original.match(/^Source: (\[How Nym adds anonymity to Zcash wallets\]\([^)]+\) \([^)]+\))\.?$/m)?.[1];
  const protectedSec = original.match(/^## What is protected\s*\n([\s\S]*?)(?=^## )/m)?.[1]?.trim();
  const notProtected = original.match(/^## What is not protected\s*\n([\s\S]*?)(?=^## )/m)?.[1]?.trim();
  const wallets = original.match(/^## Wallets\s*\n([\s\S]*?)(?=^## )/m)?.[1]?.trim();
  const quantised = original.match(/^\*\*Quantised sync ranges\.\*\* ([^\n]+)$/m)?.[1];
  const decoupled = original.match(/^\*\*Decoupled broadcasts\.\*\* ([^\n]+)$/m)?.[1];
  const hygieneIntro = original.match(/^## Application-layer hygiene[^\n]*\n\s*\n([\s\S]*?)(?=^\*\*Quantised)/m)?.[1]?.trim();
  const crate = original.match(/^The crate exposes[^\n]+$/m)?.[0];
  const sources = original.match(/^## Sources\s*\n([\s\S]*)$/m)?.[1]?.trim();
  if (!verified || !intro || !sourceLine || !protectedSec || !notProtected || !wallets || !quantised || !decoupled || !hygieneIntro || !crate || !sources) return original;

  return `${fm}${edit}
# Nym Mixnet Anonymity for Zcash

${intro}

> **Status.** Last verified ${verified}. Source: ${sourceLine}.

## What is protected

${protectedSec}

## What is not protected

${notProtected}

## Wallets

${wallets}

## Speed tradeoffs

| Route | Relative delay | Mixing | Note |
| --- | --- | --- | --- |
| Clearnet | 1× | None | Baseline |
| Tor | ~3.7× | None (FIFO streams) | A global adversary can still correlate traffic |
| Nym mixnet | ~12.5× (~3.4 s per broadcast) | Yes | Slowest, with the strongest protection |

Growing the shared Nym user base increases anonymity more effectively than adding extra delay.

## Application-layer hygiene: nym-swizzle-zcash

${hygieneIntro}

### Quantised sync ranges

${quantised}

### Decoupled broadcasts

${decoupled}

${crate}

## Sources

${sources}
`;
}

// Rewrite of "Secure Messengers". The source repeats the same E2EE points three times, overstates what
// Signal and Session protect ("completely private", "completely anonymous", "no trace"), and says nothing
// about Session's 2026 funding situation. This keeps its four options, images and download links, shortens
// the explanation, states limits plainly, and compares the options in one table. If the source is not this
// page any more, the original markdown is returned untouched.
export function rewriteSecureMessengersGuide(original: string): string {
  if (!/^# Secure Messengers\s*$/im.test(original)) return original;
  if (!/Bison ?Relay/i.test(original) || !/Session/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/^\[!\[Edit Page\][^\n]*\r?\n/m)?.[0] ?? "";
  const img = (alt: string) => original.match(new RegExp(`!\\[${alt}\\]\\([^)]+\\)`))?.[0] ?? "";

  return `${fm}${edit}
# Secure Messengers

A secure messenger keeps the content of a conversation readable only to the people in it. This page explains what end-to-end encryption (E2EE) gives you, where it stops, and four ways to message privately, including sending encrypted messages with Zcash itself.

## What end-to-end encryption does

With E2EE, messages are encrypted on the sender's device and decrypted only on the recipient's. The app's provider and anyone watching the network can carry the message but cannot read it.

- **Privacy.** Only the intended recipient can read the content, not even the company running the service.
- **Security.** Intercepted data stays unreadable in transit and on the provider's servers, unless someone holds the keys.
- **Control.** You decide who holds your messages, files and keys.

> **Know the limits.** E2EE protects content, not everything around it. The provider may still see who talks to whom, when, and from where, depending on the app. It also does not protect a phone that is already compromised, or messages saved in an unprotected backup. Pick an app by what it hides, not only by the word "encrypted".

## Options compared

| Option | Account needed | What it is good for | Worth knowing |
| --- | --- | --- | --- |
| Zcash encrypted memos | A Zcash wallet | Short private notes sent with a shielded payment | 512 bytes per transaction, small fee, delivery takes at least a block |
| Signal | Phone number to register | Everyday private chat and calls | Free; usernames let you avoid sharing your number with contacts |
| Bison Relay | None | Messaging without accounts, with minimal metadata | Every message is paid for over the Decred Lightning Network |
| Session | None (no phone or email) | Chat with minimal metadata and onion routing | Funding trouble in 2026; see the note below |

## Zcash encrypted memos

Zcash desktop and mobile wallets can send an encrypted message along with a shielded transaction. The memo can be up to 512 bytes, and the fee is under one US cent. Because of how shielded transactions are detected and how often blocks are produced, a message can take a minute or more to arrive.

${img("Zcash Encrypted Memos")}

Get a wallet at [z.cash/wallets](https://z.cash/wallets).

## Signal

Signal is a free, easy-to-use messenger with end-to-end encryption. It needs no prior experience, and it is a good default for most people who want private chat and calls.

${img("Signal App")}

[Download Signal](https://signal.org/download/)

## Bison Relay

Bison Relay launched in 2022 and needs no accounts. Each message sent and received is paid for individually over the Decred Lightning Network. The goal is to remove accounts and keep metadata to a minimum, and to make censorship harder to apply.

${img("Bison Relay")}

[Download Bison Relay](https://bisonrelay.org/download)

## Session

Session is an end-to-end encrypted messenger built to minimize sensitive metadata. You create an account without a phone number or email address, and messages travel through an onion-routed network, so no central server sees your IP address together with your messages.

${img("Session App")}

> **Status.** In April 2026 the Session Technology Foundation said its paid staff had stopped working and that donations covered critical services only until 8 July 2026, leaving volunteers to maintain the app ([It's FOSS](https://itsfoss.com/news/session-call-for-donations/)). In October 2026 it published the Protocol v2 specification, which adds forward secrecy and post-quantum encryption, but v2 had not fully shipped ([CyberInsider](https://cyberinsider.com/session-implements-quantum-resistant-encryption-in-protocol-v2/)). Check the project's current status before relying on it.

[Get Session](https://getsession.org)
`;
}

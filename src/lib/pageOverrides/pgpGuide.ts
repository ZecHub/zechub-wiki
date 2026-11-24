// Rewrite of "Pretty Good Privacy (PGP)". Images and the step-by-step flow come from the ZecHub/zechub
// page. What changes: the tools list is corrected (the GPG link was GPG Suite, which is macOS only;
// Mailvelope is a browser add-on, not a Gmail/Thunderbird one; Thunderbird has had built-in OpenPGP since
// version 78; "PGPMail" is dropped), "enter your private key" becomes "enter your passphrase", key-length
// advice is brought up to date, and the steps become numbered items. If the source is not this page any
// more, the original markdown is returned untouched.
export function rewritePgpGuide(original: string): string {
  if (!/^# Pretty Good Privacy \(PGP\)\s*$/im.test(original)) return original;
  if (!/How to Generate Keys/.test(original) || !/How to decrypt an email with PGP/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/^<a href="https:\/\/github\.com\/[^"]*\/edit\/[^"]*"[^>]*>\s*<img[^>]*Edit[^>]*>\s*<\/a>\s*\n/m)?.[0] ?? "";
  const intro = original.match(/^Pretty Good Privacy \(PGP\) is a cryptographic software package[^\n]+$/m)?.[0];
  const img = (alt: string) => original.match(new RegExp(`!\\[${alt}\\]\\([^)]+\\)`))?.[0] ?? "";
  if (!intro) return original;

  return `${fm}${edit}
# Pretty Good Privacy (PGP)

${intro}

> **Know the limits.** PGP encrypts the body of a message and any attachments. It does not hide who is writing to whom, or the subject line, and it does not give forward secrecy: anyone who later gets your private key can read old messages saved to disk. For live chat, see [Secure Messengers](/privacy-tools/secure-messengers).

## Tools

| Tool | Platform | Notes |
| --- | --- | --- |
| [GnuPG](https://gnupg.org/) | Linux, macOS, Windows | The free, open-source reference implementation. On Windows it comes with [Gpg4win](https://www.gpg4win.org/), on macOS with [GPG Suite](https://gpgtools.org/). |
| [Thunderbird](https://www.thunderbird.net/) | Windows, macOS, Linux | OpenPGP support is built in since version 78, so no extra software is needed. |
| [Mailvelope](https://mailvelope.com/) | Chrome, Edge, Firefox | Free, open-source browser add-on that adds PGP to webmail such as Gmail. |

More options are listed at [openpgp.org/software](https://www.openpgp.org/software/).

${img("PGP Tools")}

## Generate your keys

PGP works with a key pair: a **public key** you share, and a **private key** you keep secret.

<PointList>

<PointItem n="1" title="Open your PGP software">

Use one of the tools above.

</PointItem>

<PointItem n="2" title="Create a new key">

Click **Generate Key** and enter your name and email address.

</PointItem>

<PointItem n="3" title="Choose the key type">

Accept the modern default (Curve25519) if your software offers it. If you pick RSA, use at least 3072 bits; 4096 is common. A longer key is stronger, but only up to that point.

</PointItem>

<PointItem n="4" title="Protect it with a passphrase">

Click **Generate**. The passphrase you set encrypts your private key on disk, so make it long and unique.

</PointItem>

</PointList>

${img("Generate Keys")}

## Use PGP for email

To write to someone, you need their **public key**. Your PGP tool uses it to encrypt the message, and the result is unreadable to anyone without the recipient's **private key**. The recipient decrypts it with their own private key.

${img("PGP Email")}

### Encrypt an email

1. Open your PGP software and the email you want to encrypt.
2. Select the recipient's public key.
3. Click **Encrypt**.

${img("Encrypt Email")}

${img("Encryption Flow")}

### Decrypt an email

1. Open your PGP software and the encrypted email.
2. Click **Decrypt**.
3. Enter your passphrase. Your private key stays in your keyring; you do not paste it anywhere.

${img("Decrypt Email")}

## Best practices

- **Keep your private key safe.** It is the most important part of the pair. Anyone who gets it can read every message encrypted to your public key.
- **Protect it with a strong passphrase.** The passphrase is what stops someone who copies your key file from using it.
- **Share your public key with people you trust**, directly or through a PGP keyserver, and check its fingerprint with the owner by another channel before you rely on it.
- **Make a revocation certificate** when you create the key and store it offline, so you can retire the key if it is lost or stolen.
- **Keep your software up to date.** Updates fix bugs and security issues.

${img("Best Practices 1")}

${img("Best Practices 2")}

## Where PGP shows up in Zcash

PGP is also how some Zcash software releases are signed. The [verification guide](/guides/verifying-zcash-releases) shows how to check a GPG signature before you run a download.
`;
}

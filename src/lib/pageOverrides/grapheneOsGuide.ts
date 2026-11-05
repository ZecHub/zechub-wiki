// Rewrite of "Graphene OS". Wording comes from the ZecHub/zechub page; what changes:
// - the opening no longer repeats itself (TL;DR + three intro paragraphs), and says up front that only
//   Pixel phones are supported (the page never said so);
// - claims that do not hold for GrapheneOS are dropped: "anti-malware protections", "encrypt storage if
//   not enabled", the CopperheadOS origin line, Bromite (discontinued) and location spoofing;
// - the installer OS lists (Windows 10, Ubuntu 22.10, macOS Big Sur...) are replaced by a link to the
//   official prerequisites, since they go out of date with every release;
// - the broken "Related pages" links (*.md) point at real wiki pages.
// If the source is not this page any more, the original markdown is returned untouched.
export function rewriteGrapheneOsGuide(original: string): string {
  if (!/^# Graphene OS\s*$/im.test(original)) return original;
  if (!/grapheneos\.org\/install\/web/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/^<a href="https:\/\/github\.com\/[^"]*\/edit\/[^"]*"[^>]*>\s*<img[^>]*Edit[^>]*>\s*<\/a>\s*\n/m)?.[0] ?? "";

  return `${fm}${edit}
# GrapheneOS

GrapheneOS is a non-profit, open-source mobile operating system focused on privacy and security. It runs everyday Android apps, but hardens the parts that attackers go after: the app sandbox, exploit mitigations and the permission model, without making the phone harder to use. For a Zcash user it is a strong base for mobile self-custody: pair it with a maintained shielded wallet and good operational habits.

> **Supported devices.** GrapheneOS installs only on supported Google Pixel phones. Motorola announced a partnership with the GrapheneOS Foundation at MWC 2026 ([Android Authority](https://www.androidauthority.com/grapheneos-motorola-partnership-announced-3645710)), but no phone has been named yet. Check the [official install page](https://grapheneos.org/install/web) for the current list before you buy a device.

## What you get

- **Hardened app sandbox.** Apps are isolated from each other more strictly than on stock Android, which limits what a compromised app can reach.
- **Exploit mitigations.** Memory-safety hardening and compiler-based protections reduce common classes of vulnerabilities.
- **Verified boot.** Hardware-backed keys let the phone check that the operating system has not been tampered with.
- **Fine-grained permissions.** You control what each app can access, including per-app Network and Sensors permissions, and a privacy dashboard shows what apps have used.
- **USB port protection.** The USB port is restricted while the phone is locked, which blocks a common route for forensic and cable-based attacks.
- **Encryption by default.** Device storage is encrypted out of the box.
- **Fast security updates.** Patches ship regularly, so you stay close to the latest protections.
- **Hardened browser and few preinstalled apps.** The default browser, Vanadium, is built for security and anti-tracking, and the system ships minimal software to keep the attack surface small.

## Install GrapheneOS

Use the official installation guides and nothing else. There are two supported methods:

| Method | Best for | Guide |
| --- | --- | --- |
| WebUSB installer | Most people; runs in a supported browser | [Web install guide](https://grapheneos.org/install/web) |
| Command line | Technical users who want full control | [CLI install guide](https://grapheneos.org/install/cli) |

Both need a supported Pixel, a USB cable (A or C) and enough free storage on the computer. The list of supported operating systems and browsers changes with each release, so read the prerequisites on the official page ([web](https://grapheneos.org/install/web#prerequisites), [CLI](https://grapheneos.org/install/cli#prerequisites)) rather than relying on a copy here. The command-line route is not recommended unless you are comfortable with it.

## Good habits

**The device**

- Keep the OS up to date, and set a strong, unique PIN or password.
- Use a secure lock screen rather than leaving the phone open.
- Make regular backups in case the phone is lost or damaged.
- Do not root the phone or unlock the bootloader beyond what the installer requires; that weakens the protections above.

**Apps and accounts**

- Grant each app only the permissions it needs, and review them from time to time.
- Install apps from sources you can verify, and uninstall the ones you no longer use or trust.
- Turn on two-factor authentication on your online accounts; a [hardware security key](/privacy-tools/2fa-hardware-devices) is the strongest option.
- Review the default settings and set them to match your privacy preferences.

**Network and location**

- Be careful on public Wi-Fi, and use a VPN when you need to.
- Limit location access per app.
- Treat unsolicited links and attachments as possible phishing.

**Community**

- The GrapheneOS team and forum are the best place for updates and security advice: [contact the team](https://grapheneos.org/contact).

## Related pages

- [Secure Messengers](/privacy-tools/secure-messengers): private communication on a hardened device
- [PGP Encryption](/privacy-tools/pgp-encryption): encrypted mail and file exchange
- [VPN and DVPN](/privacy-tools/vpn-and-dvpn): network-layer privacy on mobile
- [Web Browsers](/privacy-tools/web-browsers): choosing and hardening a mobile browser
`;
}

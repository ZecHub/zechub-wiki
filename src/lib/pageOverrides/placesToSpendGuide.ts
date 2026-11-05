// Editorial rewrite of "Places to Spend ZEC". Entries whose website no longer exists (Allegrini Ristorante, never
// opened), whose service is broken or empty (Meile dVPN: database error; ZEC Market: no listings on 5 Nov 2026)
// and the profile of a minor (Corona de Brillitos) are left out. The business directory (names, links, locations
// and every Unified Address) comes from the ZecHub/zechub repo: the addresses are lifted out of
// the fetched markdown rather than retyped, and if the source no longer looks like the page
// this was written for, the original markdown is returned untouched.
export function rewritePlacesToSpendGuide(original: string): string {
  if (!/^# places to spend zec\s*$/im.test(original)) return original;
  const addrs = [...original.matchAll(/```\s*\n(u1[a-z0-9]+)\s*\n```/g)].map((m) => m[1]);
  if (addrs.length !== 10) return original;
  const [sheila, rosa, papeles, edve, gorbrit, karin, , tecno, jossy] = addrs;
  // The blue "Edit" badge above the title is dropped; the same GitHub link moves to the end of the page.
  const prefix = original.slice(0, original.search(/^# places to spend zec\s*$/im));
  const editUrl =
    prefix.match(/href="(https:\/\/github\.com\/[^"]+\/edit\/[^"]+)"/i)?.[1] ??
    "https://github.com/zechub/zechub/edit/main/site/Using_Zcash/Spend_Zcash/Top_10_Places_to_spend_ZEC.md";

  const ua = (a: string) => `**Zcash Unified Address**\n\n\`\`\`\n${a}\n\`\`\`\n`;

  return `# Places to Spend ZEC

Where you can pay with ZEC today: online services open to anyone with a wallet, and a directory of small businesses and freelancers in Venezuela.

> **Last checked 5 November 2026.** Each link was tested and entries with a dead site or no activity were removed. A working link does not prove a seller still takes ZEC, so check the seller's own channels, use a shielded address, and send a small test amount first if you have not paid that address before.

## Online, worldwide

Services you can use from anywhere with a wallet.

### ZecBuy

*Private digital goods, paid in shielded ZEC.* ZecBuy sells travel eSIM data plans and Mullvad VPN account numbers. There is no account and no email: pick a product, get a ten-minute quote, pay a fresh shielded address and receive the code. Gift cards, mobile top-ups and games are listed as coming soon.

**Link:** [zecbuy.com](https://zecbuy.com/)

---

### NymVPN

*Decentralized VPN and mixnet.* NymVPN routes traffic through a network of independent nodes, and its mixnet mode adds cover traffic so packet timing and size do not work as a fingerprint. Signing up needs no personal information, and it accepts shielded ZEC at checkout. Send from a shielded address and wait for one confirmation.

**Links:** [nym.com](https://nym.com/) | [How to pay with ZEC](https://support.nym.com/hc/en-us/articles/38626320242833-Paying-for-NymVPN-with-ZEC-Zcash) | [VPN & dVPN guide](/privacy-tools/vpn-and-dvpn)

More ZEC-friendly projects are listed in [Community Projects](/zcash-community/community-projects), and wallets that can pay are on the [Wallets](/using-zcash/wallets) page.

## Small businesses in Venezuela

People and small businesses you can reach in Venezuela. Most work in person or by message.

### Sheila Vargas

*Foodie, blogger and entrepreneur.* Sheila is known for her *Galletas de la FeliZidad* cookies and also offers mentorship. Payment in ZEC is accepted.

**Links:** [Cookies on Free2Z](https://free2z.cash/SheEmprende/zpage/galletas-zcash) | [Free2Z](https://free2z.cash/SheEmprende) | [X](https://x.com/SheEmprende_)

${ua(sheila)}
Location: Caracas, Venezuela

---

### Somos Dulceros

*Artisanal chocolate, traditional Venezuelan sweets and bakery, by Rosa Rangel.* Rosa is a computer engineer and chocolatière who accepts Zcash.

**Links:** [Instagram](https://www.instagram.com/somos_dulceros) | [X](https://x.com/RosaMRangel) | [Free2Z](https://free2z.cash/Criptodulceros/zpage/criptodulceros-01)

${ua(rosa)}
Location: Caracas, Venezuela

---

### Papeles a Color

*Handmade paper crafts and party decorations, by Elizabeth B.* Celebrate a promotion or a birthday with custom pieces, including a Zcash-themed phone charging base.

**Links:** [Blog](https://papelesacolor.blogspot.com/) | [Instagram](https://instagram.com/papelesacolor) | [Free2Z](https://free2z.cash/PapelesaColor) | [Linktree](https://linktr.ee/Papelesacolor)

${ua(papeles)}
Location: San Juan de los Morros, Venezuela

---

### Emprendedoras Digitales de Venezuela

*A community of women entrepreneurs, led by Aura Brito.* EDVE helps women build their own businesses, with business-idea development and branding.

**Links:** [Website](https://emprendedorasdigitales.org/) | [Instagram](https://instagram.com/emprendedorasdigitalesve) | [X](https://x.com/EmpreDigiVE) | [Telegram](https://t.me/emprendedorasdigitalesve) | [LinkedIn](https://www.linkedin.com/company/emprendedorasdigitalesve/)

${ua(edve)}
Location: San Antonio de los Altos, Venezuela

---

### GorBrit Social Media

*Web design, hosting, branding, business consulting and social media strategy, run by Roosevelt Gordones and Aura Brito.* GorBrit accepts several payment methods, including cryptocurrencies such as Zcash. Available in person and online.

**Links:** [Website](https://gorbrit.com/) | [Telegram](https://t.me/gorbritsm) | [Instagram](https://www.instagram.com/gorbritsm/) | [X](https://x.com/GorBritSM)

${ua(gorbrit)}
Location: Caracas, Venezuela

---

### RobmarEscool

*Digital designer and photographer.* Robmar edits video and audio, creates logos and animation, teaches photography workshops, and is known in the ecosystem for his work with the ZFAV club.

**Links:** [Telegram](https://t.me/Robmarn) | [X](https://x.com/robmarn) | [Free2Z](https://free2z.cash/robmarn)

Location: Barquisimeto, Venezuela

---

### Tecnopapapi

*Computer and phone repair, by Alexis López Abreu (@Lexihel).* Windows computer services and Android phone support. Tecnopapapi accepts cryptocurrencies, including ZEC, and other payment methods.

**Links:** [Website](https://tecnopapapi.com) | [Telegram](https://t.me/Lexihel) | [YouTube](https://youtube.com/@tecnopapapi) | [X](https://x.com/tecnopapapi) | [TikTok](https://www.tiktok.com/@lexihel) | [Instagram](https://www.instagram.com/tecnopapapi/) | [Facebook](https://www.facebook.com/tecnopapapi)

${ua(tecno)}
Location: San Juan de los Morros, Venezuela

---

### Karin Beauty Studio

*Manicure, hand and nail care, by Karin Gordones.* Home service in Caracas and San Antonio de los Altos, by appointment.

**Links:** [Instagram](https://instagram.com/karinbeautystudio)

${ua(karin)}
Location: El Valle, Caracas, Venezuela

---

### Jossy Mendoza, driver

*Driving service to and from Caracas,* including Altos Mirandinos, Valles del Tuy, Guarenas, Guatire, La Guaira and Simón Bolívar International Airport. He accepts cryptocurrencies, including Zcash.

${ua(jossy)}

## Add your business

Do you accept ZEC? Open a pull request on the [ZecHub repository](https://github.com/zechub/zechub) or [edit this page on GitHub](${editUrl}). If you want to start taking ZEC, read [Accept ZEC as a merchant](/zcash-use-cases/accept-payments-as-a-merchant).
`;
}

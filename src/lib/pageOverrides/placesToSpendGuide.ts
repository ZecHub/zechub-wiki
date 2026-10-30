// Editorial rewrite of "Places to Spend ZEC". The business directory (names, links, locations
// and every Unified Address) comes from the ZecHub/zechub repo: the addresses are lifted out of
// the fetched markdown rather than retyped, and if the source no longer looks like the page
// this was written for, the original markdown is returned untouched.
export function rewritePlacesToSpendGuide(original: string): string {
  if (!/^# places to spend zec\s*$/im.test(original)) return original;
  const addrs = [...original.matchAll(/```\s*\n(u1[a-z0-9]+)\s*\n```/g)].map((m) => m[1]);
  if (addrs.length !== 10) return original;
  const [sheila, rosa, papeles, edve, gorbrit, karin, corona, tecno, jossy, allegrini] = addrs;
  // The blue "Edit" badge above the title is dropped; the same GitHub link moves to the end of the page.
  const prefix = original.slice(0, original.search(/^# places to spend zec\s*$/im));
  const editUrl =
    prefix.match(/href="(https:\/\/github\.com\/[^"]+\/edit\/[^"]+)"/i)?.[1] ??
    "https://github.com/zechub/zechub/edit/main/site/Using_Zcash/Spend_Zcash/Top_10_Places_to_spend_ZEC.md";

  const ua = (a: string) => `**Zcash Unified Address**\n\n\`\`\`\n${a}\n\`\`\`\n`;

  return `# Places to Spend ZEC

A growing number of shops, freelancers and online services accept ZEC. This page lists some of them, starting with small businesses in Venezuela and ending with online services open to anyone with a wallet. You only need a Zcash wallet and a network connection.

Listed in no particular order. Check each seller's own channels before you pay, and send a small test amount first if you have not used an address before.

## Why accept ZEC?

If you sell a product or a service, accepting Zcash gives you:

- **Privacy for you and your customers.** Shielded transactions keep the amount and the parties off the public ledger. Only the sender and the receiver see the details.
- **Lower cost and faster settlement.** Payments go straight from wallet to wallet with no bank or card network in between.
- **A wider customer base.** People who already hold crypto can pay you without converting it first.
- **Customer loyalty.** Shoppers who want to spend their ZEC will remember the places that accept it.
- **A modern image.** Taking ZEC sets a shop or a freelancer apart from competitors.

## Venezuela

### Sheila Vargas

*Foodie, blogger and entrepreneur.* Sheila is known for her *Galletas de la FeliZidad* cookies and also offers mentorship. Payment in ZEC is accepted.

**Links:** [Cookies on Free2Z](https://free2z.cash/SheEmprende/zpage/galletas-zcash) | [Free2Z](https://free2z.cash/SheEmprende) | [X](https://twitter.com/SheEmprende_)

Her former website, sheemprende.com, has been retired and no longer resolves.

${ua(sheila)}
Location: Caracas, Venezuela

---

### Somos Dulceros

*Artisanal chocolate, traditional Venezuelan sweets and bakery, by Rosa Rangel.* Rosa is a computer engineer and chocolatière who accepts Zcash.

**Links:** [Instagram](https://www.instagram.com/somos_dulceros) | [X](https://twitter.com/RosaMRangel) | [Free2Z](https://free2z.cash/Criptodulceros/zpage/criptodulceros-01)

The website somosdulceros.com has been retired and no longer resolves.

${ua(rosa)}
Location: Caracas, Venezuela

---

### Papeles a Color

*Handmade paper crafts and party decorations, by Elizabeth B.* Celebrate a promotion or a birthday with custom pieces, including a Zcash-themed phone charging base.

**Links:** [Blog](https://papelesacolor.blogspot.com/) | [Instagram](https://instagram.com/papelesacolor) | [Free2Z](https://free2z.cash/PapelesaColor) | [Linktree](https://linktr.ee/Papelesacolor)

${ua(papeles)}
Location: San Juan de los Morros, Venezuela

---

### Corona de Brillitos

*Hair accessories and scrunchies, by Gissell B.* A young maker who runs her small business with Zcash.

**Links:** [Instagram](https://instagram.com/coronadebrillitos)

${ua(corona)}
Location: San Juan de los Morros, Venezuela

---

### Emprendedoras Digitales de Venezuela

*A community of women entrepreneurs, led by Aura Brito.* EDVE helps women build their own businesses, with business-idea development and branding.

**Links:** [Website](https://emprendedorasdigitales.org/) | [Instagram](https://instagram.com/emprendedorasdigitalesve) | [X](https://twitter.com/EmpreDigiVE) | [Telegram](https://t.me/emprendedorasdigitalesve) | [LinkedIn](https://www.linkedin.com/company/emprendedorasdigitalesve/)

${ua(edve)}
Location: San Antonio de los Altos, Venezuela

---

### GorBrit Social Media

*Web design, hosting, branding, business consulting and social media strategy, run by Roosevelt Gordones and Aura Brito.* GorBrit accepts several payment methods, including cryptocurrencies such as Zcash. Available in person and online.

**Links:** [Website](https://gorbrit.com/) | [Telegram](https://t.me/gorbritsm) | [Instagram](https://www.instagram.com/gorbritsm/) | [X](https://twitter.com/GorBritSM)

${ua(gorbrit)}
Location: Caracas, Venezuela

---

### RobmarEscool

*Digital designer and photographer.* Robmar edits video and audio, creates logos and animation, teaches photography workshops, and is known in the ecosystem for his work with the ZFAV club.

**Links:** [Telegram](https://t.me/Robmarn) | [X](https://twitter.com/robmarn) | [Free2Z](https://free2z.cash/robmarn)

Location: Barquisimeto, Venezuela

---

### Tecnopapapi

*Computer and phone repair, by Alexis López Abreu (@Lexihel).* Windows computer services and Android phone support. Tecnopapapi accepts cryptocurrencies, including ZEC, and other payment methods.

**Links:** [Website](https://tecnopapapi.com) | [Telegram](https://t.me/Lexihel) | [YouTube](https://youtube.com/@tecnopapapi) | [X](https://twitter.com/tecnopapapi) | [TikTok](https://www.tiktok.com/@lexihel) | [Instagram](https://www.instagram.com/tecnopapapi/) | [Facebook](https://www.facebook.com/tecnopapapi)

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

## Online, worldwide

Everything above is a person or a small business in Venezuela. These services are online, open to anyone with a wallet, and settle in ZEC.

---

### ZecBuy

*Digital goods, eSIM data and VPN access.* ZecBuy sells private digital goods for ZEC, such as travel eSIM data plans and Mullvad VPN accounts. There is no sign-up and no email address: pick a product, pay in ZEC and receive the code.

**Link:** [zecbuy.com](https://zecbuy.com/)

---

### ZEC Market

*A peer-to-peer marketplace.* Buyers and sellers deal directly. Prices are shown in dollars and settled wallet to wallet in Zcash, shielded by default. The platform charges no fee and never holds funds, which makes it the place to look when what you want is not on a list like this one.

**Link:** [zecmarket.org](https://zecmarket.org/). More projects like it are in [Community Projects](/zcash-community/community-projects).

---

### NymVPN

*Decentralized VPN and mixnet.* NymVPN routes traffic through a decentralized network of nodes, and its mixnet mode adds cover traffic so packet timing and size do not work as a fingerprint. Signing up needs no personal information, and payment is accepted in privacy coins, including Zcash.

**Link:** [nym.com](https://nym.com/). Background reading: [VPNs and dVPNs](/privacy-tools/vpn-and-dvpn).

---

### Meile dVPN

*Decentralized VPN on the Sentinel network.* Meile is a dVPN client from the MathNodes team, and its nodes are run by community members rather than a single company. Plans are paid inside the app, and shielded ZEC payments are handled through BTCPay. Builds exist for Windows, macOS and Linux, plus a mobile client.

**Link:** [Meile dVPN on MathNodes](https://mathnodes.com/index.php/meile-dvpn-client-linux-os-x/) (meile.app redirects there)

## Coming soon

### Allegrini Ristorante

*Italian restaurant and pizzeria in Madrid, Spain.* Delivery, take-away and reservations. The restaurant has announced that it will accept Zcash soon, and plans to list on [Free2Z](https://free2z.cash). The announced website was never completed and no longer resolves.

**Links:** [Instagram](https://instagram.com/allegriniristorante) | [X](https://twitter.com/AllegriniRisto) | [Telegram](https://t.me/AllegriniRistorante) | [Pinterest](https://pin.it/6z8hq6F)

${ua(allegrini)}
Location: Madrid, Spain

## Add your business

Do you accept ZEC? Open a pull request on the [ZecHub repository](https://github.com/zechub/zechub) to add your shop or service to this page, or [edit this page on GitHub](${editUrl}).
`;
}

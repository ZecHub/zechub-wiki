// ZEC Use Cases (start-here/zec-use-cases). The source file is headed "Zcash Basics", a copy of another page's title, so
// the page, the browser title and the sidebar entry all read "Zcash Basics" next to the real Zcash Basics page. The H1 is
// corrected to "ZEC Use Cases" and the three use cases become a summary table (cards on phones) and the original
// sections. Kept from the original: every fact and every link. Skipped if the "Zcash Basics" H1 followed by the
// "ZEC Use Cases" H2 is not found.

const CARD =
  "rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2";

const USES: Array<[string, string, string]> = [
  ["**Payments**", "Transact efficiently and safely with low fees, with shielded transactions that stay confidential", "[Pay With Zcash](https://z.cash/pay-with-zcash/)"],
  ["**Store of value**", "Hold wealth in a hard, privacy-protecting asset with a fixed supply of 21 million ZEC", "[Mining Zcash](https://z.cash/mining-zcash/)"],
  ["**Messaging**", "Send fully encrypted messages in the memo field of a shielded transaction", "[The Encrypted Memo Field](https://electriccoin.co/blog/encrypted-memo-field/)"],
];

const usesTable = [
  "| Use case | In short | Learn more |",
  "| --- | --- | --- |",
  ...USES.map(([a, b, c]) => `| ${a} | ${b} | ${c} |`),
].join("\n");

const usesCards = USES.map(([a, b, c]) => `<div className="${CARD}">\n\n${a}\n\n${b}.\n\n${c}\n\n</div>`).join("\n\n");

const BODY = `ZEC has three main uses: payments, a store of value and private messaging. Shielded transactions keep the addresses, the amount and the memo field encrypted, while still letting you share them if you choose.

<div className="hidden md:block">

${usesTable}

</div>

<div className="md:hidden my-4 space-y-3">

${usesCards}

</div>

## Payments

People use ZEC to transact efficiently and safely with low fees. Shielded Zcash ensures transactions remain confidential, while also giving them the option to share address and transaction information should they choose to. Private, "Z-Z" transactions appear on the public blockchain so it is known that they occurred and that fees were paid. But, the addresses, transaction amount and memo field are all encrypted and not publicly visible.

## Store of value

People can also use ZEC to store wealth in a hard, privacy-protecting, asset. There will only ever be 21 million ZEC units, meaning that the asset has a fixed supply. Once the 21 millionth ZEC is [mined into circulation](https://z.cash/mining-zcash/), the asset will become anti-inflationary. Anti-inflationary assets are a good hedge against inflation in the event that centralized gatekeepers inflate national money supplies.

## Messaging

People can use the memo field in a shielded Z-Z transaction to send fully encrypted messages. To send a memo, users must run a transaction and pay a transaction fee, which is less than $0.01.

## Resources

- [The Encrypted Memo Field](https://electriccoin.co/blog/encrypted-memo-field/)
- [Pay With Zcash](https://z.cash/pay-with-zcash/)
- [Where to Pay With Zcash](https://paywithz.cash/)

## Related pages

- [Zcash Basics](/start-here/what-is-zec-and-zcash): what ZEC and Zcash are
- [Zcash Monetary Policy](/start-here/zcash-monetary-policy): how the supply and block rewards work
- [Memos](/using-zcash/memos): how to use the encrypted memo field
- [Buying ZEC](/using-zcash/buying-zec): how to get your first ZEC
`;

export function rewriteZecUseCasesPage(original: string): string {
  const m = original.match(/^# Zcash Basics\s*\n+## ZEC Use Cases/m);
  if (!m || m.index === undefined) return original;
  return original.slice(0, m.index) + "# ZEC Use Cases\n\n" + BODY;
}

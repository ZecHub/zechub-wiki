/**
 * @jest-environment node
 */
import { buildZip321Uri, parseZip321Uri } from "../zip321";

const sapling =
  "zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd";
const unified =
  "u1n6sscrlxhz8a9wlvfa076rux7q00lff48jt62kje09ds5ntynlp2hcrsf3emtprts3z59yt99cvzwvnz7lvzgrpdxqrj3kxfx98y2pt46qry87rqcfuj02x3xsj0jqqnehhzd8hy090tntqwsx8ncatsckzmnw43yqqntuv668av4vhqf2p6payrz94cstm2v465f4nllmpawp5jcat";

/**
 * Reads query values the way ZIP-321 wallets do: split on "&" and "=", then
 * percent-decode only. librustzcash's zip321 crate uses percent_decode, which
 * leaves "+" as a literal plus rather than turning it into a space.
 */
function walletParams(uri: string): Record<string, string> {
  const query = uri.slice(uri.indexOf("?") + 1);
  return Object.fromEntries(
    query.split("&").map((pair) => {
      const eq = pair.indexOf("=");
      return [pair.slice(0, eq), decodeURIComponent(pair.slice(eq + 1))];
    }),
  );
}

describe("ZIP-321 query value encoding", () => {
  it("percent-encodes spaces instead of writing them as '+'", () => {
    const uri = buildZip321Uri([
      { address: sapling, amount: "1", label: "Coffee shop", message: "Thank you for your purchase" },
    ]);

    expect(uri).toBe(
      `zcash:${sapling}?amount=1&label=Coffee%20shop&message=Thank%20you%20for%20your%20purchase`,
    );
    expect(walletParams(uri)).toMatchObject({
      label: "Coffee shop",
      message: "Thank you for your purchase",
    });
  });

  it("keeps a literal '+' distinguishable from a space", () => {
    const uri = buildZip321Uri([
      { address: sapling, label: "C++ dev fund", message: "1 + 1 = 2" },
    ]);

    expect(walletParams(uri)).toMatchObject({
      label: "C++ dev fund",
      message: "1 + 1 = 2",
    });
  });

  it("encodes reserved characters and non-ASCII text in values", () => {
    const uri = buildZip321Uri([
      { address: sapling, label: "Tips & thanks", message: "Café #1 ✓ 100%" },
    ]);

    expect(uri).not.toMatch(/[ #]/);
    expect(walletParams(uri)).toMatchObject({
      label: "Tips & thanks",
      message: "Café #1 ✓ 100%",
    });
  });

  it("encodes indexed parameters of multi-recipient requests the same way", () => {
    const uri = buildZip321Uri([
      { address: sapling, amount: "1", label: "First payee" },
      { address: unified, amount: "2", message: "Second payee" },
    ]);

    expect(uri).toContain("label=First%20payee");
    expect(uri).toContain("message.1=Second%20payee");
    expect(walletParams(uri)).toMatchObject({
      label: "First payee",
      "message.1": "Second payee",
    });
  });

  it("still round-trips through parseZip321Uri", () => {
    const payments = [
      { address: sapling, amount: "1.5", label: "Coffee shop", message: "C++ & tea", memo: "Thanks!" },
      { address: unified, amount: "0.25", label: "Second payee" },
    ];

    expect(parseZip321Uri(buildZip321Uri(payments))).toEqual([
      { address: sapling, amount: "1.5", label: "Coffee shop", message: "C++ & tea", memo: "Thanks!" },
      { address: unified, amount: "0.25", label: "Second payee" },
    ]);
  });
});

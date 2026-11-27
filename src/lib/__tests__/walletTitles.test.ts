/**
 * @jest-environment node
 */
import {
  getKnownWalletTitles,
  parseWalletTitles,
  __resetWalletTitlesMemo,
  WALLETS_MD_PATH,
} from "@/lib/walletTitles";

const MD = `
## [ZODL](https://zodl.com)
![logo](/wallets/zodl.png "ZODL")
Devices: Android, iOS
---
## [Zend:Zcash Wallet](https://example.org/zend)
Devices: Desktop
---
## [Zingo!](https://zingolabs.org)
Devices: Android
`;

const ok = (body: string) => ({ ok: true, status: 200, text: async () => body });
const fetchMock = jest.fn();

beforeEach(() => {
  __resetWalletTitlesMemo();
  fetchMock.mockReset();
  (global as any).fetch = fetchMock;
});

describe("parseWalletTitles", () => {
  it("reads the same titles the /wallets page renders", () => {
    expect([...parseWalletTitles(MD)]).toEqual(["ZODL", "Zend:Zcash Wallet", "Zingo!"]);
  });

  it("ignores sections without a title", () => {
    expect(parseWalletTitles("intro text\n---\n").size).toBe(0);
  });
});

describe("getKnownWalletTitles", () => {
  it("fetches the wallets markdown once per TTL", async () => {
    fetchMock.mockResolvedValue(ok(MD));
    const t0 = 1_000_000;
    const a = await getKnownWalletTitles(t0);
    const b = await getKnownWalletTitles(t0 + 9 * 60 * 1000);
    expect(a?.has("ZODL")).toBe(true);
    expect(b).toBe(a);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(
      new RegExp(`^https://raw\\.githubusercontent\\.com/.+/${WALLETS_MD_PATH}$`),
    );
    await getKnownWalletTitles(t0 + 11 * 60 * 1000);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("coalesces concurrent cold reads into one fetch", async () => {
    let release: (v: unknown) => void = () => {};
    fetchMock.mockReturnValue(new Promise((r) => (release = r)));
    const p = Promise.all([getKnownWalletTitles(1), getKnownWalletTitles(1), getKnownWalletTitles(1)]);
    release(ok(MD));
    const [a, b, c] = await p;
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  it("returns null when the list was never read", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503, text: async () => "" });
    expect(await getKnownWalletTitles(1)).toBeNull();
    fetchMock.mockRejectedValue(new Error("timeout"));
    expect(await getKnownWalletTitles(2)).toBeNull();
  });

  it("treats a parse with no titles as a failed read", async () => {
    fetchMock.mockResolvedValue(ok("# Moved\nSee the new page."));
    expect(await getKnownWalletTitles(1)).toBeNull();
  });

  it("keeps serving the last good list when a refresh fails", async () => {
    fetchMock.mockResolvedValueOnce(ok(MD));
    const good = await getKnownWalletTitles(0);
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500, text: async () => "" });
    const later = await getKnownWalletTitles(60 * 60 * 1000);
    expect(later).toBe(good);
    fetchMock.mockResolvedValueOnce(ok("# Moved"));
    expect(await getKnownWalletTitles(2 * 60 * 60 * 1000)).toBe(good);
  });

  it("waits a minute before retrying a failed refresh", async () => {
    fetchMock.mockResolvedValueOnce(ok(MD));
    const H = 60 * 60 * 1000;
    const good = await getKnownWalletTitles(0);
    fetchMock.mockRejectedValue(new Error("github down"));
    expect(await getKnownWalletTitles(H)).toBe(good);
    expect(await getKnownWalletTitles(H + 30_000)).toBe(good);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(await getKnownWalletTitles(H + 61_000)).toBe(good);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});

// The wallet titles that /api/wallet-likes accepts a vote for.
//
// The vote route used to store any `title` string it was sent. Each new string
// adds rows to wallet_likes, wallet_likes_limits and wallet_likes_proofs, and
// the tally read (delta 0) returns every wallet_likes row to every visitor of
// /wallets. Production already holds probe rows such as "", "xff-test" and a
// 200-character "SECURITY-AUDIT-LEN200-BBB…" title, and nothing bounds the
// length (up to the 1 MB body limit) or the number of distinct titles per IP.
//
// The /wallets page lists exactly the `## [Title](url)` entries of
// site/Using_Zcash/Wallets.md (no locale has its own copy, so every locale
// falls back to this file). Reading the same file here and parsing it with the
// same parser keeps the allow-list in step with the page with no second list
// to maintain: a wallet added to the markdown can be voted for once the memo
// refreshes (at most TTL_MS later).

import { parseMarkdown } from "@/lib/parseMarkdown";

export const WALLETS_MD_PATH = "site/Using_Zcash/Wallets.md";
// Longer than any real title (the longest is "Zend:Zcash Wallet"); rejected
// before the allow-list fetch or any database work.
export const MAX_WALLET_TITLE_LENGTH = 100;
const TTL_MS = 10 * 60 * 1000;
const RETRY_MS = 60 * 1000;
const FETCH_TIMEOUT_MS = 5000;

let memo: { titles: Set<string>; at: number } | null = null;
let inflight: Promise<Set<string> | null> | null = null;

function walletsMdUrl(): string {
  const owner = (process.env.OWNER ?? "").trim() || "ZecHub";
  const repo = (process.env.REPO ?? "").trim() || "zechub";
  const branch = (process.env.BRANCH ?? "").trim() || "main";
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${WALLETS_MD_PATH}`;
}

export function parseWalletTitles(markdown: string): Set<string> {
  return new Set(
    parseMarkdown(markdown)
      .map((w) => w.title)
      .filter((t): t is string => typeof t === "string" && t.length > 0),
  );
}

async function load(): Promise<Set<string> | null> {
  const res = await fetch(walletsMdUrl(), {
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) return null;
  const titles = parseWalletTitles(await res.text());
  // An empty parse means the file moved or its format changed: treat it as a
  // failed read so the last good list keeps serving.
  return titles.size > 0 ? titles : null;
}

/**
 * Titles listed on /wallets, or null when they have never been read
 * successfully. A failed refresh keeps serving the last good list.
 */
export async function getKnownWalletTitles(
  now: number = Date.now(),
): Promise<Set<string> | null> {
  if (memo && now - memo.at < TTL_MS) return memo.titles;
  if (!inflight) {
    inflight = load()
      .catch(() => null)
      .finally(() => {
        inflight = null;
      });
  }
  const fresh = await inflight;
  if (fresh) {
    memo = { titles: fresh, at: now };
    return fresh;
  }
  if (!memo) return null;
  // Retry a failed refresh after RETRY_MS, not on every request in between.
  memo = { titles: memo.titles, at: now - TTL_MS + RETRY_MS };
  return memo.titles;
}

/** Test hook. */
export function __resetWalletTitlesMemo(): void {
  memo = null;
  inflight = null;
}

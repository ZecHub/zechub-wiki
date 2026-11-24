// Can I Shield (canishield.vercel.app) publishes what exchanges and swaps did
// with shielded ZEC: its own on-chain deposit checks and reviewed reports from
// people who sent it. These helpers turn its public JSON (CC BY 4.0) into the
// small, validated shape the Deposit Check tool shows. Anything unexpected is
// dropped rather than passed through, so the page never renders upstream HTML
// or links it did not build itself.

export const CANISHIELD_ORIGIN = "https://canishield.vercel.app";

/** Can I Shield service slugs: lowercase letters, digits and hyphens. */
export const SLUG_RE = /^[a-z0-9-]{1,64}$/;

const REPORT_URL_RE = /^https:\/\/canishield\.vercel\.app\/report\/outcome\?service=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Only exchanges and swaps take deposits, so only they have a deposit record. */
const DEPOSIT_KINDS = new Set(["exchange", "swap"]);

export type DepositService = {
  slug: string;
  name: string;
  kind: "exchange" | "swap";
  /** Has at least one published deposit check or reviewed report. */
  hasRecord: boolean;
};

export type DepositRecord = {
  service: DepositService["slug"];
  name: string;
  /** Can I Shield's page for the service, with the sources. */
  url: string;
  /** Where to report what happened, when reports are open. */
  reportUrl: string | null;
  deposit: {
    label: string;
    ok: boolean;
    /** "a TEX", for "to a TEX deposit address". */
    to: string;
    /** YYYY-MM-DD, the day the payment landed. */
    date: string;
    /** "about 10 min"; null unless it was credited. */
    credit: string | null;
  } | null;
  outcomes: {
    total: number;
    trouble: number;
    latest: { label: string; tone: "ok" | "warn" | "bad"; week: string } | null;
  };
};

const str = (v: unknown, max = 120): string | null =>
  typeof v === "string" && v.length > 0 && v.length <= max ? v : null;
const count = (v: unknown): number =>
  typeof v === "number" && Number.isInteger(v) && v >= 0 && v < 1_000_000 ? v : 0;

/**
 * The exchanges and swaps from Can I Shield's /api/results.json: services with
 * a record first, then the rest, each group sorted by name.
 */
export function parseServiceList(body: unknown): DepositService[] {
  const b = body as { services?: unknown; depositChecks?: unknown } | null;
  if (!b || !Array.isArray(b.services)) return [];
  const checked = new Set(
    (Array.isArray(b.depositChecks) ? b.depositChecks : []).map((d: any) => (typeof d?.service === "string" ? d.service : "")),
  );
  const out: DepositService[] = [];
  for (const s of b.services as any[]) {
    const slug = str(s?.slug, 64);
    const name = str(s?.name, 80);
    const kind = s?.kind;
    if (!slug || !SLUG_RE.test(slug) || !name || !DEPOSIT_KINDS.has(kind)) continue;
    out.push({ slug, name, kind, hasRecord: checked.has(slug) || count(s?.outcomes?.total) > 0 });
  }
  return out.sort((a, b) => Number(b.hasRecord) - Number(a.hasRecord) || a.name.localeCompare(b.name));
}

const RESULT_TONE: Record<string, "ok" | "warn" | "bad"> = {
  credited: "ok",
  held_then_credited: "warn",
  documents_requested: "warn",
  refunded: "warn",
  rejected: "bad",
  held_open: "bad",
};

/** One service from Can I Shield's /api/services/[slug]; null if the payload is not what we expect. */
export function parseRecord(body: unknown, slug: string): DepositRecord | null {
  const b = body as Record<string, any> | null;
  if (!b || b.format !== "canishield-service/1" || b.service?.slug !== slug) return null;
  const name = str(b.service?.name, 80);
  if (!name) return null;

  const d = b.deposit;
  const date = typeof d?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d.date) ? d.date : null;
  const label = str(d?.label, 40);
  const to = str(d?.to, 40);
  const deposit =
    d && date && label && to
      ? { label, ok: d.ok === true, to, date, credit: d.ok === true ? str(d.credit, 40) : null }
      : null;

  const o = b.outcomes;
  const l = o?.latest;
  const tone = RESULT_TONE[l?.result];
  const latestLabel = str(l?.label, 40);
  const week = str(l?.week, 40);
  const latest = tone && latestLabel && week ? { label: latestLabel, tone, week } : null;

  // The report link carries the service's id; accept it only in Can I Shield's exact shape.
  const reportUrl =
    typeof b.reportUrl === "string" && REPORT_URL_RE.test(b.reportUrl) ? b.reportUrl : null;

  return {
    service: slug,
    name,
    // Built here, never taken from the payload, so the link always points at Can I Shield.
    url: `${CANISHIELD_ORIGIN}/services/${slug}`,
    reportUrl,
    deposit,
    outcomes: { total: count(o?.total), trouble: count(o?.trouble), latest },
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-11-07" -> "7 Nov 2026" */
export function shortDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

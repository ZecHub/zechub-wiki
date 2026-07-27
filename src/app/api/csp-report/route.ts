import { NextRequest, NextResponse } from "next/server";

// CSP violation sink. While the policy ships as Content-Security-Policy-Report-Only,
// browsers POST here (report-uri / Reporting API) instead of blocking. We log a
// compact one-liner per violation so gaps show up in the Vercel logs, then close
// them before switching to the enforcing header. No storage, no PII beyond the
// directive/URL the browser already reports.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 16 * 1024; // ignore anything larger — this is a log sink, not an API
const MAX_ENTRIES = 5; // cap log lines per request (anti log-amplification)
const MAX_FIELD = 300; // truncate each logged field

// Replace control chars (< 0x20 and DEL) with spaces so an attacker-controlled
// URL in a report can't forge extra log lines, then truncate. Codepoint compare
// (no regex) to keep the source free of literal control characters.
function clean(v: unknown): string {
  const s = String(v ?? "?");
  let out = "";
  for (const ch of s) {
    const c = ch.codePointAt(0) ?? 0;
    out += c < 0x20 || c === 0x7f ? " " : ch;
    if (out.length >= MAX_FIELD) break;
  }
  return out;
}

function summarize(entry: any): string | null {
  if (!entry || typeof entry !== "object") return null;
  // Legacy report-uri shape: { "csp-report": {...} }
  const r = entry["csp-report"] ?? entry.body ?? entry;
  if (!r || typeof r !== "object") return null;
  const directive = clean(r["effective-directive"] || r["violated-directive"] || r.effectiveDirective);
  const blocked = clean(r["blocked-uri"] || r.blockedURL);
  const doc = clean(r["document-uri"] || r.documentURL);
  return `directive=${directive} blocked=${blocked} doc=${doc}`;
}

export async function POST(req: NextRequest) {
  try {
    // Content-Length fast-reject before buffering (best-effort; platform also caps).
    const len = Number(req.headers.get("content-length") || 0);
    if (len > MAX_BODY) return new NextResponse(null, { status: 204 });
    const raw = await req.text();
    if (!raw || raw.length > MAX_BODY) return new NextResponse(null, { status: 204 });
    const parsed = JSON.parse(raw);
    // Reporting API sends an array of reports; report-uri sends a single object.
    const entries = (Array.isArray(parsed) ? parsed : [parsed]).slice(0, MAX_ENTRIES);
    for (const e of entries) {
      const line = summarize(e);
      if (line) console.warn(`[csp-report] ${line}`);
    }
  } catch {
    // Malformed report — ignore; never error a beacon.
  }
  return new NextResponse(null, { status: 204 });
}

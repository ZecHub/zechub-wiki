import { NextRequest, NextResponse } from "next/server";

// Same-origin proxy for CipherScan block lookups. CipherScan sends
// Cross-Origin-Resource-Policy: same-origin, so the browser cannot fetch it
// directly. Keep the response small — the upstream block payload includes
// every transaction.
const CIPHERSCAN = "https://api.mainnet.cipherscan.app/api/block";
const HEIGHT_RE = /^\d{1,8}$/;
const HASH_RE = /^[0-9a-f]{64}$/i;

function parseId(raw: string): string | null {
  const id = decodeURIComponent(raw).trim();
  if (HEIGHT_RE.test(id)) {
    const height = Number(id);
    if (!Number.isInteger(height) || height < 0) return null;
    return String(height);
  }
  if (HASH_RE.test(id)) return id.toLowerCase();
  return null;
}

function parseUnix(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 1e12 ? Math.floor(value / 1000) : Math.floor(value);
  }
  if (typeof value === "string" && /^-?\d+$/.test(value.trim())) {
    const n = Number(value.trim());
    if (!Number.isFinite(n)) return null;
    return n > 1e12 ? Math.floor(n / 1000) : n;
  }
  return null;
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (!id) {
    return NextResponse.json(
      { error: "Enter a block height or a 64-character block hash." },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${CIPHERSCAN}/${id}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return NextResponse.json(
      { error: "CipherScan did not respond." },
      { status: 502 },
    );
  }

  if (upstream.status === 404) {
    return NextResponse.json({ error: "Block not found." }, { status: 404 });
  }
  if (!upstream.ok) {
    return NextResponse.json(
      { error: `CipherScan returned ${upstream.status}.` },
      { status: 502 },
    );
  }

  const body = await upstream.json().catch(() => null);
  const timestamp = parseUnix(body?.timestamp ?? body?.time);
  const height = Number(body?.height);
  const hash = typeof body?.hash === "string" ? body.hash : null;

  if (timestamp == null || !Number.isInteger(height) || !hash) {
    return NextResponse.json(
      { error: "CipherScan returned an unexpected block payload." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      height,
      hash,
      timestamp,
      confirmations:
        typeof body?.confirmations === "number" ? body.confirmations : null,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    },
  );
}

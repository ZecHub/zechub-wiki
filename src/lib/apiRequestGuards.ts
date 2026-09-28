export const MAX_JSON_BODY_BYTES = 16 * 1024;

export type BoundedJsonBodyResult<T = unknown> =
  | { ok: true; body: T }
  | { ok: false; status: 400 | 413; error: string };

/**
 * Reads a request body as JSON, rejecting it before fully buffering when it
 * exceeds `maxBytes` (via Content-Length when present, and by aborting the
 * stream early otherwise) rather than relying on JSON.parse to fail after
 * the whole body has already been read into memory.
 */
export async function readBoundedJsonBody<T = unknown>(
  req: Request,
  maxBytes: number = MAX_JSON_BODY_BYTES,
): Promise<BoundedJsonBodyResult<T>> {
  const declaredLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { ok: false, status: 413, error: "Request body too large" };
  }

  if (!req.body) {
    return { ok: false, status: 400, error: "Missing request body" };
  }

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    if (value) {
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => {});
        return { ok: false, status: 413, error: "Request body too large" };
      }
      chunks.push(value);
    }
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (raw.length === 0) {
    return { ok: false, status: 400, error: "Missing request body" };
  }

  try {
    return { ok: true, body: JSON.parse(raw) as T };
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON body" };
  }
}

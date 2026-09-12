let lastKnownPrice = 0;
let lastUpdated = 0;
let src = "";

const UPSTREAM_TIMEOUT_MS = 5000;

/**
 * Fetches the current ZEC price. On any upstream failure (timeout,
 * non-2xx, invalid payload), falls back to the last known-good price so
 * transient upstream issues don't break every request; if no usable price
 * has ever been obtained, returns `price: 0` so callers can surface a 503
 * instead of a misleading successful zero/null result.
 */
export async function getZcashPrice(
  url: string,
  source = "",
): Promise<{ price: number; source: string }> {
  const now = Date.now();

  // Simple 60s cache to avoid multiply API hit
  if (now - lastUpdated < 60000 && lastKnownPrice > 0) {
    return { price: lastKnownPrice, source: src };
  }

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`Upstream price feed responded with ${res.status}`);
    }

    const { Price, Source } = await res.json();
    const price = Number(Price);

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("Upstream price feed returned an invalid price");
    }

    lastKnownPrice = price;
    lastUpdated = now;
    src = typeof Source === "string" ? Source : source;

    return { price: lastKnownPrice, source: src };
  } catch (err) {
    console.error("ZEC price fetch failed:", err);
    return { price: lastKnownPrice || 0, source: src || source };
  }
}

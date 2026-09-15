export const MAX_MEMO_BYTES = 512;

export function memoByteLength(message: string): number {
  return new TextEncoder().encode(message).length;
}

/** Encode UTF-8 text for a ZIP 321 memo, or reject an over-limit draft. */
export function encodeMemo(message: string): string | null {
  const bytes = new TextEncoder().encode(message);
  if (bytes.length > MAX_MEMO_BYTES) return null;

  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

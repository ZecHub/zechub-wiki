/** Strip tab/LF/CR and other controls that browsers remove during URL scheme parsing. */
export function normalizeUrl(value: string): string {
  return value.replace(/[\t\n\r\f\v\u0000-\u001F\u007F]/g, "").trim();
}

export function isScriptUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const n = normalizeUrl(value);
  return /^(javascript|vbscript):/i.test(n);
}

/** Positive allow-list for URL-bearing attributes after normalization. */
export function isAllowedUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const n = normalizeUrl(value);
  if (!n) return false;
  if (n.startsWith("#") || n.startsWith("/") || n.startsWith("./") || n.startsWith("../")) return true;
  return /^(https?|mailto):/i.test(n);
}

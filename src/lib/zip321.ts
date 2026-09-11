/**
 * ZIP 321: Payment Request URIs
 * Spec: https://zips.z.cash/zip-0321
 *
 * Enforces:
 * - Positive decimal amounts with at most 8 decimal places (zatoshi precision).
 * - Proper decimal formatting without scientific notation (e.g. 1e-8 -> "0.00000001").
 * - Rejection of negative amounts, zero amounts, and amounts exceeding max supply (21,000,000 ZEC).
 * - Base64url memo encoding without '=' padding.
 * - Strict 512-byte UTF-8 memo length limit.
 * - Rejection of memos attached to transparent addresses (t1, t3, tm).
 * - Single-recipient and multi-recipient (indexed) payment request generation and parsing.
 */

export const MAX_ZEC_SUPPLY = 21_000_000;
export const MAX_MEMO_BYTES = 512;
export const ZATOSHI_DECIMALS = 8;

export interface Zip321PaymentItem {
  address: string;
  amount?: number | string;
  memo?: string;
  label?: string;
  message?: string;
}

/**
 * Checks if a Zcash address is a transparent address (t1, t3, tm).
 */
export function isTransparentAddress(address: string): boolean {
  if (!address) return false;
  const trimmed = address.trim();
  return (
    trimmed.startsWith("t1") ||
    trimmed.startsWith("t3") ||
    trimmed.startsWith("tm")
  );
}

/**
 * Checks if a Zcash address supports shielded memos (Sapling, Unified, Sprout).
 */
export function isShieldedAddress(address: string): boolean {
  if (!address) return false;
  const trimmed = address.trim();
  return (
    trimmed.startsWith("zs") ||
    trimmed.startsWith("u1") ||
    trimmed.startsWith("utest1") ||
    trimmed.startsWith("ztestsapling") ||
    trimmed.startsWith("zc")
  );
}

/**
 * Formats a ZEC amount into a valid ZIP-321 decimal string.
 * Ensures no scientific notation (1e-8 -> 0.00000001), validates positive value,
 * max supply bound, and at most 8 decimal places.
 */
export function formatZecAmount(amount: number | string): string {
  if (amount === undefined || amount === null || amount === "") {
    throw new Error("Amount is required");
  }

  let str: string;
  if (typeof amount === "number") {
    if (isNaN(amount) || !isFinite(amount)) {
      throw new Error("Invalid amount: must be a finite number");
    }
    if (amount <= 0) {
      throw new Error("Invalid amount: must be greater than zero");
    }
    // Handle JavaScript floating-point scientific notation (e.g. 1e-8)
    // Convert to fixed string with 8 decimals, then trim trailing zeroes
    str = amount.toFixed(8);
  } else {
    str = amount.trim();
    if (/e/i.test(str)) {
      const num = Number(str);
      if (isNaN(num) || !isFinite(num) || num <= 0) {
        throw new Error("Invalid amount: must be greater than zero");
      }
      str = num.toFixed(8);
    }
  }

  // Validate decimal format: positive decimal number
  if (!/^\d+(\.\d+)?$/.test(str)) {
    throw new Error("Invalid amount format: must be a positive decimal number");
  }

  const parts = str.split(".");
  let intPart = parts[0];
  const fracPart = parts[1] || "";

  if (fracPart.length > ZATOSHI_DECIMALS) {
    throw new Error(
      `Invalid amount: exceeds maximum ${ZATOSHI_DECIMALS} decimal places (zatoshi precision)`,
    );
  }

  // Strip leading zeroes from integer part: "01" -> "1", "00" -> "0"
  intPart = intPart.replace(/^0+(?=\d)/, "") || "0";

  const numVal = parseFloat(`${intPart}${fracPart ? "." + fracPart : ""}`);
  if (numVal <= 0) {
    throw new Error("Invalid amount: must be greater than zero");
  }
  if (numVal > MAX_ZEC_SUPPLY) {
    throw new Error(
      `Invalid amount: exceeds maximum ZEC supply (${MAX_ZEC_SUPPLY})`,
    );
  }

  // Normalize: remove redundant trailing zeroes in fractional part, but keep whole number or needed decimals
  if (fracPart) {
    const trimmedFrac = fracPart.replace(/0+$/, "");
    return trimmedFrac ? `${intPart}.${trimmedFrac}` : intPart;
  }

  return intPart;
}

/**
 * Validates and encodes a memo string into base64url format without '=' padding per ZIP 321.
 * Throws if the memo is attached to a transparent address or exceeds 512 bytes.
 */
export function encodeZip321Memo(memo: string, address?: string): string {
  if (!memo) return "";

  if (address && isTransparentAddress(address)) {
    throw new Error(
      "Memos are not supported for transparent addresses in ZIP 321",
    );
  }

  const bytes = new TextEncoder().encode(memo);
  if (bytes.length > MAX_MEMO_BYTES) {
    throw new Error(
      `Memo exceeds ${MAX_MEMO_BYTES}-byte limit (actual: ${bytes.length} bytes)`,
    );
  }

  // Convert Uint8Array to binary string
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  // Base64url encode without padding
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decodes a ZIP-321 base64url encoded memo back to a UTF-8 string.
 */
export function decodeZip321Memo(encoded: string): string {
  if (!encoded) return "";

  let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) {
    b64 += "=";
  }

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new TextDecoder().decode(bytes);
}

/**
 * Validates a single ZIP-321 payment item.
 */
export function validateZip321Payment(payment: Zip321PaymentItem): {
  valid: boolean;
  error?: string;
} {
  if (!payment.address || !payment.address.trim()) {
    return { valid: false, error: "Address is required" };
  }

  if (payment.amount !== undefined && payment.amount !== null && payment.amount !== "") {
    try {
      formatZecAmount(payment.amount);
    } catch (err) {
      return {
        valid: false,
        error: err instanceof Error ? err.message : "Invalid amount",
      };
    }
  }

  if (payment.memo) {
    if (isTransparentAddress(payment.address)) {
      return {
        valid: false,
        error: "Memos are not supported for transparent addresses in ZIP 321",
      };
    }

    const bytes = new TextEncoder().encode(payment.memo);
    if (bytes.length > MAX_MEMO_BYTES) {
      return {
        valid: false,
        error: `Memo exceeds ${MAX_MEMO_BYTES}-byte limit (actual: ${bytes.length} bytes)`,
      };
    }
  }

  return { valid: true };
}

/**
 * Builds a ZIP-321 compliant URI from an array of payment items.
 * Supports single-recipient and multi-recipient requests.
 */
export function buildZip321Uri(payments: Zip321PaymentItem[]): string {
  if (!payments || payments.length === 0) {
    throw new Error("At least one payment item is required");
  }

  // Validate all payments
  for (let i = 0; i < payments.length; i++) {
    const validation = validateZip321Payment(payments[i]);
    if (!validation.valid) {
      throw new Error(`Recipient ${i + 1}: ${validation.error}`);
    }
  }

  // If single recipient: standard allows zcash:<address>?amount=... format or query-only format
  if (payments.length === 1) {
    const p = payments[0];
    const params = new URLSearchParams();

    if (p.amount !== undefined && p.amount !== null && p.amount !== "") {
      params.append("amount", formatZecAmount(p.amount));
    }
    if (p.label) {
      params.append("label", p.label);
    }
    if (p.message) {
      params.append("message", p.message);
    }
    if (p.memo) {
      params.append("memo", encodeZip321Memo(p.memo, p.address));
    }

    const qs = params.toString();
    return qs ? `zcash:${p.address}?${qs}` : `zcash:${p.address}`;
  }

  // Multi-recipient: index parameters (primary without suffix or with .0, subsequent with .1, .2, etc.)
  const params = new URLSearchParams();

  payments.forEach((p, i) => {
    const idx = i === 0 ? "" : `.${i}`;

    params.append(`address${idx}`, p.address);

    if (p.amount !== undefined && p.amount !== null && p.amount !== "") {
      params.append(`amount${idx}`, formatZecAmount(p.amount));
    }
    if (p.label) {
      params.append(`label${idx}`, p.label);
    }
    if (p.message) {
      params.append(`message${idx}`, p.message);
    }
    if (p.memo) {
      params.append(`memo${idx}`, encodeZip321Memo(p.memo, p.address));
    }
  });

  return `zcash:?${params.toString()}`;
}

/**
 * Parses a ZIP-321 compliant URI into an array of payment items.
 * Supports single-recipient (path address or query param) and multi-recipient (indexed) requests.
 */
export function parseZip321Uri(uri: string): Zip321PaymentItem[] {
  if (!uri || !uri.startsWith("zcash:")) {
    throw new Error("Invalid URI: must start with 'zcash:'");
  }

  const withoutScheme = uri.slice(6);
  const [pathPart, queryPart] = withoutScheme.split("?");

  const params = new URLSearchParams(queryPart || "");
  const paymentsMap = new Map<string, Partial<Zip321PaymentItem>>();

  // Path address is recipient 0 if present
  if (pathPart) {
    paymentsMap.set("0", { address: decodeURIComponent(pathPart) });
  }

  for (const [key, value] of params.entries()) {
    const dotIndex = key.indexOf(".");
    const paramName = dotIndex === -1 ? key : key.slice(0, dotIndex);
    const indexStr = dotIndex === -1 ? "0" : key.slice(dotIndex + 1);

    if (!paymentsMap.has(indexStr)) {
      paymentsMap.set(indexStr, {});
    }
    const item = paymentsMap.get(indexStr)!;

    if (paramName === "address") {
      item.address = value;
    } else if (paramName === "amount") {
      item.amount = formatZecAmount(value);
    } else if (paramName === "label") {
      item.label = value;
    } else if (paramName === "message") {
      item.message = value;
    } else if (paramName === "memo") {
      item.memo = decodeZip321Memo(value);
    }
  }

  // Sort by index numeric order (0, 1, 2...)
  const sortedIndices = Array.from(paymentsMap.keys()).sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    if (isNaN(numA)) return 1;
    if (isNaN(numB)) return -1;
    return numA - numB;
  });

  const result: Zip321PaymentItem[] = [];
  for (const idx of sortedIndices) {
    const p = paymentsMap.get(idx)!;
    if (!p.address) {
      throw new Error(`Recipient ${idx} is missing an address`);
    }
    const validation = validateZip321Payment(p as Zip321PaymentItem);
    if (!validation.valid) {
      throw new Error(`Recipient ${idx}: ${validation.error}`);
    }
    result.push(p as Zip321PaymentItem);
  }

  if (result.length === 0) {
    throw new Error("No payment items found in URI");
  }

  return result;
}


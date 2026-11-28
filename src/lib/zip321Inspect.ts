/**
 * ZIP 321 payment URI inspector.
 * Spec: https://zips.z.cash/zip-0321
 *
 * `parseZip321Uri` in ./zip321 is the strict parser the builder and widget use:
 * it stops at the first problem. This module answers a different question,
 * "what exactly does this URI ask a wallet to pay, and what is wrong with it?",
 * so it keeps going and reports every problem it finds, each tied to the
 * payment and parameter it came from. It follows the spec's ABNF grammar and
 * URI semantics, including the cases the spec lists as invalid examples:
 *
 * - percent-encoding outside label/message values (address, amount, names);
 * - `zcash://` (ZIP 321 URIs have no authority component);
 * - a paramindex with a leading zero, `.0`, or above 9999;
 * - a repeated parameter at the same index (including a path address that is
 *   repeated as `address=`);
 * - non-address parameters whose index has no address;
 * - amounts with grouping separators, no whole or fractional digits, more than
 *   8 decimals, or above 21,000,000 ZEC;
 * - memos that are not base64url (`+`, `/`, `=` must be rejected), longer than
 *   512 bytes, or attached to a transparent/TEX recipient;
 * - `req-asset` together with `amount`, on a non-unified address, or not
 *   base64url; any other `req-` parameter;
 * - Sprout addresses, and requests mixing mainnet and testnet addresses.
 *
 * It needs no network access and no WASM, so it runs the same in the browser
 * and in tests. Checksum validation of each address is left to the caller.
 */

import { MAX_MEMO_BYTES, MAX_ZEC_SUPPLY, ZATOSHI_DECIMALS, buildZip321Uri } from "./zip321";

export type Zip321AddressKind =
  | "transparent"
  | "tex"
  | "sapling"
  | "unified"
  | "sprout"
  | "unknown";

export type Zip321Network = "mainnet" | "testnet" | "regtest" | "unknown";

export interface Zip321Issue {
  level: "error" | "warning";
  message: string;
  /** Payment index the issue belongs to (0 = no paramindex). */
  index?: number;
  /** Parameter as written in the URI, e.g. "memo.1". */
  param?: string;
}

export interface Zip321InspectedMemo {
  /** base64url text exactly as it appears in the URI. */
  raw: string;
  /** Decoded length in bytes; the limit is 512. */
  bytes: number;
  /** The memo as UTF-8 text, when it is a ZIP 302 text memo. */
  text?: string;
  /** Hex of the decoded bytes, for memos that are not UTF-8 text. */
  hex?: string;
}

export interface Zip321InspectedAsset {
  raw: string;
  version: number;
  /** Amount in the asset's minimal units (version 0x00 only). */
  units?: string;
  /** Hex of the encoded ZIP 227 AssetId (version 0x00 only). */
  assetIdHex?: string;
}

export interface Zip321InspectedPayment {
  /** 0 for the payment without a paramindex, otherwise the paramindex. */
  index: number;
  address?: string;
  addressKind: Zip321AddressKind;
  network: Zip321Network;
  /** Normalised decimal ZEC amount, e.g. "050.500" -> "50.5". */
  amount?: string;
  zatoshis?: bigint;
  label?: string;
  message?: string;
  memo?: Zip321InspectedMemo;
  asset?: Zip321InspectedAsset;
  /** Parameters wallets ignore (not `req-`), kept so the user can see them. */
  other: { name: string; value?: string }[];
}

export interface Zip321Inspection {
  /** True when there are no errors; warnings do not make a URI invalid. */
  valid: boolean;
  payments: Zip321InspectedPayment[];
  issues: Zip321Issue[];
  network: Zip321Network | "mixed";
  /** Sum of all ZEC amounts, when every payment names one. */
  totalZatoshis?: bigint;
  /**
   * The same request as the Payment Request builder would write it, when that
   * builder can express it (ZEC only, text memos). Index numbers are
   * renumbered 1, 2, … in order, which does not change the meaning.
   */
  canonical?: string;
}

const ZATS_PER_ZEC = BigInt("1" + "0".repeat(ZATOSHI_DECIMALS));
const MAX_ZATOSHIS = BigInt(MAX_ZEC_SUPPLY) * ZATS_PER_ZEC;

const ADDRESS_CHARS = /^[A-Za-z0-9]+$/;
const PARAM_NAME = /^[A-Za-z][A-Za-z0-9+-]*$/;
const PARAM_INDEX = /^[1-9]\d{0,3}$/;
const AMOUNT = /^\d+(\.\d{1,8})?$/;
const BASE64URL = /^[A-Za-z0-9_-]*$/;
// RFC 3986 unreserved / pct-encoded, plus the ZIP 321 allowed-delims, ":" and "@".
const QCHARS = /^(?:[A-Za-z0-9\-._~!$'()*+,;:@]|%[0-9A-Fa-f]{2})*$/;

/** Classifies an address by its human-readable prefix. */
export function classifyZip321Address(address: string): {
  kind: Zip321AddressKind;
  network: Zip321Network;
} {
  const a = address.trim();
  const rules: [string, Zip321AddressKind, Zip321Network][] = [
    ["uregtest1", "unified", "regtest"],
    ["utest1", "unified", "testnet"],
    ["u1", "unified", "mainnet"],
    ["zregtestsapling1", "sapling", "regtest"],
    ["ztestsapling1", "sapling", "testnet"],
    ["zs1", "sapling", "mainnet"],
    ["texregtest1", "tex", "regtest"],
    ["textest1", "tex", "testnet"],
    ["tex1", "tex", "mainnet"],
    ["t1", "transparent", "mainnet"],
    ["t3", "transparent", "mainnet"],
    ["tm", "transparent", "testnet"],
    ["t2", "transparent", "testnet"],
    ["zc", "sprout", "mainnet"],
    ["zt", "sprout", "testnet"],
  ];
  for (const [prefix, kind, network] of rules) {
    if (a.startsWith(prefix)) return { kind, network };
  }
  return { kind: "unknown", network: "unknown" };
}

/** Parses a ZIP 321 amount string to zatoshis without going through floats. */
export function zip321AmountToZatoshis(amount: string): bigint {
  const [whole, fraction = ""] = amount.split(".");
  return BigInt(whole) * ZATS_PER_ZEC + BigInt(fraction.padEnd(ZATOSHI_DECIMALS, "0") || "0");
}

/** Formats zatoshis as a decimal ZEC string with no trailing zeros. */
export function formatZatoshis(zats: bigint): string {
  const whole = zats / ZATS_PER_ZEC;
  const fraction = (zats % ZATS_PER_ZEC).toString().padStart(ZATOSHI_DECIMALS, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

function base64UrlToBytes(value: string): Uint8Array | null {
  if (value.length % 4 === 1) return null;
  let b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) b64 += "=";
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

/**
 * ZIP 302: a memo whose first byte is 0xF5..0xFF is not text; a text memo is
 * UTF-8, and trailing zero padding is not part of it.
 */
function describeMemo(raw: string, bytes: Uint8Array): Zip321InspectedMemo {
  const memo: Zip321InspectedMemo = { raw, bytes: bytes.length };
  if (bytes.length > 0 && bytes[0] >= 0xf5) {
    memo.hex = toHex(bytes);
    return memo;
  }
  let end = bytes.length;
  while (end > 0 && bytes[end - 1] === 0) end--;
  try {
    memo.text = new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, end));
  } catch {
    memo.hex = toHex(bytes);
  }
  return memo;
}

function describeAsset(raw: string, bytes: Uint8Array): Zip321InspectedAsset {
  const asset: Zip321InspectedAsset = { raw, version: bytes[0] };
  if (bytes[0] === 0 && bytes.length > 9) {
    let units = BigInt(0);
    for (let i = 8; i >= 1; i--) units = (units << BigInt(8)) | BigInt(bytes[i]);
    asset.units = units.toString();
    asset.assetIdHex = toHex(bytes.subarray(9));
  }
  return asset;
}

interface RawParam {
  name: string;
  /** Parameter as written, for messages. */
  key: string;
  index: number;
  value?: string;
}

/** Inspects a ZIP 321 payment request URI and reports every problem in it. */
export function inspectZip321Uri(input: string): Zip321Inspection {
  const issues: Zip321Issue[] = [];
  const error = (message: string, index?: number, param?: string) =>
    issues.push({ level: "error", message, index, param });
  const warn = (message: string, index?: number, param?: string) =>
    issues.push({ level: "warning", message, index, param });

  const result = (payments: Zip321InspectedPayment[]): Zip321Inspection => {
    const networks = new Set(payments.map((p) => p.network).filter((n) => n !== "unknown"));
    const network = networks.size > 1 ? "mixed" : (networks.values().next().value ?? "unknown");
    if (network === "mixed") {
      error(`The request mixes ${Array.from(networks).join(" and ")} addresses; a wallet can only pay one network.`);
    }
    const valid = !issues.some((i) => i.level === "error");
    const zecPayments = payments.filter((p) => !p.asset);
    const totalZatoshis =
      zecPayments.length > 0 && zecPayments.every((p) => p.zatoshis !== undefined)
        ? zecPayments.reduce((sum, p) => sum + (p.zatoshis as bigint), BigInt(0))
        : undefined;
    let canonical: string | undefined;
    if (valid && payments.every((p) => !p.asset && (!p.memo || p.memo.text !== undefined))) {
      try {
        canonical = buildZip321Uri(
          payments.map((p) => ({
            address: p.address as string,
            amount: p.amount,
            label: p.label,
            message: p.message,
            memo: p.memo?.text,
          })),
        );
      } catch {
        // The builder is stricter than the spec (e.g. it refuses amount=0);
        // the URI can still be valid, it just has no builder form.
        canonical = undefined;
      }
    }
    return { valid, payments, issues, network, totalZatoshis, canonical };
  };

  const uri = input.trim();
  if (!uri) {
    error("Paste a zcash: payment URI to inspect it.");
    return result([]);
  }
  if (!/^zcash:/i.test(uri)) {
    error("A ZIP 321 URI starts with 'zcash:'.");
    return result([]);
  }
  const rest = uri.slice(6);
  if (rest.startsWith("//")) {
    error("'zcash://' is not allowed: ZIP 321 URIs have no authority component, write 'zcash:<address>'.");
    return result([]);
  }

  const q = rest.indexOf("?");
  const path = q === -1 ? rest : rest.slice(0, q);
  const query = q === -1 ? undefined : rest.slice(q + 1);
  if (!path && query === undefined) {
    error("The URI names no recipient: add an address after 'zcash:' or an 'address=' parameter.");
    return result([]);
  }

  const params: RawParam[] = [];
  if (path) params.push({ name: "address", key: "address (in the path)", index: 0, value: path });

  for (const pair of (query ?? "").split("&")) {
    if (!pair) continue;
    const eq = pair.indexOf("=");
    const key = eq === -1 ? pair : pair.slice(0, eq);
    const value = eq === -1 ? undefined : pair.slice(eq + 1);
    if (key.includes("%")) {
      error(`Parameter name '${key}' is percent-encoded; names must be written as plain text.`, undefined, key);
      continue;
    }
    const dot = key.indexOf(".");
    const name = dot === -1 ? key : key.slice(0, dot);
    const indexText = dot === -1 ? "" : key.slice(dot + 1);
    if (!PARAM_NAME.test(name)) {
      error(`'${key}' is not a valid parameter name.`, undefined, key);
      continue;
    }
    if (dot !== -1 && !PARAM_INDEX.test(indexText)) {
      error(
        `'${key}' has an invalid index: use 1-9999 with no leading zero (the first payment has no index).`,
        undefined,
        key,
      );
      continue;
    }
    params.push({ name, key, index: dot === -1 ? 0 : Number(indexText), value });
  }

  const seen = new Map<string, string>();
  const byIndex = new Map<number, RawParam[]>();
  for (const p of params) {
    const id = `${p.name}.${p.index}`;
    const first = seen.get(id);
    if (first) {
      error(`'${p.key}' repeats '${first}'; each parameter may appear once per payment.`, p.index, p.key);
      continue;
    }
    seen.set(id, p.key);
    if (!byIndex.has(p.index)) byIndex.set(p.index, []);
    byIndex.get(p.index)!.push(p);
  }

  const payments: Zip321InspectedPayment[] = [];
  for (const index of Array.from(byIndex.keys()).sort((a, b) => a - b)) {
    const group = byIndex.get(index)!;
    const payment: Zip321InspectedPayment = {
      index,
      addressKind: "unknown",
      network: "unknown",
      other: [],
    };
    payments.push(payment);

    const addressParam = group.find((p) => p.name === "address");
    if (!addressParam) {
      error(
        index === 0
          ? "Parameters without an index have no address: add 'address=' or put the address after 'zcash:'."
          : `Payment ${index} has parameters but no 'address.${index}='.`,
        index,
      );
    } else if (!addressParam.value) {
      error("The address is empty.", index, addressParam.key);
    } else if (addressParam.value.includes("%")) {
      error("The address is percent-encoded; addresses must be written as plain text.", index, addressParam.key);
    } else if (!ADDRESS_CHARS.test(addressParam.value)) {
      error("The address contains characters no Zcash address uses.", index, addressParam.key);
    } else {
      payment.address = addressParam.value;
      const { kind, network } = classifyZip321Address(payment.address);
      payment.addressKind = kind;
      payment.network = network;
      if (kind === "sprout") {
        error("Sprout addresses must not be used in payment requests (ZIP 321, ZIP 211).", index, addressParam.key);
      } else if (kind === "unknown") {
        warn("Unrecognised address format; check it with the Address Decoder.", index, addressParam.key);
      }
    }

    const memoForbidden = payment.addressKind === "transparent" || payment.addressKind === "tex";

    for (const p of group) {
      const value = p.value ?? "";
      switch (p.name) {
        case "address":
          break;
        case "amount": {
          if (value.includes("%")) {
            error("The amount is percent-encoded; amounts must be plain digits.", index, p.key);
          } else if (!AMOUNT.test(value)) {
            error(amountProblem(value), index, p.key);
          } else {
            const zats = zip321AmountToZatoshis(value);
            if (zats > MAX_ZATOSHIS) {
              error(`The amount is above the ${MAX_ZEC_SUPPLY.toLocaleString("en-US")} ZEC supply cap.`, index, p.key);
            } else {
              payment.zatoshis = zats;
              payment.amount = formatZatoshis(zats);
              if (zats === BigInt(0)) warn("The amount is zero; many wallets will not send it.", index, p.key);
            }
          }
          break;
        }
        case "memo": {
          if (memoForbidden) {
            error(
              "A memo is attached to a transparent address, which cannot carry one; ZIP 321 makes the whole URI invalid.",
              index,
              p.key,
            );
          }
          if (!BASE64URL.test(value)) {
            error(
              "The memo is not base64url: '+', '/' and '=' belong to plain base64 and must be rejected (use '-', '_' and no padding).",
              index,
              p.key,
            );
            break;
          }
          const bytes = base64UrlToBytes(value);
          if (!bytes) {
            error("The memo has a base64url length that cannot be decoded.", index, p.key);
            break;
          }
          if (bytes.length > MAX_MEMO_BYTES) {
            error(`The memo is ${bytes.length} bytes; the limit is ${MAX_MEMO_BYTES}.`, index, p.key);
          }
          payment.memo = describeMemo(value, bytes);
          break;
        }
        case "label":
        case "message": {
          const text = decodeQchar(value);
          if (text === null) {
            error(`The ${p.name} has characters that must be percent-encoded, or an invalid %-escape.`, index, p.key);
            break;
          }
          payment[p.name] = text;
          if (value.includes("+")) {
            warn(`'+' in the ${p.name} is a literal plus sign, not a space (a space is written %20).`, index, p.key);
          }
          break;
        }
        case "req-asset": {
          if (!BASE64URL.test(value)) {
            error("req-asset is not base64url.", index, p.key);
            break;
          }
          const bytes = base64UrlToBytes(value);
          if (!bytes || bytes.length === 0) {
            error("req-asset cannot be decoded.", index, p.key);
            break;
          }
          payment.asset = describeAsset(value, bytes);
          if (bytes[0] !== 0) {
            warn(`req-asset uses encoding version ${bytes[0]}, which this inspector does not know.`, index, p.key);
          } else if (!payment.asset.units) {
            error("req-asset is too short for version 0x00 (version, 8-byte amount, asset id).", index, p.key);
          }
          if (group.some((g) => g.name === "amount")) {
            error("'amount' and 'req-asset' cannot be used for the same payment.", index, p.key);
          }
          if (payment.address && payment.addressKind !== "unified") {
            error("Custom-asset payments need a Unified Address with an Orchard receiver.", index, p.key);
          }
          break;
        }
        default: {
          if (p.value !== undefined && decodeQchar(p.value) === null) {
            error(`The value of '${p.key}' has characters that must be percent-encoded.`, index, p.key);
          } else if (p.name.startsWith("req-")) {
            error(`'${p.key}' is a required parameter wallets do not know, so they must reject the URI.`, index, p.key);
          } else {
            payment.other.push({ name: p.key, value: p.value === undefined ? undefined : decodeQchar(p.value)! });
            warn(`'${p.key}' is not part of ZIP 321; wallets ignore it.`, index, p.key);
          }
        }
      }
    }
  }

  if (payments.length === 0) error("The URI names no recipient.");
  return result(payments);
}

function amountProblem(value: string): string {
  if (!value) return "The amount is empty.";
  if (value.includes(",")) return "The amount uses a comma; use '.' for decimals and no thousands separator.";
  if (value.startsWith(".")) return "The amount needs a whole number before the '.', e.g. 0.5.";
  if (value.endsWith(".")) return "The amount needs digits after the '.', or no '.' at all.";
  const fraction = /^\d+\.(\d+)$/.exec(value);
  if (fraction && fraction[1].length > ZATOSHI_DECIMALS) {
    return `The amount has ${fraction[1].length} decimals; ZEC has at most ${ZATOSHI_DECIMALS} (1 zatoshi).`;
  }
  return "The amount must be a plain decimal number such as 1 or 0.25.";
}

function decodeQchar(value: string): string | null {
  if (!QCHARS.test(value)) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

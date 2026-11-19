import { getName } from "@/lib/helpers";

const DUPLICATE_BASICS_TITLES: Record<string, string> = {
  zec_use_cases: "ZEC Use Cases",
  zcash_monetary_policy: "Zcash Monetary Policy",
};

// Manifest labels are plain text, rendered by React (never as HTML). Match the
// server manifest reader's nonblank-string contract even for direct callers.
const usableTitle = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

/** Prefer localized, then English, then filename labels regardless of length. */
export function getSideMenuLabel(
  item: string,
  titles: Record<string, string>,
  enTitles: Record<string, string>,
): string {
  const key = item.replace(/^site\//, "") + ".md";
  const titled = usableTitle(titles[key]) ?? usableTitle(enTitles[key]);
  // Preserve the existing workaround for two copied English H1s. A genuine
  // localized title must never be replaced by the English workaround.
  if (!titled || titled.toLowerCase() === "zcash basics") {
    const base = (key.split("/").pop() ?? "")
      .toLowerCase().replace(/-/g, "_").replace(/\.md$/, "");
    const fix = DUPLICATE_BASICS_TITLES[base];
    if (fix) return fix;
  }
  return titled ?? getName(item);
}

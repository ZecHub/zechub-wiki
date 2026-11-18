import { getName } from "@/lib/helpers";

// Two Start Here pages are headed "Zcash Basics" in the content repo (a copied title), so the manifest lists three
// entries with that name. Give the other two their own names.
const DUPLICATE_BASICS_TITLES: Record<string, string> = {
  zec_use_cases: "ZEC Use Cases",
  zcash_monetary_policy: "Zcash Monetary Policy",
};

// Display label of a menu item. `item` is the item path minus ".md" (e.g. "site/guides/Foo"); the manifest is keyed
// by the site-relative path with ".md". Fallback order: localized manifest -> English manifest -> filename-derived name.
export function menuLabelFor(
  item: string,
  titles: Record<string, string> = {},
  enTitles: Record<string, string> = {},
): string {
  const key = item.replace(/^site\//, "") + ".md";
  const titled = titles[key] ?? enTitles[key];
  const fromFile = getName(item);
  if (!titled || titled.trim().toLowerCase() === "zcash basics") {
    const base = (key.split("/").pop() ?? "").toLowerCase().replace(/-/g, "_").replace(/\.md$/, "");
    const fix = DUPLICATE_BASICS_TITLES[base];
    if (fix) return fix;
  }
  // Manifest titles are often the page H1 and wrap the sidebar, so prefer the short filename label when the title is much longer.
  if (titled && titled.length <= 36) return titled;
  return fromFile;
}

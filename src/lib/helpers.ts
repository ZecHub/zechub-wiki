import type { Metadata } from "next";

import { contentBanners } from "@/constants/contentBanners";
import { getRootCached } from "./authAndFetch";

// Stable @id for the ZecHub Organization node in schema.org structured data.
// The site-wide Organization JSON-LD (rendered in the locale layout) defines
// this node; per-page article JSON-LD references it as author/publisher so the
// graph links up within the same rendered document.
export const ORG_ID = "https://zechub.wiki/#organization";

// Default site description. Shared between genMetadata (page <meta>/OG fallback)
// and the article structured data so the two never drift.
export const SITE_DESCRIPTION =
  "The goal of ZecHub is to provide an educational platform where community members can work together on creating, validating, and promoting content that supports the Zcash & Privacy technology ecosystems.";

// Canonical origin, used to resolve site-relative asset paths (banners, covers)
// into the absolute URLs that structured data requires.
export const SITE_ORIGIN = "https://zechub.wiki";

// OpenGraph expects `og:locale` in `language_TERRITORY` form (e.g. `en_US`),
// not the bare BCP-47 language subtag used for hreflang. Map each routing
// locale to a sensible OG locale; anything unmapped falls back to bare-lower +
// UPPER (e.g. "xx" -> "xx_XX") which keeps genMetadata total (never throws).
// NOTE: hreflang (in `alternates.languages`) intentionally keeps the bare codes
// — that is correct there; only OpenGraph needs the territory form.
const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  it: "it_IT",
  fr: "fr_FR",
  es: "es_ES",
  de: "de_DE",
  pt: "pt_PT",
  ar: "ar_AR",
  zh: "zh_CN",
  hi: "hi_IN",
  ru: "ru_RU",
  ja: "ja_JP",
  ko: "ko_KR",
  tr: "tr_TR",
  uk: "uk_UA",
  sw: "sw_KE",
  yo: "yo_NG",
  ig: "ig_NG",
  ak: "ak_GH",
  ee: "ee_GH",
};

export const toOgLocale = (locale: string): string => {
  const mapped = OG_LOCALE_MAP[locale];
  if (mapped) return mapped;
  const base = (locale || "").toLowerCase().split(/[-_]/)[0];
  return base ? `${base}_${base.toUpperCase()}` : "en_US";
};

// Pass http(s) URLs through untouched; resolve everything else against the
// canonical origin as a site-root-relative path.
export const toAbsoluteUrl = (u: string): string =>
  /^https?:\/\//i.test(u)
    ? u
    : `${SITE_ORIGIN}${u.startsWith("/") ? "" : "/"}${u}`;

// Serialize an object as a JSON-LD payload safe to inline in a <script> tag.
// Escaping "<" as \u003c prevents a "</script>" sequence inside the data from
// breaking out of the element — Next.js's documented JSON-LD recommendation.
export const jsonLdScript = (obj: unknown): string =>
  JSON.stringify(obj).replace(/</g, "\\u003c");

export type ArticleMeta = {
  headline: string;
  description: string;
  datePublished?: string;
  image?: string;
};

// --- markdown line classifiers (used to skip non-prose leading lines) ---
const isBlankLine = (l: string) => /^\s*$/.test(l);
const isHeadingLine = (l: string) => /^\s*#{1,6}\s+/.test(l);
// Opening/closing HTML tag (covers the GitHub "Edit page" badge anchor/img).
const isHtmlLine = (l: string) => /^\s*<\/?[a-zA-Z!]/.test(l);
// Line that is only a markdown image/link or a bare URL — not real prose.
const isLinkOnlyLine = (l: string) =>
  /^\s*!?\[[^\]]*\]\([^)]*\)\s*$/.test(l) || /^\s*https?:\/\/\S+\s*$/.test(l);
// Horizontal rule (---, ***, ___).
const isHrLine = (l: string) => /^\s*([-*_])\1{2,}\s*$/.test(l);

// Strip inline markdown so a paragraph reads cleanly as a plain-text
// description: images dropped, links reduced to their text, emphasis/code
// markers removed, whitespace collapsed.
export const stripInlineMd = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Trim to a max length at a word boundary, appending an ellipsis when cut.
export const truncate = (s: string, max: number) => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s.,;:–—-]+$/, "")}…`;
};

// Strip markdown link/image title text and query fragments from a captured src.
const normalizeImageSrc = (raw: string): string =>
  raw.trim().split(/\s+/)[0]?.replace(/^["']|["']$/g, "") ?? "";

// Off-site og:image URLs must look like images; on-site paths are always OK.
const isUsableOgImage = (src: string): boolean => {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  if (src.startsWith(SITE_ORIGIN)) return true;
  return /\.(webp|png|jpe?g|gif|svg|avif)(\?|#|$)/i.test(src);
};

// Extract first image from markdown content
export function extractFirstContentImage(
  content: string,
  filePath?: string,
): string | null {
  const matches =
    content.match(/!\[[^\]]*\]\(([^)]+?)\)|<img[^>]+src=["']([^"']+)["']/g) ||
    [];
  for (const m of matches) {
    const single = m.match(
      /!\[[^\]]*\]\(([^)]+?)\)|<img[^>]+src=["']([^"']+)["']/,
    );
    if (!single) continue;
    const src = normalizeImageSrc(single[1] || single[2] || "");
    if (src && !/shields\.io|badge|edit/i.test(src) && isUsableOgImage(src)) {
      if (src.startsWith("http") || (src.startsWith("/") && !src.startsWith("//")))
        return src;
      if (filePath) {
        const dir = filePath.substring(0, filePath.lastIndexOf("/"));
        return `https://raw.githubusercontent.com/ZecHub/zechub/main/${dir}/${src}`;
      }
    }
  }
  return null;
}

// Section descriptions for directory index pages
const SECTION_DESCRIPTIONS: Record<string, string> = {
  "start-here":
    "Start your journey with Zcash. Essential guides, core concepts, and introductory resources for beginners.",
  "using-zcash":
    "Learn how to use Zcash for private digital payments, explore wallets, exchanges, and shielded transactions.",
  guides:
    "Step-by-step guides and technical walkthroughs for setting up nodes, mining, integrations, and tools on Zcash.",
  tutorials:
    "Practical hands-on tutorials and video guides for the Zcash ecosystem.",
  "zcash-tech":
    "Technical specifications, cryptography, zero-knowledge proofs (zk-SNARKs), and protocol architecture of Zcash.",
  "zcash-community":
    "Community initiatives, grants, global ambassadors, and grassroots projects supporting Zcash.",
  "zcash-organizations":
    "Key organizations advancing the Zcash ecosystem including Electric Coin Company, Zcash Foundation, and Zcash Community Grants.",
  "privacy-tools":
    "Curated privacy-preserving tools, secure operating systems, VPNs, and communications software.",
  "glossary-and-faqs":
    "Comprehensive glossary of Zcash terminology, acronyms, and frequently asked questions.",
  contribute:
    "How to contribute to ZecHub and the Zcash ecosystem — documentation, code, translation, and governance.",
  research:
    "Research articles, protocol analysis, and deep dives into zero-knowledge cryptography and privacy models.",
};

export const getSectionDescription = (section: string): string => {
  const normalized = section.toLowerCase().replace(/_/g, "-");
  return (
    SECTION_DESCRIPTIONS[normalized] ||
    `Explore ${section.replace(/[-_]/g, " ")} educational resources, guides, and documentation on ZecHub.`
  );
};

// Normalize a frontmatter date to an ISO string. A bare YYYY-MM-DD is kept as a
// date-only ISO value (no fabricated time); anything else is parsed and, only if
// valid, emitted as a full ISO timestamp. Unparseable → undefined (omit).
const toIsoDate = (v: string): string | undefined => {
  const dateOnly = /^(\d{4}-\d{2}-\d{2})/.exec(v);
  if (dateOnly) return dateOnly[1];
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
};

// Derive per-article structured-data fields from the page's markdown. Strips a
// leading YAML frontmatter block, skips non-prose leading lines (the GitHub
// "Edit page" badge, HTML, blank lines), takes the first ATX `# ` heading as the
// headline and the first prose paragraph as the description. `fallbackHeadline`
// (a slug-derived title) is used only when no H1 is present; `fallbackImage` (a
// representative og/banner path) is used only when frontmatter has no image.
export const extractArticleMeta = (
  markdown: string,
  fallbackHeadline: string,
  fallbackImage?: string,
  filePath?: string,
): ArticleMeta => {
  const src = markdown.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");

  // Leading YAML frontmatter: `--- ... ---` block of `key: value` scalars.
  const fm: Record<string, string> = {};
  let body = src;
  const fmMatch = /^---\n([\s\S]*?)\n---\n?/.exec(src);
  if (fmMatch) {
    for (const line of fmMatch[1].split("\n")) {
      const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line);
      if (kv) {
        fm[kv[1].toLowerCase()] = kv[2]
          .trim()
          .replace(/^["']|["']$/g, "")
          .trim();
      }
    }
    body = src.slice(fmMatch[0].length);
  }

  const lines = body.split("\n");

  // Headline: first ATX level-1 heading; fall back to the slug-derived title.
  let headline = fallbackHeadline;
  let h1Index = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = /^#\s+(.+?)\s*$/.exec(lines[i]);
    if (m) {
      headline = stripInlineMd(m[1]) || fallbackHeadline;
      h1Index = i;
      break;
    }
  }
  headline = truncate(headline, 110);

  // Description: first prose paragraph after the H1 (or from the top if no H1).
  let description = "";
  for (let i = h1Index + 1; i < lines.length; i++) {
    const l = lines[i];
    if (
      isBlankLine(l) ||
      isHeadingLine(l) ||
      isHtmlLine(l) ||
      isLinkOnlyLine(l) ||
      isHrLine(l)
    ) {
      continue;
    }
    description = truncate(stripInlineMd(l), 160);
    break;
  }

  const contentImage = extractFirstContentImage(body, filePath);

  const meta: ArticleMeta = {
    headline: fm.title ? truncate(stripInlineMd(fm.title), 110) : headline,
    description: fm.description
      ? truncate(stripInlineMd(fm.description), 160)
      : description || SITE_DESCRIPTION,
  };

  const dateRaw = fm.published || fm.date;
  if (dateRaw) {
    const iso = toIsoDate(dateRaw);
    if (iso) meta.datePublished = iso;
  }

  const imgRaw = normalizeImageSrc(
    fm.image || fm.cover || contentImage || (fallbackImage || "").trim(),
  );
  if (imgRaw && isUsableOgImage(imgRaw)) meta.image = toAbsoluteUrl(imgRaw);

  return meta;
};

type MetadataOpts = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  // Locale being rendered. When set, emitted as `openGraph.locale` so the OG
  // card advertises the correct language.
  locale?: string;
  type?: "website" | "article";
  // Head-level canonical + hreflang alternates (from buildAlternates). Passed
  // through untouched when provided.
  alternates?: Metadata["alternates"];
};

export const genMetadata = ({
  title,
  description,
  image,
  url,
  locale,
  type = "website",
  alternates,
}: MetadataOpts): Metadata => {
  const defaultImage = "/content-banners/bannertech.jpg";
  const defaultUrl = "https://zechub.wiki";
  const defaultTitle = "ZecHub Wiki";
  const defaultDescription = SITE_DESCRIPTION;

  const resolvedTitle = title || defaultTitle;
  const resolvedDescription = description || defaultDescription;
  const resolvedImage = image || defaultImage;
  const resolvedUrl = url || defaultUrl;

  return {
    metadataBase: new URL("https://zechub.wiki"),
    title: resolvedTitle,
    description: resolvedDescription,
    ...(alternates ? { alternates } : {}),
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      images: resolvedImage,
      siteName: "ZecHub Wiki",
      type,
      url: resolvedUrl,
      ...(locale ? { locale: toOgLocale(locale) } : {}),
    },
    twitter: {
      title: resolvedTitle,
      card: "summary_large_image",
      description: resolvedDescription,
      images: [resolvedImage],
      site: "@ZecHub",
    },
  };
};

export const getName = (item: string) => {
  const newItem = transformUri(item.substring(item.lastIndexOf("/") + 1), true);
  const newFolder = newItem.split("_").join(" ");
  if (newFolder === "Glossary And FAQs") {
    return `Glossary & FAQ's`;
  } else {
    return newFolder;
  }
};

export const getDynamicRoute = (slug: string[]): string => {
  const uri = "/" + slug.join("/");

  return uri === "/contribute/community-infrastructure"
    ? `/site/contribute/Community_Infrastructure.md`
    : `/site${transformUri(uri)}.md`;
};

const normSlugSegment = (s: string) => s.toLowerCase().replace(/[-_ ]/g, "");

/**
 * Resolve a research article's content-repo path from a slug plus the fetched
 * directory listing under site/Research. Shared by page.tsx (render +
 * generateMetadata) so the fuzzy filename match and fallback stay in one place.
 */
export function resolveResearchArticleContentUrl(
  slug: string[],
  roots: string[],
): string {
  const lastSegment = slug[slug.length - 1];
  const target = normSlugSegment(lastSegment);
  const match = roots.find((r: string) => {
    if (typeof r !== "string" || !r.endsWith(".md")) return false;
    const base = r.split("/").pop()!.replace(/\.md$/i, "");
    return normSlugSegment(base) === target;
  });
  if (match) return match;
  return `site/Research/${slug.slice(1).join("/")}.md`;
}

/**
 * Resolve the content-repo markdown path a wiki page actually renders from, for
 * a given URL slug. This is the PURE (no next/cache, no React, no network)
 * counterpart of the content-path resolution in
 * src/app/[locale]/[...slug]/page.tsx, so build-time scripts
 * (scripts/generate-llms-txt.mjs) and API routes (src/app/api/content-md) fetch
 * exactly what the HTML page fetches.
 *
 * PARITY — keep in sync with page.tsx (getDynamicRoute default plus
 * resolveResearchArticleContentUrl when a directory listing is available).
 * Nested research-series articles preserve slug casing/hyphens; top-level
 * research articles fuzzy-match against roots in page.tsx via
 * resolveResearchArticleContentUrl().
 */
export const resolveContentPath = (slug: string[]): string => {
  const isResearchArticle = slug[0] === "research" && slug.length > 1;
  const isResearchSeries =
    slug.length === 2 &&
    slug[0] === "research" &&
    slug[1] === "zcash-foundations-series";

  if (isResearchArticle && !isResearchSeries && slug.length > 2) {
    return resolveResearchArticleContentUrl(slug, []);
  }

  return getDynamicRoute(slug);
};

export const getFiles = (data: any) => {
  return data.filter((e: any) => e.path).map((element: any) => element.path);
};

export const getFolders = (folder: string[]) => {
  return folder.filter((st: string) => !st.endsWith(".md"));
};

export const firstFileForFolders = async (folders: string[]) => {
  let files: string[] = [""];
  for (let i = 0; i <= folders.length; i++) {
    const res = await getRootCached(folders[i]);
    files.push(res[0]);
  }
  return files;
};

export const getBanner = (name: string) => {
  const transformedName = transformUri(name);
  const banner = contentBanners.find(
    (banner) => banner.name === transformedName,
  );

  return banner ? banner.url : "";
};

const uppercaseWords = [
  "Zec",
  "Dex",
  "Nft",
  "Zcap",
  "Zfav",
  "Snarks",
  "Frost",
  "2fa",
  "Pgp",
  "I2p",
  "Dao",
];
const lowercaseWords = [
  "Guides",
  "Tutorials",
  "Contribute",
  "In",
  "The",
  "Vs",
  "And",
  "Is",
  "Zk",
];
const specialWordsMap = {
  Non_Custodial: "Non-Custodial",
  Zero_Knowledge: "Zero-Knowledge",
  Defi: "DeFi",
  "Glossary And FAQs": `Glossary & FAQ's`,
  Z2z: "z2z",
  Faq: "FAQ",
  ZECHub: "ZecHub",
  ZEChub: "ZecHub",
  // After whole-segment rules, "Zec" no longer rewrites inside ZecHub /
  // ZecWeekly. Map the remaining mixed-case forms to the on-disk names.
  Zechub: "ZecHub",
  Zecweekly: "ZecWeekly",
  Av_Club: "AV_Club",
  guides_For_Creators: "Guides_for_Creators",
  Grapheneos: "GrapheneOS",
  Vpn: "VPN",
  Dvpn: "DVPN",
  zk_Shielded: "ZK_Shielded",
  ZECweekly: "ZecWeekly",
  ZECWeekly: "ZecWeekly",
  Help_Build_ZecHub: "Help_build_ZecHub",
  zkool_Multisig: "Zkool_Multisig",
  Zenith_installation: "Zenith_Installation",
  Raspberry_Pi5_Zebra_Lightwalletd_Zingo:
    "Raspberry_pi5_Zebra_Lightwalletd_Zingo",
  Btcpayserver_Zcash_Plugin: "BTCPayServer_Zcash_Plugin",
  Uris: "URIs",
  Free2z_Livestreaming: "Free2Z_Livestreaming",
  Avalanche_Redbridge: "Avalanche_RedBridge",
  Raspberry_Pi_4_Full_Node: "Raspberry_Pi_4_Full_Node",
  Raspberry_Pi_4_Zebra_Node: "Raspberry_pi_4_Zebra_Node",
  Coinholder_Directed_Retroactive_Grants:
    "CoinHolder_Directed_Retroactive_Grants",
  zkav: "ZKAV",
};

/**
 * Apply a word list only to whole path segments.
 *
 * Segments are bounded by start/end of string, `/`, or `_`. This prevents
 * prefix collisions such as "Zec" matching inside "Zecmap" / "ZecHub" (which
 * previously rewrote Zecmap → ZECmap and 404'd the content lookup).
 */
function replaceWholeSegments(
  input: string,
  word: string,
  replacement: string,
): string {
  const re = new RegExp(`(^|[_/])${word}(?=[_/]|$)`, "g");
  return input.replace(re, (_m, boundary: string) => boundary + replacement);
}

export const transformUri = (uri: string, ignoreLowerCase = false) => {
  let transformed = uri
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/-/g, "_");

  if (!ignoreLowerCase) {
    lowercaseWords.forEach((word) => {
      transformed = replaceWholeSegments(transformed, word, word.toLowerCase());
    });
  }
  uppercaseWords.forEach((word) => {
    transformed = replaceWholeSegments(transformed, word, word.toUpperCase());
  });
  Object.entries(specialWordsMap).forEach(([word, targetWord]) => {
    if (transformed.includes(word))
      transformed = transformed.replaceAll(word, targetWord);
  });
  return transformed;
};

export const transformGithubFilePathToWikiLink = (path: string) => {
  return path
    .replace("site/", "")
    .replace(/\w/g, (l) => l.toLowerCase())
    .replace(/_/g, "-");
};

export const formatString = {
  titleCase: (txt: string) => {
    return txt[0].toUpperCase() + txt.slice(1);
  },
  removeUnderscore: (str: string) => {
    return str.split("_").join(" ");
  },
  /**
   * The function wrap a sentence at particular length of characters
   * @param txt The sentence body
   * @param wrapAfter The number of characters to start
   * @returns The wrapped sentence
   */
  wordWrap: (txt: string, wrapAfter: number) => {
    txt = txt.trim();
    if (txt.length > wrapAfter) {
      return txt.slice(0, wrapAfter) + "...";
    }

    return txt;
  },
};

// Function to format number with commas
export const formatNumber = (n: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(n);

export const formatCurrencyToUSD = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

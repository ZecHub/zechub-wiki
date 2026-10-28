import MdxContainer from "@/components/MdxContainer";
import { rewriteMetamaskSnap } from "@/lib/pageOverrides/metamaskSnap";
import ResearchIndexGrid from "@/components/Research/ResearchIndexGrid";
import SideMenu from "@/components/SideMenu/SideMenu";
import { Link } from "@/i18n/navigation";
import { isKnownContentPath } from "@/lib/contentPaths";
import {
  getFileContentCached,
  getLocalizedFileContentCached,
  getRootCached,
  getAllMarkdownRecursively,
  getSiteFolders,
  getMenuTitlesCached,
} from "@/lib/authAndFetch";
import {
  genMetadata,
  getBanner,
  getDynamicRoute,
  transformUri,
  transformGithubFilePathToWikiLink,
  ORG_ID,
  extractArticleMeta,
  extractFirstContentImage,
  getSectionDescription,
  jsonLdScript,
  resolveResearchArticleContentUrl,
} from "@/lib/helpers";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { buildAlternates, localesForPath } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { normalizeMdx, normalizeResearchMdx } from "@/lib/normalizeMdx";
import { getDictionary } from "@/lib/getDictionary";
import {
  RESEARCH_SERIES,
  getResearchSeries,
  isResearchSeriesPath,
  isResearchSeriesSlug,
} from "@/constants/researchSeries";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { visit, SKIP } from "unist-util-visit";

// Defense-in-depth: content markdown is rendered via rehypeRaw (raw HTML
// passthrough) with no allow-list sanitizer, so a malicious content-repo change
// could otherwise inject executable markup. Strip the direct XSS vectors —
// <script>/<style> elements, on* event-handler attributes, and javascript: URLs.
// (A full allow-list sanitizer or nonce-based CSP is the complete fix; this
// closes the obvious holes without risking removal of legitimate content HTML.)
function rehypeStripDangerous() {
  return (tree: any) => {
    (visit as any)(tree, "element", (node: any, index: number | undefined, parent: any) => {
      if (
        (node.tagName === "script" || node.tagName === "style") &&
        parent &&
        typeof index === "number"
      ) {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
      const props = node.properties || {};
      for (const key of Object.keys(props)) {
        const k = key.toLowerCase();
        // Event handlers, and attributes that can carry an executable document
        // (srcdoc) or override a form's action to a script URL (formaction).
        if (k.startsWith("on") || k === "srcdoc" || k === "formaction") {
          delete props[key];
          continue;
        }
        // Script-executing URL schemes on any URL-bearing attribute.
        const v = props[key];
        if (
          ["href", "src", "xlinkhref", "action", "poster"].includes(k) &&
          typeof v === "string" &&
          /^\s*(javascript|vbscript):/i.test(v)
        ) {
          delete props[key];
        }
      }
    });
  };
}

// Content HTML such as <p><a><p>…</p></a></p> nests a paragraph inside a
// paragraph, which is invalid HTML and makes React throw a hydration error
// ("<p> cannot be a descendant of <p>"). A <p> found inside another <p> is
// turned into a block <span> (same spacing, valid inside a paragraph).
function rehypeFlattenNestedParagraphs() {
  return (tree: any) => {
    const walk = (node: any, inParagraph: boolean) => {
      let inside = inParagraph;
      const isElement = node.type === "element" && node.tagName === "p";
      const isJsx =
        (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
        node.name === "p";
      if (isElement || isJsx) {
        if (inParagraph) {
          if (isElement) {
            const props = node.properties || {};
            const cls = Array.isArray(props.className) ? props.className : [];
            node.tagName = "span";
            node.properties = { ...props, className: [...cls, "block", "my-5"] };
          } else {
            node.name = "span";
            node.attributes = [
              ...(node.attributes || []),
              { type: "mdxJsxAttribute", name: "className", value: "block my-5" },
            ];
          }
        } else {
          inside = true;
        }
      }
      if (Array.isArray(node.children)) {
        for (const child of node.children) walk(child, inside);
      }
    };
    walk(tree, false);
  };
}

// Presentation hints for common wiki patterns, derived from the markdown
// itself so contributors don't need to write HTML:
//  - the list right after a "TL;DR" / "Common Mistakes" / "Related Pages"
//    heading gets a data-variant (summary card / warning card / link cards)
//  - a paragraph that is only **[Label](url)** becomes a call-to-action button
//  - a paragraph that is only a [Link](url) becomes a titled entry link
function rehypeWikiPatterns(opts: { pools?: boolean; prq?: boolean; ncex?: boolean; snap?: boolean; sol?: boolean; swap?: boolean; tnet?: boolean; txn?: boolean; ua?: boolean; mine?: boolean; zal?: boolean; uc?: boolean; ucHub?: boolean; compact?: boolean; boldLinkButtons?: boolean; videoCards?: boolean; sectionHeadings?: boolean; faucets?: boolean; recovery?: boolean; memos?: boolean; tex?: boolean; comm?: boolean; cz?: boolean; gov?: boolean; zcap?: boolean; sec?: boolean; eo?: boolean; amb?: boolean; media?: boolean; pod?: boolean; zcon?: boolean | string; node?: boolean; rpi5?: boolean; rpi4z?: boolean; hz?: boolean; akash?: boolean; akashBtn?: boolean; akashz?: boolean; mig?: boolean; mstake?: boolean; wb?: boolean; nym?: boolean; nymvpn?: boolean; defi?: boolean; vrel?: boolean; vkx?: boolean; vaddr?: boolean; vnet?: boolean; yfrost?: boolean; dtool?: boolean; zips?: boolean; nrpc?: boolean; zenith?: boolean; zkdecoy?: boolean; zgo?: boolean; z3zaino?: boolean; zkool?: boolean; btcpay?: boolean; maya?: boolean; redbridge?: boolean; shapeshift?: boolean; free2z?: boolean; usezec?: boolean; keystone?: boolean; brave?: boolean; explorers?: boolean } = {}) {
  const textOf = (n: any): string =>
    n.type === "text" ? n.value : (n.children || []).map(textOf).join("");
  const variantFor = (heading: string): string | null => {
    const h = heading.trim().toLowerCase();
    if (/^tl;?\s?dr\b|^summary$|^key takeaways$/.test(h)) return "tldr";
    if (/mistake|pitfall|warning|things to avoid/.test(h)) return "warn";
    if (/^related|^see also|^next steps|^resources$/.test(h)) return "related";
    return null;
  };
  const isBlank = (n: any) => n.type === "text" && !n.value.trim();
  const onlyChild = (n: any) => {
    const kids = (n.children || []).filter((c: any) => !isBlank(c));
    return kids.length === 1 ? kids[0] : null;
  };
  return (tree: any) => {
    // The community server is just "Zcash Discord" now: rename it everywhere in wiki content (text, link labels, titles).
    const renameDiscord = (n: any) => {
      if (!n || typeof n !== "object") return;
      if (n.type === "text" && typeof n.value === "string") n.value = n.value.replace(/\b(?:Zcash Global|Global Zcash) Discord\b/gi, "Zcash Discord");
      for (const at of n.attributes || []) {
        if (typeof at.value === "string") at.value = at.value.replace(/\b(?:Zcash Global|Global Zcash) Discord\b/gi, "Zcash Discord");
      }
      for (const k of ["title", "alt", "ariaLabel"]) {
        if (n.properties && typeof n.properties[k] === "string") n.properties[k] = n.properties[k].replace(/\b(?:Zcash Global|Global Zcash) Discord\b/gi, "Zcash Discord");
      }
      (n.children || []).forEach(renameDiscord);
    };
    renameDiscord(tree);
    const stepCount = { n: 0, leadDone: false };
    if (opts.pools && Array.isArray(tree.children)) {
      // Shielded pools guide: shortcuts, numbered sections, status pills, framed charts and a
      // four-way comparison of the transfer types.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const isHead = (x: any) => isEl(x) && /^h[1-6]$/.test(x.tagName);
      const hIdx = (re: RegExp) => rows.findIndex((x) => isHead(x) && re.test(textOf(x).trim()));

      // 0. Pool sections arrive as one-item numbered lists wrapping a heading ("1. ### Ironwood Pool");
      //    unwrap them so the headings and their text sit at the top level, and style figure captions.
      for (let q = 0; q < rows.length; q++) {
        const r = rows[q];
        if (isEl(r, "ol")) {
          const lis = (r.children || []).filter((c: any) => !isBlank(c));
          if (lis.length === 1 && isEl(lis[0], "li")) {
            const inner = (lis[0].children || []).filter((c: any) => !isBlank(c)).map((c: any) =>
              c.type === "mdxJsxFlowElement" && /^h[1-6]$/.test(c.name || "")
                ? { type: "element", tagName: c.name, properties: {}, children: c.children || [] }
                : c,
            );
            if (inner.length && isHead(inner[0])) {
              rows.splice(q, 1, ...inner);
              q--;
              continue;
            }
          }
        }
        if (isEl(r, "p") && /^fig \d+:/i.test(textOf(r).trim())) {
          rows[q] = { type: "element", tagName: "div", properties: { className: ["-mt-2", "mb-6", "text-sm", "text-slate-500", "dark:text-slate-400"] }, children: r.children };
        }
      }

      // 1. Transfer types: one card per route.
      const tp = hIdx(/^pool transfer recommended practice/i);
      if (tp > -1) {
        let end = tp + 1;
        while (end < rows.length && !isHead(rows[end])) end++;
        const defs: [RegExp, string, string][] = [
          [/^transaction occurring between "?z to z"?/i, "1", "z → z: fully shielded"],
          [/^when you send zec from "?z-address"? to "?t-address/i, "2", "z → t: deshielding"],
          [/^transferring zec from a transparent address/i, "3", "t → z: shielding"],
          [/^sending zec from a transparent address .* to another transparent/i, "4", "t → t: public"],
        ];
        const items: any[] = [];
        const intro: any[] = [];
        for (const r of rows.slice(tp + 1, end)) {
          if (isEl(r, "hr") || isBlank(r)) continue;
          const t = isEl(r, "p") ? textOf(r).trim() : "";
          const d = defs.find((x) => x[0].test(t));
          if (d) items.push({ type: "element", tagName: "pointitem", properties: { n: d[1], title: d[2] }, children: [r] });
          else if (items.length && isEl(r, "p")) items[items.length - 1].children.push(r);
          else intro.push(r);
        }
        if (items.length === 4) rows.splice(tp + 1, end - tp - 1, ...intro, { type: "element", tagName: "pointlist", properties: {}, children: items });
      }

      // 2. Shortcuts after the TL;DR.
      const un = hIdx(/^understanding zcash value pools/i);
      if (un > -1) {
        const items = [
          { label: "The five pools", hint: "What each one is", href: "#understanding-zcash-value-pools" },
          { label: "Ironwood", hint: "The current pool", href: "#ironwood-pool" },
          { label: "Moving funds", hint: "z→z, shielding, public", href: "#pool-transfer-recommended-practice" },
          { label: "Migration", hint: "Orchard to Ironwood", href: "#the-orchard-to-ironwood-migration" },
        ];
        rows.splice(un, 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items) }, children: [] });
      }

      // 3. Main sections numbered; each pool heading gets a status pill.
      const PILLS: Record<string, [string, string]> = {
        "ironwood pool": ["Current", "brand"],
        "orchard pool": ["Spend-only", "amber"],
        "sapling pool": ["Active", "green"],
        "sprout pool": ["Retired", "slate"],
        "transparent pool": ["Public", "slate"],
      };
      let n = 0;
      for (const r of rows) {
        if (isEl(r, "h2")) {
          if (!/^tl;?\s?dr|^common mistakes|^related pages/i.test(textOf(r).trim())) {
            n += 1;
            r.properties = { ...(r.properties || {}), dataStep: String(n) };
          }
        } else if (isEl(r, "h3")) {
          const pill = PILLS[textOf(r).trim().toLowerCase()];
          if (pill) r.properties = { ...(r.properties || {}), dataPill: pill[0], dataTone: pill[1] };
        } else if (isEl(r, "img") || (isEl(r, "p") && (r.children || []).some((c: any) => isEl(c, "img")))) {
          const img = isEl(r, "img") ? r : (r.children || []).find((c: any) => isEl(c, "img"));
          img.properties = { ...(img.properties || {}), dataFrame: "true" };
        }
      }
    }
    if (opts.prq && Array.isArray(tree.children)) {
      // Payment request URIs: themed buttons, shortcuts, numbered sections and hairlines between subsections.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const hrefOf = (x: any): string => {
        if (x.properties && x.properties.href != null) return String(x.properties.href);
        const hit = (x.attributes || []).find((at: any) => at.name === "href");
        return hit && typeof hit.value === "string" ? hit.value : "";
      };
      const hasHref = (x: any, h: string): boolean =>
        !!x && typeof x === "object" && ((["a"].includes(x.tagName || x.name) && hrefOf(x) === h) || (x.children || []).some((c: any) => hasHref(c, h)));

      // 1. The two inline-styled call-to-action links become theme buttons (wherever they are nested).
      const swapButtons = (parent: any): boolean => {
        const ch = parent.children || [];
        for (let q = 0; q < ch.length; q++) {
          const c = ch[q];
          if (c && (c.type === "element" || c.type === "mdxJsxFlowElement") && (c.tagName || c.name) === "div" && hasHref(c, "/zcash-payment-uri") && hasHref(c, "/tools")) {
            ch[q] = {
              type: "element",
              tagName: "div",
              properties: { className: ["flex", "flex-wrap", "gap-x-3"] },
              children: [
                { type: "element", tagName: "linkbutton", properties: { href: "/zcash-payment-uri", label: "Open payment widget" }, children: [] },
                { type: "element", tagName: "linkbutton", properties: { href: "/tools", label: "Build a payment request" }, children: [] },
              ],
            };
            return true;
          }
          if (c && c.children && swapButtons(c)) return true;
        }
        return false;
      };
      swapButtons(tree);

      // 2. Shortcuts above "Core Explanation".
      const ce = rows.findIndex((x) => isEl(x, "h2") && /^core explanation/i.test(textOf(x).trim()));
      if (ce > -1) {
        const items = [
          { label: "What it is", hint: "A zcash: link", href: "#core-explanation" },
          { label: "URI format", hint: "Fields and encoding", href: "#anatomy" },
          { label: "Embed on a site", hint: "Payment widget", href: "#embed-on-a-site" },
          { label: "Wallet rules", hint: "What gets rejected", href: "#rules-a-wallet-checks" },
        ];
        rows.splice(ce, 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items) }, children: [] });
      }

      // 3. Main sections numbered; subsections after the first get a hairline.
      let n = 0;
      let firstH3 = true;
      for (const r of rows) {
        if (isEl(r, "h2")) {
          firstH3 = true;
          const t = textOf(r).trim();
          if (!/^tl;?\s?dr$|^related pages/i.test(t)) {
            n += 1;
            r.properties = { ...(r.properties || {}), dataStep: String(n) };
          }
        } else if (isEl(r, "h3")) {
          if (!firstH3) r.properties = { ...(r.properties || {}), dataRule: "true" };
          firstH3 = false;
        }
      }
    }
    if (opts.ncex && Array.isArray(tree.children)) {
      // Non-custodial exchanges guide: tidy the top, number the comparison points, add shortcuts.
      const rows: any[] = tree.children;
      const el = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const hasAlt = (x: any, alt: string): boolean =>
        !!x && x.type === "element" && ((x.tagName === "img" && String(x.properties?.alt || "") === alt) || (x.children || []).some((c: any) => hasAlt(c, alt)));
      const headIdx = (re: RegExp) => rows.findIndex((x) => el(x) && /^h[1-6]$/.test(x.tagName) && re.test(textOf(x).trim()));
      const kidsOf = (x: any) => (x.children || []).filter((c: any) => !isBlank(c));

      // 1. Drop the tiny decorative icon above the title.
      const prune = (x: any) => {
        if (!Array.isArray(x.children)) return;
        for (let q = x.children.length - 1; q >= 0; q--) {
          const c = x.children[q];
          const isIcon =
            (c.type === "element" && c.tagName === "img" && String(c.properties?.alt || "") === "Alt Text") ||
            ((c.type === "mdxJsxFlowElement" || c.type === "mdxJsxTextElement") && c.name === "img" && (c.attributes || []).some((at: any) => at.name === "alt" && at.value === "Alt Text"));
          if (isIcon) x.children.splice(q, 1);
          else prune(c);
        }
      };
      prune(tree);

      // 2. Link to the exchange list becomes a button; the paragraph after it is the lead.
      const lk = rows.findIndex((x) => el(x, "p") && /^zcash non-custodial exchanges$/i.test(textOf(x).trim()));
      if (lk > -1) {
        const findA = (x: any): any => (x.tagName === "a" ? x : (x.children || []).map((c: any) => (c.type === "element" ? findA(c) : null)).find(Boolean) || null);
        const a = findA(rows[lk]);
        const href = String(a?.properties?.href || "/dex").replace(/^https?:\/\/(www\.)?zechub\.wiki/i, "") || "/dex";
        rows[lk] = { type: "element", tagName: "linkbutton", properties: { href, label: "Browse non-custodial exchanges" }, children: [] };
        const lead = rows.findIndex((x, k) => k > lk && el(x, "p") && textOf(x).trim().length > 60);
        if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      }

      // 3. The seven numbered comparison points become one list.
      const vs = headIdx(/^non custodial exchanges vs custodial exchanges$/i);
      if (vs > -1) {
        let end = vs + 1;
        while (end < rows.length && !(el(rows[end]) && /^h[1-6]$/.test(rows[end].tagName))) end++;
        const items: any[] = [];
        for (const r of rows.slice(vs + 1, end)) {
          if (!el(r, "p")) continue;
          const ks = r.children || [];
          const first = ks.findIndex((c: any) => !isBlank(c));
          const st = first > -1 ? ks[first] : null;
          const mm = st && el(st, "strong") ? /^#(\d+)\s+(.+)$/.exec(textOf(st).trim()) : null;
          if (mm) {
            const rest = ks.slice(first + 1).map((c: any) => ({ ...c }));
            if (rest[0] && rest[0].type === "text") rest[0].value = rest[0].value.replace(/^\s*:\s*/, "");
            items.push({ type: "element", tagName: "pointitem", properties: { n: mm[1], title: mm[2] }, children: [{ type: "element", tagName: "p", properties: {}, children: rest }] });
          } else if (items.length) {
            items[items.length - 1].children.push(r);
          }
        }
        if (items.length) rows.splice(vs + 1, end - vs - 1, { type: "element", tagName: "pointlist", properties: {}, children: items });
      }

      // 4. Shortcuts above the first section.
      const first = headIdx(/^understanding non custodial exchanges$/i);
      if (first > -1) {
        const items = [
          { label: "How they work", hint: "Keys stay with you", href: "#understanding-non-custodial-exchanges" },
          { label: "Versus custodial", hint: "Seven key differences", href: "#non-custodial-exchanges-vs-custodial-exchanges" },
          { label: "Privacy limits", hint: "What Zcash protects", href: "#what-zcash-protects-and-what-it-does-not" },
          { label: "Who is involved", hint: "The parts of a swap", href: "#who-is-involved-in-a-swap" },
        ];
        rows.splice(first, 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items) }, children: [] });
      }

      // 5. Key takeaway as a highlighted note; later sections separated by a hairline.
      const tk = rows.findIndex((x) => el(x, "p") && /^send the zec to a wallet you control/i.test(textOf(x).trim()));
      if (tk > -1) rows[tk] = { type: "element", tagName: "guidecallout", properties: { title: "Recommended" }, children: [rows[tk]] };
      let seen = false;
      for (const r of rows) {
        if (el(r, "h3")) {
          if (seen) r.properties = { ...(r.properties || {}), dataRule: "true" };
          seen = true;
        }
      }
    }
    if (opts.snap && Array.isArray(tree.children)) {
      // Mobile top-up guide: the Coinsbee confirmation e-mail screenshot is stranded after the
      // CardsRelay section; move it (and the rule before it) up to the end of the first guide.
      const rows: any[] = tree.children;
      const hasImg = (x: any, alt: RegExp): boolean =>
        x && x.type === "element" && ((x.tagName === "img" && alt.test(String(x.properties?.alt || ""))) || (x.children || []).some((c: any) => hasImg(c, alt)));
      const from = rows.findIndex((x) => x.type === "element" && x.tagName === "p" && hasImg(x, /^additional screenshot$/i));
      const to = rows.findIndex((x) => x.type === "element" && x.tagName === "h2" && /without an account/i.test(textOf(x)));
      if (from > -1 && to > -1 && from > to) {
        const [moved] = rows.splice(from, 1);
        let k = from - 1;
        while (k >= 0 && (isBlank(rows[k]) || (rows[k].type === "element" && rows[k].tagName === "hr"))) {
          if (rows[k].type === "element" && rows[k].tagName === "hr") rows.splice(k, 1);
          k--;
        }
        rows.splice(to, 0, moved);
      }
    }
    if (opts.sol && Array.isArray(tree.children)) {
      const rows: any[] = tree.children;
      const el = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const h2At = (re: RegExp) => rows.findIndex((x) => el(x, "h2") && re.test(textOf(x).replace(/#$/, "").trim()));
      // Number the main sections.
      let num = 0;
      for (const re of [/^what you actually hold/i, /^why move it/i, /^pick a zcash wallet/i, /^move it/i, /^shield it and check/i]) {
        const k = h2At(re);
        if (k > -1) {
          num++;
          rows[k].properties = { ...(rows[k].properties || {}), dataStep: String(num) };
        }
      }
      // Warnings as highlighted notes.
      for (let k = 0; k < rows.length; k++) {
        if (el(rows[k], "p") && /^phantom asks you to sign/i.test(textOf(rows[k]).trim())) {
          rows[k] = { type: "element", tagName: "guidecallout", properties: { title: "Heads up" }, children: [rows[k]] };
        }
      }
      // Shortcuts above the first section.
      const first = h2At(/^what you actually hold/i);
      if (first > -1) {
        const items = [
          { label: "What you hold", hint: "A token on Solana", href: "#what-you-actually-hold" },
          { label: "Pick a wallet", hint: "Where it will land", href: "#pick-a-zcash-wallet" },
          { label: "Move it", hint: "Two steps, one swap", href: "#move-it" },
          { label: "Stay safe", hint: "Before you paste", href: "#stay-safe" },
        ];
        rows.splice(first, 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.swap && Array.isArray(tree.children)) {
      const rows: any[] = tree.children;
      const el = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const h2At = (re: RegExp) => rows.findIndex((x) => el(x, "h2") && re.test(textOf(x).replace(/#$/, "").trim()));
      // "Step N: Title" headings become numbered steps.
      for (const r of rows) {
        if (!el(r, "h2")) continue;
        const mm = /^step\s+(\d+)\s*:\s*(.+?)#?$/i.exec(textOf(r).trim());
        if (mm) {
          r.properties = { ...(r.properties || {}), dataStep: mm[1] };
          r.children = [{ type: "text", value: mm[2] }];
        }
      }
      // Drop the watermarked cover image above the first section.
      const hasImg = (x: any): boolean => x && x.type === "element" && (x.tagName === "img" || (x.children || []).some(hasImg));
      for (let k = 0; k < rows.length && !el(rows[k], "h2"); k++) {
        if (el(rows[k], "p") && hasImg(rows[k]) && !textOf(rows[k]).trim()) {
          rows.splice(k, 1);
          break;
        }
      }
      // Drop the Step 2 screenshot: the upstream file is unavailable and was a duplicate of Step 1.
      const hasSrc = (x: any, re: RegExp): boolean => x && x.type === "element" && ((x.tagName === "img" && re.test(String(x.properties?.src || ""))) || (x.children || []).some((c: any) => hasSrc(c, re)));
      const brokenAt = rows.findIndex((x) => el(x, "p") && hasSrc(x, /ry4QQF-5gx/));
      if (brokenAt > -1) rows.splice(brokenAt, 1);
      // Lead-in and closing warning as highlighted notes.
      for (let k = 0; k < rows.length; k++) {
        const t = el(rows[k], "p") ? textOf(rows[k]).trim() : "";
        if (/^already holding zec on solana/i.test(t)) rows[k] = { type: "element", tagName: "guidecallout", properties: { title: "Already hold ZEC on Solana?" }, children: [rows[k]] };
        else if (/^a zec token bought with phantom/i.test(t)) rows[k] = { type: "element", tagName: "guidecallout", properties: { title: "Heads up" }, children: [rows[k]] };
      }
      // Shortcuts above the first section.
      const first = h2At(/^native zec or a zec token/i);
      if (first > -1) {
        const items = [
          { label: "Native or token", hint: "Know what you pay for", href: "#native-zec-or-a-zec-token" },
          { label: "Swap", hint: "Steps 1 to 7", href: "#open-the-swap-interface" },
          { label: "Withdraw", hint: "Step 8, native ZEC", href: "#withdraw-native-zec-to-your-zcash-wallet" },
          { label: "Next steps", hint: "Keep it shielded", href: "#next-steps" },
        ];
        let at = first;
        while (at > 0 && el(rows[at - 1], "hr")) at--;
        rows.splice(at, 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.tnet && Array.isArray(tree.children)) {
      const rows: any[] = tree.children;
      const el = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const h2At = (re: RegExp) => rows.findIndex((x) => el(x, "h2") && re.test(textOf(x).replace(/#$/, "").trim()));
      // Subheadings (h3/h4, many numbered "1. ...") become hairline-separated titles.
      for (let k = 0; k < rows.length; k++) {
        const r = rows[k];
        if (el(r, "h3") || el(r, "h4")) {
          let nx = k + 1;
          while (nx < rows.length && isBlank(rows[nx])) nx++;
          const stacked = el(rows[nx], "h3") || el(rows[nx], "h4");
          rows[k] = { type: "element", tagName: "h3", properties: { ...(r.properties || {}), ...(stacked ? {} : { dataRule: "true" }) }, children: r.children };
        }
      }
      // Key note as a highlighted callout.
      for (let k = 0; k < rows.length; k++) {
        if (el(rows[k], "p") && /^think of taz as/i.test(textOf(rows[k]).trim())) {
          rows[k] = { type: "element", tagName: "guidecallout", properties: { title: "Keep in mind" }, children: [rows[k]] };
        }
      }
      // Number the main sections, except the closing summary; hairline between sections.
      let num = 0;
      for (let k = 0; k < rows.length; k++) {
        if (!el(rows[k], "h2")) continue;
        if (!/^quick summary/i.test(textOf(rows[k]).replace(/#$/, "").trim())) {
          num++;
          rows[k].properties = { ...(rows[k].properties || {}), dataStep: String(num) };
        }
      }
      for (let k = 1; k < rows.length; k++) {
        if (!el(rows[k], "h2")) continue;
        let q = k - 1;
        while (q >= 0 && isBlank(rows[q])) q--;
        if (q >= 0 && !el(rows[q], "hr")) {
          rows.splice(k, 0, { type: "element", tagName: "hr", properties: {}, children: [] });
          k++;
        }
      }
      // Shortcuts above the first section.
      const first = h2At(/^what is the zcash testnet/i);
      if (first > -1) {
        const items = [
          { label: "What it is", hint: "A parallel sandbox chain", href: "#what-is-the-zcash-testnet" },
          { label: "Use cases", hint: "Who uses Testnet", href: "#real-testnet-use-cases" },
          { label: "Mainnet vs Testnet", hint: "Key differences", href: "#key-differences-between-mainnet-and-testnet" },
          { label: "TAZ and faucets", hint: "Get free test coins", href: "#what-is-taz" },
        ];
        rows.splice(first, 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.txn && Array.isArray(tree.children)) {
      const rows: any[] = tree.children;
      const el = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const clean = (x: any) => textOf(x).replace(/#$/, "").trim();
      const h2At = (re: RegExp) => rows.findIndex((x) => el(x, "h2") && re.test(clean(x)));
      const nextBody = (k: number) => {
        let q = k + 1;
        while (q < rows.length && isBlank(rows[q])) q++;
        return q;
      };
      // "TL;DR" and "Note" become highlighted callouts (their heading becomes the callout title).
      for (const [re, title] of [[/^tl;dr$/i, "TL;DR"], [/^note$/i, "Note"]] as [RegExp, string][]) {
        const k = h2At(re);
        if (k < 0) continue;
        const b = nextBody(k);
        if (b < rows.length && (el(rows[b], "ul") || el(rows[b], "p"))) {
          rows[b] = { type: "element", tagName: "guidecallout", properties: { title }, children: [rows[b]] };
          rows.splice(k, 1);
        }
      }
      // Number the guide sections.
      let num = 0;
      for (const re of [/^shielded transactions$/i, /^transparent transactions$/i, /^a simple way to picture it$/i, /^zcash fees$/i, /^troubleshooting stuck transactions$/i, /^pending, expired, dropped/i, /^when not to resend$/i, /^privacy-safe checks$/i, /^what not to share publicly$/i, /^what support teams need$/i, /^common mistakes/i]) {
        const k = h2At(re);
        if (k > -1) {
          num++;
          rows[k].properties = { ...(rows[k].properties || {}), dataStep: String(num) };
        }
      }
      // Hairline between sections.
      for (let k = 1; k < rows.length; k++) {
        if (!el(rows[k], "h2")) continue;
        let q = k - 1;
        while (q >= 0 && isBlank(rows[q])) q--;
        if (q >= 0 && !el(rows[q], "hr")) {
          rows.splice(k, 0, { type: "element", tagName: "hr", properties: {}, children: [] });
          k++;
        }
      }
      // Shortcuts above the first section.
      const first = rows.findIndex((x) => el(x, "guidecallout") || el(x, "h2"));
      if (first > -1) {
        const items = [
          { label: "Shielded vs transparent", hint: "Two kinds of transaction", href: "#shielded-transactions" },
          { label: "Fees", hint: "How ZIP 317 works", href: "#zcash-fees" },
          { label: "Stuck transaction?", hint: "Check before resending", href: "#troubleshooting-stuck-transactions" },
          { label: "Stay private", hint: "What not to share", href: "#what-not-to-share-publicly" },
        ];
        rows.splice(first + (el(rows[first], "guidecallout") ? 1 : 0), 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.ua && Array.isArray(tree.children)) {
      const rows: any[] = tree.children;
      const el = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const clean = (x: any) => textOf(x).replace(/#$/, "").trim();
      let num = 0;
      for (const re of [/^how it works$/i, /^why it matters now$/i, /^a fresh address for every sender$/i]) {
        const k = rows.findIndex((x) => el(x, "h2") && re.test(clean(x)));
        if (k > -1) {
          num++;
          rows[k].properties = { ...(rows[k].properties || {}), dataStep: String(num) };
        }
      }
      for (let k = 1; k < rows.length; k++) {
        if (!el(rows[k], "h2")) continue;
        let q = k - 1;
        while (q >= 0 && isBlank(rows[q])) q--;
        if (q >= 0 && !el(rows[q], "hr")) {
          rows.splice(k, 0, { type: "element", tagName: "hr", properties: {}, children: [] });
          k++;
        }
      }
      const first = rows.findIndex((x) => el(x, "h2"));
      if (first > -1) {
        const items = [
          { label: "How it works", hint: "One address, any pool", href: "#how-it-works" },
          { label: "Why it matters", hint: "Ready for new pools", href: "#why-it-matters-now" },
          { label: "Fresh addresses", hint: "One per sender", href: "#a-fresh-address-for-every-sender" },
          { label: "Quick facts", hint: "Prefix, encoding, ZIP", href: "#quick-facts" },
        ];
        rows.splice(first, 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.mine && Array.isArray(tree.children)) {
      const rows: any[] = tree.children;
      const el = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const clean = (x: any) => textOf(x).replace(/#$/, "").trim();
      // Subheadings get a hairline; the warning becomes a callout.
      for (let k = 0; k < rows.length; k++) {
        const r = rows[k];
        if (el(r, "h3") || el(r, "h4")) {
          rows[k] = { type: "element", tagName: "h3", properties: { ...(r.properties || {}), dataRule: "true" }, children: r.children };
        } else if (el(r, "p") && /^warning:/i.test(textOf(r).trim())) {
          rows[k] = { type: "element", tagName: "guidecallout", properties: { title: "Warning" }, children: [r] };
        }
      }
      let num = 0;
      for (const re of [/^requirements$/i, /^step-by-step guide/i, /^sovright/i, /^mining against your own zebra node$/i, /^tips and best practices$/i]) {
        const k = rows.findIndex((x) => el(x, "h2") && re.test(clean(x)));
        if (k > -1) {
          num++;
          rows[k].properties = { ...(rows[k].properties || {}), dataStep: String(num) };
        }
      }
      for (let k = 1; k < rows.length; k++) {
        if (!el(rows[k], "h2")) continue;
        let q = k - 1;
        while (q >= 0 && isBlank(rows[q])) q--;
        if (q >= 0 && !el(rows[q], "hr")) {
          rows.splice(k, 0, { type: "element", tagName: "hr", properties: {}, children: [] });
          k++;
        }
      }
      const first = rows.findIndex((x) => el(x, "h2") && /^requirements$/i.test(clean(x)));
      if (first > -1) {
        const items = [
          { label: "Requirements", hint: "Hardware and software", href: "#requirements" },
          { label: "Join a pool", hint: "Five steps", href: "#step-by-step-guide-to-joining-a-mining-pool" },
          { label: "Your own node", hint: "Mine against Zebra", href: "#mining-against-your-own-zebra-node" },
          { label: "Best practices", hint: "Costs and monitoring", href: "#tips-and-best-practices" },
        ];
        let at = first;
        while (at > 0 && (el(rows[at - 1], "hr") || isBlank(rows[at - 1]))) at--;
        rows.splice(at, 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.zal && Array.isArray(tree.children)) {
      const rows: any[] = tree.children;
      const el = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const clean = (x: any) => textOf(x).replace(/#$/, "").trim();
      // TL;DR becomes a highlighted summary box (its heading becomes the box title).
      const tl = rows.findIndex((x) => el(x, "h2") && /^tl;dr$/i.test(clean(x)));
      if (tl > -1) {
        let b = tl + 1;
        while (b < rows.length && isBlank(rows[b])) b++;
        if (el(rows[b], "ul")) {
          rows[b] = { type: "element", tagName: "guidecallout", properties: { title: "TL;DR" }, children: [rows[b]] };
          rows.splice(tl, 1);
        }
      }
      // Per-command warnings as callouts.
      for (let k = 0; k < rows.length; k++) {
        if (el(rows[k], "blockquote") && /^\s*wallet must be unlocked/i.test(textOf(rows[k]))) {
          rows[k] = { type: "element", tagName: "guidecallout", properties: { title: "Before you run it" }, children: (rows[k].children || []).filter((c: any) => !isBlank(c)) };
        }
      }
      // "Required" column values become badges.
      const badge = (yes: boolean, label: string) => ({
        type: "element",
        tagName: "span",
        properties: {
          className: yes
            ? ["inline-block", "rounded-full", "border", "border-brand/50", "bg-brand/10", "px-2.5", "py-0.5", "text-xs", "font-medium", "text-brand", "dark:text-brand-soft"]
            : ["inline-block", "rounded-full", "border", "border-slate-300", "px-2.5", "py-0.5", "text-xs", "text-slate-500", "dark:border-white/15", "dark:text-slate-400"],
        },
        children: [{ type: "text", value: label }],
      });
      const fixTables = (node: any) => {
        for (const c of node.children || []) {
          if (el(c, "table")) {
            const trs: any[] = [];
            const collect = (n: any) => {
              for (const ch of n.children || []) {
                if (el(ch, "tr")) trs.push(ch);
                else if (ch.children) collect(ch);
              }
            };
            collect(c);
            const cells = (tr: any) => (tr.children || []).filter((q: any) => el(q, "th") || el(q, "td"));
            const head = trs.length ? cells(trs[0]) : [];
            const ri = head.findIndex((h: any) => /^required$/i.test(textOf(h).trim()));
            if (ri > -1) {
              for (const tr of trs.slice(1)) {
                const td = cells(tr)[ri];
                if (!td) continue;
                const v = textOf(td).trim().toLowerCase();
                if (v === "yes") td.children = [badge(true, "Required")];
                else if (v === "no") td.children = [badge(false, "Optional")];
              }
            }
          } else if (c.children) fixTables(c);
        }
      };
      fixTables({ children: rows });
      // Command index by group, before the first section.
      const first = rows.findIndex((x) => el(x, "guidecallout") || el(x, "h2"));
      if (first > -1) {
        const items = [
          { label: "Decode & verify", hint: "Transactions, scripts, messages", href: "#decoderawtransaction" },
          { label: "Wallet status", hint: "Info, status, addresses", href: "#getwalletinfo" },
          { label: "Accounts", hint: "Create, list, addresses", href: "#z-getaccount" },
          { label: "Balances", hint: "Per account and total", href: "#z-getbalances" },
          { label: "Keys & import", hint: "Export and import keys", href: "#z-exportkey" },
          { label: "Send & shield", hint: "z_sendmany and more", href: "#z-sendmany" },
          { label: "Operations", hint: "Check async results", href: "#z-getoperationresult" },
          { label: "Lock & unlock", hint: "Passphrase handling", href: "#walletlock" },
        ];
        const at = el(rows[first], "guidecallout") ? first + 1 : first;
        rows.splice(at, 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items), title: "Command index" }, children: [] });
      }
    }
    if (opts.uc && Array.isArray(tree.children)) {
      const rows: any[] = tree.children;
      const nm = (x: any): string => (x ? (x.type === "element" ? x.tagName : x.type === "mdxJsxFlowElement" || x.type === "mdxJsxTextElement" ? x.name : "") : "") || "";
      const isH = (x: any, tag: string) => nm(x) === tag;
      const clean = (x: any) => textOf(x).replace(/#$/, "").trim();
      const slugOf = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const stripImgs = (x: any) => {
        if (!Array.isArray(x.children)) return;
        x.children = x.children.filter((c: any) => nm(c) !== "img");
        x.children.forEach(stripImgs);
      };
      // 1. Remove spacer <br>s and the decorative icons in headings.
      for (let k = rows.length - 1; k >= 0; k--) {
        if (nm(rows[k]) === "br") rows.splice(k, 1);
        else if (isH(rows[k], "h1") || isH(rows[k], "h2") || isH(rows[k], "h3")) stripImgs(rows[k]);
      }
      // 2. Level/time line as a pill.
      for (let k = 0; k < rows.length; k++) {
        if (nm(rows[k]) === "span" && /^(beginner|intermediate|advanced)\b/i.test(textOf(rows[k]).trim())) {
          rows[k] = {
            type: "element",
            tagName: "div",
            properties: { className: ["my-4"] },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: { className: ["inline-flex", "items-center", "rounded-full", "border", "border-brand/50", "bg-brand/10", "px-3", "py-1", "text-sm", "font-medium", "text-brand", "dark:text-brand-soft"] },
                children: [{ type: "text", value: textOf(rows[k]).trim() }],
              },
            ],
          };
          break;
        }
      }
      const body = (k: number) => {
        let q = k + 1;
        while (q < rows.length && isBlank(rows[q])) q++;
        return q;
      };
      // 3. TL;DR as a summary box; Progress as a status box.
      for (const [re, title] of [[/^tl;dr$/i, "TL;DR"]] as [RegExp, string][]) {
        const k = rows.findIndex((x) => isH(x, "h2") && re.test(clean(x)));
        if (k > -1) {
          const b = body(k);
          if (nm(rows[b]) === "ul") {
            rows[b] = { type: "element", tagName: "guidecallout", properties: { title }, children: [rows[b]] };
            rows.splice(k, 1);
          }
        }
      }
      const pg = rows.findIndex((x) => isH(x, "h2") && /^progress$/i.test(clean(x)));
      if (pg > -1) {
        let end = pg + 1;
        while (end < rows.length && !isH(rows[end], "h2") && nm(rows[end]) !== "hr") end++;
        const inner = rows.slice(pg + 1, end).filter((x) => !isBlank(x));
        if (inner.length) rows.splice(pg, end - pg, { type: "element", tagName: "guidecallout", properties: { title: "Progress" }, children: inner });
      }
      // 4. Next step as a button.
      const ns = rows.findIndex((x) => isH(x, "h2") && /^next step$/i.test(clean(x)));
      if (ns > -1) {
        const b = body(ns);
        const findA = (x: any): any => {
          if (nm(x) === "a") return x;
          for (const c of x.children || []) {
            const r = findA(c);
            if (r) return r;
          }
          return null;
        };
        const a = nm(rows[b]) === "ul" ? findA(rows[b]) : null;
        const href = a ? a.properties?.href : null;
        if (href) rows.splice(b, 1, { type: "element", tagName: "linkbutton", properties: { href, label: textOf(a).trim() }, children: [] });
      }
      // 5. "Step N: Title" becomes a numbered step; other subheadings get a hairline.
      for (let k = 0; k < rows.length; k++) {
        if (isH(rows[k], "h3")) {
          const t = textOf(rows[k]).trim();
          const mm = /^step\s+(\d+)\s*[:.\-]\s*(.+)$/i.exec(t);
          rows[k] = mm
            ? { type: "element", tagName: "h3", properties: { dataStep: mm[1] }, children: [{ type: "text", value: mm[2] }] }
            : { type: "element", tagName: "h3", properties: { dataRule: "true" }, children: [{ type: "text", value: t }] };
        }
      }
      // 6. Tips and warnings (blockquotes) as callouts; screenshots get the blue frame.
      const frameImgs = (x: any) => {
        if (nm(x) === "img" && x.type === "element") x.properties = { ...(x.properties || {}), dataFrame: "true" };
        (x.children || []).forEach(frameImgs);
      };
      for (let k = 0; k < rows.length; k++) {
        if (nm(rows[k]) === "blockquote") {
          const t = textOf(rows[k]).trim();
          const title = /^(this step protects|the swap leg is visible|important|warning)/i.test(t) ? "Heads up" : /^(send slightly|tip)/i.test(t) ? "Tip" : "Note";
          rows[k] = { type: "element", tagName: "guidecallout", properties: { title }, children: (rows[k].children || []).filter((c: any) => !isBlank(c)) };
        }
        frameImgs(rows[k]);
      }
      // 7. Hairline between sections.
      for (let k = 1; k < rows.length; k++) {
        if (!isH(rows[k], "h2")) continue;
        let q = k - 1;
        while (q >= 0 && isBlank(rows[q])) q--;
        if (q >= 0 && nm(rows[q]) !== "hr") {
          rows.splice(k, 0, { type: "element", tagName: "hr", properties: {}, children: [] });
          k++;
        }
      }
      // 8. Shortcuts after the summary box.
      const cands: [RegExp, string, string][] = [
        [/^step-by-step/i, "Step by step", "The full procedure"],
        [/^route 1/i, "Route 1", "Pay the service directly"],
        [/^route 2/i, "Route 2", "Services without ZEC"],
        [/^what you need/i, "What you need", "Before you start"],
        [/^what is revealed/i, "What is revealed", "At each step"],
        [/^common mistakes/i, "Mistakes", "What to avoid"],
        [/^the problem/i, "The problem", "What is exposed today"],
        [/^why zcash/i, "Why Zcash", "What shielding changes"],
      ];
      const items: any[] = [];
      for (const [re, label, hint] of cands) {
        const k = rows.findIndex((x) => isH(x, "h2") && re.test(clean(x)));
        if (k > -1) items.push({ k, label, hint, href: "#" + slugOf(clean(rows[k])) });
      }
      items.splice(4);
      items.sort((x, y) => x.k - y.k);
      if (items.length >= 2) {
        const sum = rows.findIndex((x) => nm(x) === "guidecallout");
        const firstH2 = rows.findIndex((x) => isH(x, "h2"));
        const at = sum > -1 && (firstH2 < 0 || sum < firstH2) ? sum + 1 : firstH2;
        if (at > -1) rows.splice(at, 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items.map(({ k: _k, ...r }: any) => r)) }, children: [] });
      }
    }
    if (opts.ucHub && Array.isArray(tree.children)) {
      const rows: any[] = tree.children;
      const nm = (x: any): string => (x ? (x.type === "element" ? x.tagName : x.type === "mdxJsxFlowElement" || x.type === "mdxJsxTextElement" ? x.name : "") : "") || "";
      const clean = (x: any) => textOf(x).replace(/#$/, "").trim();
      const GUIDES: [RegExp, string][] = [
        [/^receive donations/i, "receive-donations-privately"],
        [/^send money without/i, "send-money-without-linking-identity"],
        [/^freelancer privacy/i, "freelance-privacy-setup"],
        [/^accept payments/i, "accept-payments-as-a-merchant"],
        [/private community treasury/i, "private-community-treasury"],
        [/^journalist privacy/i, "journalist-privacy-setup"],
      ];
      // Sharper, more professional copy for the introduction and usage notes.
      const setText = (x: any, t: string) => {
        x.children = [{ type: "text", value: t }];
      };
      const setList = (ul: any, texts: string[]) => {
        const lis = (ul.children || []).filter((c: any) => nm(c) === "li");
        lis.forEach((li: any, i: number) => {
          if (texts[i] !== undefined) setText(li, texts[i]);
        });
      };
      const pAt = (re: RegExp) => rows.find((x) => nm(x) === "p" && re.test(textOf(x).trim()));
      const p1 = pAt(/^zcash is not just about privacy/i);
      if (p1) setText(p1, "Zcash is built for everyday use, not only for privacy in theory. These guides show how to apply it in real situations: receiving payments, paying for services and protecting your financial data.");
      const p2 = pAt(/^this section shows you exactly how/i);
      if (p2) setText(p2, "Each guide is a short, step-by-step playbook with practical recommendations you can follow right away.");
      const learnUl = rows.find((x) => nm(x) === "ul" && /how to protect your financial privacy/i.test(textOf(x)));
      if (learnUl) setList(learnUl, ["Protect your financial privacy in everyday transactions", "Avoid the common mistakes that expose your data", "Apply Zcash in real-world situations, from donations to payments"]);
      const pEach = pAt(/^each playbook is:?$/i);
      if (pEach) setText(pEach, "Every guide follows the same format:");
      const fmtUl = rows.find((x) => nm(x) === "ul" && /^\s*short \(5-7 minutes\)/i.test(textOf(x)));
      if (fmtUl) setList(fmtUl, ["Short: most take 5 to 10 minutes", "Step-by-step, with clear instructions", "Focused on real-world use, not theory"]);
      const pPath = pAt(/^follow this step-by-step journey/i);
      if (pPath) setText(pPath, "Follow this recommended order to build real-world Zcash skills one step at a time.");
      // "What You'll Learn" as a highlighted box (its heading becomes the title).
      const wl = rows.findIndex((x) => nm(x) === "h2" && /^what you.ll learn/i.test(clean(x)));
      if (wl > -1) {
        let b = wl + 1;
        while (b < rows.length && isBlank(rows[b])) b++;
        if (nm(rows[b]) === "ul") {
          rows[b] = { type: "element", tagName: "guidecallout", properties: { title: "What you'll learn" }, children: [rows[b]] };
          rows.splice(wl, 1);
        }
      }
      // "If you're new, start here" as a note.
      const nw = rows.findIndex((x) => nm(x) === "p" && /^if you.re new, start here/i.test(textOf(x).trim()));
      if (nw > -1) rows[nw] = { type: "element", tagName: "guidecallout", properties: { title: "New to Zcash?" }, children: [rows[nw]] };
      // Recommended path: numbered list with a button per guide.
      const rp = rows.findIndex((x) => nm(x) === "h2" && /^recommended path/i.test(clean(x)));
      if (rp > -1) {
        let end = rp + 1;
        while (end < rows.length && nm(rows[end]) !== "h2") end++;
        const items: any[] = [];
        let cur: any = null;
        for (const r of rows.slice(rp + 1, end)) {
          if (isBlank(r)) continue;
          if (nm(r) === "h3") {
            const title = textOf(r).trim();
            cur = { type: "element", tagName: "pointitem", properties: { n: String(items.length + 1), title }, children: [] };
            const g = GUIDES.find(([re]) => re.test(title));
            cur.slug = g ? g[1] : null;
            items.push(cur);
          } else if (cur) {
            cur.children.push(r);
          }
        }
        const lead = rows.slice(rp + 1, end).filter((x) => !isBlank(x) && nm(x) === "p" && !items.some((it) => it.children.includes(x)) && !items.length);
        for (const it of items) {
          if (it.slug) it.children.push({ type: "element", tagName: "div", properties: { className: ["flex"] }, children: [{ type: "element", tagName: "linkbutton", properties: { href: "/zcash-use-cases/" + it.slug, label: "Open guide" }, children: [] }] });
          delete it.slug;
        }
        if (items.length) {
          const keep = rows.slice(rp + 1, end).filter((x) => !isBlank(x) && nm(x) !== "h3" && !items.some((it) => it.children.includes(x)));
          rows.splice(rp + 1, end - rp - 1, ...keep, { type: "element", tagName: "pointlist", properties: {}, children: items });
          void lead;
        }
      }
    }
    if (opts.comm && Array.isArray(tree.children)) {
      // Community links: platform groups as icon cards, regional hubs as link cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const nameOf = (x: any): string => x.tagName || x.name || "";
      const dropImgs = (x: any) => {
        if (!x || !Array.isArray(x.children)) return;
        x.children = x.children.filter((c: any) => nameOf(c) !== "img");
        x.children.forEach(dropImgs);
      };
      const findHref = (x: any): string => {
        if (!x || typeof x !== "object") return "";
        if (nameOf(x) === "a" && x.properties?.href) return String(x.properties.href);
        for (const c of x.children || []) {
          const r = findHref(c);
          if (r) return r;
        }
        return "";
      };
      const hasTable = (x: any): boolean => nameOf(x) === "table" || (x.children || []).some(hasTable) || (x.properties?.className || []).includes?.("overflow-x-auto");
      const iconFor = (t: string) =>
        /telegram/i.test(t) ? "telegram" : /discord/i.test(t) ? "discord" : /mastodon/i.test(t) ? "mastodon" : /matrix/i.test(t) ? "matrix" : /forum/i.test(t) ? "forum" : /twitter|^x\b/i.test(t) ? "x" : "globe";
      const firstP = rows.findIndex((x) => isEl(x, "p") && textOf(x).trim().length > 60);
      if (firstP > -1) rows[firstP].properties = { ...(rows[firstP].properties || {}), dataLead: "true" };
      rows.forEach((x) => isEl(x, "h1") && dropImgs(x));

      const w = rows.findIndex((x) => isEl(x, "h2") && /where you can find/i.test(textOf(x)));
      if (w > -1) {
        let end = w + 1;
        while (end < rows.length && !isEl(rows[end], "h2") && !isEl(rows[end], "hr")) end++;
        const groups: any[] = [];
        let cur: any = null;
        for (const r of rows.slice(w + 1, end)) {
          if (isBlank(r)) continue;
          if (isEl(r, "h3")) {
            dropImgs(r);
            const title = textOf(r).trim().replace(/#$/, "").trim();
            cur = { type: "element", tagName: "communitygroup", properties: { title, icon: iconFor(title), wide: "false" }, children: [] };
            groups.push(cur);
          } else if (cur) {
            cur.children.push(r);
            if (hasTable(r)) cur.properties.wide = "true";
            if (cur.properties.icon === "forum") cur.properties.wide = "true";
          }
        }
        if (groups.length) rows.splice(w + 1, end - w - 1, { type: "element", tagName: "communitygrid", properties: {}, children: groups });
      }

      // X accounts table: add the newer regional communities right after the Nigeria row.
      const findAll = (x: any, tag: string, out: any[] = []): any[] => {
        if (!x || typeof x !== "object") return out;
        if (nameOf(x) === tag) out.push(x);
        (x.children || []).forEach((c: any) => findAll(c, tag, out));
        return out;
      };
      const extra: [string, string][] = [
        ["ZcashEastAfrica", "Zcash East Africa community"],
        ["Zcash_SA", "Zcash South Africa community"],
        ["ZcashIND", "Zcash India community"],
        ["ZcashGH", "Zcash Ghana community"],
        ["zec_forge", "ZecForge - creator program spreading privacy-focused Zcash content"],
      ];
      for (const tr of findAll({ children: rows }, "tr")) {
        if (!/^@?ZcashNigeria/i.test(textOf(tr).trim())) continue;
        const parent = findAll({ children: rows }, "tbody").find((b: any) => (b.children || []).includes(tr));
        if (!parent) break;
        const have = textOf(parent).toLowerCase();
        let at = parent.children.indexOf(tr);
        for (const [handle, desc] of extra) {
          if (have.includes("@" + handle.toLowerCase())) continue;
          const row = JSON.parse(JSON.stringify(tr));
          const tds = (row.children || []).filter((c: any) => nameOf(c) === "td");
          if (tds.length < 2) break;
          const a = findAll(tds[0], "a")[0];
          if (a) {
            a.properties = { ...(a.properties || {}), href: "https://x.com/" + handle };
            a.children = [{ type: "text", value: "@" + handle }];
          } else tds[0].children = [{ type: "text", value: "@" + handle }];
          tds[1].children = [{ type: "text", value: desc }];
          parent.children.splice(++at, 0, row);
        }
        break;
      }

      // Shielded Labs goes right after the Zcash Foundation row.
      for (const tr of findAll({ children: rows }, "tr")) {
        if (!/^@?ZcashFoundation/i.test(textOf(tr).trim())) continue;
        const parent = findAll({ children: rows }, "tbody").find((b: any) => (b.children || []).includes(tr));
        if (!parent || textOf(parent).toLowerCase().includes("@shieldedlabs")) break;
        const row = JSON.parse(JSON.stringify(tr));
        const tds = (row.children || []).filter((c: any) => nameOf(c) === "td");
        if (tds.length < 2) break;
        const a = findAll(tds[0], "a")[0];
        if (a) {
          a.properties = { ...(a.properties || {}), href: "https://x.com/ShieldedLabs" };
          a.children = [{ type: "text", value: "@ShieldedLabs" }];
        } else tds[0].children = [{ type: "text", value: "@ShieldedLabs" }];
        tds[1].children = [{ type: "text", value: "Shielded Labs - independent, donation-funded Zcash organization" }];
        parent.children.splice(parent.children.indexOf(tr) + 1, 0, row);
        break;
      }

      // CipherScan was renamed to ZecBlock.
      for (const tr of findAll({ children: rows }, "tr")) {
        if (!/^@?cipherscan_app/i.test(textOf(tr).trim())) continue;
        const tds = (tr.children || []).filter((c: any) => nameOf(c) === "td");
        if (tds.length < 2) break;
        const a = findAll(tds[0], "a")[0];
        if (a) {
          a.properties = { ...(a.properties || {}), href: "https://x.com/zecblock" };
          a.children = [{ type: "text", value: "@zecblock" }];
        } else tds[0].children = [{ type: "text", value: "@zecblock" }];
        tds[1].children = [{ type: "text", value: "ZecBlock (formerly CipherScan) - Zcash blockchain explorer" }];
        break;
      }

      const rg = rows.findIndex((x) => isEl(x, "h2") && /^regional community hubs/i.test(textOf(x).trim()));
      if (rg > -1) {
        let j = rg + 1;
        while (j < rows.length && !isEl(rows[j], "ul")) j++;
        if (j < rows.length) {
          const cards = (rows[j].children || [])
            .filter((li: any) => isEl(li, "li"))
            .map((li: any) => {
              const t = textOf(li).trim();
              const m = t.match(/^(.*?)\s[-\u2013\u2014]\s(.+)$/);
              return {
                type: "element",
                tagName: "communitycard",
                properties: { name: (m ? m[1] : t).trim(), desc: m ? m[2].trim() : "", href: findHref(li) },
                children: [],
              };
            });
          if (cards.length) rows.splice(j, 1, { type: "element", tagName: "communitygrid", properties: {}, children: cards });
        }
      }
    }
    if (opts.gov && Array.isArray(tree.children)) {
      // Funding & Governance: lead line, organizations as cards, resources as link cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const nameOf = (x: any): string => x.tagName || x.name || "";
      const collectLinks = (x: any, out: { label: string; href: string }[] = []) => {
        if (!x || typeof x !== "object") return out;
        if (nameOf(x) === "a" && x.properties?.href) out.push({ label: textOf(x).trim(), href: String(x.properties.href) });
        (x.children || []).forEach((c: any) => collectLinks(c, out));
        return out;
      };
      const orgLogo = (name: string): { logo: string; logoDark?: string } => {
        const n = name.toLowerCase();
        if (/electric coin|bootstrap/.test(n)) return { logo: "/org-logos/ecc.png" };
        if (/open development lab|zodl/.test(n)) return { logo: "/org-logos/zodl-light.png", logoDark: "/org-logos/zodl-dark.png" };
        if (/zcash foundation/.test(n)) return { logo: "/org-logos/zf-light.png", logoDark: "/org-logos/zf-dark.png" };
        if (/community grants/.test(n)) return { logo: "/org-logos/zcg.png", logoDark: "/org-logos/zcg-dark.png" };
        if (/financial privacy/.test(n)) return { logo: "/org-logos/fpf-light.png", logoDark: "/org-logos/fpf-dark.png" };
        if (/shielded labs/.test(n)) return { logo: "/org-logos/sl.png" };
        return { logo: "" };
      };
      const h2At = (re: RegExp) => rows.findIndex((x) => isEl(x, "h2") && re.test(textOf(x).replace(/#$/, "").trim()));
      const sectionEnd = (from: number) => {
        let end = from + 1;
        while (end < rows.length && !isEl(rows[end], "h2")) end++;
        return end;
      };

      const lead = rows.findIndex((x) => isEl(x, "p") && textOf(x).trim().length > 40);
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };

      // Organizations: <p><strong>Name</strong></p> + <ul>; the "-> See full profile / Official site" lines become buttons.
      const orgs = h2At(/^2\.\s*the core organizations/i);
      if (orgs > -1) {
        const end = sectionEnd(orgs);
        const cards: any[] = [];
        const section = rows.slice(orgs + 1, end).filter((x: any) => !(x.type === "text" && !String(x.value).trim()));
        for (let i = 0; i < section.length; i++) {
          const head = section[i];
          const list = section[i + 1];
          if (!isEl(head, "p") || !isEl(list, "ul") || !textOf(head).trim()) continue;
          const links: { label: string; href: string }[] = [];
          list.children = (list.children || []).filter((li: any) => {
            if (!isEl(li, "li")) return true;
            const kids: any[] = li.children || [];
            const at = kids.findIndex((c) => c.type === "text" && /(->|\u2192)/.test(c.value));
            if (at < 0) return true;
            const tail = kids.slice(at);
            let pending = "";
            for (const c of tail) {
              if (c.type === "text") pending = c.value;
              else if (nameOf(c) === "a" && c.properties?.href) {
                links.push({ label: /official site/i.test(pending) ? "Official site" : "Full profile", href: String(c.properties.href) });
                pending = "";
              }
            }
            const before = kids.slice(0, at).filter((c) => !(isEl(c, "br")));
            const cut = kids[at].value.split(/(->|\u2192)/)[0];
            if (cut.trim()) before.push({ type: "text", value: cut.trim() });
            li.children = before;
            return textOf(li).trim().length > 0;
          });
          cards.push({
            type: "element",
            tagName: "orgcard",
            properties: { name: textOf(head).trim(), links: JSON.stringify(links), ...orgLogo(textOf(head)) },
            children: [list],
          });
          i++;
        }
        if (cards.length) {
          rows.splice(orgs + 1, end - orgs - 1, { type: "element", tagName: "communitygrid", properties: {}, children: cards });
        }
      }

      // Related resources: one link card per entry.
      const res = h2At(/^5\.\s*related resources/i);
      if (res > -1) {
        let ri = res + 1;
        while (ri < rows.length && rows[ri].type === "text" && !String(rows[ri].value).trim()) ri++;
        const ul = rows[ri];
        if (isEl(ul, "ul")) {
          const cards: any[] = [];
          for (const li of ul.children || []) {
            if (!isEl(li, "li")) continue;
            const l = collectLinks(li)[0];
            if (!l) continue;
            const name = textOf(li).split(/->|\u2192/)[0].trim();
            cards.push({ type: "element", tagName: "communitycard", properties: { name, desc: l.label, href: l.href }, children: [] });
          }
          if (cards.length) rows.splice(ri, 1, { type: "element", tagName: "communitygrid", properties: {}, children: cards });
        }
      }
    }
    if (opts.zcap && Array.isArray(tree.children)) {
      // ZCAP: small mascot, votes as link cards, prominent members as initials cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const nameOf = (x: any): string => x.tagName || x.name || "";
      const findHref = (x: any): string => {
        if (!x || typeof x !== "object") return "";
        if (nameOf(x) === "a" && x.properties?.href) return String(x.properties.href);
        for (const c of x.children || []) {
          const r = findHref(c);
          if (r) return r;
        }
        return "";
      };
      const hasEditBadge = (x: any): boolean =>
        nameOf(x) === "img" && /shields\.io\/badge\/edit/i.test(String(x.properties?.src || "")) || (x.children || []).some(hasEditBadge);
      const jsxBadge = (x: any): boolean =>
        x && x.type === "mdxJsxFlowElement" && (x.name === "a" || x.name === "img")
          && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit");
      for (let i = rows.length - 1; i >= 0; i--) {
        if ((isEl(rows[i]) && hasEditBadge(rows[i]) && !textOf(rows[i]).trim()) || jsxBadge(rows[i])) rows.splice(i, 1);
      }
      const mascot = rows.findIndex((x) => x.type === "mdxJsxFlowElement" && x.name === "img");
      if (mascot > -1) {
        const attrs = (rows[mascot].attributes || []).filter((a: any) => a.name !== "className" && a.name !== "class");
        attrs.push({ type: "mdxJsxAttribute", name: "className", value: "float-right ml-6 mb-3 mt-1 h-auto w-28 rounded-xl sm:w-36" });
        rows[mascot].attributes = attrs;
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p") && textOf(x).trim().length > 120);
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };

      // Votes: paragraphs that start with a link, between the lead and the "idea behind" paragraph.
      const endVotes = rows.findIndex((x, i) => i > lead && isEl(x, "p") && /^the idea behind zcap/i.test(textOf(x).trim()));
      if (lead > -1 && endVotes > lead) {
        const cards: any[] = [];
        for (const r of rows.slice(lead + 1, endVotes)) {
          if (!isEl(r, "p") || !textOf(r).trim()) continue;
          const full = textOf(r).trim();
          const href = findHref(r);
          const m = full.match(/^(.*?)(?::\s+|,\s*which\s+)([\s\S]*)$/);
          const name = m ? m[1].trim() : full;
          let desc = m ? m[2].trim() : "";
          if (desc) desc = desc[0].toUpperCase() + desc.slice(1);
          const n = name.toLowerCase();
          const icon = /trademark/.test(n) ? "scale" : /monetary/.test(n) ? "coins" : /asic/.test(n) ? "cpu"
            : /minor grants/.test(n) ? "grants" : /grants committee|committee election/.test(n) ? "vote"
            : /shielded assets/.test(n) ? "shield" : /board/.test(n) ? "users" : "globe";
          cards.push({ type: "element", tagName: "communitycard", properties: { name, desc, href, icon }, children: [] });
        }
        if (cards.length) rows.splice(lead + 1, endVotes - lead - 1, { type: "element", tagName: "communitygrid", properties: {}, children: cards });
      }

      // "Prominent Members" is an unsourced list of named people (ZF publishes no such list), so it is not shown.
      const pm = rows.findIndex((x) => isEl(x, "h2") && /prominent members/i.test(textOf(x)));
      if (pm > -1) {
        let ui = pm + 1;
        while (ui < rows.length && !isEl(rows[ui], "ul") && !isEl(rows[ui], "h2")) ui++;
        rows.splice(pm, (isEl(rows[ui], "ul") ? ui + 1 : pm + 1) - pm);
      }
    }
    if (opts.sec && Array.isArray(tree.children)) {
      // Ecosystem Security: lead + timeline, updates and resources as cards, edit badge removed.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const nameOf = (x: any): string => x.tagName || x.name || "";
      const findHref = (x: any): string => {
        if (!x || typeof x !== "object") return "";
        if (nameOf(x) === "a" && x.properties?.href) return String(x.properties.href);
        for (const c of x.children || []) {
          const r = findHref(c);
          if (r) return r;
        }
        return "";
      };
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && x.type === "mdxJsxFlowElement" && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const h2At = (re: RegExp) => rows.findIndex((x) => isEl(x, "h2") && re.test(textOf(x).replace(/#$/, "").trim()));
      const nextUl = (from: number) => {
        let i = from + 1;
        while (i < rows.length && !isEl(rows[i], "ul") && !isEl(rows[i], "h2")) i++;
        return isEl(rows[i], "ul") ? i : -1;
      };
      const items = (ul: any) => (ul.children || []).filter((li: any) => isEl(li, "li") && textOf(li).trim());

      const roleH = h2At(/^ecosystem security lead/i);
      if (roleH > -1) {
        const lead = rows.findIndex((x, i) => i > roleH && isEl(x, "p") && textOf(x).trim().length > 60);
        if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
        const ui = nextUl(roleH);
        if (ui > -1) {
          const list = items(rows[ui]).map((li: any) => {
            const kids: any[] = li.children || [];
            const si = kids.findIndex((c) => isEl(c, "strong"));
            const year = si > -1 ? textOf(kids[si]).replace(/:\s*$/, "").trim() : "";
            const rest = kids.filter((_, i) => i !== si);
            if (rest[0] && rest[0].type === "text") rest[0] = { ...rest[0], value: rest[0].value.replace(/^\s+/, "") };
            return { type: "element", tagName: "timelineitem", properties: { year }, children: rest };
          });
          if (list.length) rows.splice(ui, 1, { type: "element", tagName: "timelinelist", properties: {}, children: list });
        }
      }

      const upd = h2At(/^recent security updates/i);
      if (upd > -1) {
        const ui = nextUl(upd);
        if (ui > -1) {
          // The hand-written list goes stale (it still named Zebra 4.4.1), so the live feed replaces it.
          rows[upd] = { ...rows[upd], children: [{ type: "text", value: "Recent Security Updates" }] };
          rows.splice(ui, 1,
            { type: "element", tagName: "p", properties: {}, children: [{ type: "text", value: "Live from GitHub (Zebra, zcashd and librustzcash). Updated hourly." }] },
            { type: "element", tagName: "securityfeed", properties: {}, children: [] },
          );
        }
      }

      const res = h2At(/^security resources/i);
      if (res > -1) {
        const ui = nextUl(res);
        if (ui > -1) {
          const cards = items(rows[ui]).map((li: any) => ({
            type: "element",
            tagName: "communitycard",
            properties: { name: textOf(li).trim(), desc: "", href: findHref(li), icon: "shield" },
            children: [],
          }));
          if (cards.length) rows.splice(ui, 1, { type: "element", tagName: "communitygrid", properties: {}, children: cards });
        }
      }
    }
    if (opts.eo && Array.isArray(tree.children)) {
      // Engineering Office Hours: title first, description as lead, one player + carousel with the whole playlist.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const blank = (x: any) => x && x.type === "text" && !String(x.value).trim();
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && x.type === "mdxJsxFlowElement" && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const dump = JSON.stringify(rows);
      const list = (dump.match(/list=(PL[\w-]{10,40})/) || [])[1];
      // The short "Collection of ..." line sits above the H1; move it below as a normal paragraph.
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const note = rows.findIndex((x, i) => i < h1 && isEl(x, "p") && /^collection of/i.test(textOf(x).trim()));
      if (h1 > -1 && note > -1) {
        const [n] = rows.splice(note, 1);
        rows.splice(h1, 0, rows.splice(rows.findIndex((x) => isEl(x, "h1")), 1)[0]);
        const nh = rows.findIndex((x) => isEl(x, "h1"));
        rows.splice(nh + 1, 0, n);
      }
      const lead = rows.findIndex((x) => isEl(x, "p") && textOf(x).trim().length > 120);
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      if (list) {
        // Drop the playlist link paragraph and the embedded playlist player; the carousel replaces both.
        const link = rows.findIndex((x) => isEl(x, "p") && /office hours playlist/i.test(textOf(x)));
        const embed = rows.findIndex((x) => !isEl(x, "p") && !blank(x) && JSON.stringify(x).includes("videoseries"));
        const at = embed > -1 ? embed : link;
        const carousel = { type: "element", tagName: "videocarousel", properties: { list }, children: [] };
        const button = { type: "element", tagName: "linkbutton", properties: { href: `https://www.youtube.com/playlist?list=${list}`, label: "Open playlist on YouTube" }, children: [] };
        const drop = [link, embed].filter((i) => i > -1).sort((a, b) => b - a);
        const insertAt = Math.min(...drop.length ? drop : [rows.length]);
        for (const i of drop) rows.splice(i, 1);
        rows.splice(insertAt, 0, carousel, button);
      }
    }
    if (opts.amb && Array.isArray(tree.children)) {
      // Global Ambassadors (text page): duties and communities as cards, website as a button.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const nameOf = (x: any): string => x.tagName || x.name || "";
      const findHref = (x: any): string => {
        if (!x || typeof x !== "object") return "";
        if (nameOf(x) === "a" && x.properties?.href && !String(x.properties.href).startsWith("#")) return String(x.properties.href);
        for (const c of x.children || []) {
          const r = findHref(c);
          if (r) return r;
        }
        return "";
      };
      const findTag = (x: any, tag: string): any[] => {
        const out: any[] = [];
        const go = (n: any) => {
          if (!n || typeof n !== "object") return;
          if (n.type === "element" && n.tagName === tag) out.push(n);
          (n.children || []).forEach(go);
        };
        go(x);
        return out;
      };
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && x.type === "mdxJsxFlowElement" && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const h2At = (re: RegExp) => rows.findIndex((x) => isEl(x, "h2") && re.test(textOf(x).replace(/#$/, "").trim()));
      const nextOf = (from: number, tag: string) => {
        let i = from + 1;
        while (i < rows.length && !isEl(rows[i], tag) && !isEl(rows[i], "h2")) i++;
        return isEl(rows[i], tag) ? i : -1;
      };
      const card = (properties: Record<string, unknown>) => ({ type: "element", tagName: "communitycard", properties, children: [] });
      const grid = (children: any[]) => ({ type: "element", tagName: "communitygrid", properties: {}, children });

      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p") && textOf(x).trim().length > 80);
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };

      // Website heading -> buttons right under the lead (the link on the wiki is an archived snapshot).
      const web = h2At(/^global ambassador website/i);
      let buttons: any[] = [];
      if (web > -1) {
        const href = findHref(rows[web]);
        rows.splice(web, 1);
        if (href) buttons.push({ type: "element", tagName: "linkbutton", properties: { href, label: "Global Ambassador Website" }, children: [] });
      }
      buttons.push({ type: "element", tagName: "linkbutton", properties: { href: "/zcash-global-ambassadors", label: "Explore the ambassador map" }, children: [] });

      // Duties.
      const duty = h2At(/^what does an ambassador do/i);
      if (duty > -1) {
        const ui = nextOf(duty, "ul");
        if (ui > -1) {
          const iconFor = (t: string) =>
            /meetup|event/i.test(t) && /host/i.test(t) ? "calendar"
              : /social media|content/i.test(t) ? "megaphone"
              : /translate/i.test(t) ? "languages"
              : /onboard/i.test(t) ? "userplus"
              : /conference|represent/i.test(t) ? "presentation" : "globe";
          const cards = (rows[ui].children || [])
            .filter((li: any) => isEl(li, "li") && textOf(li).trim())
            .map((li: any) => card({ name: textOf(li).trim(), desc: "", href: "", icon: iconFor(textOf(li)) }));
          if (cards.length) rows.splice(ui, 1, grid(cards));
        }
      }

      // Communities table -> cards.
      const comm = h2At(/^active ambassador communities/i);
      if (comm > -1) {
        let ti = comm + 1;
        let table: any = null;
        for (; ti < rows.length && !isEl(rows[ti], "h2"); ti++) {
          const t = findTag(rows[ti], "table")[0];
          if (t) { table = t; break; }
        }
        if (table) {
          const cards: any[] = [];
          for (const tr of findTag(table, "tr")) {
            const cells = (tr.children || []).filter((c: any) => isEl(c, "td"));
            if (cells.length < 2) continue;
            const region = textOf(cells[0]).trim();
            const name = textOf(cells[1]).trim().replace(/^Zcask\b/, "Zcash");
            let act = cells[2] ? textOf(cells[2]).trim() : "";
            if (act.toLowerCase() === region.toLowerCase()) act = "";
            act = act.replace(new RegExp("^" + region.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ",\\s*", "i"), "");
            cards.push(card({ name, desc: act ? `${region} \u00b7 ${act}` : region, href: findHref(cells[1]), icon: "x" }));
          }
          if (cards.length) rows.splice(ti, 1, grid(cards));
        }
      }

      // Get involved links.
      const apply = h2At(/^apply to become an ambassador/i);
      if (apply > -1) {
        const ui = nextOf(apply, "ul");
        if (ui > -1) {
          const cards = (rows[ui].children || [])
            .filter((li: any) => isEl(li, "li") && textOf(li).trim())
            .map((li: any) => {
              const t = textOf(li).trim();
              return card({ name: t, desc: "", href: findHref(li), icon: /discord/i.test(t) ? "discord" : /bount/i.test(t) ? "coins" : "globe" });
            });
          if (cards.length) rows.splice(ui, 1, grid(cards));
        }
      }

      if (lead > -1) rows.splice(lead + 1, 0, ...buttons);
    }
    if (opts.media && Array.isArray(tree.children)) {
      // Zcash Media: quote as lead, playlist player replaced by the video carousel.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && x.type === "mdxJsxFlowElement" && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p") && textOf(x).trim().length > 80);
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      const embed = rows.findIndex((x) => x && !isEl(x, "p") && x.type !== "text" && JSON.stringify(x).includes("videoseries"));
      const list = embed > -1 ? (JSON.stringify(rows[embed]).match(/list=(PL[\w-]{10,40})/) || [])[1] : "";
      if (embed > -1 && list) {
        rows.splice(embed, 1,
          { type: "element", tagName: "videocarousel", properties: { list, label: "All videos" }, children: [] },
          { type: "element", tagName: "linkbutton", properties: { href: `https://www.youtube.com/playlist?list=${list}`, label: "Open playlist on YouTube" }, children: [] },
        );
      }
    }
    if (opts.pod && Array.isArray(tree.children)) {
      // Podcasts: each playlist entry becomes a show header plus a rail of its latest episodes.
      const rows: any[] = tree.children;
      // Entries may be plain hast elements or raw-HTML (mdx jsx) nodes, so match on either name.
      const nm = (x: any): string => (x && (x.tagName || x.name)) || "";
      const isEl = (x: any, tag?: string) => x && (x.type === "element" || x.type === "mdxJsxFlowElement" || x.type === "mdxJsxTextElement") && (!tag || nm(x) === tag);
      const attr = (x: any, key: string): string => {
        if (x?.properties && x.properties[key] != null) return String(x.properties[key]);
        const a = (x?.attributes || []).find((t: any) => t.name === key);
        return a && typeof a.value === "string" ? a.value : "";
      };
      const findTag = (x: any, tag: string): any[] => {
        const out: any[] = [];
        const go = (n: any) => {
          if (!n || typeof n !== "object") return;
          if (isEl(n, tag)) out.push(n);
          (n.children || []).forEach(go);
        };
        go(x);
        return out;
      };
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && x.type === "mdxJsxFlowElement" && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p") && textOf(x).trim().length > 40);
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      const ui = rows.findIndex((x) => isEl(x, "ul") && JSON.stringify(x).includes("list=PL"));
      if (ui > -1) {
        const shows = (rows[ui].children || [])
          .filter((li: any) => isEl(li, "li"))
          .map((li: any) => {
            const a = findTag(li, "a")[0];
            const list = (JSON.stringify(li).match(/list=(PL[\w-]{10,40})/) || [])[1];
            const img = findTag(li, "img")[0];
            const src = attr(img, "src");
            const title = a ? textOf(a).trim() : "";
            if (!list || !title) return null;
            return {
              type: "element",
              tagName: "podcastshow",
              properties: { title, list, logo: /_unavailable/.test(src) ? "" : src },
              children: [],
            };
          })
          .filter(Boolean);
        if (shows.length) rows.splice(ui, 1, ...shows);
      }
    }
    if (opts.zcon && Array.isArray(tree.children)) {
      // Zcon archive: newest edition first, each as a header + description + playlist rail; chips jump between editions.
      const rows: any[] = tree.children;
      const nm = (x: any): string => (x && (x.tagName || x.name)) || "";
      const isEl = (x: any, tag?: string) => x && (x.type === "element" || x.type === "mdxJsxFlowElement" || x.type === "mdxJsxTextElement") && (!tag || nm(x) === tag);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && x.type === "mdxJsxFlowElement" && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      // Intro line above the H1 goes below it, as a normal paragraph.
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const note = rows.findIndex((x, i) => i < h1 && isEl(x, "p") && /^the following is/i.test(textOf(x).trim()));
      if (h1 > -1 && note > -1) {
        const [n] = rows.splice(note, 1);
        // After the lead paragraph (placed below once it is found), so the lead reads first.
        const h1n = rows.findIndex((x) => isEl(x, "h1"));
        const leadAt = rows.findIndex((x, i) => i > h1n && isEl(x, "p") && /annual conference/i.test(textOf(x)));
        rows.splice(leadAt > -1 ? leadAt + 1 : h1n + 1, 0, n);
      }
      const h1b = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1b && isEl(x, "p") && /annual conference/i.test(textOf(x)));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };

      const heads: number[] = [];
      rows.forEach((x, i) => {
        if (isEl(x, "h2") && /^zcon/i.test(textOf(x).replace(/#$/, "").trim())) heads.push(i);
      });
      if (heads.length) {
        const editions = heads.map((start, k) => {
          const end = k + 1 < heads.length ? heads[k + 1] : rows.length;
          const section = rows.slice(start, end);
          const head = textOf(rows[start]).replace(/#$/, "").trim();
          const m = head.match(/^(Zcon[\w]*)\s*:\s*(.*)$/i);
          // Zcon Vozes headings have no colon: "Zcon  Vozes Brasil" is edition 1, "Zcon Vozes 2" is edition 2.
          const v = head.match(/^zcon\s+vozes\s*(\d+)?/i);
          const label = v ? `Vozes ${v[1] || "1"}` : m ? m[1] : head;
          const title = v ? head.replace(/\s+/g, " ") : m ? m[2].trim() : head;
          const list = (JSON.stringify(section).match(/list=(PL[\w-]{10,40})/) || [])[1] || "";
          const desc = section
            .slice(1)
            .filter((x) => isEl(x, "p") && textOf(x).trim() && !/playlist\s*$/i.test(textOf(x).trim()))
            .map((x) => textOf(x).trim())
            .join(" ");
          return {
            label,
            desc,
            node: { type: "element", tagName: "zconedition", properties: { label, title, desc, list, anchor: label.toLowerCase() }, children: [] },
          };
        });
        const first = heads[0];
        const last = rows.length;
        const ordered = [...editions].reverse();
        // "2019 / Split, Croatia" style subtitle read from each description.
        const MONTHS = /^(January|February|March|April|May|June|July|August|September|October|November|December)$/;
        const sub = (desc: string) => {
          const year = (desc.match(/\b(20\d\d)\b/) || [])[1] || "";
          let place = "";
          if (/virtual|virutal/i.test(desc)) place = "Virtual";
          else {
            const m = desc.match(/\b(?:in|at)\s+(?:beautiful\s+)?((?:[A-Z][A-Za-z]+)(?:,?\s+[A-Z][A-Za-z]+)*)/);
            if (m) place = m[1].split(/,?\s+/).filter((w: string) => !MONTHS.test(w)).join(" ").replace(/\s+(?=[A-Z][a-z]+$)(?<=,)/, "");
            const c = desc.match(/\bin\s+(?:beautiful\s+)?([A-Z][A-Za-z ]+?,\s*[A-Z][A-Za-z]+)/);
            if (c) place = c[1];
          }
          // Facts the wiki text does not state (Museum of Tomorrow is in Rio; Vozes 2 was announced for S\u00e3o Paulo).
          if (!place && /museum of tomorrow/i.test(desc)) place = "Rio de Janeiro";
          if (!place && !year && /vozes 2/i.test(desc + " ")) place = "S\u00e3o Paulo";
          return [year, place].filter(Boolean).join(" \u00b7 ");
        };
        const nav = {
          type: "element",
          tagName: "chipnav",
          properties: { items: JSON.stringify(ordered.map((e) => ({ label: e.label, href: `#${e.label.toLowerCase()}`, sub: sub(e.desc + (e.label === "Vozes 2" ? " vozes 2" : "")) }))) },
          children: [],
        };
        const other = opts.zcon === "vozes"
          ? { name: "Zcon", desc: "The annual conference organized by the Zcash Foundation", href: "/zcash-community/zcon-archive" }
          : { name: "Zcon Vozes", desc: "The Brazilian edition, organized by Zcash Brasil", href: "/zcash-community/zcon-vozes" };
        const cross = {
          type: "element",
          tagName: "communitygrid",
          properties: {},
          children: [{ type: "element", tagName: "communitycard", properties: { ...other, icon: "globe" }, children: [] }],
        };
        rows.splice(first, last - first, nav, ...ordered.map((e) => e.node), cross);
      }
    }
    if (opts.node && Array.isArray(tree.children)) {
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      const firstStep = rows.findIndex((x) => isEl(x, "h2") && /^step\s+1\b/i.test(textOf(x).trim()));
      if (firstStep > -1) {
        const items = [
          { label: "Prerequisites", hint: "Hardware and software", href: "#prerequisites" },
          { label: "Zebra", hint: "Install the full node", href: "#install-and-run-zebra" },
          { label: "Zallet", hint: "Install and configure the wallet", href: "#install-zallet" },
          { label: "Troubleshooting", hint: "Common problems", href: "#troubleshooting" },
        ];
        const pre = rows.findIndex((x) => isEl(x, "h2") && /^prerequisites/i.test(textOf(x).trim()));
        rows.splice(pre > -1 ? pre : firstStep, 0, { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] });
      }
      // Additional resources: bullet list of "Link — description" -> link cards.
      const resH = rows.findIndex((x) => isEl(x, "h2") && /^additional resources/i.test(textOf(x).replace(/#$/, "").trim()));
      let resUl = resH + 1;
      while (resH > -1 && rows[resUl] && rows[resUl].type === "text" && !String(rows[resUl].value).trim()) resUl++;
      if (resH > -1 && isEl(rows[resUl], "ul")) {
        const cards: any[] = [];
        for (const li of rows[resUl].children || []) {
          if (!isEl(li, "li")) continue;
          const a = (li.children || []).find((c: any) => isEl(c, "a"));
          if (!a) continue;
          const full = textOf(li).trim();
          const name = textOf(a).trim();
          let desc = full.slice(full.indexOf(name) + name.length).replace(/^\s*[\u2014\u2013-]\s*/, "").trim();
          desc = desc.charAt(0).toUpperCase() + desc.slice(1);
          cards.push({ type: "element", tagName: "communitycard", properties: { name, desc, href: String(a.properties?.href || ""), icon: "globe" }, children: [] });
        }
        if (cards.length) rows.splice(resUl, 1, { type: "element", tagName: "communitygrid", properties: {}, children: cards });
      }
      // Hide an unfilled drafting placeholder left in the source content.
      for (let i = rows.length - 1; i >= 0; i--) {
        if (isEl(rows[i]) && /\[insert current ZecHub donation/i.test(textOf(rows[i]))) rows.splice(i, 1);
      }
    }
    if (opts.rpi5 && Array.isArray(tree.children)) {
      // RPi5 Zebra + lightwalletd + Zingo: numbered steps, no Edit badge, sources as a link list.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && x.type === "mdxJsxFlowElement" && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      // Commands written as inline code (alone in a paragraph or list item) become proper code blocks.
      const kidsOf = (x: any) => (x.children || []).filter((c: any) => !(c.type === "text" && !String(c.value).trim()) && !isEl(c, "br"));
      const loneCode = (x: any): any => {
        if (!isEl(x)) return null;
        const k = kidsOf(x);
        return k.length === 1 && isEl(k[0], "code") ? k[0] : null;
      };
      const block = (code: any) => ({ type: "element", tagName: "pre", properties: {}, children: [{ ...code, properties: { ...(code.properties || {}), className: ["language-bash"] } }] });
      for (let i = 0; i < rows.length; i++) {
        const x = rows[i];
        if (isEl(x, "p") && loneCode(x)) rows[i] = block(loneCode(x));
        else if (isEl(x, "ul")) {
          const lis = kidsOf(x).filter((c: any) => isEl(c, "li"));
          if (lis.length === 1 && loneCode(lis[0])) rows[i] = block(loneCode(lis[0]));
        }
      }
      // Same inside list items (a note plus its command).
      const nestBlocks = (x: any) => {
        for (const c of x.children || []) {
          if (isEl(c, "li")) {
            c.children = (c.children || []).map((y: any) => (isEl(y, "p") && loneCode(y) ? block(loneCode(y)) : y));
          } else if (isEl(c, "ul") || isEl(c, "ol")) nestBlocks(c);
        }
      };
      rows.forEach((x) => (isEl(x, "ul") || isEl(x, "ol")) && nestBlocks(x));
      // Merge consecutive code blocks (e.g. the two zebrad.toml settings).
      for (let i = rows.length - 2; i >= 0; i--) {
        let j = i + 1;
        while (j < rows.length && rows[j].type === "text" && !String(rows[j].value).trim()) j++;
        if (isEl(rows[i], "pre") && isEl(rows[j], "pre") && rows[i].children?.[0]?.children && rows[j].children?.[0]?.children) {
          rows[i].children[0].children = [
            { type: "text", value: textOf(rows[i]).replace(/\n$/, "") + "\n" + textOf(rows[j]) },
          ];
          rows.splice(i + 1, j - i);
        }
      }
      const src = rows.findIndex((x) => (isEl(x, "h1") || isEl(x, "h2")) && /^sources$/i.test(textOf(x).trim()));
      let n = 0;
      let seenVideo = false;
      rows.forEach((x, i) => {
        if (!isEl(x, "h2") || (src > -1 && i >= src)) return;
        const t = textOf(x).trim();
        if (/^video tutorial/i.test(t)) { seenVideo = true; return; }
        if (!seenVideo) return;
        n += 1;
        x.properties = { ...(x.properties || {}), dataStep: String(n) };
      });
      if (src > -1) {
        rows[src] = { ...rows[src], tagName: "h2" };
        const pre = rows.findIndex((x, i) => i > src && isEl(x, "pre"));
        if (pre > -1) {
          const urls = (textOf(rows[pre]).match(/https?:\/\/[^\s]+/g) || []).filter((u, k, a) => a.indexOf(u) === k);
          rows[pre] = {
            type: "element",
            tagName: "ul",
            properties: {},
            children: urls.map((u) => ({
              type: "element",
              tagName: "li",
              properties: {},
              children: [{ type: "element", tagName: "a", properties: { href: u }, children: [{ type: "text", value: u.replace(/^https?:\/\//, "") }] }],
            })),
          };
        }
      }
    }
    if (opts.rpi4z && Array.isArray(tree.children)) {
      // Raspberry Pi 4 Zebra guide: the Installation list becomes numbered steps; pointer to the newer full-node guide.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const inst = rows.findIndex((x) => isEl(x, "h2") && /^installation/i.test(textOf(x).trim()));
      const ol = rows.findIndex((x, i) => i > inst && isEl(x, "ol"));
      if (inst > -1 && ol > -1) {
        const out: any[] = [];
        let n = 0;
        for (const li of rows[ol].children || []) {
          if (!isEl(li, "li")) continue;
          const kids = (li.children || []).filter((c: any) => !(c.type === "text" && !String(c.value).trim()));
          const first = kids[0];
          const strong = isEl(first, "p") ? (first.children || []).find((c: any) => isEl(c, "strong")) : null;
          if (!strong) { out.push(...kids); continue; }
          n += 1;
          out.push({ type: "element", tagName: "h3", properties: { dataStep: String(n) }, children: [{ type: "text", value: textOf(strong).trim() }] });
          const rest = (first.children || []).filter((c: any) => c !== strong && !(c.type === "text" && !String(c.value).trim()));
          if (rest.length) {
            const lead = rest[0];
            if (lead.type === "text") lead.value = String(lead.value).replace(/^\s+/, "");
            out.push({ ...first, children: rest });
          }
          // Commands are bold-only paragraphs: group them into one code block per step.
          const cmd = (x: any): string => {
            if (!isEl(x, "p")) return "";
            const k = (x.children || []).filter((c: any) => !(c.type === "text" && !String(c.value).trim()));
            if (k.length && k.every((c: any) => isEl(c, "strong") || isEl(c, "code") || c.type === "text" || isEl(c, "a"))) {
              const t = textOf(x).trim();
              return /^(sudo |git |cd |cargo |cp |\.\/|mkdir |curl |wget )/.test(t) ? t : "";
            }
            return "";
          };
          let buf: string[] = [];
          const flush = () => {
            if (!buf.length) return;
            out.push({ type: "element", tagName: "pre", properties: {}, children: [{ type: "element", tagName: "code", properties: { className: ["language-bash"] }, children: [{ type: "text", value: buf.join("\n") }] }] });
            buf = [];
          };
          for (const c of kids.slice(1)) {
            const t = cmd(c);
            if (t) buf.push(t);
            else { flush(); out.push(c); }
          }
          flush();
        }
        rows.splice(ol, 1, ...out);
      }
      // The loose Zebra logo near the end joins the Raspberry Pi photo at the top as a pair.
      const tagOf = (x: any): string => x?.tagName || x?.name || "";
      const imgOf = (x: any): any => {
        if (!x || typeof x !== "object") return null;
        if (tagOf(x) === "img") return x;
        for (const c of x.children || []) {
          const r = imgOf(c);
          if (r) return r;
        }
        return null;
      };
      const altOf = (x: any): string => {
        const im = imgOf(x);
        if (!im) return "";
        if (im.properties?.alt != null) return String(im.properties.alt);
        const hit = (im.attributes || []).find((at: any) => at.name === "alt");
        return hit && typeof hit.value === "string" ? hit.value : "";
      };
      const piAt = rows.findIndex((x) => /raspberry pi/i.test(altOf(x)));
      const zbAt = rows.findIndex((x) => /zebra logo/i.test(altOf(x)));
      if (piAt > -1 && zbAt > -1) {
        // One combined illustration (Pi 4 board with the Zebra logo), centered.
        rows[piAt] = {
          type: "element",
          tagName: "div",
          properties: { className: ["my-8", "mx-auto", "max-w-md"] },
          children: [
            {
              type: "element",
              tagName: "img",
              properties: { src: "/rpi4-zebra.webp", alt: "Raspberry Pi 4 board with the Zebra logo", className: ["w-full", "max-w-md", "h-auto"] },
              children: [],
            },
          ],
        };
        rows.splice(zbAt, 1);
      }
      const lead = rows.findIndex((x) => isEl(x, "p") && textOf(x).trim().length > 60);
      if (lead > -1) {
        rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
        const note = {
          type: "element",
          tagName: "guidecallout",
          properties: { title: "Newer guide available" },
          children: [
            {
              type: "element",
              tagName: "p",
              properties: {},
              children: [
                { type: "text", value: "Looking for the complete setup with Zebra and the Zallet wallet on a Pi 4? See the " },
                { type: "element", tagName: "a", properties: { href: "/guides/raspberry-pi-4-full-node" }, children: [{ type: "text", value: "full node guide" }] },
                { type: "text", value: "." },
              ],
            },
          ],
        };
        rows.splice(lead + 1, 0, note);
      }
    }
    if (opts.hz && Array.isArray(tree.children)) {
      // Hardened Zebra guide: summary bullets as lead lines, setup sections as numbered steps.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const ul = rows.findIndex((x, i) => i > h1 && isEl(x, "ul"));
      if (h1 > -1 && ul > -1 && ul < rows.findIndex((x) => isEl(x, "h2"))) {
        const items = (rows[ul].children || []).filter((c: any) => isEl(c, "li"));
        const paras = items.map((li: any) => ({
          type: "element",
          tagName: "p",
          properties: { dataLead: "true" },
          children: (li.children || []).flatMap((c: any) => (isEl(c, "p") ? c.children || [] : [c])),
        }));
        rows.splice(ul, 1, ...paras);
      }
      // Raw <pre><code> blocks arrive without a language class and render as inline code; give them one.
      const fixPre = (x: any) => {
        if (!x || typeof x !== "object") return;
        if (isEl(x, "pre")) {
          for (const c of x.children || []) {
            if (isEl(c, "code")) {
              const cur = Array.isArray(c.properties?.className) ? c.properties.className : [];
              if (!cur.some((k: string) => String(k).startsWith("language-"))) c.properties = { ...(c.properties || {}), className: [...cur, "language-bash"] };
            }
          }
        }
        (x.children || []).forEach(fixPre);
      };
      rows.forEach(fixPre);
      const start = rows.findIndex((x) => isEl(x, "h3") && /^1\.\s/.test(textOf(x).trim()));
      const end = rows.findIndex((x) => isEl(x, "h2") && /^daily usage/i.test(textOf(x).trim()));
      if (start > -1) {
        let n = 0;
        for (let i = start; i < (end > -1 ? end : rows.length); i++) {
          const x = rows[i];
          if (isEl(x, "h3") && /^1\.\s/.test(textOf(x).trim())) {
            rows[i] = { ...x, tagName: "h2", properties: { ...(x.properties || {}), dataStep: "1" }, children: [{ type: "text", value: textOf(x).trim().replace(/^1\.\s+/, "") }] };
            n = 1;
          } else if (isEl(x, "h2") && n > 0) {
            n += 1;
            x.properties = { ...(x.properties || {}), dataStep: String(n) };
          }
        }
      }
    }
    if (opts.akash && Array.isArray(tree.children)) {
      // Akash zcashd guide (deprecated): callout for the notice, "->" paragraphs as real lists, code blocks with a language.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      if (opts.akashBtn) {
        // Zebra version: heading levels are off by one (sections are H3, steps H4, options H5).
        let step = 0;
        for (const x of rows) {
          if (!isEl(x)) continue;
          const t = textOf(x).trim();
          if (x.tagName === "h3") {
            if (/^important:/i.test(t)) x.properties = { ...(x.properties || {}), dataRule: "true" };
            else x.tagName = "h2";
          } else if (x.tagName === "h4") {
            const m = /^Step\s+(\d+):\s*(.+)$/i.exec(t);
            if (m) {
              step = Number(m[1]);
              x.tagName = "h2";
              x.properties = { ...(x.properties || {}), dataStep: m[1] };
              x.children = [{ type: "text", value: m[2] }];
            } else {
              x.tagName = "h3";
              x.properties = { ...(x.properties || {}), dataRule: "true" };
            }
          } else if (x.tagName === "h5") {
            x.tagName = "h3";
            x.properties = { ...(x.properties || {}), dataRule: "true" };
          }
        }
      }
      const bq = rows.findIndex((x) => isEl(x, "blockquote"));
      if (bq > -1) {
        const kids = (rows[bq].children || []).filter((c: any) => !(c.type === "text" && !String(c.value).trim()));
        rows[bq] = { type: "element", tagName: "guidecallout", properties: { title: "zcashd is no longer supported" }, children: kids };
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p") && /(^|\s)guide for deploying/i.test(textOf(x).trim()));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      const arrow = (x: any) => isEl(x, "p") && /^->\s/.test(textOf(x).trim());
      for (let i = 0; i < rows.length; i++) {
        if (!arrow(rows[i])) continue;
        let j = i;
        const items: any[] = [];
        while (j < rows.length && (arrow(rows[j]) || (rows[j].type === "text" && !String(rows[j].value).trim()))) {
          if (arrow(rows[j])) {
            const ch = [...(rows[j].children || [])];
            if (ch[0]?.type === "text") ch[0] = { ...ch[0], value: String(ch[0].value).replace(/^\s*->\s*/, "") };
            items.push({ type: "element", tagName: "li", properties: {}, children: ch });
          }
          j++;
        }
        rows.splice(i, j - i, { type: "element", tagName: "ul", properties: {}, children: items });
      }
      const fixPre = (x: any) => {
        if (!x || typeof x !== "object") return;
        if (isEl(x, "pre")) {
          for (const c of x.children || []) {
            if (isEl(c, "code")) {
              const cur = Array.isArray(c.properties?.className) ? c.properties.className : [];
              if (!cur.some((k: string) => String(k).startsWith("language-"))) c.properties = { ...(c.properties || {}), className: [...cur, "language-bash"] };
            }
          }
        }
        (x.children || []).forEach(fixPre);
      };
      rows.forEach(fixPre);
      // Swap the "Deploy on Akash" button image for the current one.
      const swapBtn = (x: any) => {
        if (!x || typeof x !== "object") return;
        if ((x.tagName || x.name) === "img") {
          const alt = x.properties?.alt ?? (x.attributes || []).find((at: any) => at.name === "alt")?.value ?? "";
          if (/deploy (on|with) akash/i.test(String(alt))) {
            if (x.attributes) {
              for (const at of x.attributes) if (at.name === "src") at.value = "/deploy-with-akash.png";
            } else {
              x.properties = { ...(x.properties || {}), src: "/deploy-with-akash.png" };
            }
          }
        }
        (x.children || []).forEach(swapBtn);
      };
      rows.forEach(swapBtn);
    }
    if (opts.akashz && Array.isArray(tree.children)) {
      // Zebra on Akash: lead, update notice, jump list, port-mapping and warning callouts, real comparison table, resource cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const hTxt = (x: any) => textOf(x).replace(/#$/, "").trim();
      const hasBadge = (x: any): boolean => isEl(x, "img") && /shields\.io\/badge\/edit/i.test(String(x.properties?.src || "")) || (x?.children || []).some(hasBadge);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (isWs(x) || isEl(x, "hr") || hasBadge(x)) rows.splice(i, 1);
      }
      const rep = (n: any, from: string, to: string) => {
        if (n?.type === "text" && typeof n.value === "string" && n.value.includes(from)) n.value = n.value.split(from).join(to);
        (n?.children || []).forEach((c: any) => rep(c, from, to));
      };
      // Storage figures follow the Zebra requirements page (about 300 GB mainnet, 10 GB testnet).
      for (const r of rows) {
        rep(r, "(100GB+ for mainnet, ~40GB for testnet)", "(about 300 GB for mainnet and 10 GB for testnet, per the Zebra requirements page)");
        rep(r, "100GB+ for mainnet, ~40GB for testnet", "about 300 GB for mainnet and 10 GB for testnet");
        rep(r, "Storage: size: 120Gi (minimum for mainnet)", "Storage: keep at least 300Gi on mainnet (Zebra's requirements page lists about 300 GB)");
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      // "Important: Port Mapping" block becomes a callout.
      const pm = rows.findIndex((x) => isEl(x, "h3") && /^important:\s*port mapping/i.test(textOf(x).trim()));
      if (pm > -1) {
        let end = pm + 1;
        while (end < rows.length && !isEl(rows[end], "h2") && !isEl(rows[end], "h3")) end++;
        const body = rows.slice(pm + 1, end);
        rows.splice(pm, end - pm, el("guidecallout", { title: "Port mapping on Akash" }, body));
      }
      // "Warning:", "Note:" paragraphs become callouts.
      const kinds: Record<string, string> = { "warning": "Warning", "note": "Note", "port mapping reminder": "Port mapping reminder", "note the port mapping": "Port mapping" };
      for (let k = 0; k < rows.length; k++) {
        const x = rows[k];
        if (!isEl(x, "p")) continue;
        const kids: any[] = x.children || [];
        const f = kids.findIndex((c: any) => !isWs(c));
        if (f < 0 || !isEl(kids[f], "strong")) continue;
        const label = textOf(kids[f]).trim().replace(/:$/, "").toLowerCase();
        if (!kinds[label]) continue;
        kids.splice(f, 1);
        if (kids[f]?.type === "text") kids[f] = txt(String(kids[f].value).replace(/^\s*:?\s*/, ""));
        rows[k] = el("guidecallout", { title: kinds[label] }, [x]);
      }
      // Mainnet vs Testnet: the ASCII table becomes a real table.
      const mi = rows.findIndex((x) => isEl(x, "h2") && /^mainnet vs testnet/i.test(hTxt(x)));
      if (mi > -1) {
        const pi = rows.findIndex((x, i) => i > mi && isEl(x, "pre"));
        if (pi > -1) {
          const lines = textOf(rows[pi]).split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|"));
          const cells = lines.map((l) => l.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim()));
          if (cells.length > 2) {
            const [head, ...body] = cells;
            const cell = (tag: string, t: string) => el(tag, {}, [txt(t)]);
            rows[pi] = el("table", {}, [
              el("thead", {}, [el("tr", {}, head.map((c, i) => cell("th", i === 0 ? "" : c)))]),
              el("tbody", {}, body.map((r) => el("tr", {}, r.map((c) => cell("td", c))))),
            ]);
          }
        }
      }
      // Resources as cards.
      const ri = rows.findIndex((x) => isEl(x, "h2") && /^additional resources/i.test(hTxt(x)));
      if (ri > -1) {
        const card = (name: string, desc: string, href: string) => el("communitycard", { name, desc, href }, []);
        rows.splice(ri, rows.length - ri,
          el("h2", {}, [txt("Additional resources")]),
          el("communitygrid", {}, [
            card("Akash Console", "Managed console for creating and monitoring deployments.", "https://console.akash.network"),
            card("Console Air", "Self-hosted console that works with your own wallet.", "https://github.com/akash-network/console-air"),
            card("Akash documentation", "Deployment guides, SDL reference and billing.", "https://akash.network/docs/"),
            card("Zebra documentation", "Requirements, configuration and release notes.", "https://zebra.zfnd.org/user/requirements.html"),
            card("Zcash explorers", "Check your node's view of the chain against public explorers.", "/guides/blockchain-explorers"),
            card("Akash Discord", "Help with providers and deployments.", "https://discord.akash.network"),
          ]),
        );
      }
      const note = el("guidecallout", { title: "Check before you deploy" }, [
        el("ul", { className: ["m-0"] }, [
          el("li", {}, [el("strong", {}, [txt("Akash tooling has changed. ")]), txt("Akash's docs now describe two consoles: console.akash.network (managed, email sign-in and card billing) and Console Air (self-hosted, with your own Keplr wallet). Deposits there are held in ACT, and AKT pays transaction fees. Steps 1 to 3 below, including the 5 AKT deposit, follow the older wallet flow and may differ on screen.")]),
          el("li", {}, [el("strong", {}, [txt("Storage: ")]), txt("Zebra's requirements page lists about 300 GB for mainnet (and growing) and 10 GB for testnet. Size your SDL accordingly.")]),
          el("li", {}, [el("strong", {}, [txt("Costs: ")]), txt("the monthly figures are estimates. Provider bids and token prices change, so rely on the bids you see in the console.")]),
        ]),
      ]);
      const jump = el("jumpnav", {
        title: "Jump to",
        items: JSON.stringify([
          { label: "Prerequisites", hint: "Wallet and funds", href: "#prerequisites" },
          { label: "Deploy", hint: "Seven steps", href: "#connect-your-wallet" },
          { label: "Configuration", hint: "Testnet, RPC, metrics", href: "#configuration-options" },
          { label: "Troubleshooting", hint: "Common problems", href: "#troubleshooting" },
          { label: "Costs", hint: "Keep spending in check", href: "#cost-management" },
        ]),
      }, []);
      if (lead > -1) rows.splice(lead + 1, 0, note, jump);
    }
    if (opts.mig && Array.isArray(tree.children)) {
      // zcashd -> Zebra/Zallet migration: bold-only paragraphs become numbered steps and sub-headings.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const blank = (c: any) => c.type === "text" && !String(c.value).trim();
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      const out: any[] = [];
      for (let i = 0; i < rows.length; i++) {
        const x = rows[i];
        const kids = isEl(x, "p") ? (x.children || []).filter((c: any) => !blank(c)) : [];
        const strong = kids[0] && isEl(kids[0], "strong") ? kids[0] : null;
        if (!strong || i <= lead) { out.push(x); continue; }
        const t = textOf(strong).trim();
        const rest = kids.slice(1).filter((c: any) => !isEl(c, "br"));
        const restText = rest.map((c: any) => textOf(c)).join("").trim();
        const m = /^(\d+)\.\s+(.+)$/.exec(t);
        let head: any = null;
        if (m) {
          const plain = /^(troubleshooting|conclusion)$/i.test(m[2].trim());
          head = { type: "element", tagName: "h2", properties: plain ? {} : { dataStep: m[1] }, children: [{ type: "text", value: m[2] }] };
        } else if (/[.:]$/.test(t) && restText && !/^option [ab]/i.test(t)) {
          out.push(x); // bold lead-in sentence ("What does not come across. ...") stays as a paragraph
          continue;
        } else if (!restText && /:$/.test(t)) {
          out.push(x); // bold label introducing a code block ("Start the node:") stays a paragraph
          continue;
        } else if (!restText || /^option [ab]/i.test(t)) {
          head = { type: "element", tagName: "h3", properties: { dataRule: "true" }, children: [{ type: "text", value: t }] };
        } else { out.push(x); continue; }
        out.push(head);
        if (restText) {
          if (rest[0]?.type === "text") rest[0] = { ...rest[0], value: String(rest[0].value).replace(/^\s+/, "") };
          out.push({ type: "element", tagName: "p", properties: {}, children: rest });
        }
      }
      rows.splice(0, rows.length, ...out);
      // Commands that were pasted as code screenshots become real, copyable code blocks (text read from the images / their SVG source).
      const SHOTS: Record<string, string> = {
        "SJ_0mUtTxg": "cp ~/.zcash/wallet.dat ~/wallet_backup.dat",
        "HJhYu8Y6el": "curl -L https://get.zebra.zfnd.org | bash",
        "Syg8FUK6eg": "git clone https://github.com/ZcashFoundation/zebra.git\ncd zebra\ncargo build --release",
        "BJ0zjLY6ll": "sudo mv target/release/zebrad /usr/local/bin/",
        "HJV1C8tTxx": "zebrad generate-config > ~/.config/zebra/zebrad.toml",
        "H1KPkvt6gl": "zebrad start",
        "SyUFxvFTex": "git clone https://github.com/ZcashFoundation/zallet.git\ncd zallet\ncargo build --release",
        "SyIyVDY6xl": "zebrad metrics",
        "r1HfVPF6gg": "tail -f ~/.local/share/zebra/zebrad.log",
      };
      const srcOf = (x: any): string => {
        if (!x || typeof x !== "object") return "";
        if ((x.tagName || x.name) === "img") {
          return String(x.properties?.src ?? (x.attributes || []).find((at: any) => at.name === "src")?.value ?? "");
        }
        for (const c of x.children || []) {
          const r = srcOf(c);
          if (r) return r;
        }
        return "";
      };
      for (let i = 0; i < rows.length; i++) {
        const src = srcOf(rows[i]);
        const key = Object.keys(SHOTS).find((k) => src.includes(k));
        if (!key || textOf(rows[i]).trim()) continue;
        rows[i] = { type: "element", tagName: "pre", properties: {}, children: [{ type: "element", tagName: "code", properties: { className: ["language-bash"] }, children: [{ type: "text", value: SHOTS[key] }] }] };
      }
      const fixPre = (x: any) => {
        if (!x || typeof x !== "object") return;
        if (isEl(x, "pre")) {
          for (const c of x.children || []) {
            if (isEl(c, "code")) {
              const cur = Array.isArray(c.properties?.className) ? c.properties.className : [];
              if (!cur.some((k: string) => String(k).startsWith("language-"))) c.properties = { ...(c.properties || {}), className: [...cur, "language-bash"] };
            }
          }
        }
        (x.children || []).forEach(fixPre);
      };
      rows.forEach(fixPre);
    }
    if (opts.mstake && Array.isArray(tree.children)) {
      // Mining & staking privacy: the page ships rainbow cards (emerald/blue/amber/rose); restyle them with the site theme.
      const rows: any[] = tree.children;
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const recolor = (cls: string): string => {
        let c = cls;
        if (/rose-/.test(c)) {
          return c
            .replace(/dark:border-rose-\d+/g, "dark:border-amber-500/40")
            .replace(/border-rose-\d+/g, "border-amber-500/40")
            .replace(/dark:bg-rose-\d+/g, "dark:bg-amber-500/10")
            .replace(/bg-rose-\d+/g, "bg-amber-500/10")
            .replace(/dark:text-rose-300/g, "dark:text-amber-400")
            .replace(/text-rose-700/g, "text-amber-700")
            .replace(/dark:text-rose-\d+/g, "dark:text-slate-200")
            .replace(/text-rose-\d+/g, "text-slate-800");
        }
        if (/rounded-full/.test(c) && /bg-(emerald|blue|amber)-600/.test(c)) {
          return c.replace(/bg-(emerald|blue|amber)-600/, "border border-brand/50 bg-brand/10").replace(/\btext-white\b/, "text-brand dark:text-brand-soft");
        }
        return c
          .replace(/dark:border-(emerald|blue|amber)-\d+/g, "dark:border-white/10")
          .replace(/border-(emerald|blue|amber)-\d+/g, "border-slate-200")
          .replace(/dark:bg-(emerald|blue|amber)-\d+/g, "dark:bg-white/5")
          .replace(/bg-(emerald|blue|amber)-\d+/g, "bg-slate-50/60")
          .replace(/dark:text-(emerald|blue|amber)-300/g, "dark:text-brand-soft")
          .replace(/text-(emerald|blue|amber)-700/g, "text-brand")
          .replace(/dark:text-(emerald|blue|amber)-(50|100)/g, "dark:text-slate-100")
          .replace(/text-(emerald|blue|amber)-(900|950)/g, "text-slate-800");
      };
      const walkCls = (x: any) => {
        if (!x || typeof x !== "object") return;
        if (x.properties?.className) {
          const v = x.properties.className;
          x.properties.className = Array.isArray(v) ? recolor(v.join(" ")).split(/\s+/).filter(Boolean) : recolor(String(v));
        }
        for (const at of x.attributes || []) {
          if ((at.name === "className" || at.name === "class") && typeof at.value === "string") at.value = recolor(at.value);
        }
        (x.children || []).forEach(walkCls);
      };
      rows.forEach(walkCls);
      // Lists inside the raw HTML cards come without list styling.
      const walkUl = (x: any) => {
        if (!x || typeof x !== "object") return;
        const tag = x.tagName || x.name;
        if (tag === "ul") {
          const cls = "list-disc space-y-1 pl-5 marker:text-amber-600 dark:marker:text-amber-400";
          if (x.attributes) {
            const hit = x.attributes.find((at: any) => at.name === "className" || at.name === "class");
            if (hit) hit.value = `${hit.value || ""} ${cls}`.trim();
            else x.attributes.push({ type: "mdxJsxAttribute", name: "className", value: cls });
          } else {
            const cur = Array.isArray(x.properties?.className) ? x.properties.className : [];
            x.properties = { ...(x.properties || {}), className: [...cur, ...cls.split(" ")] };
          }
        }
        (x.children || []).forEach(walkUl);
      };
      rows.forEach(walkUl);
    }
    if (opts.wb && Array.isArray(tree.children)) {
      // My First Zcash Workbook: numbered sections with a jump list, buttons for the links, creators as cards.
      let rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const blank = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const hrefOf = (x: any): string => {
        if (!x || typeof x !== "object") return "";
        if ((x.tagName || x.name) === "a" && x.properties?.href) return String(x.properties.href);
        for (const c of x.children || []) {
          const r = hrefOf(c);
          if (r) return r;
        }
        return "";
      };
      const slugify = (t: string) => t.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/[\s-]+/g, "-");
      rows = rows.filter((x) => !(isEl(x, "hr") || blank(x)) && !(x && (x.type === "mdxJsxFlowElement") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")));
      // Lead paragraph + link buttons for download / outline / repo.
      const intro = rows.findIndex((x) => isEl(x, "h2") && /^introduction/i.test(textOf(x).trim()));
      const firstP = rows.findIndex((x, i) => i > intro && isEl(x, "p"));
      if (firstP > -1) rows[firstP].properties = { ...(rows[firstP].properties || {}), dataLead: "true" };
      const linkLabels: Record<string, string> = { outline: "Download the workbook (PDF)", "github repo": "GitHub repository", "zcash discord": "Join the Zcash Discord", license: "Read the license" };
      for (let i = 0; i < rows.length; i++) {
        const x = rows[i];
        if (!isEl(x, "p")) continue;
        const t = textOf(x).trim().toLowerCase();
        const href = hrefOf(x);
        if (linkLabels[t] && href && textOf(x).trim().length < 30) {
          rows[i] = { type: "element", tagName: "linkbutton", properties: { href, label: linkLabels[t] }, children: [] };
        }
      }
      // Drop the lead-in sentence that only introduced the PDF link (the button says it).
      // Sections: "N. Title" -> numbered step.
      const nav: any[] = [];
      const lic = rows.findIndex((x) => isEl(x, "h1") && /^license/i.test(textOf(x).trim()));
      if (lic > -1) rows[lic] = { ...rows[lic], tagName: "h2" };
      for (const x of rows) {
        if (!isEl(x, "h2")) continue;
        const m = /^(\d+)\.\s+(.+)$/.exec(textOf(x).trim());
        if (!m) continue;
        x.properties = { ...(x.properties || {}), dataStep: m[1] };
        x.children = [{ type: "text", value: m[2] }];
        nav.push({ label: m[2].replace(/^Meet the Creators.*/i, "Meet the creators"), hint: `Section ${m[1]}`, href: `#${slugify(m[2])}` });
      }
      // Creators: name / description paragraph pairs become cards.
      const cr = rows.findIndex((x) => isEl(x, "h2") && /meet the creators/i.test(textOf(x)));
      if (cr > -1) {
        let j = cr + 2; // skip heading and its intro paragraph
        const cards: any[] = [];
        while (j + 1 < rows.length && isEl(rows[j], "p") && isEl(rows[j + 1], "p") && textOf(rows[j]).trim().length < 50) {
          let desc = textOf(rows[j + 1]).trim();
          const who = textOf(rows[j]).trim();
          // Zksquirrel: now ZecHub core team (no longer a Zcash Arborist); drop the outdated note-taker and education clauses.
          if (/^zksquirrel/i.test(who)) desc = "ZecHub core team member.";
          // Pacu: now working at ZODL (replaces the old ZCG grant mention).
          if (/^pacu/i.test(who)) desc = "A longtime Zcash wallet developer, previously at ECC working on SDKs and Light Client technology, now working at ZODL.";
          cards.push({ type: "element", tagName: "communitycard", properties: { name: textOf(rows[j]).trim(), desc, icon: "users" }, children: [] });
          j += 2;
        }
        if (cards.length) rows.splice(cr + 2, j - (cr + 2), { type: "element", tagName: "communitygrid", properties: {}, children: cards });
      }
      // Jump list of the nine sections after the intro buttons.
      const firstStep = rows.findIndex((x) => isEl(x, "h2") && x.properties?.dataStep === "1");
      if (firstStep > -1 && nav.length) {
        rows.splice(firstStep, 0, { type: "element", tagName: "jumpnav", properties: { title: "Sections", items: JSON.stringify(nav) }, children: [] });
      }
      tree.children = rows;
    }
    if (opts.zenith && Array.isArray(tree.children)) {
      // Zenith installation: videos as a carousel, commands as code blocks, numbered steps, caution notice, jump list.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const h2Text = (x: any) => textOf(x).replace(/#$/, "").trim();
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (isWs(x)) rows.splice(i, 1);
        else if (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const codeBlock = (lines: string[], lang: string) => el("pre", {}, [el("code", { className: ["language-" + lang] }, [txt(lines.join("\n") + "\n")])]);
      const iframesIn = (n: any, acc: any[] = []) => {
        if (isEl(n, "iframe") || (n && n.type === "mdxJsxFlowElement" && String(n.name) === "iframe")) acc.push(n);
        (n?.children || []).forEach((c: any) => iframesIn(c, acc));
        return acc;
      };
      const srcOf = (f: any) => String(f.properties?.src ?? (f.attributes || []).find((a: any) => a.name === "src")?.value ?? "");
      const titleOf = (f: any) => String(f.properties?.title ?? (f.attributes || []).find((a: any) => a.name === "title")?.value ?? "Video");
      // 1. Videos: one carousel under "Video Tutorial".
      const vh = rows.findIndex((x) => isEl(x, "h2") && /^video tutorial/i.test(h2Text(x)));
      if (vh > -1) {
        let end = vh + 1;
        const videos: { id: string; title: string }[] = [];
        while (end < rows.length && !isEl(rows[end], "h2")) {
          for (const f of iframesIn(rows[end])) {
            const m = /embed\/([\w-]{6,})/.exec(srcOf(f));
            if (m) videos.push({ id: m[1], title: titleOf(f) });
          }
          end += 1;
        }
        if (videos.length) rows.splice(vh + 1, end - vh - 1, el("videoslider", { videos: JSON.stringify(videos) }));
      }
      // 2. Commands written as blockquotes, bullet lists and bare lines become code blocks.
      const bqText = (x: any) => textOf(x).replace(/\s+$/g, "").trim();
      const isCmd = (x: any) => isEl(x, "blockquote") && bqText(x).length > 0;
      let i = 0;
      while (i < rows.length) {
        if (isCmd(rows[i])) {
          let j = i;
          const lines: string[] = [];
          while (j < rows.length && isCmd(rows[j])) { lines.push(bqText(rows[j])); j += 1; }
          rows.splice(i, j - i, codeBlock(lines, "bash"));
        }
        i += 1;
      }
      // Compile list ("./configure", "cabal build", ...) becomes one block.
      for (let k = 0; k < rows.length; k++) {
        if (isEl(rows[k], "ul") && /^\s*\.\/configure/.test(textOf(rows[k]))) {
          const lines = (rows[k].children || []).filter((c: any) => isEl(c, "li")).map((c: any) => textOf(c).trim());
          rows[k] = codeBlock(lines, "bash");
        }
      }
      // zebrad.toml options: comment headings plus option lines become one config block.
      const zi = rows.findIndex((x) => isEl(x, "h2") && /^install zebra/i.test(h2Text(x)));
      if (zi > -1) {
        let a = zi + 1;
        while (a < rows.length && !(isEl(rows[a], "h4") || (isEl(rows[a], "p") && /^[a-z_]+\s=\s/.test(textOf(rows[a]).trim())))) a += 1;
        let b = a;
        const lines: string[] = [];
        while (b < rows.length && !isEl(rows[b], "h2") && !isEl(rows[b], "h3") && (isEl(rows[b], "h4") || isEl(rows[b], "p") || isEl(rows[b], "pre"))) {
          const t = textOf(rows[b]).trim();
          if (isEl(rows[b], "h4")) lines.push("# " + t);
          else lines.push(t);
          b += 1;
        }
        if (lines.length && b > a) rows.splice(a, b - a, codeBlock(lines, "toml"));
      }
      // zenith.cfg options ("key = value" paragraphs) become one config block.
      for (let k = 0; k < rows.length; k++) {
        if (isEl(rows[k], "p") && /^(nodeUser|nodePwd|nodePort|dbFileName|zebraHost|zebraPort)\s=\s/.test(textOf(rows[k]).trim())) {
          let e = k;
          const lines: string[] = [];
          while (e < rows.length && isEl(rows[e], "p") && /^\w+\s=\s/.test(textOf(rows[e]).trim())) { lines.push(textOf(rows[e]).trim()); e += 1; }
          rows.splice(k, e - k, codeBlock(lines, "ini"));
        }
      }
      // 3. Heading polish and numbered steps.
      let n = 0;
      for (const r of rows) {
        if (isEl(r, "h3") && /^install depedencies$/i.test(textOf(r).trim())) r.children = [txt("Install Dependencies")];
        if (!isEl(r, "h2")) continue;
        const t = h2Text(r);
        if (/^video tutorial|^rpc/i.test(t)) continue;
        n += 1;
        r.properties = { ...(r.properties || {}), dataStep: String(n) };
      }
      // 4. Caution notice and jump list after the title.
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const notice = {
        type: "element",
        tagName: "guidecallout",
        properties: { title: "Before you start" },
        children: [el("p", { className: ["m-0"] }, [txt("This guide builds Zenith on a Raspberry Pi (aarch64) against a local Zebra node, and it pins Zebra v2.1.0 and Zenith 0.7.2.0-beta. Zebra v2.1.0 is an old release: network upgrades since then, including NU6.2 and NU6.3 (Ironwood), need newer Zebra releases, so build a current Zebra release instead of the pinned tag. This guide has not been updated for Ironwood, so check the Zenith project for NU6.3 support before using it with real funds.")])],
      };
      const items = [
        { label: "Zebra", hint: "Build and configure the node", href: "#install-zebra" },
        { label: "Zenith", hint: "Download, build and configure", href: "#install-zenith" },
        { label: "Raspberry Pi", hint: "Graphics driver setup", href: "#raspi-config" },
        { label: "Run", hint: "GUI, TUI or server", href: "#run-zenith" },
      ];
      if (h1 > -1) rows.splice(h1 + 1, 0, notice, { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] });
    }
    if (opts.nrpc && Array.isArray(tree.children)) {
      // Node RPC and indexing: no Edit badge, end-of-life notice as a callout, targeted wording fixes pending an upstream PR,
      // NU6.3 / Ironwood sections for operators and a jump list. Port facts: Z3 z3-contract.yaml and docs/regtest.md; NU6.3 and
      // Orchard pool rules: ZIP 258; receivers: ZIP 229 and ZIP 326; getdeprecationinfo: Zebra 6.3.0 release notes; Zaino 0.10.1 release notes.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const code = (t: string) => el("code", {}, [txt(t)]);
      const link = (t: string, href: string) => el("a", { href, target: "_blank", rel: "noreferrer" }, [txt(t)]);
      const P = (kids: any[], cls: string[] = ["my-5"]) => el("p", { className: cls }, kids);
      const UL = (items: any[][]) => el("ul", { className: ["my-0", "list-disc", "space-y-1.5", "pl-5", "marker:text-slate-400", "dark:marker:text-slate-500"] }, items.map((k) => el("li", {}, k)));
      const group = (title: string, icon: string, items: any[][]) => el("communitygroup", { title, icon, wide: "false" }, [UL(items)]);
      const small = ["text-sm", "text-slate-500", "dark:text-slate-400", "my-4"];
      const replaceText = (n: any, from: string, to: string) => {
        if (!n) return;
        if (n.type === "text" && typeof n.value === "string" && n.value.includes(from)) n.value = n.value.split(from).join(to);
        (n.children || []).forEach((c: any) => replaceText(c, from, to));
      };
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      // 1. End-of-life notice.
      const eol = rows.findIndex((x) => isEl(x, "p") && /^zcashd reached end of life/i.test(textOf(x).trim()));
      if (eol > -1) {
        rows[eol] = el("guidecallout", { title: "zcashd Has Reached End of Life" }, [
          P([code("zcashd"), txt(" 6.20.0 reached its automatic end-of-support halt at block 3,417,100 on 18 July 2026, and "), code("zcashd"), txt(" does not support NU6.3. Operators should migrate to a maintained consensus node implementation such as Zebra or Zakura. Wallet and indexing functionality may require separate services, for example Zallet and Zaino in the Z3 stack.")], ["m-0"]),
        ]);
      }
      // 2. Z3 ports are defaults of the Z3 deployment.
      const pm = rows.findIndex((x) => isEl(x, "p") && /^port matrix and compose project names/i.test(textOf(x).trim()));
      if (pm > -1) rows.splice(pm + 1, 0, P([txt("The ports above are the mainnet host-port defaults of the Z3 deployment, not universal defaults. Testnet and regtest use different host ports, and a standalone Zebra, Zallet or Zaino installation can use others. The authoritative per-network matrix is "), link("z3-contract.yaml", "https://github.com/ZcashFoundation/z3/blob/main/z3-contract.yaml"), txt(". Zebra validates and serves node RPC, Zallet is the wallet and serves wallet RPC, and Zaino indexes and serves lightwalletd-compatible services; Zaino is not a consensus node.")], small));
      // 3. Regtest troubleshooting.
      const hc = rows.findIndex((x) => isEl(x, "p") && /if curl hangs, the router is not up/i.test(textOf(x)));
      if (hc > -1) rows[hc] = P([txt("A healthy "), code("getblockchaininfo"), txt(" result includes “blocks” and an “upgrades” map. If the request times out or hangs, check the "), code("rpc-router"), txt(" container, its logs, network connectivity, and the availability of its upstream services (Zebra and Zallet). An HTTP 401 response indicates an authentication problem, so check the credentials you are sending; it does not by itself prove that the request reached Zebra directly. On regtest, Zebra’s host port is 29232.")]);
      // 4. Cookies are credentials.
      const ck = rows.findIndex((x) => isEl(x, "p") && /^on mainnet and testnet, zallet and the optional zaino/i.test(textOf(x).trim()));
      if (ck > -1) (rows[ck].children = rows[ck].children || []).push(txt(" The cookie is a credential, not a wallet backup: do not share it or commit it to version control."));
      // 5. Alternative indexers and wording that could not be verified.
      for (const r of rows) {
        replaceText(r, "is a Zakura-backed indexer; it is not what Z3 ships.", "is a separate indexer project; it is not what Z3 ships.");
        replaceText(r, "a Zakura-backed indexer and CompactTxStreamer implementation. It is not a Z3 service.", "an indexer project that is not part of Z3.");
        replaceText(r, "the older compact-block server. Still deployed in the wild; Zaino is the successor path for this role.", "the compact-block server maintained at zcash/lightwalletd. It is still released and deployed; Zaino is the indexer that Z3 ships.");
        replaceText(r, "September 2026", "October 2026");
      }
      const fixLi = (list: any[]) => {
        for (const x of list) {
          if (!x || x.type !== "element") continue;
          if (x.tagName === "li" && /^ztreamer\s*\u2014\s*a zakura-backed/i.test(textOf(x).trim())) {
            const kids: any[] = x.children || [];
            const strong = kids.find((c: any) => isEl(c, "strong"));
            const a = kids.find((c: any) => isEl(c, "a"));
            if (strong && a) x.children = [strong, txt(" \u2014 an indexer project that is not part of Z3. See the "), a, txt(" for its supported backends and status.")];
          } else if (Array.isArray(x.children)) fixLi(x.children);
        }
      };
      fixLi(rows);
      // 6. NU6.3 sections for operators, placed before "Common mistakes".
      const nu = [
        el("h2", {}, [txt("Ironwood (NU6.3) for Node Operators")]),
        P([txt("Network Upgrade 6.3 (NU6.3) activated on mainnet at block 3,428,143 (about 28 July 2026) and introduced the Ironwood shielded pool; ZIP 258 specifies the height. Ironwood uses the Orchard shielded protocol but keeps a separate value pool, with its own note commitment tree, anchor and chain value pool balance. NU6.3 is a consensus upgrade, so a node that does not implement it stops following the chain.")]),
        el("addressgrid", {}, [
          group("Nodes", "cpu", [
            [code("zcashd"), txt(" does not implement NU6.3. Zebra is expected to be the only full validator that follows the chain after activation.")],
            [txt("NU6.3 uses network protocol version 170160 on mainnet and testnet, and NU6.3 nodes disconnect peers that use lower versions.")],
            [txt("Run a current Zebra release. "), code("getdeprecationinfo"), txt(", added in Zebra 6.3.0, reports the height and estimated time at which a release halts for end of support, in the "), code("zcashd"), txt(" "), code("end_of_service"), txt(" format. The "), code("end_of_service"), txt(" object is present on mainnet only, where end of support is enforced.")],
          ]),
          group("The original Orchard pool", "coins", [
            [txt("Since NU6.3, no new value can enter the original Orchard pool, and ordinary transfers within it are restricted; change outputs are still allowed.")],
            [txt("Existing value can still leave the pool under the applicable consensus rules, including into Ironwood. Nothing was deleted and no funds disappeared.")],
            [txt("Moving value out needs wallet software that supports migration.")],
          ]),
        ]),
        el("h2", {}, [txt("RPC and Indexer Compatibility After NU6.3")]),
        P([txt("Pair every component with a release that supports NU6.3 and read each project’s release notes before upgrading. Avoid pinning guidance to a specific historical version, because releases move quickly. Two documented examples:")]),
        UL([
          [txt("Zaino 0.10.1 reports the transparent, lockbox and ironwood pools in "), code("getblockchaininfo"), txt(", and its "), code("chainSupply"), txt(" is the total across all pools. See the "), link("Zaino 0.10.1 release notes", "https://github.com/zingolabs/zaino/releases/tag/0.10.1"), txt(".")],
          [txt("Zebra 6.3.0 rejects blocks whose total chain value pool balance would exceed "), code("MAX_MONEY"), txt(". See the "), link("Zebra 6.3.0 release notes", "https://github.com/ZcashFoundation/zebra/releases/tag/v6.3.0"), txt(".")],
        ]),
        P([txt("Do not rely on the exact field layout of RPC responses for pool balances across versions; check the response of the version you run.")], small),
        el("h2", {}, [txt("Wallets, Unified Addresses, and Ironwood")]),
        el("addressgrid", {}, [
          group("Addresses", "shield", [
            [txt("Existing Orchard-protocol receivers remain compatible with Ironwood, so previously shared Unified Addresses can continue receiving payments through NU6.3-compatible wallet software (ZIP 229, ZIP 326).")],
            [txt("Ironwood is a pool, not a fourth address format. ZIP 316 defines no separate Ironwood receiver type.")],
          ]),
          group("Balances", "coins", [
            [txt("Address compatibility and balance migration are separate. An address can keep working while funds received earlier in the original Orchard pool still need to be migrated.")],
            [txt("Migration depends on the wallet implementation and on the protocol rules. Do not assume that every wallet migrates Orchard balances automatically.")],
            [txt("A transfer that crosses between pools reveals the transferred amount on chain. This does not make the rest of the transaction data public.")],
          ]),
        ]),
        el("h2", {}, [txt("Check Before You Rely on It")]),
        UL([
          [txt("Confirm the current release of Zebra, Zallet, Zaino and any lightwalletd-compatible server on each project’s release page.")],
          [txt("Treat the ports in this guide as Z3 defaults and confirm them against "), code("z3-contract.yaml"), txt(" for your network.")],
          [txt("Zallet is beta software, and many legacy "), code("zcashd"), txt(" wallet RPC methods may be missing. Check the Zallet documentation for the methods you need.")],
        ]),
      ];
      const cm = rows.findIndex((x) => isEl(x, "h2") && /^common mistakes/i.test(textOf(x).replace(/#$/, "").trim()));
      rows.splice(cm > -1 ? cm : rows.length, 0, ...nu);
      // 7. Primary sources, before the "Last updated" line.
      const src = [
        el("h2", {}, [txt("Sources")]),
        UL([
          [link("ZIP 258: Deployment of the NU6.3 Network Upgrade", "https://zips.z.cash/zip-0258")],
          [link("ZIP 229: Version 6 Transaction Format", "https://zips.z.cash/zip-0229"), txt(" and "), link("ZIP 326: NU6.3 Consequences for Wallets", "https://zips.z.cash/zip-0326")],
          [link("ZIP 257: Orchard Temporary Vulnerability Mitigation and NU6.2", "https://zips.z.cash/zip-0257")],
          [link("Z3 port matrix (z3-contract.yaml)", "https://github.com/ZcashFoundation/z3/blob/main/z3-contract.yaml"), txt(" and "), link("Z3 regtest documentation", "https://github.com/ZcashFoundation/z3/blob/main/docs/regtest.md")],
          [link("Zebra 6.3.0 release notes", "https://github.com/ZcashFoundation/zebra/releases/tag/v6.3.0"), txt(" and "), link("Zaino 0.10.1 release notes", "https://github.com/zingolabs/zaino/releases/tag/0.10.1")],
          [link("The zcashd Book: End of Life", "https://zcash.github.io/zcash/user/end-of-life.html")],
        ]),
      ];
      const lu = rows.findIndex((x) => isEl(x, "p") && /^last updated/i.test(textOf(x).trim()));
      rows.splice(lu > -1 ? lu : rows.length, 0, ...src);
      const sec = rows.findIndex((x) => isEl(x, "h2") && /^which process answers/i.test(textOf(x).replace(/#$/, "").trim()));
      if (sec > -1) {
        const items = [
          { label: "Which process", hint: "Who answers which call", href: "#which-process-answers-which-call" },
          { label: "Regtest", hint: "Practice without syncing", href: "#practice-on-regtest-first" },
          { label: "Indexers", hint: "Zaino and alternatives", href: "#attach-an-indexer" },
          { label: "Ironwood", hint: "What changes for operators", href: "#ironwood-nu63-for-node-operators" },
        ];
        rows.splice(sec, 0, { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.zkool && Array.isArray(tree.children)) {
      // Zkool multisig: video slide, steps merged into one numbered list per section with the screenshot under its step, blue-framed screenshots.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const imgOf = (n: any): any => (isEl(n, "img") ? n : (n?.children || []).map(imgOf).find(Boolean));
      const onlyImg = (x: any) => isEl(x, "p") && !textOf(x).trim() && !!imgOf(x);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (isWs(x) || (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit"))) rows.splice(i, 1);
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      // The embedded video becomes a thumbnail slide.
      const frameIn = (n: any): any => (isEl(n, "iframe") || (n && n.type === "mdxJsxFlowElement" && String(n.name) === "iframe") ? n : (n?.children || []).map(frameIn).find(Boolean));
      for (let q = 0; q < rows.length; q++) {
        const f = isEl(rows[q], "div") || (rows[q] && rows[q].type === "mdxJsxFlowElement") ? frameIn(rows[q]) : null;
        if (!f) continue;
        const src = String(f.properties?.src ?? (f.attributes || []).find((a: any) => a.name === "src")?.value ?? "");
        const title = String(f.properties?.title ?? (f.attributes || []).find((a: any) => a.name === "title")?.value ?? "Video");
        const m = /embed\/([\w-]{6,})/.exec(src);
        if (m) rows[q] = el("videoslider", { videos: JSON.stringify([{ id: m[1], title }]) }, []);
      }
      // Steps: image-only paragraphs after a list attach to its last step, and split lists merge so numbering is continuous.
      const out: any[] = [];
      for (const x of rows) {
        const prev = out[out.length - 1];
        if (onlyImg(x) && isEl(prev, "ol")) {
          const lis = (prev.children || []).filter((c: any) => isEl(c, "li"));
          const last = lis[lis.length - 1];
          const im = imgOf(x);
          if (last && im) {
            const label = textOf(last).replace(/\s+/g, " ").trim();
            im.properties = { ...(im.properties || {}), alt: "Zkool screenshot: " + label };
            last.children = [...(last.children || []), el("div", { className: ["[&_img]:!mx-0"] }, [im])];
            continue;
          }
        }
        if (isEl(x, "ol") && isEl(prev, "ol")) {
          prev.children = [...(prev.children || []), ...(x.children || [])];
          continue;
        }
        if (isEl(x, "ol")) x.properties = { ...(x.properties || {}), start: undefined };
        out.push(x);
      }
      rows.splice(0, rows.length, ...out);
      // Every screenshot gets the blue frame.
      const frame = (n: any) => {
        if (isEl(n, "img")) {
          n.properties = { ...(n.properties || {}), dataFrame: "true" };
          if (!n.properties.alt) n.properties.alt = "Zkool screenshot";
        }
        (n?.children || []).forEach(frame);
      };
      rows.forEach(frame);
      for (const r of rows) if (onlyImg(r)) r.properties = { ...(r.properties || {}), className: ["[&_img]:!mx-0"] };
      // Receiving funds: address types as a bullet list, plus what Ironwood (NU6.3) means for them.
      const rf = rows.findIndex((x) => isEl(x, "h2") && /receiving funds/i.test(textOf(x)));
      if (rf > -1) {
        let end = rf + 1;
        while (end < rows.length && !isEl(rows[end], "h2")) end += 1;
        const gloss: Record<string, string> = {
          "unified address": "bundles receivers for several pools (for example Orchard, Sapling and transparent) in one address.",
          "orchard only address": "a single Orchard receiver.",
          "sapling address": "a shielded Sapling address.",
          "transparent address": "a public address; transactions on it are visible on-chain.",
        };
        let first = -1;
        let last = -1;
        for (let q = rf + 1; q < end; q++) {
          if (isEl(rows[q], "p") && gloss[textOf(rows[q]).trim().toLowerCase()]) {
            if (first < 0) first = q;
            last = q;
          }
        }
        let addedAfter = end;
        if (first > -1 && last - first + 1 === 4) {
          const lis = [];
          for (let q = first; q <= last; q++) {
            const label = textOf(rows[q]).trim();
            lis.push(el("li", {}, [el("strong", {}, [{ type: "text", value: label }]), { type: "text", value: " \u2014 " + gloss[label.toLowerCase()] }]));
          }
          rows.splice(first, 4, el("ul", {}, lis));
          addedAfter = end - 3;
        }
        const para = (t: string, cls: string[] = ["m-0"]) => el("p", { className: cls }, [{ type: "text", value: t }]);
        const ironwood = el("guidecallout", { title: "Ironwood (NU6.3)" }, [
          para("Ironwood is a shielded pool introduced by the NU6.3 upgrade, not a fifth address type. It uses the Orchard shielded protocol but keeps its own value pool."),
          para("Existing Orchard-protocol receivers remain compatible with Ironwood, allowing previously shared Unified Addresses to continue receiving payments through NU6.3-compatible wallet software. This covers the Orchard receiver inside a Unified Address and an Orchard only address.", ["mt-2", "mb-0", "mx-0"]),
          para("New value can no longer enter the original Orchard pool, and funds already there may need to be migrated to Ironwood. Moving value between pools reveals the transferred amount on-chain. Migration depends on the wallet, and this guide has not verified Ironwood support in Zkool, so check the Zkool release notes before relying on it.", ["mt-2", "mb-0", "mx-0"]),
        ]);
        rows.splice(addedAfter, 0, ironwood);
      }
      // "1. Creating an Account" style headings become numbered step badges.
      for (const r of rows) {
        if (!isEl(r, "h2")) continue;
        const t = textOf(r).replace(/#$/, "").trim();
        const mm = /^(\d+)\.\s+(.*)$/.exec(t);
        if (!mm) continue;
        r.children = [{ type: "text", value: mm[2] }];
        r.properties = { ...(r.properties || {}), dataStep: mm[1] };
      }
    }
    if (opts.z3zaino && Array.isArray(tree.children)) {
      // Zebra + Zaino + zingo-cli: component cards, lead, outdated-guide notice, numbered install steps, monospace commands.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const h2Text = (x: any) => textOf(x).replace(/#$/, "").trim();
      const replaceText = (n: any, a: string, b: string) => {
        if (n?.type === "text" && String(n.value).includes(a)) n.value = String(n.value).replace(a, b);
        (n?.children || []).forEach((c: any) => replaceText(c, a, b));
      };
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        const j = x && (x.type === "mdxJsxFlowElement" || x.type === "element") ? JSON.stringify(x).toLowerCase() : "";
        if (isWs(x) || j.includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      // The embedded video becomes a thumbnail slide (single video, so no arrows).
      const frameIn = (n: any): any => (isEl(n, "iframe") || (n && n.type === "mdxJsxFlowElement" && String(n.name) === "iframe") ? n : (n?.children || []).map(frameIn).find(Boolean));
      for (let q = 0; q < rows.length; q++) {
        const f = isEl(rows[q], "div") || (rows[q] && rows[q].type === "mdxJsxFlowElement") ? frameIn(rows[q]) : null;
        if (!f) continue;
        const src = String(f.properties?.src ?? (f.attributes || []).find((a: any) => a.name === "src")?.value ?? "");
        const title = String(f.properties?.title ?? (f.attributes || []).find((a: any) => a.name === "title")?.value ?? "Video");
        const m = /embed\/([\w-]{6,})/.exec(src);
        if (m) rows[q] = el("videoslider", { videos: JSON.stringify([{ id: m[1], title }]) }, []);
      }
      // "name : description" lines become component cards.
      const defs: Record<string, { icon: string; href: string }> = {
        zebrad: { icon: "cpu", href: "https://github.com/ZcashFoundation/zebra" },
        zaino: { icon: "file", href: "https://github.com/zingolabs/zaino" },
        "zingo-cli": { icon: "code", href: "https://github.com/zingolabs/zingolib" },
      };
      const cards: any[] = [];
      let first = -1;
      let k = h1 + 1;
      while (k < rows.length && isEl(rows[k], "p")) {
        const m = /^\s*([\w-]+)\s*:\s*([\s\S]+)$/.exec(textOf(rows[k]));
        if (!m || !defs[m[1].toLowerCase()]) break;
        if (first < 0) first = k;
        const d = defs[m[1].toLowerCase()];
        cards.push(el("communitycard", { name: m[1], desc: m[2].replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase()), href: d.href, icon: d.icon }, []));
        k += 1;
      }
      if (cards.length) {
        const lead = el("p", { dataLead: "true" }, [txt("This guide builds a small Zcash stack from source: a Zebra full node, the Zaino indexer on top of it, and the zingo-cli command-line client that connects to Zaino.")]);
        const notice = el("guidecallout", { title: "Check versions before you start" }, [
          el("p", { className: ["m-0"] }, [txt("The commands below pin Zebra v2.0.1, which predates the NU6.2 and NU6.3 (Ironwood) network upgrades, so build a current Zebra release instead. Zaino added Ironwood support in 0.6.0, and 0.10.1 is its latest release. zcashd has reached end of life, so Zebra is the node to run. The Z3 project packages Zebra and Zallet with Docker Compose, with Zaino as an optional indexer for light wallets. Whether zingo-cli, the config file name and the ports below match current releases has not been verified, so check each project's documentation.")]),
        ]);
        const z3 = el("linkbutton", { href: "https://github.com/ZcashFoundation/z3", label: "Open the Z3 repository" }, []);
        rows.splice(first, cards.length, lead, el("addressgrid", {}, cards), notice, z3);
      }
      // Architecture steps are an ordered flow.
      const bp = rows.findIndex((x) => isEl(x, "h2") && /^big picture$/i.test(h2Text(x)));
      if (bp > -1) for (let q = bp + 1; q < rows.length && !isEl(rows[q], "h2"); q++) if (isEl(rows[q], "ul")) rows[q].tagName = "ol";
      // Wording and spelling.
      for (const r of rows) {
        replaceText(r, "You will need to intall 3 things", "You will need to install 3 things");
        replaceText(r, "They can send/recieve ZEC", "They can send/receive ZEC");
        replaceText(r, "(Zcash user doesnt care", "(Zcash user doesn't care");
        replaceText(r, "Zaino allows access to either zebrad or zcashd", "Zaino indexes the chain from zebrad (zcashd has reached end of life)");
        replaceText(r, "If your running these", "If you're running these");
        replaceText(r, "just like lightwalletd did.", "as zebrad does.");
      }
      // The single "sudo apt install screen" line becomes a code block.
      const ap = rows.findIndex((x) => isEl(x, "p") && /^sudo apt install screen$/.test(textOf(x).trim()));
      if (ap > -1) rows[ap] = el("pre", {}, [el("code", { className: ["language-bash"] }, [txt("sudo apt install screen\n")])]);
      // Install steps are numbered, and commands use the monospace style.
      let n = 0;
      const ins = rows.findIndex((x) => isEl(x, "h2") && /^installation$/i.test(h2Text(x)));
      for (let q = ins + 1; ins > -1 && q < rows.length && !isEl(rows[q], "h2"); q++) {
        if (isEl(rows[q], "h3")) {
          n += 1;
          rows[q].properties = { ...(rows[q].properties || {}), dataStep: String(n) };
        }
      }
      for (const r of rows) {
        if (!isEl(r, "pre")) continue;
        const code = (r.children || []).find((c: any) => isEl(c, "code"));
        if (code && !(code.properties?.className || []).some((c: string) => String(c).startsWith("language-"))) code.properties = { ...(code.properties || {}), className: ["language-bash"] };
      }
    }
    if (opts.zgo && Array.isArray(tree.children)) {
      // ZGo payment processor: lead, caution notice, jump list instead of the manual index, features as numbered points, no decorative image.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const h2Text = (x: any) => textOf(x).replace(/#$/, "").trim();
      const WOO_BANNER = "55a791bb-1947-4f55-b5b9-55083be8ed49";
      const OLD_FLOW = "de50885b-b068-4157-bbda-0981ca23efc8";
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        const j = x && (x.type === "mdxJsxFlowElement" || x.type === "element") ? JSON.stringify(x) : "";
        const simple = x && (x.type === "mdxJsxFlowElement" || isEl(x, "p") || isEl(x, "a") || isEl(x, "img")) && !textOf(x).trim();
        if (isWs(x) || j.toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
        else if (simple && j.includes(WOO_BANNER)) rows.splice(i, 1);
        else if (simple && j.includes(OLD_FLOW)) {
          // The flow diagram is replaced by a sharper version of the same picture.
          rows[i] = el("p", {}, [el("img", { src: "/content-images/zgo-payment-flow.webp", alt: "Diagram of the ZGo payment flow between the customer, Zcash, ZGo, the invoice, a WooCommerce store and the payment confirmation.", width: 1671, height: 941 }, [])]);
        }
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      // The guide lists three common mistakes, not two.
      const fixCount = (n: any) => {
        if (n?.type === "text" && String(n.value).includes("the two mistakes")) n.value = String(n.value).replace("the two mistakes", "the three mistakes");
        (n?.children || []).forEach(fixCount);
      };
      rows.forEach(fixCount);
      // Resources: the bare list becomes link cards, with WooCommerce and WordPress as separate entries.
      const ri = rows.findIndex((x) => isEl(x, "h2") && /^resources$/i.test(h2Text(x)));
      if (ri > -1) {
        let ui = ri + 1;
        while (ui < rows.length && isWs(rows[ui])) ui++;
        if (isEl(rows[ui], "ul")) {
          const card = (name: string, desc: string, href: string) => el("communitycard", { name, desc, href }, []);
          const cards = [
            card("ZGo", "Official site: create an account, manage invoices and integrations.", "https://zgo.cash/"),
            card("Xero integration walkthrough", "Step-by-step setup for sending ZGo payments to Xero.", "https://hedgedoc.vergara.tech/s/4iXC67fmb"),
            card("WooCommerce", "The e-commerce plugin ZGo connects to for online stores.", "https://woocommerce.com/"),
            card("WordPress", "The platform WooCommerce runs on. Check version compatibility first.", "https://wordpress.org/"),
            card("Xero", "Accounting software ZGo can record Zcash payments in.", "https://www.xero.com/"),
            card("Zcash", "Project homepage and background on shielded payments.", "https://z.cash/"),
            card("ZecHub Wallets", "Compatible Zcash wallets for paying and receiving.", "https://zechub.wiki/wallets"),
            card("Payment Processors", "ZGo compared with other Zcash payment options.", "https://zechub.wiki/payment-processors"),
            card("BTCPayServer Zcash Plugin", "Self-hosted alternative to ZGo for online stores.", "https://zechub.wiki/guides/btcpayserver-zcash-plugin"),
          ];
          rows.splice(ui, 1, el("communitygrid", {}, cards));
        }
      }
      // Features: "Label. Explanation." paragraphs become numbered points.
      const fi = rows.findIndex((x) => isEl(x, "h2") && /^features$/i.test(h2Text(x)));
      if (fi > -1) {
        let end = fi + 1;
        const items: any[] = [];
        while (end < rows.length && !isEl(rows[end], "h2")) {
          const pEl = rows[end];
          const kids: any[] = pEl.children || [];
          const si = kids.findIndex((c) => !isWs(c));
          if (isEl(pEl, "p") && si > -1 && isEl(kids[si], "strong")) {
            const title = textOf(kids[si]).replace(/[.:\s]+$/, "").trim();
            const rest = kids.filter((_: any, k: number) => k !== si);
            const first = rest.findIndex((c: any) => c.type === "text");
            if (first > -1) rest[first] = txt(String(rest[first].value).replace(/^\s+/, ""));
            items.push(el("pointitem", { n: String(items.length + 1), title }, [el("p", {}, rest)]));
          } else {
            items.length = 0;
            break;
          }
          end += 1;
        }
        if (items.length) rows.splice(fi + 1, end - fi - 1, el("pointlist", {}, items));
      }
      // Manual "On this page" index becomes the jump list.
      const op = rows.findIndex((x) => isEl(x, "h2") && /^on this page$/i.test(h2Text(x)));
      const notice = el("guidecallout", { title: "Before you rely on it" }, [
        el("p", { className: ["m-0"] }, [txt("ZGo's WooCommerce plugin lists version 1.0 with a \"Development\" status in its README, tested up to WordPress 6.1.1 and WooCommerce 7.1. This guide has not been checked against the NU6.3 (Ironwood) upgrade, so run a small test payment end to end on your own store, and confirm the current plugin version with Vergara Tech, before accepting real orders.")]),
      ]);
      const items = [
        { label: "How ZGo works", hint: "Payment flow and confirmations", href: "#how-zgo-works" },
        { label: "Account setup", hint: "Create and verify your account", href: "#setting-up-an-account" },
        { label: "Integrations", hint: "Xero and WooCommerce", href: "#zgo-with-xero" },
        { label: "Common mistakes", hint: "What breaks first setups", href: "#common-mistakes" },
      ];
      const jump = el("jumpnav", { title: "Jump to", items: JSON.stringify(items) }, []);
      if (op > -1) {
        const nx = isEl(rows[op + 1], "ol") ? 2 : 1;
        rows.splice(op, nx, notice, jump);
      } else if (lead > -1) rows.splice(lead + 1, 0, notice, jump);
    }
    if (opts.btcpay && Array.isArray(tree.children)) {
      // BTCPay Server + Zcash: lead, jump list instead of the manual index, numbered steps, callouts, link cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const h2Text = (x: any) => textOf(x).replace(/#$/, "").trim();
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        const j = x && (x.type === "mdxJsxFlowElement" || x.type === "element") ? JSON.stringify(x) : "";
        if (isWs(x) || isEl(x, "hr") || j.toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      // Literal "[url](url)" text becomes a real link.
      const linkify = (n: any) => {
        const kids: any[] = n?.children;
        if (!Array.isArray(kids)) return;
        for (let k = kids.length - 1; k >= 0; k--) {
          const c = kids[k];
          const m = c?.type === "text" ? /\[(https?:\/\/[^\]\s]+)\]\((https?:\/\/[^)\s]+)\)/.exec(String(c.value)) : null;
          if (m && m.index !== undefined) {
            const v = String(c.value);
            const link = el("a", { href: m[2], target: "_blank", rel: "noreferrer" }, [{ type: "text", value: m[1] }]);
            kids.splice(k, 1, { type: "text", value: v.slice(0, m.index) }, link, { type: "text", value: v.slice(m.index + m[0].length) });
          } else linkify(c);
        }
      };
      rows.forEach(linkify);
      // The "(hidden part)" label is an authoring note, not a title.
      const stripHidden = (n: any) => {
        if (n?.type === "text" && /\s*\(hidden part\)/i.test(String(n.value))) n.value = String(n.value).replace(/\s*\(hidden part\)/i, "");
        (n?.children || []).forEach(stripHidden);
      };
      rows.filter((x) => isEl(x, "h2")).forEach(stripHidden);
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      // Manual table of contents becomes the jump list.
      const toc = rows.findIndex((x) => isEl(x, "h2") && /^table of contents$/i.test(h2Text(x)));
      if (toc > -1) {
        const items = [
          { label: "Why Zcash", hint: "Privacy for online payments", href: "#why-use-btcpay-server-with-zcash" },
          { label: "Deploy", hint: "VPS, own node or home server", href: "#deploying-btcpay-server-with-zcash-support" },
          { label: "Configure", hint: "Plugin and viewing key", href: "#configuring-the-zcash-plugin-in-the-btcpay-server-web-interface" },
          { label: "Integrate", hint: "API, WooCommerce or button", href: "#integrating-btcpay-server-with-your-website" },
        ];
        const nx = isEl(rows[toc + 1], "ul") ? 2 : 1;
        rows.splice(toc, nx, el("jumpnav", { title: "Jump to", items: JSON.stringify(items) }, []));
      }
      // "Step N: Title" becomes a numbered step; other subheadings get a hairline.
      for (let k = 0; k < rows.length; k++) {
        if (!isEl(rows[k], "h3")) continue;
        const t = textOf(rows[k]).trim();
        const mm = /^step\s+(\d+)\s*[:.\-]\s*(.+)$/i.exec(t);
        rows[k] = mm
          ? el("h3", { dataStep: mm[1] }, [{ type: "text", value: mm[2] }])
          : el("h3", { dataRule: "true" }, [{ type: "text", value: t }]);
      }
      // Tips and warnings (blockquotes) as callouts.
      for (let k = 0; k < rows.length; k++) {
        if (!isEl(rows[k], "blockquote")) continue;
        const t = textOf(rows[k]).trim();
        const title = /warning|important|this key grants|several days|unavailable or overloaded/i.test(t) ? "Heads up" : /^(tip|ideally|want to self-host)/i.test(t) ? "Tip" : "Note";
        rows[k] = el("guidecallout", { title }, (rows[k].children || []).filter((c: any) => !isWs(c)));
      }
      // The server prerequisites are essential, so they start expanded.
      rows.forEach((x) => {
        if (isEl(x, "details")) x.properties = { ...(x.properties || {}), open: true };
        else if (x?.type === "mdxJsxFlowElement" && x.name === "details") x.attributes = [...(x.attributes || []), { type: "mdxJsxAttribute", name: "open", value: null }];
      });
      // Resources as link cards.
      const ri = rows.findIndex((x) => isEl(x, "h2") && /^resources$/i.test(h2Text(x)));
      if (ri > -1 && isEl(rows[ri + 1], "ul")) {
        const card = (name: string, desc: string, href: string) => el("communitycard", { name, desc, href }, []);
        rows.splice(ri + 1, 1, el("communitygrid", {}, [
          card("BTCPay Server", "Official website of the open-source payment server.", "https://btcpayserver.org/"),
          card("BTCPay FAQ", "Answers to common setup and operation questions.", "https://docs.btcpayserver.org/FAQ/"),
          card("BTCPay Server on GitHub", "Source code and issue tracker.", "https://github.com/btcpayserver/btcpayserver"),
          card("Mainnet demo", "Try the BTCPay interface before installing.", "https://mainnet.demo.btcpayserver.org/login?ReturnUrl=%2F"),
          card("Zcash plugin", "The plugin repository, maintained on GitHub.", "https://github.com/btcpay-zcash/btcpayserver-zcash-plugin"),
          card("Plugin installation guide", "Official installation steps from the plugin authors.", "https://github.com/btcpay-zcash/btcpayserver-zcash-plugin/blob/master/docs/installation.md"),
          card("Custom lightwalletd fragment", "Example zcash-lightwalletd.custom.yml for an external node.", "https://github.com/btcpay-zcash/btcpayserver-zcash-plugin/blob/master/docs/zcash-lightwalletd.custom.yml"),
          card("lightwalletd with Zebra", "Docker Compose file to self-host lightwalletd.", "https://github.com/ZcashFoundation/zebra/blob/main/docker/docker-compose.lwd.yml"),
          card("Greenfield API keys", "How to create and scope a BTCPay API key.", "https://docs.btcpayserver.org/API/Greenfield/v1/#tag/API-Keys"),
          card("Cloudflare Tunnel", "Create a tunnel to host BTCPay at home.", "https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-remote-tunnel/"),
          card("ZecHub Wallets", "Wallets that support viewing key export.", "https://zechub.wiki/wallets"),
          card("Zebra and lightwalletd on Raspberry Pi 5", "ZecHub sync journal for a home node.", "https://free2z.com/ZecHub/zpage/zcash-101-zebra-lightwalletd-sync-journal-on-raspberry-pi-5"),
        ]));
      }
      // Hairline between sections.
      for (let k = 1; k < rows.length; k++) {
        if (isEl(rows[k], "h2") && !isEl(rows[k - 1], "hr")) {
          rows.splice(k, 0, el("hr", {}, []));
          k++;
        }
      }
    }
    if (opts.maya && Array.isArray(tree.children)) {
      // Maya Protocol: jump list, compact video card, differences as numbered points, wallets as link cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const h2Text = (x: any) => textOf(x).replace(/#$/, "").trim();
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        const j = x && (x.type === "mdxJsxFlowElement" || x.type === "element") ? JSON.stringify(x) : "";
        if (isWs(x) || isEl(x, "hr") || j.toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      // The embedded video becomes the compact video card.
      const findFrame = (x: any): any => {
        if (!x || !(x.type === "element" || x.type === "mdxJsxFlowElement")) return null;
        if ((x.tagName || x.name) === "iframe") return x;
        return (x.children || []).map(findFrame).find(Boolean) || null;
      };
      const attrOf = (x: any, key: string): string => {
        if (x.properties && x.properties[key] != null) return String(x.properties[key]);
        const hit = (x.attributes || []).find((at: any) => at.name === key);
        return hit && typeof hit.value === "string" ? hit.value : "";
      };
      for (let i = 0; i < rows.length; i++) {
        const fr = isEl(rows[i], "div") ? findFrame(rows[i]) : null;
        const m = fr ? attrOf(fr, "src").match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})/) : null;
        if (fr && m) rows[i] = el("videoblock", { exvideo: m[1], extitle: attrOf(fr, "title") }, []);
      }
      const tut = rows.findIndex((x) => isEl(x, "h2") && /^tutorial$/i.test(h2Text(x)));
      if (tut > -1) rows[tut] = el("h2", {}, [{ type: "text", value: "Video tutorial" }]);
      // Differences from THORChain: each subheading with its text becomes a numbered point.
      const di = rows.findIndex((x) => isEl(x, "h2") && /^differences between/i.test(h2Text(x)));
      if (di > -1) {
        let end = di + 2;
        while (end < rows.length && !isEl(rows[end], "h2")) end++;
        const items: any[] = [];
        let k = di + 1;
        while (k < end) {
          if (!isEl(rows[k], "h3")) { k++; continue; }
          const title = textOf(rows[k]).trim();
          let q = k + 1;
          const body: any[] = [];
          while (q < end && !isEl(rows[q], "h3")) { body.push(rows[q]); q++; }
          items.push({ title, body, at: k, to: q });
          k = q;
        }
        if (items.length) {
          // Text after the last point (closing remarks) is not part of that point.
          const last = items[items.length - 1];
          const tail = last.body.splice(1);
          const pts = items.map((it, n) => el("pointitem", { n: String(n + 1), title: it.title }, it.body));
          rows.splice(items[0].at, last.to - items[0].at, el("pointlist", {}, pts), ...tail);
        }
      }
      // Wallet and service entries become link cards; defunct services are dropped.
      const wi = rows.findIndex((x) => isEl(x, "h2") && /wallet integration$/i.test(h2Text(x)));
      if (wi > -1) {
        let end = wi + 1;
        while (end < rows.length && !isEl(rows[end], "h2")) end++;
        const firstA = (x: any): any => {
          if (isEl(x, "a")) return x;
          for (const c of x?.children || []) { const r = firstA(c); if (r) return r; }
          return null;
        };
        const cards: any[] = [];
        const keep: any[] = [];
        for (const r of rows.slice(wi + 1, end)) {
          const a = isEl(r, "p") ? firstA(r) : null;
          const full = textOf(r).trim();
          if (a && a.properties?.href && full.includes(":")) {
            const name = textOf(a).trim();
            const desc = full.slice(full.indexOf(":") + 1).trim().replace(/^(a|an)\s+/i, (m0: string) => m0).replace(/^./, (c: string) => c.toUpperCase());
            cards.push(el("communitycard", { name, desc: /^(ledger|keystore|xdefi|metamask|keplr|leap)/i.test(desc) ? "Connect with " + desc : desc, href: String(a.properties.href) }, []));
          } else if (!/no longer online/i.test(full)) keep.push(r);
        }
        if (cards.length) rows.splice(wi + 1, end - wi - 1, ...keep, el("communitygrid", {}, cards));
      }
      // Hairline between sections, and a jump list after the title.
      for (let k = 1; k < rows.length; k++) {
        if (isEl(rows[k], "h2") && !isEl(rows[k - 1], "hr")) {
          rows.splice(k, 0, el("hr", {}, []));
          k++;
        }
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const items = [
        { label: "Video tutorial", hint: "Swap ETH for ZEC", href: "#video-tutorial" },
        { label: "What is Maya", hint: "Protocol and Proof of Bond", href: "#what-is-maya-protocol" },
        { label: "Maya vs THORChain", hint: "Key differences", href: "#differences-between-maya-and-thorchain" },
        { label: "Wallets", hint: "Services that support Maya", href: "#maya-protocol-wallet-integration" },
      ];
      if (h1 > -1) rows.splice(h1 + 1, 0, el("jumpnav", { title: "Jump to", items: JSON.stringify(items) }, []));
    }
    if (opts.redbridge && Array.isArray(tree.children)) {
      // red·bridge: notice, jump list, features and components as numbered points, milestones as numbered points, updates section.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const h2Text = (x: any) => textOf(x).replace(/#$/, "").trim();
      const hasImg = (x: any): boolean => isEl(x, "img") || (x?.children || []).some(hasImg);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        const j = x && (x.type === "mdxJsxFlowElement" || x.type === "element") ? JSON.stringify(x) : "";
        if (isWs(x) || isEl(x, "hr") || j.toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
        else if (isEl(x, "p") && hasImg(x) && !textOf(x).trim()) rows.splice(i, 1);
      }
      const trimFirst = (kids: any[], re: RegExp) => {
        const k = kids.findIndex((c: any) => c.type === "text" && String(c.value).trim());
        if (k > -1) kids[k] = txt(String(kids[k].value).replace(re, ""));
        return kids;
      };
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      // Key features: "Label: text" lines become numbered points.
      const kf = rows.findIndex((x) => isEl(x, "h3") && /^key features$/i.test(textOf(x).trim()));
      if (kf > -1 && isEl(rows[kf + 1], "p")) {
        const pts: any[] = [];
        for (const line of textOf(rows[kf + 1]).split("\n")) {
          const m = /^\s*([^:]{3,60}):\s*(.+)$/.exec(line);
          if (m) pts.push(el("pointitem", { n: String(pts.length + 1), title: m[1].trim() }, [el("p", {}, [txt(m[2].trim())])]));
        }
        if (pts.length) rows.splice(kf, 2, el("h2", {}, [txt("Key features")]), el("pointlist", {}, pts));
      }
      // Technical components: bold label plus "Description:" text become numbered points.
      const tc = rows.findIndex((x) => isEl(x, "h3") && /^technical components$/i.test(textOf(x).trim()));
      if (tc > -1) {
        let end = tc + 1;
        const pts: any[] = [];
        while (end < rows.length && isEl(rows[end], "p")) {
          const kids: any[] = rows[end].children || [];
          const si = kids.findIndex((c) => !isWs(c));
          if (si < 0 || !isEl(kids[si], "strong")) break;
          const rest = trimFirst(kids.filter((_: any, k: number) => k !== si), /^\s*Description:\s*/);
          pts.push(el("pointitem", { n: String(pts.length + 1), title: textOf(kids[si]).trim() }, [el("p", {}, rest)]));
          end++;
        }
        if (pts.length) rows.splice(tc, end - tc, el("h2", {}, [txt("Technical components")]), el("pointlist", {}, pts));
      }
      // Deliverables: one numbered point per milestone.
      const dh = rows.findIndex((x) => isEl(x, "h2") && /^deliverables and documentation$/i.test(h2Text(x)));
      const tail = rows.findIndex((x, i) => i > dh && isEl(x, "p") && /^take a look at the github repo/i.test(textOf(x).trim()));
      if (dh > -1 && tail > dh) {
        const seg = rows.slice(dh + 1, tail);
        const firstA = (x: any): any => {
          if (isEl(x, "a")) return x;
          for (const c of x?.children || []) { const r = firstA(c); if (r) return r; }
          return null;
        };
        const grant = firstA(seg[0]);
        const intro = el("p", {}, [txt("The deliverables below come from the project's "), grant ? el("a", { ...grant.properties }, [txt("grant proposal")]) : txt("grant proposal"), txt(", with links to the code and documents produced.")]);
        const pts: any[] = [];
        const add = (n: string, title: string, body: any[]) => pts.push(el("pointitem", { n, title }, body));
        const p0 = seg.find((x: any) => isEl(x, "p") && /^deliverable 1\.1/i.test(textOf(x).trim()));
        const p1 = seg.find((x: any) => isEl(x, "p") && /^deliverable 2\.1/i.test(textOf(x).trim()));
        if (p0) add("1", "Milestone 1: Proof of concept", [el("p", {}, trimFirst([...(p0.children || [])], /^\s*Deliverable 1\.1:\s*/))]);
        if (p1) add("2", "Milestone 2: Architecture", [el("p", {}, [txt("Architecture documents for the bridge: "), ...(p1.children || []).filter((c: any) => isEl(c, "a"))])]);
        for (let k = 0; k < seg.length; k++) {
          const h = seg[k];
          const mm = isEl(h, "h3") ? /^milestone\s+(\d+)\s+(.+)$/i.exec(textOf(h).trim()) : null;
          if (!mm) continue;
          const body: any[] = [];
          for (let q = k + 1; q < seg.length && !isEl(seg[q], "h3"); q++) {
            if (!isEl(seg[q], "p") || /^milestone\s+\d+/i.test(textOf(seg[q]).trim())) continue;
            body.push(seg[q]);
          }
          add(mm[1], "Milestone " + mm[1] + ": " + mm[2].trim(), body);
        }
        const m6 = seg.find((x: any) => isEl(x, "p") && /^milestone\s+6/i.test(textOf(x).trim()));
        if (m6) {
          const lines = textOf(m6).split("\n").map((l) => l.trim()).filter(Boolean);
          const mh = /^milestone\s+6\s+(.+)$/i.exec(lines[0] || "");
          const items = lines.slice(1).map((l) => el("li", {}, [txt(l)]));
          add("6", "Milestone 6: " + (mh ? mh[1] : "Audit and release"), [el("ul", {}, items)]);
        }
        pts.sort((a, b) => Number(a.properties.n) - Number(b.properties.n));
        const t1 = rows[tail];
        const repoA = firstA(t1);
        const t2 = rows[tail + 1];
        const btn = repoA ? el("linkbutton", { href: String(repoA.properties?.href || ""), label: "View the repository" }, []) : null;
        const newBlock = [intro, el("pointlist", {}, pts), ...(btn ? [btn] : []), ...(t2 && isEl(t2, "p") ? [t2] : [])];
        const removeTo = t2 && isEl(t2, "p") ? tail + 2 : tail + 1;
        rows.splice(dh + 1, removeTo - dh - 1, ...newBlock);
      }
      // Updates list gets its own heading and a status notice.
      const ui = rows.findIndex((x) => isEl(x, "ul"));
      if (ui > -1) {
        const li0 = (rows[ui].children || []).find((c: any) => isEl(c, "li"));
        const p0 = li0 && (li0.children || []).find((c: any) => isEl(c, "p"));
        if (p0) trimFirst(p0.children, /^\s*Deliverables:\s*/);
        const notice = el("guidecallout", { title: "Check the current status" }, [
          el("p", { className: ["m-0"] }, [txt("These updates describe plans the project stated at the time of writing, including a mainnet launch in December 2025 and a token airdrop in 2026. Confirm their current status with the red·bridge team before relying on them.")]),
        ]);
        rows.splice(ui, 0, el("h2", {}, [txt("Project updates")]), notice);
      }
      // Notice and jump list after the lead.
      const items = [
        { label: "Key features", hint: "What the bridge offers", href: "#key-features" },
        { label: "Components", hint: "Oracle, contract, privacy layer", href: "#technical-components" },
        { label: "Deliverables", hint: "Grant milestones", href: "#deliverables-and-documentation" },
        { label: "Updates", hint: "Demo site, Zebra, mainnet plans", href: "#project-updates" },
      ];
      const leads = rows.map((x, i) => (i > h1 && isEl(x, "p") ? i : -1)).filter((i) => i > -1);
      const after = (leads[1] ?? lead) + 1;
      if (lead > -1) rows.splice(after, 0, el("jumpnav", { title: "Jump to", items: JSON.stringify(items) }, []));
    }
    if (opts.shapeshift && Array.isArray(tree.children)) {
      // ShapeShift: lead, jump list, key features as numbered points, numbered steps, v4.0 callout, resources as link cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const h2Text = (x: any) => textOf(x).replace(/#$/, "").trim();
      const hasBadge = (x: any): boolean => isEl(x, "img") && /shields\.io\/badge\/edit/i.test(String(x.properties?.src || "")) || (x?.children || []).some(hasBadge);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (isWs(x) || isEl(x, "hr") || hasBadge(x)) rows.splice(i, 1);
      }
      // The Introduction heading goes away: its first paragraph is the lead.
      const ih = rows.findIndex((x) => isEl(x, "h2") && /^introduction$/i.test(h2Text(x)));
      if (ih > -1) {
        rows.splice(ih, 1);
        if (isEl(rows[ih], "p")) rows[ih].properties = { ...(rows[ih].properties || {}), dataLead: "true" };
      }
      // Bold-label bullets become numbered points.
      const toPoints = (ul: any) => {
        const pts: any[] = [];
        for (const li of ul.children || []) {
          if (!isEl(li, "li")) continue;
          const kids: any[] = (li.children || []).filter((c: any) => !isWs(c));
          if (!isEl(kids[0], "strong")) return null;
          const rest = kids.slice(1);
          const first = rest.findIndex((c: any) => c.type === "text");
          if (first > -1) rest[first] = txt(String(rest[first].value).replace(/^\s*:\s*/, ""));
          pts.push(el("pointitem", { n: String(pts.length + 1), title: textOf(kids[0]).trim() }, [el("p", {}, rest)]));
        }
        return pts.length ? el("pointlist", {}, pts) : null;
      };
      const kf = rows.findIndex((x) => isEl(x, "h3") && /^key features$/i.test(textOf(x).trim()));
      if (kf > -1 && isEl(rows[kf + 1], "ul")) {
        const pl = toPoints(rows[kf + 1]);
        if (pl) rows.splice(kf + 1, 1, pl);
      }
      // Hardware wallets added with v4.0.
      const w = rows.findIndex((x) => isEl(x, "ul") && /keepkey/i.test(textOf(x)));
      if (w > -1) {
        const li = (children: any[]) => el("li", {}, children);
        rows[w].children.push(li([el("strong", {}, [txt("Trezor")]), txt(" and "), el("strong", {}, [txt("GridPlus")]), txt(" (hardware wallets, supported natively since v4.0)")]));
      }
      // Routing now also uses NEAR Intents.
      const addNear = (n: any) => {
        if (n?.type === "text" && String(n.value).includes("THORChain, 0x, and others")) n.value = String(n.value).replace("THORChain, 0x, and others", "THORChain, 0x, NEAR Intents, and others");
        (n?.children || []).forEach(addNear);
      };
      rows.forEach(addNear);
      // "Step N: Title" becomes a numbered step; other subheadings get a hairline.
      for (let k = 0; k < rows.length; k++) {
        if (!isEl(rows[k], "h3") || /^resources$/i.test(textOf(rows[k]).trim())) continue;
        const t = textOf(rows[k]).trim();
        const mm = /^step\s+(\d+)\s*[:.\-]\s*(.+)$/i.exec(t);
        rows[k] = mm ? el("h3", { dataStep: mm[1] }, [txt(mm[2])]) : el("h3", { dataRule: "true" }, [txt(t)]);
      }
      // ShapeShift v4.0 callout after the delisting history.
      const dl = rows.findIndex((x) => isEl(x, "h3") && /from delisting to default/i.test(textOf(x)));
      if (dl > -1) {
        let end = dl + 1;
        while (end < rows.length && !isEl(rows[end], "h2") && !isEl(rows[end], "h3")) end++;
        const items = [
          { n: "1", title: "Zcash as the default privacy rail", body: "ZEC is built into the wallet and routing stack, so private routing is the default across Bitcoin, Ethereum and Cosmos assets." },
          { n: "2", title: "NEAR Intents routing", body: "A cross-chain framework where you state the outcome you want and the system handles execution across networks." },
          { n: "3", title: "Hardware wallet support", body: "Trezor and GridPlus work natively, so you can swap straight from cold storage." },
          { n: "4", title: "Clearer signing", body: "Transaction details are shown for review before you sign, to reduce blind signing." },
        ].map((it) => el("pointitem", { n: it.n, title: it.title }, [el("p", {}, [txt(it.body)])]));
        rows.splice(end, 0, el("h3", { dataRule: "true" }, [txt("What v4.0 added")]), el("pointlist", {}, items));
      }
      // Summary and resources.
      const sm = rows.findIndex((x) => isEl(x, "h2") && /^summary$/i.test(h2Text(x)));
      const ri = rows.findIndex((x) => isEl(x, "h3") && /^resources$/i.test(textOf(x).trim()));
      if (ri > -1) {
        const card = (name: string, desc: string, href: string) => el("communitycard", { name, desc, href }, []);
        rows.splice(ri, rows.length - ri,
          el("h2", {}, [txt("Resources")]),
          el("communitygrid", {}, [
            card("ShapeShift", "The decentralized, non-custodial trading platform.", "https://shapeshift.com/"),
            card("Zcash", "Official project website.", "https://z.cash/"),
            card("Zodl wallet", "A Zcash wallet with Unified Address and shielding support.", "https://zodl.com"),
            card("FOX token governance", "How ShapeShift DAO governance works (archived page).", "https://web.archive.org/web/20210126180411/https://shapeshift.com/fox-token"),
            card("Zcash Community Grants", "The program that funded the integration.", "https://zcashcommunitygrants.org/"),
            card("crypto.news", "ShapeShift integrates Zcash to bolster onchain privacy.", "https://crypto.news/shapeshift-integrates-zcash-to-enable-true-onchain-privacy/"),
            card("Invezz", "ShapeShift unveils v4.0, re-centering privacy and self-custody.", "https://invezz.com/news/2025/12/18/shapeshift-unveils-version-4-0-re-centering-privacy-and-self-custody-in-defi/"),
            card("Cointelegraph", "ShapeShift rolls out support for shielded Zcash transactions.", "https://cointelegraph.com/news/shapeshift-rolls-out-support-for-shielded-zcash-transactions-for-true-privacy"),
            card("CFOtech", "ShapeShift makes Zcash the default rail in its V4 privacy push.", "https://cfotech.co.uk/story/shapeshift-makes-zcash-default-rail-in-v4-privacy-push"),
          ]),
        );
      }
      void sm;
      // Jump list after the lead paragraphs.
      const lead = rows.findIndex((x) => isEl(x, "p") && x.properties?.dataLead);
      const items = [
        { label: "What is ShapeShift", hint: "History and key features", href: "#what-is-shapeshift" },
        { label: "How Zcash works", hint: "Shielded transactions", href: "#how-zcash-works" },
        { label: "Swap ZEC", hint: "Six steps", href: "#how-to-swap-zec-on-shapeshift" },
        { label: "Why it matters", hint: "Privacy in DeFi, v4.0", href: "#why-this-integration-matters" },
      ];
      if (lead > -1) {
        const at = isEl(rows[lead + 1], "p") ? lead + 2 : lead + 1;
        rows.splice(at, 0, el("jumpnav", { title: "Jump to", items: JSON.stringify(items) }, []));
      }
    }
    if (opts.free2z && Array.isArray(tree.children)) {
      // Free2Z: lead, jump list, framed screenshots, requirements callout, control labels as numbered points, resources as link cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const h2Text = (x: any) => textOf(x).replace(/#$/, "").trim();
      const hasBadge = (x: any): boolean => isEl(x, "img") && /shields\.io\/badge\/edit/i.test(String(x.properties?.src || "")) || (x?.children || []).some(hasBadge);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (isWs(x) || isEl(x, "hr") || hasBadge(x)) rows.splice(i, 1);
      }
      // Introduction heading goes away: its paragraph is the lead.
      const ih = rows.findIndex((x) => isEl(x, "h2") && /^introduction$/i.test(h2Text(x)));
      if (ih > -1) {
        rows.splice(ih, 1);
        if (isEl(rows[ih], "p")) rows[ih].properties = { ...(rows[ih].properties || {}), dataLead: "true" };
      }
      // Screenshots get the blue frame.
      const frame = (x: any) => {
        if (isEl(x, "img")) x.properties = { ...(x.properties || {}), dataFrame: "true" };
        (x?.children || []).forEach(frame);
      };
      rows.forEach(frame);
      // Requirements to go live: the list and its follow-up sentence become one callout.
      const gl = rows.findIndex((x) => isEl(x, "h3") && /^how to go live$/i.test(textOf(x).trim()));
      if (gl > -1) {
        const oi = rows.findIndex((x, i) => i > gl && isEl(x, "ol"));
        if (oi > -1) {
          const follow = isEl(rows[oi + 1], "p") && /^if the creator meets/i.test(textOf(rows[oi + 1]).trim()) ? 1 : 0;
          rows.splice(oi, 1 + follow, el("guidecallout", { title: "Requirements" }, [rows[oi], ...(follow ? [rows[oi + 1]] : [])]));
        }
      }
      // Bold-label bullets (live stream controls) become numbered points.
      for (let k = 0; k < rows.length; k++) {
        const ul = rows[k];
        if (!isEl(ul, "ul")) continue;
        const lis = (ul.children || []).filter((c: any) => isEl(c, "li"));
        const pts: any[] = [];
        for (const li of lis) {
          const kids: any[] = (li.children || []).filter((c: any) => !isWs(c));
          if (!isEl(kids[0], "strong")) break;
          const rest = kids.slice(1);
          const first = rest.findIndex((c: any) => c.type === "text");
          if (first > -1) rest[first] = txt(String(rest[first].value).replace(/^\s*:\s*/, ""));
          pts.push(el("pointitem", { n: String(pts.length + 1), title: textOf(kids[0]).trim() }, [el("p", {}, rest)]));
        }
        if (pts.length && pts.length === lis.length) rows[k] = el("pointlist", {}, pts);
      }
      // The "Written by" credit stays last; subheadings get a hairline.
      for (let k = 0; k < rows.length; k++) {
        if (isEl(rows[k], "h3") && !/^resources$/i.test(textOf(rows[k]).trim())) rows[k] = el("h3", { dataRule: "true" }, [txt(textOf(rows[k]).trim())]);
      }
      // Resources as link cards.
      const ri = rows.findIndex((x) => isEl(x, "h3") && /^resources$/i.test(textOf(x).trim()));
      if (ri > -1) {
        const card = (name: string, desc: string, href: string) => el("communitycard", { name, desc, href }, []);
        const credit = rows.slice(ri + 1).find((x: any) => isEl(x, "p") && /^written by/i.test(textOf(x).trim()));
        rows.splice(ri, rows.length - ri,
          el("h2", {}, [txt("Resources")]),
          el("communitygrid", {}, [
            card("Free2Z", "The platform: create an account and explore creators.", "https://free2z.cash/"),
            card("Documentation", "Official Free2Z docs.", "https://free2z.cash/docs/"),
            card("2Z overview", "How 2Zs (Tuzies) work.", "https://free2z.cash/docs/getting-started/tuzis"),
            card("Creating a profile", "Set up a creator page.", "https://free2z.cash/docs/for-creators/creating-a-profile"),
            card("What is Free2Z Live?", "Livestreaming for creators.", "https://free2z.cash/docs/for-creators/free2z-live"),
            card("Free2Z for supporters", "Guides for subscribing and donating (archived copy).", "https://web.archive.org/web/20260118172223/https://free2z.cash/docs/category/for-supporters/"),
          ]),
          ...(credit ? [credit] : []),
        );
      }
      // Jump list after the lead.
      const lead = rows.findIndex((x) => isEl(x, "p") && x.properties?.dataLead);
      const items = [
        { label: "Create an account", hint: "Username or Twitter", href: "#create-your-account" },
        { label: "Profile", hint: "Avatar, banner, member price", href: "#personalize-your-profile" },
        { label: "2Zs and donations", hint: "Credits, subscribing, funding", href: "#subscriptions-and-2zs" },
        { label: "Live streaming", hint: "Go live and tools", href: "#live-streaming" },
      ];
      if (lead > -1) rows.splice(lead + 1, 0, el("jumpnav", { title: "Jump to", items: JSON.stringify(items) }, []));
    }
    if (opts.usezec && Array.isArray(tree.children)) {
      // Using ZEC, privately: lead, jump list, section headings, video cards, callout, resources card.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const hasBadge = (x: any): boolean => isEl(x, "img") && /shields\.io\/badge\/edit/i.test(String(x.properties?.src || "")) || (x?.children || []).some(hasBadge);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (isWs(x) || isEl(x, "hr") || hasBadge(x)) rows.splice(i, 1);
      }
      const fixText = (n: any) => {
        if (n?.type === "text") n.value = String(n.value).replace(/leakeage/g, "leakage").replace(/\(ie\./g, "(i.e.").replace(/\bsuper easy\b/g, "straightforward");
        (n?.children || []).forEach(fixText);
      };
      rows.forEach(fixText);
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      // Section headings.
      const rename: [RegExp, string][] = [
        [/^shielded \(private\) vs\. transparent$/i, "Shielded vs. transparent"],
        [/^making sure your zec is shielded$/i, "Make sure your ZEC is shielded"],
        [/^transactions$/i, "Transacting privately"],
        [/^resources$/i, "Resources"],
      ];
      for (let k = 0; k < rows.length; k++) {
        if (!isEl(rows[k], "h4")) continue;
        const t = textOf(rows[k]).trim();
        const hit = rename.find(([re]) => re.test(t));
        rows[k] = el("h2", {}, [txt(hit ? hit[1] : t)]);
      }
      // The first paragraph is the lead.
      const first = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      // Withdrawal paths: bold labels become subheadings.
      for (let k = 0; k < rows.length; k++) {
        const x = rows[k];
        if (!isEl(x, "p")) continue;
        const t = textOf(x).trim();
        if (/^from an exchange that supports (shielded|transparent) withdrawals:?$/i.test(t)) rows[k] = el("h3", { dataRule: "true" }, [txt(t.replace(/:$/, ""))]);
      }
      // Videos: each intro sentence becomes a subheading above a compact video card.
      const vids: [RegExp, string][] = [
        [/^here's a tutorial for how to withdraw zec/i, "Withdraw ZEC from an exchange (shielded)"],
        [/^here's a tutorial for how to shield your zec/i, "Shield ZEC from a transparent address"],
        [/^here's a tutorial for how to buy zec on coinbase/i, "Buy ZEC on Coinbase and send it to Zodl"],
      ];
      let firstVideo = -1;
      for (let k = 0; k < rows.length; k++) {
        const x = rows[k];
        if (!isEl(x, "p")) continue;
        const hit = vids.find(([re]) => re.test(textOf(x).trim()));
        if (!hit) continue;
        const nx = rows[k + 1];
        const findFrame = (n: any): any => {
          if (!n || !(n.type === "element" || n.type === "mdxJsxFlowElement")) return null;
          if ((n.tagName || n.name) === "iframe") return n;
          return (n.children || []).map(findFrame).find(Boolean) || null;
        };
        const attrOf = (n: any, key: string): string => {
          if (n.properties && n.properties[key] != null) return String(n.properties[key]);
          const hit = (n.attributes || []).find((at: any) => at.name === key);
          return hit && typeof hit.value === "string" ? hit.value : "";
        };
        const fr = findFrame(nx);
        const m = fr ? attrOf(fr, "src").match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})/) : null;
        if (!fr || !m) continue;
        const note = /shielded withdrawal/i.test(textOf(x)) ? [el("p", {}, [txt("This tutorial shows a shielded withdrawal.")])] : [];
        rows.splice(k, 2, el("h3", { dataRule: "true" }, [txt(hit[1])]), ...note, el("videoblock", { exvideo: m[1], extitle: attrOf(fr, "title") }, []));
        if (firstVideo < 0) firstVideo = k;
      }
      if (firstVideo > -1) rows.splice(firstVideo, 0, el("h2", {}, [txt("Video tutorials")]));
      // Habits that weaken privacy: the list becomes a callout.
      const tr = rows.findIndex((x) => isEl(x, "h2") && /^transacting privately$/i.test(textOf(x).trim()));
      if (tr > -1) {
        const ui = rows.findIndex((x, i) => i > tr && isEl(x, "ul"));
        if (ui > -1) rows.splice(ui, 1, el("guidecallout", { title: "Habits that weaken your privacy" }, [rows[ui]]));
      }
      // Resources as a link card.
      const ri = rows.findIndex((x) => isEl(x, "h2") && /^resources$/i.test(textOf(x).trim()));
      if (ri > -1) rows.splice(ri + 1, rows.length - ri - 1, el("communitygrid", {}, [el("communitycard", { name: "Zcash transactions", desc: "How shielded and transparent transactions work.", href: "https://zechub.wiki/using-zcash/transactions" }, [])]));
      // Jump list right after the title.
      const items = [
        { label: "Shielded vs. transparent", hint: "The two address types", href: "#shielded-vs-transparent" },
        { label: "Shield your ZEC", hint: "Two paths from an exchange", href: "#make-sure-your-zec-is-shielded" },
        { label: "Video tutorials", hint: "Withdraw, shield, buy", href: "#video-tutorials" },
        { label: "Transacting", hint: "Habits to avoid", href: "#transacting-privately" },
      ];
      void first;
      if (h1 > -1) rows.splice(h1 + 1, 0, el("jumpnav", { title: "Jump to", items: JSON.stringify(items) }, []));
    }
    if (opts.keystone && Array.isArray(tree.children)) {
      // Keystone + Zodl (formerly Zashi): rebuilt around the current Zodl instructions, with numbered steps, notices, video cards and link cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const li = (...kids: any[]) => el("li", {}, kids);
      const ul = (items: any[][]) => el("ul", {}, items.map((k) => el("li", {}, k)));
      const ol = (items: any[][]) => el("ol", {}, items.map((k) => el("li", {}, k)));
      const a = (href: string, label: string) => el("a", { href, target: "_blank", rel: "noreferrer" }, [txt(label)]);
      const b = (t: string) => el("strong", {}, [txt(t)]);
      const p = (...kids: any[]) => el("p", {}, kids);
      const attrOf = (n: any, key: string): string => {
        if (n.properties && n.properties[key] != null) return String(n.properties[key]);
        const hit = (n.attributes || []).find((at: any) => at.name === key);
        return hit && typeof hit.value === "string" ? hit.value : "";
      };
      const frames: { id: string; title: string }[] = [];
      const collect = (n: any) => {
        if (n && (n.type === "element" || n.type === "mdxJsxFlowElement") && (n.tagName || n.name) === "iframe") {
          const m = attrOf(n, "src").match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})/);
          if (m) frames.push({ id: m[1], title: attrOf(n, "title") });
        }
        (n?.children || []).forEach(collect);
      };
      rows.forEach(collect);
      const video = (i: number, title: string) => (frames[i] ? el("videoblock", { exvideo: frames[i].id, extitle: title }, []) : null);
      const h1i = rows.findIndex((x) => isEl(x, "h1"));
      const nav = rows.slice(0, h1i);
      const out: any[] = [
        ...nav,
        el("h1", {}, [txt("Keystone Zodl (Zashi) User Guide")]),
        el("p", { dataLead: "true" }, [txt("Keystone lets you keep shielded ZEC in cold storage and spend it from the Zodl app on your phone. The Zcash community has faced setbacks with other hardware wallet platforms in the past, but Keystone became a collaborative partner willing to push boundaries alongside the Electric Coin Company, and the Keystone team received a ZCG grant for its side of the work.")]),
        el("guidecallout", { title: "Zashi is now Zodl" }, [
          p(txt("The Zashi app was renamed "), b("Zodl"), txt(" in 2026. This guide uses the new name and keeps \"(Zashi)\" in the title because older screenshots, videos and posts still show the former Zashi app. Existing wallets, seed phrases and funds are unchanged.")),
        ]),
        el("jumpnav", {
          title: "Jump to",
          items: JSON.stringify([
            { label: "Tutorial", hint: "Video walkthrough", href: "#video-tutorial" },
            { label: "Preparation", hint: "What you need", href: "#preparation" },
            { label: "Set up Keystone", hint: "Verify, update, create", href: "#set-up-your-keystone" },
            { label: "Connect to Zodl", hint: "Pair and fund", href: "#connect-keystone-to-zodl" },
          ]),
        }, []),
        el("h2", {}, [txt("Video tutorial")]),
        ...(video(0, "Keystone X Zodl (Zashi) tutorial") ? [video(0, "Keystone X Zodl (Zashi) tutorial")] : []),
        el("h2", {}, [txt("Preparation")]),
        el("guidecallout", { title: "Supported device" }, [
          p(txt("Zodl supports the "), b("Keystone 3 Pro"), txt(" running Keystone's "), b("Cypherpunk firmware"), txt(", the only release that supports shielded Zcash. Use a recovery phrase that is different from your Zodl wallet's.")),
        ]),
        ul([
          [a("https://keyst.one", "Order and receive your Keystone 3 Pro"), txt(".")],
          [b("Battery: "), txt("charge above 20% before updating.")],
          [b("USB cable or microSD card: "), txt("the USB cable is included; a microSD card (under 1 TB) is bought separately.")],
          [b("Keystone website: "), txt("used for device verification and the firmware update.")],
          [b("Zodl app "), txt("installed on your phone.")],
        ]),
        el("h2", {}, [txt("Set up your Keystone")]),
        el("h3", { dataStep: "1" }, [txt("Verify the device")]),
        p(txt("Device verification detects tampering during transport, prevents supply chain attacks and confirms the installed firmware is genuine. Choose your language, then:")),
        ol([
          [txt("Open the Device Verification page on the "), a("https://keyst.one/get-started", "Keystone website"), txt(".")],
          [txt("Click Scan QR Code on the website.")],
          [txt("Scan the QR code on the website with the Keystone camera.")],
          [txt("A verification code appears on the Keystone screen.")],
          [txt("Enter that code on the website to complete verification.")],
        ]),
        el("h3", { dataStep: "2" }, [txt("Update the firmware")]),
        p(txt("Install the latest "), b("Cypherpunk"), txt(" firmware from the "), a("https://keyst.one/firmware", "Keystone firmware page"), txt(". Keep the battery above 20% and choose one method.")),
        el("h4", {}, [txt("Update with a microSD card")]),
        ol([
          [txt("Format the card as FAT32 on your computer.")],
          [txt("Download the firmware and save "), el("code", {}, [txt("keystone3.bin")]), txt(" in the root of the card.")],
          [txt("Insert the card into the Keystone.")],
          [txt("Open Upgrade on the device and follow the on-screen instructions.")],
        ]),
        el("h4", {}, [txt("Update with a USB cable")]),
        el("guidecallout", { title: "Before you start" }, [p(txt("If your firmware is below 1.0.4, do the first update with a microSD card. USB updates work after that."))]),
        ol([
          [txt("Connect the Keystone to your computer and tap Approve to allow USB access; otherwise it may only charge.")],
          [txt("Open the "), a("https://keyst.one/firmware", "Keystone firmware page"), txt(" in your computer's browser.")],
          [txt("Click Install Update and follow the instructions.")],
        ]),
        el("h3", { dataStep: "3" }, [txt("Create the wallet")]),
        ol([
          [b("Set a PIN or password "), txt("that is strong.")],
          [b("Name the wallet "), txt("(optional).")],
          [txt("Select Create New Wallet for a first-time setup. The device generates a 24-word recovery phrase.")],
          [txt("Write the phrase down, store it securely and confirm the words in order.")],
        ]),
        el("guidecallout", { title: "Never reuse a recovery phrase" }, [p(txt("Do not import the recovery phrase of your Zodl wallet into the Keystone. A phrase that has touched a phone removes the security benefit of a hardware wallet."))]),
        el("h2", {}, [txt("Connect Keystone to Zodl")]),
        el("h3", { dataStep: "4" }, [txt("Pair the two devices")]),
        ol([
          [b("On the Keystone: "), txt("enter your PIN, tap "), b("..."), txt(" in the upper-right corner, tap Connect Software Wallet and choose Zodl. A QR code appears.")],
          [b("In Zodl: "), txt("tap the logo in the upper-left corner, then Connect Hardware Wallet.")],
          [txt("Tap Ready to Scan and scan the QR code on the Keystone. The code changes, so scan the full sequence.")],
          [txt("Select the wallet name you gave on the Keystone and tap Unlock.")],
        ]),
        p(txt("To switch between your Zodl wallet and the Keystone wallet, use the selector in the upper-left corner of Zodl.")),
        el("h3", { dataStep: "5" }, [txt("Add or resync funds")]),
        ul([
          [b("New Keystone wallet: "), txt("tap Receive to add funds, or from your Zodl wallet tap Send and choose the Keystone entry in your address book.")],
          [b("Existing Keystone wallet: "), txt("the balance first shows 0.000 ZEC. Open "), b("..."), txt(" > More > Advanced Settings > Resync, tap Change, choose a month before you first used the wallet, then Confirm.")],
        ]),
        el("h2", {}, [txt("Video guides")]),
        el("p", {}, [txt("These videos were recorded with the former Zashi app. The steps are the same in Zodl; only the app name and logo differ.")]),
        ...(frames[1] ? [el("h3", { dataRule: "true" }, [txt("Connect Keystone to Zodl (Zashi)")]), video(1, "Connect Keystone Hardware Wallet to Zodl (Zashi)")] : []),
        ...(frames[2] ? [el("h3", { dataRule: "true" }, [txt("Sign an outgoing transaction")]), video(2, "Sign an Outgoing Transaction with Keystone")] : []),
        el("h2", {}, [txt("Resources")]),
        el("communitygrid", {}, [
          el("communitycard", { name: "Keystone", desc: "Order a Keystone 3 Pro and read the getting-started guide.", href: "https://keyst.one/get-started" }, []),
          el("communitycard", { name: "Firmware update", desc: "Download the Cypherpunk firmware.", href: "https://keyst.one/firmware" }, []),
          el("communitycard", { name: "Connecting a Keystone wallet", desc: "The official Zodl support article.", href: "https://support.zodl.com/article/33-connecting-a-keystone-wallet" }, []),
          el("communitycard", { name: "Zashi is becoming Zodl", desc: "Announcement of the app rename.", href: "https://zodl.com/zashi-is-becoming-zodl/" }, []),
          el("communitycard", { name: "Original announcement (Zashi)", desc: "The Zashi and Keystone integration thread on X.", href: "https://x.com/zashi_app/status/1869793574880973144" }, []),
        ]),
      ];
      rows.splice(0, rows.length, ...out);
    }
    if (opts.brave && Array.isArray(tree.children)) {
      // Brave Wallet + shielded ZEC: lead, requirements callout, jump list, numbered parts, framed screenshots, address types as points, resources.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const h2Text = (x: any) => textOf(x).replace(/#$/, "").trim();
      const hasBadge = (x: any): boolean => isEl(x, "img") && /shields\.io\/badge\/edit/i.test(String(x.properties?.src || "")) || (x?.children || []).some(hasBadge);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (isWs(x) || isEl(x, "hr") || hasBadge(x)) rows.splice(i, 1);
      }
      const attrOf = (n: any, key: string): string => {
        if (n.properties && n.properties[key] != null) return String(n.properties[key]);
        const hit = (n.attributes || []).find((at: any) => at.name === key);
        return hit && typeof hit.value === "string" ? hit.value : "";
      };
      const findFrame = (n: any): any => {
        if (!n || !(n.type === "element" || n.type === "mdxJsxFlowElement")) return null;
        if ((n.tagName || n.name) === "iframe") return n;
        return (n.children || []).map(findFrame).find(Boolean) || null;
      };
      // Videos become compact cards.
      for (let k = 0; k < rows.length; k++) {
        if (!isEl(rows[k], "div")) continue;
        const fr = findFrame(rows[k]);
        const m = fr ? attrOf(fr, "src").match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})/) : null;
        if (fr && m) rows[k] = el("videoblock", { exvideo: m[1], extitle: attrOf(fr, "title") }, []);
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      // "Why shielded ZEC support matters": the three sentences become bullets.
      const wi = rows.findIndex((x) => isEl(x, "h2") && /^why shielded zec support matters$/i.test(h2Text(x)));
      if (wi > -1) {
        let end = wi + 1;
        const lis: any[] = [];
        while (end < rows.length && isEl(rows[end], "p")) { lis.push(el("li", {}, rows[end].children || [])); end++; }
        if (lis.length) rows.splice(wi + 1, end - wi - 1, el("ul", {}, lis));
      }
      // Tutorial heading, parts as numbered sections, "Steps covered" labels dropped, screenshots framed with real alt text.
      const alts = ["Brave Wallet dashboard after setup", "Manage Assets with ZEC enabled", "Receive screen showing a Zcash Unified Address", "Send screen for shielded ZEC"];
      let imgN = 0;
      const frame = (x: any) => {
        if (isEl(x, "img")) {
          x.properties = { ...(x.properties || {}), dataFrame: "true", alt: alts[imgN] || x.properties?.alt || "" };
          imgN++;
        }
        (x?.children || []).forEach(frame);
      };
      for (let k = rows.length - 1; k >= 0; k--) {
        const x = rows[k];
        if (isEl(x, "p") && /^steps covered:?$/i.test(textOf(x).trim())) rows.splice(k, 1);
      }
      for (let k = 0; k < rows.length; k++) {
        const x = rows[k];
        if (isEl(x, "h2")) {
          const t = h2Text(x);
          const mm = /^part\s+(\d+)\s*[:.\-]\s*(.+)$/i.exec(t);
          if (mm) rows[k] = el("h2", { dataStep: mm[1] }, [txt(mm[2])]);
          else if (/^tutorial$/i.test(t)) rows[k] = el("h2", {}, [txt("Video tutorial")]);
          else if (/^advanced$/i.test(t)) rows[k] = el("h2", {}, [txt("Advanced: DeFi with NEAR Intents")]);
        }
        if (isEl(x, "p") && findImg(x)) frame(x);
      }
      function findImg(n: any): boolean { return isEl(n, "img") || (n?.children || []).some(findImg); }
      // Address types as numbered points.
      const ai = rows.findIndex((x) => isEl(x, "h2") && /^address types$/i.test(h2Text(x)));
      if (ai > -1) {
        let end = ai + 1;
        while (end < rows.length && !isEl(rows[end], "h2")) end++;
        const body = (x: any) => {
          const kids: any[] = (x.children || []).filter((c: any) => !isWs(c));
          const rest = kids.slice(1);
          const f = rest.findIndex((c: any) => c.type === "text");
          if (f > -1) rest[f] = txt(String(rest[f].value).replace(/^\s*[-\u2013\u2014]\s*/, ""));
          return rest;
        };
        const pts: any[] = [];
        for (const x of rows.slice(ai + 1, end)) {
          if (!isEl(x, "p")) continue;
          const kids: any[] = (x.children || []).filter((c: any) => !isWs(c));
          if (!isEl(kids[0], "strong")) continue;
          pts.push(el("pointitem", { n: String(pts.length + 1), title: textOf(kids[0]).trim() }, [el("p", {}, body(x))]));
        }
        if (pts.length) rows.splice(ai + 1, end - ai - 1, el("pointlist", {}, pts));
      }
      // Conclusion without the slogan, then resources.
      for (let k = rows.length - 1; k >= 0; k--) {
        if (isEl(rows[k], "p") && /^stay private\. stay free/i.test(textOf(rows[k]).trim())) rows.splice(k, 1);
      }
      const card = (name: string, desc: string, href: string) => el("communitycard", { name, desc, href }, []);
      rows.push(
        el("h2", {}, [txt("Resources")]),
        el("communitygrid", {}, [
          card("Zcash and address types", "Brave's support article on Zcash in Brave Wallet.", "https://support.brave.app/hc/en-us/articles/26390040705165-Zcash-and-Address-Types"),
          card("Brave Wallet announcement", "Shielded Zcash arrives in Brave desktop v1.77.", "https://x.com/brave/status/1907467306034409554"),
          card("Community walkthrough", "Step-by-step guide with real transactions and screenshots.", "https://forum.zcashcommunity.com/t/getting-started-with-brave-wallet-for-zcash-a-step-by-step-walkthrough-with-real-transactions-and-screenshots/51921"),
          card("Ironwood support in Brave", "Tracking issue for NU6.3 support in Brave Wallet.", "https://github.com/brave/brave-browser/issues/56872"),
        ]),
      );
      // Requirements callout and jump list after the lead.
      const note = el("guidecallout", { title: "Before you start" }, [
        el("ul", { className: ["m-0"] }, [
          el("li", {}, [el("strong", {}, [txt("Desktop only: ")]), txt("shielded ZEC works in Brave on desktop. Brave's support page says Android and iOS are not available yet.")]),
          el("li", {}, [el("strong", {}, [txt("Version: ")]), txt("Brave 1.77 or newer. Keep Brave updated, since support for the Ironwood (NU6.3) upgrade is being rolled out in newer releases.")]),
        ]),
      ]);
      const jump = el("jumpnav", {
        title: "Jump to",
        items: JSON.stringify([
          { label: "Set up", hint: "Install and add ZEC", href: "#setting-up-brave-wallet" },
          { label: "Receive", hint: "Unified Address", href: "#receiving-shielded-zec-unified-address" },
          { label: "Send", hint: "Private transfer", href: "#sending-shielded-zec-privately" },
          { label: "Address types", hint: "t, z and unified", href: "#address-types" },
        ]),
      }, []);
      if (lead > -1) rows.splice(lead + 1, 0, note, jump);
    }
    if (opts.explorers && Array.isArray(tree.children)) {
      // Blockchain explorers: lead, jump list, example cards, numbered concepts, TL;DR callout, explorer cards, visual guide.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const hTxt = (x: any) => textOf(x).replace(/#$/, "").trim();
      const hasBadge = (x: any): boolean => isEl(x, "img") && /shields\.io\/badge\/edit/i.test(String(x.properties?.src || "")) || (x?.children || []).some(hasBadge);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (isWs(x) || isEl(x, "hr") || hasBadge(x)) rows.splice(i, 1);
      }
      const firstA = (x: any): any => {
        if (isEl(x, "a")) return x;
        for (const c of x?.children || []) { const r = firstA(c); if (r) return r; }
        return null;
      };
      const findAll = (n: any, tag: string, acc: any[] = []) => {
        if (isEl(n, tag)) acc.push(n);
        (n?.children || []).forEach((c: any) => findAll(c, tag, acc));
        return acc;
      };
      const fixText = (n: any) => {
        if (n?.type === "text") {
          n.value = String(n.value)
            .replace(/\bEthscan\b/g, "Etherscan")
            .replace(/transaction id's/g, "transaction IDs")
            .replace(/CEX's/g, "CEXs")
            .replace(/Sapling or Orchard/g, "Sapling, Orchard or Ironwood")
            .replace(/DOGE, VTC, etc \.\.\. \./g, "DOGE and many others.");
        }
        (n?.children || []).forEach(fixText);
      };
      rows.forEach(fixText);
      const frame = (x: any) => {
        if (isEl(x, "img")) x.properties = { ...(x.properties || {}), dataFrame: "true" };
        (x?.children || []).forEach(frame);
      };
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      // Introduction heading goes away; its paragraph is the lead.
      const ih = rows.findIndex((x) => isEl(x, "h2") && /^introduction$/i.test(hTxt(x)));
      if (ih > -1) {
        rows.splice(ih, 1);
        if (isEl(rows[ih], "p")) rows[ih].properties = { ...(rows[ih].properties || {}), dataLead: "true" };
      }
      // Examples: one card per transaction, then the Zcash comparison as a callout.
      const ex = rows.findIndex((x) => isEl(x, "h2") && /^examples$/i.test(hTxt(x)));
      if (ex > -1) {
        const lis = findAll(rows[ex + 1], "li");
        const cards = lis.map((l) => {
          const a = firstA(l);
          const t = textOf(l).trim();
          const name = t.split(":")[0].trim();
          const hash = textOf(a || l).trim();
          return el("communitycard", { name, desc: "Transaction " + hash.slice(0, 10) + "\u2026" + hash.slice(-6), href: String(a?.properties?.href || "") }, []);
        }).filter((c) => c.properties.href);
        if (cards.length) {
          rows.splice(ex + 1, 1, el("communitygrid", {}, cards));
          const nt = rows[ex + 2];
          if (isEl(nt, "h4")) rows[ex + 2] = el("guidecallout", { title: "Compare the two Zcash transactions" }, [el("p", {}, [txt(textOf(nt).trim())])]);
        }
      }
      // Blockchain maps -> How explorers work, with Blocks / Addresses / Amounts as numbered points.
      const bm = rows.findIndex((x) => isEl(x, "h2") && /^blockchain maps$/i.test(hTxt(x)));
      if (bm > -1) {
        rows[bm] = el("h2", {}, [txt("How explorers work")]);
        let end = bm + 1;
        while (end < rows.length && !isEl(rows[end], "h2") && !(isEl(rows[end], "h3") && /^what an explorer/i.test(textOf(rows[end]).trim()))) end++;
        const pts: any[] = [];
        const after: any[] = [];
        const intro: any[] = [];
        let k = bm + 1;
        while (k < end && !isEl(rows[k], "h3")) { intro.push(rows[k]); k++; }
        while (k < end) {
          if (!isEl(rows[k], "h3")) { after.push(rows[k]); k++; continue; }
          const title = textOf(rows[k]).trim();
          const body: any[] = [];
          k++;
          while (k < end && !isEl(rows[k], "h3")) {
            if (isEl(rows[k], "p") && findAll(rows[k], "img").length) after.push(rows[k]);
            else body.push(rows[k]);
            k++;
          }
          pts.push(el("pointitem", { n: String(pts.length + 1), title }, body));
        }
        after.forEach(frame);
        if (pts.length) rows.splice(bm + 1, end - bm - 1, ...intro, el("pointlist", {}, pts), ...after);
      }
      // Zcash section: heading, TL;DR callout.
      const zi = rows.findIndex((x) => isEl(x, "h3") && /^what an explorer can and cannot see/i.test(textOf(x).trim()));
      if (zi > -1) {
        rows[zi] = el("h2", {}, [txt(textOf(rows[zi]).trim())]);
        const tl = rows.findIndex((x, i) => i > zi && isEl(x, "h4") && /^tl;?dr$/i.test(textOf(x).trim()));
        if (tl > -1 && isEl(rows[tl + 1], "ul")) {
          rows[tl + 1].children.push(el("li", {}, [txt("Value moving between shielded pools is visible, such as Orchard to Ironwood migrations")]));
          rows.splice(tl, 2, el("guidecallout", { title: "TL;DR" }, [rows[tl + 1]]));
        }
        // Ironwood: new paragraph after the shielded pools paragraph.
        const sp = rows.findIndex((x, i) => i > zi && isEl(x, "p") && /^shielded addresses are the private side/i.test(textOf(x).trim()));
        if (sp > -1) {
          const iron = el("p", {}, [
            el("strong", {}, [txt("Ironwood. ")]),
            txt("The Ironwood network upgrade (NU6.3) added a new shielded pool, active on mainnet since block 3,428,143. Funds move into it with ZIP 318 migration transactions: fully shielded, with no transparent inputs or outputs, but the amount crossing from Orchard into Ironwood shows up as a change in each pool's value balance. Explorers such as "),
            el("a", { href: "https://cipherscan.app/ironwood", target: "_blank", rel: "noreferrer" }, [txt("CipherScan")]),
            txt(" track Ironwood activation, migration and supply."),
          ]);
          rows.splice(sp + 1, 0, iron);
        }
      }
      // Explorer list as cards.
      const li = rows.findIndex((x) => isEl(x, "h3") && /^list of zcash block explorers$/i.test(textOf(x).trim()));
      if (li > -1) {
        rows[li] = el("h2", {}, [txt("Zcash block explorers")]);
        if (isEl(rows[li + 1], "ul")) {
          const cards: any[] = [];
          for (const l of findAll(rows[li + 1], "li")) {
            for (const a of findAll(l, "a")) {
              const href = String(a.properties?.href || "");
              const host = href.replace(/^https?:\/\//, "").replace(/\/$/, "");
              const isTest = /testnet|zectest/i.test(textOf(a) + href);
              const nm = isTest ? "SoChain (testnet)" : textOf(a).trim();
              const desc = /3xpl/i.test(href) ? "Multi-chain explorer with Zcash analytics and downloadable datasets" : host;
              cards.push(el("communitycard", { name: nm, desc, href }, []));
            }
          }
          cards.push(el("communitycard", { name: "CipherScan", desc: "Shielded analytics, client-side memo decryption and an Ironwood migration tracker", href: "https://cipherscan.app" }, []));
          if (cards.length) rows.splice(li + 1, 1, el("communitygrid", {}, cards));
        }
      }
      // Visual guide: one subsection per explorer with its framed screenshot.
      const vg = rows.findIndex((x) => isEl(x, "h3") && /^visual guide$/i.test(textOf(x).trim()));
      if (vg > -1) {
        rows[vg] = el("h2", {}, [txt("Visual guide")]);
        const imgs = rows.slice(vg + 1).filter((x) => isEl(x, "p") && findAll(x, "img").length);
        const ul = rows.slice(vg + 1).find((x) => isEl(x, "ul"));
        const links = ul ? findAll(ul, "a") : [];
        const labels: [string, number][] = [["Bitcoin: Mempool.space", 0], ["Ethereum: Etherscan", 1], ["Zcash: Zcash Block Explorer", 2], ["Cosmos: Mintscan", 3]];
        const built: any[] = [];
        labels.forEach(([label, i]) => {
          const href = String(links[i]?.properties?.href || "");
          built.push(el("h3", { dataRule: "true" }, [txt(label)]));
          if (href) built.push(el("p", {}, [el("a", { href, target: "_blank", rel: "noreferrer" }, [txt(href.replace(/^https?:\/\//, "").replace(/\/$/, ""))])]));
          if (imgs[i]) { frame(imgs[i]); built.push(imgs[i]); }
        });
        let end = vg + 1;
        while (end < rows.length) end++;
        rows.splice(vg + 1, end - vg - 1, el("p", {}, [txt("Four explorers side by side, one per chain. Each shows the same kind of information in its own layout. The screenshots date from 2022, so current interfaces look different.")]), ...built);
      }
      // Jump list after the lead.
      const lead = rows.findIndex((x) => isEl(x, "p") && x.properties?.dataLead);
      const items = [
        { label: "Examples", hint: "Five real transactions", href: "#examples" },
        { label: "How they work", hint: "Blocks, addresses, amounts", href: "#how-explorers-work" },
        { label: "On Zcash", hint: "What an explorer can see", href: "#what-an-explorer-can-and-cannot-see-on-zcash" },
        { label: "Explorers", hint: "Zcash block explorers", href: "#zcash-block-explorers" },
      ];
      void h1;
      if (lead > -1) rows.splice(lead + 1, 0, el("jumpnav", { title: "Jump to", items: JSON.stringify(items) }, []));
    }
    if (opts.zkdecoy && Array.isArray(tree.children)) {
      // ZK vs decoy systems: drop decorative images, lead, quote, comparison table, numbered advantages, update notes, link cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const findAll = (n: any, tag: string, acc: any[] = []) => {
        if (isEl(n, tag)) acc.push(n);
        (n?.children || []).forEach((c: any) => findAll(c, tag, acc));
        return acc;
      };
      const replaceText = (n: any, a: string, b: string) => {
        if (n?.type === "text" && String(n.value).includes(a)) n.value = String(n.value).replace(a, b);
        (n?.children || []).forEach((c: any) => replaceText(c, a, b));
      };
      const BANNER = "257773807-af8ae27d";
      const STOCK = "257788813-509f1139";
      const KEYS = "257793324-2dcc6047";
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        const j = x && (x.type === "mdxJsxFlowElement" || x.type === "element") ? JSON.stringify(x) : "";
        const simple = x && (x.type === "mdxJsxFlowElement" || isEl(x, "p") || isEl(x, "a") || isEl(x, "img")) && !textOf(x).trim();
        if (isWs(x) || j.toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
        else if (simple && (j.includes(BANNER) || j.includes(STOCK))) rows.splice(i, 1);
        else if (isEl(x, "hr")) rows.splice(i, 1);
      }
      // Quote and lead.
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const q = rows.findIndex((x, i) => i > h1 && isEl(x, "p") && /^["“]/.test(textOf(x).trim()));
      if (q > -1) rows[q] = el("blockquote", {}, [rows[q]]);
      const lead = rows.findIndex((x, i) => i > Math.max(q, h1) && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      // At a glance: only points that the guide itself makes.
      const cell = (tag: string, t: string) => el(tag, {}, [txt(t)]);
      const row = (a: string, b: string, c: string) => el("tr", {}, [cell("td", a), cell("td", b), cell("td", c)]);
      const table = el("table", {}, [
        el("thead", {}, [el("tr", {}, [cell("th", ""), cell("th", "Zcash (zero-knowledge proofs)"), cell("th", "Decoy-based (e.g. Monero RingCT)")])]),
        el("tbody", {}, [
          row("Core idea", "A zk-SNARK proves a transaction is valid without revealing the sender, receiver or amount.", "Real inputs are mixed with decoys, and range proofs show the amount is spendable."),
          row("What stays visible", "Shielded transaction details stay confidential.", "Encrypted inputs stay visible, and the flow of transactions between users can still be gathered."),
          row("Anonymity set", "All transactions that ever occurred in the same shielded pool.", "Depends on the number of real users on the network."),
        ]),
      ]);
      const h2a = rows.findIndex((x) => isEl(x, "h2"));
      if (h2a > -1) rows.splice(h2a, 0, el("h2", { id: "at-a-glance" }, [txt("At a glance")]), table);
      // Important Note becomes a callout, followed by an update note on Monero.
      const inote = rows.findIndex((x) => isEl(x, "p") && /^important note/i.test(textOf(x).trim()));
      if (inote > -1) {
        const kids = rows[inote].children || [];
        const first = kids.findIndex((c: any) => !isWs(c));
        if (first > -1 && isEl(kids[first], "strong") && /^important note:?$/i.test(textOf(kids[first]).trim())) {
          kids.splice(first, 1);
          const nx = kids[first];
          if (nx && nx.type === "text") nx.value = String(nx.value).replace(/^\s*:\s*/, "");
        }
        const mon = el("guidecallout", { title: "Monero is changing" }, [el("p", { className: ["m-0"] }, [txt("This guide describes decoy-based privacy as Monero has used it so far. Monero has been developing FCMP++, a design that replaces ring signatures with a proof over the full set of outputs, so check the official Monero announcements for its current status before relying on this comparison.")])]);
        rows.splice(inote, 1, el("guidecallout", { title: "Important note" }, [rows[inote]]), mon);
      }
      // Wording that aged: NU5 is no longer recent.
      for (const r of rows) replaceText(r, "recent NU5 upgrade", "NU5 upgrade (May 2022)");
      for (const r of rows) replaceText(r, "There are a number of instances in which bugs have been identified in", "In the past, bugs have been identified in");
      // The five advantages become one numbered list; paragraphs between the lists belong to the preceding item.
      const firstOl = rows.findIndex((x) => isEl(x, "ol"));
      const summary = rows.findIndex((x, i) => i > firstOl && isEl(x, "p") && /^in summary/i.test(textOf(x).trim()));
      if (firstOl > -1 && summary > firstOl) {
        const items: any[] = [];
        for (let k = firstOl; k < summary; k++) {
          const x = rows[k];
          if (isEl(x, "ol")) {
            for (const li of (x.children || []).filter((c: any) => isEl(c, "li"))) {
              const strong = findAll(li, "strong")[0];
              const title = strong ? textOf(strong).replace(/[:\s]+$/, "").trim() : "";
              const kids: any[] = li.children || [];
              if (strong) {
                const drop = (n: any): boolean => {
                  const ch: any[] = n.children || [];
                  const idx = ch.indexOf(strong);
                  if (idx > -1) {
                    ch.splice(idx, 1);
                    const nx = ch[idx];
                    if (nx && nx.type === "text") nx.value = String(nx.value).replace(/^\s*:\s*/, "");
                    return true;
                  }
                  return ch.some((c) => drop(c));
                };
                drop(li);
              }
              const body = kids.filter((c: any) => !isWs(c));
              const hasBlock = body.some((c: any) => isEl(c, "p"));
              items.push(el("pointitem", { n: String(items.length + 1), title }, hasBlock ? body : [el("p", {}, body)]));
            }
          } else if (items.length) {
            items[items.length - 1].children.push(x);
          }
        }
        if (items.length) {
          const pools = el("guidecallout", { title: "Shielded pools after NU6.3" }, [el("p", { className: ["m-0"] }, [txt("Zcash now has more than one shielded pool. Ironwood, introduced by the NU6.3 upgrade (mainnet block 3,428,143), uses the Orchard shielded protocol but keeps its own value pool, and the anonymity set described above applies within a pool. Because Ironwood uses the same protocol as Orchard, it does not require a trusted setup either.")])]);
          rows.splice(firstOl, summary - firstOl, el("pointlist", {}, items), pools);
        }
      }
      // Reference links become source cards.
      const meta: [string, string, string][] = [
        ["z.cash/learn", "Zcash: Learn", "Official introduction to Zcash"],
        ["getmonero.org/get-started", "What is Monero?", "Official introduction to Monero"],
        ["9s3EbSKDA3o", "Ian Miers at Devcon4", "Talk quoted at the top of this guide"],
        ["nu5-activates", "NU5 activates on mainnet", "Electric Coin Company blog"],
        ["XpRzKqEfpP4", "Zooko at the Orchid (priv8) AMA", "Live session on reducing information leaks"],
        ["zcash-evolution", "The evolution of Zcash", "Electric Coin Company blog"],
        ["zcash-metrics", "Zcash metrics (archived)", "Wayback Machine snapshot, March 2024"],
        ["viewing-keys-selective-disclosure", "Viewing keys and selective disclosure", "Electric Coin Company blog"],
      ];
      const rl = rows.findIndex((x) => isEl(x, "p") && /^reference links$/i.test(textOf(x).trim()));
      if (rl > -1) {
        const hrefs: string[] = [];
        for (let k = rl + 1; k < rows.length; k++) for (const a of findAll(rows[k], "a")) hrefs.push(String(a.properties?.href || ""));
        const cards = meta
          .map(([key, name, desc]) => {
            const href = hrefs.find((h) => h.includes(key));
            return href ? el("communitycard", { name, desc, href, icon: /youtu/.test(href) ? "video" : "file" }, []) : null;
          })
          .filter(Boolean);
        if (cards.length) rows.splice(rl, rows.length - rl, el("h2", { id: "reference-links" }, [txt("Reference links")]), el("addressgrid", {}, cards));
      }
    }
    if (opts.zips && Array.isArray(tree.children)) {
      // Zcash Improvement Proposals: no Edit badge or banner photo, lead, editors list, ZIP cards, jump list.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      const findA = (n: any): any => (n && n.type === "element" && n.tagName === "a" ? n : (n?.children || []).map(findA).find(Boolean));
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        const j = x && (x.type === "mdxJsxFlowElement" || x.type === "element") ? JSON.stringify(x).toLowerCase() : "";
        if (isWs(x) || j.includes("shields.io/badge/edit") || isEl(x, "img")) rows.splice(i, 1);
        else if (x && x.type === "mdxJsxFlowElement" && String(x.name) === "img") rows.splice(i, 1);
        else if (isEl(x, "p") && (x.children || []).filter((c: any) => !isWs(c)).length === 1 && (x.children || []).filter((c: any) => !isWs(c)).every((c: any) => isEl(c, "img") || (c.type === "mdxJsxTextElement" && String(c.name) === "img"))) rows.splice(i, 1);
      }
      const h1s = rows.map((x, i) => (isEl(x, "h1") ? i : -1)).filter((i) => i >= 0);
      if (h1s.length > 1) for (const i of h1s.slice(1)) rows[i].tagName = "h2";
      const first = rows.findIndex((x, i) => i > (h1s[0] ?? -1) && isEl(x, "p"));
      if (first > -1) rows[first].properties = { ...(rows[first].properties || {}), dataLead: "true" };
      // "-> zips.z.cash" becomes a button.
      const lk = rows.findIndex((x) => isEl(x, "p") && /^\s*(->|\u2192)\s*zips\.z\.cash\s*$/i.test(textOf(x)) && findA(x));
      if (lk > -1) rows[lk] = el("linkbutton", { href: String(findA(rows[lk]).properties?.href || "https://zips.z.cash"), label: "Open the ZIP index (zips.z.cash)" });
      // The editors list is written as a code fence of bullets: render it as a real list.
      for (let i = 0; i < rows.length; i++) {
        const x = rows[i];
        if ((isEl(x, "div") || isEl(x, "pre")) && /^\s*\*\s/.test(textOf(x))) {
          const lines = textOf(x).split("\n").map((l: string) => l.replace(/^\s*\*\s*/, "").trim()).filter(Boolean);
          rows[i] = el("ul", {}, lines.map((l: string) => el("li", {}, [txt(l)])));
        }
      }
      // "Status: [Title](zip)" blockquotes become ZIP cards.
      const toCard = (bq: any) => {
        const p = (bq.children || []).find((c: any) => isEl(c, "p"));
        const a = p && findA(p);
        if (!p || !a) return null;
        const kids: any[] = p.children || [];
        const ai = kids.findIndex((c) => c === a || findA(c) === a);
        const status = kids.slice(0, ai).map((c) => textOf(c)).join("").replace(/[:\s]+$/, "").trim();
        const after = kids.slice(ai + 1).map((c) => textOf(c)).join("").replace(/^[\s\u2014\u2013-]+/, "").trim();
        const href = String(a.properties?.href || "");
        const m = /zip-0*(\d+)/i.exec(href);
        const zip = m ? "ZIP " + m[1] : "";
        const desc = [[zip, status].filter(Boolean).join(" \u00b7 "), after].filter(Boolean).join(" \u2014 ");
        return el("communitycard", { name: textOf(a).trim(), desc, href, icon: "file" });
      };
      for (let i = 0; i < rows.length; i++) {
        if (!isEl(rows[i], "blockquote") || !toCard(rows[i])) continue;
        let j = i;
        const cards: any[] = [];
        while (j < rows.length && isEl(rows[j], "blockquote")) {
          const c = toCard(rows[j]);
          if (!c) break;
          cards.push(c);
          j += 1;
        }
        rows.splice(i, j - i, el("addressgrid", {}, cards));
      }
      const ed = rows.findIndex((x) => isEl(x, "h2") && /^zip editors/i.test(textOf(x).replace(/#$/, "").trim()));
      if (ed > -1) {
        const items = [
          { label: "What is a ZIP", hint: "Purpose and process", href: "#what-is-zip" },
          { label: "Editors", hint: "Who reviews ZIPs", href: "#zip-editors" },
          { label: "Notable ZIPs", hint: "Current proposals", href: "#notable-current-zips" },
          { label: "NU6.3 (Ironwood)", hint: "Network upgrade ZIPs", href: "#nu63-ironwood-zips" },
        ];
        rows.splice(ed, 0, { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.dtool && Array.isArray(tree.children)) {
      // Zcash devtool: lead, README link as a button, numbered quick-start steps, security warning as a callout, jump list.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      // "[What is the zcash-devtool?](readme)" sits above the intro: the intro becomes the lead and the link a button below it.
      const findA = (n: any): any => (n && n.type === "element" && n.tagName === "a" ? n : (n?.children || []).map(findA).find(Boolean));
      let dtoolNote = "";
      const lk = rows.findIndex((x, i) => i > h1 && isEl(x, "p") && /^what is the zcash-devtool\??$/i.test(textOf(x).trim()) && findA(x));
      let nx = lk + 1;
      while (lk > -1 && rows[nx] && rows[nx].type === "text" && !String(rows[nx].value).trim()) nx++;
      if (lk > -1 && isEl(rows[nx], "p")) {
        const a = findA(rows[lk]);
        const intro = rows[nx];
        intro.properties = { ...(intro.properties || {}), dataLead: "true" };
        // The lead keeps the description; the production warning moves into one notice below it.
        const mm = /^([\s\S]*?functionality)[;.]\s+and should not be considered production-ready\.\s*([\s\S]*)$/.exec(textOf(intro).trim());
        if (mm && (intro.children || []).every((c: any) => c.type === "text")) {
          intro.children = [{ type: "text", value: mm[1] + "." }];
          dtoolNote = "This tool should not be considered production-ready. " + mm[2].replace(/DO NOT commit/, "Do not commit");
        }
        rows.splice(lk, nx - lk + 1, intro, el("linkbutton", { href: String(a.properties?.href || "").replace(/\?tab=readme-ov-file$/, ""), label: "Read the zcash-devtool README", emphasis: "strong" }));
      }
      // Heading polish and numbered quick-start steps.
      let n = 0;
      let inQuick = false;
      for (const r of rows) {
        if (isEl(r, "h2")) inQuick = /^quick start/i.test(textOf(r).replace(/#$/, "").trim());
        else if (isEl(r, "h3")) {
          const t = textOf(r).replace(/#$/, "").trim();
          if (/^video tutorial/i.test(t)) r.children = [{ type: "text", value: t.replace(/:$/, "") }];
          else if (/^advanced \(/i.test(t)) {
            r.tagName = "h2";
            r.children = [{ type: "text", value: "Advanced: librustzcash tutorial" }];
          }
          else if (inQuick && !/^advanced/i.test(t)) {
            n += 1;
            r.properties = { ...(r.properties || {}), dataStep: String(n) };
          }
        }
      }
      // "Security Warnings: DO NOT USE THIS IN PRODUCTION" and the lead's warning become one callout below the lead.
      let dtoolNotice: any = null;
      const sw = rows.findIndex((x) => isEl(x, "p") && /^security warnings?:/i.test(textOf(x).trim()));
      if (sw > -1) {
        const kids = (rows[sw].children || []).slice();
        if (isEl(kids[0], "strong")) kids.shift();
        while (kids.length && ((kids[0].type === "text" && !String(kids[0].value).trim()) || isEl(kids[0], "br"))) kids.shift();
        for (const kd of kids) if (kd.type === "text") kd.value = String(kd.value).replace(/^\s*DO NOT USE THIS IN PRODUCTION!*\s*/i, "");
        const body = [el("p", { className: [dtoolNote ? "mt-2" : "mt-0", "mb-0", "mx-0"] }, kids)];
        if (dtoolNote) body.unshift(el("p", { className: ["m-0"] }, [{ type: "text", value: dtoolNote }]));
        dtoolNotice = el("guidecallout", { title: "Not production-ready" }, body);
        rows.splice(sw, 1);
      }
      const video = rows.findIndex((x) => isEl(x, "h3") && /^video tutorial/i.test(textOf(x)));
      if (video > -1) {
        const items = [
          { label: "Install", hint: "Build from source", href: "#install" },
          { label: "Wallet", hint: "Create a testnet wallet", href: "#create-a-testnet-wallet" },
          { label: "PCZTs", hint: "Build transactions in steps", href: "#build-transactions-in-steps-with-pczts" },
          { label: "Ironwood", hint: "Move funds from Orchard", href: "#move-funds-from-orchard-to-ironwood" },
        ];
        const jump = { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] };
        if (!dtoolNotice && dtoolNote) dtoolNotice = el("guidecallout", { title: "Not production-ready" }, [el("p", { className: ["m-0"] }, [{ type: "text", value: dtoolNote }])]);
        rows.splice(video, 0, ...(dtoolNotice ? [dtoolNotice] : []), jump);
      }
      // "view video here" becomes a short introduction with a bullet link.
      const vh = rows.findIndex((x) => isEl(x, "p") && /^view video here$/i.test(textOf(x).trim()) && findA(x));
      if (vh > -1) {
        const a = findA(rows[vh]);
        a.children = [{ type: "text", value: "Watch the librustzcash tutorial (video, hosted on Free2z)" }];
        rows.splice(vh, 1, el("p", {}, [{ type: "text", value: "A video tutorial on the librustzcash Rust crates, the libraries that zcash-devtool builds on." }]), el("ul", {}, [el("li", {}, [a])]));
      }
    }
    if (opts.yfrost && Array.isArray(tree.children)) {
      // Ywallet FROST demo: numbered steps, commands as code blocks, link to the maintained Zkool guide, jump list.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      // A paragraph that is a single shell command ("./script.sh args") becomes a code block.
      for (let i = 0; i < rows.length; i++) {
        const x = rows[i];
        const kids = isEl(x, "p") ? (x.children || []).filter((c: any) => !(c.type === "text" && !String(c.value).trim())) : [];
        if (kids.length === 1 && (kids[0].type === "text" || isEl(kids[0], "code")) && /^\.\/[\w.-]+(\s+\S+)*\s*$/.test(textOf(kids[0]).trim())) {
          rows[i] = el("pre", {}, [el("code", { className: ["language-bash"] }, [{ type: "text", value: textOf(kids[0]).trim() + "\n" }])]);
        }
      }
      let n = 0;
      for (const r of rows) {
        if (isEl(r, "h2")) {
          n += 1;
          r.properties = { ...(r.properties || {}), dataStep: String(n) };
        }
      }
      const bq = rows.findIndex((x) => isEl(x, "blockquote"));
      if (bq > -1) rows.splice(bq + 1, 0, el("linkbutton", { href: "/guides/zkool-multisig", label: "Open the Zkool multisig guide" }));
      const firstH2 = rows.findIndex((x) => isEl(x, "h2"));
      if (firstH2 > -1) {
        const items = [
          { label: "Build", hint: "Compile the FROST binaries", href: "#compile-frost-bins" },
          { label: "Create UA", hint: "Generate the FROST address", href: "#create-frost-ua" },
          { label: "Sign", hint: "Coordinator and participants", href: "#start-coordinator" },
          { label: "Broadcast", hint: "Send the signed transaction", href: "#broadcast-your-transaction-with-ywallet" },
        ];
        rows.splice(firstH2, 0, { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.vnet && Array.isArray(tree.children)) {
      // Visualizing the Zcash network: no Edit badge, lead, numbered steps, tool and repo link cards, jump list, tips as headings.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
        else if (isEl(x, "hr") || isWs(x)) rows.splice(i, 1);
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      // Headings: drop trailing colons, number the three stages, demote "Optional".
      const tidy = (s: string) => s.replace(/#$/, "").replace(/[:!\s]+$/, "").trim();
      let step = 0;
      for (const r of rows) {
        if (!isEl(r, "h2")) continue;
        const t = tidy(textOf(r));
        if (/^install requirements/i.test(t)) r.children = [txt(t)];
        else if (/^optional/i.test(t)) {
          r.tagName = "h3";
          r.properties = { ...(r.properties || {}), dataRule: "true" };
          r.children = [txt("Optional tools")];
        } else {
          step += 1;
          r.properties = { ...(r.properties || {}), dataStep: String(step) };
          r.children = [txt(t)];
        }
      }
      // "Name -> link (why)" and "Name | link" lines become link cards.
      const parseLine = (x: any) => {
        if (!isEl(x, "p")) return null;
        const kids: any[] = x.children || [];
        const ai = kids.findIndex((c) => isEl(c, "a"));
        if (ai < 1) return null;
        const before = kids.slice(0, ai).map((c) => textOf(c)).join("");
        const m = /^(.*?)\s*(->|\|)\s*$/.exec(before.trim());
        if (!m || !m[1]) return null;
        const href = String(kids[ai].properties?.href || "").replace(/\.git$/, "");
        const after = kids.slice(ai + 1).map((c) => textOf(c)).join("").replace(/^[\s(]+|[\s)]+$/g, "").replace(/^for\s+/i, "");
        let host = href;
        try { const u = new URL(href); host = u.host + (u.pathname === "/" ? "" : u.pathname); } catch {}
        const desc = after ? after.charAt(0).toUpperCase() + after.slice(1) : host;
        return { sep: m[2], card: el("communitycard", { name: m[1].trim(), desc, href, icon: m[2] === "|" ? "code" : "globe" }) };
      };
      for (let i = 0; i < rows.length; i++) {
        const first = parseLine(rows[i]);
        if (!first) continue;
        let j = i;
        const cards: any[] = [];
        for (;;) {
          const pl = j < rows.length ? parseLine(rows[j]) : null;
          if (!pl || pl.sep !== first.sep) break;
          cards.push(pl.card);
          j += 1;
        }
        rows.splice(i, j - i, ...(first.sep === "|" ? [el("h3", { dataRule: "true" }, [txt("Repositories")])] : []), el("addressgrid", {}, cards));
        if (first.sep === "|") i += 1;
      }
      // Tips become small headings.
      const tipTitles = ["Tip: stop the crawler automatically", "Tip: save the metrics straight into testdata", "Tip: reseed the crawler with known IPs"];
      let tn = 0;
      for (let i = 0; i < rows.length; i++) {
        if (isEl(rows[i], "p") && /^tips?!?$/i.test(textOf(rows[i]).trim()) && tipTitles[tn]) {
          rows[i] = el("h3", { dataRule: "true" }, [txt(tipTitles[tn])]);
          tn += 1;
        }
      }
      // Command output and commands written without a language still render as code blocks.
      const fixCode = (list: any[]) => {
        for (const x of list) {
          if (!x || x.type !== "element") continue;
          if (x.tagName === "pre") {
            for (const c of x.children || []) {
              if (isEl(c, "code")) {
                const cls = Array.isArray(c.properties?.className) ? c.properties.className : [];
                if (!cls.some((k: any) => String(k).startsWith("language-"))) c.properties = { ...(c.properties || {}), className: [...cls, "language-text"] };
              }
            }
          } else if (Array.isArray(x.children)) fixCode(x.children);
        }
      };
      fixCode(rows);
      const firstH2 = rows.findIndex((x) => isEl(x, "h2"));
      if (firstH2 > -1) {
        const items = [
          { label: "Requirements", hint: "Rust and optional tools", href: "#install-requirements" },
          { label: "Crawler", hint: "Collect network data", href: "#zcash-network-crawler" },
          { label: "Crunchy", hint: "Aggregate the output", href: "#crunchy" },
          { label: "P2P-Viz", hint: "Map the nodes", href: "#p2p-viz" },
        ];
        rows.splice(firstH2, 0, { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.vaddr && Array.isArray(tree.children)) {
      // Visualizing Zcash addresses: no Edit badge, lead, jump list, Ironwood section, sources as link cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const txt = (value: string) => ({ type: "text", value });
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      // The upstream list of UA lengths is replaced by the specimen cards, so the sentence that introduced it must not end in a colon.
      const fixLengths = (n: any) => {
        if (n && n.type === "text" && typeof n.value === "string" && n.value.includes("lengths of each type of UA:")) n.value = n.value.replace("lengths of each type of UA:", "lengths of each type of UA, shown on each card above.");
        (n && Array.isArray(n.children) ? n.children : []).forEach(fixLengths);
      };
      rows.forEach(fixLengths);
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      // Example addresses: label + screenshot pairs and the "N characters" lists become specimen cards with generated QR codes.
      {
        const isWs = (x: any) => x && x.type === "text" && !String(x.value).trim();
        const nextIdx = (i: number) => { let k = i + 1; while (rows[k] && isWs(rows[k])) k++; return k; };
        const onlyImg = (x: any) => isEl(x, "p") && (x.children || []).filter((c: any) => !isWs(c)).every((c: any) => c.tagName === "img" || (c.type === "mdxJsxFlowElement" && String(c.name) === "img"));
        const pairs: { l: number; im: number; label: string }[] = [];
        rows.forEach((x, i) => {
          if (!isEl(x, "ul")) return;
          const lis = (x.children || []).filter((c: any) => isEl(c, "li"));
          const t = textOf(x).trim();
          if (lis.length !== 1 || !t || t.length > 40) return;
          const k = nextIdx(i);
          if (onlyImg(rows[k]) && (rows[k].children || []).some((c: any) => c.tagName === "img")) pairs.push({ l: i, im: k, label: t });
        });
        const groups: typeof pairs[] = [];
        for (const pr of pairs) {
          const last = groups[groups.length - 1];
          if (last && nextIdx(last[last.length - 1].im) === pr.l) last.push(pr); else groups.push([pr]);
        }
        const lists = rows.map((x, i) => ({ x, i })).filter(({ x }) => isEl(x, "ul"));
        const parse = (re: RegExp) => lists.map(({ x, i }) => {
          const lis = (x.children || []).filter((c: any) => isEl(c, "li"));
          const m = lis.map((li: any) => re.exec(textOf(li).trim().replace(/\s+/g, " ")));
          return lis.length > 0 && m.every(Boolean) ? { i, m: m as RegExpExecArray[] } : null;
        }).find(Boolean) as { i: number; m: RegExpExecArray[] } | undefined;
        const typeAddr = parse(/^(\S+) is (\d+) characters/i);
        const uaAddr = parse(/^(\S+) (u1\S+) (\d+) characters/i);
        const ops: { start: number; end: number; rep: any[] }[] = [];
        const mk = (label: string, address: string, length: string) => el("addressspecimen", { label, address, length }, []);
        if (groups[0] && typeAddr && groups[0].length === typeAddr.m.length) {
          const g = groups[0];
          ops.push({ start: g[0].l, end: g[g.length - 1].im, rep: [el("addressgrid", {}, g.map((pr, k) => mk(pr.label, typeAddr.m[k][1], typeAddr.m[k][2])))] });
          ops.push({ start: typeAddr.i, end: typeAddr.i, rep: [] });
        }
        if (groups[1] && uaAddr && groups[1].length === uaAddr.m.length) {
          const g = groups[1];
          ops.push({ start: g[0].l, end: g[g.length - 1].im, rep: [el("addressgrid", {}, g.map((pr, k) => mk(pr.label.replace(/\s*\+\s*/g, " + "), uaAddr.m[k][2], uaAddr.m[k][3])))] });
          ops.push({ start: uaAddr.i, end: uaAddr.i, rep: [] });
        }
        ops.sort((p, q) => q.start - p.start).forEach((o) => rows.splice(o.start, o.end - o.start + 1, ...o.rep));
      }
      // Sources: bare URL paragraphs -> link cards.
      const srcH = rows.findIndex((x) => isEl(x, "h2") && /^sources$/i.test(textOf(x).replace(/#$/, "").trim()));
      if (srcH > -1) {
        const cards: any[] = [];
        let j = srcH + 1;
        for (; j < rows.length; j++) {
          const x = rows[j];
          if (x.type === "text" && !String(x.value).trim()) continue;
          const stack = [x]; let a: any = null;
          while (stack.length && !a) { const n = stack.shift(); if (isEl(n, "a")) a = n; else if (n && n.children) stack.push(...n.children); }
          if (!isEl(x, "p") || !a) break;
          const href = String(a.properties?.href || "");
          let host = href; let path = "";
          try { const u = new URL(href); host = u.hostname.replace(/^www\./, ""); path = u.pathname.replace(/\/$/, ""); } catch {}
          cards.push(el("communitycard", { name: host, desc: path, href, icon: "globe" }));
        }
        if (cards.length) rows.splice(srcH + 1, j - srcH - 1, el("addressgrid", {}, cards));
      }
      // Ironwood sections, placed before Sources.
      const P = (kids: any[], cls: string[] = ["my-5"]) => el("p", { className: cls }, kids);
      const B = (t: string) => el("strong", {}, [txt(t)]);
      const UL = (items: any[][]) => el("ul", { className: ["my-0", "list-disc", "space-y-1.5", "pl-5", "marker:text-slate-400", "dark:marker:text-slate-500"] }, items.map((k) => el("li", {}, k)));
      const badge = (label: string, tone: "legacy" | "active") => el("p", { className: ["mb-3", "mt-0"] }, [
        el("span", {
          className: tone === "active"
            ? ["inline-flex", "items-center", "gap-1.5", "rounded-md", "border", "border-emerald-500/30", "bg-emerald-500/10", "px-2", "py-0.5", "text-xs", "font-medium", "text-emerald-700", "dark:text-emerald-300"]
            : ["inline-flex", "items-center", "gap-1.5", "rounded-md", "border", "border-slate-400/30", "bg-slate-500/10", "px-2", "py-0.5", "text-xs", "font-medium", "text-slate-600", "dark:text-slate-300"],
        }, [txt("Status: " + label)]),
      ]);
      const note = ["text-sm", "text-slate-500", "dark:text-slate-400", "my-4"];
      const ironwood = [
        el("h2", {}, [txt("Ironwood and Zcash Addresses")]),
        P([txt("Ironwood is the shielded pool activated by Network Upgrade 6.3 (NU6.3) on 28 July 2026, at block 3,428,143. It reuses the Orchard protocol and the same receiver structure, so the upgrade changed where shielded payments arrive without introducing a new address format. Ironwood is a pool, not a fourth type of address.")]),
        el("addressgrid", {}, [
          el("communitygroup", { title: "Orchard \u2014 Legacy Shielded Pool", icon: "coins", wide: "false" }, [
            badge("Restricted", "legacy"),
            UL([
              [txt("Introduced with NU5 in May 2022.")],
              [txt("A soundness vulnerability in its proof circuit was disclosed in 2026 (see below).")],
              [txt("Since NU6.3, new value can no longer enter the pool.")],
              [txt("Existing funds can still be spent out of the pool; wallets are expected to move them into Ironwood.")],
              [txt("Moving them needs wallet software that supports migration.")],
            ]),
          ]),
          el("communitygroup", { title: "Ironwood \u2014 Current Shielded Pool", icon: "shield", wide: "false" }, [
            badge("Active", "active"),
            UL([
              [txt("Activated with NU6.3 on 28 July 2026.")],
              [txt("Now receives new shielded payments sent to existing Orchard receivers.")],
              [txt("Existing unified addresses remain usable. No new address is needed.")],
              [txt("Built on the Orchard protocol, with formal verification and additional independent audits.")],
              [txt("Keep your wallet software up to date.")],
            ]),
          ]),
        ]),
        P([B("Migration depends on your wallet."), txt(" Activation did not move any coins, and the sources reviewed give no migration deadline. Some wallets migrate automatically, some ask you to start a manual migration, and some have not added Ironwood support. The amount crossing from Orchard to Ironwood is public on the blockchain, while senders and recipients stay private.")]),
        el("h2", {}, [txt("Why was Ironwood introduced?")]),
        P([txt("In 2026, a critical soundness vulnerability was found in the original Orchard shielded pool and reported responsibly. It concerned the integrity of the money supply, not the confidentiality of shielded transaction data. The flaw was fixed in June 2026, and Ironwood was introduced as part of the network\u2019s response. Here is what is, and is not, established:")]),
        el("addressgrid", {}, [
          el("communitygroup", { title: "The flaw", icon: "cpu", wide: "false" }, [P([txt("A missing constraint in the Orchard proof circuit could, under certain conditions, have let an attacker create invalid shielded value without the proof system detecting it. It did not affect the privacy of funds in any pool.")], ["m-0"])]),
          el("communitygroup", { title: "Exploitation", icon: "shield", wide: "false" }, [P([txt("Public technical reports state that no exploitation has been found or confirmed. A vulnerability that could permit counterfeiting is not evidence that counterfeiting occurred.")], ["m-0"])]),
          el("communitygroup", { title: "Limits of verification", icon: "scale", wide: "false" }, [P([txt("Shielded transactions hide amounts and notes by design, so a past exploit of this kind may leave no definitive on-chain evidence. That is why the risk cannot be conclusively ruled out from the chain alone.")], ["m-0"])]),
          el("communitygroup", { title: "What NU6.3 adds", icon: "coins", wide: "false" }, [P([txt("A new pool built on the corrected Orchard protocol, and a turnstile that stops the old pool from paying out more ZEC than verifiably entered it. This keeps total supply auditable whether or not everyone migrates.")], ["m-0"])]),
        ]),
        P([txt("Based on ZIPs 229, 257, 258, 316 and 326, the Zcash Foundation\u2019s NU6.2 announcement, Zodl\u2019s Ironwood documentation and BlockSec\u2019s technical analysis of the Orchard bug.")], note),
      ];
      const srcAt = rows.findIndex((x) => isEl(x, "h2") && /^sources$/i.test(textOf(x).replace(/#$/, "").trim()));
      rows.splice(srcAt > -1 ? srcAt : rows.length, 0, ...ironwood);
      // Note under the unified address receiver cards.
      const grids = rows.map((x, i) => (isEl(x, "addressgrid") ? i : -1)).filter((i) => i >= 0);
      if (grids.length >= 2) {
        rows.splice(grids[1] + 1, 0,
          P([B("Receivers and pools are different things."), txt(" A unified address holds one receiver per protocol it supports. The Orchard pool is the legacy shielded pool described below; an Orchard receiver is the part of an address that Orchard-compatible wallets use to receive shielded funds. ZIP 316 defines no separate Ironwood receiver type: Ironwood is an Orchard-protocol pool, and ZIP 229 states that address structures and encodings do not change. Existing unified addresses, including the four combinations above, keep working, and an Orchard receiver can receive funds in the Ironwood pool. New payments to it are expected to arrive there, so an Orchard receiver does not by itself mean a payment lands in the original, now restricted, Orchard pool.")], ["my-5", "text-[0.95rem]"]));
      }
      // Extra source cards (name = site, desc = page).
      const srcGrid = rows.findIndex((x) => isEl(x, "addressgrid") && (x.children || []).every((c: any) => isEl(c, "communitycard")));
      if (srcGrid > -1) {
        const extra = [
          { name: "zips.z.cash", desc: "ZIP 258: Deployment of the NU6.3 network upgrade", href: "https://zips.z.cash/zip-0258" },
          { name: "zips.z.cash", desc: "ZIP 257: NU6.2 and the Orchard mitigation", href: "https://zips.z.cash/zip-0257" },
          { name: "zips.z.cash", desc: "ZIP 316: Unified Addresses and typecodes", href: "https://zips.z.cash/zip-0316" },
          { name: "zips.z.cash", desc: "ZIP 326: NU6.3 consequences for wallets", href: "https://zips.z.cash/zip-0326" },
          { name: "support.zodl.com", desc: "What is the Ironwood shielded pool?", href: "https://support.zodl.com/article/56-what-is-the-ironwood-shielded-pool" },
          { name: "zodl.com", desc: "Ironwood is live on Zcash", href: "https://zodl.com/ironwood-is-live-on-zcash/" },
          { name: "zodl.com", desc: "Ironwood: a new shielded pool for Zcash", href: "https://zodl.com/ironwood-a-new-shielded-pool-for-zcash/" },
          { name: "blocksec.com", desc: "Zcash Orchard soundness bug analysis", href: "https://blocksec.com/blog/web3-security-zcash-orchard-soundness-bug-analysis" },
          { name: "docs.cakewallet.com", desc: "Ironwood migration", href: "https://docs.cakewallet.com/cryptos/zcash/ironwood-migration" },
        ];
        rows[srcGrid].children.push(...extra.map((e) => el("communitycard", { ...e, icon: "globe" })));
      }
      const first = rows.findIndex((x) => isEl(x, "h2"));
      if (first > -1) {
        const items = [
          { label: "Address Types", hint: "Transparent, Sapling, unified", href: "#types-of-zcash-addresses" },
          { label: "UA Receivers", hint: "Combinations of receivers", href: "#unified-address-receivers" },
          { label: "Ironwood", hint: "What changes for addresses", href: "#ironwood-and-zcash-addresses" },
          { label: "Why Ironwood?", hint: "The Orchard vulnerability", href: "#why-was-ironwood-introduced" },
          { label: "Sources", hint: "Further reading", href: "#sources" },
        ];
        rows.splice(first, 0, { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.vkx && Array.isArray(tree.children)) {
      // Viewing key export guide: no Edit badge, lead paragraph, jump list.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      // Short lead-in paragraphs inside Option 2 act as subheadings.
      for (let i = 0; i < rows.length; i++) {
        const x = rows[i];
        if (isEl(x, "p") && /^(later runs|a few things to know about the output):?$/i.test(textOf(x).trim())) {
          rows[i] = { type: "element", tagName: "h3", properties: { dataRule: "true" }, children: [{ type: "text", value: textOf(x).trim().replace(/:$/, "") }] };
        }
      }
      const first = rows.findIndex((x) => isEl(x, "h2"));
      if (first > -1) {
        const items = [
          { label: "Before you start", hint: "UFVK and birth height", href: "#before-you-start" },
          { label: "Keep it private", hint: "Risks and safe setup", href: "#keep-it-private" },
          { label: "Zkool GraphQL", hint: "Option 1, step by step", href: "#option-1-zkool-graphql" },
          { label: "zingo-cli", hint: "Option 2, command line", href: "#option-2-zingo-cli" },
        ];
        rows.splice(first, 0, { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.vrel && Array.isArray(tree.children)) {
      // Verifying releases: no Edit badge, numbered steps, jump list, "verified against" line as a note.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const walkSteps = (list: any[]) => {
        for (const x of list) {
          if (!x || x.type !== "element") continue;
          if (x.tagName === "h3") {
            const m = /^Step\s+(\d+[a-z]?)\s*[\u2014\u2013-]\s*(.+)$/i.exec(textOf(x).trim());
            if (m) {
              x.properties = { ...(x.properties || {}), dataStep: m[1] };
              x.children = [{ type: "text", value: m[2] }];
            }
          }
          if (Array.isArray(x.children)) walkSteps(x.children);
        }
      };
      walkSteps(rows);
      // Output blocks written without a language still render as code blocks.
      const fixCode = (list: any[]) => {
        for (const x of list) {
          if (!x || x.type !== "element") continue;
          if (x.tagName === "pre") {
            for (const c of x.children || []) {
              if (isEl(c, "code")) {
                const cls = Array.isArray(c.properties?.className) ? c.properties.className : [];
                if (!cls.some((k: any) => String(k).startsWith("language-"))) c.properties = { ...(c.properties || {}), className: [...cls, "language-text"] };
              }
            }
          } else if (Array.isArray(x.children)) fixCode(x.children);
        }
      };
      fixCode(rows);
      const why = rows.findIndex((x) => isEl(x, "h2") && /^why this matters/i.test(textOf(x).replace(/#$/, "").trim()));
      if (why > -1) {
        const items = [
          { label: "Threat model", hint: "What verification catches", href: "#threat-model-what-verification-does-and-does-not-catch" },
          { label: "Zebra", hint: "Checksums and Sigstore", href: "#part-1-zebra-checksums-and-sigstore" },
          { label: "Zallet", hint: "GPG signatures and key rotation", href: "#part-2-zallet-gpg-signatures" },
          { label: "If it fails", hint: "What to do", href: "#part-3-a-verification-that-fails" },
        ];
        rows.splice(why, 0, { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.defi && Array.isArray(tree.children)) {
      // Zcash in DeFi: no Edit badge, jump list before the first protocol section.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      // "Learn More: <link>" paragraphs become outlined link buttons.
      const linksIn = (n: any, acc: any[] = []) => {
        if (n && n.type === "element" && n.tagName === "a" && n.properties?.href) acc.push(n);
        (n?.children || []).forEach((c: any) => linksIn(c, acc));
        return acc;
      };
      const learnMore = (list: any[]) => {
        for (let i = 0; i < list.length; i++) {
          const x = list[i];
          if (!x || x.type !== "element") continue;
          if (x.tagName === "p" && /^\s*learn more/i.test(textOf(x))) {
            const links = linksIn(x);
            if (links.length) {
              const linkCls = ["font-semibold", "text-brand", "no-underline", "underline-offset-4", "hover:underline", "dark:text-brand-soft"];
              const mk = (l: any, label: string) => ({
                type: "element",
                tagName: "a",
                properties: { href: String(l.properties.href), target: "_blank", rel: "noreferrer", className: linkCls },
                children: [{ type: "text", value: label + " \u2197" }],
              });
              const kids: any[] = [];
              if (links.length === 1) kids.push(mk(links[0], "Learn more"));
              else {
                kids.push({ type: "text", value: "Learn more: " });
                links.forEach((l, k) => {
                  if (k) kids.push({ type: "text", value: "  \u00b7  " });
                  kids.push(mk(l, textOf(l).replace(/\.$/, "").replace(/\s+Learn$/i, "").trim()));
                });
              }
              list.splice(i, 1, { type: "element", tagName: "p", properties: { className: ["my-4", "text-sm", "text-slate-500", "dark:text-slate-400"] }, children: kids });
              continue;
            }
          }
          if (Array.isArray(x.children)) learnMore(x.children);
        }
      };
      learnMore(rows);
      // Resources: consecutive link paragraphs under the "Resources:" heading -> bullet list.
      const resI = rows.findIndex((x) => isEl(x, "h3") && /^resources/i.test(textOf(x).trim()));
      if (resI > -1) {
        const items: any[] = [];
        let j = resI + 1;
        while (j < rows.length) {
          const x = rows[j];
          if (x.type === "text" && !String(x.value).trim()) { j++; continue; }
          if (isEl(x, "p") && linksIn(x).length) {
            items.push({ type: "element", tagName: "li", properties: {}, children: (x.children || []).filter((c: any) => !(c.type === "text" && !String(c.value).trim())) });
            j++;
            continue;
          }
          break;
        }
        if (items.length) rows.splice(resI + 1, j - resI - 1, { type: "element", tagName: "ul", properties: {}, children: items });
      }
      // Innovation section: bold-only paragraphs act as subheadings.
      const innov = rows.findIndex((x) => isEl(x, "h2") && /^innovation/i.test(textOf(x).replace(/#$/, "").trim()));
      if (innov > -1) {
        for (let i = innov + 1; i < rows.length; i++) {
          const x = rows[i];
          if (!isEl(x, "p")) continue;
          const kids = (x.children || []).filter((c: any) => !(c.type === "text" && !String(c.value).trim()));
          if (kids.length === 1 && isEl(kids[0], "strong") && textOf(x).trim().length < 40) {
            rows[i] = { type: "element", tagName: "h3", properties: { dataRule: "true" }, children: kids[0].children };
          }
        }
      }
      // The rule-style h3 already draws a divider; drop a separator right before it.
      for (let i = rows.length - 2; i >= 0; i--) {
        let j = i + 1;
        while (rows[j] && rows[j].type === "text" && !String(rows[j].value).trim()) j++;
        if (isEl(rows[i], "hr") && isEl(rows[j], "h3")) rows.splice(i, 1);
      }
      const first = rows.findIndex((x) => isEl(x, "h2"));
      if (first > -1) {
        const items = [
          { label: "NEAR Intents", hint: "Fee-free cross-chain swaps", href: "#near-intents" },
          { label: "Solana", hint: "Kamino, Meteora, Orca, Raydium", href: "#kamino" },
          { label: "THORChain", hint: "Native ZEC liquidity", href: "#thorchain-thorswap" },
          { label: "Base (cbZEC)", hint: "Aerodrome, Uniswap, Morpho", href: "#using-cbzec-on-defi-base" },
        ];
        rows.splice(first, 0, { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.nymvpn && Array.isArray(tree.children)) {
      // Nym VPN overview: lead, action buttons, use-case cards, install-guide cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const el = (tagName: string, properties: any = {}, children: any[] = []) => ({ type: "element", tagName, properties, children });
      const linksOf = (n: any, acc: any[] = []) => {
        if (n && n.type === "element" && n.tagName === "a" && n.properties?.href) acc.push(n);
        (n?.children || []).forEach((c: any) => linksOf(c, acc));
        return acc;
      };
      const h1 = rows.findIndex((x) => isEl(x, "h1"));
      const lead = rows.findIndex((x, i) => i > h1 && isEl(x, "p"));
      if (lead > -1) {
        rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
        let btnRow = lead + 1;
        while (rows[btnRow] && rows[btnRow].type === "text" && !String(rows[btnRow].value).trim()) btnRow++;
        if (isEl(rows[btnRow], "p")) {
          const links = linksOf(rows[btnRow]);
          if (links.length) rows.splice(btnRow, 1, ...links.map((a) => el("linkbutton", { href: String(a.properties.href), label: textOf(a).trim() })));
        }
      }
      // Use cases: consecutive h3 + p pairs under "Tutorial" -> card grid.
      const icons: Record<string, string> = { geo: "globe", wifi: "shield", advanced: "shield", anonymous: "users", bandwidth: "cpu", surveillance: "alert", banking: "coins", pricing: "coins", crypto: "coins" };
      const iconFor = (t: string) => { const k = Object.keys(icons).find((k) => t.toLowerCase().includes(k)); return k ? icons[k] : "shield"; };
      const firstH3 = rows.findIndex((x) => isEl(x, "h3"));
      const instH2 = rows.findIndex((x) => isEl(x, "h2") && /installation guides/i.test(textOf(x)));
      if (firstH3 > -1 && instH2 > firstH3) {
        const cards: any[] = [];
        for (let i = firstH3; i < instH2; i++) {
          if (!isEl(rows[i], "h3")) continue;
          const body: any[] = [];
          let j = i + 1;
          while (j < instH2 && !isEl(rows[j], "h3")) { if (isEl(rows[j])) body.push(rows[j]); j++; }
          cards.push(el("communitygroup", { title: textOf(rows[i]).replace(/#$/, "").trim(), icon: iconFor(textOf(rows[i]) + " " + (body[0] ? textOf(body[0]) : "")), wide: "false" }, body));
        }
        const intro = el("p", { className: ["mt-8", "mb-4", "text-xs", "font-semibold", "uppercase", "tracking-[0.14em]", "text-slate-500", "dark:text-slate-400"] }, [{ type: "text", value: "What you can use it for" }]);
        rows.splice(firstH3, instH2 - firstH3, intro, el("communitygrid", {}, cards));
      }
      // Installation guides: p>a (video) pairs -> link cards, keep trailing paragraph.
      const inst = rows.findIndex((x) => isEl(x, "h2") && /installation guides/i.test(textOf(x)));
      if (inst > -1) {
        const cards: any[] = [];
        let j = inst + 1;
        while (j < rows.length && (isEl(rows[j], "p") || (rows[j].type === "text" && !String(rows[j].value).trim()))) {
          if (rows[j].type === "text") { j++; continue; }
          const a = linksOf(rows[j]);
          const label = textOf(rows[j]).trim();
          if (a.length === 1 && /vimeo\.com/.test(String(a[0].properties.href)) && label.length < 20) {
            cards.push(el("communitycard", { name: label, desc: "Video walkthrough", href: String(a[0].properties.href), icon: "globe" }));
            j++;
          } else break;
        }
        if (cards.length) rows.splice(inst + 1, j - inst - 1, el("communitygrid", {}, cards));
      }
    }
    if (opts.nym && Array.isArray(tree.children)) {
      // Nym mixnet guide: lead, jump list, source lists as quiet panels, settings path as a code line.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      for (let i = rows.length - 1; i >= 0; i--) {
        const x = rows[i];
        if (x && (x.type === "mdxJsxFlowElement" || x.type === "element") && JSON.stringify(x).toLowerCase().includes("shields.io/badge/edit")) rows.splice(i, 1);
      }
      const bq = rows.findIndex((x) => isEl(x, "blockquote"));
      const lead = rows.findIndex((x, i) => i > bq && isEl(x, "p"));
      if (lead > -1) rows[lead].properties = { ...(rows[lead].properties || {}), dataLead: "true" };
      const fixList = (list: any[]) => {
        const out: any[] = [];
        for (let i = 0; i < list.length; i++) {
          const x = list[i];
          if (x && Array.isArray(x.children) && x.type === "element" && x.tagName !== "ul" && x.tagName !== "p") fixList(x.children);
          let j = i + 1;
          while (list[j] && list[j].type === "text" && !String(list[j].value).trim()) j++;
          if (isEl(x, "p") && /^sources:$/i.test(textOf(x).trim()) && isEl(list[j], "ul")) {
            out.push({
              type: "element",
              tagName: "div",
              properties: { className: ["my-5", "rounded-xl", "border", "border-slate-200", "bg-slate-50/60", "p-4", "text-sm", "dark:border-white/10", "dark:bg-white/[0.03]", "[&_ul]:mb-0", "[&_ul]:space-y-1", "[&_li]:break-all"] },
              children: [
                { type: "element", tagName: "p", properties: { className: ["mb-2", "mt-0", "text-xs", "font-semibold", "uppercase", "tracking-[0.14em]", "text-slate-500", "dark:text-slate-400"] }, children: [{ type: "text", value: "Sources" }] },
                list[j],
              ],
            });
            i = j;
            continue;
          }
          if (isEl(x, "p") && /^zodl tor settings:?$/i.test(textOf(x).trim()) && isEl(list[j], "p")) {
            out.push(x);
            out.push({ type: "element", tagName: "pre", properties: {}, children: [{ type: "element", tagName: "code", properties: { className: ["language-text"] }, children: [{ type: "text", value: textOf(list[j]).trim() }] }] });
            i = j;
            continue;
          }
          out.push(x);
        }
        list.splice(0, list.length, ...out);
      };
      fixList(rows);
      // Final "Sources" section: "Label: URL" bullets -> link cards.
      const srcH = rows.findIndex((x) => isEl(x, "h2") && /^sources$/i.test(textOf(x).replace(/#$/, "").trim()));
      let srcUl = srcH + 1;
      while (srcH > -1 && rows[srcUl] && rows[srcUl].type === "text" && !String(rows[srcUl].value).trim()) srcUl++;
      if (srcH > -1 && isEl(rows[srcUl], "ul")) {
        const cards: any[] = [];
        for (const li of rows[srcUl].children || []) {
          if (!isEl(li, "li")) continue;
          const stack = [li]; let a: any = null;
          while (stack.length && !a) { const n = stack.shift(); if (isEl(n, "a")) a = n; else stack.push(...(n.children || [])); }
          if (!a) continue;
          const href = String(a.properties?.href || "");
          const label = textOf(li).trim().replace(href, "").replace(/:\s*$/, "").trim();
          let host = ""; try { host = new URL(href).hostname.replace(/^www\./, ""); } catch {}
          const dm = label.match(/^(.*?),?\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})$/);
          cards.push({ type: "element", tagName: "communitycard", properties: { name: dm ? dm[1].trim() : label || host, desc: dm ? `${host} \u00b7 ${dm[2]}` : host, href, icon: "globe" }, children: [] });
        }
        if (cards.length) rows.splice(srcUl, 1, { type: "element", tagName: "communitygrid", properties: {}, children: cards });
      }
      const first = rows.findIndex((x, i) => i > bq && isEl(x, "h2"));
      if (first > -1) {
        const items = [
          { label: "What Nym adds", hint: "And what it does not", href: "#what-nym-adds-and-what-it-does-not" },
          { label: "Native support", hint: "Zingo, Zkool, Nozy, Zodl", href: "#native-nym-support-use-this-first-when-available" },
          { label: "System-level NymVPN", hint: "Step-by-step fallback", href: "#fallback-system-level-nymvpn" },
          { label: "Trade-offs", hint: "Speed, mobile, checklist", href: "#performance-and-timeout-trade-offs" },
        ];
        rows.splice(first, 0, { type: "element", tagName: "jumpnav", properties: { title: "Jump to", items: JSON.stringify(items) }, children: [] });
      }
    }
    if (opts.cz && Array.isArray(tree.children)) {
      // Cypherpunk Zero: new hero art, governance/resources as link cards, supply split as stat cards.
      const rows: any[] = tree.children;
      const isEl = (x: any, tag?: string) => x && x.type === "element" && (!tag || x.tagName === tag);
      const nameOf = (x: any): string => x.tagName || x.name || "";
      const findHref = (x: any): string => {
        if (!x || typeof x !== "object") return "";
        if (nameOf(x) === "a" && x.properties?.href) return String(x.properties.href);
        for (const c of x.children || []) {
          const r = findHref(c);
          if (r) return r;
        }
        return "";
      };
      const hasImg = (x: any): boolean => nameOf(x) === "img" || (x.children || []).some(hasImg);
      const h2At = (re: RegExp) => rows.findIndex((x) => isEl(x, "h2") && re.test(textOf(x).replace(/#$/, "").trim()));
      const takeParas = (from: number) => {
        let end = from + 1;
        while (end < rows.length && !/^h[1-6]$/.test(rows[end].tagName || "") && !isEl(rows[end], "hr")) end++;
        return end;
      };

      // Hero art.
      const img = rows.findIndex((x) => isEl(x, "p") && hasImg(x) && !textOf(x).trim());
      if (img > -1) {
        rows[img] = {
          type: "element",
          tagName: "p",
          properties: { className: ["my-0"] },
          children: [{
            type: "element",
            tagName: "img",
            properties: { src: "/cypherpunk-zero-hero.webp", alt: "Cypherpunk Zero characters", className: ["mx-auto", "h-auto", "w-full", "max-w-4xl"] },
            children: [],
          }],
        };
      }
      const lead = rows.findIndex((x) => isEl(x, "p") && textOf(x).trim().length > 120);
      if (lead > -1) {
        const lp = rows[lead];
        // Loosen the dense intro: break after the 2nd and 4th sentence (inline links are kept).
        const breaks = new Set([2, 4]);
        const paras: any[][] = [[]];
        let sentence = 1;
        for (const c of lp.children || []) {
          if (c.type === "text" && typeof c.value === "string") {
            const parts = c.value.split(/(?<=\.)\s+(?=[A-Z])/);
            parts.forEach((part: string, k: number) => {
              if (k > 0) {
                if (breaks.has(sentence)) paras.push([]);
                sentence++;
                paras[paras.length - 1].push({ type: "text", value: breaks.has(sentence - 1) ? part : " " + part });
              } else {
                paras[paras.length - 1].push({ type: "text", value: part });
              }
            });
          } else {
            paras[paras.length - 1].push(c);
          }
        }
        rows.splice(lead, 1, ...paras.map((children) => ({ type: "element", tagName: "p", properties: { dataLead: "true", className: ["mb-5"] }, children })));
      }

      // Governance and Resources: one card per link.
      const cardsFrom = (idx: number, desc: (name: string, full: string) => string) => {
        if (idx < 0) return;
        const end = takeParas(idx);
        const cards: any[] = [];
        for (const r of rows.slice(idx + 1, end)) {
          if (!isEl(r, "p")) continue;
          const href = findHref(r);
          const full = textOf(r).trim();
          if (!href || !full) continue;
          const name = full.split(/\s[\u2014\u2013-]\s/)[0].trim();
          cards.push({ type: "element", tagName: "communitycard", properties: { name, desc: desc(name, full), href }, children: [] });
        }
        if (cards.length) rows.splice(idx + 1, end - idx - 1, { type: "element", tagName: "communitygrid", properties: {}, children: cards });
      };
      cardsFrom(h2At(/^governance$/i), (name, full) =>
        /^snapshot/i.test(name) ? full.replace(/^snapshot\s[\u2014\u2013-]\s/i, "").replace(/;\s*this is the surviving Snapshot space\.?$/i, ". Surviving Snapshot voting space.") : "",
      );
      cardsFrom(h2At(/^resources$/i), () => "");

      // Supply split: three stat cards.
      const al = h2At(/^what are the token allocations/i);
      if (al > -1) {
        const end = takeParas(al);
        const full = rows.slice(al + 1, end).map((x: any) => textOf(x).trim()).filter(Boolean).join(" ");
        const m = full.match(/^(Total supply:[^.]*?Mainnet)\s+(4%[\s\S]*?)\s+(72%[\s\S]*?)\s+(24%[\s\S]*)$/);
        if (m) {
          const mk = (value: string, label: string, text: string) => ({ type: "element", tagName: "statcard", properties: { value, label, text }, children: [] });
          rows.splice(al + 1, end - al - 1,
            { type: "element", tagName: "p", properties: {}, children: [{ type: "text", value: m[1] + "." }] },
            { type: "element", tagName: "statgrid", properties: {}, children: [
              mk("4%", "Early supporters", m[2].replace(/^4% of supply /, "Of supply ")),
              mk("72%", "Public release", m[3].replace(/^72% of supply /, "Of supply ")),
              mk("24%", "Cypherpunk Reserve", m[4].replace(/^24% of supply /, "Of supply ")),
            ] },
          );
        }
      }

      // ECC is shown with its new name.
      const zodl = (x: any) => {
        if (x.type === "text" && typeof x.value === "string") x.value = x.value.replace(/\bECC\b(?! \(ZODL\))/g, "ECC (ZODL)");
        if (x.properties && typeof x.properties.text === "string") x.properties.text = x.properties.text.replace(/\bECC\b(?! \(ZODL\))/g, "ECC (ZODL)");
        (x.children || []).forEach(zodl);
      };
      rows.forEach(zodl);

      // Stray H1 ("v2 Whitelist") becomes a section heading; its note becomes a callout.
      const v2 = rows.findIndex((x) => isEl(x, "h1") && /whitelist/i.test(textOf(x)));
      if (v2 > -1) {
        rows[v2] = { ...rows[v2], tagName: "h2" };
        const nx = rows[v2 + 1];
        if (isEl(nx, "p") && textOf(nx).trim()) {
          rows[v2 + 1] = { type: "element", tagName: "guidecallout", properties: { title: "Heads up" }, children: [nx] };
        }
      }
    }
    const walk = (node: any) => {
      const kids = node.children;
      if (!Array.isArray(kids)) return;
      for (let i = 0; i < kids.length; i++) {
        const n = kids[i];
        // Step guides (MetaMask Snap): "1. Title" headings become numbered steps; screenshots get a frame.
        if (opts.snap && n.type === "element") {
          if (n.tagName === "h2") {
            const mm = /^(?:Step\s+)?(\d+)[.:]\s+(.+)$/i.exec(textOf(n).trim());
            if (mm) {
              n.properties = { ...(n.properties || {}), dataStep: mm[1] };
              n.children = [{ type: "text", value: mm[2] }];
            } else {
              const stripColon = (x: any): boolean => {
                const ch = x.children || [];
                for (let q = ch.length - 1; q >= 0; q--) {
                  if (ch[q].type === "text") {
                    if (!ch[q].value.trim()) continue;
                    ch[q].value = ch[q].value.replace(/:\s*$/, "");
                    return true;
                  }
                  if (ch[q].children && stripColon(ch[q])) return true;
                }
                return false;
              };
              stripColon(n);
            }
          } else if (n.tagName === "h3") {
            const mm = opts.sol ? null : /^(\d+)\.\s+(.+)$/.exec(textOf(n).trim());
            if (mm) {
              n.properties = { ...(n.properties || {}), dataStep: mm[1] };
              n.children = [{ type: "text", value: mm[2] }];
            } else {
              n.properties = { ...(n.properties || {}), dataRule: "true" };
            }
          } else if (n.tagName === "img") {
            n.properties = { ...(n.properties || {}), dataFrame: opts.compact ? "compact" : "true" };
          }
        }
        // TEX page: subheadings, lead paragraph, flow diagram and a wallets button.
        if (opts.tex && n.type === "element") {
          const t = textOf(n).trim();
          if (
            ["p", "h4", "h5", "h6", "h3"].includes(n.tagName) &&
            /^(when do i need a tex address|which wallets support tex addresses\??|how a tex address is built|paying a tex address from a shielded balance|what the blockchain shows)$/i.test(t)
          ) {
            kids[i] = { type: "element", tagName: "h3", properties: { dataRule: "true" }, children: [{ type: "text", value: t }] };
            continue;
          }
          if (["h4", "h5", "h6"].includes(n.tagName) && /^you need a tex address when/i.test(t)) {
            kids[i] = {
              type: "element",
              tagName: "p",
              properties: {},
              children: [{ type: "element", tagName: "strong", properties: {}, children: [{ type: "text", value: t }] }],
            };
            continue;
          }
          // Break the long Binance paragraph into short ones at sentence starts (links are kept).
          if (n.tagName === "p" && /^binance is the reason tex addresses exist/i.test(t)) {
            const splitAt = /(?<=\.\s)(?=ZIP 320 does not expect|TEX addresses inform a compatible|If an exchange like Binance rejects)/;
            const paras: any[][] = [[]];
            for (const c of n.children || []) {
              if (c.type === "text" && splitAt.test(c.value)) {
                const parts = c.value.split(splitAt);
                parts.forEach((part: string, k: number) => {
                  if (k > 0) paras.push([]);
                  const txt = k < parts.length - 1 ? part.trimEnd() : part;
                  if (txt) paras[paras.length - 1].push({ type: "text", value: txt });
                });
              } else {
                paras[paras.length - 1].push(c);
              }
            }
            if (paras.length > 1) {
              kids.splice(i, 1, ...paras.map((ch) => ({ type: "element", tagName: "p", properties: {}, children: ch })));
              continue;
            }
          }
          if (n.tagName === "h2" && /^core explanation/i.test(t)) {
            stepCount.n = 1;
            const items = [
              { label: "What is it?", hint: "Short explanation", href: "#core-explanation" },
              { label: "When do I need one?", hint: "Wallets and exchanges", href: "#when-do-i-need-a-tex-address" },
              { label: "Which wallets?", hint: "Supported wallets", href: "#which-wallets-support-tex-addresses" },
              { label: "How does it work?", hint: "Technical deep dive", href: "#deep-dive" },
            ];
            kids.splice(i, 0, { type: "element", tagName: "jumpnav", properties: { items: JSON.stringify(items) }, children: [] });
            i++;
          }
          // Swap the old flow screenshot for the current one.
          const findImgT = (x: any): any =>
            x && typeof x === "object" && x.type !== "text"
              ? (x.tagName || x.name) === "img"
                ? x
                : (x.children || []).map(findImgT).find(Boolean) || null
              : null;
          if (["p", "img"].includes(n.tagName)) {
            const im = findImgT(n);
            if (im) {
              if (im.attributes) {
                for (const [k, v] of [["src", "/tex-flow-v2.jpg"], ["alt", "How a shielded wallet pays a TEX address: shielded balance, temporary transparent address, exchange"]]) {
                  const hit = im.attributes.find((at: any) => at.name === k);
                  if (hit) hit.value = v;
                  else im.attributes.push({ type: "mdxJsxAttribute", name: k, value: v });
                }
              } else {
                im.properties = { ...(im.properties || {}), src: "/tex-flow-v2.jpg", alt: "How a shielded wallet pays a TEX address: shielded balance, temporary transparent address, exchange" };
                delete im.properties.srcSet;
                delete im.properties.srcset;
              }
            }
          }
          if (n.tagName === "p" && stepCount.n === 1 && !stepCount.leadDone) {
            n.properties = { ...(n.properties || {}), dataLead: "true" };
            stepCount.leadDone = true;
          }
          if (n.tagName === "p" && /^you can view the most up-to-date list on our wallets page/i.test(t)) {
            kids.splice(i + 1, 0, {
              type: "element",
              tagName: "linkbutton",
              properties: { href: "/wallets", label: "Browse wallets" },
              children: [],
            });
          }
        }
        // Memos page: section lines become real headings; historical note becomes a callout.
        if (opts.memos && n.type === "element") {
          if (/^h[3-6]$/.test(n.tagName)) {
            n.tagName = "h2";
            n.properties = { ...(n.properties || {}) };
            if (!stepCount.leadDone) stepCount.leadDone = false; // first paragraph after heading becomes the lead
            stepCount.n += 1;
          }
          if (n.tagName === "p" && stepCount.n === 1 && !stepCount.leadDone) {
            n.properties = { ...(n.properties || {}), dataLead: "true" };
            stepCount.leadDone = true;
          }
          if (n.tagName === "p") {
            // A paragraph that is only a link (e.g. under "Resources") becomes a button.
            const only = onlyChild(n);
            if (only && only.type === "element" && only.tagName === "a" && stepCount.n > 1) {
              only.properties = { ...(only.properties || {}), dataButton: "true" };
              n.children = [only];
              n.properties = { ...(n.properties || {}), dataButtonRow: "true" };
              continue;
            }
          }
          if (n.tagName === "blockquote" && /^historical/i.test(textOf(n).trim())) {
            const blocks = (n.children || []).filter((c: any) => !isBlank(c));
            const head = blocks[0];
            if (head && head.type === "element" && head.tagName === "p") {
              kids[i] = {
                type: "element",
                tagName: "guidecallout",
                properties: { title: textOf(head).trim() },
                children: blocks.slice(1),
              };
              continue;
            }
          }
        }
        if (n.type === "element" && n.tagName === "h2") {
          const variant = variantFor(textOf(n));
          // The summary heading becomes a small label above its card.
          if (variant === "tldr" || variant === "warn") n.properties = { ...(n.properties || {}), dataEyebrow: variant };
          if (variant) {
            for (let j = i + 1; j < kids.length; j++) {
              const m = kids[j];
              if (isBlank(m)) continue;
              if (m.type === "element" && m.tagName === "ul") {
                m.properties = { ...(m.properties || {}), dataVariant: variant };
                if (variant === "related") {
                  // "[Wallets](/wallets) — description" → drop the dash so the
                  // description reads as a card subtitle.
                  for (const li of m.children || []) {
                    if (li.type !== "element" || li.tagName !== "li") continue;
                    const nxt = (li.children || []).find(
                      (c: any, k: number, a: any[]) =>
                        k > 0 && a[k - 1].type === "element" && a[k - 1].tagName === "a" && c.type === "text",
                    );
                    if (nxt) nxt.value = nxt.value.replace(/^\s*[—–-]\s*/, "");
                  }
                }
              }
              break;
            }
          }
        }
        // Standalone video (<div><iframe/></div>) on opted-in pages → video card.
        if ((opts.boldLinkButtons || opts.videoCards) && (n.type === "mdxJsxFlowElement" || n.type === "element") && (n.tagName || n.name) === "div") {
          const attrOf = (x: any, key: string): string => {
            if (x.properties && x.properties[key] != null) return String(x.properties[key]);
            const hit = (x.attributes || []).find((at: any) => at.name === key);
            return hit && typeof hit.value === "string" ? hit.value : "";
          };
          const findFrame = (x: any): any => {
            if (!x || !(x.type === "element" || x.type === "mdxJsxFlowElement")) return null;
            if ((x.tagName || x.name) === "iframe") return x;
            return (x.children || []).map(findFrame).find(Boolean) || null;
          };
          const fr = findFrame(n);
          const m = fr ? attrOf(fr, "src").match(/(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/) : null;
          if (fr && m) {
            kids[i] = {
              type: "element",
              tagName: "videoblock",
              properties: { exvideo: m[1], extitle: attrOf(fr, "title") },
              children: [],
            };
            continue;
          }
        }
        // Recovery guide: subheadings, safety callout, jump buttons, readable tables.
        if (opts.recovery) {
          const tg = (x: any): string => x.tagName || x.name || "";
          const SUBHEADINGS = /^(five-question decision flow|seed recovery|wallet files and standalone keys|sprout notes|before you open argos|restoring a seed from a different wallet)$/i;
          if (n.type === "element" && n.tagName === "p") {
            const txt = textOf(n).trim();
            const strong = onlyChild(n);
            const boldOnly = strong && strong.type === "element" && strong.tagName === "strong";
            if (SUBHEADINGS.test(txt) || (boldOnly && /^why keep your recovery material\??$/i.test(txt))) {
              kids[i] = { type: "element", tagName: boldOnly ? "h2" : "h3", properties: {}, children: [{ type: "text", value: txt }] };
              continue;
            }
            // Lone link to the full field guide → button.
            const only = onlyChild(n);
            if (only && only.type === "element" && only.tagName === "a" && /^(read|open)\b/i.test(textOf(only).trim())) {
              only.properties = { ...(only.properties || {}), dataButton: "true" };
              n.children = [only];
              n.properties = { ...(n.properties || {}), dataButtonRow: "true" };
              continue;
            }
          }
          if (n.type === "element" && /^h[1-4]$/.test(n.tagName) && /^security and responsibility/i.test(textOf(n).trim())) {
            let j = i + 1;
            while (j < kids.length && isBlank(kids[j])) j++;
            const body = kids[j];
            const nav = { type: "element", tagName: "recoverynav", properties: {}, children: [] };
            if (body && body.type === "element" && body.tagName === "p") {
              kids.splice(i, j - i + 1, nav, {
                type: "element",
                tagName: "guidecallout",
                properties: { title: "Security and responsibility" },
                children: body.children,
              });
              continue;
            }
          }
          if (n.type === "element" && n.tagName === "table") {
            const heads: string[] = [];
            const collect = (x: any) => {
              if (x.type === "element" && x.tagName === "th") heads.push(textOf(x).trim());
              (x.children || []).forEach(collect);
            };
            collect(n);
            n.properties = { ...(n.properties || {}), dataStack: "true" };
            // Long first-column text (a sentence, not a label) must wrap.
            let longest = 0;
            const scanFirst = (x: any) => {
              if (x.type === "element" && x.tagName === "tr") {
                const c = (x.children || []).find((k: any) => k.type === "element" && k.tagName === "td");
                if (c) longest = Math.max(longest, textOf(c).trim().length);
              }
              (x.children || []).forEach(scanFirst);
            };
            scanFirst(n);
            if (longest > 40) n.properties.dataWide = "true";
            const label = (x: any) => {
              if (x.type === "element" && x.tagName === "tr") {
                let c = 0;
                for (const cell of x.children || []) {
                  if (cell.type === "element" && cell.tagName === "td") {
                    cell.properties = { ...(cell.properties || {}), dataLabel: heads[c] || "" };
                    c++;
                  }
                }
              }
              (x.children || []).forEach(label);
            };
            label(n);
          }
        }
        // Faucets page: swap the white banner for the themed one and turn the
        // "Mainnet: name" lines into cards.
        if (opts.faucets) {
          const tg = (x: any): string => x.tagName || x.name || "";
          const setAttr = (x: any, key: string, val: string) => {
            if (x.attributes) {
              const hit = x.attributes.find((at: any) => at.name === key);
              if (hit) hit.value = val;
              else x.attributes.push({ type: "mdxJsxAttribute", name: key, value: val });
            } else x.properties = { ...(x.properties || {}), [key]: val };
          };
          const findLink = (x: any): string => {
            if (!x || typeof x !== "object") return "";
            if (tg(x) === "a" && x.properties?.href) return String(x.properties.href);
            for (const c of x.children || []) {
              const r = findLink(c);
              if (r) return r;
            }
            return "";
          };
          const altNow = (x: any): string => {
            if (x.properties && x.properties.alt != null) return String(x.properties.alt);
            const hit = (x.attributes || []).find((at: any) => at.name === "alt");
            return hit && typeof hit.value === "string" ? hit.value : "";
          };
          if (tg(n) === "img" && /^screenshot/i.test(altNow(n))) {
            setAttr(n, "src", "/faucets-banner.jpg");
            setAttr(n, "alt", "zecfaucet.com - enter your Zcash address to receive 0.0005 ZEC");
            if (n.properties) {
              for (const k of ["srcSet", "srcset", "width", "height"]) delete n.properties[k];
              n.properties.className = ["rounded-xl"];
            }
          }
          const asFaucet = (x: any): any => {
            if (!x || x.type !== "element" || x.tagName !== "p") return null;
            const m = textOf(x).trim().match(/^(mainnet|testnet)\s*:\s*(.+)$/i);
            if (!m) return null;
            const name = m[2].trim();
            const href = findLink(x) || `https://${/\./.test(name) ? name : name + ".com"}`;
            return {
              type: "element",
              tagName: "faucetcard",
              properties: { network: m[1][0].toUpperCase() + m[1].slice(1).toLowerCase(), name, href },
              children: [],
            };
          };
          const first = asFaucet(n);
          if (first) {
            // Group consecutive faucet lines into one grid.
            const cards = [first];
            let j = i + 1;
            while (j < kids.length) {
              if (isBlank(kids[j])) { j++; continue; }
              const c = asFaucet(kids[j]);
              if (!c) break;
              cards.push(c);
              j++;
            }
            kids.splice(i, j - i, { type: "element", tagName: "faucetlist", properties: {}, children: cards });
            continue;
          }
          // Introduction paragraph: same lead style as the guides.
          if (n.type === "element" && n.tagName === "p" && !stepCount.leadDone && textOf(n).trim().length > 60) {
            n.properties = { ...(n.properties || {}), dataLead: "true" };
            stepCount.leadDone = true;
          }
        }
        // Guide-style pages mark sections as "---" + a bold line: turn that into a real
        // heading (and drop the rule) so the page reads like the rest of the wiki.
        if (opts.sectionHeadings && n.type === "element" && n.tagName === "hr" && !stepCount.leadDone) {
          let j = i + 1;
          while (j < kids.length && isBlank(kids[j])) j++;
          const nx = kids[j];
          if (nx && nx.type === "element" && nx.tagName === "p") {
            nx.properties = { ...(nx.properties || {}), dataLead: "true" };
            stepCount.leadDone = true;
            // Quick action buttons right under the introduction.
            kids.splice(j + 1, 0, { type: "element", tagName: "guideactions", properties: {}, children: [] });
          }
        }
        // A paragraph/link that is just a big brand logo is decoration on guide pages: drop it.
        // (The node can be a plain element or an MDX JSX node, so read both shapes.)
        if (opts.sectionHeadings && ["a", "p"].includes(n.tagName || n.name || "") && !textOf(n).trim()) {
          const tagOf2 = (x: any): string => x.tagName || x.name || "";
          const altOf = (x: any): string => {
            if (x.properties && x.properties.alt != null) return String(x.properties.alt);
            const hit = (x.attributes || []).find((at: any) => at.name === "alt");
            return hit && typeof hit.value === "string" ? hit.value : "";
          };
          const findImg = (x: any): any =>
            x && typeof x === "object" && x.type !== "text"
              ? tagOf2(x) === "img"
                ? x
                : (x.children || []).map(findImg).find(Boolean) || null
              : null;
          const im = findImg(n);
          if (im && /logo/i.test(altOf(im))) {
            kids.splice(i, 1);
            i--;
            continue;
          }
        }
        if (opts.sectionHeadings && n.type === "element" && n.tagName === "p") {
          const strong = onlyChild(n);
          const inner = strong && strong.type === "element" && strong.tagName === "strong" ? onlyChild(strong) : null;
          let prev = i - 1;
          while (prev >= 0 && isBlank(kids[prev])) prev--;
          if (inner && inner.type === "text" && prev >= 0 && kids[prev].type === "element" && kids[prev].tagName === "hr") {
            kids.splice(prev, 1);
            i--;
            stepCount.n += 1;
            kids[i] = {
              type: "element",
              tagName: "h2",
              properties: { dataStep: String(stepCount.n) },
              children: [{ type: "text", value: inner.value.trim() }],
            };
            continue;
          }
        }
        if (n.type === "element" && n.tagName === "p") {
          const only = onlyChild(n);
          if (only && only.type === "element" && only.tagName === "a") {
            n.properties = { ...(n.properties || {}), dataLinkTitle: "true" };
          } else if (only && only.type === "element" && only.tagName === "strong") {
            const inner = onlyChild(only);
            if (inner && inner.type === "element" && inner.tagName === "a") {
              // Bold link on its own line = call-to-action button, but only on
              // pages that opted in (currently the "Using Zcash" section);
              // elsewhere it stays a plain entry title.
              const isAction =
                opts.boldLinkButtons === true ||
                /^(visit|open|download|get|go to|try|read|learn|start|buy|install|launch)\b/i.test(
                  textOf(inner).trim(),
                );
              if (isAction) {
                inner.properties = { ...(inner.properties || {}), dataButton: "true" };
                n.children = [inner];
                n.properties = { ...(n.properties || {}), dataButtonRow: "true" };
                // Group the button with the description paragraph right after
                // it into one entry card, so name + text read as a unit.
                let j = i + 1;
                while (j < kids.length && isBlank(kids[j])) j++;
                const next = kids[j];
                // Button directly followed by an embedded YouTube video →
                // one exchange card (info + video side by side).
                // The video arrives as an MDX JSX node (<div><iframe/></div>) or,
                // after rehype-raw, as plain elements; accept both.
                const attr = (x: any, key: string): string => {
                  if (x.properties && x.properties[key] != null) return String(x.properties[key]);
                  const hit = (x.attributes || []).find((at: any) => at.name === key);
                  return hit && typeof hit.value === "string" ? hit.value : "";
                };
                const tagOf = (x: any): string => x.tagName || x.name || "";
                const findIframe = (x: any): any => {
                  if (!x || !(x.type === "element" || x.type === "mdxJsxFlowElement")) return null;
                  if (tagOf(x) === "iframe") return x;
                  return (x.children || []).map(findIframe).find(Boolean) || null;
                };
                const isBlock = next && (next.type === "element" || next.type === "mdxJsxFlowElement") && tagOf(next) === "div";
                const frame = isBlock ? findIframe(next) : null;
                const vid = frame
                  ? attr(frame, "src").match(/(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/)
                  : null;
                if (opts.boldLinkButtons && frame && vid) {
                  kids.splice(i, j - i + 1, {
                    type: "element",
                    tagName: "exchangevideo",
                    properties: {
                      exname: textOf(inner).trim(),
                      exurl: String(inner.properties?.href || ""),
                      exvideo: vid[1],
                      extitle: attr(frame, "title"),
                    },
                    children: [],
                  });
                  continue;
                }
                if (next && next.type === "element" && next.tagName === "p" && !onlyChild(next)?.tagName?.match(/^(a|strong|img|iframe)$/)) {
                  const card = opts.boldLinkButtons
                    ? {
                        type: "element",
                        tagName: "exchangelink",
                        properties: {
                          exname: textOf(inner).trim(),
                          exurl: String(inner.properties?.href || ""),
                          extext: textOf(next).trim(),
                        },
                        children: [],
                      }
                    : {
                        type: "element",
                        tagName: "div",
                        properties: {
                          className: [
                            "my-5 w-full max-w-3xl rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03] [&>p:first-child]:mt-0 [&>p:first-child]:mb-3 [&>p:first-child>a]:px-4 [&>p:first-child>a]:py-2 [&>p:first-child>a]:text-sm [&>p:last-child]:my-0 [&>p:last-child]:px-1 [&>p:last-child]:text-[15px] [&>p:last-child]:leading-relaxed [&>p:last-child]:text-slate-600 dark:[&>p:last-child]:text-slate-300",
                          ],
                        },
                        children: [n, next],
                      };
                  // Consecutive exchange cards share one grid (two columns on wide screens).
                  let pv = i - 1;
                  while (pv >= 0 && isBlank(kids[pv])) pv--;
                  if (opts.boldLinkButtons && pv >= 0 && kids[pv].tagName === "exchangegrid") {
                    kids[pv].children.push(card);
                    kids.splice(i, j - i + 1);
                    i--;
                    continue;
                  }
                  kids.splice(i, j - i + 1, opts.boldLinkButtons ? { type: "element", tagName: "exchangegrid", properties: {}, children: [card] } : card);
                  continue;
                }
              } else {
                n.children = [inner];
                n.properties = { ...(n.properties || {}), dataLinkTitle: "true" };
              }
            }
          }
        }
        walk(n);
      }
    };
    walk(tree);
  };
}

const LazyMdxComponent = React.lazy(() => import("@/components/MdxRenderer"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[]; locale: string }>;
}): Promise<Metadata> {
  const { slug = [], locale = "en" } = await params;
  // English is served unprefixed at the root; other locales carry a /<locale>
  // prefix in the canonical URL (matches localePrefix: "as-needed").
  const localePrefix = locale && locale !== "en" ? `/${locale}` : "";
  const path = `/${slug.join("/")}`;
  const canonicalUrl = `https://zechub.wiki${localePrefix}${path}`;
  const availableLocales = await localesForPath(path);
  const alternates = buildAlternates(path, locale, availableLocales);

  if (slug.length === 0) {
    return genMetadata({
      title: "ZecHub Wiki",
      url: `https://zechub.wiki${localePrefix || ""}`,
      locale,
      alternates,
    });
  }

  const isResearchIndex = slug.length === 1 && slug[0] === "research";
  const isResearchSeries = isResearchSeriesSlug(slug);
  const isResearchArticle = slug[0] === "research" && slug.length > 1;

  const folder = slug[0] || "";
  const sectionBanner = getBanner(folder);

  const dict = (await getDictionary(locale).catch(() => ({}))) as Record<string, any>;
  const r = dict?.pages?.research ?? {};

  if (isResearchIndex) {
    return genMetadata({
      title: r.articlesHeading
        ? `${r.articlesHeading} | ZecHub`
        : "Zcash Research Articles | ZecHub",
      description:
        r.articlesSubheading ??
        "In-depth research articles, notes, and technical analysis on Zcash privacy technology, zero-knowledge proofs, and protocol design.",
      url: canonicalUrl,
      image: sectionBanner || "/content-banners/bannerResearch.jpg",
      locale,
      alternates,
    });
  }

  if (isResearchSeries) {
    const series = getResearchSeries(slug[1]);
    return genMetadata({
      title: series
        ? `${r[series.i18nKeys.title] ?? series.title} | ZecHub`
        : "Research Series | ZecHub",
      description:
        (series && r[series.i18nKeys.pageDescription]) ??
        series?.pageDescription ??
        "",
      url: canonicalUrl,
      image: sectionBanner || "/content-banners/bannerResearch.jpg",
      locale,
      alternates,
    });
  }

  let contentUrl = getDynamicRoute(slug);
  if (isResearchArticle && !isResearchSeries) {
    const rootsRaw = await getRootCached(`/site/${slug[0]}`).catch(() => []);
    const roots = Array.isArray(rootsRaw) ? rootsRaw : [];
    contentUrl = resolveResearchArticleContentUrl(slug, roots);
  }

  const slugToTitle = (segment: string) =>
    segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const lastSegment = slug[slug.length - 1];
  const fallbackHeadline = slugToTitle(lastSegment);

  const md = await getLocalizedFileContentCached(contentUrl, locale).catch(
    () => null,
  );

  if (md) {
    const articleMeta = extractArticleMeta(
      md,
      fallbackHeadline,
      sectionBanner,
      contentUrl,
    );

    const title = articleMeta.headline.toLowerCase().includes("zechub")
      ? articleMeta.headline
      : `${articleMeta.headline} | ZecHub`;

    return genMetadata({
      title,
      description: articleMeta.description,
      image: articleMeta.image || sectionBanner,
      url: canonicalUrl,
      locale,
      type: "article",
      alternates,
    });
  }

  const sectionTitle = slugToTitle(slug[0]);
  const sectionDesc = getSectionDescription(slug[0]);

  return genMetadata({
    title: `${sectionTitle} | ZecHub`,
    description: sectionDesc,
    image: sectionBanner,
    url: canonicalUrl,
    locale,
    alternates,
  });
}

export default async function Page(props: {
  params: Promise<{ slug: string[]; locale: string }>;
}) {
  headers();
  let slug: string[] = [];
  let locale = "en";
  try {
    const resolved = await props.params;
    slug = resolved.slug || [];
    locale = resolved.locale || "en";
  } catch {
    return notFound();
  }
  if (slug.length === 0) return notFound();
  if (slug[0] === ".well-known") return null;

  // Server-side dictionary load so the research index/series chrome renders in
  // the active locale (the surrounding page is a server component).
  const dict = (await getDictionary(locale)) as Record<string, any>;
  const r = dict?.pages?.research ?? {};

  // Localized side-menu titles (content-repo manifest), passed to <SideMenu>
  // (a client component). English is the cross-locale fallback.
  const [menuTitles, enMenuTitles] = await Promise.all([
    getMenuTitlesCached(locale),
    getMenuTitlesCached("en"),
  ]);
  // English keys are the full content-file list; a localized manifest only
  // covers what has been translated, so it would under-report folders.
  const manifestPaths = Object.keys(enMenuTitles ?? {});

  const url = getDynamicRoute(slug);
  const urlRoot = `/site/${slug[0]}`;

  const isResearchIndex = slug.length === 1 && slug[0] === "research";
  const isResearchSeries = isResearchSeriesSlug(slug);
  const isResearchArticle = slug[0] === "research" && slug.length > 1;

  // === STRICTER getHeroImage (prevents empty src/darkSrc) ===
  const getHeroImage = (slugSegment: string) => {
    const src = getBanner(slugSegment) || "";
    const darkSrc = getBanner(`${slugSegment}-dark`) || getBanner(slugSegment) || "";

    if (!src) return undefined;

    return {
      src,
      darkSrc: darkSrc || src,
    };
  };

  let contentUrl = url;
  let markdown: any = null;
  let roots: any[] = [];
  let dynamicCovers: Record<string, { src: string; alt: string }> = {};

  try {
    if (isResearchIndex) {
      const topLevel = await getRootCached(urlRoot).catch(() => []);
      let seriesArticles: string[] = [];
      for (const series of RESEARCH_SERIES) {
        try {
          const found = await getAllMarkdownRecursively(series.contentDir);
          seriesArticles = seriesArticles.concat(found);
        } catch {}
      }

      const nonSeriesRoots = topLevel.filter(
        (p: string) => !isResearchSeriesPath(p),
      );

      const indexDynamicCovers: Record<string, { src: string; alt: string }> =
        {};
      await Promise.all(
        nonSeriesRoots.map(async (filePath: string) => {
          try {
            const content = await getFileContentCached(filePath);
            if (!content) return;
            const imgSrc = extractFirstContentImage(content, filePath);
            if (imgSrc) {
              const wikiSlug = transformGithubFilePathToWikiLink(
                filePath.replace(/\.md$/i, ""),
              );
              indexDynamicCovers[wikiSlug] = {
                src: imgSrc,
                alt: "Article thumbnail",
              };
            }
          } catch {}
        }),
      );

      roots = [...topLevel, ...seriesArticles];

      const heroImage = getHeroImage(slug[0]);

      return (
        <MdxContainer
          hasSideMenu={false}
          sideMenu={null}
          roots={roots}
          {...(heroImage ? { heroImage } : {})}
        >
          {/* === Series Section (On Top) === */}
          <div className="px-2 pb-10">
            <div className="mb-5 px-1">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {r.seriesHeading ?? "Series"}
              </h2>
              <p className="mt-1.5 text-[15px] text-muted-foreground">
                {r.seriesSubheading ?? "Deep dives into core Zcash concepts"}
              </p>
            </div>

            <div className="grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
              {RESEARCH_SERIES.map((series) => (
                <Link
                  key={series.id}
                  href={series.href}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-background transition-all active:scale-[0.985] sm:hover:border-slate-300 sm:hover:shadow-lg dark:border-slate-700 dark:sm:hover:border-slate-600"
                >
                  <div
                    className="relative flex aspect-[16/9] w-full shrink-0 items-center justify-center overflow-hidden
                                  border-b border-zinc-700 bg-gradient-to-br from-zinc-700 to-zinc-500
                                  sm:aspect-[2.2/1]"
                  >
                    <div className="px-6 text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                        <span className="text-5xl">{series.emoji}</span>
                      </div>
                      <p className="text-2xl font-semibold tracking-tight text-white">
                        {r[series.i18nKeys.title] ?? series.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {r[series.i18nKeys.badge] ?? series.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {r[series.i18nKeys.title] ?? series.title}
                    </h3>

                    <p className="mt-3 text-[15px] text-muted-foreground">
                      {r[series.i18nKeys.cardDescription] ?? series.cardDescription}
                    </p>

                    <div className="mt-auto pt-5 text-sm font-medium text-muted-foreground group-active:text-foreground transition-colors">
                      {r.exploreSeries ?? "Explore the series →"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* === Research Articles Section === */}
          <div className="px-2 pb-12">
            <div className="mb-5 px-1">
              <h2 className="text-2xl font-bold tracking-tight">
                {r.articlesHeading ?? "Research Articles"}
              </h2>
              <p className="mt-1.5 text-[15px] text-muted-foreground">
                {r.articlesSubheading ??
                  "Articles and notes from the ZecHub community."}
              </p>
            </div>

            <ResearchIndexGrid
              roots={nonSeriesRoots}
              dynamicCovers={indexDynamicCovers}
              showHeader={false}
              titles={menuTitles}
              enTitles={enMenuTitles}
            />
          </div>
        </MdxContainer>
      );
    } else if (isResearchSeries) {
      const seriesName = slug[1];
      const series = getResearchSeries(seriesName);
      const basePath = `site/Research/${seriesName}`;
      const collectArticles = async (path: string): Promise<string[]> => {
        try {
          const items = await getSiteFolders(path).catch(() => []);
          let mds: string[] = [];
          for (const item of items) {
            if (item.endsWith(".md")) mds.push(item);
            else if (!item.includes(".") && !item.endsWith(".md")) {
              const sub = await collectArticles(item);
              mds = mds.concat(sub);
            }
          }
          return mds;
        } catch {
          return [];
        }
      };
      const articlePaths = await collectArticles(basePath);
      await Promise.all(
        articlePaths.map(async (filePath) => {
          try {
            const content = await getFileContentCached(filePath);
            if (!content) return;
            const imgSrc = extractFirstContentImage(content, filePath);
            if (imgSrc) {
              const wikiSlug = transformGithubFilePathToWikiLink(
                filePath.replace(/\.md$/i, ""),
              );
              dynamicCovers[wikiSlug] = {
                src: imgSrc,
                alt: "Article thumbnail",
              };
            }
          } catch {}
        }),
      );
      roots = articlePaths;
      markdown = null;

      const heroImage = getHeroImage(slug[0]);

      return (
        <MdxContainer
          hasSideMenu={false}
          sideMenu={null}
          roots={roots}
          {...(heroImage ? { heroImage } : {})}
        >
          <div className="px-2 pb-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{series?.emoji ?? "📚"}</span>
                <h1 className="text-2xl imd:text-4xl font-bold">
                  {(series && r[series.i18nKeys.title]) ??
                    series?.title ??
                    "Research Series"}
                </h1>
              </div>
              <p className="max-w-3xl text-base text-muted-foreground">
                {(series && r[series.i18nKeys.pageDescription]) ??
                  series?.pageDescription ??
                  ""}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {(series?.tags ?? []).map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ResearchIndexGrid
            roots={roots}
            dynamicCovers={dynamicCovers}
            showHeader={false}
            titles={menuTitles}
            enTitles={enMenuTitles}
          />
        </MdxContainer>
      );
    } else {
      const rootsRaw = await getRootCached(urlRoot).catch(() => []);
      roots = Array.isArray(rootsRaw) ? rootsRaw : [];

      // Research article path resolution lives in resolveResearchArticleContentUrl().
      if (isResearchArticle && !isResearchSeries) {
        contentUrl = resolveResearchArticleContentUrl(slug, roots);
      }

      const md = await getLocalizedFileContentCached(contentUrl, locale).catch(
        () => null,
      );
      markdown = md;
    }
  } catch (e) {
    console.error("Failed to fetch and parse .md file: ", e);
    markdown = null;
    roots = [];
  }

  // Preprocessing
  let processedMarkdown = String(markdown || "");
  if (isResearchArticle && processedMarkdown) {
    const articleDir = `site/Research/${slug.slice(1, -1).join("/")}`;
    processedMarkdown = processedMarkdown.replace(
      /!\[([^\]]*)\]\(([^)]+?)\)/g,
      (match, alt, src) => {
        if (
          src.startsWith("http") ||
          src.startsWith("/") ||
          src.startsWith("#")
        )
          return match;
        return `![${alt}](https://raw.githubusercontent.com/ZecHub/zechub/main/${articleDir}/${src})`;
      },
    );
    processedMarkdown = normalizeResearchMdx(processedMarkdown);
  }

  if (slug.join("/") === "using-zcash/metamask-snap" && locale === routing.defaultLocale && processedMarkdown) {
    processedMarkdown = rewriteMetamaskSnap(processedMarkdown);
  }

  const imgUrl = getBanner(slug[0]) || "";
  const imgUrlDark = getBanner(`${slug[0]}-dark`) || imgUrl;
  const showSideMenu = slug[0] !== "research" && roots.length > 0;
  const slugToTitle = (segment: string) =>
    segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const researchSegment = slug.length > 1 ? slug[slug.length - 1] : "";
  const researchBreadcrumbLabel = researchSegment
    ? slugToTitle(researchSegment)
    : "";
  const localeUrlPrefix = locale && locale !== "en" ? `/${locale}` : "";
  const canonicalWikiUrl = `https://zechub.wiki${localeUrlPrefix}/${slug.join("/")}`;
  // One trail for both the visible breadcrumb and the BreadcrumbList below, so
  // what a reader sees and what a crawler reads cannot drift apart. Research
  // articles keep the trail their own layout already renders.
  const breadcrumbTrail = buildBreadcrumbs({
    slug,
    titles: menuTitles,
    enTitles: enMenuTitles,
    menuLabels: dict?.menuLabels ?? {},
  });

  if (!markdown) {
    // A null `markdown` has two very different causes. Section landing pages
    // (e.g. /guides, /start-here) have no single article file but DO have a
    // populated `roots` folder listing, and correctly render the browse view
    // below. A genuinely missing URL (e.g. /qwerty-nonsense) has neither an
    // article NOR a folder to browse — `getRootCached` caught its 404 and
    // returned []. Only that second case is a real 404; return notFound() so
    // the app stops serving HTTP 200 empty placeholder pages for dead URLs.
    //
    // A dead article URL under a real section (e.g. /zcash-tech/light-wallet-
    // node) passes the `roots` check, because `roots` lists the section rather
    // than the article. isKnownContentPath tells the two apart from the
    // manifest: anything naming a real file or folder keeps the behaviour it
    // has today, and only a URL the manifest has never heard of becomes a 404.
    if (roots.length === 0 || !isKnownContentPath(slug, manifestPaths)) {
      return notFound();
    }
    return (
      <MdxContainer
        hasSideMenu={showSideMenu}
        sideMenu={
          showSideMenu ? <SideMenu folder={slug[0]} roots={roots} titles={menuTitles} enTitles={enMenuTitles} /> : null
        }
        roots={roots}
        heroImage={{ src: imgUrl, darkSrc: imgUrlDark }}
        breadcrumbs={breadcrumbTrail}
      >
        <div className="px-6 py-12 text-center">
          <h1 className="text-5xl font-bold mb-6 capitalize">
            {slug[0].replace(/-/g, " ")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {dict?.pages?.browseSidebar ??
              "Open Navigation to browse the articles in this section."}
          </p>
        </div>
      </MdxContainer>
    );
  }

  const serializedSource = await serialize(normalizeMdx(processedMarkdown), {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypeRaw,
          {
            passThrough: [
              "mdxJsxFlowElement",
              "mdxFlowExpression",
              "mdxJsxTextElement",
              "mdxTextExpression",
            ],
          },
        ],
        // Runs AFTER rehypeRaw so it sees the parsed raw-HTML nodes.
        rehypeStripDangerous,
        rehypeFlattenNestedParagraphs,
        [
          rehypeWikiPatterns,
          {
            boldLinkButtons: slug[0] === "using-zcash",
            videoCards: slug[0] === "using-zcash" || slug[0] === "start-here" || (slug[0] === "guides" && slug[1] === "akash-network-zcashd") || (slug[0] === "guides" && slug[1] === "nym-vpn") || (slug[0] === "guides" && slug[1] === "using-zec-in-defi") || (slug[0] === "guides" && slug[1] === "visualizing-the-zcash-network") || (slug[0] === "guides" && slug[1] === "ywallet-frost-demo") || (slug[0] === "guides" && slug[1] === "raspberry-pi5-zebra-lightwalletd-zingo"),
            rpi5: slug[0] === "guides" && (slug[1] === "raspberry-pi5-zebra-lightwalletd-zingo" || slug[1] === "raspberry-pi-4-zebra-node"),
            hz: slug[0] === "guides" && slug[1] === "hardened-zebrad",
            akash: slug[0] === "guides" && (slug[1] === "akash-network-zcashd" || slug[1] === "akash-network-zebra"),
            nym: slug[0] === "guides" && slug[1] === "nym-mixnet-wallet-setup",
            nymvpn: slug[0] === "guides" && slug[1] === "nym-vpn",
            defi: slug[0] === "guides" && slug[1] === "using-zec-in-defi",
            vrel: slug[0] === "guides" && slug[1] === "verifying-zcash-releases",
            vkx: slug[0] === "guides" && slug[1] === "viewing-key-transaction-export",
            vaddr: slug[0] === "guides" && slug[1] === "visualizing-zcash-addresses",
            vnet: slug[0] === "guides" && slug[1] === "visualizing-the-zcash-network",
            yfrost: slug[0] === "guides" && slug[1] === "ywallet-frost-demo",
            dtool: slug[0] === "guides" && slug[1] === "zcash-devtool",
            zips: slug[0] === "guides" && slug[1] === "zcash-improvement-proposals",
            nrpc: slug[0] === "guides" && slug[1] === "zcash-node-rpc-and-indexing",
            zenith: slug[0] === "guides" && slug[1] === "zenith-installation",
            zkdecoy: slug[0] === "guides" && slug[1] === "zero-knowledge-vs-decoys",
            zgo: slug[0] === "guides" && slug[1] === "zgo-payment-processor",
            z3zaino: slug[0] === "guides" && slug[1] === "zingolib-and-zaino-tutorial",
            zkool: slug[0] === "guides" && slug[1] === "zkool-multisig",
            btcpay: slug[0] === "guides" && slug[1] === "btcpayserver-zcash-plugin",
            maya: slug[0] === "guides" && slug[1] === "maya-protocol",
            redbridge: slug[0] === "guides" && slug[1] === "avalanche-redbridge",
            shapeshift: slug[0] === "guides" && slug[1] === "shapeshift-zcash",
            free2z: slug[0] === "guides" && slug[1] === "free2z-live",
            usezec: slug[0] === "guides" && slug[1] === "using-zec-privately",
            keystone: slug[0] === "guides" && slug[1] === "keystone-zashi",
            brave: slug[0] === "guides" && slug[1] === "brave-wallet-guide",
            explorers: slug[0] === "guides" && slug[1] === "blockchain-explorers",
            wb: slug[0] === "guides" && slug[1] === "my-first-zcash-workbook",
            mstake: slug[0] === "guides" && slug[1] === "mining-and-staking-privacy",
            mig: slug[0] === "guides" && slug[1] === "migration-guide-zcashd-to-zebrad-zallet",
            akashBtn: slug[0] === "guides" && slug[1] === "akash-network-zebra",
            akashz: slug[0] === "guides" && slug[1] === "akash-network-zebra",
            rpi4z: slug[0] === "guides" && slug[1] === "raspberry-pi-4-zebra-node",
            sectionHeadings: slug[0] === "start-here",
            faucets: slug[0] === "using-zcash" && slug[1] === "faucets",
            recovery: slug[0] === "using-zcash" && slug[1] === "recovering-funds",
            memos: slug[0] === "using-zcash" && slug[1] === "memos",
            tex: slug[0] === "using-zcash" && slug[1] === "transparent-exchange-addresses",
            pools: slug[0] === "using-zcash" && slug[1] === "shielded-pools",
            prq: slug[0] === "using-zcash" && slug[1] === "payment-request-uris",
            ncex: slug[0] === "using-zcash" && slug[1] === "non-custodial-exchanges",
            node: slug[0] === "guides" && slug[1] === "raspberry-pi-4-full-node",
            snap: (slug[0] === "guides" && (slug[1] === "viewing-key-transaction-export" || slug[1] === "using-zec-in-defi" || slug[1] === "nym-mixnet-wallet-setup" || slug[1] === "raspberry-pi-4-full-node" || slug[1] === "akash-network-zcashd")) || slug[0] === "using-zcash" && (slug[1] === "metamask-snap" || slug[1] === "mobile-top-ups" || slug[1] === "solana-zec-to-shielded" || slug[1] === "solswap"),
            swap: slug[0] === "using-zcash" && slug[1] === "solswap",
            tnet: slug[0] === "using-zcash" && slug[1] === "testnet",
            txn: slug[0] === "using-zcash" && slug[1] === "transactions",
            ua: slug[0] === "using-zcash" && slug[1] === "unified-addresses",
            mine: slug[0] === "using-zcash" && slug[1] === "zcash-mining-guide",
            zal: slug[0] === "using-zcash" && slug[1] === "zallet-quick-reference-guide",
            uc: slug[0] === "zcash-use-cases" && slug.length > 1,
            ucHub: slug[0] === "zcash-use-cases" && slug[1] === "about",
            compact: slug[0] === "using-zcash" && slug[1] === "mobile-top-ups",
            sol: slug[0] === "using-zcash" && slug[1] === "solana-zec-to-shielded",
            comm: slug[0] === "zcash-community" && slug[1] === "community-links",
            cz: slug[0] === "zcash-community" && slug[1] === "cypherpunk-zero-nft",
            gov: slug[0] === "zcash-community" && slug[1] === "zcash-governance",
            zcap: slug[0] === "zcash-community" && slug[1] === "zcap",
            sec: slug[0] === "zcash-community" && slug[1] === "zcash-ecosystem-security",
            eo: slug[0] === "zcash-community" && slug[1] === "zcash-engineering-office-hours",
            amb: slug[0] === "zcash-community" && slug[1] === "zcash-global-ambassadors",
            media: slug[0] === "zcash-community" && slug[1] === "zcash-media",
            pod: slug[0] === "zcash-community" && slug[1] === "zcash-podcasts",
            zcon: slug[0] === "zcash-community" && (slug[1] === "zcon-archive" ? "archive" : slug[1] === "zcon-vozes" ? "vozes" : false),
          },
        ],
      ],
    },
  });

  const heroImage = getHeroImage(slug[0]);

  // Per-article structured-data fields derived from the page's own markdown:
  // real H1 → headline, first prose paragraph → description, frontmatter
  // published/date → datePublished, frontmatter image/cover (else the folder
  // banner) → image. Falls back to a slug-derived title only when no H1 exists.
  const articleMeta = extractArticleMeta(
    processedMarkdown,
    slugToTitle(slug[slug.length - 1]),
    imgUrl,
    contentUrl,
  );

  // schema.org structured data for this content page, emitted as a single
  // @graph: a TechArticle plus a self-contained Organization node (so consumers
  // that don't merge across <script> blocks still resolve author/publisher) and
  // a BreadcrumbList derived from the slug segments. Consumed by classic search
  // and AI answer engines; rendered server-side (SSR route).
  const breadcrumbItems = breadcrumbTrail.map((crumb, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: crumb.label,
    item: `https://zechub.wiki${localeUrlPrefix}${crumb.href === "/" ? "" : crumb.href}`,
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: articleMeta.headline,
        description: articleMeta.description,
        inLanguage: locale,
        url: canonicalWikiUrl,
        mainEntityOfPage: canonicalWikiUrl,
        author: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
        ...(articleMeta.datePublished
          ? { datePublished: articleMeta.datePublished }
          : {}),
        ...(articleMeta.image ? { image: articleMeta.image } : {}),
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "ZecHub",
        url: "https://zechub.wiki",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <MdxContainer
        hasSideMenu={showSideMenu}
        sideMenu={
          showSideMenu ? <SideMenu folder={slug[0]} roots={roots} titles={menuTitles} enTitles={enMenuTitles} /> : null
        }
        roots={roots}
        {...(heroImage ? { heroImage } : {})}
        // Minimal layout: no decorative banner on "Using Zcash" pages. Add more
        // top-level folders here as the other sections are redesigned.
        hideBanner={["using-zcash", "start-here", "zcash-use-cases", "zcash-community", "guides"].includes(slug[0])}
        breadcrumbs={isResearchArticle ? undefined : breadcrumbTrail}
        layoutVariant={isResearchArticle ? "research" : "default"}
        researchMeta={
          isResearchArticle
            ? {
                breadcrumbLabel: researchBreadcrumbLabel,
                shareUrl: canonicalWikiUrl,
                pageTitle: researchBreadcrumbLabel,
              }
            : undefined
        }
      >
        <Suspense
          fallback={<span className="text-center text-3xl">Loading...</span>}
        >
          <LazyMdxComponent source={serializedSource} />
        </Suspense>
      </MdxContainer>
    </>
  );
}

export const dynamic = "force-dynamic";

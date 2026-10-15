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
function rehypeWikiPatterns(opts: { pools?: boolean; prq?: boolean; ncex?: boolean; snap?: boolean; boldLinkButtons?: boolean; videoCards?: boolean; sectionHeadings?: boolean; faucets?: boolean; recovery?: boolean; memos?: boolean; tex?: boolean } = {}) {
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
    const walk = (node: any) => {
      const kids = node.children;
      if (!Array.isArray(kids)) return;
      for (let i = 0; i < kids.length; i++) {
        const n = kids[i];
        // Step guides (MetaMask Snap): "1. Title" headings become numbered steps; screenshots get a frame.
        if (opts.snap && n.type === "element") {
          if (n.tagName === "h2") {
            const mm = /^(\d+)\.\s+(.+)$/.exec(textOf(n).trim());
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
            const mm = /^(\d+)\.\s+(.+)$/.exec(textOf(n).trim());
            if (mm) {
              n.properties = { ...(n.properties || {}), dataStep: mm[1] };
              n.children = [{ type: "text", value: mm[2] }];
            } else {
              n.properties = { ...(n.properties || {}), dataRule: "true" };
            }
          } else if (n.tagName === "img") {
            n.properties = { ...(n.properties || {}), dataFrame: "true" };
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
            videoCards: slug[0] === "using-zcash" || slug[0] === "start-here",
            sectionHeadings: slug[0] === "start-here",
            faucets: slug[0] === "using-zcash" && slug[1] === "faucets",
            recovery: slug[0] === "using-zcash" && slug[1] === "recovering-funds",
            memos: slug[0] === "using-zcash" && slug[1] === "memos",
            tex: slug[0] === "using-zcash" && slug[1] === "transparent-exchange-addresses",
            pools: slug[0] === "using-zcash" && slug[1] === "shielded-pools",
            prq: slug[0] === "using-zcash" && slug[1] === "payment-request-uris",
            ncex: slug[0] === "using-zcash" && slug[1] === "non-custodial-exchanges",
            snap: slug[0] === "using-zcash" && (slug[1] === "metamask-snap" || slug[1] === "mobile-top-ups"),
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
        hideBanner={["using-zcash", "start-here"].includes(slug[0])}
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

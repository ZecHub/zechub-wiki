import MdxContainer from "@/components/MdxContainer";
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
function rehypeWikiPatterns(opts: { boldLinkButtons?: boolean; videoCards?: boolean; sectionHeadings?: boolean; faucets?: boolean; recovery?: boolean; memos?: boolean; tex?: boolean } = {}) {
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
    const walk = (node: any) => {
      const kids = node.children;
      if (!Array.isArray(kids)) return;
      for (let i = 0; i < kids.length; i++) {
        const n = kids[i];
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
                for (const [k, v] of [["src", "/tex-flow.jpg"], ["alt", "How a shielded wallet pays a TEX address: shielded balance, temporary transparent address, exchange"]]) {
                  const hit = im.attributes.find((at: any) => at.name === k);
                  if (hit) hit.value = v;
                  else im.attributes.push({ type: "mdxJsxAttribute", name: k, value: v });
                }
              } else {
                im.properties = { ...(im.properties || {}), src: "/tex-flow.jpg", alt: "How a shielded wallet pays a TEX address: shielded balance, temporary transparent address, exchange" };
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

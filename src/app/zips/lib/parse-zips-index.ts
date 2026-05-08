/**
 * HTML parser for the canonical Zcash ZIP index at https://zips.z.cash/
 *
 * Why HTML and not the GitHub README? The upstream README.template no
 * longer carries the ZIP table — it's now a short links page. The
 * z.cash site itself is the canonical rendered index, generated from
 * each ZIP's frontmatter at build time. The HTML it ships is stable,
 * minimal, and easy to scrape:
 *
 *   <tr> <td>231</td> <td class="left"><a href="zip-0231">Memo Bundles</a></td>
 *        <td>Draft</td>
 *
 * NU7 candidates appear in their own <section id="nu7-candidate-zips">
 * with a flat list of `<a href="zip-NNNN">` items.
 */

import type { Zip, ZipStatus } from "../types";

const STATUS_KEYWORDS: ZipStatus[] = [
  "Final",
  "Active",
  "Proposed",
  "Draft",
  "Reserved",
  "Withdrawn",
  "Obsolete",
];

export function parseZipsIndex(html: string): Zip[] {
  const nu7Numbers = extractNu7Section(html);
  const rows = extractTableRows(html);

  const zips: Zip[] = [];
  for (const row of rows) {
    if (zips.find((z) => z.num === row.num)) continue;
    zips.push({
      num: row.num,
      title: row.title,
      status: row.status,
      tags: inferTags(row.title, nu7Numbers.has(row.num)),
      summary: null,
    });
  }

  zips.sort((a, b) => b.num - a.num);
  return zips;
}

interface RawRow {
  num: number;
  title: string;
  status: ZipStatus;
}

function extractTableRows(html: string): RawRow[] {
  // Active/Final rows look like:
  //   <tr> <td>231</td> <td class="left"><a href="zip-0231">Memo Bundles</a></td> <td>Final</td>
  // Reserved/Withdrawn/Obsolete rows wrap the number and link in spans:
  //   <tr> <td><span class="reserved">1</span></td>
  //        <td class="left"><a class="reserved" href="zip-0001">…</a></td>
  //        <td>Reserved</td>
  // Status cells can also be multi-revision strings like
  //   <td>[Revision 0: Canopy, Revision 1: NU6] Final, [Revision 2: NU6.1] Proposed</td>
  // — we take the LAST status keyword as the current status.
  //
  // The regex below tolerates optional inline wrappers (<span class="…">
  // for Reserved rows, <strike> for Withdrawn/Obsolete rows) around both
  // the ZIP number and the title link.
  const rowRe =
    /<tr>\s*<td>\s*(?:<\w+[^>]*>\s*)*(\d+)\s*(?:<\/\w+>\s*)*<\/td>\s*<td[^>]*>\s*(?:<\w+[^>]*>\s*)*<a[^>]*href="zip-\d+"[^>]*>([^<]+)<\/a>(?:\s*<\/\w+>)*\s*<\/td>\s*<td>\s*([^<]+?)\s*<\/td>/gi;

  const rows: RawRow[] = [];
  for (const m of html.matchAll(rowRe)) {
    const num = parseInt(m[1], 10);
    const title = decodeEntities(m[2].trim());
    const statusCell = m[3];

    let status: ZipStatus = "Draft";
    let lastIdx = -1;
    for (const s of STATUS_KEYWORDS) {
      const idx = statusCell.lastIndexOf(s);
      if (idx > lastIdx) {
        lastIdx = idx;
        status = s;
      }
    }
    rows.push({ num, title, status });
  }
  return rows;
}

function extractNu7Section(html: string): Set<number> {
  // Locate the NU7 section by its anchor id and grab everything before
  // the next <section ...>. Inside, every "zip-NNNN" link is a candidate.
  const startMarker = 'id="nu7-candidate-zips"';
  const startIdx = html.indexOf(startMarker);
  if (startIdx < 0) return new Set();

  const rest = html.slice(startIdx);
  const endIdx = rest.indexOf("</section>");
  const section = endIdx > 0 ? rest.slice(0, endIdx) : rest;

  const nums = new Set<number>();
  for (const m of section.matchAll(/href="zip-(\d+)"/g)) {
    nums.add(parseInt(m[1], 10));
  }
  return nums;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&nbsp;/g, " ");
}

function inferTags(title: string, isNu7: boolean): string[] {
  const tags: string[] = [];
  if (isNu7) tags.push("nu7");
  const t = title.toLowerCase();
  if (
    /(consensus|transaction format|signature|orchard|sapling|sprout|fee|block|burn|asset|memo|issuance|quantum)/.test(
      t
    )
  )
    tags.push("consensus");
  if (
    /(wallet|hd|address|memo|recovery|hardware|disclosure|viewing key|payment request|payment uri)/.test(
      t
    )
  )
    tags.push("wallet");
  if (/(network|peer|p2p|relay|stratum|light client)/.test(t)) tags.push("network");
  if (/(fund|grant|subsid|disburs|dev fund|circulation|sustainability|miner|coinholder)/.test(t))
    tags.push("funding");
  if (/(deploy|upgrade)/.test(t)) tags.push("upgrade");
  if (/(min(?:ing|er)|stratum|getblocktemplate)/.test(t)) tags.push("mining");
  return [...new Set(tags)];
}

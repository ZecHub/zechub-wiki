
import * as cheerio from "cheerio";
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
  const $ = cheerio.load(html);

  const nu7Numbers = extractNu7Section($);
  const zips = new Map<number, Zip>();

  // The page renders one <table> per section (Released / Draft / Withdrawn /
  // Rejected / Obsolete). Each <tr> with three <td> cells is a ZIP row:
  //   <td>NUM</td>
  //   <td class="left"><a href="zip-NNNN">TITLE</a></td>
  //   <td>STATUS</td>
  $("table tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 3) return;

    const numText = $(cells[0]).text().trim();
    const num = parseInt(numText, 10);
    if (!Number.isFinite(num)) return;
    if (zips.has(num)) return;

    const title =
      $(cells[1]).find("a").first().text().trim() ||
      $(cells[1]).text().trim();

    const status = pickLatestStatus($(cells[2]).text());

    zips.set(num, {
      num,
      title,
      status,
      tags: inferTags(title, nu7Numbers.has(num)),
      summary: null,
    });
  });

  return [...zips.values()].sort((a, b) => b.num - a.num);
}

/**
 * Status cells can carry multi-revision strings like
 *   "[Revision 0: Canopy, Revision 1: NU6] Final, [Revision 2: NU6.1] Proposed"
 * The current status is the LAST keyword to appear.
 */
function pickLatestStatus(cell: string): ZipStatus {
  let status: ZipStatus = "Draft";
  let lastIdx = -1;
  for (const s of STATUS_KEYWORDS) {
    const idx = cell.lastIndexOf(s);
    if (idx > lastIdx) {
      lastIdx = idx;
      status = s;
    }
  }
  return status;
}

/**
 * The NU7 candidates live in <section id="nu7-candidate-zips"> as a flat
 * list of `<a href="zip-NNNN">` links.
 */
function extractNu7Section($: cheerio.CheerioAPI): Set<number> {
  const nums = new Set<number>();
  $("#nu7-candidate-zips a[href^='zip-']").each((_, el) => {
    const href = $(el).attr("href") || "";
    const m = href.match(/zip-(\d+)/);
    if (m) nums.add(parseInt(m[1], 10));
  });
  return nums;
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
  if (/(network|peer|p2p|relay|stratum|light client)/.test(t))
    tags.push("network");
  if (
    /(fund|grant|subsid|disburs|dev fund|circulation|sustainability|miner|coinholder)/.test(
      t
    )
  )
    tags.push("funding");
  if (/(deploy|upgrade)/.test(t)) tags.push("upgrade");
  if (/(min(?:ing|er)|stratum|getblocktemplate)/.test(t)) tags.push("mining");
  return [...new Set(tags)];
}

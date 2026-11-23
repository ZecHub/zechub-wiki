
import * as cheerio from "cheerio";
import type { Zip, ZipStatus } from "@/app/[locale]/zips/types";

const STATUS_KEYWORDS: ZipStatus[] = [
  "Final",
  "Active",
  "Proposed",
  "Draft",
  "Reserved",
  "Withdrawn",
  "Obsolete",
];

/**
 * Consensus ZIPs deployed in NU7 (activated on Mainnet at block 3,543,405 on
 * 2026-11-06), per ZIP 259 ("Deployment of the NU7 Network Upgrade").
 * Used once zips.z.cash replaced #nu7-candidate-zips with
 * #settled-mainnet-network-upgrade referencing zip-0259.
 */
const SETTLED_NU7_ZIPS = [207, 214, 218, 235, 237, 259, 2003, 2008] as const;

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

    const statusText = $(cells[2]).text();
    const status = pickLatestStatus(statusText);
    const isNu7 =
      nu7Numbers.has(num) ||
      (status !== "Withdrawn" &&
        status !== "Obsolete" &&
        /\bNU7\b/.test(statusText));

    zips.set(num, {
      num,
      title,
      status,
      tags: inferTags(title, isNu7),
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
 * Extract NU7 ZIP numbers from the upstream zips.z.cash index.
 *
 * Before NU7 activated, upstream listed candidates under `#nu7-candidate-zips`.
 * After NU7 settled on Mainnet (block 3,543,405, 2026-11-06), upstream replaced
 * that section with `#settled-mainnet-network-upgrade` pointing to ZIP 259
 * (and a separate list of non-consensus Proposed ZIPs explicitly "not part of
 * NU7", which must NOT be tagged as NU7).
 */
function extractNu7Section($: cheerio.CheerioAPI): Set<number> {
  const nums = new Set<number>();
  $("#nu7-candidate-zips a[href^='zip-']").each((_, el) => {
    const href = $(el).attr("href") || "";
    const m = href.match(/zip-(\d+)/);
    if (m) nums.add(parseInt(m[1], 10));
  });
  if (nums.size > 0) return nums;

  const settled = $("#settled-mainnet-network-upgrade");
  if (settled.length > 0 && /\bNU7\b/.test(settled.text())) {
    for (const num of SETTLED_NU7_ZIPS) {
      nums.add(num);
    }
  }
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

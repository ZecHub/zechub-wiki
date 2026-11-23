import { parseZipsIndex } from "../parse-zips-index";

const SETTLED_NU7_HTML = `
<section id="settled-mainnet-network-upgrade">
  <h2>Settled Mainnet Network Upgrade</h2>
  <p>The most recent settled Network Upgrade on Mainnet is NU7, which activated at Mainnet block height 3543405 on November 6, 2026, at 02:34 UTC.</p>
  <p>NU7 is described in <a href="zip-0259">ZIP 259: Deployment of the NU7 Network Upgrade</a>.</p>
  <p>The following non-consensus ZIP is Proposed, but is not part of NU7:</p>
  <ul>
    <li><a href="zip-2009">ZIP 2009: Reduce Marginal Fee to 1000 Zatoshis and Raise the Weight Ratio Cap to 10</a></li>
  </ul>
</section>
<table>
  <tr><th>ZIP</th><th>Title</th><th>Status</th></tr>
  <tr><td>207</td><td><a href="zip-0207">Funding Streams</a></td><td>[Revision 0: Canopy, Revision 1: NU6, Revision 2: NU7] Final</td></tr>
  <tr><td>214</td><td><a href="zip-0214">Consensus rules for a Zcash Development Fund</a></td><td>[Revision 0: Canopy, Revision 1: NU6, Revision 2: NU6.1, Revision 3: NU7] Final</td></tr>
  <tr><td>218</td><td><a href="zip-0218">25-second Block Target Spacing</a></td><td>Final</td></tr>
  <tr><td>235</td><td><a href="zip-0235">Remove 60% of Transaction Fees From Circulation</a></td><td>Final</td></tr>
  <tr><td>237</td><td><a href="zip-0237">Network Sustainability Mechanism: Halving-Preserving Issuance</a></td><td>Final</td></tr>
  <tr><td>254</td><td><a href="zip-0254">Deployment of the NU7 Network Upgrade (Withdrawn)</a></td><td>Withdrawn</td></tr>
  <tr><td>259</td><td><a href="zip-0259">Deployment of the NU7 Network Upgrade</a></td><td>Final</td></tr>
  <tr><td>2003</td><td><a href="zip-2003">Disallow version 4 transactions</a></td><td>Final</td></tr>
  <tr><td>2008</td><td><a href="zip-2008">Update to FS_FPF_ZCG_H3 address list</a></td><td>Final</td></tr>
  <tr><td>2009</td><td><a href="zip-2009">Reduce Marginal Fee to 1000 Zatoshis</a></td><td>Proposed</td></tr>
</table>
`;

const LEGACY_CANDIDATE_HTML = `
<section id="nu7-candidate-zips">
  <a href="zip-0226">ZIP 226</a>
  <a href="zip-0235">ZIP 235</a>
</section>
<table>
  <tr><th>ZIP</th><th>Title</th><th>Status</th></tr>
  <tr><td>226</td><td><a href="zip-0226">Transfer and Burn of Zcash Shielded Assets</a></td><td>Draft</td></tr>
  <tr><td>235</td><td><a href="zip-0235">Remove 60% of Transaction Fees From Circulation</a></td><td>Draft</td></tr>
  <tr><td>200</td><td><a href="zip-0200">Network Upgrade Mechanism</a></td><td>Final</td></tr>
</table>
`;

describe("parseZipsIndex NU7 tagging", () => {
  it("tags settled NU7 ZIPs when upstream uses #settled-mainnet-network-upgrade", () => {
    const zips = parseZipsIndex(SETTLED_NU7_HTML);
    const nu7Nums = zips
      .filter((z) => z.tags.includes("nu7"))
      .map((z) => z.num)
      .sort((a, b) => a - b);

    expect(nu7Nums).toEqual([207, 214, 218, 235, 237, 259, 2003, 2008]);
  });

  it("does not tag withdrawn ZIP 254 or non-NU7 proposed ZIP 2009 as nu7", () => {
    const zips = parseZipsIndex(SETTLED_NU7_HTML);
    const byNum = new Map(zips.map((z) => [z.num, z]));

    expect(byNum.get(254)?.tags).not.toContain("nu7");
    expect(byNum.get(2009)?.tags).not.toContain("nu7");
  });

  it("still honors legacy #nu7-candidate-zips sections when present", () => {
    const zips = parseZipsIndex(LEGACY_CANDIDATE_HTML);
    const nu7Nums = zips
      .filter((z) => z.tags.includes("nu7"))
      .map((z) => z.num)
      .sort((a, b) => a - b);

    expect(nu7Nums).toEqual([226, 235]);
  });
});


/**
 * Unit tests for the wallet-directory parser
 * (site/Using_Zcash/Wallets.md).
 */

import { parseMarkdown } from "../parseMarkdown";

const md = `
## [Active](https://active.example)
![logo](/img/a.webp "Active")
- Devices: Mobile
- Pools: Transparent | Sapling | Orchard | Ironwood
- NU7: Compatible
- Stage: Beta

---

## [Gone](https://gone.example)
- Devices: Desktop
- Status: Deprecated | End-of-life: halted before NU6.3 | use Zallet

---

## [Bare](https://bare.example)
- Status: Deprecated
`;

describe("parseMarkdown", () => {
  const [active, gone, bare] = parseMarkdown(md);

  it("reads NU7 compatibility and the release stage", () => {
    expect(active.stage).toBe("Beta");
    expect(active.status).toBe("");
    expect(active.statusReason).toBe("");
    expect(active.nu7).toBe("Compatible");
    expect(active.pools).toEqual([
      "Transparent",
      "Sapling",
      "Orchard",
      "Ironwood",
    ]);
  });

  it("keeps the complete deprecation reason", () => {
    expect(gone.status).toBe("Deprecated");
    expect(gone.statusReason).toBe(
      "End-of-life: halted before NU6.3 | use Zallet"
    );
  });

  it("accepts a status with no reason", () => {
    expect(bare.status).toBe("Deprecated");
    expect(bare.statusReason).toBe("");
  });

  it("reads all NU7 compatibility values", () => {
    const statuses = [
      "Compatible",
      "Compatible for Transparent ZEC",
      "In Progress",
      "Not Ready",
      "Not Verified",
    ];

    statuses.forEach((status) => {
      const result = parseMarkdown(`
## [Test](https://example.com)
- NU7: ${status}
      `);

      expect(result[0].nu7).toBe(status);
    });
  });
});

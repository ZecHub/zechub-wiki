/**
 * Unit tests for the wallet-directory parser (site/Using_Zcash/Wallets.md).
 */

import { parseMarkdown } from "../parseMarkdown";

const md = `
## [Active](https://active.example)
![logo](/img/a.webp "Active")
- Devices: Mobile
- Pools: Transparent | Sapling | Orchard | Ironwood
- Ironwood: Ready
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

  it("reads the Stage line and leaves Status empty on an active wallet", () => {
    expect(active.stage).toBe("Beta");
    expect(active.status).toBe("");
    expect(active.statusReason).toBe("");
    expect(active.ironwood).toBe("Ready");
    expect(active.pools).toEqual(["Transparent", "Sapling", "Orchard", "Ironwood"]);
  });

  it("keeps the whole reason, including ': ' and ' | ', after the status", () => {
    expect(gone.status).toBe("Deprecated");
    expect(gone.statusReason).toBe("End-of-life: halted before NU6.3 | use Zallet");
  });

  it("accepts a status with no reason", () => {
    expect(bare.status).toBe("Deprecated");
    expect(bare.statusReason).toBe("");
  });
});

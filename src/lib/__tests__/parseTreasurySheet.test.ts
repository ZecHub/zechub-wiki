import { parseTreasuryDashboard } from "../parseTreasurySheet";

// Minimal gviz row builder: each argument is a cell value (null = blank cell).
const row = (...values: Array<string | number | null>) => ({
  c: values.map((v) => ({ v })),
});

describe("parseTreasuryDashboard — FPF array alignment", () => {
  // Alpha has both fields, Beta has a blank amount, Gamma has a blank
  // allocation. All three arrays must stay aligned with Category so the
  // dashboard (which reads them by index) shows each category's own numbers.
  const gviz = {
    table: {
      cols: [],
      rows: [
        row("FPF"),
        row("Category", "Amount (ZEC)", "Allocation"),
        row("Alpha", 100, "50%"),
        row("Beta", null, "30%"),
        row("Gamma", 25, null),
        row("Namada Treasury"), // section break ends the FPF category list
      ],
    },
  };

  const fpf = parseTreasuryDashboard(gviz as never).find(
    (o: any) => o.FPF,
  )?.FPF;

  it("keeps Category, Amount and Allocation the same length", () => {
    expect(fpf.Category).toEqual(["Alpha", "Beta", "Gamma"]);
    expect(fpf["Amount (ZEC)"]).toHaveLength(3);
    expect(fpf.Allocation).toHaveLength(3);
  });

  it("aligns each category with its own amount and allocation", () => {
    expect(fpf["Amount (ZEC)"]).toEqual([100, null, 25]);
    expect(fpf.Allocation).toEqual([50, 30, null]);
  });
});

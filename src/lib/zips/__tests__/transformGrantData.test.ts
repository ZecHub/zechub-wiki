import { transformGrantData } from "../transformGrantData";
import type { RawGrantRow } from "@/types/grants";

function makeRow(overrides: Partial<RawGrantRow>): RawGrantRow {
  return {
    Project: "Demo Grant::https://example.com",
    Grantee: "Demo Team",
    "Category (as determined by ZCG)": "Infrastructure",
    Milestone: "Milestone 1",
    "Amount (USD)": "$1,000",
    "Grant Status": "Completed",
    ...overrides,
  };
}

describe("transformGrantData status aggregation and milestone sorting", () => {
  it("merges a later Open milestone status onto an earlier Completed row", () => {
    const [grant] = transformGrantData([
      makeRow({ Milestone: "Milestone 1", "Grant Status": "Completed" }),
      makeRow({ Milestone: "Milestone 2", "Grant Status": "Open" }),
    ]);

    expect(grant.status).toBe("Open");
  });

  it("lets a later Cancelled milestone override earlier Completed or Open rows", () => {
    const [afterCompleted] = transformGrantData([
      makeRow({ Milestone: "Milestone 1", "Grant Status": "Completed" }),
      makeRow({ Milestone: "Milestone 2", "Grant Status": "Cancelled" }),
    ]);
    const [afterOpen] = transformGrantData([
      makeRow({ Milestone: "Milestone 1", "Grant Status": "Open" }),
      makeRow({ Milestone: "Milestone 2", "Grant Status": "Cancelled" }),
    ]);

    expect(afterCompleted.status).toBe("Cancelled");
    expect(afterOpen.status).toBe("Cancelled");
  });

  it("keeps Cancelled when a subsequent row is Open or Completed", () => {
    const [grant] = transformGrantData([
      makeRow({ Milestone: "Milestone 1", "Grant Status": "Cancelled" }),
      makeRow({ Milestone: "Milestone 2", "Grant Status": "Open" }),
      makeRow({ Milestone: "Milestone 3", "Grant Status": "Completed" }),
    ]);

    expect(grant.status).toBe("Cancelled");
  });

  it("keeps Completed only when every milestone row is Completed", () => {
    const [grant] = transformGrantData([
      makeRow({ Milestone: "Milestone 1", "Grant Status": "Completed" }),
      makeRow({ Milestone: "Milestone 2", "Grant Status": "Completed" }),
    ]);

    expect(grant.status).toBe("Completed");
  });

  it("preserves relative order of multiple non-numeric milestones after numeric ones", () => {
    const [grant] = transformGrantData([
      makeRow({ Milestone: "Kickoff" }),
      makeRow({ Milestone: "Milestone 2" }),
      makeRow({ Milestone: "Final Report" }),
      makeRow({ Milestone: "Milestone 1" }),
      makeRow({ Milestone: "Bonus" }),
    ]);

    expect(grant.milestones.map((m) => m.label)).toEqual([
      "Milestone 1",
      "Milestone 2",
      "Kickoff",
      "Final Report",
      "Bonus",
    ]);
  });
});

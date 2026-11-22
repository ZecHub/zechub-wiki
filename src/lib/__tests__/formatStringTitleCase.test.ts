/**
 * Unit tests for formatString.titleCase.
 *
 * helpers.ts imports authAndFetch (which pulls in next/cache), so mock that
 * module to keep this a pure unit test, the same way breadcrumbs.test.ts does.
 */

jest.mock("../authAndFetch", () => ({
  getRootCached: jest.fn(async () => []),
}));

import { formatString } from "../helpers";

describe("formatString.titleCase", () => {
  it("capitalizes the first character and keeps the rest", () => {
    expect(formatString.titleCase("shielded")).toBe("Shielded");
    expect(formatString.titleCase("multi word value")).toBe(
      "Multi word value",
    );
  });

  it("leaves an already-capitalized string unchanged", () => {
    expect(formatString.titleCase("Zcash")).toBe("Zcash");
  });

  it("returns an empty string instead of throwing on empty input", () => {
    // `""[0]` is undefined, so the previous implementation threw
    // "Cannot read properties of undefined (reading 'toUpperCase')".
    expect(() => formatString.titleCase("")).not.toThrow();
    expect(formatString.titleCase("")).toBe("");
  });
});

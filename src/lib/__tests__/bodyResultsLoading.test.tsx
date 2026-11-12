import React, { StrictMode } from "react";
import { act, renderHook } from "@testing-library/react";
import type { SearchIndex } from "@/lib/search/client";

let mockLocale = "en";
jest.mock("next-intl", () => ({ useLocale: () => mockLocale }));
jest.mock("@/lib/search/client", () => ({
  ...jest.requireActual("@/lib/search/client"),
  loadIndex: jest.fn(),
}));

const { useBodyResults } = require("@/components/SearchBar/useBodyResults");
const { loadIndex } = require("@/lib/search/client");

const index: SearchIndex = {
  v: 1,
  locale: "en",
  generated: "2026-10-08T00:00:00Z",
  docs: [
    ["Heartwood", "/zcash-tech/heartwood", "FlyClient body-only text."],
    ["Orchard", "/zcash-tech/orchard", "Orchard body-only text."],
  ],
  terms: { flyclient: [0], orchard: [1] },
  titles: { heartwood: [0], orchard: [1] },
  aliases: {},
};

function deferred() {
  let resolve!: (value: SearchIndex | null) => void;
  const promise = new Promise<SearchIndex | null>((done) => { resolve = done; });
  return { promise, resolve };
}

beforeEach(() => {
  mockLocale = "en";
  loadIndex.mockReset();
});

describe("body search index loading", () => {
  it.each([false, true])("delivers the first delayed response (StrictMode: %s)", async (strict) => {
    const pending = deferred();
    loadIndex.mockReturnValue(pending.promise);
    const wrapper = strict
      ? ({ children }: { children: React.ReactNode }) => <StrictMode>{children}</StrictMode>
      : undefined;
    const { result } = renderHook(() => useBodyResults("flyclient", []), { wrapper });

    expect(result.current).toEqual([]);
    await act(async () => { pending.resolve(index); });
    expect(result.current.map((hit: { name: string }) => hit.name)).toEqual(["Heartwood"]);
  });

  it("uses the current query when it changes before the index arrives", async () => {
    const pending = deferred();
    loadIndex.mockReturnValue(pending.promise);
    const { result, rerender } = renderHook(({ query }) => useBodyResults(query, []), {
      initialProps: { query: "flyclient" },
    });
    rerender({ query: "orchard" });
    await act(async () => { pending.resolve(index); });
    expect(result.current.map((hit: { name: string }) => hit.name)).toEqual(["Orchard"]);
  });

  it("does not load an index for an empty query", () => {
    const { result } = renderHook(() => useBodyResults("", []));
    expect(result.current).toEqual([]);
    expect(loadIndex).not.toHaveBeenCalled();
  });

  it("does not expose the previous locale while the new index is pending", async () => {
    const english = deferred();
    const spanish = deferred();
    loadIndex.mockImplementation((locale: string) => locale === "en" ? english.promise : spanish.promise);
    const { result, rerender } = renderHook(() => useBodyResults("flyclient", []));
    await act(async () => { english.resolve(index); });
    expect(result.current[0].name).toBe("Heartwood");

    mockLocale = "es";
    rerender();
    expect(result.current).toEqual([]);
    await act(async () => {
      spanish.resolve({ ...index, locale: "es", docs: [["Corazon", "/zcash-tech/heartwood", "FlyClient"], index.docs[1]] });
    });
    expect(result.current[0].name).toBe("Corazon");
  });

  it("ignores an old locale response that arrives after switching", async () => {
    const english = deferred();
    const spanish = deferred();
    loadIndex.mockImplementation((locale: string) => locale === "en" ? english.promise : spanish.promise);
    const { result, rerender } = renderHook(() => useBodyResults("flyclient", []));
    mockLocale = "es";
    rerender();
    await act(async () => { english.resolve(index); });
    expect(result.current).toEqual([]);
    await act(async () => {
      spanish.resolve({ ...index, locale: "es", docs: [["Corazon", "/zcash-tech/heartwood", "FlyClient"], index.docs[1]] });
    });
    expect(result.current[0].name).toBe("Corazon");
  });

  it("clears a pending query and can use the cached promise after reopening", async () => {
    const pending = deferred();
    loadIndex.mockReturnValue(pending.promise);
    const { result, rerender } = renderHook(({ query }) => useBodyResults(query, []), {
      initialProps: { query: "flyclient" },
    });
    rerender({ query: "" });
    await act(async () => { pending.resolve(index); });
    expect(result.current).toEqual([]);
    rerender({ query: "flyclient" });
    await act(async () => {});
    expect(result.current[0].name).toBe("Heartwood");
  });

  it("can remount while the shared loader promise is still pending", async () => {
    const pending = deferred();
    loadIndex.mockReturnValue(pending.promise);
    const first = renderHook(() => useBodyResults("flyclient", []));
    first.unmount();
    const second = renderHook(() => useBodyResults("flyclient", []));
    await act(async () => { pending.resolve(index); });
    expect(second.result.current[0].name).toBe("Heartwood");
  });

  it("keeps title results out of the appended body list", async () => {
    const pending = deferred();
    loadIndex.mockReturnValue(pending.promise);
    const shown = [{ name: "Heartwood", url: "/en/zcash-tech/heartwood", desc: "Title result" }];
    const { result } = renderHook(() => useBodyResults("flyclient", shown));
    await act(async () => { pending.resolve(index); });
    expect(result.current).toEqual([]);
  });

  it("returns no body results when the index is missing", async () => {
    loadIndex.mockResolvedValue(null);
    const empty = renderHook(() => useBodyResults("flyclient", []));
    await act(async () => {});
    expect(empty.result.current).toEqual([]);
  });
});

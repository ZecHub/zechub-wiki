import {
  MODULE_PARAM,
  QUIZ_PARAM,
  QUIZ_SECTIONS,
  resolveVisualizerRoute,
  visualizerHref,
  visualizerQuery,
} from "@/lib/visualizerRouting";

// The ids the hub actually renders, including the four modules the brief
// calls out and the one with mixed-case spelling.
const IDS = [
  "zcash-wallet",
  "pool",
  "frost-multisig",
  "privacy-use-cases",
  "governance",
  "zechub-bounties",
  "dao-proposal",
  "CrossLink-Protocol",
] as const;

const params = (search: string) => new URLSearchParams(search);

describe("resolveVisualizerRoute", () => {
  it("opens the hub when there is no query string", () => {
    expect(resolveVisualizerRoute(params(""), IDS)).toEqual({
      module: null,
      quiz: null,
      canonical: true,
    });
  });

  it("opens a module directly from its id", () => {
    // Direct loading of a shared link: /visualizer?module=frost-multisig
    expect(
      resolveVisualizerRoute(params("?module=frost-multisig"), IDS),
    ).toEqual({ module: "frost-multisig", quiz: null, canonical: true });
  });

  it.each([
    "frost-multisig",
    "zechub-bounties",
    "dao-proposal",
    "privacy-use-cases",
  ])("resolves %s, which previously had no URL of its own", (id) => {
    const route = resolveVisualizerRoute(params(`?${MODULE_PARAM}=${id}`), IDS);

    expect(route.module).toBe(id);
    expect(route.canonical).toBe(true);
    // And the same id survives a round trip, which is what makes a reload and
    // the back button land on the same visualizer.
    expect(visualizerQuery(route)).toBe(`?${MODULE_PARAM}=${id}`);
    expect(resolveVisualizerRoute(params(visualizerQuery(route)), IDS)).toEqual(
      route,
    );
  });

  it("returns to the hub for an unknown id, and marks the URL for replacing", () => {
    const route = resolveVisualizerRoute(
      params("?module=not-a-visualizer"),
      IDS,
    );

    expect(route).toEqual({ module: null, quiz: null, canonical: false });
    // Replacing with this href drops the dead id rather than keeping it in the
    // address bar.
    expect(visualizerHref("/visualizer", route)).toBe("/visualizer");
  });

  it.each(["", "   ", "../../etc/passwd", "<script>", "0", "null"])(
    "treats %p as no module rather than rendering nothing",
    (value) => {
      const route = resolveVisualizerRoute(
        params(`?${MODULE_PARAM}=${encodeURIComponent(value)}`),
        IDS,
      );

      expect(route.module).toBeNull();
    },
  );

  it("accepts a mis-cased id and canonicalises its spelling", () => {
    const route = resolveVisualizerRoute(
      params("?module=crosslink-protocol"),
      IDS,
    );

    expect(route.module).toBe("CrossLink-Protocol");
    // Not canonical, so the hub rewrites the address to the real spelling.
    expect(route.canonical).toBe(false);
    expect(visualizerHref("/visualizer", route)).toBe(
      "/visualizer?module=CrossLink-Protocol",
    );
  });

  it.each(QUIZ_SECTIONS)("opens the %s quiz from the URL", (section) => {
    expect(resolveVisualizerRoute(params(`?quiz=${section}`), IDS)).toEqual({
      module: null,
      quiz: section,
      canonical: true,
    });
  });

  it("ignores an unknown quiz section", () => {
    expect(resolveVisualizerRoute(params("?quiz=expert"), IDS)).toEqual({
      module: null,
      quiz: null,
      canonical: false,
    });
  });

  it("prefers the module when a module and a quiz are both present", () => {
    // A quiz only exists on the hub, so the two cannot show at once.
    const route = resolveVisualizerRoute(
      params("?module=governance&quiz=basic"),
      IDS,
    );

    expect(route).toEqual({
      module: "governance",
      quiz: null,
      canonical: false,
    });
  });

  it("treats missing search params as the hub", () => {
    expect(resolveVisualizerRoute(null, IDS)).toEqual({
      module: null,
      quiz: null,
      canonical: true,
    });
    expect(resolveVisualizerRoute(undefined, IDS)).toEqual({
      module: null,
      quiz: null,
      canonical: true,
    });
  });
});

describe("visualizerQuery / visualizerHref", () => {
  it("leaves the hub as a bare path", () => {
    expect(visualizerQuery({})).toBe("");
    expect(visualizerQuery({ module: null, quiz: null })).toBe("");
    expect(visualizerHref("/visualizer", {})).toBe("/visualizer");
  });

  it("writes the module and the quiz params", () => {
    expect(visualizerQuery({ module: "governance" })).toBe(
      `?${MODULE_PARAM}=governance`,
    );
    expect(visualizerQuery({ quiz: "advanced" })).toBe(
      `?${QUIZ_PARAM}=advanced`,
    );
  });

  it("keeps the locale-prefixed path the router gives it", () => {
    expect(visualizerHref("/es/visualizer", { module: "pool" })).toBe(
      "/es/visualizer?module=pool",
    );
  });

  it("encodes the value so a stray character cannot break the URL", () => {
    expect(visualizerQuery({ module: "a b&c=d" })).toBe(
      `?${MODULE_PARAM}=a%20b%26c%3Dd`,
    );
  });
});

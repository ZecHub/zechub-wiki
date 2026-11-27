import {
  MAINNET_ERAS,
  SAPLING_ACTIVATION_HEIGHT,
  eraAt,
  estimateHeight,
  findLastBlockBefore,
  shiftHeight,
  toUnixTime,
  type BlockEra,
  type FoundBlock,
} from "../walletBirthday";

const DAY = 86_400;

// Deterministic PRNG (mulberry32), so the fake chains are the same every run.
function rng(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Chain = { times: number[]; eras: BlockEra[]; tip: number };

// A short chain with the three mainnet spacings. Block intervals are
// exponential, as with real mining, and header times are jittered by up to
// half a block, so a block can look older than its parent.
function fakeChain(seed: number, tip = 20_000): Chain {
  const random = rng(seed);
  const spacing = (h: number) => (h >= 12_000 ? 25 : h >= 4_000 ? 75 : 150);
  const times = [1_000_000];
  let mined = times[0];
  for (let h = 1; h <= tip; h++) {
    mined += -Math.log(1 - random()) * spacing(h);
    times.push(Math.round(mined + (random() - 0.5) * spacing(h)));
  }
  const eras = [
    { name: "Launch", height: 0, time: times[0], spacing: 150 },
    { name: "Blossom", height: 4_000, time: times[4_000], spacing: 75 },
    { name: "NU7", height: 12_000, time: times[12_000], spacing: 25 },
  ];
  return { times, eras, tip };
}

function lookupOn(chain: Chain, { confirmations = true } = {}) {
  return async (height: number): Promise<FoundBlock | null> =>
    height < 0 || height > chain.tip
      ? null
      : { height, timestamp: chain.times[height], confirmations: confirmations ? chain.tip - height + 1 : null };
}

function expectLastBefore(chain: Chain, target: number, height: number) {
  expect(chain.times[height]).toBeLessThan(target);
  if (height < chain.tip) expect(chain.times[height + 1]).toBeGreaterThanOrEqual(target);
}

describe("mainnet constants", () => {
  it("use the consensus target spacings and activation heights", () => {
    // ZIP 208: 150 s before Blossom, 75 s after. ZIP 206: Blossom at 653,600.
    // ZIP 218: 25 s after NU7. ZIP 259: NU7 at 3,543,405.
    expect(MAINNET_ERAS.map(({ name, height, spacing }) => ({ name, height, spacing }))).toEqual([
      { name: "Launch", height: 0, spacing: 150 },
      { name: "Blossom", height: 653_600, spacing: 75 },
      { name: "NU7", height: 3_543_405, spacing: 25 },
    ]);
    // ZIP 205.
    expect(SAPLING_ACTIVATION_HEIGHT).toBe(419_200);
  });

  it("start each era at its first block's header time", () => {
    expect(MAINNET_ERAS.map((era) => new Date(era.time * 1000).toISOString())).toEqual([
      "2016-10-28T07:56:00.000Z",
      "2019-12-11T21:50:05.000Z",
      "2026-11-06T02:34:02.000Z",
    ]);
  });

  it("find the era of a height", () => {
    expect(eraAt(0).name).toBe("Launch");
    expect(eraAt(653_599).name).toBe("Launch");
    expect(eraAt(653_600).name).toBe("Blossom");
    expect(eraAt(3_543_404).name).toBe("Blossom");
    expect(eraAt(3_543_405).name).toBe("NU7");
  });
});

describe("estimateHeight", () => {
  const [launch, blossom, nu7] = MAINNET_ERAS;

  it("counts blocks at each era's target spacing", () => {
    expect(estimateHeight(launch.time)).toBe(0);
    expect(estimateHeight(launch.time + 1_000 * 150)).toBe(1_000);
    expect(estimateHeight(blossom.time)).toBe(653_600);
    expect(estimateHeight(blossom.time + 1_000 * 75 + 74)).toBe(654_600);
    expect(estimateHeight(nu7.time)).toBe(3_543_405);
    expect(estimateHeight(nu7.time + 1_000 * 25)).toBe(3_544_405);
  });

  it("stays in an era until the next one starts", () => {
    // Blocks before Blossom averaged a little over 150 s, so counting from
    // launch reaches 653,599 a few days before Blossom activated.
    expect(estimateHeight(blossom.time - 1)).toBe(653_599);
    expect(estimateHeight(nu7.time - 1)).toBe(3_543_404);
  });

  it("does not go below block 0", () => {
    expect(estimateHeight(launch.time - DAY)).toBe(0);
  });
});

describe("shiftHeight", () => {
  it("moves one day of blocks in each era", () => {
    expect(shiftHeight(400_000, -DAY)).toBe(400_000 - 576);
    expect(shiftHeight(2_000_000, -DAY)).toBe(2_000_000 - 1_152);
    expect(shiftHeight(3_600_000, -DAY)).toBe(3_600_000 - 3_456);
    expect(shiftHeight(2_000_000, DAY)).toBe(2_000_000 + 1_152);
  });

  it("uses each era's spacing across an upgrade", () => {
    // 12 hours of 25 s blocks after NU7, then 12 hours of 75 s blocks before it.
    expect(shiftHeight(3_543_405 + 1_728, -DAY)).toBe(3_543_405 - 576);
    // 10 blocks of 150 s up to Blossom, then 10 of 75 s.
    expect(shiftHeight(653_590, 10 * 150 + 10 * 75)).toBe(653_610);
  });

  it("rounds a backward move to the earlier block and stops at block 0", () => {
    expect(shiftHeight(2_000_000, -1)).toBe(1_999_999);
    expect(shiftHeight(2_000_000, 0)).toBe(2_000_000);
    expect(shiftHeight(100, -DAY)).toBe(0);
  });
});

describe("toUnixTime", () => {
  it("reads a date as the start of that day", () => {
    expect(toUnixTime("2024-03-15", "", "utc")).toBe(Date.UTC(2024, 2, 15) / 1000);
    expect(toUnixTime("2024-03-15", "", "local")).toBe(new Date(2024, 2, 15).getTime() / 1000);
  });

  it("adds an optional time, with or without seconds", () => {
    expect(toUnixTime("2024-03-15", "14:30", "utc")).toBe(Date.UTC(2024, 2, 15, 14, 30) / 1000);
    expect(toUnixTime("2024-03-15", "14:30:15", "utc")).toBe(Date.UTC(2024, 2, 15, 14, 30, 15) / 1000);
    expect(toUnixTime(" 2024-03-15 ", " 14:30 ", "local")).toBe(new Date(2024, 2, 15, 14, 30).getTime() / 1000);
  });

  it("rejects dates and times that do not exist", () => {
    expect(toUnixTime("2023-02-29", "", "utc")).toBeNull();
    expect(toUnixTime("2024-04-31", "", "local")).toBeNull();
    expect(toUnixTime("2024-13-01", "", "utc")).toBeNull();
    expect(toUnixTime("2024-03-15", "24:00", "utc")).toBeNull();
    expect(toUnixTime("2024-03-15", "9:30", "utc")).toBeNull();
    expect(toUnixTime("15/03/2024", "", "utc")).toBeNull();
    expect(toUnixTime("", "", "utc")).toBeNull();
  });
});

describe("findLastBlockBefore", () => {
  it("finds the last block before the target in a few lookups", async () => {
    const random = rng(7);
    const counts: number[] = [];
    for (const seed of [1, 2, 3]) {
      const chain = fakeChain(seed);
      const lookup = lookupOn(chain);
      const first = chain.times[0];
      const last = chain.times[chain.tip];
      for (let i = 0; i < 100; i++) {
        const target = Math.floor(first + 1 + random() * (last - first));
        const result = await findLastBlockBefore(target, lookup, { eras: chain.eras });
        expect(result.exact).toBe(true);
        expect(result.block.timestamp).toBe(chain.times[result.block.height]);
        expectLastBefore(chain, target, result.block.height);
        counts.push(result.lookups);
      }
    }
    expect(Math.max(...counts)).toBeLessThanOrEqual(14);
    expect(counts.reduce((sum, n) => sum + n, 0) / counts.length).toBeLessThan(9);
  });

  it("does not count a block mined exactly at the target", async () => {
    const chain = fakeChain(4);
    const height = 15_000;
    const target = chain.times[height];
    const result = await findLastBlockBefore(target, lookupOn(chain), { eras: chain.eras });
    expect(result.block.height).not.toBe(height);
    expectLastBefore(chain, target, result.block.height);
  });

  it("returns the tip for a time after the newest block", async () => {
    const chain = fakeChain(5);
    const target = Math.max(...chain.times) + 3_600;
    const result = await findLastBlockBefore(target, lookupOn(chain), { eras: chain.eras });
    expect(result).toEqual({ block: expect.objectContaining({ height: chain.tip }), lookups: expect.any(Number), exact: true });
    expect(result.lookups).toBeLessThanOrEqual(4);
  });

  it("walks back when the first guess is past the tip and confirmations are unknown", async () => {
    // The chain runs at half speed, so the first guess is far past the tip.
    const chain = fakeChain(6);
    chain.eras = chain.eras.map((era) => ({ ...era, spacing: era.spacing / 2 }));
    const target = chain.times[chain.tip - 500];
    const calls: number[] = [];
    const lookup = lookupOn(chain, { confirmations: false });
    const result = await findLastBlockBefore(target, (height) => (calls.push(height), lookup(height)), {
      eras: chain.eras,
      maxLookups: 40,
    });
    expect(calls[0]).toBeGreaterThan(chain.tip);
    expect(result.exact).toBe(true);
    expectLastBefore(chain, target, result.block.height);
  });

  it("needs a couple of lookups when mainnet runs exactly on schedule", async () => {
    const tip = 3_600_000;
    const onSchedule = async (height: number): Promise<FoundBlock | null> => {
      if (height > tip) return null;
      const era = eraAt(height);
      return { height, timestamp: era.time + (height - era.height) * era.spacing, confirmations: tip - height + 1 };
    };
    const result = await findLastBlockBefore(Date.UTC(2024, 2, 15) / 1000, onSchedule);
    // 653,600 + floor((2024-03-15T00:00Z - Blossom activation) / 75 s)
    expect(result.block.height).toBe(2_445_063);
    expect(result.lookups).toBeLessThanOrEqual(2);
  });

  it("keeps a block from before the target when the lookup budget runs out", async () => {
    const chain = fakeChain(8);
    const target = chain.times[9_000] + 10;
    const result = await findLastBlockBefore(target, lookupOn(chain), { eras: chain.eras, maxLookups: 2 });
    expect(result.lookups).toBe(2);
    expect(result.exact).toBe(false);
    expect(result.block.timestamp).toBeLessThan(target);
  });

  it("rejects a time that is not after the first block", async () => {
    const chain = fakeChain(9);
    await expect(findLastBlockBefore(chain.times[0], lookupOn(chain), { eras: chain.eras })).rejects.toThrow(RangeError);
  });

  it("passes lookup errors on", async () => {
    const failing = async (): Promise<FoundBlock | null> => {
      throw new Error("CipherScan did not respond.");
    };
    await expect(findLastBlockBefore(Date.UTC(2024, 0, 1) / 1000, failing)).rejects.toThrow("CipherScan did not respond.");
  });

  it("fails when no height returns a block", async () => {
    const empty = async (): Promise<FoundBlock | null> => null;
    await expect(findLastBlockBefore(Date.UTC(2024, 0, 1) / 1000, empty)).rejects.toThrow("No block was found");
  });
});

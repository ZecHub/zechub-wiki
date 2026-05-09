"use client";

import { useState } from "react";
import {
  Assumptions,
  BaselineStrip,
  BodyText,
  ChartCard,
  LineChart,
  Legend,
  PeerReviewNotice,
  SandboxDisclaim,
  SandboxLayout,
  SbCard,
  Slider,
  fmtZec,
} from "./shared";

const BLOCKS_PER_YEAR = 420_480; // 75s blocks
const HALVING_INTERVAL_BLOCKS = 1_680_000; // ~4 years
const POST_NU6_SUBSIDY = 1.5625; // ZEC/block (post-NU6 halving)
const MAX_MONEY = 21_000_000;
const ISSUED_NOW = 16.8e6;
const RESERVE_NOW = MAX_MONEY - ISSUED_NOW; // ~4.2M

// Today's halving step-function: subsidy halves every HALVING_INTERVAL_BLOCKS
function todaySubsidy(blocksFromNow: number): number {
  // We're already mid-cycle; for projection assume the next halving is one full
  // interval out, then halve every interval afterwards.
  const halvingsAhead = Math.floor(blocksFromNow / HALVING_INTERVAL_BLOCKS);
  return POST_NU6_SUBSIDY / Math.pow(2, halvingsAhead);
}

// ZIP 234 smoothed issuance: pick decay constant λ so that the ∫₀^∞ subsidy(h) dh
// approximately equals the remaining money reserve. This matches the ZIP's stated
// goal of "same long-term issuance schedule, no discontinuities."
//
//   subsidy(h) = S₀ · exp(-λ · h)
//   ∫₀^∞ subsidy(h) dh = S₀ / λ  ≈ RESERVE_NOW
//   → λ = S₀ / RESERVE_NOW   (per block)
function smoothedSubsidy(blocksFromNow: number, recycledZec: number): number {
  // Recycling boosts the effective reserve, slowing decay.
  const effectiveReserve = RESERVE_NOW + recycledZec;
  const lambda = POST_NU6_SUBSIDY / effectiveReserve;
  return POST_NU6_SUBSIDY * Math.exp(-lambda * blocksFromNow);
}

export default function Sandbox234() {
  const [burnRate, setBurnRate] = useState(20_000); // ZEC/year burned (recycled)
  const [years, setYears] = useState(20);

  // Sample N points over [0, years]
  const N = 80;
  const xsBlocks = Array.from({ length: N }, (_, i) =>
    Math.round((i / (N - 1)) * years * BLOCKS_PER_YEAR)
  );

  const todaySubsidies = xsBlocks.map(todaySubsidy);
  // Cumulative recycled ZEC at time t = burnRate × t  (linearised)
  const smoothedSubsidies = xsBlocks.map((b) => {
    const t = b / BLOCKS_PER_YEAR;
    const recycled = burnRate * t;
    return smoothedSubsidy(b, recycled);
  });

  // Cumulative supply curves: integrate via trapezoidal rule, scaled by blocks/year
  function cumulative(subsidies: number[]): number[] {
    const out: number[] = [];
    let acc = ISSUED_NOW;
    for (let i = 0; i < subsidies.length; i++) {
      if (i === 0) {
        out.push(acc);
        continue;
      }
      const dxBlocks = xsBlocks[i] - xsBlocks[i - 1];
      const avg = (subsidies[i] + subsidies[i - 1]) / 2;
      acc += avg * dxBlocks;
      out.push(Math.min(acc, MAX_MONEY));
    }
    return out;
  }

  const cumToday = cumulative(todaySubsidies);
  const cumSmoothed = cumulative(smoothedSubsidies);

  const finalSmoothed = cumSmoothed[cumSmoothed.length - 1];
  const finalToday = cumToday[cumToday.length - 1];
  const diff = finalSmoothed - finalToday;

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-9 pt-7 pb-16">
      <SandboxDisclaim>
        ZIP 234 replaces Bitcoin-style halving cliffs with a smooth exponential decay reaching the same 21M cap. With ZIP 233 burns, recycled ZEC re-enters the future issuance schedule.
      </SandboxDisclaim>

      <PeerReviewNotice>
        The smoothing curve here uses S(h) = S₀·exp(-λ·h) with λ chosen to integrate to the remaining money reserve — a reasonable approximation of the spec's stated "same long-term schedule." If the published ZIP fixes a specific functional form, this should be matched directly. The shape and direction are correct; the absolute numbers are illustrative.
      </PeerReviewNotice>

      <BaselineStrip
        items={[
          { value: "21,000,000", caption: "MAX_MONEY (ZEC)" },
          { value: "~16.8M", caption: "issued so far" },
          { value: "~4.2M", caption: "in money reserve" },
          { value: "1.5625", caption: "ZEC/block (post-NU6)" },
          { value: "75 s", caption: "block target time" },
        ]}
      />

      <SandboxLayout
        left={
          <>
            <SbCard title="What ZIP 234 Changes">
              <BodyText>
                Today the block subsidy{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">halves every 1,680,000 blocks</strong> (~4 years). Each halving is a sharp drop, creating economic & operational discontinuities for miners and wallets.
              </BodyText>
              <BodyText className="mt-2.5">
                ZIP 234 replaces this step-function with a{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">smooth exponential decay</strong>{" "}
                that hits the same 21M cap. It also recycles ZIP 233 burns back into the schedule, slowing the decay by exactly the amount that was removed.
              </BodyText>
            </SbCard>

            <SbCard title="Parameters">
              <Slider
                label="ZIP 233 burn rate (recycled)"
                help="Voluntary ZEC burn rate per year — recycled back into future issuance under ZIP 234"
                value={burnRate}
                onChange={setBurnRate}
                min={0}
                max={100_000}
                step={1000}
                unit="ZEC/yr"
                format={(v) => v.toLocaleString()}
                minLabel="0"
                maxLabel="100k"
              />
              <Slider
                label="Time horizon"
                help="Years from now"
                value={years}
                onChange={setYears}
                min={1}
                max={50}
                step={1}
                unit="yr"
              />
            </SbCard>
          </>
        }
        right={
          <>
            <ChartCard
              caption="Block subsidy over time"
              title="Halvings (today) vs smooth decay (ZIP 234)"
              now={`${smoothedSubsidies[N - 1].toFixed(4)} ZEC/block`}
              delta={{ text: "no cliffs", kind: "good" }}
            >
              <LineChart
                series={[
                  {
                    values: todaySubsidies,
                    color: "stroke-zinc-500 dark:stroke-zinc-400",
                    dashed: true,
                  },
                  {
                    values: smoothedSubsidies,
                    color: "stroke-[#1984c7] dark:stroke-[#3fa3e0]",
                  },
                ]}
                xLabel={["now", `+${years} yr`]}
                yLabel={(v) => v.toFixed(2)}
              />
              <Legend
                items={[
                  { label: "Today (halvings)", color: "stroke-zinc-500 dark:stroke-zinc-400", dashed: true },
                  { label: "ZIP 234 (smoothed)", color: "stroke-[#1984c7] dark:stroke-[#3fa3e0]" },
                ]}
              />
            </ChartCard>

            <ChartCard
              caption="Cumulative supply"
              title="Supply curve over horizon"
              now={fmtZec(finalSmoothed, 2)}
              delta={
                Math.abs(diff) < 1000
                  ? { text: "≈ same long-term", kind: "good" }
                  : diff > 0
                    ? { text: `+${fmtZec(diff, 1)} vs today`, kind: "neutral" }
                    : { text: `${fmtZec(diff, 1)} vs today`, kind: "neutral" }
              }
            >
              <LineChart
                series={[
                  {
                    values: cumToday,
                    color: "stroke-zinc-500 dark:stroke-zinc-400",
                    dashed: true,
                  },
                  {
                    values: cumSmoothed,
                    color: "stroke-[#1984c7] dark:stroke-[#3fa3e0]",
                    fill: "fill-[#1984c7]/10 dark:fill-[#3fa3e0]/10",
                  },
                ]}
                xLabel={["now", `+${years} yr`]}
                yLabel={(v) => fmtZec(v, 0)}
                domain={{ min: ISSUED_NOW, max: MAX_MONEY }}
              />
              <Legend
                items={[
                  { label: "Today", color: "stroke-zinc-500 dark:stroke-zinc-400", dashed: true },
                  { label: "ZIP 234 + recycled", color: "stroke-[#1984c7] dark:stroke-[#3fa3e0]" },
                ]}
              />
            </ChartCard>

            <Assumptions
              items={[
                <>
                  <strong>Today's curve:</strong> step-function halvings every 1,680,000 blocks (~4 years), starting from the post-NU6 subsidy of 1.5625 ZEC/block.
                </>,
                <>
                  <strong>ZIP 234 curve:</strong> S(h) = S₀·exp(-λ·h) with λ = S₀ / (reserve + cumulative burn). This integrates to roughly the same total issuance as today's schedule — the spec's stated goal.
                </>,
                <>
                  <strong>Recycling:</strong> ZIP 233 burns at rate <em>b</em> ZEC/year are added linearly to the effective reserve, which slows the decay (more left to issue).
                </>,
                <>
                  <strong>Block time:</strong> 75 s post-Blossom = 420,480 blocks/year. Block-time variance is ignored.
                </>,
                <>
                  <strong>Hard cap respected:</strong> cumulative supply is clipped at MAX_MONEY (21M ZEC).
                </>,
              ]}
            />
          </>
        }
      />
    </div>
  );
}

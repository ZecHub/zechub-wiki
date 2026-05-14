"use client";

import { useState } from "react";
import {
  Assumptions,
  BaselineStrip,
  BodyText,
  ChartCard,
  CompareBars,
  LineChart,
  Legend,
  SandboxDisclaim,
  SandboxLayout,
  SbCard,
  Slider,
  fmtZec,
  fmtPct,
} from "./shared";

const TOTAL_SUPPLY_ZEC = 16.8e6; // ~16.8M ZEC currently issued
const ZATS_PER_ZEC = 1e8;
const BURN_FRACTION = 0.6;

export default function Sandbox235() {
  const [volume, setVolume] = useState(8000); // tx/day
  const [actions, setActions] = useState(2); // actions/tx
  const [feePerAction, setFeePerAction] = useState(5000); // zats

  const dailyFeesZats = volume * actions * feePerAction;
  const dailyBurnZats = dailyFeesZats * BURN_FRACTION;
  const dailyMinerZats = dailyFeesZats * (1 - BURN_FRACTION);
  const annualBurnZats = dailyBurnZats * 365;
  const annualBurnZec = annualBurnZats / ZATS_PER_ZEC;
  const burnPctOfSupply = (annualBurnZec / TOTAL_SUPPLY_ZEC) * 100;

  // Time-series: daily ZEC removed over 30 days at the chosen scenario
  const dailyBurnZec = dailyBurnZats / ZATS_PER_ZEC;
  const series30 = Array.from({ length: 30 }, (_, i) => dailyBurnZec * (i + 1));

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-9 pt-7 pb-16">
      <SandboxDisclaim>
        ZIP 235 burns 60% of every transaction fee. Drag sliders to explore how the size of that effect depends on network volume — at today's mainnet activity it is small; at higher volumes it becomes meaningful.
      </SandboxDisclaim>

      <BaselineStrip
        items={[
          { value: "~16.8M", caption: "ZEC issued (of 21M cap)" },
          { value: "~8,000", caption: "tx/day (14d avg)" },
          { value: "~2", caption: "logical actions/tx (typical)" },
          { value: "5,000 zats", caption: "marginal_fee (ZIP 317)" },
          { value: "60%", caption: "fee fraction burned (ZIP 235)" },
        ]}
      />

      <SandboxLayout
        left={
          <>
            <SbCard title="What ZIP 235 Changes">
              <BodyText>
                Today every transaction fee goes to the miner. ZIP 235 redirects{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">60% of fees</strong> to a burn (removed from circulation), like Ethereum's EIP-1559. Miners still receive the remaining 40%.
              </BodyText>
              <BodyText className="mt-2.5">
                The deflationary pressure scales with network usage: at today's volumes it's almost negligible, but at Ethereum-like activity it would be material.
              </BodyText>
            </SbCard>

            <SbCard title="Parameters">
              <Slider
                label="Daily TX volume"
                help="Anchored to current ~8k mainnet baseline; explore higher growth scenarios"
                value={volume}
                onChange={setVolume}
                min={2000}
                max={200000}
                step={1000}
                unit="tx/day"
                minLabel="2k"
                maxLabel="200k"
                format={(v) => v.toLocaleString()}
              />
              <Slider
                label="Avg actions per TX"
                help="Typical shielded send is 2 logical actions under ZIP 317"
                value={actions}
                onChange={setActions}
                min={1}
                max={5}
                step={1}
                unit="actions"
              />
              <Slider
                label="Avg fee per action"
                help="Current ZIP 317 marginal_fee is 5,000 zats"
                value={feePerAction}
                onChange={setFeePerAction}
                min={1000}
                max={20000}
                step={500}
                unit="zats"
                format={(v) => v.toLocaleString()}
              />
            </SbCard>
          </>
        }
        right={
          <>
            <ChartCard
              caption="Daily burn (cumulative over 30 days)"
              title="ZEC removed from circulation"
              now={`${dailyBurnZec.toFixed(3)} ZEC/day`}
              delta={{ text: `${(dailyBurnZec * 30).toFixed(2)} ZEC over 30 days`, kind: "good" }}
            >
              <LineChart
                series={[
                  {
                    values: series30,
                    color: "stroke-emerald-600 dark:stroke-emerald-400",
                    fill: "fill-emerald-500/15",
                  },
                ]}
                xLabel={["day 1", "day 30"]}
                yLabel={(v) => v.toFixed(1) + " ZEC"}
              />
              <Legend
                items={[
                  { label: "Cumulative burn", color: "stroke-emerald-600 dark:stroke-emerald-400" },
                ]}
              />
            </ChartCard>

            <ChartCard
              caption="Annualised burn vs total supply"
              title={`% of ~16.8M ZEC removed per year`}
              now={fmtPct(burnPctOfSupply, 4)}
              delta={
                burnPctOfSupply > 0.1
                  ? { text: "meaningful", kind: "good" }
                  : { text: "negligible at this volume", kind: "neutral" }
              }
            >
              <CompareBars
                todayValue={0}
                newValue={annualBurnZec}
                fmt={(v) => fmtZec(v, 1)}
                todayLabel="TODAY (no burn)"
                newLabel="ZIP 235 (per year)"
              />
            </ChartCard>

            <ChartCard
              caption="Daily fee revenue split"
              title="Miner share vs burn (zats/day)"
              now={`${(dailyMinerZats / 1e8).toFixed(4)} ZEC to miners`}
              delta={{ text: "60/40 split", kind: "neutral" }}
            >
              <CompareBars
                todayValue={dailyFeesZats}
                newValue={dailyMinerZats}
                fmt={(v) => fmtZec(v / 1e8, 4)}
                todayLabel="MINERS TODAY"
                newLabel="MINERS · ZIP 235"
              />
            </ChartCard>

            <Assumptions
              items={[
                <>
                  <strong>Burn fraction fixed at 60%:</strong> drawn directly from ZIP 235 draft. The remaining 40% goes to miners.
                </>,
                <>
                  <strong>Fee model:</strong> per-tx fee = actions × fee_per_action. Real fees include any user tip above conventional, which we ignore.
                </>,
                <>
                  <strong>Volume is held constant in time:</strong> we don't model congestion, fee bidding, or feedback effects from the burn itself.
                </>,
                <>
                  <strong>Supply baseline:</strong> ~16.8M ZEC issued (of 21M cap) as of late 2025; % comparisons use this denominator.
                </>,
                <>
                  <strong>No price effects:</strong> we report ZEC, not USD. The deflationary pressure on price is not modelled.
                </>,
              ]}
            />
          </>
        }
      />
    </div>
  );
}

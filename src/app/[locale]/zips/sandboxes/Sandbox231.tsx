"use client";

import { useState } from "react";
import {
  Assumptions,
  BaselineStrip,
  BodyText,
  ChartCard,
  CompareBars,
  SandboxDisclaim,
  SandboxLayout,
  SbCard,
  Slider,
  fmtBytes,
  fmtZats,
} from "./shared";

const BUCKETS = [0, 256, 512, 1024, 2048] as const;
function bucketize(b: number): number {
  for (const x of BUCKETS) if (b <= x) return x;
  return 2048;
}

export default function Sandbox231() {
  const [size, setSize] = useState(128); // bytes
  const [adopt, setAdopt] = useState(30); // % of txs
  const [vol, setVol] = useState(8000); // tx/day

  // Today: every output carries 512B regardless. Assume 1 output/tx avg.
  const todayBytesPerTx = 512;
  const todayDailyBytes = todayBytesPerTx * vol;

  // ZIP 231: only adopters carry memos, padded to bucket
  const padded = bucketize(size);
  const z231BytesPerTx = (adopt / 100) * padded;
  const z231DailyBytes = z231BytesPerTx * vol;

  const savedBytes = todayDailyBytes - z231DailyBytes;
  const savedPct = todayDailyBytes > 0 ? (savedBytes / todayDailyBytes) * 100 : 0;

  // Memo fee: ZIP 317 marginal_fee = 5,000 zats per logical action.
  // Each 256B of memo bundle = +1 logical action under the draft.
  const todayMemoFee = 0;
  const z231MemoFee = padded === 0 ? 0 : Math.ceil(padded / 256) * 5000;

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-9 pt-7 pb-16">
      <SandboxDisclaim>
        This explores ZIP 231 with simplified assumptions. Drag sliders to see how memo size and adoption shape the trade-offs. Real mainnet behaviour will differ; assumptions are listed below each chart.
      </SandboxDisclaim>

      <BaselineStrip
        items={[
          { value: "~8,000", caption: "tx/day (14d avg)" },
          { value: "512 B", caption: "fixed memo per output" },
          { value: "~70%", caption: "tx with no user memo" },
          { value: "5,000 zats", caption: "per logical action (ZIP 317)" },
        ]}
      />

      <SandboxLayout
        left={
          <>
            <SbCard title="What ZIP 231 Changes">
              <BodyText>
                Today every shielded output carries a fixed{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">512-byte encrypted memo</strong>
                , even when empty. This is privacy-preserving (no metadata leak) but wasteful — most txs don't use a memo.
              </BodyText>
              <BodyText className="mt-2.5">
                ZIP 231 introduces{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">memo bundles</strong>: variable-size, attached only when used. Privacy properties are preserved by padding to bucket sizes (e.g. 0 / 256 / 512 / 1024 / 2048&nbsp;B).
              </BodyText>
            </SbCard>

            <SbCard title="Parameters">
              <Slider
                label={<>Average memo size</>}
                help="Average bytes per memo, across all txs that carry one"
                value={size}
                onChange={setSize}
                min={0}
                max={2048}
                step={64}
                unit="B"
                minLabel="0 B"
                maxLabel="2048 B"
              />
              <Slider
                label={<>% of txs carrying a memo</>}
                help="Today ~30% of shielded txs use memos. ZIP 231's lower cost may increase this."
                value={adopt}
                onChange={setAdopt}
                min={0}
                max={100}
                step={5}
                unit="%"
                minLabel="0%"
                maxLabel="100%"
              />
              <Slider
                label={<>Daily TX volume</>}
                help="Held at mainnet 14-day average by default"
                value={vol}
                onChange={setVol}
                min={2000}
                max={50000}
                step={500}
                unit="tx/day"
                minLabel="2k"
                maxLabel="50k"
                format={(v) => v.toLocaleString()}
              />
            </SbCard>
          </>
        }
        right={
          <>
            <ChartCard
              caption="Bandwidth saved per day"
              title="Memo bytes carried (today vs ZIP 231)"
              now={`${fmtBytes(z231DailyBytes)}/day`}
              delta={
                savedPct > 0
                  ? { text: `↓ ${savedPct.toFixed(0)}% saved`, kind: "good" }
                  : savedPct < 0
                    ? { text: `↑ ${(-savedPct).toFixed(0)}% more`, kind: "warn" }
                    : { text: "no change", kind: "neutral" }
              }
            >
              <CompareBars todayValue={todayDailyBytes} newValue={z231DailyBytes} fmt={fmtBytes} newLabel="ZIP 231" />
            </ChartCard>

            <ChartCard
              caption="Cost per memo-bearing TX"
              title="User-borne fee for memo"
              now={fmtZats(z231MemoFee)}
              delta={
                z231MemoFee > 0
                  ? { text: `+${z231MemoFee.toLocaleString()} zats per memo`, kind: "neutral" }
                  : { text: "no memo, no cost", kind: "good" }
              }
            >
              <CompareBars todayValue={todayMemoFee} newValue={z231MemoFee} fmt={fmtZats} newLabel="ZIP 231" />
            </ChartCard>

            <Assumptions
              items={[
                <>
                  <strong>Bucket padding:</strong> ZIP 231 memo bundles are padded to {"{0, 256, 512, 1024, 2048}"} B buckets to preserve indistinguishability. Cost is computed against the next-larger bucket, not the raw size.
                </>,
                <>
                  <strong>Fee model:</strong> 5,000 zats per logical action (ZIP 317). Each 256 B of memo = +1 logical action under the draft proposal.
                </>,
                <>
                  <strong>No-memo baseline:</strong> 70% of mainnet shielded txs carry no user memo (anchored to wallet-side telemetry from major wallets, 14-day window).
                </>,
                <>
                  <strong>Volume held constant:</strong> daily TX count is independent of memo cost. Real-world adoption may shift this; we don't model the feedback loop.
                </>,
                <>
                  <strong>ZEC price held constant:</strong> all "ZEC" figures are denominated in ZEC, not USD.
                </>,
                <>
                  <strong>Privacy claim:</strong> bucket padding is taken as a given from the draft spec; this sandbox does not analyse anonymity-set effects.
                </>,
              ]}
            />
          </>
        }
      />
    </div>
  );
}

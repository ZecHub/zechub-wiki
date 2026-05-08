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
  fmtPct,
} from "./shared";

const ZEC_HOLDERS_BASELINE = 50_000;

export default function Sandbox226() {
  const [assets, setAssets] = useState(50);
  const [holdersPerAsset, setHoldersPerAsset] = useState(500);

  // Per-asset anonymity set under the "naive" framing:
  // each asset only mixes with other holders of the SAME asset.
  const perAssetSet = holdersPerAsset;

  // Pool-level anonymity: under ZIP 226, ZSAs are indistinguishable in the
  // Orchard pool from outside. The total pool size includes ZEC holders
  // PLUS all ZSA holders summed together.
  const poolSize = ZEC_HOLDERS_BASELINE + assets * holdersPerAsset;

  // Ratio: privacy "loss" if you naively assume per-asset isolation
  const naiveRatio = perAssetSet / poolSize;

  // Curve: per-asset anonymity vs asset count (other things equal)
  const N = 40;
  const xs = Array.from({ length: N }, (_, i) => Math.round(1 + (i / (N - 1)) * (assets - 1)));
  // Total pool grows with #assets; per-asset stays flat (independent of #assets)
  const perAssetCurve = xs.map(() => perAssetSet);
  const poolCurve = xs.map((a) => ZEC_HOLDERS_BASELINE + a * holdersPerAsset);

  const maxY = Math.max(...poolCurve) * 1.05;

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-9 pt-7 pb-16">
      <SandboxDisclaim>
        ZIP 226 adds multi-asset shielded notes to Orchard. The interesting trade-off is privacy: from outside the pool ZSAs are indistinguishable from ZEC, but a holder of asset X only mixes (in some senses) with other holders of X.
      </SandboxDisclaim>

      <PeerReviewNotice>
        The "anonymity set per asset" framing is a useful intuition pump but not a precise privacy claim. Under ZIP 226 the Orchard pool remains pool-shielded, and the precise anonymity-set semantics depend on adversary model. <strong>This sandbox should be read by someone with a cryptography background before being shipped to mainnet.</strong> The numbers shown are illustrative of the <em>direction</em> of the trade-off only.
      </PeerReviewNotice>

      <BaselineStrip
        items={[
          { value: "~50,000", caption: "ZEC holders (Orchard)" },
          { value: "1 asset", caption: "today (ZEC only)" },
          { value: "Pool-shielded", caption: "ZSAs hidden from outside" },
        ]}
      />

      <SandboxLayout
        left={
          <>
            <SbCard title="What ZIP 226 Changes">
              <BodyText>
                Extends Orchard with{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">multi-asset shielded notes</strong>. A single Orchard pool can carry ZEC + N other assets, with per-asset conservation rules.
              </BodyText>
              <BodyText className="mt-2.5">
                From <em>outside</em> the pool, an observer can't tell ZEC from ZSA from ZSA-of-different-kind. From <em>inside</em>, an asset-specific holder set may be smaller than the global pool — the trade-off this sandbox visualises.
              </BodyText>
            </SbCard>

            <SbCard title="Parameters">
              <Slider
                label="Distinct ZSA assets"
                help="How many different assets exist in the pool"
                value={assets}
                onChange={setAssets}
                min={1}
                max={1000}
                step={5}
                unit="assets"
                format={(v) => v.toLocaleString()}
              />
              <Slider
                label="Avg holders per asset"
                help="Realistic span: 10 (niche NFT) → 10,000 (popular stablecoin)"
                value={holdersPerAsset}
                onChange={setHoldersPerAsset}
                min={10}
                max={10_000}
                step={50}
                unit="holders"
                format={(v) => v.toLocaleString()}
              />
            </SbCard>
          </>
        }
        right={
          <>
            <ChartCard
              caption="Anonymity set comparison"
              title="Per-asset vs global Orchard pool"
              now={`${perAssetSet.toLocaleString()} per asset`}
              delta={{
                text: `${fmtPct(naiveRatio * 100, 1)} of pool size`,
                kind: naiveRatio > 0.1 ? "good" : "warn",
              }}
            >
              <LineChart
                series={[
                  {
                    values: poolCurve,
                    color: "stroke-[#1984c7] dark:stroke-[#3fa3e0]",
                    fill: "fill-[#1984c7]/10 dark:fill-[#3fa3e0]/10",
                  },
                  {
                    values: perAssetCurve,
                    color: "stroke-amber-500 dark:stroke-amber-400",
                  },
                ]}
                xLabel={["1 asset", `${assets} assets`]}
                yLabel={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${Math.round(v)}`}
                domain={{ min: 0, max: maxY }}
              />
              <Legend
                items={[
                  { label: "Global pool size", color: "stroke-[#1984c7] dark:stroke-[#3fa3e0]" },
                  { label: "Per-asset (naive view)", color: "stroke-amber-500 dark:stroke-amber-400" },
                ]}
              />
            </ChartCard>

            <ChartCard
              caption="Asset diversity over time (illustrative)"
              title="How many assets might the pool carry?"
              now={`${assets} assets`}
              delta={{ text: "scenario only", kind: "neutral" }}
            >
              <LineChart
                series={[
                  {
                    values: Array.from({ length: 30 }, (_, i) => Math.round(1 + (assets - 1) * (1 - Math.exp(-i / 8)))),
                    color: "stroke-purple-600 dark:stroke-purple-400",
                    fill: "fill-purple-500/10",
                  },
                ]}
                xLabel={["launch", "+30 mo"]}
                yLabel={(v) => `${Math.round(v)}`}
              />
              <Legend
                items={[
                  { label: "Asset count (logistic growth example)", color: "stroke-purple-600 dark:stroke-purple-400" },
                ]}
              />
            </ChartCard>

            <Assumptions
              items={[
                <>
                  <strong>Per-asset framing is illustrative, not a privacy claim.</strong> ZSAs are pool-shielded — an outside observer cannot determine which asset a transaction concerns. The "per-asset anonymity set" line is the naive worst-case, not the actual leakage.
                </>,
                <>
                  <strong>ZEC holders held at ~50k baseline</strong> as an anchor for the global pool. The real Orchard active-holder count fluctuates.
                </>,
                <>
                  <strong>Holders per asset assumed equal across assets.</strong> Real distribution is heavy-tailed; a stablecoin will dominate while NFTs may have ~1 holder each.
                </>,
                <>
                  <strong>The "diversity over time" curve is a logistic-growth illustration only</strong> — it has no empirical backing for ZSAs (which don't yet exist on mainnet).
                </>,
                <>
                  <strong>This sandbox needs cryptography review</strong> before being interpreted as advice on the privacy of ZIP 226.
                </>,
              ]}
            />
          </>
        }
      />
    </div>
  );
}

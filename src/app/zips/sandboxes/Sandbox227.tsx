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
  PeerReviewNotice,
  SandboxDisclaim,
  SandboxLayout,
  SbCard,
  Slider,
  fmtBytes,
  fmtZec,
} from "./shared";

const PER_ASSET_OVERHEAD_BYTES = 32 + 8 + 1 + 16; // asset_id + balance + flag + framing
const ISSUANCE_FEE_ZEC = 0.01;

export default function Sandbox227() {
  const [assets, setAssets] = useState(1000);
  const [descLen, setDescLen] = useState(64); // bytes

  const perAsset = PER_ASSET_OVERHEAD_BYTES + descLen;
  const stateBytes = perAsset * assets;
  const totalFeesZec = assets * ISSUANCE_FEE_ZEC;

  // Curve: state size as #assets grows (other things equal)
  const N = 40;
  const xs = Array.from({ length: N }, (_, i) => Math.round(1 + (i / (N - 1)) * (assets - 1)));
  const stateCurve = xs.map((a) => a * perAsset);

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-9 pt-7 pb-16">
      <SandboxDisclaim>
        ZIP 227 defines how new shielded assets get created. Every issued asset adds to a global state map that all nodes maintain. At scale this matters for node operators — explore the storage cost.
      </SandboxDisclaim>

      <PeerReviewNotice>
        The 0.01 ZEC issuance fee comes from the original ZIP 227 PR discussion and may have been revised in subsequent drafts. The byte-cost math is robust; the fee figure should be re-verified against the current spec before this sandbox is treated as authoritative.
      </PeerReviewNotice>

      <BaselineStrip
        items={[
          { value: "1 asset", caption: "today (ZEC only)" },
          { value: "~57 B", caption: "per-asset state (32+8+1+desc+framing)" },
          { value: "0.01 ZEC", caption: "issuance fee (per ZIP 227 PR)" },
        ]}
      />

      <SandboxLayout
        left={
          <>
            <SbCard title="What ZIP 227 Changes">
              <BodyText>
                Adds an{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">issuance mechanism for ZSAs</strong>: issuance keys, a transparent issuance map (asset_id → balance), and finalization rules.
              </BodyText>
              <BodyText className="mt-2.5">
                The interesting modelable thing is{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">global state size</strong>. Every issued asset adds an entry that all full nodes carry forever.
              </BodyText>
            </SbCard>

            <SbCard title="Parameters">
              <Slider
                label="Issued assets"
                help="From a single stablecoin to 'every NFT is its own asset'"
                value={assets}
                onChange={setAssets}
                min={1}
                max={100_000}
                step={100}
                unit="assets"
                format={(v) => v.toLocaleString()}
                minLabel="1"
                maxLabel="100k"
              />
              <Slider
                label="Avg asset_desc length"
                help="Human-readable description string. Spec allows up to 512 B; 64 B is typical."
                value={descLen}
                onChange={setDescLen}
                min={10}
                max={200}
                step={2}
                unit="B"
              />
            </SbCard>
          </>
        }
        right={
          <>
            <ChartCard
              caption="Global issuance state"
              title="Bytes per asset × asset count"
              now={fmtBytes(stateBytes)}
              delta={
                stateBytes < 1e6
                  ? { text: "negligible", kind: "good" }
                  : stateBytes < 1e8
                    ? { text: "moderate", kind: "neutral" }
                    : { text: "heavy at this scale", kind: "warn" }
              }
            >
              <LineChart
                series={[
                  {
                    values: stateCurve,
                    color: "stroke-emerald-600 dark:stroke-emerald-400",
                    fill: "fill-emerald-500/15",
                  },
                ]}
                xLabel={["1 asset", `${assets.toLocaleString()} assets`]}
                yLabel={(v) => fmtBytes(v)}
              />
              <Legend items={[{ label: "Cumulative state", color: "stroke-emerald-600 dark:stroke-emerald-400" }]} />
            </ChartCard>

            <ChartCard
              caption="Total issuance fees"
              title="ZEC paid in to issue this many assets"
              now={fmtZec(totalFeesZec, 2)}
              delta={{ text: `at 0.01 ZEC/asset`, kind: "neutral" }}
            >
              <CompareBars
                todayValue={0}
                newValue={totalFeesZec}
                fmt={(v) => fmtZec(v, 2)}
                todayLabel="TODAY"
                newLabel="ZIP 227"
              />
            </ChartCard>

            <Assumptions
              items={[
                <>
                  <strong>Per-asset state estimate:</strong> 32 B asset_id + 8 B balance + 1 B finalized flag + asset_desc bytes + ~16 B framing. Real encoding may shift this by a few bytes.
                </>,
                <>
                  <strong>Issuance fee = 0.01 ZEC/asset</strong> per the original ZIP 227 PR discussion. <em>This number should be re-verified against the current spec</em>; the byte math is independent of it.
                </>,
                <>
                  <strong>State is a flat map:</strong> we don't model index structures, witness data, or the additional cost of proving issuance.
                </>,
                <>
                  <strong>asset_desc bounds:</strong> ZIP 227 caps asset_desc; we assume average use rather than maximum allocation.
                </>,
                <>
                  <strong>Issuance is one-time:</strong> the fee is paid once at issuance, not per transfer. Fees from transfers are out of scope for this sandbox (see ZIP 235 for fee burning).
                </>,
              ]}
            />
          </>
        }
      />
    </div>
  );
}

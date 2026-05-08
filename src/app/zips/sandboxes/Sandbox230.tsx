"use client";

import { useState } from "react";
import {
  Assumptions,
  BaselineStrip,
  BodyText,
  ChartCard,
  CompareBars,
  StackedCompare,
  SandboxDisclaim,
  SandboxLayout,
  SbCard,
  Slider,
  Toggle,
  fmtBytes,
} from "./shared";

// Byte estimates from ZIP 230 / ZIP 226 / ZIP 227 / ZIP 231 drafts.
// These are common-case figures; exact sizes depend on field encoding.
const V5_BASE_BYTES = 1900; // typical Orchard-only v5 tx
const V6_HEADER_OVERHEAD = 24; // tx version + extra fields
const MEMO_BUNDLE_BYTES = 320; // 256B padded bundle + ~64B framing
const ZSA_ACTION_BYTES = 612; // per ZSA OrchardZSA action group (PR comment)
const ISSUANCE_BUNDLE_BYTES = 480; // typical issuance action + signature
const BURN_BYTES = 96; // per asset_id burn record
const TODAY_TX_VOL = 8000;

export default function Sandbox230() {
  const [memoBundle, setMemoBundle] = useState(false);
  const [issuance, setIssuance] = useState(false);
  const [burn, setBurn] = useState(false);
  const [zsaActions, setZsaActions] = useState(0);

  const memoSeg = memoBundle ? MEMO_BUNDLE_BYTES : 0;
  const issuanceSeg = issuance ? ISSUANCE_BUNDLE_BYTES : 0;
  const burnSeg = burn ? BURN_BYTES : 0;
  const zsaSeg = zsaActions * ZSA_ACTION_BYTES;

  const v5Total = V5_BASE_BYTES;
  const v6Total = V5_BASE_BYTES + V6_HEADER_OVERHEAD + memoSeg + issuanceSeg + burnSeg + zsaSeg;
  const delta = v6Total - v5Total;
  const deltaPct = (delta / v5Total) * 100;

  const dailyV5 = v5Total * TODAY_TX_VOL;
  const dailyV6 = v6Total * TODAY_TX_VOL;

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-9 pt-7 pb-16">
      <SandboxDisclaim>
        ZIP 230 is the v6 transaction format that bundles ZSAs (226/227), memo bundles (231), explicit fees (2002), and quantum recoverability (2005). v6 is only larger than v5 when its optional fields are actually used — toggle features to see the per-tx size.
      </SandboxDisclaim>

      <BaselineStrip
        items={[
          { value: "~1.9 KB", caption: "typical v5 Orchard tx" },
          { value: "612 B", caption: "per ZSA action" },
          { value: "~320 B", caption: "memo bundle (padded)" },
          { value: "~480 B", caption: "issuance bundle" },
        ]}
      />

      <SandboxLayout
        left={
          <>
            <SbCard title="What ZIP 230 Changes">
              <BodyText>
                ZIP 230 is the{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">v6 transaction format</strong>
                . It's a structural envelope that adds optional bundles for ZSA transfers, ZSA issuance, asset burns, memo bundles, and explicit fees.
              </BodyText>
              <BodyText className="mt-2.5">
                A vanilla shielded send under v6 is essentially the same size as v5. The new bundles add bytes only when they're used.
              </BodyText>
            </SbCard>

            <SbCard title="Optional features">
              <Toggle
                label="Memo bundle (ZIP 231)"
                help="Adds a memo bundle field. Padded to bucket size ~320 B."
                value={memoBundle}
                onChange={setMemoBundle}
              />
              <Toggle
                label="Issuance bundle (ZIP 227)"
                help="Adds asset issuance action + signature. ~480 B."
                value={issuance}
                onChange={setIssuance}
              />
              <Toggle
                label="Asset burn (ZIP 226)"
                help="Adds burn record(s). ~96 B per burned asset."
                value={burn}
                onChange={setBurn}
              />
              <Slider
                label="ZSA action groups (ZIP 226)"
                help="OrchardZSA actions for multi-asset transfer. 612 B per action."
                value={zsaActions}
                onChange={setZsaActions}
                min={0}
                max={5}
                step={1}
                unit="actions"
              />
            </SbCard>
          </>
        }
        right={
          <>
            <ChartCard
              caption="v5 vs v6 transaction size"
              title="Stacked breakdown of v6 with selected features"
              now={fmtBytes(v6Total)}
              delta={
                delta === 0
                  ? { text: "same as v5", kind: "good" }
                  : delta > 0
                    ? { text: `+${fmtBytes(delta)} (+${deltaPct.toFixed(0)}%)`, kind: deltaPct > 50 ? "warn" : "neutral" }
                    : { text: `${fmtBytes(delta)}`, kind: "good" }
              }
            >
              <StackedCompare
                baseline={v5Total}
                segments={[
                  { label: "v5 base", value: V5_BASE_BYTES, color: "fill-zinc-500/60 dark:fill-zinc-400/60" },
                  { label: "v6 header", value: V6_HEADER_OVERHEAD, color: "fill-[#1984c7]/85 dark:fill-[#3fa3e0]/85" },
                  { label: "memo bundle", value: memoSeg, color: "fill-amber-400/85" },
                  { label: "issuance", value: issuanceSeg, color: "fill-emerald-500/85" },
                  { label: "burn", value: burnSeg, color: "fill-rose-500/85" },
                  { label: "ZSA actions", value: zsaSeg, color: "fill-purple-500/85" },
                ]}
                fmt={fmtBytes}
                labels={["v5", "v6"]}
              />
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px] text-zinc-600 dark:text-zinc-400">
                <Swatch color="bg-zinc-500/60 dark:bg-zinc-400/60" label="v5 base" />
                <Swatch color="bg-[#1984c7]/85 dark:bg-[#3fa3e0]/85" label="v6 header" />
                {memoSeg > 0 && <Swatch color="bg-amber-400/85" label="memo bundle" />}
                {issuanceSeg > 0 && <Swatch color="bg-emerald-500/85" label="issuance" />}
                {burnSeg > 0 && <Swatch color="bg-rose-500/85" label="burn" />}
                {zsaSeg > 0 && <Swatch color="bg-purple-500/85" label="ZSA actions" />}
              </div>
            </ChartCard>

            <ChartCard
              caption="Network bandwidth at 8k tx/day"
              title="Daily wire footprint if all txs use this v6 profile"
              now={fmtBytes(dailyV6) + "/day"}
              delta={
                delta === 0
                  ? { text: "no change", kind: "good" }
                  : { text: `+${fmtBytes((dailyV6 - dailyV5))}/day`, kind: deltaPct > 50 ? "warn" : "neutral" }
              }
            >
              <CompareBars
                todayValue={dailyV5}
                newValue={dailyV6}
                fmt={fmtBytes}
                todayLabel="v5 · today"
                newLabel="v6 · this profile"
              />
            </ChartCard>

            <Assumptions
              items={[
                <>
                  <strong>Byte estimates from drafts:</strong> v5 base ≈ 1.9 KB; v6 header overhead ≈ 24 B; ZSA action ≈ 612 B (PR comment); issuance bundle ≈ 480 B; burn record ≈ 96 B; memo bundle ≈ 320 B (256 B padded payload + framing).
                </>,
                <>
                  <strong>v5 baseline assumes a typical Orchard-only shielded send.</strong> Multi-action shielded txs are larger; we don't vary v5 here because it's the baseline of comparison.
                </>,
                <>
                  <strong>Network bandwidth uses 8k tx/day uniformly.</strong> "If <em>every</em> tx had this v6 profile" — in practice the mix will vary.
                </>,
                <>
                  <strong>Final encoding may shift by tens of bytes.</strong> Optional witness data, signature hashing changes, and field alignment can move numbers a little; orders of magnitude are correct.
                </>,
                <>
                  <strong>Quantum recoverability fields (ZIP 2005) and explicit fees (ZIP 2002) are part of the v6 header overhead estimate; not separately toggled.</strong>
                </>,
              ]}
            />
          </>
        }
      />
    </div>
  );
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block w-3 h-3 rounded-sm ${color}`} />
      {label}
    </span>
  );
}

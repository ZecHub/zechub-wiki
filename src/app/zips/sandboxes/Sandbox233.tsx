"use client";

import { useState } from "react";
import {
  Assumptions,
  BaselineStrip,
  BodyText,
  ChartCard,
  LineChart,
  Legend,
  ScenarioPicker,
  SandboxDisclaim,
  SandboxLayout,
  SbCard,
  Slider,
  fmtZec,
} from "./shared";

type ScenarioId = "conservative" | "active" | "eth-comparable";

interface Scenario {
  id: ScenarioId;
  label: string;
  description: string;
  // % of expected new issuance burned per year
  burnPctOfIssuance: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: "conservative",
    label: "Conservative — 0.1% of fees voluntarily burned",
    description: "A small but engaged community uses the burn feature occasionally.",
    burnPctOfIssuance: 0.5,
  },
  {
    id: "active",
    label: "Active community — 2% of fees burned",
    description: "Burning becomes a recognised \"tip jar to the protocol.\"",
    burnPctOfIssuance: 5,
  },
  {
    id: "eth-comparable",
    label: "ETH-comparable — meaningful protocol-level deflation",
    description: "Burns offset a substantial fraction of new issuance.",
    burnPctOfIssuance: 25,
  },
];

const ISSUED_NOW = 16.8e6;
const MAX_MONEY = 21_000_000;
const REMAINING = MAX_MONEY - ISSUED_NOW;
// Approximate annual issuance at post-NU6 subsidy: 1.5625 ZEC × 420,480 blocks ≈ 657k ZEC/yr
const ANNUAL_ISSUANCE_NOW = 657_000;

export default function Sandbox233() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("active");
  const [years, setYears] = useState(10);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  // Annual burn = burnPct × current annual issuance (held flat for clarity)
  const annualBurn = (scenario.burnPctOfIssuance / 100) * ANNUAL_ISSUANCE_NOW;

  const N = 60;
  const xs = Array.from({ length: N }, (_, i) => (i / (N - 1)) * years);
  const cumBurn = xs.map((t) => annualBurn * t);

  const finalBurn = cumBurn[N - 1];
  const burnVsIssuance = (annualBurn / ANNUAL_ISSUANCE_NOW) * 100;
  const isNetDeflationary = annualBurn > ANNUAL_ISSUANCE_NOW;

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-9 pt-7 pb-16">
      <SandboxDisclaim>
        ZIP 233 is fundamentally about <strong>user behaviour</strong>, which we cannot predict. These are <em>scenarios</em>, not forecasts. The spec adds an opt-in voluntary burn mechanism — how much actually gets burned depends entirely on whether users choose to use it.
      </SandboxDisclaim>

      <BaselineStrip
        items={[
          { value: "Opt-in", caption: "voluntary mechanism" },
          { value: "~657k", caption: "ZEC issued per year (current)" },
          { value: "~4.2M", caption: "ZEC remaining of 21M cap" },
          { value: "0", caption: "automatic protocol burn" },
        ]}
      />

      <SandboxLayout
        left={
          <>
            <SbCard title="What ZIP 233 Changes">
              <BodyText>
                Adds an{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">opt-in mechanism</strong>{" "}
                to voluntarily burn ZEC — a "tip jar to the protocol." Nothing happens automatically; the user has to choose.
              </BodyText>
              <BodyText className="mt-2.5">
                Combined with ZIP 234, burned ZEC re-enters the future issuance schedule. The two together turn the burn into a kind of long-term endowment for the protocol.
              </BodyText>
            </SbCard>

            <SbCard title="Scenario">
              <ScenarioPicker
                options={SCENARIOS.map((s) => ({ id: s.id, label: s.label, description: s.description }))}
                value={scenarioId}
                onChange={setScenarioId}
              />
            </SbCard>

            <SbCard title="Time horizon">
              <Slider
                label="Years"
                help="How far to project the chosen scenario"
                value={years}
                onChange={setYears}
                min={1}
                max={20}
                step={1}
                unit="yr"
              />
            </SbCard>
          </>
        }
        right={
          <>
            <ChartCard
              caption="Cumulative ZEC burned"
              title={`${scenario.label.split("—")[0].trim()} scenario`}
              now={fmtZec(finalBurn, 1)}
              delta={{ text: `over ${years} years`, kind: "neutral" }}
            >
              <LineChart
                series={[
                  {
                    values: cumBurn,
                    color: "stroke-purple-600 dark:stroke-purple-400",
                    fill: "fill-purple-500/15",
                  },
                ]}
                xLabel={["now", `+${years} yr`]}
                yLabel={(v) => fmtZec(v, 1)}
              />
              <Legend items={[{ label: "Cumulative burn", color: "stroke-purple-600 dark:stroke-purple-400" }]} />
            </ChartCard>

            <ChartCard
              caption="Burn as % of new issuance"
              title="Is the burn rate net-deflationary?"
              now={`${burnVsIssuance.toFixed(1)}% of new issuance`}
              delta={
                isNetDeflationary
                  ? { text: "net deflationary", kind: "good" }
                  : burnVsIssuance > 50
                    ? { text: "near issuance", kind: "neutral" }
                    : { text: "below issuance", kind: "neutral" }
              }
            >
              <LineChart
                series={[
                  {
                    values: xs.map(() => annualBurn),
                    color: "stroke-purple-600 dark:stroke-purple-400",
                    fill: "fill-purple-500/10",
                  },
                  {
                    values: xs.map(() => ANNUAL_ISSUANCE_NOW),
                    color: "stroke-zinc-500 dark:stroke-zinc-400",
                    dashed: true,
                  },
                ]}
                xLabel={["now", `+${years} yr`]}
                yLabel={(v) => fmtZec(v, 0)}
                domain={{ min: 0, max: Math.max(annualBurn, ANNUAL_ISSUANCE_NOW) * 1.1 }}
              />
              <Legend
                items={[
                  { label: "Annual burn", color: "stroke-purple-600 dark:stroke-purple-400" },
                  { label: "Annual issuance (today)", color: "stroke-zinc-500 dark:stroke-zinc-400", dashed: true },
                ]}
              />
            </ChartCard>

            <Assumptions
              items={[
                <>
                  <strong>This is a scenario tool, not a forecast.</strong> The whole question — how much voluntary burn happens — is unmodelled because user behaviour cannot be predicted.
                </>,
                <>
                  <strong>Scenario calibration:</strong> percentages are fractions of <em>current</em> annual issuance (~657k ZEC/yr). The "Conservative" scenario assumes ~0.5% of issuance is burned; "ETH-comparable" assumes 25%.
                </>,
                <>
                  <strong>Annual issuance held constant:</strong> we use the current post-NU6 rate. In reality issuance declines over time (under either ZIP 234 or today's halvings), which we don't model here.
                </>,
                <>
                  <strong>No price effect:</strong> ZEC denominated. Whether the burn meaningfully affects price depends on demand-side factors not modelled.
                </>,
                <>
                  <strong>No interaction with ZIP 234 in this view:</strong> see the ZIP 234 sandbox for the recycling effect on issuance.
                </>,
              ]}
            />
          </>
        }
      />
    </div>
  );
}

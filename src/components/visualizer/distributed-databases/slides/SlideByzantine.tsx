import { motion } from "framer-motion";
import { SlideProps } from "../DistributedDatabaseVisualizer";
import { SlideFrame } from "./SlideFrame";

export default function SlideByzantine(props: SlideProps) {
  const N = 7;
  const traitors = new Set([1, 4]);
  const showTraitors = props.progress > 0.3;
  const agreement = Math.min(100, Math.round(40 + props.progress * 60));

  const generals = Array.from({ length: N }).map((_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    return {
      x: 50 + Math.cos(a) * 32,
      y: 50 + Math.sin(a) * 32,
      i,
      traitor: traitors.has(i),
    };
  });

  return (
    <SlideFrame
      eyebrow="Chapter 03"
      title="Byzantine Generals Problem"
      subtitle="Distributed actors must reach consensus even when some lie. Honest nodes converge despite malicious messages."
      bullets={[
        "Faulty / malicious actors send conflicting info",
        "Honest nodes need a verifiable agreement",
        "Tolerable up to f traitors when n ≥ 3f + 1",
        "Foundation of BFT consensus & blockchains",
      ]}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {/* messages */}
        {generals.map((g, i) =>
          generals.map((h, j) => {
            if (j <= i) return null;
            const traitor = showTraitors && (g.traitor || h.traitor);
            return (
              <line
                key={`${i}-${j}`}
                x1={g.x}
                y1={g.y}
                x2={h.x}
                y2={h.y}
                stroke={traitor ? "var(--viz-amber)" : "var(--viz-cyan)"}
                strokeOpacity={traitor ? 0.35 : 0.12}
                strokeWidth={traitor ? 0.4 : 0.25}
                strokeDasharray={traitor ? "1.5 1.5" : "0"}
              />
            );
          }),
        )}

        {/* messengers */}
        {generals.slice(0, 5).map((g, k) => {
          const target = generals[(k * 3 + 2) % N];
          return (
            <motion.circle
              key={`m${k}`}
              r="0.8"
              fill={
                g.traitor && showTraitors
                  ? "var(--viz-amber)"
                  : "var(--viz-cyan)"
              }
              animate={{ cx: [g.x, target.x], cy: [g.y, target.y] }}
              transition={{
                duration: 1.8,
                delay: k * 0.2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ filter: "drop-shadow(0 0 2px currentColor)" }}
            />
          );
        })}

        {/* castle */}
        <circle
          cx="50"
          cy="50"
          r="6"
          fill="var(--viz-surface)"
          stroke="var(--viz-violet)"
          strokeWidth="0.6"
        />
        <text
          x="50"
          y="51.5"
          textAnchor="middle"
          fontSize="2.5"
          fill="var(--viz-ink)"
          fontWeight="600"
        >
          city
        </text>

        {generals.map((g) => {
          const isTraitor = showTraitors && g.traitor;
          return (
            <g key={g.i}>
              <motion.circle
                cx={g.x}
                cy={g.y}
                r="3.4"
                fill="var(--viz-surface)"
                stroke={isTraitor ? "var(--viz-amber)" : "var(--viz-emerald)"}
                strokeWidth="0.7"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 + g.i * 0.06 }}
                style={{
                  transformOrigin: `${g.x}px ${g.y}px`,
                  filter: `drop-shadow(0 0 3px ${isTraitor ? "var(--viz-amber)" : "var(--viz-emerald)"})`,
                }}
              />
              <text
                x={g.x}
                y={g.y + 1.1}
                textAnchor="middle"
                fontSize="2.4"
                fill="var(--viz-ink)"
              >
                G{g.i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-4 left-4 right-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur text-center md:-bottom-2.5 flex-col md:flex-row w-full"
      >
        <div className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-[var(--viz-emerald)]" />{" "}
          Honest
          <span className="ml-3 h-2 w-2 rounded-full bg-[var(--viz-amber)]" />{" "}
          Traitor
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-white/70">
          <span>Agreement</span>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-[var(--viz-emerald)]"
              animate={{ width: `${agreement}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="tabular-nums text-[var(--viz-emerald)]">
            {agreement}%
          </span>
        </div>
      </motion.div>
    </SlideFrame>
  );
}

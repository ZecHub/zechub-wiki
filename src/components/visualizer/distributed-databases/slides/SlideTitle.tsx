import { motion } from "framer-motion";
import { SlideProps } from "../DistributedDatabaseVisualizer";

export default function SlideTitle(props: SlideProps) {
  const nodes = Array.from({ length: 9 }).map((_, i) => {
    const a = (i / 9) * Math.PI * 2;

    return {
      x: 50 + Math.cos(a) * 32,
      y: 50 + Math.sin(a) * 32,
    };
  });

  return (
    <div className="relative grid h-full place-items-center overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
      <div className="relative grid place-items-center">
        <svg
          viewBox="0 0 100 100"
          className="absolute h-[420px] w-[420px] opacity-70"
        >
          {nodes.map((n, i) =>
            nodes.map((m, j) =>
              j > i ? (
                <motion.line
                  key={`${i}-${j}`}
                  x1={n.x}
                  y1={n.y}
                  x2={m.x}
                  y2={m.y}
                  stroke={"var(--viz-cyan)"}
                  strokeOpacity="0.18"
                  strokeWidth={"0.25"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.2 + (i + j) * 0.02 }}
                />
              ) : null,
            ),
          )}

          {nodes.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x}
              cy={n.y}
              r="1.6"
              fill={"var(--viz-cyan"}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 1], opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
              style={{
                transformOrigin: `${n.x}px ${n.y}px`,
                filter: "drop-shadow(0 0 3px var(--viz-cyan))",
              }}
            />
          ))}
        </svg>
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1 }}
            className="mb-4 text-[11px] font-semibold uppercase text-[var(--viz-cyan)]"
          >
            A Visual Primer
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:text-7xl text-5xl font-semibold tracking-tight"
          >
            Distributed <br />
            <span className="bg-gradient-to-r from-[var(--viz-cyan)] via-[var(--viz-violet)] to-[var(--viz-violet)] to-[var(--viz-emerald)] bg-clip-text text-transparent md:text-6xl text-[48px]">
              Databases
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 text-sm uppercase tracking-[0.35em] text-[var(--viz-mute)]"
          >
            Centralization · Replication · Consensus · Trust
          </motion.p>
        </div>
      </div>
    </div>
  );
}

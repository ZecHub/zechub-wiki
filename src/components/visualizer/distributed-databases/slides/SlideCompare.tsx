import { motion } from "framer-motion";
import { SlideProps } from "../DistributedDatabaseVisualizer";

const ROWS = [
  {
    label: "Trust model",
    a: "Institutional / admin",
    b: "Cryptographic / consensus",
  },
  { label: "Throughput", a: "Very high (10k+ TPS)", b: "Limited (10–10k TPS)" },
  { label: "Mutability", a: "Read · write · delete", b: "Append-only ledger" },
  {
    label: "Failure mode",
    a: "Single point of failure",
    b: "Byzantine fault tolerant",
  },
  {
    label: "Cost / latency",
    a: "Low, milliseconds",
    b: "Higher, seconds–minutes",
  },
  {
    label: "Best for",
    a: "Internal apps & analytics",
    b: "Trustless value & audit",
  },
];

export default function SlideCompare(props: SlideProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-10">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--viz-cyan)]">
        Chapter 04
      </div>
      <h1 className="md:text-5xl text-[38px] font-semibold tracking-tight">
        Centralized DB <span className="text-[var(--viz-mute)]">vs</span>{" "}
        <span className="bg-gradient-to-r from-[var(--viz-violet)] to-[var(--viz-emerald)] bg-clip-text text-transparent">
          Blockchain
        </span>
      </h1>
      <p className="mt-3 max-w-3xl text-sm text-[var(--viz-mute)]">
        Both store data. They differ on who you must trust, how change is
        allowed, and what happens when actors misbehave.
      </p>

      <div className="mt-8 grid grid-cols-12 gap-6">
        {/* Left visual */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-3 rounded-2xl border border-white/10 bg-black/20 p-5"
        >
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--viz-cyan)]">
            Centralized DB
          </div>
          <svg viewBox="0 0 100 80" className="w-full">
            <rect
              x="35"
              y="25"
              width="30"
              height="36"
              rx="3"
              fill="var(--viz-surface)"
              stroke="var(--viz-cyan)"
              strokeWidth="0.8"
            />
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x="40"
                y={30 + i * 8}
                width="20"
                height="3"
                rx="1"
                fill="var(--viz-cyan)"
                opacity="0.5"
              />
            ))}
            <circle cx="50" cy="15" r="3" fill="var(--viz-amber)" />
            <text
              x="50"
              y="74"
              textAnchor="middle"
              fontSize="4"
              fill="var(--viz-mute)"
            >
              admin key
            </text>
          </svg>
        </motion.div>

        {/* Comparison table */}
        <div className="col-span-6 rounded-2xl border border-white/10 bg-black/20 p-2">
          {ROWS.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
              className="grid grid-cols-12 items-center gap-2 border-b border-white/5 px-3 py-2.5 last:border-b-0"
            >
              <div className="col-span-4 text-xs uppercase tracking-wider text-[var(--viz-mute)]">
                {r.label}
              </div>
              <div className="col-span-4 text-sm text-white/90">{r.a}</div>
              <div className="col-span-4 text-sm text-[var(--viz-emerald)]">
                {r.b}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right visual: chain */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-3 rounded-2xl border border-white/10 bg-black/20 p-5"
        >
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--viz-emerald)]">
            Blockchain
          </div>
          <svg viewBox="0 0 100 80" className="w-full">
            {[0, 1, 2, 3].map((i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.2 }}
              >
                <rect
                  x="10"
                  y={8 + i * 16}
                  width="80"
                  height="12"
                  rx="2"
                  fill="var(--viz-surface)"
                  stroke="var(--viz-emerald)"
                  strokeWidth="0.6"
                />
                <text
                  x="14"
                  y={16 + i * 16}
                  fontSize="3.2"
                  fill="var(--viz-emerald)"
                  fontWeight="600"
                >
                  block #{i + 1}
                </text>
                <text
                  x="86"
                  y={16 + i * 16}
                  fontSize="2.6"
                  fill="var(--viz-mute)"
                  textAnchor="end"
                >
                  0x{(0xab12 + i * 17).toString(16)}
                </text>
                {i < 3 && (
                  <line
                    x1="50"
                    y1={20 + i * 16}
                    x2="50"
                    y2={24 + i * 16}
                    stroke="var(--viz-emerald)"
                    strokeWidth="0.6"
                  />
                )}
              </motion.g>
            ))}
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

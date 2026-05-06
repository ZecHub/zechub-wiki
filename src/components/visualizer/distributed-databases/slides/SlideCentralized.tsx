import { motion } from "framer-motion";
import { SlideProps } from "..";
import { SlideFrame } from "./SlideFrame";

export default function SlideCentralized(props: SlideProps) {
  const failed = props.progress > 0.7;
  const clients = Array.from({ length: 8 }).map((_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;

    return { x: 50 + Math.cos(a) * 36, y: 50 + Math.sin(a) * 36, i };
  });

  return (
    <SlideFrame
      eyebrow="Chapter 01"
      title="Centralize Databases"
      subtitle="One authoritative server. All reads and writes flow through a single source of truth."
      bullets={[
        "Strong consistencey, simple model",
        "Easy to secure and audit",
        "Single Point of Failure (SPOF)",
        "Vertical scaling ceiling",
      ]}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {/* links */}
        {clients.map((c) => (
          <line
            key={`l${c.i}`}
            x1={"50"}
            y1="50"
            x2={c.x}
            y2={c.y}
            stroke={failed ? "var(--viz-rose)" : "var(--viz-cyan)"}
            strokeOpacity={0.25}
            strokeWidth={0.4}
          />
        ))}

        {/* packets */}
        {clients.map((c) => (
          <motion.circle
            key={`p${c.i}`}
            r={0.9}
            fill={"var(--viz-cyan)"}
            style={{ filter: "drop-shadow(0 0 2px var(--viz-cyan))" }}
            animate={{ cx: [c.x, 50], cy: [c.y, 50] }}
            transition={{
              duration: 1.4,
              delay: c.i * 0.1,
              repeat: Infinity,
              ease: "easeIn",
            }}
          />
        ))}

        {/* central server */}
        <motion.circle
          cx={50}
          cy={50}
          r="9"
          fill={"var(--viz-surface)"}
          stroke={failed ? "var(--viz-rose)" : "var(--viz-cyan"}
          strokeWidth={0.8}
          animate={
            failed
              ? { scale: [1, 1.05, 0.95, 1], opacity: [1, 0.6, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.4, repeat: failed ? Infinity : 0 }}
          style={{
            transformOrigin: "50px 50px",
            filter: `drop-shadow(0 0 8px ${failed ? "var(--viz-rose)" : "var(--viz-cyan)"})`,
          }}
        />
        <text
          x={50}
          y={52.5}
          textAnchor="middle"
          fontSize={3.2}
          fill="var(--viz-ink)"
          fontWeight={"600"}
        >
          DB
        </text>
        {/* clients */}
        {clients.map((c) => (
          <g key={`c${c.i}`}>
            <motion.circle
              cx={c.x}
              cy={c.y}
              r={2.2}
              fill={failed ? "var(--viz-rose)" : "var(--viz-violet"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + c.i * 0.05, type: "spring" }}
              style={{ transformOrigin: `${c.x}px ${c.y}px` }}
            />
          </g>
        ))}
      </svg>
      {
        failed && (
          <motion.div initial={{opacity: 0, y:8}} animate={{opacity: 1, y: 0}} className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[var(--viz-rose)]/59 bg-[var(--viz-rose)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--viz-rose)]">
            Single Point of Failure 
          </motion.div>
        )
      }
    </SlideFrame>
  );
}

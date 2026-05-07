import { motion } from "framer-motion";
import { SlideProps } from "../DistributedDatabaseVisualizer";
import { SlideFrame } from "./SlideFrame";
import FailedComp from "./Failed";

export default function SlideDistributed(props: SlideProps) {
  const failedIdx = 2;
  const isFailed = props.progress > 0.55;
  const edges: [number, number][] = [];

  const nodes = Array.from({ length: 7 }).map((_, i) => {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + Math.cos(a) * 30, y: 50 + Math.sin(a) * 30, i };
  });

  for (let i = 0; i < nodes.length; i++) {
    edges.push([i, (i + 1) % nodes.length]);
    edges.push([i, (i + 2) % nodes.length]);
  }

  return (
    <SlideFrame
      eyebrow="Chapter 02"
      title="Distributed Databases"
      subtitle="Data replicated across many nodes. Traffic reroutes around failures; the system stays up."
      bullets={[
        "Replication & sharding",
        "Horizontal scale",
        "Partition tolerance (CAP)",
        "Eventual or tunable consistency",
      ]}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {edges.map(([a, b], k) => {
          const dead = isFailed && (a === failedIdx || b === failedIdx);
          return (
            <motion.line
              key={k}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke={dead ? "var(--viz-rose)" : "var(--viz-emerald)"}
              strokeOpacity={dead ? 0.15 : 0.3}
              strokeDasharray={dead ? "1 1" : "0"}
              strokeWidth="0.35"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.1 + k * 0.04 }}
            />
          );
        })}
        {/* packets traveling on edges */}
        {edges.slice(0, 7).map(([a, b], k) => {
          if (isFailed && (a === failedIdx || b === failedIdx)) return null;
          return (
            <motion.circle
              key={`pk${k}`}
              r="0.8"
              fill="var(--viz-cyan)"
              style={{ filter: "drop-shadow(0 0 2px var(--viz-cyan))" }}
              animate={{
                cx: [nodes[a].x, nodes[b].x],
                cy: [nodes[a].y, nodes[b].y],
              }}
              transition={{
                duration: 1.6,
                delay: k * 0.2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}
        {nodes.map((n) => {
          const dead = isFailed && n.i === failedIdx;
          return (
            <g key={n.i}>
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="4"
                fill="var(--viz-surface)"
                stroke={dead ? "var(--viz-rose)" : "var(--viz-emerald)"}
                strokeWidth="0.6"
                initial={{ scale: 0 }}
                animate={
                  dead
                    ? { scale: [1, 0.8, 0.8], opacity: [1, 0.4, 0.4] }
                    : { scale: 1 }
                }
                transition={
                  dead
                    ? { duration: 0.6 }
                    : { type: "spring", delay: 0.2 + n.i * 0.06 }
                }
                style={{
                  transformOrigin: `${n.x}px ${n.y}px`,
                  filter: dead
                    ? "none"
                    : "drop-shadow(0 0 4px var(--viz-emerald))",
                }}
              />
              <text
                x={n.x}
                y={n.y + 1}
                textAnchor="middle"
                fontSize="2.2"
                fill="var(--viz-ink)"
                fontWeight="600"
              >
                {dead ? "×" : `n${n.i + 1}`}
              </text>
            </g>
          );
        })}
      </svg>
      {isFailed && (
        <FailedComp
          label="Node failed · Cluster healthy"
          css="border-[var(--viz-emerald)]/50 bg-[var(--viz-emerald)]/10  text-[var(--viz-emerald)]"
        />
      )}
    </SlideFrame>
  );
}

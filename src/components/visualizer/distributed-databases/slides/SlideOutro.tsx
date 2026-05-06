import { motion } from "framer-motion";
import { SlideProps } from "..";

export default function SlideOutro(props: SlideProps) {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden rounded-3xl border border-white/5 bg-gredient-to-b from-white/[0.03] to-transparent p-12 text-center">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-[11px] font-semibold uppercase text-[var(--viz-cyan)]"
        >
          Critical Takeway
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl font-semibold leading-tight tracking-tight"
        >
          Centralized DBs win on{" "}
          <span className="bg-gradient-to-r from-[var(--viz-cyan)] to-[var(--viz--violet)] bg-clip-text text-transparent">
            speed & simplicity
          </span>
          .
          <br />
          Blockchain win on{" "}
          <span className="bg-gradient-to-r from-[var(--viz-emerald)] to-[var(--viz-cyan)] bg-clip-text text-transparent">
            trustlessness
          </span>{" "}
          - at a real cost.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-base text-[var(--viz-mute)]"
        >
          Choose the failure model that matches your threat model. If you trust
          an operator, a database is faster, cheaper, and friendlier. If you
          can&post;t pay for consensus.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-10 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.3em] text-[var(--viz-mute)]"
        >
          <span>Space · Play / Pause</span>
          <span>← →· Navigate</span>
          <span>R · Restart</span>
          <span>F · Fullscreen</span>
        </motion.div>
      </div>
    </div>
  );
}

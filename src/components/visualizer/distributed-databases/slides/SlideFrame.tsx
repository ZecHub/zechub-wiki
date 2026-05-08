import { motion } from "framer-motion";
import { ReactNode } from "react";

type SlideFrameProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  children: ReactNode;
};
export function SlideFrame(props: SlideFrameProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
      <div className="grid grid-cols-12 mx-auto gap-10 p-18">
        <div className="col-span-6 flex flex-col justify-center ">
          {props.eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--viz-cyan)]"
            >
              {props.eyebrow}
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="md:text-5xl text-[38px] font-semibold leading-[1.05] tracking-tight"
          >
            {props.title}
          </motion.h1>

          {props.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-4 text-base leading-relaxed text-[var(--viz-mute)]"
            >
              {props.subtitle}
            </motion.p>
          )}
          {props.bullets && (
            <ul className="mt-8 space-y-3">
              {props.bullets.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-white/80"
                >
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--viz-cyan)]" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative col-span-6">{props.children}</div>
      </div>
    </div>
  );
}

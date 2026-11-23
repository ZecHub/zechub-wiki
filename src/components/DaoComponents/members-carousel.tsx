"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import MemberCard from "./member-card";
import { daoMembers } from "@/constants/membersDao";

const CARD_WIDTH = 300;
const SPACING = 280; // enough so sides sit beside the center without overlapping
const MAX_VISIBLE = 1; // only show immediate neighbors

export default function MembersCarousel() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const total = daoMembers.length;

  const goTo = useCallback(
    (n: number) => {
      setIndex(((n % total) + total) % total);
    },
    [total]
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const transition = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 34, mass: 0.65 };

  return (
    <div className="relative w-full">
      <div
        className="relative mx-auto h-[500px] w-full overflow-hidden"
        style={{ perspective: "1800px" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {daoMembers.map((member, i) => {
            let offset = i - index;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const abs = Math.abs(offset);
            if (abs > MAX_VISIBLE) return null;

            const isCenter = abs < 0.5;

            // Mild coverflow: sides angled but still clearly readable
            const rotateY = reduced ? 0 : Math.sign(offset) * 22;
            const scale = isCenter ? 1 : 0.78;
            const opacity = isCenter ? 1 : 0.7;
            const x = offset * SPACING;
            const z = isCenter ? 60 : -30;

            return (
              <motion.div
                key={`${member.name}-${i}`}
                className="absolute"
                style={{
                  width: CARD_WIDTH,
                  zIndex: isCenter ? 30 : 10,
                  pointerEvents: isCenter ? "auto" : "none",
                  transformStyle: "flat",
                }}
                initial={false}
                animate={{ x, rotateY, scale, z, opacity }}
                transition={transition}
                drag={isCenter && !reduced ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.45}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -35) next();
                  else if (info.offset.x > 35) prev();
                }}
              >
                <div className="rounded-xl bg-slate-50 shadow-2xl dark:bg-[#0b1626]">
                  <MemberCard member={member} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous member"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-all hover:border-brand hover:bg-brand/10 hover:text-brand active:scale-95 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-brand dark:hover:bg-brand/20"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex max-w-[260px] flex-wrap items-center justify-center gap-1.5">
          {daoMembers.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Member ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === index
                  ? "w-6 bg-brand"
                  : "w-2 bg-slate-300 hover:bg-slate-400 dark:bg-white/25 dark:hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next member"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-all hover:border-brand hover:bg-brand/10 hover:text-brand active:scale-95 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-brand dark:hover:bg-brand/20"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="mt-3 text-center text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
        {index + 1} of {total} · Drag the center card or use the arrows
      </p>
    </div>
  );
}

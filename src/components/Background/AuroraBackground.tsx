"use client";
import { useEffect, useRef } from "react";

// Site-wide background: a deep navy (dark) / pale blue (light) base with soft
// brand-blue glows that drift slowly as the page scrolls. Same look as the
// ZecHub tools page. Fixed and behind everything (-z-10), never intercepts
// clicks, and stays still for visitors who prefer reduced motion.
export default function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      el.style.setProperty("--scroll", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--scroll" as string]: "0" }}
    >
      <div className="absolute inset-0 bg-[#e8f4fb] dark:bg-[#0b1520]" />
      <div
        className="absolute -inset-[20%] opacity-90 dark:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at calc(18% + var(--scroll) * 48%) calc(8% + var(--scroll) * 36%), color-mix(in srgb, var(--color-brand) 42%, transparent), transparent 58%)," +
            "radial-gradient(ellipse 50% 40% at calc(88% - var(--scroll) * 40%) calc(22% + var(--scroll) * 28%), rgba(14,95,143,0.38), transparent 62%)," +
            "radial-gradient(ellipse 70% 50% at calc(48% + var(--scroll) * 10%) calc(92% - var(--scroll) * 34%), rgba(21,30,41,0.18), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at calc(30% + var(--scroll) * 35%) calc(40% + var(--scroll) * 20%), color-mix(in srgb, var(--color-brand) 22%, transparent), transparent 65%)," +
            "linear-gradient(180deg, rgba(11,21,32,0.15) 0%, rgba(17,27,39,0.55) 100%)",
        }}
      />
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(232,244,251,0.2) 0%, rgba(198,226,242,0.45) 100%)",
        }}
      />
    </div>
  );
}

"use client";

import { MotionConfig } from "framer-motion";

/**
 * Site-wide reduced-motion configuration for Framer Motion.
 *
 * `reducedMotion="user"` makes every `motion` component in the tree follow the
 * operating system's "Reduce motion" setting, so the ~100 files that import
 * framer-motion do not each have to handle it.
 *
 * What it actually does (motion-dom's animateTarget): when the preference is
 * on, any positional key — width, height, top, left, right, bottom and every
 * transform prop (x, y, scale, rotate, …) — is animated with `{ type: false }`,
 * which sets it to its target value immediately instead of tweening. Every other
 * key, opacity included, still animates.
 *
 * That distinction is what keeps the visualizers usable. The codebase has
 * hundreds of `initial={{ opacity: 0, y: 20 }}` entrances; under this config the
 * slide is removed while the fade still runs, so content and interactive steps
 * still appear rather than being stranded invisible.
 *
 * Note: framer-motion reads the preference when a component mounts and does not
 * subscribe to changes, so toggling the OS setting applies on the next page
 * load. The CSS half of this (globals.css) is live either way.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

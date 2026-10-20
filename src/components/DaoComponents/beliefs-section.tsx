"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BeliefsSection() {
  const { t } = useLanguage();
  const defaultBeliefs: string[] = [
    "Privacy is a human right",
    "Education should be open-source and accessible worldwide",
    "Community members have a right to earn ZEC privately",
    "Global collaboration drives innovation",
  ];
  // Guard against a dictionary that supplies a present-but-wrong-typed value:
  // `??` only catches null/undefined, so a mistyped (non-array) key would crash
  // `.map()` during prerender. Fall back to English unless it's a real array.
  const beliefs: string[] = Array.isArray(t?.dao?.beliefs)
    ? t.dao.beliefs
    : defaultBeliefs;

  return (
    <section className="space-y-6">
      <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900 md:text-[1.75rem] dark:text-white">
        What We Believe
      </h2>
      <div className="!mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {beliefs.map((belief, index) => (
          <div
            key={index}
            className="flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-5 transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand/40 bg-brand/10 text-brand dark:text-brand-soft">
              <Check aria-hidden="true" className="h-4 w-4" />
            </span>
            <p className="m-0 text-[0.95rem] font-medium leading-snug text-slate-900 dark:text-slate-100">{belief}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

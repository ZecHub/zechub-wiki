"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function UniqueFeatures() {
  const { t } = useLanguage();

  const defaultFeatures = [
    {
      icon: "🛡️",
      title: "First Zcash Ecosystem DAO",
      description:
        "ZecHub is pioneering decentralized governance in the Zcash community, with funds held primarily within the Zcash shielded pool for maximum privacy.",
    },
    {
      icon: "🌍",
      title: "Global Collaboration",
      description:
        "Global Ambassadors, Community Grants members, and community experts unite to guide the direction of Zcash and Privacy Technology education.",
    },
    {
      icon: "🔄",
      title: "SubDAO Framework",
      description:
        "Any group can create SubDAOs to form projects, create proposals, or request Retroactive Compensation via the DAO DAO module.",
    },
  ];
  // Guard against a present-but-wrong-typed dictionary value (`??` only catches
  // null/undefined); fall back to English unless it's a real array.
  const features = Array.isArray(t?.dao?.features)
    ? t.dao.features
    : defaultFeatures;

  return (
    <section className="space-y-6 border-t border-slate-200 pt-10 dark:border-white/10">
      <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900 md:text-[1.75rem] dark:text-white">
        {t?.dao?.featuresHeading ?? "What Makes ZecHub Unique?"}
      </h2>
      <div className="!mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((feature: any, index: number) => (
          <div
            key={index}
            className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-5 transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40"
          >
            <span
              aria-hidden="true"
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl ring-1 ring-slate-200 dark:bg-white/[0.06] dark:ring-white/10"
            >
              {feature.icon}
            </span>
            <h3 className="m-0 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

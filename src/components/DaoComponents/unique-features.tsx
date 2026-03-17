"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function UniqueFeatures() {
  const { t } = useLanguage();

  const features =
    t?.dao?.features ?? [
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

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold dark:text-amber-400 flex items-center gap-3 mb-8">
          <span className="w-1 h-10 bg-gradient-to-b from-amber-400 to-yellow-300 rounded"></span>
          {t?.dao?.featuresHeading ?? "What Makes ZecHub Unique?"}
        </h2>
      </div>
      <div className="space-y-4">
        {features.map((feature: any, index: number) => (
          <div
            key={index}
            className="dark:bg-slate-800/40 border-l-4 border-amber-400 rounded-lg p-6 dark:hover:bg-slate-800/60 transition-all duration-300 hover:translate-x-1"
          >
            <h3 className="text-xl font-semibold dark:text-yellow-300 mb-2">
              {feature.icon} {feature.title}
            </h3>
            <p className="dark:text-slate-300 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

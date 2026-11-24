"use client";

import { useEffect, useState } from "react";
import MemberCard from "./member-card";
import MembersCarousel from "./members-carousel";
import { daoMembers } from "@/constants/membersDao";
import { useLanguage } from "@/context/LanguageContext";

const STORAGE_KEY = "zechub-dao-members-view";

export default function MembersSection() {
  const { t } = useLanguage();
  const title = t?.dao?.membersTitle ?? "DAO Members";
  const [view, setView] = useState<"grid" | "carousel">("grid");

  // Restore preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "carousel" || saved === "grid") setView(saved);
    } catch {
      // ignore
    }
  }, []);

  const toggle = () => {
    const next = view === "grid" ? "carousel" : "grid";
    setView(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  return (
    <section className="space-y-6 border-t border-slate-200 pt-10 dark:border-white/10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900 md:text-[1.75rem] dark:text-white">
          {title}
        </h2>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={view === "carousel"}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-brand hover:bg-brand/10 hover:text-brand dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-brand dark:hover:bg-brand/20"
          >
            {view === "grid" ? (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                3D View
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h7m0 0V4m0 2v2m0-2h9M4 12h16M4 18h7" />
                </svg>
                Grid
              </>
            )}
          </button>

          <p className="m-0 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            {daoMembers.length} members
          </p>
        </div>
      </div>

      <div className="!mt-6">
        {view === "grid" ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {daoMembers.map((member, index) => (
              <MemberCard key={index} member={member} />
            ))}
          </div>
        ) : (
          <MembersCarousel />
        )}
      </div>
    </section>
  );
}

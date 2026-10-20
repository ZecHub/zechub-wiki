"use client";

import MemberCard from "./member-card";
import { daoMembers } from "@/constants/membersDao";
import { useLanguage } from "@/context/LanguageContext";

export default function MembersSection() {
  const { t } = useLanguage();
  const title = t?.dao?.membersTitle ?? "DAO Members";

  return (
    <section className="space-y-6 border-t border-slate-200 pt-10 dark:border-white/10">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900 md:text-[1.75rem] dark:text-white">
          {title}
        </h2>
        <p className="m-0 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
          {daoMembers.length} members
        </p>
      </div>
      <div className="!mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {daoMembers.map((member, index) => (
          <MemberCard key={index} member={member} />
        ))}
      </div>
    </section>
  );
}

"use client";

import MemberCard from "./member-card";
import { daoMembers } from "@/constants/membersDao";
import { useLanguage } from "@/context/LanguageContext";

export default function MembersSection() {
  const { t } = useLanguage();
  const title = t?.dao?.membersTitle ?? "DAO Members";

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold dark:text-amber-400 flex items-center gap-3">
        <span className="w-1 h-10 bg-gradient-to-b from-amber-400 to-yellow-300 rounded"></span>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daoMembers.map((member, index) => (
          <MemberCard key={index} member={member} />
        ))}
      </div>
    </section>
  );
}

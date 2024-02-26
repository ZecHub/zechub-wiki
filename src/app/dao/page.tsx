"use client";
import { FadeInAnimation } from "@/components/ui/FadeInAnimation";
import MemberCards from "@/components/ui/MemberCards";
import { daoMembers } from "@/constants/membersDao";
import React from "react";
const Donation = () => {
  return (
    <main>
      <FadeInAnimation>
        <h1 className="text-3xl font-bold text-center my-5 ">DAO Members</h1>
      </FadeInAnimation>
      <div className="w-full grid grid-cols-1 space-x-2 md:grid-cols-3 md:gap-4 justify-items-center  mt-4 p-2">
        {daoMembers &&
          daoMembers.map((e) => (
            <FadeInAnimation key={e.name}>
              <div className="flex justify-center space-y-4 w-full space-x-3 md:space-y-2 ">
                <MemberCards
                  imgUrl={e.imgUrl}
                  description={e.description}
                  name={e.name}
                  linkName={e.linkName}
                  urlLink={e.urlLink}
                />
              </div>
            </FadeInAnimation>
          ))}
      </div>
    </main>
  );
};

export default Donation;

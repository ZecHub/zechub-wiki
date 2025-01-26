"use client";
import React from "react";
import Image from "next/image";
import { FadeInAnimation } from "@/components/ui/FadeInAnimation";
import MemberCards from "@/components/ui/MemberCards";
import { daoMembers } from "@/constants/membersDao";
import logo from "/public/DAOlogo.png";
import daoLogo from "/public/daodao.jpg";
import ethLogo from "/public/snapshot.jpg";
import { Metadata } from "next";
import { genMetadata } from "@/lib/helpers";

// export const metadata: Metadata = genMetadata({
//   title: "DAO Members",
//   url: "https://zechub.wiki/dao"
// })

const DaoMembers: React.FC = () => {
  return (
    <main className="dao-main-container">
      <FadeInAnimation>
        <div className="flex items-center justify-center my-12">
          <Image
            src={logo}
            alt="ZecHub Logo"
            width={100}
            height={100}
            className="mr-4"
          />
          <h1 className="text-4xl font-semibold">ZecHub DAO</h1>
        </div>

        <p
          style={{ textAlign: "justify" }}
          className="text-xl text-slate-600 mb-12"
        >
          ZecHub provides an open source educational platform where community
          members can work together on creating, validating, and promoting
          content that supports the Zcash ecosystem. ZecHub believes: Privacy is
          a human right Education should be open-source and accessible worldwide
          Community members have a right to earn ZEC privately ZecHub DAO is
          comprised of likeminded individuals located around the world with the
          common goal of effectively guiding Zcash and Privacy Technology
          education.
        </p>
      </FadeInAnimation>

      <FadeInAnimation>
        <h3 className="text-3xl text-center mb-4 font-semibold">
          What makes ZecHub unique?
        </h3>

        <p
          style={{ textAlign: "justify" }}
          className="text-base text-slate-600 mb-12"
        >
          ZecHub is the first Zcash ecosystem DAO. Its funds are held primarily
          within the Zcash shielded pool. Global Ambassadors, Community Grants
          members and community experts form a group that decides the direction
          of Zcash education. The DAO also allows any group to create
          SubDAO&apos;s which are able to form projects and create proposals or
          request Retroactive Compensation via the DAO DAO module.
        </p>
      </FadeInAnimation>

      <FadeInAnimation>
        <h3 className="text-3xl text-center mb-4 font-semibold">Governance</h3>

        <p
          style={{ textAlign: "justify" }}
          className="text-base text-slate-600 mb-12"
        >
          All DAO proposals are public and can be viewed using the DAO DAO or
          Snapshot buttons. Anyone can create a proposal to vote on. In an
          effort to support community transparency, ZecHub DAO will post all
          governance proposals in the Zcash Community Forum ZecHub Governance
          thread.
        </p>

        <div className="flex justify-center items-center text-center space-x-4 mb-12">
          <div>
            <a
              href="https://daodao.zone/dao/juno1nktrulhakwm0n3wlyajpwxyg54n39xx4y8hdaqlty7mymf85vweq7m6t0y/proposals"
              target="_blank"
            >
              <Image
                className="rounded-full border-4 border-slate-400 dark:border-black hover:scale-125"
                src={daoLogo}
                alt="DAODAO"
                width={80}
                height={80}
              />
            </a>
            <h1 className="font-bold">DAO DAO</h1>
          </div>
          <div>
            <a href="https://snapshot.org/#/zechubdao.eth" target="_blank">
              <Image
                className="rounded-full border-4 border-slate-400 dark:border-black hover:scale-125"
                src={ethLogo}
                alt="Ethereum DAO"
                width={80}
                height={80}
              />
            </a>
            <h1 className="font-bold">Snapshot</h1>
          </div>
        </div>
      </FadeInAnimation>

      <div className="my-12">
        <h3 className="text-3xl mb-4 font-semibold text-center">DAO Members</h3>

        <div className="grid-container">
          {daoMembers &&
            daoMembers.map((e) => (
              <FadeInAnimation key={e.name}>
                <MemberCards
                  imgUrl={e.imgUrl}
                  description={e.description}
                  name={e.name}
                  linkName={e.linkName}
                  urlLink={e.urlLink}
                  zcashAddress={e.zcashAddress}
                />
              </FadeInAnimation>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-3xl mb-4 font-semibold">Sources</h3>
        <ul className="text-base text-slate-600 mb-12 list-disc px-4">
          <li>
            <a
              target="_blank"
              className="text-blue-500 active:text-blue-700 hover:text-blue-600"
              href="https://twitter.com/ZecHub/status/1569827000218537984"
            >
              Twitter
            </a>
          </li>
          <li>
            <a
              target="_blank"
              className="text-blue-500 active:text-blue-700 hover:text-blue-600"
              href="https://forum.zcashcommunity.com/t/zechub-rfi/42778/17"
            >
              Zcash Forum Community
            </a>
          </li>
          <li>
            <a
              target="_blank"
              className="text-blue-500 active:text-blue-700 hover:text-blue-600"
              href="https://www.forbes.com/sites/cathyhackl/2021/06/01/what-are-daos-and-why-you-should-pay-attention/"
            >
              Forbes
              {/* ll? */}
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default DaoMembers;

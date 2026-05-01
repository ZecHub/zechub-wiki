'use client';

import { useState } from "react";
import {
  ListCards,
  ListCardsContent,
  ListCardsDescription,
  ListCardsHeader,
  ListCardsTitle,
} from "@/components/UI/GovHowTo/ListCards/ListCards";
import Link from "next/link";
import { FaWallet, FaDiscord, FaExternalLinkAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdHowToVote } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { IoDocumentText } from "react-icons/io5";

export default function GovernanceGuide() {
  const [step, setStep] = useState(0); // 0 = First Steps, 1 = Draft, 2 = Submitting

  const sections = [
    { title: "First Steps", icon: <FaWallet className="h-6 w-6 text-blue-600 dark:text-blue-400" /> },
    { title: "Draft Proposal", icon: <IoDocumentText className="h-6 w-6 text-green-600 dark:text-green-400" /> },
    { title: "Submitting Proposal", icon: <MdHowToVote className="h-6 w-6 text-purple-600 dark:text-purple-400" /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">ZecHub DAO Governance</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A comprehensive guide to participating in ZecHub DAO governance
          </p>
        </div>

        {/* Current Section Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {sections[step].icon}
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{sections[step].title}</h2>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Step {step + 1} of 3
          </div>
        </div>

        {/* First Steps */}
        {step === 0 && (
          <ListCards>
            <ListCardsHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <FaWallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <ListCardsTitle className="text-2xl text-slate-900 dark:text-white">First Steps</ListCardsTitle>
                  <ListCardsDescription className="text-slate-600 dark:text-slate-400">Get set up to participate in DAO governance</ListCardsDescription>
                </div>
              </div>
            </ListCardsHeader>
            <ListCardsContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <div className="flex-1">
                  <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">Install Keplr Wallet</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">Set up your Keplr wallet to interact with the DAO</p>
                  <div className="max-w-[420px] mx-auto aspect-video rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 shadow-sm">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/fWagokTEx-Y"
                      title="Keplr Wallet Setup Guide"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="/Logo/juno.png" alt="JUNO" className="w-8 h-8" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Acquire JUNO</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Get JUNO tokens to interact with the daodao contract.
                    Contact core-team members for assistance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">View Open Proposals</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-3">Check out current proposals and voting opportunities</p>
                  <button className="cursor-pointer border py-2 px-3 rounded-md hover:bg-yellow-300 dark:hover:bg-yellow-500 text-slate-900 dark:text-white">
                    <Link href="https://vote.zechub.xyz" target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <MdHowToVote className="h-4 w-4 mr-2" /> Visit Voting Portal
                    </Link>
                  </button>        
                </div>
              </div>
            </ListCardsContent>
          </ListCards>
        )}

        {/* Draft Proposal */}
        {step === 1 && (
          <ListCards>
            <ListCardsHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                  <IoDocumentText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <ListCardsTitle className="text-2xl text-slate-900 dark:text-white">Draft Proposal</ListCardsTitle>
                  <ListCardsDescription className="text-slate-600 dark:text-slate-400">Structure and prepare your proposal for submission</ListCardsDescription>
                </div>
              </div>
            </ListCardsHeader>
            <ListCardsContent className="space-y-6">
              <div className="p-6 bg-amber-100 dark:bg-amber-950 border-2 border-amber-400 dark:border-amber-600 rounded-2xl shadow-sm">
                <p className="text-amber-900 dark:text-amber-200 font-semibold text-lg flex items-center gap-2">
                  Format: Proposals may be written in .Md or .txt format
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-lg text-slate-900 dark:text-white">Recommended 4-Stage Structure:</h3>
                <div className="grid gap-4">
                  <div className="flex gap-4 p-6 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-700 rounded-lg">
                    <div><h4 className="font-semibold text-green-700 dark:text-green-300">Background</h4><p className="text-slate-600 dark:text-slate-300">Provide some history of the general topic / service</p></div>
                  </div>
                  <div className="flex gap-4 p-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <div><h4 className="font-semibold text-blue-700 dark:text-blue-300">Why?</h4><p className="text-slate-600 dark:text-slate-300">Present the driving reason for your proposal. May use bullet points</p></div>
                  </div>
                  <div className="flex gap-4 p-6 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-700 rounded-lg">
                    <div><h4 className="font-semibold text-purple-700 dark:text-purple-300">Proposal</h4><p className="text-slate-600 dark:text-slate-300">Clearly detail your proposal in full</p></div>
                  </div>
                  <div className="flex gap-4 p-6 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-700 rounded-lg">
                    <div><h4 className="font-semibold text-orange-700 dark:text-orange-300">Action</h4><p className="text-slate-600 dark:text-slate-300">What happens upon successful vote - may provide timeline of actions</p></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Get Feedback</h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    <BsChatDots className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <p className="text-blue-800 dark:text-blue-300 mb-2">
                        Share your draft in the ZecHub #proposals channel on Discord for early feedback
                      </p>
                      <Link href="https://discord.gg/zechub" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                        Join Discord <FaDiscord className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proposal Walkthrough Video — restored exactly as you provided */}
              <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <div className="flex-1">
                  <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">Proposal Walkthrough Video</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">Watch a full walkthrough of how to write and structure a proposal</p>
                  <div className="max-w-[420px] mx-auto aspect-video rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 shadow-sm">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/1zGYmT66MzE"
                      title="Proposal Walkthrough"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </ListCardsContent>
          </ListCards>
        )}

        {/* Submitting Proposal */}
        {step === 2 && (
          <ListCards>
            <ListCardsHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                  <MdHowToVote className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <ListCardsTitle className="text-2xl text-slate-900 dark:text-white">Submitting Proposal</ListCardsTitle>
                  <ListCardsDescription className="text-slate-600 dark:text-slate-400">Submit and promote your proposal</ListCardsDescription>
                </div>
              </div>
            </ListCardsHeader>
            <ListCardsContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Post in Discord</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-3">Share your final proposal in #proposals and tag @core-team</p>
                  <Link href="https://discord.gg/zechub" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                    <FaDiscord className="mr-2" /> Open Discord
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Submit on Voting Portal</h3>
                  <p className="text-slate-600 dark:text-slate-300">Use the official ZecHub voting site to create your proposal</p>
                  <button className="cursor-pointer border py-2 px-3 rounded-md hover:bg-purple-300 dark:hover:bg-purple-700 text-slate-900 dark:text-white mt-3">
                    <Link href="https://vote.zechub.xyz" target="_blank" className="flex items-center">
                      Submit Now <FaExternalLinkAlt className="ml-2" />
                    </Link>
                  </button>
        <p className="text-xs text-muted-foreground mt-3">
                    ⚠️ You need to login with either Keplr or Keplr Mobile
                  </p>
                </div>
              </div>
            </ListCardsContent>
          </ListCards>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <FaArrowLeft /> Previous
          </button>
          <button
            onClick={() => setStep(Math.min(2, step + 1))}
            disabled={step === 2}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Next <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

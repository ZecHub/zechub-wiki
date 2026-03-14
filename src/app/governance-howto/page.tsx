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
import { HiUsers } from "react-icons/hi";
import { IoDocumentText } from "react-icons/io5";

export default function GovernanceGuide() {
  const [step, setStep] = useState(0); // 0 = First Steps, 1 = Draft, 2 = Submitting

  const sections = [
    { title: "First Steps", icon: <FaWallet className="h-6 w-6 text-blue-600" /> },
    { title: "Draft Proposal", icon: <IoDocumentText className="h-6 w-6 text-green-600" /> },
    { title: "Submitting Proposal", icon: <MdHowToVote className="h-6 w-6 text-purple-600" /> },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ZecHub DAO Governance</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A comprehensive guide to participating in ZecHub DAO governance
          </p>
        </div>

        {/* Current Section Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {sections[step].icon}
            <h2 className="text-3xl font-semibold">{sections[step].title}</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {step + 1} of 3
          </div>
        </div>

        {/* First Steps */}
        {step === 0 && (
          <ListCards>
            <ListCardsHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaWallet className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <ListCardsTitle className="text-2xl">First Steps</ListCardsTitle>
                  <ListCardsDescription>Get set up to participate in DAO governance</ListCardsDescription>
                </div>
              </div>
            </ListCardsHeader>
            <ListCardsContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-3">Install Keplr Wallet</h3>
                  <p className="text-slate-600 mb-4">Set up your Keplr wallet to interact with the DAO</p>
                  <div className="max-w-[420px] mx-auto aspect-video rounded-xl overflow-hidden border shadow-sm">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/fWagokTEx-Y"
                      title="Keplr Wallet Setup Guide"
                      allowFullScreen
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="/Logo/juno.png" alt="JUNO" className="w-8 h-8" />
                    <h3 className="font-semibold">Acquire JUNO</h3>
                  </div>
                  <p className="text-slate-600">
                    Get JUNO tokens to interact with the daodao contract.
                    Contact core-team members for assistance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">View Open Proposals</h3>
                  <p className="text-slate-600 mb-3">Check out current proposals and voting opportunities</p>
                  <button className="border py-2 px-3 rounded-md hover:bg-yellow-300 dark:hover:bg-yellow-500">
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
                <div className="p-2 bg-green-100 rounded-lg">
                  <IoDocumentText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <ListCardsTitle className="text-2xl">Draft Proposal</ListCardsTitle>
                  <ListCardsDescription>Structure and prepare your proposal for submission</ListCardsDescription>
                </div>
              </div>
            </ListCardsHeader>
            <ListCardsContent className="space-y-6">
              <div className="p-6 bg-amber-100 border-2 border-amber-400 rounded-2xl shadow-sm">
                <p className="text-amber-900 font-semibold text-lg flex items-center gap-2">
                  📋 <strong>Format:</strong> Proposals may be written in .Md or .txt format
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-lg">Recommended 4-Stage Structure:</h3>
                <div className="grid gap-4">
                  <div className="flex gap-4 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <div><h4 className="font-semibold text-green-700">Background</h4><p className="text-slate-600">Provide some history of the general topic / service</p></div>
                  </div>
                  <div className="flex gap-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <div><h4 className="font-semibold text-blue-700">Why?</h4><p className="text-slate-600">Present the driving reason for your proposal. May use bullet points</p></div>
                  </div>
                  <div className="flex gap-4 p-6 bg-purple-50 border border-purple-200 rounded-lg">
                    <div><h4 className="font-semibold text-purple-700">Proposal</h4><p className="text-slate-600">Clearly detail your proposal in full</p></div>
                  </div>
                  <div className="flex gap-4 p-6 bg-orange-50 border border-orange-200 rounded-lg">
                    <div><h4 className="font-semibold text-orange-700">Action</h4><p className="text-slate-600">What happens upon successful vote - may provide timeline of actions</p></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Get Feedback</h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <BsChatDots className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-blue-800 mb-2">
                        Share your draft in the ZecHub <strong>#proposals</strong> Discord channel
                      </p>
                      <button className="border py-2 px-3 rounded-md hover:bg-yellow-300 dark:hover:bg-yellow-500">
                        <Link href="https://discord.com/channels/978714252934258779/1121442347566252043" target="_blank" rel="noopener noreferrer" className="text-blue-800 flex items-center">
                          <FaDiscord className="h-4 w-4 mr-2" /> Join Discord Discussion
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ListCardsContent>
          </ListCards>
        )}

        {/* Submitting Proposal – Proposal Walkthrough video restored here */}
        {step === 2 && (
          <ListCards>
            <ListCardsHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MdHowToVote className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <ListCardsTitle className="text-2xl">Submitting Proposal</ListCardsTitle>
                  <ListCardsDescription>How to submit your proposal on DAO DAO</ListCardsDescription>
                </div>
              </div>
            </ListCardsHeader>
            <ListCardsContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Navigate to Voting Portal</h3>
                  <button className="border py-2 px-3 rounded-md hover:bg-yellow-300 dark:hover:bg-yellow-500">
                    <Link href="https://vote.zechub.xyz" target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <FaExternalLinkAlt className="h-4 w-4 mr-2" /> Open vote.zechub.xyz
                    </Link>
                  </button>
                  <p className="text-xs text-muted-foreground mt-3">
                    ⚠️ You need to login with either Keplr or Keplr Mobile
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Enter Proposal Details</h3>
                  <ul className="text-slate-600 space-y-1">
                    <li>• Proposal Name</li>
                    <li>• Description (your full proposal)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Add Actions</h3>
                  <p className="text-slate-600">
                    Configure actions for DAO Treasury, Governance Configuration, NFT, Smart contracts, etc.
                  </p>
                </div>
              </div>

              {/* Proposal Walkthrough video – restored here */}
              <div className="p-6 border rounded-xl bg-muted/30 mt-6">
                <p className="text-xs text-muted-foreground mb-3">Helpful Video: Proposal Walkthrough</p>
                <div className="max-w-[420px] mx-auto aspect-video rounded-xl overflow-hidden border shadow-sm">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/1zGYmT66MzE"
                    title="Proposal Walkthrough"
                    allowFullScreen
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">
                  ZecHub DAO voting period has a <strong>minimum duration of 5 days</strong>
                </p>
              </div>
            </ListCardsContent>
          </ListCards>
        )}

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border disabled:opacity-40 hover:bg-muted transition-all active:scale-95"
          >
            <FaArrowLeft /> Previous
          </button>

          <div className="text-sm text-muted-foreground font-medium">
            Step {step + 1} of 3
          </div>

          <button
            onClick={() => setStep(Math.min(2, step + 1))}
            disabled={step === 2}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border disabled:opacity-40 hover:bg-muted transition-all active:scale-95"
          >
            Next <FaArrowRight />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-12 border-t mt-16">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <HiUsers className="h-5 w-5" />
            <span>Ready to participate in ZecHub DAO governance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
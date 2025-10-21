import {
  ListCards,
  ListCardsContent,
  ListCardsDescription,
  ListCardsHeader,
  ListCardsTitle,
} from "@/components/UI/GovHowTo/ListCards/ListCards";
import Link from "next/link";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import { FaWallet, FaDiscord, FaExternalLinkAlt } from "react-icons/fa";
import { MdHowToVote } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { HiUsers } from "react-icons/hi";
import { IoDocumentText } from "react-icons/io5";

export const metadata: Metadata = genMetadata({
  title: "ZecHub DAO Governance",
  url: "https://zechub.wiki/governance-howto",
});

export default function GovernanceGuide() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ZecHub DAO Governance</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A comprehensive guide to participating in ZecHub DAO governance,
            from setup to proposal submission
          </p>
        </div>

        {/* First Steps Section */}
        <ListCards className="mb-8">
          <ListCardsHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaWallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <ListCardsTitle className="text-2xl">
                  First Steps
                </ListCardsTitle>
                <ListCardsDescription>
                  Get set up to participate in DAO governance
                </ListCardsDescription>
              </div>
            </div>
          </ListCardsHeader>
          <ListCardsContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Install Keplr Wallet</h3>
                  <p className="text-slate-600 mb-3">
                    Set up your Keplr wallet to interact with the DAO
                  </p>
                  <button className="border py-2 px-3 rounded-md hover:bg-yellow-300 dark:hover:bg-yellow-500">
                    <Link
                      href="https://www.youtube.com/watch?v=fWagokTEx-Y"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <FaExternalLinkAlt className="h-4 w-4 mr-2" />
                      Watch Video Guide
                    </Link>
                  </button>
                  <button className="border py-2 px-3 rounded-md hover:bg-yellow-300 dark:hover:bg-yellow-500">
                    <Link
                      href="https://www.youtube.com/watch?v=1zGYmT66MzE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <FaExternalLinkAlt className="h-4 w-4 mr-2" />
                      Watch Proposal Walkthrough
                    </Link>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Acquire JUNO</h3>
                  <p className="text-slate-600">
                    Get JUNO tokens to interact with the daodao contract.
                    Contact core-team members for assistance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">View Open Proposals</h3>
                  <p className="text-slate-600 mb-3">
                    Check out current proposals and voting opportunities
                  </p>
                  <button className="border py-2 px-3 rounded-md hover:bg-yellow-300 dark:hover:bg-yellow-500">
                    <Link
                      href="https://vote.zechub.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <MdHowToVote className="h-4 w-4 mr-2" />
                      Visit Voting Portal
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </ListCardsContent>
        </ListCards>

        {/* Draft Proposal Section */}
        <ListCards className="mb-8">
          <ListCardsHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <IoDocumentText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <ListCardsTitle className="text-2xl">
                  Draft Proposal
                </ListCardsTitle>
                <ListCardsDescription>
                  Structure and prepare your proposal for submission
                </ListCardsDescription>
              </div>
            </div>
          </ListCardsHeader>
          <ListCardsContent className="space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800">
                <strong>Format:</strong> Proposals may be written in .Md or .txt
                format
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">
                Recommended 4-Stage Structure:
              </h3>
              <div className="grid gap-4">
                <div className="flex gap-4 p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-green-700">Background</h4>
                    <p className="text-slate-600">
                      Provide some history of the general topic / service
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-blue-700">Why?</h4>
                    <p className="text-slate-600">
                      Present the driving reason for your proposal. May use
                      bullet points
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-purple-700">Proposal</h4>
                    <p className="text-slate-600">
                      Clearly detail your proposal in full
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-orange-700">Action</h4>
                    <p className="text-slate-600">
                      What happens upon successful vote - may provide timeline
                      of actions
                    </p>
                  </div>
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
                      Share your draft in the ZecHub <strong>#proposals</strong>{" "}
                      Discord channel
                    </p>
                    <p className="text-blue-700 text-sm mb-3">
                      Feel free to discuss or present your DAO proposal with
                      existing DAO members. They are there to help!
                    </p>
                    <button className="border py-2 px-3 rounded-md hover:bg-yellow-300 dark:hover:bg-yellow-500">
                      <Link
                        href="https://discord.com/channels/978714252934258779/1121442347566252043"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-800 flex items-center"
                      >
                        <FaDiscord className="h-4 w-4 mr-2" />
                        Join Discord Discussion
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ListCardsContent>
        </ListCards>

        {/* Submitting Proposal Section */}
        <ListCards className="mb-8">
          <ListCardsHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MdHowToVote className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <ListCardsTitle className="text-2xl">
                  Submitting Proposal
                </ListCardsTitle>
                <ListCardsDescription>
                  Final steps to submit your proposal for voting
                </ListCardsDescription>
              </div>
            </div>
          </ListCardsHeader>
          <ListCardsContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">
                    Navigate to Voting Portal
                  </h3>
                  <button className="border py-2 px-3 rounded-md hover:bg-yellow-300 dark:hover:bg-yellow-500">
                    <Link
                      href="https://vote.zechub.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <FaExternalLinkAlt className="h-4 w-4 mr-2" />
                      Open vote.zechub.xyz
                    </Link>
                  </button>
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
                    Configure actions for DAO Treasury, Governance
                    Configuration, NFT, Smart contracts, etc.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <p className="text-red-800">
                  ZecHub DAO voting period has a{" "}
                  <strong>minimum duration of 5 days</strong>
                </p>
              </div>
            </div>
          </ListCardsContent>
        </ListCards>

        {/* Footer */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <HiUsers className="h-5 w-5" />
            <span>Ready to participate in ZecHub DAO governance</span>
          </div>
        </div>
      </div>
    </div>
  );
}

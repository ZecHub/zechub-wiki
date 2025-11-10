"use client";

import { useState } from "react";
import MemberModal from "./member-modal";
import Link from "next/link";

interface MemberCardProps {
  member: {
    name: string;
    description: string;
    imgUrl: string;
    social: any;
    role: string;
    zcashAddress: string;
  };
}

function base64UrlEncode(str: string) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export default function MemberCard({ member }: MemberCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState("");

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSend = () => {
    const encodedMemo = base64UrlEncode(message);
    const uri = `zcash:${member.zcashAddress}?amount=0.01&memo=${encodedMemo}`;
    window.location.href = uri;
    handleFlip();
  };

  return (
    <>
      <div className="relative min-h-[400px] perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front Side */}
          <div
            className="absolute w-full h-full backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="bg-gradient-to-br dark:from-slate-800/40 dark:to-slate-900/40 border border-amber-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 dark:from-amber-400 to-blue-400 dark:to-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-xl origin-left"></div>

              <div className="mb-4 flex justify-center">
                <img
                  src={member.imgUrl || "/placeholder.svg"}
                  alt={member.name}
                  className="w-24 h-24 rounded-full border-2 border-amber-500/50 object-cover"
                />
              </div>
              <h3 className="text-xl font-bold dark:text-yellow-300 mb-2 text-center">
                {member.name}
              </h3>
              <p className="text-slate-400 text-sm mb-6 min-h-[20px] text-center">
                {member.role ? member.role : "Member"}
              </p>
              <div className="flex justify-center space-x-4 my-4">
                {member.social?.map((social: any, index: number) => {
                  const { name, url, icon } = social;
                  return (
                    <Link
                      key={index}
                      href={url}
                      target="_blank"
                      className="text-gray-500 dark:text-gray-200 hover:text-blue-500 transition-colors"
                    >
                      {icon}
                    </Link>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 hover:border-amber-500/50 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  Read More
                </button>
                <button
                  onClick={handleFlip}
                  className="flex-1 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 hover:border-amber-500/50 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div
            className="absolute w-full h-full backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="bg-gradient-to-br dark:from-slate-800/40 dark:to-slate-900/40 border border-amber-500/20 rounded-xl p-6 backdrop-blur-sm h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl mb-3 font-bold text-yellow-300">
                  Message to {member.name}
                </h3>
                <div className="relative">
                  <textarea
                    className="w-full p-3 border border-amber-500/20 rounded-lg dark:text-white dark:bg-slate-800/40 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                    rows={6}
                    placeholder="Type your message..."
                    maxLength={512}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="absolute bottom-2 right-2 text-slate-400 text-sm bg-slate-800/80 px-2 py-1 rounded">
                    {message.length}/512
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    handleFlip();
                    setMessage("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="px-4 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 hover:scale-105 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800 transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MemberModal
        member={member}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

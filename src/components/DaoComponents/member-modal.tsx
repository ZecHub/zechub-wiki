"use client";

import { useState } from "react";

interface MemberModalProps {
  member: {
    name: string;
    description: string;
    imgUrl: string;
    social: string;
    role: string;
    zcashAddress: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

function base64UrlEncode(str: string) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export default function MemberModal({
  member,
  isOpen,
  onClose,
}: MemberModalProps) {
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
    setMessage("");
  };

  const handleClose = () => {
    setIsFlipped(false);
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative max-w-md w-full"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-full transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front Side */}
            <div className="w-full" style={{ backfaceVisibility: "hidden" }}>
              <div className="bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-amber-500/30 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Member profile */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src={member.imgUrl || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full border-3 border-amber-500/50 object-cover mb-6"
                  />
                  <h2 className="text-2xl font-bold dark:text-yellow-300 mb-2">
                    {member.name}
                  </h2>
                  <p className="text-amber-400 font-semibold mb-4">
                    {member.description}
                  </p>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Learn more about {member.name}&apos;s contributions to
                    ZecHub DAO and their role in the community.
                  </p>

                  {/* Action buttons */}
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={handleClose}
                      className="flex-1 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 hover:border-amber-500/50 rounded-lg font-medium transition-all duration-300"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleFlip}
                      className="flex-1 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-lg font-medium transition-all duration-300"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div
              className="absolute top-0 left-0 w-full"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-amber-500/30 rounded-2xl p-8 shadow-2xl relative">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="flex flex-col">
                  <h3 className="text-2xl mb-4 font-bold text-yellow-300">
                    Message to {member.name}
                  </h3>
                  <div className="relative mb-6">
                    <textarea
                      className="w-full p-3 border border-amber-500/20 rounded-lg text-white dark:bg-slate-800/40 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none"
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

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        handleFlip();
                        setMessage("");
                      }}
                      className="px-4 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 focus:ring-4 focus:outline-none focus:ring-red-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSend}
                      className="px-4 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 hover:scale-105 focus:ring-4 focus:outline-none focus:ring-green-300 transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

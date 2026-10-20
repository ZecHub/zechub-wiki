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
        className="fixed inset-0 cursor-pointer bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
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
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 relative dark:border-white/10 dark:bg-[#0b1626]">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 cursor-pointer text-slate-400 hover:text-brand dark:hover:text-brand-soft transition-colors"
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
                    className="h-32 w-32 rounded-full object-cover ring-2 ring-brand/40 ring-offset-2 ring-offset-white dark:ring-offset-[#0b1626] mb-6"
                  />
                  <h2 className="m-0 text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    {member.name}
                  </h2>
                  <p className="text-slate-700 dark:text-slate-200 font-medium mb-4">
                    {member.description}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                    Learn more about {member.name}&apos;s contributions to
                    ZecHub DAO and their role in the community.
                  </p>

                  {/* Action buttons */}
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={handleClose}
                      className="flex-1 cursor-pointer rounded-lg border border-brand/70 bg-brand/15 px-4 py-2 font-semibold text-brand shadow-sm shadow-brand/10 transition-colors hover:border-brand hover:bg-brand/25 dark:text-white"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleFlip}
                      className="flex-1 cursor-pointer rounded-lg border border-brand/70 bg-brand/15 px-4 py-2 font-semibold text-brand shadow-sm shadow-brand/10 transition-colors hover:border-brand hover:bg-brand/25 dark:text-white"
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
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl relative dark:border-white/10 dark:bg-[#0b1626]">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 cursor-pointer text-slate-400 hover:text-brand dark:hover:text-brand-soft transition-colors"
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
                  <h3 className="m-0 text-2xl mb-4 font-semibold text-slate-900 dark:text-white">
                    Message to {member.name}
                  </h3>
                  <div className="relative mb-6">
                    <textarea
                      className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/[0.04] dark:text-white"
                      rows={6}
                      placeholder="Type your message..."
                      maxLength={512}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="absolute bottom-2 right-2 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-300">
                      {message.length}/512
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        handleFlip();
                        setMessage("");
                      }}
                      className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSend}
                      className="cursor-pointer rounded-lg border border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
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

"use client";

import { useId, useState } from "react";
import MemberModal from "./member-modal";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  encodeZip321Memo,
  isShieldedAddress,
  MAX_MEMO_BYTES,
} from "@/lib/zip321";
import { openPaymentUri } from "@/lib/openPaymentUri";

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

export default function MemberCard({ member }: MemberCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const messageBytes = new TextEncoder().encode(message).length;
  const isMessageTooLong = messageBytes > MAX_MEMO_BYTES;
  const canMessage = isShieldedAddress(member.zcashAddress);
  const unavailableId = useId();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSend = () => {
    if (!canMessage || !message || isMessageTooLong) return;
    try {
      const encodedMemo = encodeZip321Memo(message, member.zcashAddress);
      openPaymentUri(`zcash:${member.zcashAddress}?amount=0.01&memo=${encodedMemo}`);
      handleFlip();
    } catch {
      // Transparent address or encode failure: do not navigate.
    }
  };

  return (
    <>
      <div className="relative min-h-[340px] perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute w-full h-full backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-6 transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40">
              <div className="mb-4 flex justify-center">
                <Image
                  src={member.imgUrl || "/placeholder.svg"}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-brand/40 ring-offset-2 ring-offset-slate-50 dark:ring-offset-transparent"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="m-0 mb-2 text-center text-lg font-semibold text-slate-900 dark:text-white">
                {member.name}
              </h3>
              <div className="mb-4 flex justify-center">
                <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[13px] text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  {member.role ? member.role : "Member"}
                </span>
              </div>
              <div className="my-3 flex justify-center gap-4">
                {member.social?.map((social: any, index: number) => {
                  const { url, icon } = social;
                  return (
                    <Link
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name ?? "Member"} on ${(() => {
                        try {
                          const h = new URL(String(url)).hostname.replace(/^www\./, "");
                          return h === "x.com" || h === "twitter.com" ? "X" : h;
                        } catch {
                          return "social profile";
                        }
                      })()}`}
                      className="inline-flex p-1.5 text-slate-500 transition-colors hover:text-brand dark:text-slate-300 dark:hover:text-brand-soft"
                    >
                      {icon}
                    </Link>
                  );
                })}
              </div>
              {!canMessage && (
                <p
                  id={unavailableId}
                  className="mt-auto mb-2 text-center text-xs text-slate-600 dark:text-slate-400"
                >
                  Messaging unavailable: no shielded address listed.
                </p>
              )}
              <div className={`flex gap-3 pt-4 ${canMessage ? "mt-auto" : ""}`}>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 cursor-pointer rounded-lg border border-brand/70 bg-brand/15 px-4 py-2 text-sm font-semibold text-brand shadow-sm shadow-brand/10 transition-colors hover:border-brand hover:bg-brand/25 dark:text-white"
                >
                  Read More
                </button>
                <button
                  onClick={handleFlip}
                  disabled={!canMessage}
                  aria-describedby={canMessage ? undefined : unavailableId}
                  className="flex-1 cursor-pointer rounded-lg border border-brand/70 bg-brand/15 px-4 py-2 text-sm font-semibold text-brand shadow-sm shadow-brand/10 transition-colors hover:border-brand hover:bg-brand/25 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
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
            <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-6 dark:border-white/10 dark:bg-[#0b1626]">
              <div>
                <h3 className="m-0 mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                  Message to {member.name}
                </h3>
                <div className="relative">
                  <textarea
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/15 dark:bg-white/[0.04] dark:text-white"
                    rows={6}
                    placeholder="Type your message..."
                    aria-invalid={isMessageTooLong || undefined}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="absolute bottom-2 right-2 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-300">
                    {messageBytes}/{MAX_MEMO_BYTES} bytes
                  </div>
                </div>
                {isMessageTooLong && (
                  <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Shorten your message to fit the 512-byte limit.
                  </p>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-3">
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
                  disabled={!canMessage || isMessageTooLong || !message}
                  className="cursor-pointer rounded-lg border border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
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

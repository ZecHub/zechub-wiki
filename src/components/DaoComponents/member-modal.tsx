"use client";

import { useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import * as Dialog from "@radix-ui/react-dialog";
import {
  encodeZip321Memo,
  isShieldedAddress,
  MAX_MEMO_BYTES,
} from "@/lib/zip321";
import { openPaymentUri } from "@/lib/openPaymentUri";

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

// The site removes focus outlines globally (globals.css), so the dialog's
// controls that have no focus style of their own draw this ring instead.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

export default function MemberModal({
  member,
  isOpen,
  onClose,
}: MemberModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const messageBytes = new TextEncoder().encode(message).length;
  const isMessageTooLong = messageBytes > MAX_MEMO_BYTES;
  const canMessage = isShieldedAddress(member.zcashAddress);
  const unavailableId = useId();
  const openerRef = useRef<HTMLElement | null>(null);
  const messageButtonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // The face turned away is hidden from screen readers and its controls leave
  // the Tab order, so the dialog's focus trap cycles through the shown face.
  const frontTabIndex = isFlipped ? -1 : undefined;
  const backTabIndex = isFlipped ? undefined : -1;

  // Turn the card over and move focus to the face that is now in front.
  const handleFlip = () => {
    const showMessage = !isFlipped;
    flushSync(() => setIsFlipped(showMessage));
    (showMessage ? textareaRef : messageButtonRef).current?.focus();
  };

  const handleSend = () => {
    if (!canMessage || !message || isMessageTooLong) return;
    try {
      const encodedMemo = encodeZip321Memo(message, member.zcashAddress);
      openPaymentUri(`zcash:${member.zcashAddress}?amount=0.01&memo=${encodedMemo}`);
      handleFlip();
      setMessage("");
    } catch {
      // Transparent address or encode failure: do not navigate.
    }
  };

  const handleClose = () => {
    setIsFlipped(false);
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <div
        className="fixed inset-0 cursor-pointer bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden="true"
      />

      <Dialog.Content
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onOpenAutoFocus={() => {
          openerRef.current = document.activeElement as HTMLElement | null;
        }}
        onCloseAutoFocus={(event) => {
          // Give focus back to the button that opened the dialog.
          event.preventDefault();
          openerRef.current?.focus();
        }}
      >
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
            <div
              className="w-full"
              style={{ backfaceVisibility: "hidden" }}
              aria-hidden={isFlipped || undefined}
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 relative dark:border-white/10 dark:bg-[#0b1626]">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  tabIndex={frontTabIndex}
                  className={`absolute top-4 right-4 cursor-pointer rounded-md text-slate-400 hover:text-brand dark:hover:text-brand-soft transition-colors ${focusRing}`}
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

                <div className="flex flex-col items-center text-center">
                  <img
                    src={member.imgUrl || "/placeholder.svg"}
                    alt={member.name}
                    className="h-32 w-32 rounded-full object-cover ring-2 ring-brand/40 ring-offset-2 ring-offset-white dark:ring-offset-[#0b1626] mb-6"
                  />
                  <Dialog.Title className="m-0 text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    {member.name}
                  </Dialog.Title>
                  <Dialog.Description className="text-slate-700 dark:text-slate-200 font-medium mb-4">
                    {member.description}
                  </Dialog.Description>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                    Learn more about {member.name}&apos;s contributions to
                    ZecHub DAO and their role in the community.
                  </p>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={handleClose}
                      tabIndex={frontTabIndex}
                      className={`flex-1 cursor-pointer rounded-lg border border-brand/70 bg-brand/15 px-4 py-2 font-semibold text-brand shadow-sm shadow-brand/10 transition-colors hover:border-brand hover:bg-brand/25 dark:text-white ${focusRing}`}
                    >
                      Close
                    </button>
                    <button
                      ref={messageButtonRef}
                      onClick={handleFlip}
                      tabIndex={frontTabIndex}
                      disabled={!canMessage}
                      aria-describedby={canMessage ? undefined : unavailableId}
                      className={`flex-1 cursor-pointer rounded-lg border border-brand/70 bg-brand/15 px-4 py-2 font-semibold text-brand shadow-sm shadow-brand/10 transition-colors hover:border-brand hover:bg-brand/25 dark:text-white disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
                    >
                      Message
                    </button>
                  </div>
                  {!canMessage && (
                    <p
                      id={unavailableId}
                      className="mt-3 rounded-lg bg-white/90 px-3 py-1.5 text-sm text-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
                    >
                      Messaging unavailable: no shielded address listed.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              className="absolute top-0 left-0 w-full"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              aria-hidden={!isFlipped || undefined}
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl relative dark:border-white/10 dark:bg-[#0b1626]">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  tabIndex={backTabIndex}
                  className={`absolute top-4 right-4 cursor-pointer rounded-md text-slate-400 hover:text-brand dark:hover:text-brand-soft transition-colors ${focusRing}`}
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
                      ref={textareaRef}
                      tabIndex={backTabIndex}
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
                    <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">
                      Shorten your message to fit the 512-byte limit.
                    </p>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        handleFlip();
                        setMessage("");
                      }}
                      tabIndex={backTabIndex}
                      className={`cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10 ${focusRing}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSend}
                      tabIndex={backTabIndex}
                      disabled={!canMessage || isMessageTooLong || !message}
                      className={`cursor-pointer rounded-lg border border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

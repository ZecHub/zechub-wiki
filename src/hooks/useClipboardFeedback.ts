"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function useClipboardFeedback(text: string) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const [isCopying, setIsCopying] = useState(false);
  const mounted = useRef(false);
  const inFlight = useRef(false);
  const attempt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    // Invalidate feedback without allowing a second, overlapping clipboard write.
    attempt.current += 1;
    clearTimer();
    setStatus("idle");
  }, [clearTimer]);

  useEffect(() => {
    mounted.current = true;
    reset();
    return () => {
      mounted.current = false;
      attempt.current += 1;
      clearTimer();
    };
  }, [text, reset, clearTimer]);

  const copy = useCallback(async () => {
    if (!text || inFlight.current) return;

    reset();
    const currentAttempt = attempt.current;
    inFlight.current = true;
    setIsCopying(true);

    try {
      await navigator.clipboard.writeText(text);
      if (!mounted.current || currentAttempt !== attempt.current) return;
      setStatus("copied");
      timer.current = setTimeout(() => {
        timer.current = null;
        setStatus("idle");
      }, 2000);
    } catch {
      if (mounted.current && currentAttempt === attempt.current) {
        setStatus("error");
      }
    } finally {
      inFlight.current = false;
      if (mounted.current) setIsCopying(false);
    }
  }, [text, reset]);

  return { copy, status, isCopying, reset };
}

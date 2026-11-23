"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  DATA_ATTRIBUTE,
  DEFAULT_INTERFACE,
  INTERFACES,
  applyInterface,
  saveInterface,
} from "@/lib/interfaces";

export default function DesktopInterfaceHost({ locale }: { locale: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [active, setActive] = useState(DEFAULT_INTERFACE);
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () =>
      setActive(root.getAttribute(DATA_ATTRIBUTE) || DEFAULT_INTERFACE);
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, {
      attributes: true,
      attributeFilter: [DATA_ATTRIBUTE],
    });
    return () => observer.disconnect();
  }, []);

  const option = INTERFACES.find((item) => item.id === active && item.embedUrl);
  const open = Boolean(option?.embedUrl);
  const theme = resolvedTheme === "light" ? "paper" : "vault";
  const localePath = locale === "en" ? "" : `/${locale}`;

  useEffect(() => {
    if (open) return;
    setFrameSrc(null);
    setFrameLoaded(false);
    setVisible(false);
    setClosing(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setVisible(true), 10);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || frameSrc || !option?.embedUrl) return;
    const url = new URL(`${option.embedUrl}${localePath}`);
    url.searchParams.set("theme", theme);
    url.searchParams.set("parentOrigin", window.location.origin);
    setFrameSrc(url.toString());
  }, [open, frameSrc, option?.embedUrl, localePath, theme]);

  useEffect(() => {
    if (!open || !frameLoaded || !option?.embedUrl) return;
    const frame = frameRef.current;
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage(
      { type: "zechub:theme", theme },
      new URL(option.embedUrl).origin,
    );
  }, [open, frameLoaded, option?.embedUrl, theme]);

  const closeDesktop = useCallback(
    (next: string) => {
      if (closing) return;
      setClosing(true);
      window.setTimeout(() => {
        applyInterface(next);
        saveInterface(next);
        setActive(next);
        setClosing(false);
      }, 220);
    },
    [closing],
  );

  useEffect(() => {
    if (!open || !option?.embedUrl) return;
    const appOrigin = new URL(option.embedUrl).origin;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== appOrigin) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      if (!event.data) return;
      if (event.data.type === "zechub:theme") {
        const next: unknown = event.data.theme;
        if (next !== "paper" && next !== "vault") return;
        setTheme(next === "paper" ? "light" : "dark");
        return;
      }
      if (event.data.type === "zechub:switch-interface") {
        const next: unknown = event.data.interface;
        if (next !== "classic" && next !== "reader") return;
        closeDesktop(next);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open, option?.embedUrl, setTheme, closeDesktop]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeDesktop(DEFAULT_INTERFACE);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeDesktop]);

  if (!open || !option?.embedUrl) return null;
  const embedUrl = option.embedUrl;

  const sendTheme = () => {
    frameRef.current?.contentWindow?.postMessage(
      { type: "zechub:theme", theme },
      new URL(embedUrl).origin,
    );
  };

  return (
    <div
      className={`fixed inset-0 z-[10000] transition-opacity duration-200 ${
        theme === "paper" ? "bg-[#f4efe4]" : "bg-black"
      } ${visible && !closing ? "opacity-100" : "opacity-0"}`}
    >
      {frameSrc ? (
        <iframe
          ref={frameRef}
          src={frameSrc}
          title="ZecHub Desktop"
          allow="clipboard-write; fullscreen"
          onLoad={() => {
            setFrameLoaded(true);
            sendTheme();
          }}
          className={`h-full w-full border-0 transition-opacity duration-300 ${
            frameLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
      {!frameLoaded ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            aria-hidden="true"
            className={`h-6 w-6 animate-spin rounded-full border-2 border-t-transparent ${
              theme === "paper" ? "border-stone-400" : "border-white/40"
            }`}
          />
        </div>
      ) : null}
    </div>
  );
}

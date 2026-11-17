"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
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

  useEffect(() => {
    if (!open || !option?.embedUrl) return;
    const appOrigin = new URL(option.embedUrl).origin;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== appOrigin) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      if (!event.data || event.data.type !== "zechub:theme") return;
      const next: unknown = event.data.theme;
      if (next !== "paper" && next !== "vault") return;
      setTheme(next === "paper" ? "light" : "dark");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open, option?.embedUrl, setTheme]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      applyInterface(DEFAULT_INTERFACE);
      saveInterface(DEFAULT_INTERFACE);
      setActive(DEFAULT_INTERFACE);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open || !option?.embedUrl) return null;
  const embedUrl = option.embedUrl;

  const exit = () => {
    applyInterface(DEFAULT_INTERFACE);
    saveInterface(DEFAULT_INTERFACE);
    setActive(DEFAULT_INTERFACE);
  };

  const sendTheme = () => {
    frameRef.current?.contentWindow?.postMessage(
      { type: "zechub:theme", theme },
      new URL(embedUrl).origin,
    );
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black">
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
          className="h-full w-full border-0"
        />
      ) : null}
      <button
        type="button"
        onClick={exit}
        className="fixed right-3 top-9 z-[10001] flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur transition-colors hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X aria-hidden="true" className="h-3.5 w-3.5" />
        Exit desktop
      </button>
    </div>
  );
}

"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

interface LiteYouTubeProps {
  videoId: string;
  title?: string;
  /** Passed through to the placeholder button and, once clicked, the iframe. */
  className?: string;
  style?: CSSProperties;
  /** Mount the iframe straight away (used after an explicit click on a video card). */
  startActive?: boolean;
}

/**
 * Click-to-load YouTube facade. Renders a self-contained branded placeholder
 * (no network) until the user clicks; only then is a
 * youtube-nocookie.com iframe mounted. This keeps every visitor's browser from
 * contacting Google/YouTube on page load — the embed happens on explicit intent.
 *
 * className/style are spread onto whichever element is rendered so each call
 * site keeps the exact sizing its original <iframe> used.
 */
export default function LiteYouTube({
  videoId,
  title = "YouTube video",
  className,
  style,
  startActive = false,
}: LiteYouTubeProps) {
  const [activated, setActivated] = useState(startActive);
  // Cover image served from this site (public/video-thumbs, see scripts/video-thumbnails.mjs).
  // It never contacts YouTube; when the file does not exist the dark placeholder is shown.
  const [hasThumb, setHasThumb] = useState(true);
  const thumbRef = useRef<HTMLImageElement>(null);
  // A missing file can fail before React attaches onError, so check once after mount too.
  useEffect(() => {
    const img = thumbRef.current;
    if (img && img.complete && img.naturalWidth === 0) setHasThumb(false);
  }, []);

  if (activated) {
    return (
      <iframe
        className={className}
        style={style}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={title}
        // Send only the origin (never the page path) to Google. no-referrer
        // makes YouTube's player error out ("video player configuration error"),
        // so origin-only is the minimum that keeps opt-in playback working.
        referrerPolicy="strict-origin-when-cross-origin"
        // Least privilege: only what a YouTube embed needs to play + go fullscreen.
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      aria-label={`Play video: ${title}`}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 16,
        border: "none",
        cursor: "pointer",
        textAlign: "center",
        background:
          "radial-gradient(120% 120% at 50% 0%, #241633 0%, #0d1117 70%)",
        color: "#f4b728",
        ...style,
      }}
    >
      {hasThumb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={thumbRef}
          src={`/video-thumbs/${videoId}.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={() => setHasThumb(false)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      {hasThumb && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(13,17,23,0.35) 0%, rgba(13,17,23,0) 45%)",
          }}
        />
      )}
      <svg width="52" height="52" viewBox="0 0 68 48" aria-hidden="true" style={{ position: "relative" }}>
        <path
          d="M66.5 7.7a8.6 8.6 0 0 0-6-6C55 0 34 0 34 0S13 0 7.5 1.6a8.6 8.6 0 0 0-6 6A90 90 0 0 0 0 24a90 90 0 0 0 1.5 16.3 8.6 8.6 0 0 0 6 6C13 48 34 48 34 48s21 0 26.5-1.6a8.6 8.6 0 0 0 6-6A90 90 0 0 0 68 24a90 90 0 0 0-1.5-16.3z"
          fill="#f4b728"
        />
        <path d="M27 34V14l18 10-18 10z" fill="#0d1117" />
      </svg>
      {hasThumb ? (
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "22px 14px 10px",
            fontSize: 11,
            lineHeight: 1.4,
            textAlign: "left",
            color: "#c9d4e3",
            background:
              "linear-gradient(to top, rgba(13,17,23,0.92), rgba(13,17,23,0))",
          }}
        >
          Click to load from YouTube. Nothing is contacted until you tap.
        </span>
      ) : (
        <>
          <span style={{ position: "relative", fontSize: 13, fontWeight: 600, letterSpacing: "0.02em" }}>
            {title}
          </span>
          <span
            style={{
              position: "relative",
              fontSize: 11,
              fontWeight: 400,
              color: "#8b9eb7",
              maxWidth: "34ch",
            }}
          >
            Click to load from YouTube — Google will receive your IP address and
            the video ID. Nothing is contacted until you tap.
          </span>
        </>
      )}
    </button>
  );
}

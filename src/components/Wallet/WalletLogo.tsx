"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// Wallet logos arrive in many shapes: transparent marks with wide margins, wordmarks, black
// artwork that vanishes on a dark page, or a mark on a light sheet. Each one is cropped to its
// artwork, its light backdrop is made transparent, near-black artwork is lightened for dark
// mode, and CSS then gives every logo the same visual box.
type Variants = { light: string; dark: string } | null;

const FRAME = "!my-0 h-auto max-h-14 w-auto max-w-[9.5rem] object-contain";

function process(img: HTMLImageElement): Variants {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h || w * h > 4_000_000) return null;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h);
  const d = data.data;

  const bounds = (minAlpha: number) => {
    let x0 = w, x1 = -1, y0 = h, y1 = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (d[(y * w + x) * 4 + 3] > minAlpha) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    return x1 < 0 ? null : { x0, x1, y0, y1 };
  };

  let box = bounds(40);
  if (!box) return null;

  // Light backdrop (white or pale tint) touching the artwork's bounding box: make it transparent.
  const si = (box.y0 + 2) * w + box.x0 + 2;
  const seed = [d[si * 4], d[si * 4 + 1], d[si * 4 + 2]];
  if (d[si * 4 + 3] > 200 && Math.min(...seed) > 215) {
    const near = (p: number) =>
      d[p * 4 + 3] > 200 &&
      Math.abs(d[p * 4] - seed[0]) < 20 &&
      Math.abs(d[p * 4 + 1] - seed[1]) < 20 &&
      Math.abs(d[p * 4 + 2] - seed[2]) < 20;
    const seen = new Uint8Array(w * h);
    const stack: number[] = [];
    const push = (x: number, y: number) => {
      const p = y * w + x;
      if (!seen[p] && near(p)) {
        seen[p] = 1;
        stack.push(p);
      }
    };
    for (let x = box.x0; x <= box.x1; x++) { push(x, box.y0); push(x, box.y1); }
    for (let y = box.y0; y <= box.y1; y++) { push(box.x0, y); push(box.x1, y); }
    while (stack.length) {
      const p = stack.pop() as number;
      d[p * 4 + 3] = 0;
      const x = p % w;
      const y = (p - x) / w;
      if (x > box.x0) push(x - 1, y);
      if (x < box.x1) push(x + 1, y);
      if (y > box.y0) push(x, y - 1);
      if (y < box.y1) push(x, y + 1);
    }
    box = bounds(40) ?? box;
  }

  const bw = box.x1 - box.x0 + 1;
  const bh = box.y1 - box.y0 + 1;
  let opaque = 0;
  let dark = 0;
  for (let y = box.y0; y <= box.y1; y++) {
    for (let x = box.x0; x <= box.x1; x++) {
      const i = (y * w + x) * 4;
      if (d[i + 3] > 40) {
        opaque++;
        if (Math.max(d[i], d[i + 1], d[i + 2]) < 80) dark++;
      }
    }
  }
  // A logo that fills its whole box is an app icon with its own background: keep it as is in dark mode.
  const isAppIcon = opaque / (bw * bh) > 0.8;

  const out = document.createElement("canvas");
  out.width = bw;
  out.height = bh;
  const octx = out.getContext("2d");
  if (!octx) return null;
  ctx.putImageData(data, 0, 0);
  octx.drawImage(c, box.x0, box.y0, bw, bh, 0, 0, bw, bh);
  const light = out.toDataURL("image/png");

  let darkUrl = light;
  if (!isAppIcon && dark / Math.max(opaque, 1) > 0.02) {
    const od = octx.getImageData(0, 0, bw, bh);
    const q = od.data;
    for (let i = 0; i < q.length; i += 4) {
      const m = Math.max(q[i], q[i + 1], q[i + 2]);
      const sat = m - Math.min(q[i], q[i + 1], q[i + 2]);
      if (m < 130 && sat < 50) {
        const t = m < 80 ? 1 : (130 - m) / 50;
        q[i] = q[i] + (232 - q[i]) * t;
        q[i + 1] = q[i + 1] + (238 - q[i + 1]) * t;
        q[i + 2] = q[i + 2] + (245 - q[i + 2]) * t;
      }
    }
    octx.putImageData(od, 0, 0);
    darkUrl = out.toDataURL("image/png");
  }
  return { light, dark: darkUrl };
}

export default function WalletLogo({ src, alt }: { src: string; alt: string }) {
  const [v, setV] = useState<Variants>(null);

  useEffect(() => {
    let alive = true;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const r = process(img);
        if (alive) setV(r);
      } catch {
        /* keep the original */
      }
    };
    img.src = src;
    return () => {
      alive = false;
    };
  }, [src]);

  if (v) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={v.light} alt={alt} className={`${FRAME} dark:hidden`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={v.dark} alt={alt} className={`${FRAME} hidden dark:block`} />
      </>
    );
  }
  return <Image className={FRAME} width={260} height={180} src={src} alt={alt} priority={false} />;
}

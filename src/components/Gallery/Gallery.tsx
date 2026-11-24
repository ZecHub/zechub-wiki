'use client';

import Image from "next/image";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

type GalleryImage = { src: string; alt: string; caption?: string };

// Content pages pick a set by name, e.g. <Gallery set="infographics" />; unknown names show the wallpapers.
// A caption marks a captioned set: it drives the thumbnail crop (top-aligned so titles show),
// the lightbox alt text and the download name (the file's own name).
const WALLPAPERS: GalleryImage[] = Array.from({ length: 15 }, (_, i) => ({
  src: `/gallery/${i + 1}.png`,
  alt: `Zcash wallpaper ${i + 1}`,
}));

// These files in public/content-images are referenced only from here; don't delete them as unreferenced.
const INFOGRAPHICS: GalleryImage[] = [
  { src: "/content-images/Encrypted-Memos-Infographic-b3c464eaf1.webp", alt: "Zcash Encrypted Memos infographic", caption: "Zcash Encrypted Memos" },
  { src: "/content-images/Shielded-by-default-60f41919f5.webp", alt: "Shielded-by-default infographic", caption: "Shielded-by-default" },
  { src: "/content-images/What-is-Zcash-Sync-Infographic-56f41eaa08.webp", alt: "Zcash Syncing infographic", caption: "Zcash Syncing" },
  { src: "/content-images/Zcash-FROST-Infographic-470ed34be6.webp", alt: "Zcash FROST infographic", caption: "Zcash FROST" },
  { src: "/content-images/Zcash-Roadmap-1c13ce1f2b.webp", alt: "Zcash Roadmap infographic", caption: "Zcash Roadmap" },
  { src: "/content-images/Zcash-Timeline-141809aa1c.webp", alt: "Zcash Timeline infographic", caption: "Zcash Timeline" },
  { src: "/content-images/Zcash-Value-Pools-b79351c9b4.webp", alt: "Zcash Value Pools infographic", caption: "Zcash Value Pools" },
  { src: "/content-images/Zebra-Node-Compile-413743711e.webp", alt: "Zebra Node Compile infographic", caption: "Zebra Node Compile" },
];

const TABS = [
  { id: "wallpapers", label: "Wallpapers", href: "/glossary-and-faqs/gallery", count: WALLPAPERS.length },
  { id: "infographics", label: "Infographics", href: "/glossary-and-faqs/gallery/infographics", count: INFOGRAPHICS.length },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";
const overlayButton =
  "flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

const Gallery: React.FC<{ set?: string }> = ({ set = "wallpapers" }) => {
  const active = set === "infographics" ? "infographics" : "wallpapers";
  const galleryImages = active === "infographics" ? INFOGRAPHICS : WALLPAPERS;
  const captioned = active === "infographics";

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedImage = selectedIndex !== null ? galleryImages[selectedIndex] : null;

  const closeModal = () => setSelectedIndex(null);
  const goToPrevious = () => {
    if (selectedIndex !== null) setSelectedIndex(selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1);
  };
  const goToNext = () => {
    if (selectedIndex !== null) setSelectedIndex(selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1);
  };

  const downloadName = selectedImage?.caption
    ? selectedImage.src.split("/").pop()!
    : `zechub-wallpaper-${(selectedIndex ?? 0) + 1}.png`;

  return (
    <>
      <nav
        aria-label="Gallery sections"
        className="not-prose mb-6 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-white/10 dark:bg-white/5"
      >
        {TABS.map((tab) => {
          const on = tab.id === active;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={on ? "page" : undefined}
              className={`rounded-md px-4 py-2 text-sm font-medium no-underline transition-colors ${focusRing} ${
                on
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{tab.count}</span>
            </Link>
          );
        })}
      </nav>

      <ul
        className={`not-prose m-0 grid list-none gap-3 p-0 ${
          captioned ? "grid-cols-1 imd:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {galleryImages.map((image, index) => (
          <li key={image.src} className="m-0 min-w-0 p-0">
            <button
              type="button"
              aria-label={`Open ${image.caption ?? `Zcash wallpaper ${index + 1}`}`}
              onClick={() => setSelectedIndex(index)}
              className={`group block w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-left transition-colors hover:border-brand dark:border-white/10 dark:bg-slate-800/60 dark:hover:border-brand ${focusRing}`}
            >
              <span className={`relative block w-full overflow-hidden ${captioned ? "aspect-[4/3]" : "aspect-video"}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className={`object-cover ${captioned ? "object-top" : ""} motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]`}
                  sizes="(max-width: 830px) 50vw, 33vw"
                  priority={index < 3}
                  quality={80}
                />
              </span>
              {image.caption && (
                <span className="block border-t border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-800 dark:border-white/10 dark:text-slate-100">
                  {image.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {selectedImage && selectedIndex !== null && (
        <Dialog
          open
          onClose={closeModal}
          initialFocus={closeButtonRef}
          aria-label={selectedImage.caption ?? `Zcash wallpaper ${selectedIndex + 1}`}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-3 imd:p-6"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              goToPrevious();
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              goToNext();
            }
          }}
        >
          <DialogPanel className="flex w-full max-w-5xl flex-col gap-3">
            <div className="flex items-center justify-between gap-4 text-white">
              <p className="m-0 min-w-0 truncate text-sm font-medium">
                {selectedImage.caption ?? `Wallpaper ${selectedIndex + 1}`}
                <span className="ml-3 text-white/60">
                  {selectedIndex + 1} / {galleryImages.length}
                </span>
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close image preview"
                onClick={closeModal}
                className={overlayButton}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
              />
              <button
                type="button"
                aria-label="Previous image"
                onClick={goToPrevious}
                className={`${overlayButton} absolute left-2`}
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={goToNext}
                className={`${overlayButton} absolute right-2`}
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="flex justify-center">
              <a
                href={selectedImage.src}
                download={downloadName}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand no-underline transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download
              </a>
            </div>
          </DialogPanel>
        </Dialog>
      )}
    </>
  );
};

export default Gallery;

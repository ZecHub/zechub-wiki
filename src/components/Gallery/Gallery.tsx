'use client';

import Image from "next/image";
import { Dialog, DialogPanel } from "@headlessui/react";
import React, { useState, useRef } from "react";
import styles from './Gallery.module.css';

type GalleryImage = { src: string; alt: string; caption?: string };

// Content pages pick a set by name, e.g. <Gallery set="infographics" />; unknown names show the wallpapers.
// A caption marks a captioned set: it drives the thumbnail crop (top-aligned so titles show),
// the lightbox alt text and the download name (the file's own name).
const WALLPAPERS: GalleryImage[] = Array.from({ length: 15 }, (_, i) => ({
  src: `/gallery/${i + 1}.png`,
  alt: `Zcash gallery image ${i + 1}`,
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

const Gallery: React.FC<{ set?: string }> = ({ set = "wallpapers" }) => {
  const galleryImages = set === "infographics" ? INFOGRAPHICS : WALLPAPERS;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedImage = selectedIndex !== null ? galleryImages[selectedIndex] : null;

  const closeModal = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadName = selectedImage?.caption
    ? selectedImage.src.split('/').pop()!
    : `zechub-gallery-${(selectedIndex ?? 0) + 1}.png`;

  return (
    <>
      <div className={styles.gallery}>
        <div className={styles.galleryContainer}>
          {galleryImages.map((image, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Open ${image.caption ?? `Zcash gallery image ${index + 1}`}`}
              className={`${styles.imageContainer} cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500`}
              onClick={() => setSelectedIndex(index)}
            >
              <span className="relative block w-full aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className={`${styles.image}${image.caption ? " object-top" : ""} transition-transform duration-300 group-hover:scale-105`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 4}
                  quality={85}
                />
              </span>
              {image.caption && (
                <span className="block p-2 text-center text-sm font-medium">{image.caption}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Full-screen Lightbox Modal */}
      {selectedImage && selectedIndex !== null && (
        <Dialog
          open
          onClose={closeModal}
          initialFocus={closeButtonRef}
          aria-label={selectedImage.caption ?? "Zcash image gallery"}
          className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 cursor-pointer"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              goToPrevious();
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              goToNext();
            }
          }}
        >
          <DialogPanel className="relative w-full max-w-5xl">
            {/* Close button */}
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close image preview"
              onClick={closeModal}
              className="absolute -top-12 right-4 text-white text-5xl hover:text-amber-400 transition-colors"
            >
              ✕
            </button>

            {/* Navigation arrows */}
            <button
              type="button"
              aria-label="Previous image"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white text-5xl w-14 h-14 flex items-center justify-center rounded-full transition-all active:scale-95"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white text-5xl w-14 h-14 flex items-center justify-center rounded-full transition-all active:scale-95"
            >
              →
            </button>

            {/* Large image */}
            <div className="bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={selectedImage.src}
                alt={selectedImage.caption ? selectedImage.alt : `Gallery image ${selectedIndex + 1}`}
                className="max-h-[80vh] w-auto mx-auto block"
              />
            </div>

            {/* Download button + info */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => downloadImage(selectedImage.src, downloadName)}
                className="flex items-center gap-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-bold text-lg px-10 py-4 rounded-full transition-all shadow-lg active:scale-95"
              >
                Download
              </button>
              <p className="text-white/70 text-sm">
                Image {selectedIndex + 1} of {galleryImages.length} • Click outside or press ESC to close
              </p>
            </div>
          </DialogPanel>
        </Dialog>
      )}
    </>
  );
};

export default Gallery;

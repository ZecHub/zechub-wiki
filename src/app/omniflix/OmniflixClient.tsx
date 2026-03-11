"use client";

import { VideoCard } from "@/components/VideoCard/VideoCard";
import { omniflixMedia } from "@/constants/omniflixMedia";
import Link from "next/link";
import { useLanguage } from '@/context/LanguageContext';

export default function OmniflixClient() {
  const { t } = useLanguage();
  const heading = t?.pages?.omniflix?.title ?? "Omniflix Media";
  const paragraphPrefix = t?.pages?.omniflix?.paragraphPrefix ?? "Check out Zechub's official Omniflix page";
  const linkLabel = t?.pages?.omniflix?.linkLabel ?? "here";
  const cta = t?.pages?.omniflix?.cta ?? "Watch Now";

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center items-center my-12 flex-col lg:flex-row">
        <h1 className="flex justify-center items-center text-2xl imd:text-3xl font-bold mb-6 imd:mb-0 text-center">
          {heading}
        </h1>
      </div>
      <div className="flex flex-row justify-center">
        <p className="text-gray-600 mb-8 text-center text-xl">
          {paragraphPrefix}{" "}
          <a className="text-gray-400" href="https://omniflix.tv/zechub/videos/all" target="_blank">
            {linkLabel}
          </a>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 imd:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {omniflixMedia.map((itm, i) => (
          <VideoCard
            thumbnailImage={itm.poster}
            description={itm.description}
            title={itm.title}
            url={itm.url}
            key={itm.title + "_" + Math.random() / i}
            ctaLabel={cta}
          />
        ))}
      </div>
    </div>
  );
}

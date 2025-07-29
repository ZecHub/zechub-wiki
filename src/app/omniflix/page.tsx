import { VideoCard } from "@/components/VideoCard/VideoCard";
import { omniflixMedia } from "@/constants/omniflixMedia";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = genMetadata({
  title: "Omniflix Media",
  url: "https://zechub.wiki/using-zcash/dex",
});

const OmniflixMedia = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center items-center my-12 flex-col lg:flex-row">
        <h1 className="flex justify-center items-center text-2xl imd:text-3xl font-bold mb-6 imd:mb-0 text-center">
          Omniflix Media
        </h1>
      </div>
      <div className="flex flex-row justify-center">
        <p className="text-gray-600 mb-8 text-center text-xl">
          Check out Zechub's official Omniflix page{" "}
          <a
            className="text-gray-400"
            href="https://omniflix.tv/zechub/videos/all"
            target="_blank"
          >
            here
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
            ctaLabel="Watch Now"
          />
        ))}
      </div>
    </div>
  );
};

export default OmniflixMedia;

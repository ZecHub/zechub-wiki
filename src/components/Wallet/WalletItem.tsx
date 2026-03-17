import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  MdThumbDown as Dislike,
  MdThumbUp as Like,
  MdChecklist,
  MdDevices,
  MdPool,
  MdOpenInNew as OpenNew,
} from "react-icons/md";
import { Icon } from "../UI/Icon";

interface WalletItemProps {
  title: string;
  link: string;
  logo: string;
  tags: Tag[];
  likes: number;
  syncSpeed: string;
  onLike: () => void;
  onDislike: () => void;
  error: string;
  success: string;
}

interface Tag {
  category: string;
  values: string[] | FeatureLink[];
}

interface FeatureLink {
  name: string;
  url: string;
}

type CategoryKey = "Devices" | "Pools" | "Features";

const categoryIcons = {
  Devices: MdDevices,
  Pools: MdPool,
  Features: MdChecklist,
};

const featureLinkMap: { [key: string]: string } = {
  "Orchard": "https://zechub.wiki/using-zcash/shielded-pools#orchard",
  "Sapling": "https://zechub.wiki/using-zcash/shielded-pools#sapling",
  "Transparent": "https://zechub.wiki/using-zcash/shielded-pools#transparent",
  "Shielded": "https://zechub.wiki/using-zcash/shielded-pools",
  "Mobile": "https://zechub.wiki/using-zcash/mobile-wallets",
  "Desktop": "https://zechub.wiki/using-zcash/desktop-wallets",
  "Web": "https://zechub.wiki/using-zcash/web-wallets",
};

const WalletItem: React.FC<WalletItemProps> = ({
  title,
  link,
  logo,
  tags,
  syncSpeed,
  likes,
  onLike,
  onDislike,
  error,
  success,
}) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    onLike();
    setLiked(true);
    setDisliked(false);
  };

  const handleDislike = () => {
    onDislike();
    setDisliked(true);
    setLiked(false);
  };

  const getFeatureLink = (value: string): string => {
    return featureLinkMap[value] || "https://zechub.wiki/using-zcash/shielded-pools";
  };

  const isFeatureLink = (value: any): value is FeatureLink => {
    return typeof value === 'object' && 'name' in value && 'url' in value;
  };

  return (
    <div className="wallet-item h-full flex flex-col border rounded-2xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden transition-all hover:shadow-xl">
      {/* Logo — taller + more padding on mobile */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gray-100 dark:bg-gray-200 p-5 md:p-6 flex items-center justify-center h-52 md:h-48"
      >
        <Image
          className="w-full h-full object-contain"
          width={260}
          height={180}
          src={logo}
          alt={`${title} Logo`}
          priority={false}
        />
      </a>

      <div className="flex-1 flex flex-col p-5 md:p-6">
        {/* Title + Open button */}
        <div className="flex justify-between items-start mb-4">
          <h5 className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-200 flex-1 pr-3">
            {title}
            {syncSpeed && (
              <span className="inline-block ml-2 align-middle">
                <Image src={syncSpeed} width={32} height={32} alt="Sync" />
              </span>
            )}
          </h5>
          <Link
            href={link}
            className="px-4 py-2 border border-slate-500 dark:border-slate-400 text-slate-500 dark:text-slate-400 text-sm hover:bg-slate-500 hover:text-white rounded-lg transition whitespace-nowrap"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open
            <Icon icon={OpenNew} className="inline-block ms-2" size="small" />
          </Link>
        </div>

        {/* Devices + Pools (compact pills) */}
        {tags
          .filter((t) => ["Devices", "Pools"].includes(t.category))
          .map((tag, index) => (
            <div key={index} className="flex flex-wrap gap-2 mb-4">
              <Icon
                icon={categoryIcons[tag.category as CategoryKey]}
                title={tag.category}
                className="text-slate-500 mt-1"
                size="medium"
              />
              {tag.values.map((value, vIndex) => (
                <span
                  key={vIndex}
                  className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300"
                >
                  {typeof value === "string" ? value : (value as FeatureLink).name}
                </span>
              ))}
            </div>
          ))}

        {/* Features section — more space between tags */}
        {tags.some((t) => t.category === "Features") && (
          <>
            <hr className="my-3 border-slate-200 dark:border-slate-700" />
            <div className="flex flex-wrap gap-2">
              <Icon
                icon={MdChecklist}
                title="Features"
                className="text-slate-500 mt-1"
                size="medium"
              />
              {tags
                .find((t) => t.category === "Features")
                ?.values.map((value, index) => {
                  const displayValue = typeof value === "string" ? value : (value as FeatureLink).name;
                  const linkUrl = typeof value === "string" ? getFeatureLink(value) : (value as FeatureLink).url;

                  return (
                    <Link
                      key={index}
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full text-slate-600 dark:text-slate-300 transition"
                    >
                      {displayValue}
                    </Link>
                  );
                })}
            </div>
          </>
        )}
      </div>

      {/* Rating pinned at bottom */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-5 mt-auto flex items-center">
        <div className="flex-grow text-sm text-gray-400">Rating: {likes}</div>
        <div className="text-pink-700 dark:text-red-300 text-xs pr-2">{error}</div>
        <div className="text-green-700 dark:text-green-300 text-xs pr-2">{success}</div>
        <div className="flex gap-4">
          <button onClick={handleLike} className={`text-gray-600 hover:text-blue-500 ${liked ? "text-blue-500" : ""}`}>
            <Icon icon={Like} size="small" />
          </button>
          <button onClick={handleDislike} className={`text-gray-600 hover:text-red-500 ${disliked ? "text-red-500" : ""}`}>
            <Icon icon={Dislike} size="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletItem;

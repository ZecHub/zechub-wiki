import { Icon } from "@/components/ui/Icon";
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
  values: string[];
}
type CategoryKey = "Devices" | "Pools" | "Features";
// Mapping of categories to icons
const categoryIcons = {
  Devices: MdDevices,
  Pools: MdPool,
  Features: MdChecklist,
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

  console.log(syncSpeed);

  return (
    <div className="wallet-item h-full flex flex-col gap-4 items-start border rounded-lg shadow-lg bg-white dark:bg-gray-800 p-5">
      <div className="col-span-12 grid grid-cols-12 gap-4 items-start h-full w-full">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-12 row-span-1 md:col-span-6 md:row-span-2 bg-gray-100 dark:bg-gray-200 p-2 h-full flex items-center"
        >
          <Image
            className="w-full"
            width={200}
            height={200}
            src={logo}
            alt={`${title} Logo`}
          />
        </a>
        <div className="col-span-12 row-span-1 md:col-span-6">
          <div className="wallet-meta">
            <div className="flex justify-between items-center w-full">
              <h5 className="text-xl flex items-center gap-2 md:text-2xl my-4 font-bold text-slate-700 dark:text-slate-200 flex-grow">
                {title}{" "}
                {syncSpeed && (
                  <span className="w-[30px] h-[30px] flex justify-center items-center">
                    <Image
                      className="w-full"
                      src={syncSpeed}
                      width={100}
                      height={100}
                      alt={`${title} Logo`}
                    />
                  </span>
                )}
              </h5>
              <Link
                href={link}
                className="px-2 py-2 border border-slate-500 dark:border-slate-400 text-slate-500 dark:text-slate-400 text-xs hover:text-white hover:bg-slate-500 rounded-lg transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open
                <Icon
                  icon={OpenNew}
                  className="inline-block ms-2"
                  size="small"
                />
              </Link>
            </div>
            {tags.map((tag, index) => (
              <React.Fragment key={index}>
                {tag.category === "Features" && <hr className="my-2" />}
                <div className={`wallet-tag tag-${tag.category}`}>
                  <Icon
                    icon={categoryIcons[tag.category as CategoryKey]}
                    title={tag.category}
                    className="icon-class"
                    size="medium"
                  />
                  {tag.values.map((value, valueIndex) => (
                    <div
                      key={valueIndex}
                      className="wallet-tag-item bg-slate-200 dark:bg-slate-900"
                    >
                      <Link href="https://zechub.wiki/using-zcash/shielded-pools">
                        {value}
                      </Link>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <hr className="w-full" />
      <div className="wallet-likes w-full flex">
        <div className="likes-count flex-grow">
          <span className="text-gray-400">Rating:</span> {likes}
        </div>
        <div className="error text-pink-700 dark:text-red-300 text-xs flex items-center pr-1">
          {error}
        </div>
        <div className="text-green-700 dark:text-green-300 text-xs flex items-center pr-1">
          {success}
        </div>
        <div>
          <button
            onClick={handleLike}
            className={`like-button mr-4 ${
              liked ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
            } duration-300`}
          >
            <Icon
              icon={Like}
              className="inline-block h-5 w-5 ms-2"
              size="small"
            />
          </button>
          <button
            onClick={handleDislike}
            className={`like-button ${
              disliked ? "text-red-500" : "text-gray-600 hover:text-red-500"
            } duration-300`}
          >
            <Icon
              icon={Dislike}
              className="inline-block h-5 w-5 ms-2"
              size="small"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletItem;

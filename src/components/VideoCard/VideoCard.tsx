"use client";

import Image from "next/image";
import Link from "next/link";
import { formatString } from "@/lib/helpers";
import styles from "./VideoCard.module.css";

type CardsProps = {
  title: string;
  url: string;
  thumbnailImage: any;
  description: string;
  [index: string]: any;
  ctaLabel: string;
  manual?: {
    url: string;
    ctaLabel: string;
  };
};

export const VideoCard = (props: CardsProps) => (
  <div
    style={{ backgroundColor: "revert" }}
    className="bg-white rounded-lg shadow flex flex-col justify-between mb-8 sm:mb-4 relative"
  >
    <div>
      <Link href={props.url} target="_blank">
        <Image
          width={1000}
          height={500}
          src={props.thumbnailImage}
          alt="Thumbnail 1"
          className="w-full h-48 object-fill mb-4 rounded-t"
        />
        <div className={`absolute ${styles.bottom_7} ${styles.right_7}`}>
          <div className="IvCard_duration__VOPg_">18:53</div>
        </div>
      </Link>

      <h2 className="truncate text-xl font-bold imd:px-4 my-6">
        {props.title}
      </h2>

      {props.features && props.features.length > 0 && (
        <div className="px-4">
          <h4 className="text-gray-700 my-2 text-xl">Features:</h4>
          <ul className="text-gray-600 px-4 mb-4">
            {props.features?.map((f: any, i: number) => (
              <li key={i} className="list-item list-disc  ">
                {formatString.titleCase(f)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div className="px-4">
      <Link
        href={props.url}
        target="_blank"
        className="inline-flex py-2 px-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 border border-transparent rounded-md"
      >
        {props.ctaLabel}
      </Link>
      {props.manual && (
        <Link
          href={props.manual.url}
          target="_blank"
          className="ml-4 inline-flex py-2 px-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {props.manual.ctaLabel}
        </Link>
      )}
    </div>
  </div>
);

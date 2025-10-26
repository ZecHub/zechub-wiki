"use client";
import Image from "next/image";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";

type AmbassadorCardsProps = {
  title: string;
  url: string;
  thumbnailImage: any;
  thumbnailImageWidth?: number;
  thumbnailImageHeight?: number;
  description: string;
  [index: string]: any;
  ctaLabel: string;
  manual?: {
    url: string;
    ctaLabel: string;
  };
};

export const AmbassadorCards = (props: AmbassadorCardsProps) => (
  <div
    style={{ backgroundColor: "revert" }}
    className="bg-white rounded-lg border dark:border-slate-600 shadow flex flex-col justify-between mb-8 sm:mb-4"
  >
    <div>
      <Link href={props.url}>
        <Image
          width={props.thumbnailImageHeight || 1000}
          height={props.thumbnailImageWidth || 500}
          src={props.thumbnailImage || "/placeholder.svg"}
          alt={props.title}
          className="w-full h-48 object-fill mb-4 rounded-t bg-slate-50"
        />
      </Link>

      <h2 className="text-xl font-bold px-4 my-6">{props.title}</h2>
      <p className="text-gray-700 dark:text-white px-4 mb-4">
        {props.description}
      </p>
    </div>

    <div className="flex justify-between p-4">
      <Link
        href={props.url}
        target="_blank"
        className="inline-flex btn-brand items-center gap-1"
      >
        <FaXTwitter />
        {props.ctaLabel}
      </Link>
      {props.manual && (
        <Link
          href={props.manual.url}
          target="_blank"
          className="ml-4 inline-flex btn-brand"
        >
          {props.manual.ctaLabel}
        </Link>
      )}
    </div>
  </div>
);

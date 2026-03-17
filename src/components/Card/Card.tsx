"use client";

import { formatString } from "@/lib/helpers";
import Image from "next/image";
import Link from "next/link";

type CardsProps = {
  title: string;
  url: string;
  thumbnailImage: any;
  thumbnailImageWidth?: number;
  thumbnailImageHeight?: number;
  description: string;
  ctaLabel: string;
  features?: any[];
  manual?: {
    url: string;
    ctaLabel: string;
  };
  [index: string]: any;
};

export const Card = (props: CardsProps) => (
  <div className="group bg-white dark:bg-slate-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
      {/* Logo / Image - Responsive */}
      <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 relative mx-auto md:mx-0">
        <Image
          src={props.thumbnailImage}
          alt={props.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 112px, 128px"
        />
      </div>

      {/* Content */}
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">{props.title}</h3>

        <a
          href={props.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand inline-block px-7 py-3 rounded-xl font-medium text-base mb-6 transition-all active:scale-95"
        >
          {props.ctaLabel}
        </a>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
          {props.description}
        </p>

        {props.features && props.features.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-zinc-500 mb-2">Features:</h4>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400 list-disc pl-5 space-y-1">
              {props.features.map((f: any, i: number) => (
                <li key={i}>{formatString.titleCase(f)}</li>
              ))}
            </ul>
          </div>
        )}

        {props.manual && (
          <a
            href={props.manual.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand inline-block px-7 py-3 rounded-xl font-medium text-base"
          >
            {props.manual.ctaLabel}
          </a>
        )}
      </div>
    </div>
  </div>
);

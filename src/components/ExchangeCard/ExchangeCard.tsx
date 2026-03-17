import Image from "next/image";
import React from "react";

interface ExchangeCardProps {
  name: string;
  url: string;
  pairs: string;
  support: string;
  depositTime: string;
  logo: string;
  altText: string;
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({
  name,
  url,
  pairs,
  support,
  depositTime,
  logo,
  altText,
}) => (
  <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
      {/* Logo */}
      <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 relative mx-auto md:mx-0">
        <Image
          src={logo}
          alt={altText}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 112px, 128px"
        />
      </div>

      {/* Content */}
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">{name}</h3>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand inline-block px-7 py-3 rounded-xl font-medium text-base mb-6 transition-all active:scale-95"
        >
          Visit Exchange →
        </a>

        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex flex-col md:flex-row md:gap-2">
            <span className="font-semibold text-zinc-500 w-20">Pairs:</span>
            <span>{pairs}</span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-2">
            <span className="font-semibold text-zinc-500 w-20">Supports:</span>
            <span>{support}</span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-2">
            <span className="font-semibold text-zinc-500 w-20">Deposit Time:</span>
            <span>{depositTime}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ExchangeCard;
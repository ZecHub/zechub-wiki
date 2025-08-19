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
  <div className="light:bg-white border dark:border-gray-600 shadow-md rounded-lg overflow-hidden">
    <div className="p-6 text-center dark:bg-slate-900">
      <a href={url} target="_blank" rel="noopener noreferrer">
        {/* <img
          src={logo}
          alt={altText}
          className="mx-auto mb-4 object-contain"
          style={{ height: "160px" }}
          /> */}
        <Image
          src={logo}
          alt={altText}
          height="160"
          width="160"
          style={{ height: "160px" }}
          className="mx-auto mb-4 object-contain"
        />
      </a>
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="mb-4">
        <a
          href={url}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Website
        </a>
      </p>
      <p className="mb-2">Pairs: {pairs}</p>
      <p className="mb-2">Supports: {support}</p>
      <p>Deposit Time: {depositTime}</p>
    </div>
  </div>
);

export default ExchangeCard;

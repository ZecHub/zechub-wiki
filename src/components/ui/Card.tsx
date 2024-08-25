// Card.js
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProps {
  title: string;
  imageUrl: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const Card: React.FC<CardProps> = ({
  title,
  imageUrl,
  description,
  buttonText,
  buttonLink,
}) => {
  return (
    <div className="w-full rounded overflow-hidden shadow-lg md:m-4">
      <Image className="w-full" src={imageUrl} alt="Card image cap" width='1000' height={1000}/>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 pb-4">
        <Link
          href={buttonLink}
          className="bg-[#1984c7] text-white font-bold py-2 px-4 rounded"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default Card;

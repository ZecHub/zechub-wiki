import React from "react";
import Link from "next/link";
import { WalletProps } from "@/constants/walletsConfig";
import Image from "next/image";

const WalletTile = ({ name, description, path, image }: WalletProps) => {
  return (
    <Link
      href={path}
      className="w-full h-full inline-block p-2 hover:-translate-y-3"
    >
      <div className="h-full border rounded-lg shadow-lg bg-white dark:bg-gray-800 p-5">
        <div className="flex flex-col items-center justify-center">
          <h5 className="text-xl my-4 font-bold text-blue-700 dark:text-blue-400">
            {name}
          </h5>
          <div className="relative h-36 min-w-full">
            <Image src={image} alt={name} layout="fill" objectFit="contain" />
          </div>
          <div className="p-4">{description}</div>
        </div>
      </div>
    </Link>
  );
};

export default WalletTile;

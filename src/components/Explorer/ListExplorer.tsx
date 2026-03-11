"use client";
import { getName } from "@/lib/helpers";
import Image from "next/image";
import Link from "next/link";
import { useDarkModeContext } from "@/hooks/useDarkModeContext";

interface Props {
  image: string;
  imageLight?: string;
  imageDark?: string;
  name: string;
  description: string;
  url: string;
  className: string;
}

const CardsExplorer = ({
  image,
  imageLight,
  imageDark,
  name,
  description,
  url,
  className,
  ...props
}: Props) => {
  const { dark } = useDarkModeContext();
  const src =
    dark && imageDark ? imageDark : !dark && imageLight ? imageLight : image;

  return (
    <div
      className={`w-4/6  hover:bg-gray-100 dark:hover:bg-transparent hover:cursor-pointer hover:scale-105 transition-all duration-100 ${className}`}
    >
      <Link href={url}>
        <Image
          className="rounded-t-lg"
          src={src}
          alt={name}
          width={1000}
          height={50}
        />
        <div className="flex justify-center p-5 space-y-1">
          <h4 className="text-md font-bold tracking-tight text-gray-700 dark:text-gray-300">
            {getName(name)}
          </h4>

          <p className="font-normal text-gray-700 dark:text-gray-400">
            {description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CardsExplorer;

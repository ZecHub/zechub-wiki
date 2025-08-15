"use client";
import { getName } from "@/lib/helpers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  image: string;
  name: string;
  description: string;
  url: string;
}

const CardsExplorer = ({ image, name, description, url, ...props }: Props) => {
  const router = useRouter();

  return (
    <div className="w-4/6 shadow  hover:bg-gray-100 dark:hover:bg-transparent hover:cursor-pointer hover:scale-105 transition-all duration-100">
      <Link href={url}>
        <Image
          className="rounded-t-lg"
          src={image}
          alt="cardImage"
          width={1000}
          height={50}
        />
        <div className="p-5 space-y-1">
          <h4 className="text-md tracking-tight text-gray-700 dark:text-gray-300">
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

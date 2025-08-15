import Image from "next/image";
import Link from "next/link";
import { FadeInAnimation } from "./FadeInAnimation";

interface Props {
  title: string;
  paraph: string;
  url: string;
  image: string;
}

const Cards = ({ title, paraph, url, image }: Props) => (
  <div className="flex w-full min-w-[30%] md:w-1/5 bg-slate-100 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:-translate-y-1 transition-all duration-100">
    <FadeInAnimation className="flex flex-col justify-center items-center w-full">
      <Link href={url} className="w-full flex justify-center">
        <Image
          className="rounded-t-lg object-cover"
          src={image}
          alt={title}
          width={400}
          height={100}
        />
      </Link>
      <div className="flex flex-col items-center min-h-56 p-5 min-h-56 space-y-4 flex-1">
        <Link href={url}>
          <h2 className="text-center mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h2>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {paraph}
        </p>
      </div>
      <div className="my-4 px-4 w-full ">
        <Link
          href={url}
          className="inline-flex justify-center items-center w-full px-3 py-4 text-md font-medium text-center text-white rounded-lg bg-[#1984c7] hover:bg-[#1574af] focus:ring-[#1984c7]   focus:ring-4 focus:outline-none  dark:hover:bg-[#1574af] dark:focus:ring-blue-800"
        >
          Read more
          <svg
            className="w-3.5 h-3.5 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
    </FadeInAnimation>
  </div>
);

export default Cards;

"useClient";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DaoProps {
  imgUrl: string;
  name: string;
  description: string;
  linkName: string;
  urlLink: string;
}

const MemberCards = ({
  imgUrl,
  name,
  description,
  linkName,
  urlLink,
}: DaoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shortDecription, setShortDescription] = useState(description);
  const shouldShowReadMore = description.length >= 37;
  useEffect(() => {
    if (description.length >= 37) {
      setShortDescription(description.slice(0, 32) + "...");
    }
  }, []);
  return (
    <>
      <div className=" border m-2.5 p-5 rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex flex-col items-center justify-center ">
          <Image
            className="w-50 h-50 my-3 rounded-full shadow-lg"
            src={imgUrl ? imgUrl : ""}
            alt={`${name} propfile image`}
            width={200}
            height={200}
            loading="lazy"
          />
          <h5 className=" text-xl my-4 font-bold text-gray-900 dark:text-white">
            {name}
          </h5>
          <div className="p-4">
            <p
              className={`text-gray-600 ${isOpen ? "hidden" : "line-clamp-3"}`}
            >
              {shortDecription}
            </p>
            {shouldShowReadMore && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-blue-500 mt-2 focus:outline-none"
              >
                <span>{isOpen ? "Read Less" : "Read More"}</span>
              </button>
            )}

            {isOpen && <p className="text-gray-600 mt-2">{description}</p>}
          </div>
          <div className="inherit mt-4 w-full justify-center text-center items-center md:mt-6">
            <Link
              href={urlLink}
              target="_blank"
              className="inline-flex items-center w-1/2 justify-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 hover:scale-110 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {linkName}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberCards;

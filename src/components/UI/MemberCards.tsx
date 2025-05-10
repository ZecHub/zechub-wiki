"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DaoProps {
  imgUrl: string;
  name: string;
  description: string;
  socials: any;
  zcashAddress: string;
}

const MemberCards = ({
  imgUrl,
  name,
  description,
  socials,
  zcashAddress,
}: DaoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shortDescription, setShortDescription] = useState(description);
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const shouldShowReadMore = description.length >= 37;

  useEffect(() => {
    if (description.length >= 37) {
      setShortDescription(description.slice(0, 32) + "...");
    }
  }, [description]);

  const handleSend = () => {
    const encodedMemo = base64UrlEncode(message);
    const uri = `zcash:${zcashAddress}?amount=0.01&memo=${encodedMemo}`;
    window.location.href = uri;
    handleFlip();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`card ${
        isFlipped ? "card-flipped" : ""
      } w-full max-w-md mx-auto`}
    >
      <div className="border m-2.5 p-5 rounded-lg shadow-lg dark:bg-gray-800 bg-white transition-all duration-300 h-full">
        {/* Front Side */}
        <div
          className={`${
            isFlipped ? "hidden" : ""
          } flex flex-col items-center justify-between h-full`}
        >
          <div className="w-full flex flex-col items-center">
            <Image
              className="w-32 h-32 my-3 rounded-full shadow-lg object-cover border-4 border-blue-500"
              src={imgUrl ? imgUrl : "/default-avatar.png"}
              alt={`${name} profile image`}
              width={200}
              height={200}
              loading="lazy"
            />
            <h5 className="text-2xl my-4 font-bold text-gray-900 dark:text-white">
              {name}
            </h5>
            <div className="p-4 text-center w-full">
              <p
                className={`text-gray-600 dark:text-gray-300 ${
                  isOpen ? "hidden" : "line-clamp-3"
                }`}
              >
                {shortDescription}
              </p>
              {shouldShowReadMore && (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 mt-2 focus:outline-none transition-colors"
                >
                  {isOpen ? "Read Less" : "Read More"}
                </button>
              )}

              {isOpen && (
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-4 my-4">
            {socials?.map((social: any, index: number) => {
              const { name, url, icon } = social;
              return (
                <Link
                  key={index}
                  href={url}
                  target="_blank"
                  className="text-gray-500 dark:text-gray-200 hover:text-blue-500 transition-colors"
                >
                  {icon}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 w-full flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
            {/* <Link
            href={urlLink}
            target="_blank"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:scale-105 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-all"
          >
            {linkName}
          </Link> */}
            <button
              onClick={handleFlip}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-center text-white bg-[#1984c7] rounded-lg hover:bg-[#1984c7] hover:scale-105 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-[#1984c7] dark:hover:bg-[#1984c7] dark:focus:ring-purple-800 transition-all"
            >
              Message
            </button>
          </div>
        </div>

        {/* Back Side */}
        <div
          className={`card-back ${
            !isFlipped ? "hidden" : ""
          } h-full flex flex-col justify-between`}
        >
          <div>
            <h1 className="text-xl mb-3 font-bold text-gray-900 dark:text-white">
              Message to {name}
            </h1>
            <div className="relative">
              <textarea
                className="w-full p-3 border rounded-lg dark:text-white bg-gray-50 dark:bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows={4}
                placeholder="Type your message..."
                maxLength={512}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="absolute bottom-2 right-2 text-gray-500 text-sm bg-white/80 dark:bg-gray-800/80 px-1 rounded">
                {message.length}/512
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                handleFlip();
                setMessage("");
              }}
              className="px-4 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 hover:scale-105 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800 transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCards;

function base64UrlEncode(str: string) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

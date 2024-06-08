"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DaoProps {
  imgUrl: string;
  name: string;
  description: string;
  linkName: string;
  urlLink: string;
  zcashAddress: string;
}

const MemberCards = ({
  imgUrl,
  name,
  description,
  linkName,
  urlLink,
  zcashAddress,
}: DaoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shortDescription, setShortDescription] = useState(description);
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState('');
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
    setIsFlipped(false); 
  };

  return (
    <div className="card-container">
      <div className={`card ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-front flex flex-col items-center justify-center p-5 border rounded-lg shadow-lg dark:bg-gray-800">
          <Image
            className="w-32 h-32 my-3 rounded-full shadow-lg"
            src={imgUrl ? imgUrl : ""}
            alt={`${name} profile image`}
            width={128}
            height={128}
            loading="lazy"
          />
          <h5 className="text-xl my-4 font-bold text-gray-900 dark:text-white">
            {name}
          </h5>
          <div className="p-4 text-center">
            <p className={`text-gray-600 ${isOpen ? "hidden" : "line-clamp-3"}`}>
              {shortDescription}
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
          <div className="mt-4 w-full flex justify-center items-center md:mt-6 space-x-2">
            <Link
              href={urlLink}
              target="_blank"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 hover:scale-110 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {linkName}
            </Link>
            <button
              onClick={() => setIsFlipped(true)}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 hover:scale-110 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Message
            </button>
          </div>
        </div>
        <div className="card-back p-5 dark:bg-gray-800 relative">
          <textarea
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="Type your message..."
            maxLength={512}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="absolute bottom-2 right-2 text-gray-500">
            {message.length}/512
          </div>
          <button
            onClick={handleSend}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 hover:scale-110 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Send
          </button>
          <button
            onClick={() => setIsFlipped(false)}
            className="mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 hover:scale-110 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberCards;

function base64UrlEncode(str: string) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

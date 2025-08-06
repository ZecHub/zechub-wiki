import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { Icon } from "../UI/Icon";
import { MdOpenInNew as openNew } from "react-icons/md";

interface PaymentProcessor {
  name: string;
  url: string;
  logoUrl: string;
  supportType: string;
  description: string;
}

interface PaymentProcessorListProps {
  allProcessors: PaymentProcessor[];
}

const PaymentProcessorList: React.FC<PaymentProcessorListProps> = ({
  allProcessors,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allProcessors.map((processor, index) => (
        <div
          key={index}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 flex flex-col h-full relative"
        >
          {/* Logo with hover effect */}
          <div className="relative mb-4">
            <div className="flex items-center">
              {processor.logoUrl && (
                <div className="mr-4 flex-shrink-0 bg-gray-100 h-24 w-24 dark:bg-gray-700 p-2 rounded-lg relative overflow-hidden">
                  <Image
                    src={
                      processor.logoUrl.startsWith("http")
                        ? processor.logoUrl
                        : `/images/processors/${processor.logoUrl}`
                    }
                    alt={`${processor.name} logo`}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                    loading="lazy"
                    style={{
                      opacity: 1,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {processor.name}
              </h3>
            </div>
          </div>

          {/* Support Type */}
          <div className="mb-3">
            <span
              className={`inline-block text-sm px-3 py-1 rounded-full ${
                processor.supportType.includes("Shielded")
                  ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                  : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              }`}
            >
              {processor.supportType}
            </span>
          </div>

          {/* Rating */}

          {/* <div className="mb-3 flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${
                    star <= 4
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {3}
            </span>
          </div> */}

          <p className="text-gray-600 dark:text-gray-300 mb-5 flex-grow">
            {processor.description}
          </p>

          {/* Bottom link */}
          <div className="mt-auto">
            <Link
              href={processor.url}
              className="px-2 py-2 border border-slate-500 dark:border-slate-400 text-slate-500 dark:text-slate-400 text-xs hover:text-white hover:bg-slate-500 rounded-lg transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open
              <Icon icon={openNew} className="inline-block ms-2" size="small" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentProcessorList;

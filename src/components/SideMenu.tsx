"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BiRightArrowAlt as Arrow } from "react-icons/bi";
import { BiSolidWallet as Wallet } from "react-icons/bi";
import { Icon } from "./ui/Icon";
import { getName, transformGithubFilePathToWikiLink } from "@/lib/helpers";
import { BiMenu as BurgerMenuIcon } from "react-icons/bi";
import { matchIcons } from "@/constants/Icons";
import { FiFile as FileIcon } from "react-icons/fi";
import { FaListAlt } from "react-icons/fa";

interface MenuProps {
  folder: string;
  roots: string[];
}

const images = [
  "/exchangetutorials.png",
  "/fullnodetutorials.png",
  "/usingzcashtutorials.png",
  "/wallettutorials.png",
];
const SideMenu = ({ folder, roots }: MenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const root = roots.map((item) => item.slice(0, -3));

  const name = folder[0].toUpperCase() + folder.slice(1);

  const fold = getName(name);
  const router = useRouter();

  return (
    <div className="relative flex flex-wrap items-center md:items-start order-1 justify-between md:flex-col">
      <button onClick={toggleMenu} className="md:hidden flex">
        <BurgerMenuIcon size={24} />{" "}
        <h3 className="ms-2 font-bold">Navigation</h3>
      </button>
      <div className="flex justify-end md:justify-center w-auto order-2 md:order-3">
        <Link
          href="/explore"
          className="flex items-center rounded-full font-bold px-4 py-2 hover:bg-[#1984c7]"
          style={{
            background: "#1984c7",
            fontWeight: "600",
            borderRadius: "0.4rem",
            color: "white",
          }}
        >
          Explore
          <Icon size={"medium"} icon={Arrow} />
        </Link>
      </div>
      <div
        className={`flex flex-col shrink-0 top-0 py-4 items-center justify-start w-full px-3 order-3 md:order-2 ${
          isMenuOpen ? "block mt-7" : "hidden md:block"
        }`}
      >
        <h1 className="text-4xl font-bold mb-6"> {fold}: </h1>

        <div>
          <ul>
            {root.map((item, i) => {
              if (getName(item) === "Wallets") return null; // Skip rendering the item named "Wallets"
              if (getName(item) === "Custodial Exchanges") return null; // Skip rendering the item named "Wallets"

              const myIcon = matchIcons(fold, getName(item));
              return (
                <li
                  key={i}
                  className={`my-3 hover:scale-110 hover:underline hover:cursor-pointer py-1`}
                >
                  <Link
                    href={`/${transformGithubFilePathToWikiLink(item)}#content`}
                  >
                    <div className={`flex items-center space-x-4`}>
                      <div className="flex-shrink-0">
                        <Icon icon={myIcon != "Nothing" ? myIcon : FileIcon} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium ">
                          {item ? getName(item) : ""}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold ">
                        <Icon icon={Arrow} />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
            {fold === "Using Zcash" && (
              <li
                className={`my-3 hover:scale-110 hover:underline hover:cursor-pointer py-3`}
              >
                <a href="/using-zcash/custodial-exchanges">
                  <div className={`flex items-center space-x-4`}>
                    <div className="flex-shrink-0">
                      <Icon icon={FaListAlt} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium ">Custodial Exchanges</p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold ">
                      <Icon icon={Arrow} />
                    </div>
                  </div>
                </a>
              </li>
            )}
            {fold === "Using Zcash" && (
              <li
                className={`my-3 hover:scale-110 hover:underline hover:cursor-pointer py-3`}
              >
                <a href="/wallets">
                  <div className={`flex items-center space-x-4`}>
                    <div className="flex-shrink-0">
                      <Icon icon={Wallet} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium ">Wallets</p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold ">
                      <Icon icon={Arrow} />
                    </div>
                  </div>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;

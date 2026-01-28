"use client";
import { matchIcons } from "@/constants/Icons";
import { getName, transformGithubFilePathToWikiLink } from "@/lib/helpers";
import Link from "next/link";
import { useState } from "react";
import {
  BiRightArrowAlt as Arrow,
  BiMenu as BurgerMenuIcon,
  BiSolidWallet as Wallet,
} from "react-icons/bi";
import { FaListAlt } from "react-icons/fa";
import { FiFile as FileIcon } from "react-icons/fi";
import { Icon } from "../UI/Icon";
import { MdPayment } from "react-icons/md";

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

  return (
    <div className="relative flex flex-wrap items-center xl:items-start order-1 justify-between xl:flex-col">
      <button onClick={toggleMenu} className="xl:hidden flex">
        <BurgerMenuIcon size={24} />{" "}
        <h3 className="ms-2 font-bold">Navigation</h3>
      </button>
      <div className="flex justify-end xl:justify-center w-auto order-2 xl:order-3">
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
        className={`flex flex-col shrink-0 top-0 py-4 xl:items-center justify-start w-full px-3 order-3 xl:order-2 ${
          isMenuOpen ? "block mt-7" : "hidden xl:block"
        }`}
      >
        <h1 className="text-4xl font-bold mb-6"> {fold}: </h1>

        <div>
          <ul>
            {root.map((item: any, i: any) => {
              if (getName(item) === "Wallets") return null; // Skip rendering the item named "Wallets"
              if (getName(item) === "Payment Processors") return null; // Skip rendering the item named "Wallets"
              if (getName(item) === "Custodial Exchanges") return null; // Skip rendering the item named "Wallets"

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
                        <Icon
                          icon={matchIcons(fold, getName(item)) ?? FileIcon}
                        />
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
                <Link href="/using-zcash/custodial-exchanges">
                  <div className={`flex items-center space-x-4`}>
                    <div className="flex-shrink-0">
                      <Icon icon={FaListAlt} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium ">
                        Custodial Exchanges
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold ">
                      <Icon icon={Arrow} />
                    </div>
                  </div>
                </Link>
              </li>
            )}
            {fold === "Using Zcash" && (
              <li
                className={`my-3 hover:scale-110 hover:underline hover:cursor-pointer py-3`}
              >
                <Link href="/wallets">
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
                </Link>
              </li>
            )}
            {fold === "Using Zcash" && (
              <li
                className={`my-3 hover:scale-110 hover:underline hover:cursor-pointer py-3`}
              >
                <Link href="/payment-processors">
                  <div className={`flex items-center space-x-4`}>
                    <div className="flex-shrink-0">
                      <Icon icon={MdPayment} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium ">Payment Processors</p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold ">
                      <Icon icon={Arrow} />
                    </div>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;

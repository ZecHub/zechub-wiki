"use client";
import DonationBtn from "@/components/UI/DonationBtn";
import { navigations } from "@/constants/navigation";
import type { Classes, MenuExp } from "@/types";
import Dropdown from "../Dropdown/Dropdown";
import DropdownMobile from "../DropdownMobile/DropdownMobile";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoSearch as SearchIcon } from "react-icons/io5";
import {
  MdOutlineDarkMode as DarkIcon,
  MdLightMode as LightIcon,
} from "react-icons/md";
import { RiMenuLine as MenuIcon } from "react-icons/ri";
import { Sheet, SheetContent, SheetTrigger } from "../UI/Sheet";
import SearchBar from "../SearchBar";
import { Icon } from "../UI/Icon";
import Logo from "../UI/Logo";
import SocialIcons from "../UI/SocialIcons";

const NavLinks = ({
  classes,
  menuExp,
  closeMenu,
}: Classes & { closeMenu: () => void }) => {
  const handleLinkClick = () => {
    closeMenu();
  };
  return (
    <div className={`flex jen-justify-content ${classes}`}>
      {navigations.map((item, i) =>
        item.links ? (
          <Dropdown label={item.name}>
            {item.links.map((link, i) => (
              <div
                key={link.path + i}
                className="hover:bg-yellow-300 dark:hover:bg-yellow-500 py-0 px-1 rounded-md"
              >
                <Link
                  target={link.newTab ? "_blank" : "_self"}
                  href={link.path}
                >
                  <div
                    key={link.subName}
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 p-2 text-sm"
                  >
                    {link.icon && (
                      <Icon
                        icon={link.icon}
                        className="xl:w-6 w-4 h-4 xl:h-6"
                      />
                    )}
                    {link.subName}
                  </div>
                </Link>
              </div>
            ))}
          </Dropdown>
        ) : (
          <div className="dropdown" key={item.name + i}>
            <div
              key={"link.subName"}
              onClick={handleLinkClick}
              className="jen-padding"
            >
              <Link
                target={item.newTab ? "_blank" : "_self"}
                href={item.path}
                onClick={handleLinkClick}
                className="hover:text-yellow-300 dark:hover:text-yellow-500 hover:font-bold"
              >
                {item.name}
              </Link>
            </div>
          </div>
        )
      )}

      <div className="flex xl:flex-row flex-col xl:space-x-3 xl:ml-6 sm:gap-0 gap-2">
        <Link
          href="/dao"
          onClick={handleLinkClick}
          className="flex flex-row font-normal xl:ml-0 p-2 border-2-off border-light-blue-500 rounded-xl hover:cursor-pointer hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black border-4 items-center justify-center w-[60px]"
        >
          DAO
        </Link>

        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="flex flex-row font-normal xl:ml-3 p-2 border-2-off border-light-blue-500 rounded-xl hover:cursor-pointer hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black border-4"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
};
const MobileNavLinks = ({
  classes,
  menuExp,
  closeMenu,
}: Classes & { closeMenu: () => void }) => {
  const handleLinkClick = () => {
    closeMenu();
  };
  return (
    <div>
      <div className={`flex jen-justify-content ${classes}`}>
        {navigations.map((item, i) =>
          item.links ? (
            <DropdownMobile label={item.name}>
              {item.links.map((link, i) => (
                <div
                  className="hover:bg-yellow-300 dark:hover:bg-yellow-500 rounded-md"
                  key={link.path + i}
                >
                  <Link
                    target={link.newTab ? "_blank" : "_self"}
                    href={link.path}
                  >
                    <div
                      key={link.subName}
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 p-2 text-sm"
                    >
                      {link.icon && (
                        <Icon
                          icon={link.icon}
                          className="xl:w-6 w-4 h-4 xl:h-6 min-w-[1rem]"
                        />
                      )}
                      {link.subName}
                    </div>
                  </Link>
                </div>
              ))}
            </DropdownMobile>
          ) : (
            <div className="dropdown" key={item.name + i}>
              <div
                key={"link.subName"}
                onClick={handleLinkClick}
                className="jen-padding "
              >
                <Link
                  target={item.newTab ? "_blank" : "_self"}
                  href={item.path}
                  onClick={handleLinkClick}
                  className="hover:text-yellow-300 dark:hover:text-yellow-500 hover:font-bold"
                >
                  {item.name}
                </Link>
              </div>
            </div>
          )
        )}

        <div className="flex flex-row xl:space-x-3 xl:ml-3 sm:gap-0 gap-2 items-baseline mt-3">
          <Link
            href="/dao"
            onClick={handleLinkClick}
            className="flex flex-row font-normal xl:ml-3 p-2 border-2-off border-light-blue-500 rounded-xl hover:cursor-pointer hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black border-4 items-center justify-center w-[60px]"
          >
            DAO
          </Link>

          <Link
            href="/dashboard"
            onClick={handleLinkClick}
            className="flex flex-row font-normal xl:ml-3 p-2 border-2-off border-light-blue-500 rounded-xl hover:cursor-pointer hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black border-4 ml-2 items-center justify-center w-[108px]"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

const MobileNav = ({
  menuExp,
  setMenuExpanded,
  closeMenu,
}: MenuExp & { closeMenu: () => void }) => {
  return (
    <div className="relative flex flex-col w-11/12 h-auto justify-center z-10">
      <div
        className={`flex flex-col p-6 absolute top-20 px-8 w-full rounded-xl transition duration-200 jen-fix-padding`}
      >
        <ul className="list-none flex items-start flex-1 flex-col">
          <MobileNavLinks
            classes="flex-col font-bold gap-0 text-[18px]"
            menuExp={menuExp}
            setMenuExpanded={setMenuExpanded}
            closeMenu={closeMenu}
          />
        </ul>

        <div className="flex flex-1 p-2 top-10 justify-start items-start my-3">
          <SocialIcons newTab={true} />
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  const [dark, setDark] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const html: HTMLElement = document.querySelector("html")!;
    const body: HTMLBodyElement = document.querySelector("body")!;
    const activeClassesHtml = ["dark"];
    const activeBody = [
      "bg-slate-900",
      "text-white",
      "transition",
      "duration-500",
    ];
    if (html && dark) {
      activeClassesHtml.forEach((activeClass) =>
        html.classList.add(activeClass)
      );
      activeBody.forEach((activeClass) => body.classList.add(activeClass));
    } else if (html.classList.contains(activeClassesHtml[0])) {
      activeClassesHtml.forEach((activeClass) =>
        html.classList.remove(activeClass)
      );
      activeBody.forEach((activeClass) => body.classList.remove(activeClass));
    }
  }, [dark]);

  return (
    <div
      className={`flex w-full border-b-1 xl:mx-auto sticky top-0 bg-white dark:bg-slate-900 z-40  ${
        menuExpanded ? "mb-[120%]" : ""
      }`}
    >
      <div className="p-2 flex flex-wrap xl:space-x-2">
        <Link href={"/"} className="hover:cursor-pointer">
          <Logo />
        </Link>
      </div>

      <nav className="flex flex-wrap w-full xl:space-x-11">
        <div
          className={`flex flex-wrap space-between font-bold text-base items-center grow hidden xl:flex`}
        >
          <NavLinks
            classes={""}
            menuExp={menuExpanded}
            setMenuExpanded={setMenuExpanded}
            closeMenu={() => setMenuExpanded(false)}
          />
        </div>

        <div className={"flex items-center ms-auto"}>
          <div className="flex w-auto xl:p-5 xl:justify-end space-x-5">
            <Icon
              icon={SearchIcon}
              className="hover:cursor-pointer h-5 w-5"
              onClick={() => setOpenSearch(true)}
            />
            <SearchBar openSearch={openSearch} setOpenSearch={setOpenSearch} />
            <Icon
              icon={dark ? LightIcon : DarkIcon}
              className="hover:cursor-pointer h-5 w-5"
              onClick={() => setDark(!dark)}
            />
          </div>
          <div
            className="hidden xl:flex p-2 w-auto justify-end sm:gap-6"
            style={{ display: "flex", alignItems: "center" }}
          >
            <DonationBtn />
          </div>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="mobile-trigger">
            <div className=" w-auto xl:hidden hover:cursor-pointer p-5">
              <Icon
                className="transition duration-500"
                size={25}
                icon={MenuIcon}
              />
            </div>
          </SheetTrigger>
          <SheetContent side={"left"} className={"bg-white dark:bg-slate-900"}>
            <MobileNav
              menuExp={menuExpanded}
              setMenuExpanded={setMenuExpanded}
              closeMenu={() => {
                setIsOpen(false);
                console.log(isOpen);
              }}
            />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Navigation;

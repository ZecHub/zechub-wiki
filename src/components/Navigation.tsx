"use client";
import DonationBtn from "@/components/ui/DonationBtn";
import { navigations } from "@/constants/navigation";
import type { Classes, MenuExp } from "@/types";
import { Dropdown } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoSearch as SearchIcon } from "react-icons/io5";
import {
  MdOutlineDarkMode as DarkIcon,
  MdLightMode as LightIcon,
} from "react-icons/md";
import { RiMenuLine as MenuIcon } from "react-icons/ri";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/Sheet";
import SearchBar from "./SearchBar";
import { Icon } from "./ui/Icon";
import Logo from "./ui/Logo";
import SocialIcons from "./ui/SocialIcons";

const NavLinks = ({
  classes,
  menuExp,
  setMenuExpanded,
  closeMenu,
}: Classes & { closeMenu: () => void }) => {
  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <div className={`flex ${classes}`}>
      {navigations.map((item, i) =>
        item.links ? (
          <Dropdown
            className="flex flex-row font-normal"
            key={item.name + i}
            label={item.name}
            color="inherit"
            size={"lg"}
            trigger={menuExp ? "click" : "hover"}
            style={{ fontWeight: "400" }}
          >
            {item.links.map((link, i) => (
              <div key={link.path + i}>
                <Dropdown.Item
                  key={link.path}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 p-2"
                >
                  {link.icon && (
                    <Icon icon={link.icon} className="md:w-6 w-4 h-4 md:h-6" />
                  )}
                  <Link href={link.path}>{link.subName}</Link>
                </Dropdown.Item>
              </div>
            ))}
          </Dropdown>
        ) : (
          <div key={item.name + i} className="flex gap-2">
            <Link
              href={item.path}
              onClick={handleLinkClick}
              className="flex flex-row font-normal p-2 mr-3 border-2 border-light-blue-500 rounded-md hover:cursor-pointer hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black"
            >
              {item.name}
            </Link>
          </div>
        )
      )}


      <div className="flex md:flex-row flex-col md:space-x-3 md:ml-3 sm:gap-0 gap-2">
        <Link
          href="/dao"
          onClick={handleLinkClick}
          className="flex flex-row font-normal md:ml-3 p-2 border-2 border-light-blue-500 rounded-md hover:cursor-pointer hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black"
        >
          DAO
        </Link>

        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="flex flex-row font-normal md:ml-3 p-2 border-2 border-light-blue-500 rounded-md hover:cursor-pointer hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black"
        >
          Dashboard
        </Link>
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
        className={`flex flex-col p-6 absolute top-20 px-8 w-full rounded-xl transition duration-200`}
      >
        <ul className="list-none flex items-start flex-1 flex-col">
          <NavLinks
            classes="flex-col font-bold gap-2 text-[18px]"
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
      className={`flex w-full border-b-1 md:mx-auto sticky top-0 bg-white dark:bg-slate-900 z-40  ${
        menuExpanded ? "mb-[120%]" : ""
      }`}
    >
      <div className="p-2 flex flex-wrap md:space-x-2">
        <Link href={"/"} className="hover:cursor-pointer">
          <Logo />
        </Link>
      </div>

      <nav className="flex flex-wrap w-full md:space-x-11">
        <div
          className={`flex flex-wrap space-between font-bold text-base items-center grow hidden md:flex`}
        >
          <NavLinks
            classes={""}
            menuExp={menuExpanded}
            setMenuExpanded={setMenuExpanded}
            closeMenu={() => setMenuExpanded(false)}
          />
        </div>

        <div className={"flex items-center ms-auto"}>
          <div className="flex w-auto md:p-5 md:justify-end space-x-5">
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
            className="hidden md:flex p-2 w-auto justify-end sm:gap-6"
            style={{ display: "flex", alignItems: "center" }}
          >
            <DonationBtn />
          </div>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="mobile-trigger">
            <div className=" w-auto md:hidden hover:cursor-pointer p-5">
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
              closeMenu={() => setIsOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Navigation;

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
  closeMenu,
}: Classes & { closeMenu: () => void }) => {
  return (
    <div className={`flex jen-justify-content ${classes}`}>
      {navigations.map((item) =>
        item.links ? (
          <Dropdown key={item.name} label={item.name}>
            {item.links.map((link, idx) => (
              <div
                key={link.path + idx}
                className="hover:bg-yellow-300 dark:hover:bg-yellow-500 py-0 px-1 rounded-md"
              >
                <Link
                  target={link.newTab ? "_blank" : "_self"}
                  href={link.path}
                >
                  <div
                    onClick={closeMenu}
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
          <div className="dropdown" key={item.name}>
            <div onClick={closeMenu} className="jen-padding">
              <Link
                target={item.newTab ? "_blank" : "_self"}
                href={item.path}
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
          onClick={closeMenu}
          className="flex font-normal xl:ml-0 p-2 border-4 border-light-blue-500 rounded-xl hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black items-center justify-center w-[60px]"
        >
          DAO
        </Link>
        <Link
          href="/dashboard"
          onClick={closeMenu}
          className="flex font-normal xl:ml-3 p-2 border-4 border-light-blue-500 rounded-xl hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
};

const MobileNavLinks = ({
  classes,
  closeMenu,
}: Classes & { closeMenu: () => void }) => {
  return (
    <div className={classes}>
      {navigations.map((item) =>
        item.links ? (
          <DropdownMobile key={item.name} label={item.name}>
            {item.links.map((link, idx) => (
              <div
                key={link.path + idx}
                className="hover:bg-yellow-300 dark:hover:bg-yellow-500 rounded-md"
              >
                <Link
                  target={link.newTab ? "_blank" : "_self"}
                  href={link.path}
                >
                  <div
                    onClick={closeMenu}
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
          <div className="dropdown" key={item.name}>
            <div onClick={closeMenu} className="jen-padding">
              <Link
                target={item.newTab ? "_blank" : "_self"}
                href={item.path}
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
          onClick={closeMenu}
          className="flex font-normal p-2 border-4 border-light-blue-500 rounded-xl hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black justify-center w-[60px]"
        >
          DAO
        </Link>
        <Link
          href="/dashboard"
          onClick={closeMenu}
          className="flex font-normal p-2 border-4 border-light-blue-500 rounded-xl hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black ml-2 justify-center w-[108px]"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
};

const MobileNav = ({
  closeMenu,
}: { closeMenu: () => void }) => (
  <div className="relative flex flex-col w-11/12 h-auto justify-center z-10">
    <div className="flex flex-col p-6 absolute top-20 px-8 w-full rounded-xl transition duration-200 jen-fix-padding">
      <MobileNavLinks
        classes="flex-col font-bold gap-0 text-[18px]"
        closeMenu={closeMenu}
      />
      <div className="flex flex-1 p-2 top-10 justify-start items-start my-3">
        <SocialIcons newTab />
      </div>
    </div>
  </div>
);

const Navigation = () => {
  const [dark, setDark]         = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [openSearch, setOpenSearch]     = useState(false);
  const [isOpen, setIsOpen]             = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (dark) {
      html.classList.add("dark");
      body.classList.add("bg-slate-900", "text-white", "transition", "duration-500");
    } else {
      html.classList.remove("dark");
      body.classList.remove("bg-slate-900", "text-white", "transition", "duration-500");
    }
  }, [dark]);

  return (
    <div className={`flex w-full border-b sticky top-0 bg-white dark:bg-slate-900 z-40 ${menuExpanded ? "mb-[120%]" : ""}`}>
      <div className="p-2 flex items-center">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <nav className="flex w-full xl:space-x-11">
        <div className="hidden xl:flex flex-wrap items-center flex-grow">
          <NavLinks
            classes=""
            closeMenu={() => setMenuExpanded(false)}
          />
        </div>

        <div className="flex items-center ms-auto space-x-5 p-5">
          <Icon icon={SearchIcon} className="h-5 w-5 cursor-pointer" onClick={() => setOpenSearch(true)} />
          <SearchBar openSearch={openSearch} setOpenSearch={setOpenSearch} />
          <Icon
            icon={dark ? LightIcon : DarkIcon}
            className="h-5 w-5 cursor-pointer"
            onClick={() => setDark(!dark)}
          />
          <div className="hidden xl:flex p-2">
            <DonationBtn />
          </div>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="xl:hidden p-5 cursor-pointer">
            <Icon icon={MenuIcon} size={25} className="transition duration-500" />
          </SheetTrigger>
          <SheetContent side="left" className="bg-white dark:bg-slate-900">
            <MobileNav closeMenu={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Navigation;

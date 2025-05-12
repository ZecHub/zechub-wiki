"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoSearch as SearchIcon } from "react-icons/io5";
import {
  MdOutlineDarkMode as DarkIcon,
  MdLightMode as LightIcon,
} from "react-icons/md";
import { RiMenuLine as MenuIcon } from "react-icons/ri";
import DonationBtn from "@/components/UI/DonationBtn";
import Dropdown from "../Dropdown/Dropdown";
import DropdownMobile from "../DropdownMobile/DropdownMobile";
import SearchBar from "../SearchBar";
import { Icon } from "../UI/Icon";
import Logo from "../UI/Logo";
import SocialIcons from "../UI/SocialIcons";
import { Sheet, SheetContent, SheetTrigger } from "../UI/Sheet";
import { navigations } from "@/constants/navigation";


// Desktop links component
const NavLinks: React.FC<{
  classes: string;
  closeMenu: () => void;
}> = ({ classes, closeMenu }) => (
  <div className={`flex items-center ${classes}`}>
    {navigations.map((item) =>
      item.links ? (
        <Dropdown key={item.name} label={item.name}>
          {item.links.map((link, idx) => (
            <div
              key={link.path + idx}
              className="hover:bg-yellow-300 dark:hover:bg-yellow-500 py-1 px-2 rounded-md"
            >
              <Link
                href={link.path}
                target={link.newTab ? "_blank" : "_self"}
                onClick={closeMenu}
                className="flex items-center gap-2 p-2 text-sm"
              >
                {link.icon && <Icon icon={link.icon} className="w-5 h-5" />}
                {link.subName}
              </Link>
            </div>
          ))}
        </Dropdown>
      ) : (
        <div className="px-2" key={item.name}>
          <Link
            href={item.path}
            target={item.newTab ? "_blank" : "_self"}
            onClick={closeMenu}
            className="hover:text-yellow-300 dark:hover:text-yellow-500 hover:font-bold"
          >
            {item.name}
          </Link>
        </div>
      )
    )}

    {/* DAO + Dashboard Buttons */}
    <div className="flex space-x-3 ml-6">
      <Link
        href="/dao"
        onClick={closeMenu}
        className="px-3 py-1 border-2 border-light-blue-500 rounded-lg hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black text-center"
      >
        DAO
      </Link>
      <Link
        href="/dashboard"
        onClick={closeMenu}
        className="px-3 py-1 border-2 border-light-blue-500 rounded-lg hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black text-center"
      >
        Dashboard
      </Link>
    </div>
  </div>
);


// Mobile dropdown links
const MobileNavLinks: React.FC<{
  classes: string;
  closeMenu: () => void;
}> = ({ classes, closeMenu }) => (
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
                href={link.path}
                target={link.newTab ? "_blank" : "_self"}
                onClick={closeMenu}
                className="flex items-center gap-2 p-2 text-sm"
              >
                {link.icon && <Icon icon={link.icon} className="w-5 h-5" />}
                {link.subName}
              </Link>
            </div>
          ))}
        </DropdownMobile>
      ) : (
        <div className="px-2" key={item.name}>
          <Link
            href={item.path}
            target={item.newTab ? "_blank" : "_self"}
            onClick={closeMenu}
            className="hover:text-yellow-300 dark:hover:text-yellow-500 hover:font-bold block p-2"
          >
            {item.name}
          </Link>
        </div>
      )
    ))}

    {/* DAO + Dashboard for mobile */}
    <div className="flex flex-col space-y-2 mt-4">
      <Link
        href="/dao"
        onClick={closeMenu}
        className="px-3 py-1 border-2 border-light-blue-500 rounded-lg hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black text-center"
      >
        DAO
      </Link>
      <Link
        href="/dashboard"
        onClick={closeMenu}
        className="px-3 py-1 border-2 border-light-blue-500 rounded-lg hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black text-center"
      >
        Dashboard
      </Link>
    </div>
  </div>
);


// Mobile sheet wrapper
const MobileNav: React.FC<{
  closeMenu: () => void;
}> = ({ closeMenu }) => (
  <div className="relative flex flex-col w-full h-auto justify-center bg-white dark:bg-slate-900">
    <MobileNavLinks
      classes="flex-col font-bold gap-2 text-lg p-4"
      closeMenu={closeMenu}
    />
    <div className="p-4">
      <SocialIcons newTab />
    </div>
  </div>
);


const Navigation: React.FC = () => {
  const [dark, setDark]           = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  // toggle dark mode classes
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
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex flex-grow items-center">
          <NavLinks classes="" closeMenu={() => {}} />
        </nav>

        {/* Search / Dark / Donation / Mobile menu */}
        <div className="flex items-center space-x-4">
          <Icon
            icon={SearchIcon}
            className="w-5 h-5 cursor-pointer"
            onClick={() => setOpenSearch(true)}
          />
          <SearchBar openSearch={openSearch} setOpenSearch={setOpenSearch} />
          <Icon
            icon={dark ? LightIcon : DarkIcon}
            className="w-5 h-5 cursor-pointer"
            onClick={() => setDark(!dark)}
          />
          <div className="hidden xl:block">
            <DonationBtn />
          </div>

          {/* mobile menu button */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger className="xl:hidden p-2">
              <Icon icon={MenuIcon} size={24} className="cursor-pointer" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <MobileNav closeMenu={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigation;

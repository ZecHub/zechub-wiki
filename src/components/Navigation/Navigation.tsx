"use client";
import DonationBtn from "@/components/UI/DonationBtn";
import { navigations } from "@/constants/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoSearch as SearchIcon } from "react-icons/io5";
import {
  MdOutlineDarkMode as DarkIcon,
  MdLightMode as LightIcon,
} from "react-icons/md";
import { RiMenuLine as MenuIcon } from "react-icons/ri";
import Dropdown from "../Dropdown/Dropdown";
import DropdownMobile from "../DropdownMobile/DropdownMobile";
import SearchBar from "../SearchBar";
import { Icon } from "../UI/Icon";
import Logo from "../UI/Logo";
import { Sheet, SheetContent, SheetTrigger } from "../UI/Sheet";
import SocialIcons from "../UI/SocialIcons";

const NavLinks = ({
  classes,
  closeMenu,
}: {
  classes: string;
  closeMenu: () => void;
}) => {
  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <div className={`flex items-center space-x-6 ${classes}`}>
      {/* show first 4 links normally */}
      {navigations.slice(0, 4).map((item, i) =>
        item.links ? (
          <Dropdown label={item.name} key={item.name + i}>
            {item.links.map((link, i) => (
              <div
                key={link.path + i}
                className="hover:bg-yellow-300 dark:hover:bg-yellow-500 py-1 px-2 rounded-md transition-colors duration-200"
              >
                <Link
                  target={link.newTab ? "_blank" : "_self"}
                  href={link.path}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center gap-2 text-sm">
                    {link.icon && (
                      <Icon
                        icon={link.icon}
                        className="w-4 h-4 xl:w-5 xl:h-5"
                      />
                    )}
                    {link.subName}
                  </div>
                </Link>
              </div>
            ))}
          </Dropdown>
        ) : (
          <Link
            key={item.name + i}
            href={item.path}
            target={item.newTab ? "_blank" : "_self"}
            onClick={handleLinkClick}
            className="hover:text-yellow-400 dark:hover:text-yellow-500 hover:underline transition-colors duration-200"
          >
            {item.name}
          </Link>
        )
      )}

      {/* overflow nav in a More dropdown */}
      {navigations.length > 4 && (
        <Dropdown label="More">
          {navigations.slice(4).map((item, i) => (
            <Link
              key={item.name + i}
              href={String(item.path)}
              target={item.newTab ? "_blank" : "_self"}
              onClick={handleLinkClick}
              className="block px-4 py-2 hover:bg-yellow-200 dark:hover:bg-yellow-600 rounded-md transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </Dropdown>
      )}

      {/* CTA buttons */}
      <div className="flex flex-row space-x-3 ml-6">
        <Link
          href="/dao"
          onClick={handleLinkClick}
          className="px-4 py-2 border border-blue-500 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200"
        >
          DAO
        </Link>

        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="px-4 py-2 border border-blue-500 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
};

const MobileNavLinks = ({ closeMenu }: { closeMenu: () => void }) => {
  const handleLinkClick = () => closeMenu();

  return (
    <div className="flex flex-col space-y-3 font-normal text-md">
      <ul className="list-none flex flex-col ">
        {navigations.map((item, i) =>
          item.links ? (
            <DropdownMobile label={item.name} key={item.name + i}>
              {item.links.map((link, i) => (
                <Link
                  key={link.path + i}
                  target={link.newTab ? "_blank" : "_self"}
                  href={link.path}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-300 dark:hover:bg-yellow-500 transition-colors duration-200"
                >
                  {link.icon && (
                    <Icon
                      icon={link.icon}
                      className="w-4 h-4 xl:w-5 xl:h-5 min-w-[1rem]"
                    />
                  )}
                  {link.subName}
                </Link>
              ))}
            </DropdownMobile>
          ) : (
            <Link
              key={item.name + i}
              href={item.path}
              target={item.newTab ? "_blank" : "_self"}
              onClick={handleLinkClick}
              className="px-3 py-2 rounded-md hover:bg-yellow-300 dark:hover:bg-yellow-500 hover:underline transition-colors duration-200"
            >
              {item.name}
            </Link>
          )
        )}
      </ul>

      {/* CTA buttons */}
      <div className="flex flex-row space-x-3 mt-4">
        <Link
          href="/dao"
          onClick={handleLinkClick}
          className="px-4 py-2 border border-blue-500 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200"
        >
          DAO
        </Link>

        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="px-4 py-2 border border-blue-500 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
};

const MobileNav = ({ closeMenu }: { closeMenu: () => void }) => {
  return (
    <div className="flex flex-col h-[90%]">
      <div className="flex-1">
        <MobileNavLinks closeMenu={closeMenu} />
      </div>

      <SocialIcons newTab={true} />
    </div>
  );
};

const Navigation = () => {
  const [dark, setDark] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(prefersDark.matches);

    const listener = (e: MediaQueryListEvent) => setDark(e.matches);
    prefersDark.addEventListener("change", listener);

    return () => prefersDark.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    const html: HTMLElement = document.querySelector("html")!;
    const body: HTMLBodyElement = document.querySelector("body")!;
    if (dark) {
      html.classList.add("dark");
      body.classList.add(
        "bg-slate-900",
        "text-white",
        "transition",
        "duration-500"
      );
    } else {
      html.classList.remove("dark");
      body.classList.remove(
        "bg-slate-900",
        "text-white",
        "transition",
        "duration-500"
      );
    }
  }, [dark]);

  return (
    <div className="flex w-full border-b sticky top-0 bg-white dark:bg-slate-900 z-40 px-3 md:px-6">
      <div className="p-2 flex items-center">
        <Link href={"/"} className="hover:cursor-pointer">
          <Logo />
        </Link>
      </div>

      <nav className="flex items-center w-full">
        {/* Desktop Nav */}
        <div className="hidden lg:flex grow">
          <NavLinks classes="" closeMenu={() => setIsOpen(false)} />
        </div>

        {/* Right side controls */}
        <div className="flex items-center ml-auto space-x-4">
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

          <div className="hidden lg:flex">
            <DonationBtn />
          </div>

          {/* Mobile Hamburger */}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="lg:hidden">
              <div className="hover:cursor-pointer p-3">
                <Icon
                  className="transition duration-500"
                  size={25}
                  icon={MenuIcon}
                />
              </div>
            </SheetTrigger>

            <SheetContent
              side="left"
              className=" bg-white dark:bg-slate-900 min-h-screen"
            >
              <MobileNav closeMenu={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;

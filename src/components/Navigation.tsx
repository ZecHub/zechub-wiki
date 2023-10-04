"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./ui/Logo";
import SocialIcons from "./ui/SocialIcons";
import { Icon } from "./ui/Icon";
import {
  RiMenuLine as MenuIcon,
  RiCloseFill as CloseIcon,
} from "react-icons/ri";
import {
  MdOutlineDarkMode as DarkIcon,
  MdLightMode as LightIcon,
} from "react-icons/md";
import { navigation } from "@/config";
import type { Links, MenuExp, Classes } from "@/types";

const NavLinks = (classes: Classes) => {
  return navigation.map(({ name, path }: Links) => (
    <div key={name} className={`px-2 py-2 ${classes}`} data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover">
      <Link href={path}>{name}</Link>
      <div className="py-2"><Arrow /></div>
 
    </div>
  ));
};

const Arrow = () => (
  <svg
    className="w-2.5 h-2.5 ml-2.5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 10 6"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m1 1 4 4 4-4"
    />
  </svg>
);
const Dropdowns = () => {
  return <></>;
};

const MobileNav = ({ menuExpanded }: MenuExp) => {
  return (
    <div className="absolute flex flex-col w-11/12 h-auto justify-center z-10">
      {/* Menu */}
      <div
        className={`${
          !menuExpanded ? "hidden" : "flex"
        } shadow flex-col p-6 absolute top-20 px-8 w-full ml-11 rounded-xl transition duration-200`}
      >
        <ul className="list-none flex items-start flex-1 flex-col bg-slate-700">
          <NavLinks classes="font-bold" />
        </ul>

        <div className="flex flex-1 p-2 top-10 justify-start items-start">
          <SocialIcons newTab={true} />
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  const [dark, setDark] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);

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
      className={`flex w-full md:h-30 border-b-4 border-slate-500 dark:border-slate-100 mb-3 md:py-5 md:mx-auto ${
        menuExpanded ? "mb-[170%]" : ""
      }`}
    >
      <div className="w-50 md:w-28 h-full p-2 flex flex-wrap md:space-x-2 bg-slate-800">
        <Link href={"/"} className="hover:cursor-pointer">
          <Logo />
        </Link>
      </div>

      <nav className="flex flex-wrap w-full sm:justify-end space-x-7 md:space-x-11">
        {menuExpanded && (
          <div className="flex justify-center">
            <MobileNav menuExpanded={menuExpanded} />
          </div>
        )}
        <div
          className={`flex flex-wrap space-between font-bold text-base items-center hidden md:flex`}
        >
          <NavLinks classes="hover:animate-pulse" />
        </div>

        <div className="flex hover:cursor-pointer w-auto md:w-1/4 p-5 md:justify-end">
          <Icon
            size={25}
            icon={dark ? LightIcon : DarkIcon}
            onClick={() => setDark(!dark)}
          />
        </div>
        <div className="hidden md:flex p-5 w-auto md:w-40 justify-end">
          <SocialIcons newTab={false} />
        </div>
        <div className=" w-auto md:hidden hover:cursor-pointer p-5">
          <Icon
            className="transition duration-500"
            size={25}
            icon={menuExpanded ? CloseIcon : MenuIcon}
            onClick={() => setMenuExpanded(!menuExpanded)}
          />
        </div>
      </nav>
    </div>
  );
};

export default Navigation;

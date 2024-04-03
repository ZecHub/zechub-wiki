"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { navigations } from "@/constants/navigation";
import type { Classes, MenuExp } from "@/types";
import { Dropdown } from "flowbite-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/Sheet";
import {
  MdOutlineDarkMode as DarkIcon,
  MdLightMode as LightIcon,
} from "react-icons/md";
import {
  RiCloseFill as CloseIcon,
  RiMenuLine as MenuIcon,
} from "react-icons/ri";
import { IoSearch as SearchIcon } from "react-icons/io5";
import { Icon } from "./ui/Icon";
import Logo from "./ui/Logo";
import SocialIcons from "./ui/SocialIcons";
// import { AuthDisplay } from "./AccountDisplay/AccountDisplay";
import DonationBtn from "@/components/ui/DonationBtn";
import SearchBar from "./SearchBar";

const NavLinks = ({ classes, menuExp, setMenuExpanded }: Classes) => {
  const router = useRouter();
  return (
    <div className={`flex  ${classes}`}>
      {navigations.map((item, i) => (
        <Dropdown
          className="flex flex-row font-normal"
          key={item.name + i}
          label={item.name}
          color="inherit"
          trigger={menuExp ? "click" : "hover"}
          style={{fontWeight:"400"}}
        >
          {item.links.map((link) => (
            <Dropdown.Item key={link.path}>
              <Link href={link.path}>{link.subName}</Link>
            </Dropdown.Item>
          ))}
        </Dropdown>
      ))}

      <div className="flex md:flex-row flex-col md:space-x-3 md:ml-3">
        {/* DAO Link */}
        <Link href="/dao" className="flex flex-row font-normal md:ml-3 p-2 border-2 border-light-blue-500 rounded-md hover:cursor-pointer hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black">
            DAO
        </Link>

        {/* Dashboard Link */}
        <Link href="/dashboard" className="flex flex-row font-normal md:ml-3 p-2 border-2 border-light-blue-500 rounded-md hover:cursor-pointer hover:bg-[#1984c7] hover:text-white dark:hover:bg-white dark:hover:text-black">
            Dashboard    
        </Link>
      </div>
    </div>
  );
};

const MobileNav = ({ menuExp, setMenuExpanded }: MenuExp) => {
  return (
    <div className=" flex flex-col w-11/12 h-auto justify-center z-10">
      <div
        className={`flex flex-col p-6 absolute top-20 px-8 w-full ml-11 rounded-xl transition duration-200`}
      >
        <ul className="list-none flex items-start flex-1 flex-col">
          <NavLinks
            classes="flex-col font-bold"
            menuExp={menuExp}
            setMenuExpanded={setMenuExpanded}
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
          />
        </div>

        <div className={"flex items-center ms-auto"}>
          <div className="flex w-auto md:p-5 md:justify-end space-x-5">
            <Icon
              icon={dark ? LightIcon : DarkIcon}
              className="hover:cursor-pointer h-5 w-5"
              onClick={() => setDark(!dark)}
            />
            <Icon
              icon={SearchIcon}
              className="hover:cursor-pointer h-5 w-5"
              onClick={() => setOpenSearch(true)}
            />
            <SearchBar openSearch={openSearch} setOpenSearch={setOpenSearch} />
          </div>
          <div
            className="hidden md:flex p-2 w-auto justify-end sm:gap-6"
            style={{ display: "flex", alignItems: "center" }}
          >
            <DonationBtn />
          </div>
        </div>
        <Sheet>
          <SheetTrigger className="mobile-trigger">
            <div className=" w-auto md:hidden hover:cursor-pointer p-5">
              <Icon
                className="transition duration-500"
                size={25}
                icon={MenuIcon}
              />
            </div>
          </SheetTrigger>
          <SheetContent side={"left"} className={"bg-white"}>
            <MobileNav
              menuExp={menuExpanded}
              setMenuExpanded={setMenuExpanded}
            />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Navigation;

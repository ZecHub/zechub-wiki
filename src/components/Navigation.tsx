"use client";
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
} from "../components/ui/Sheet"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdOutlineDarkMode as DarkIcon,
  MdLightMode as LightIcon,
} from "react-icons/md";
import {
  RiCloseFill as CloseIcon,
  RiMenuLine as MenuIcon,
} from "react-icons/ri";
import { Icon } from "./ui/Icon";
import Logo from "./ui/Logo";
import SocialIcons from "./ui/SocialIcons";
import { AuthDisplay } from "./AccountDisplay/AccountDisplay";
import DonationBtn from "@/components/DonationBtn";

const NavLinks = ({ classes, menuExp }: Classes) => {
  const router = useRouter();

  return (
    <div className={`flex  ${classes}`}>
      {navigations.map((item, i) => (
        <Dropdown
          className="flex flex-row font-medium"
          key={item.name + i}
          label={item.name}
          color="inherit"
          trigger={menuExp ? "click" : "hover"}
        >
          {item.links.map((link) => (
            <Dropdown.Item
              type="button"
              key={link.path}
              onClick={() => {
                router.push(link.path);
              }}
            >
              {link.subName}
            </Dropdown.Item>
          ))}
        </Dropdown>
      ))}
      <button
        className="flex flex-row font-medium p-2 top-10"
        onClick={() => {
          router.push("./dao");
        }}
      >
        DAO
      </button>
    </div>
  );
};

const MobileNav = ({ menuExpanded }: MenuExp) => {
  return (
    <div className=" flex flex-col w-11/12 h-auto justify-center z-10">
      {/* Menu */}
      <div
        className={`${
         "flex"
        }  flex-col p-6 absolute top-20 px-8 w-full ml-11 rounded-xl transition duration-200`}
      >

        <ul className="list-none flex items-start flex-1 flex-col">

          <NavLinks classes="flex-col font-bold" menuExp={menuExpanded} />
        </ul>

        <div className="flex flex-1 p-2 top-10 justify-start items-start my-3">
          <SocialIcons newTab={true} />
        </div>
        <AuthDisplay
          style={{ display: "flex", flexDirection: "row", gap: "12px" }}
        />
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
      className={`flex w-full md:h-32 border-b-4 border-slate-500 dark:border-slate-100 mb-3 md:py-5 md:mx-auto ${
        menuExpanded ? "mb-[120%]" : ""
      }`}
    >
      <div className="w-52 md:w-28 min-h-[100px] p-2 flex flex-wrap md:space-x-2">
        <Link href={"/"} className="hover:cursor-pointer">
          <Logo />
        </Link>
      </div>

      <nav className="flex flex-wrap w-full sm:justify-end space-x-7 md:space-x-11">
        {/*{menuExpanded && (*/}
        {/*  <div className="flex justify-center">*/}
        {/*    <MobileNav menuExpanded={menuExpanded} />*/}
        {/*  </div>*/}
        {/*)}*/}
        <div
          className={`flex flex-wrap space-between font-bold text-base items-center hidden md:flex`}
        >
          <NavLinks classes={""} menuExp={menuExpanded} />
        </div>

        <div className={"flex items-center md:gap-14"} >
          <div className="flex  w-auto md:w-1/4 md:p-5 md:justify-end md:mr-12">
            <Icon

              icon={dark ? LightIcon : DarkIcon}
              className="hover:cursor-pointer md:h-6 md:w-6 h-4 w-4"
              onClick={() => setDark(!dark)}
            />
          </div>
          <div
            className="hidden md:flex p-2 w-auto md:w-40 justify-end sm:gap-6"
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* <SocialIcons newTab={false} /> */}
            <DonationBtn />
            {/* <AuthDisplay
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
              }}
            /> */}
          </div>
        </div>
        <Sheet>
          <SheetTrigger>
            <div className=" w-auto md:hidden hover:cursor-pointer p-5">
              <Icon
                  className="transition duration-500"
                  size={25}
                  icon={MenuIcon}
                  // onClick={() => setMenuExpanded(!menuExpanded)}
              />
            </div>
          </SheetTrigger>
          <SheetContent side={"left"} className={"bg-white"}>
           <MobileNav menuExpanded={menuExpanded}/>
          </SheetContent>
        </Sheet>

      </nav>
    </div>
  );
};

export default Navigation;

"use client";
import DonationBtn from "@/components/UI/DonationBtn";
// import { navigations } from "@/constants/navigation";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IoSearch as SearchIcon } from "react-icons/io5";
import {
  MdOutlineDarkMode as DarkIcon,
  MdLightMode as LightIcon,
} from "react-icons/md";
import { RiMenuLine as MenuIcon } from "react-icons/ri";
// import Dropdown from "../Dropdown/Dropdown";
// import DropdownMobile from "../DropdownMobile/DropdownMobile";
import SearchBar from "../SearchBar";
import { Icon } from "../UI/Icon";
import Logo from "../UI/Logo";
import { Sheet, SheetContent, SheetTrigger } from "../UI/Sheet";
import SocialIcons from "../UI/SocialIcons";
  
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/UI/dropdown-menu";
 import { Search, Sun, Moon, Menu, ChevronDown } from "lucide-react";
import { Button } from "../UI/button";

 // Sample navigation data - replace with your actual data
 const navigations = [
   { name: "Home", path: "/" },
   { name: "About", path: "/about" },
   {
     name: "Services",
     path: "/services",
     links: [
       { subName: "Web Development", path: "/services/web", icon: "Code" },
       { subName: "Design", path: "/services/design", icon: "Palette" },
       { subName: "Consulting", path: "/services/consulting", icon: "Users" },
     ],
   },
   { name: "Blog", path: "/blog" },
   { name: "Contact", path: "/contact" },
   { name: "Portfolio", path: "/portfolio" },
 ];


 const Dropdown = ({
   label,
   children,
 }: {
   label: string;
   children: React.ReactNode;
 }) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
     <div
       className="relative"
       onMouseEnter={() => setIsOpen(true)}
       onMouseLeave={() => setIsOpen(false)}
     >
       <div className="flex items-center gap-1 text-nav-foreground hover:text-nav-hover transition-colors duration-200 cursor-pointer py-2">
         {label}
         <ChevronDown
           className={`h-4 w-4 transition-transform duration-200 ${
             isOpen ? "rotate-180" : ""
           }`}
         />
       </div>
       {isOpen && (
         <div className="absolute top-full left-0 z-50 bg-nav-background border border-nav-border shadow-lg min-w-[200px] rounded-md py-1 mt-1">
           {children}
         </div>
       )}
     </div>
   );
 };

 const DropdownMobile = ({
   label,
   children,
 }: {
   label: string;
   children: React.ReactNode;
 }) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
     <div className="w-full">
       <button
         onClick={() => setIsOpen(!isOpen)}
         className="flex items-center justify-between w-full px-3 py-2 text-left text-nav-foreground hover:bg-nav-hover-bg rounded-md transition-colors duration-200"
       >
         {label}
         <ChevronDown
           className={`h-4 w-4 transition-transform ${
             isOpen ? "rotate-180" : ""
           }`}
         />
       </button>
       {isOpen && <div className="pl-4 mt-1 space-y-1">{children}</div>}
     </div>
   );
 };

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
     <div className={`flex items-center ${classes}`}>
       {/* Navigation links with responsive behavior */}
       <div className="hidden lg:flex items-center space-x-6">
         {/* Show first 4 links normally on desktop */}
         {navigations.slice(0, 4).map((item, i) =>
           item.links ? (
             <Dropdown label={item.name} key={item.name + i}>
               {item.links.map((link, i) => (
                 <div
                   key={link.path + i}
                   className="hover:bg-nav-hover-bg py-2 px-3 transition-colors duration-200"
                 >
                   <Link
                     href={link.path}
                     onClick={handleLinkClick}
                     className="flex items-center gap-2 text-sm w-full text-nav-foreground hover:text-nav-hover"
                   >
                     {link.subName}
                   </Link>
                 </div>
               ))}
             </Dropdown>
           ) : (
             <Link
               key={item.name + i}
               href={item.path}
               onClick={handleLinkClick}
               className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 whitespace-nowrap"
             >
               {item.name}
             </Link>
           )
         )}

         {/* Overflow nav in a More dropdown for desktop */}
         {navigations.length > 4 && (
           <Dropdown label="More">
             {navigations.slice(4).map((item, i) => (
               <div
                 key={item.name + i}
                 className="hover:bg-nav-hover-bg py-2 px-3 transition-colors duration-200"
               >
                 <Link
                   href={String(item.path)}
                   onClick={handleLinkClick}
                   className="w-full text-nav-foreground hover:text-nav-hover"
                 >
                   {item.name}
                 </Link>
               </div>
             ))}
           </Dropdown>
         )}
       </div>

       {/* Medium screens - show fewer links */}
       <div className="hidden md:flex lg:hidden items-center space-x-4">
         {navigations.slice(0, 2).map((item, i) => (
           <Link
             key={item.name + i}
             href={item.path}
             onClick={handleLinkClick}
             className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm"
           >
             {item.name}
           </Link>
         ))}
         {navigations.length > 2 && (
           <Dropdown label="More">
             {navigations.slice(2).map((item, i) => (
               <div
                 key={item.name + i}
                 className="hover:bg-nav-hover-bg py-2 px-3 transition-colors duration-200"
               >
                 <Link
                   href={String(item.path)}
                   onClick={handleLinkClick}
                   className="w-full text-nav-foreground hover:text-nav-hover"
                 >
                   {item.name}
                 </Link>
               </div>
             ))}
           </Dropdown>
         )}
       </div>

       {/* CTA buttons - responsive */}
       <div className="hidden md:flex items-center space-x-3 ml-6">
         <Button
           variant="outline"
           size="sm"
           className="border-cta-border text-cta-primary hover:bg-cta-primary hover:text-white transition-colors duration-200"
           asChild
         >
           <Link href="/dao" onClick={handleLinkClick}>
             DAO
           </Link>
         </Button>

         <Button
           variant="outline"
           size="sm"
           className="border-cta-border text-cta-primary hover:bg-cta-primary hover:text-white transition-colors duration-200"
           asChild
         >
           <Link href="/dashboard" onClick={handleLinkClick}>
             Dashboard
           </Link>
         </Button>
       </div>
     </div>
   );
 };

 const MobileNavLinks = ({ closeMenu }: { closeMenu: () => void }) => {
   const handleLinkClick = () => closeMenu();

   return (
     <div className="flex flex-col space-y-1 font-normal">
       {navigations.map((item, i) =>
         item.links ? (
           <DropdownMobile label={item.name} key={item.name + i}>
             {item.links.map((link, i) => (
               <Link
                 key={link.path + i}
                 href={link.path}
                 onClick={handleLinkClick}
                 className="flex items-center gap-2 px-3 py-2 rounded-md text-nav-foreground hover:bg-nav-hover-bg transition-colors duration-200"
               >
                 {link.subName}
               </Link>
             ))}
           </DropdownMobile>
         ) : (
           <Link
             key={item.name + i}
             href={item.path}
             onClick={handleLinkClick}
             className="px-3 py-2 rounded-md text-nav-foreground hover:bg-nav-hover-bg transition-colors duration-200"
           >
             {item.name}
           </Link>
         )
       )}

       {/* Mobile CTA buttons */}
       <div className="flex flex-col space-y-3 mt-6 pt-6 border-t border-nav-border">
         <Button
           variant="outline"
           className="border-cta-border text-cta-primary hover:bg-cta-primary hover:text-white transition-colors duration-200 w-full justify-start"
           asChild
         >
           <Link href="/dao" onClick={handleLinkClick}>
             DAO
           </Link>
         </Button>

         <Button
           variant="outline"
           className="border-cta-border text-cta-primary hover:bg-cta-primary hover:text-white transition-colors duration-200 w-full justify-start"
           asChild
         >
           <Link href="/dashboard" onClick={handleLinkClick}>
             Dashboard
           </Link>
         </Button>
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
     <header className="sticky top-0 z-40 w-full border-b border-nav-border bg-nav-background backdrop-blur supports-[backdrop-filter]:bg-nav-background/95">
       <div className="container mx-auto">
         <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
           {/* Logo */}
           <Link href="/" className="shrink-0 hover:cursor-pointer">
             <Logo />
           </Link>

           {/* Desktop & Tablet Nav */}
           <nav className="hidden md:flex flex-1 justify-center max-w-4xl mx-8">
             <NavLinks
               classes="w-full justify-center"
               closeMenu={() => setIsOpen(false)}
             />
           </nav>

           {/* Right side controls */}
           <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
             {/* Search */}
             <Button
               variant="ghost"
               size="sm"
               onClick={() => setOpenSearch(true)}
               className="p-2 hover:bg-nav-hover-bg"
             >
               <Search className="h-4 w-4 md:h-5 md:w-5" />
             </Button>
             <SearchBar openSearch={openSearch} setOpenSearch={setOpenSearch} />

             {/* Theme toggle */}
             <Button
               variant="ghost"
               size="sm"
               onClick={() => setDark(!dark)}
               className="p-2 hover:bg-nav-hover-bg"
             >
               {dark ? (
                 <Sun className="h-4 w-4 md:h-5 md:w-5" />
               ) : (
                 <Moon className="h-4 w-4 md:h-5 md:w-5" />
               )}
             </Button>

             {/* Desktop donation button */}
             <div className="hidden lg:flex">
               <DonationBtn />
             </div>

             {/* Mobile menu */}
             <Sheet open={isOpen} onOpenChange={setIsOpen}>
               <SheetTrigger className="md:hidden">
                 <Button
                   variant="ghost"
                   size="sm"
                   className="p-2 hover:bg-nav-hover-bg"
                 >
                   <Menu className="h-5 w-5" />
                 </Button>
               </SheetTrigger>

               <SheetContent
                 side="left"
                 className="bg-nav-background border-nav-border min-h-screen w-[300px] sm:w-[350px]"
               >
                 <MobileNav closeMenu={() => setIsOpen(false)} />
               </SheetContent>
             </Sheet>
           </div>
         </div>
       </div>
     </header>
   );
 };


 

export default Navigation;

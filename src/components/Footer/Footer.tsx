import Link from "next/link";
import Logo from "../UI/Logo";
import SocialIcons from "../UI/SocialIcons";
import { ShopButton } from "../Shop-button/shop-button";

const Footer = () => {
  return (
    <div className="w-full border-slate-500 dark:border-slate-100 mt-3 md:py-5">
      <footer className="rounded-t-md md:rounded-lg shadow bg-[#1984c7] md:flex md:items-center md:flex-col py-3 text-white">
        <div className="flex justify-center items-center my-4">
          <Logo />
        </div>
        <div className="flex w-full mx-auto max-w-screen-xl justify-center items-center p-4 md:flex-col md:items-center md:justify-between">
          <ul className="flex flex-wrap items-center justify-center mt-3 text-sm font-medium sm:mt-0">
            <li>
              <ShopButton hasBorder={true} shopUrl="https://zechub.store" />
            </li>
          </ul>
        </div>
        <div className="flex justify-center flex-col my-3">
          <span className="text-sm sm:text-center">
            © 2025{" "}
            <Link
              href="https://zechub.social/@Zechub"
              rel="me"
              className="hover:underline"
            >
              Zechub™
            </Link>
            . All Rights Reserved.
          </span>
        </div>
        <div className="w-full flex justify-center items-center">
          <SocialIcons newTab={true} />
        </div>
      </footer>
    </div>
  );
};

export default Footer;

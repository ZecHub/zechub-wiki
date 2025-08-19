import Link from "next/link";
import { ShopButton } from "../Shop-button/shop-button";
import SocialIcons from "../UI/SocialIcons";

const Footer = () => {
  return (
    <footer className=" shadow bg-[#1984c7] md:flex md:items-center md:flex-col py-3 text-white">
      <div className="flex w-full mx-auto max-w-screen-xl justify-center items-center p-4 md:flex-col md:items-center md:justify-between my-8">
        <ul className="flex flex-wrap items-center justify-center mt-3 text-sm font-medium sm:mt-0">
          <li>
            <ShopButton hasBorder={true} shopUrl="https://zechub.store" />
          </li>
        </ul>
      </div>
      <div className="flex justify-center flex-col my-3 space-y-1">
        <span className="text-sm sm:text-center">
          © {new Date().getFullYear()}{" "}
          <Link
            href="https://zechub.social/@Zechub"
            rel="me"
            className="hover:underline"
          >
            Zechub™
          </Link>
          . All Rights Reserved.
        </span>
        <span className="text-sm sm:text-center font-light text-slate-200">
          <Link href={"/sitemap"}>Sitemap</Link>
        </span>
      </div>
      <div className="w-full flex justify-center items-center my-3">
        <SocialIcons newTab={true} />
      </div>
    </footer>
  );
};

export default Footer;

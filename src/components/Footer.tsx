import Link from "next/link";
import Logo from "./ui/Logo";
import SocialIcons from "./ui/SocialIcons";

const Footer = () => {
  return (

    <div className=" w-full border-t-4 border-slate-500 dark:border-slate-100 mt-3 md:py-5">
      <footer className="rounded-lg shadow bg-[#1984c7] md:flex md:items-center md:flex-col py-3 text-white">
        <div className="flex justify-center items-center">
          <Logo />
        </div>
        <div className="flex w-full mx-auto max-w-screen-xl justify-center items-center p-4 md:flex-col md:items-center md:justify-between">
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <span className="text-sm  sm:text-center">
          © 2023{" "}
          <a href="null" className="hover:underline">
            Zechub™
          </a>
          . All Rights Reserved.
        </span>
        <div className="mb-2">
          <p className="text-center">Made by <Link href={'https://github.com/ManyRios'} target="_blank"><span className="color-blue font-bold hover:scale-125">Manuel Rios</span></Link></p>
        </div>
        <div className="w-full flex justify-center items-center">
          <SocialIcons newTab={true} />
        </div>
      </footer>
    </div>
  );
};

export default Footer;

/* 




*/

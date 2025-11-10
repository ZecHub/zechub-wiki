import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="text-center px-6 py-16 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl">
      <div className="flex items-center justify-center flex-col lg:flex-row mb-4">
        <Image
          src={"/DAOlogo.png"}
          alt="ZecHub Logo"
          width={100}
          height={100}
          className="mr-4 mb-2 md:mb-0"
        />
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r dark:from-white dark:to-slate-50 bg-clip-text">
          ZecHub{" "}
          <Link
            href="https://nym.com/blog/what-is-dao"
            target="_blank"
            className="text-amber-400 hover:text-amber-500"
          >
            DAO
          </Link>{" "}
          &{" "}
          <Link
            href="/governance-howto"
            target="_blank"
            className="text-amber-400 hover:text-amber-500"
          >
            Governance
          </Link>
        </h1>
      </div>
      <p className="text-lg dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        An open source educational platform where community members collaborate
        on creating, validating, and promoting content that supports the Zcash
        ecosystem
      </p>
    </header>
  );
}

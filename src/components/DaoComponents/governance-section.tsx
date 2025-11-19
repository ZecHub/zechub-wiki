import Link from "next/link";
import Image from "next/image";

export default function GovernanceSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold dark:text-amber-400 flex items-center gap-3">
        <span className="w-1 h-10 bg-gradient-to-b from-amber-400 to-yellow-300 rounded"></span>
        Governance
      </h2>
      <p className="dark:text-slate-300 leading-relaxed">
        All DAO proposals are public and transparent. Anyone can create a
        proposal to vote on. In support of community transparency, ZecHub DAO
        posts all governance proposals in the Zcash Community Forum ZecHub
        Governance thread.
      </p>

      <div className="flex justify-center items-center text-center space-x-4 mb-12">
        <div>
          <Link
            href="https://daodao.zone/dao/juno1nktrulhakwm0n3wlyajpwxyg54n39xx4y8hdaqlty7mymf85vweq7m6t0y/proposals"
            target="_blank"
          >
            <Image
              className="rounded-full border-4 border-slate-400 dark:border-black hover:scale-125"
              src={"/daodao.jpg"}
              alt="DAODAO"
              width={80}
              height={80}
            />
          </Link>
          <h1 className="font-bold">DAO DAO</h1>
        </div>
        <div>
          <Link href="https://snapshot.org/#/zechubdao.eth" target="_blank">
            <Image
              className="rounded-full border-4 border-slate-400 dark:border-black hover:scale-125"
              src={"/snapshot.jpg"}
              alt="Ethereum DAO"
              width={80}
              height={80}
            />
          </Link>
          <h1 className="font-bold">Snapshot</h1>
        </div>
      </div>
    </section>
  );
}

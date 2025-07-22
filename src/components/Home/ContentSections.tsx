import Image from "next/image";
import Link from "next/link";
import { FadeInAnimation } from "../ui/Fade";

const ContentSections = () => {
  return (
    <>
      <section>
        <div className="flex space-y-4 flex-col w-full mt-5 px-5">
          <div className="flex flex-col space-y-4 md:flex-row min-h-screen w-auto border-2 border-[#E4A100]/50 rounded-md p-5">
            <div className="flex flex-1 items-center justify-center w-auto md:w-2/4">
              <FadeInAnimation>
                <Image
                  src={"/Zcashcard.png"}
                  alt=""
                  width={500}
                  height={50}
                  unoptimized={true}
                />
              </FadeInAnimation>
            </div>

            <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
              <FadeInAnimation>
                <h1 className="text-3xl text-center mb-4 w-full font-semibold">
                  What is Zcash?
                </h1>
              </FadeInAnimation>
              <FadeInAnimation>
                <p className="text-center w-full mb-5">
                  It is an open-source, blockchain ledger that features a
                  sophisticated zero-knowledge proving system. It specializes in
                  offering a higher standard of privacy through its proving
                  system preserving confidentiality of transaction metadata. At
                  its core, Zcash is private data ownership that is
                  permissionlessly transferred when transactions are made.
                </p>
              </FadeInAnimation>
              <FadeInAnimation className="w-full">
                <div className="flex flex-col md:flex-row mt-4 w-full">
                  <Link
                    href={"/start-here/what-is-zec-and-zcash"}
                    className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-bold text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    What is Zcash?
                  </Link>
                  &nbsp;
                  <Link
                    href={"/zcash-tech/zk-snarks"}
                    className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-blue-400 border-blue-300 border-2 rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Zcash Technology
                  </Link>
                </div>
              </FadeInAnimation>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row space-y-4 h-96 my-4 w-full border-black border-2 rounded-md p-5"
            style={{ height: "30rem", borderColor: "revert" }}
          >
            <div className="flex justify-center items-center w-auto md:w-2/4">
              <FadeInAnimation>
                <Image
                  src={"/zcash_newsletter.gif"}
                  alt=""
                  width={500}
                  height={50}
                  unoptimized={true}
                />
              </FadeInAnimation>
            </div>
            <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
              <FadeInAnimation>
                <h1
                  style={{ fontSize: "1.85rem" }}
                  className="text-3xl mb-4 font-semibold"
                >
                  Shielded Newsletter
                </h1>
              </FadeInAnimation>
              <FadeInAnimation>
                <p className="text-center mb-5">
                  Subscribe using your Unified Address to get shielded access to
                  Zcash Ecosystem Updates & Network Stats direct to your wallet!
                </p>
              </FadeInAnimation>
              <div className="flex flex-row space-x-4 mt-4">
                <FadeInAnimation>
                  <Link
                    href={"/newsletter"}
                    className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Subscribe
                  </Link>
                </FadeInAnimation>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row space-y-4 h-screen my-4 w-auto border-2 border-black/50 rounded-md p-5"
            style={{ height: "30rem", borderColor: "revert" }}
          >
            <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
              <FadeInAnimation>
                <h1 className="text-3xl mb-4 font-semibold">ZECPages</h1>
              </FadeInAnimation>
              <FadeInAnimation>
                <p className="text-center mb-5">
                  ZECPages is an anonymous message board powered by Zcash. It
                  also serves as a public directory of Zcash users. Take it easy
                  is the ZECpages motto. A good reason to swing by is if you
                  want to chat and make new friends.
                </p>
              </FadeInAnimation>
              <FadeInAnimation>
                <div className="flex flex-row space-x-4 mt-4">
                  <Link
                    href={"https://zecpages.com"}
                    className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-semibold text-center border-blue-300 border-2 rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    ZECPages
                  </Link>
                </div>
              </FadeInAnimation>
            </div>
            <div className="flex justify-center items-center w-auto md:w-2/4 ">
              <FadeInAnimation>
                <Image
                  className="w-50 h-auto"
                  src={"/ZecPages_Banner.gif"}
                  alt=""
                  width={500}
                  height={50}
                  unoptimized={true}
                />
              </FadeInAnimation>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row space-y-4 h-96 my-4 w-full border-cyan-400/50 border-2 rounded-md p-5"
            style={{ height: "30rem" }}
          >
            <div className="flex justify-center items-center w-auto md:w-2/4">
              <FadeInAnimation>
                <Image
                  src={"/Free2z_Banner.gif"}
                  alt=""
                  width={500}
                  height={50}
                  unoptimized={true}
                />
              </FadeInAnimation>
            </div>
            <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
              <FadeInAnimation>
                <h1 className="text-3xl mb-4 font-semibold">Free2Z</h1>
              </FadeInAnimation>
              <FadeInAnimation>
                <p className="text-center mb-5">
                  Free2Z is a social platform powered by Zcash. With
                  peer-to-peer donations, a revenue sharing program, advanced
                  creative tools and a massive online global community.
                </p>
              </FadeInAnimation>
              <div className="flex flex-row space-x-4 mt-4">
                <FadeInAnimation>
                  <Link
                    href={"https://free2z.cash"}
                    className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Free2Z
                  </Link>
                </FadeInAnimation>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row space-y-4 h-screen my-4 w-auto border-2 border-black/50 rounded-md p-5"
            style={{ height: "30rem", borderColor: "revert" }}
          >
            <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
              <FadeInAnimation>
                <h1 className="text-3xl mb-4 font-semibold">Pay with Zcash</h1>
              </FadeInAnimation>
              <FadeInAnimation>
                <p className="text-center">
                  This website is an answer to the question:{" "}
                  <strong>where can I pay with Zcash?</strong>
                </p>
                <p className="text-center mb-5">
                  The directory is free to use. The items listed are for
                  informational purposes only, and not endorsements of any kind.
                  Enjoy!
                </p>
              </FadeInAnimation>
              <FadeInAnimation>
                <div className="flex flex-row space-x-4 mt-4">
                  <Link
                    href={"https://paywithz.cash/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-semibold text-center border-blue-300 border-2 rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    paywithz.cash
                  </Link>
                  <Link
                    href={"https://zechub.wiki/map"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-semibold text-center border-pink-500 border-2 rounded-lg bg-transparent hover:bg-pink-500 hover:shadow-[0px_0px_15px_rgba(255,105,180,0.5)] focus:ring-4 focus:outline-none focus:ring-pink-200"
                  >
                    <Image
                      src={"/spedn.png"}
                      alt="Spedn"
                      width={80} // adjust width as needed
                      height={30} // adjust height as needed
                    />
                  </Link>
                </div>
              </FadeInAnimation>
            </div>
            <div className="flex justify-center items-center w-9/12 md:w-2/4 self-center pt-8 md:pt-0">
              <FadeInAnimation>
                <Image
                  className="w-50 h-auto"
                  src={"/paywithzcash.png"}
                  alt="paywithz.cash"
                  width={400}
                  height={40}
                />
              </FadeInAnimation>
            </div>
          </div>

           <div
            className="flex flex-col md:flex-row space-y-4 h-96 my-4 w-full border-cyan-400/50 border-2 rounded-md p-5"
            style={{ height: "30rem" }}
          >
            <div className="flex justify-center items-center w-auto md:w-2/4">
              <FadeInAnimation>
                <Image
                  src={"/hackathon.png"}
                  alt=""
                  width={350}
                  height={350}
                  unoptimized={true}
                />
              </FadeInAnimation>
            </div>
            <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
              <FadeInAnimation>
                <h1 className="text-3xl mb-4 font-semibold">Hackathon</h1>
              </FadeInAnimation>
              <FadeInAnimation>
                <p className="text-center mb-5">
                  Challenge yourself to build with Zcash—one of the leading privacy-preserving blockchains.
                </p>
              </FadeInAnimation>
              <div className="flex flex-row space-x-4 mt-4">
                <FadeInAnimation>
                  <Link
                    href={"https://hackathon.zechub.wiki"}
                    className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Join the Hackathon
                  </Link>
                </FadeInAnimation>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContentSections;

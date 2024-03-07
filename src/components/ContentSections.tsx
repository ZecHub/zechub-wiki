import Link from "next/link"
import Image from "next/image"
import { FadeInAnimation } from "./ui/FadeInAnimation"

const ContentSections = () => {


    return (
        <section>
            <div className="flex  space-y-4 flex-col w-full mt-5">
                <div className="flex flex-col space-y-4 md:flex-row min-h-screen w-auto border-2 border-[#E4A100]/50 rounded-md p-5" >
                    <div className="flex flex-1 items-center justify-center w-auto md:w-2/4">
                        <FadeInAnimation>
                          <Image className="" src={'/Zcashcard.png'} alt="" width={500} height={50} />
                        </FadeInAnimation>
                    </div>

                    <div className="flex flex-col w-auto md:w-2/4 items-center justify-center font-bold">
                        <FadeInAnimation>
                            <h1 className="text-3xl text-center mb-4 w-full">What is Zcash?</h1>
                        </FadeInAnimation>
                        <FadeInAnimation>
                            <p className="text-center w-full mb-5">
                                It is an open-source, blockchain ledger that features a sophisticated zero-knowledge proving system. It specializes in offering a higher standard of privacy through its proving system preserving confidentiality of transaction metadata. At its core, Zcash is private data ownership that is permissionlessly transferred when transactions are made.
                            </p>
                        </FadeInAnimation>
                        <FadeInAnimation className="w-full">
                            <div className="flex flex-col md:flex-row space-y-4 space-x-4 mt-4 w-full">
                                <Link href={'/start-here/what-is-zec-and-zcash'} className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    What is Zcash?
                                </Link>
                                <Link href={'/zcash-tech/blockchain-explorers'} className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-blue-400 border-blue-300 border-2 rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Zcash Technology
                                </Link>
                            </div>
                        </FadeInAnimation>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row space-y-4 h-screen my-4 w-auto border-2 border-black/50 rounded-md p-5" style={{ height: "30rem" }}>

                    <div className="flex flex-col w-auto md:w-2/4  items-center justify-center font-bold">
                        <FadeInAnimation>
                            <h1 className="text-3xl mb-4">ZECPages</h1>
                        </FadeInAnimation>
                        <FadeInAnimation>
                            <p className="text-center mb-5">
                              ZECPages is an anonymous message board powered by Zcash. It also serves as a public directory of Zcash users. Take it easy is the ZECpages motto. A good reason to swing by is if you want to chat and make new friends.
                            </p>
                        </FadeInAnimation>
                        <FadeInAnimation>
                            <div className="flex flex-row space-x-4 mt-4">
                                <Link href={'https://zecpages.com'} className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center  border-blue-300 border-2 rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    ZECPages
                                </Link>
                            </div>
                        </FadeInAnimation>
                    </div>
                    <div className="flex justify-center items-center w-auto md:w-2/4 ">
                        <FadeInAnimation>
                            <Image className=" w-50 h-auto" src={'/ZecPages_Banner.gif'} alt="" width={500} height={50} />
                        </FadeInAnimation>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row space-y-4 h-96 my-4 w-full border-cyan-400/50 border-2 rounded-md p-5" style={{ height: "30rem" }}>
                    <div className="flex justify-center items-center w-auto md:w-2/4">
                        <FadeInAnimation>
                            <Image src={'/Free2z_Banner.gif'} alt="" width={500} height={50} />
                        </FadeInAnimation>
                     </div>
                    <div className="flex flex-col w-auto md:w-2/4 items-center justify-center font-bold">
                        <FadeInAnimation>
                            <h1 className="text-3xl mb-4">Free2Z</h1>
                        </FadeInAnimation>
                        <FadeInAnimation>
                            <p className="text-center font-bold mb-5">
                              Free2Z is a social platform powered by Zcash. With peer-to-peer donations, a revenue sharing program, advanced creative tools and a massive online global community.
                            </p>
                        </FadeInAnimation>
                            <div className="flex flex-row space-x-4 mt-4">
                                <FadeInAnimation>
                                    <Link href={'https://free2z.cash'} className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Free2Z
                                    </Link>
                                </FadeInAnimation>
                            </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ContentSections

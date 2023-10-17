import Link from "next/link"
import Image from "next/image"

const ContentSections = () => {


    return (
        <section>
            <div className="flex  space-y-4 flex-col w-full mt-5">
                <div className="flex flex-col space-y-4 md:flex-row  h-screen w-auto bg-yellow-400 rounded-md p-5">
                    <div className="flex items-center justify-center w-auto md:w-2/4">
                        <Image className="" src={'/card-image.webp'} alt="" width={500} height={100} />
                    </div>

                    <div className="flex flex-col w-auto md:w-2/4 items-center justify-center text-white font-bold">
                        <h1 className="text-3xl mb-4 w-full">What is Zcash?</h1>
                        <p className="text-center w-full mb-5">
                            It is an open-source, blockchain ledger that features a sophisticated zero-knowledge proving system. It specializes in offering a higher standard of privacy through its proving system preserving confidentiality of transaction metadata. At its core, Zcash is private data ownership that is permissionlessly transferred when transactions are made.
                        </p>
                        <div className="flex flex-col md:flex-row space-y-4 space-x-4 mt-4 w-full">
                            <Link href={'/site/zcashbasics/whatiszecandzcash'} className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                What is Zcash?
                            </Link>
                            <Link href={'/site/zcashtech/blockchainexplorer'} className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white border-blue-300 border-2 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Zcash Technology
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row space-y-4 h-screen my-4 w-auto bg-black rounded-md p-5">

                    <div className="flex flex-col w-auto md:w-2/4  items-center justify-center text-white font-bold">
                        <h1 className="text-3xl mb-4">Privacy is Normal</h1>
                        <p className="text-center mb-5">
                            Privacy is necessary for business. It protects you from discrimination and gives you the freedom to express yourself. Privacy gives you the power to choose what you feel comfortable sharing and is the basis of a free society. Zcash has led regulatory efforts to recognise the importance of privacy-preserving technologies hosting industry events and communicating with policy makers.
                        </p>
                        <div className="flex flex-row space-x-4 mt-4">
                            <Link href={''} className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white border-blue-300 border-2 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Learn More

                            </Link>
                        </div>
                    </div>
                    <div className="flex justify-center w-auto md:w-2/4 ">
                        <Image className="" src={'/card-image.webp'} alt="" width={500} height={100} />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row space-y-4 h-screen my-4 w-auto bg-cyan-400 rounded-md p-5">
                    <div className="flex justify-center w-auto md:w-2/4 ">
                        <Image className="" src={'/card-image.webp'} alt="" width={500} height={100} />
                    </div>
                    <div className="flex flex-col w-auto md:w-2/4 items-center justify-center text-white font-bold">
                        <h1 className="text-3xl mb-4">Zcash Shielded Assets</h1>
                        <p className="text-center font-bold mb-5">
                            Zcash is not just a store of value. Anything you can own can be represented, traded via a privacy preserving DEX and put to use as non-fungible tokens (NFTs). You can tokenise your art or take out a loan. The new protocol extension is a groundbreaking advancement, providing a higher standard of security than L2 chains can offer.
                        </p>
                        <div className="flex flex-row space-x-4 mt-4">
                            <Link href={'/site/zcashtech/zcash-shielded-assets'} className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Explore ZSA

                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ContentSections
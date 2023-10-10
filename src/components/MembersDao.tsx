import Link from 'next/link'
import Image from 'next/image';

interface DaoProps {
    imgUrl: string
    name: string
    description: string
    linkName: string
    urlLink: string
}

const MembersDao = ({ imgUrl, name, description, linkName, urlLink }: DaoProps) => {
    return (
        <>
            <div className="bg-gray-200 border border-gray-300 px-3 py-5 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col items-center justify-center ">
                    <Image className="w-24 h-24 my-3 rounded-full shadow-lg" src={imgUrl} alt={`${name} propfile image`} width={200} height={200} loading='lazy' />
                    <h5 className="mb-1 text-xl  font-bold text-gray-900 dark:text-white">{name}</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400 border border-gray-200 rounded-lg text-justify p-3">{description}</p>
                    <div className="flex mt-4 w-full justify-center text-center items-center md:mt-6">
                        <Link href={urlLink} className="inline-flex items-center w-1/2 justify-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 hover:scale-110 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{linkName}</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MembersDao
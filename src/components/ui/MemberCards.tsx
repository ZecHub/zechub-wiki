import Link from 'next/link'
import Image from 'next/image';

interface DaoProps {
    imgUrl: string
    name: string
    description: string
    linkName: string
    urlLink: string
}

const MemberCards = ({ imgUrl, name, description, linkName, urlLink }: DaoProps) => {
    return (
        <>
            <div className=" border m-2.5 p-5 rounded-lg shadow-lg dark:bg-gray-800">
                <div className="flex flex-col items-center justify-center ">
                    <Image className="w-50 h-50 my-3 rounded-full shadow-lg" src={imgUrl ? imgUrl : ''} alt={`${name} propfile image`} width={200} height={200} loading='lazy' />
                    <h5 className=" text-xl my-4 font-bold text-gray-900 dark:text-white">{name}</h5>
                    <p className="text-base text-gray-500 dark:text-gray-400  rounded-lg text-justify mb-2.5 p-3">{description}</p>
                    <div className="inherit mt-4 w-full justify-center text-center items-center md:mt-6">
                        <Link href={urlLink} target='_blank' className="inline-flex items-center w-1/2 justify-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 hover:scale-110 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{linkName}</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MemberCards
import Link from 'next/link'
import Image from 'next/image'
import { FadeInAnimation } from './FadeInAnimation'

interface props {
    title: string
    paraph: string
    url: string
    image: string
}

const Cards = ({ title, paraph, url, image }: props) => (
    <div className="max-w-sm md:w-1/5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:-translate-y-6">
        <FadeInAnimation>
            <Link href={url}>
                <Image className="rounded-t-lg " src={image} alt="" width={400} height={100} />
            </Link>
            <div className="p-5">
                <Link href={url}>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
                </Link>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{paraph}</p>
                <Link href={url} className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Read more
                    <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </Link>
            </div>
        </FadeInAnimation>
    </div>
)

export default Cards
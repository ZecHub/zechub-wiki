'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getName } from '@/lib/helpers'
import { Icon } from '../ui/Icon'
import { TiFolderOpen as Folder } from 'react-icons/ti'
import { BiRightArrowAlt as Arrow } from 'react-icons/bi'

interface Props {
    image: string
    name: string
    description: string
    url: string
}

const CardsExplorer = ({ image, name, description, url, ...props }: Props) => {
    const router = useRouter()

    return (
      
            <div  className='w-4/6 border border-gray-200 rounded-lg shadow dark:border-gray-700 hover:bg-gray-100 hover:cursor-pointer hover:scale-110'>
                <div onClick={() => router.push(url)}>
                <Image className="rounded-t-lg w- " src={image} alt='cardImage' width={1000} height={50} />
                <div className="p-5">
                    <div >
                        <h5 className="mb-2 text-2xl font-bold tracking-tight dark:text-white">{getName(name)}</h5>
                    </div>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p>

                </div>
                </div>
                
            </div>
     

    )
}

export default CardsExplorer


{/* <div className='flex justify-items-center items-center px-4 rounded-lg  shadow w-100'>
            <ul>
                {
                    root.map((item, i) => (
                        <li key={i} className={`my-3 hover:scale-110 hover:underline hover:cursor-pointer py-3`}>
                            <div onClick={() => router.push(`${fileUrl[i + 1]}#content`)}  >
                                <div className={`flex items-center space-x-4`}>
                                    <div className="flex-shrink-0">
                                        <Icon icon={Folder} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium ">
                                            {item ? getName(item) : ''}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold ">
                                        <Icon icon={Arrow} />
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div> */}
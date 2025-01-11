'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getName } from '@/lib/helpers'

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
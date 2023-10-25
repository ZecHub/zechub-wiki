'use client'
import { useRouter } from 'next/navigation'
import { Icon } from '../ui/Icon'
import { getName } from '@/lib/helpers'
import {TiFolderOpen as Folder} from 'react-icons/ti'
import { BiRightArrowAlt as Arrow } from 'react-icons/bi'

interface Props{
    root: string[]
    files: string[]
}

const ListExplorer = ({root, files}: Props) => {
    const router = useRouter()

    const fileUrl = files.map((item) => item.slice(0, -3))
    return (
        <div className='flex justify-items-center items-center px-4 rounded-lg  shadow w-100'>
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
        </div>
    )
}

export default ListExplorer
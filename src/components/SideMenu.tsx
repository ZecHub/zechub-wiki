import Link from 'next/link'
import { navigation } from "@/config"
import {BiRightArrow as Arrow} from 'react-icons/bi'


const SideMenu = () => {
  return (
    <div className="flex flex-col items-center justify-start w-auto">
        <h1 className="text-2xl font-bold mb-4">Learn Zcash</h1>
        {
            navigation.map((val) => (
                <div key={val.name} className='flex space-x-2 m-2'>
                    <Link href={val.path}>
                        {val.name.toUpperCase()}
                    </Link>
                    <Arrow className="mt-1"/>
                </div>
            ))

        }
    </div>
  )
}

export default SideMenu
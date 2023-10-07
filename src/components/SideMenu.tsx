import Link from 'next/link'
import { BiRightArrowAlt as Arrow } from 'react-icons/bi'
import { FiFile as FileIcon } from 'react-icons/fi'
import { Icon } from './ui/Icon'


interface MenuProps {
  roots: string[]
}

const SideMenu = ({ roots }: MenuProps) => {

  const links = roots.map((item) => item.slice(0, -3))

  return (
    <div className="flex flex-col sticky top-0 py-4 items-center justify-start w-full px-3">
      <h1 className="text-2xl font-bold mb-4">In this Folder: </h1>
      <div>
        <ul>
          {
            links.map((item, i) => (
              <li key={i} className='my-3 hover:scale-110 hover:underline hover:cursor-pointer py-3'>
                <Link href={`/${item}`}>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Icon icon={FileIcon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item ? item.substring(item.lastIndexOf("/") + 1) : ''}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold ">
                      <Icon icon={Arrow} />
                    </div>
                  </div>
                </Link>
              </li>
            ))
          }
        </ul>
      </div>

    </div>
  )
}

export default SideMenu
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { getFileContent, getRoot } from '@/lib/authAndFetch'
import { getDynamicRoute, getBanner, getName } from '@/lib/helpers'
import SideMenu from '@/components/SideMenu'
import { Icon } from '@/components/ui/Icon'
import { BiRightArrowAlt as Arrow } from 'react-icons/bi'

const MdxComponent = dynamic(
    () => import('@/components/MdxComponent'),
    {
        loading: () => <span className='text-center text-3xl'>Loading...</span>,
    }
)

export default async function Page({ params }: { params: { slug: string } }) {

    const { slug } = params
    const url = getDynamicRoute(slug)
    const markdown = await getFileContent(url)

    const content = markdown ? markdown : 'No Data or Wrong file'
    const urlRoot = `/site/${slug[0]}`
    const roots = await getRoot(urlRoot)

    const imgUrl = getBanner(slug[0])

    return (
      
        <main>
            <div className='flex justify-center w-full  mb-5 bg-transparent rounded py-4'>
                <Image
                    className="w-full mb-5 object-cover "
                    alt="wiki-banner"
                    width={800}
                    height={50}
                    src={imgUrl != undefined ? imgUrl : '/wiki-banner.avif'}
                />
            </div>

            <div className='flex justify-center md:justify-end'>
                <Link href="/explore" className='inline-flex rounded-full border-4  font-bold p-4 hover:bg-[#1984c7]' >
                    Explore more 
                    <Icon size={'medium'} icon={Arrow} />
                </Link>
                
            </div>

            <div id="content" className={`flex flex-col space-y-5 ${roots && roots.length > 0 ? 'md:flex-row md:space-x-5' : 'md:flex-col'} h-auto w-full p-5`}>
                {(roots && roots.length > 0) && (
                    <div className='w-auto md:w-2/5  relative'>
                        <SideMenu folder={slug[0]} roots={roots} />
                    </div>
                )}

                <section className='h-auto w-auto border-t-2 md:border-l-2 px-3'>
                    <div>
                        <MdxComponent source={content} />
                    </div>
                </section>
            </div>
        </main>
    )
}

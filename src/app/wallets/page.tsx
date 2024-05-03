import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { getFileContent, getRoot } from '@/lib/authAndFetch'
import { getDynamicRoute, getBanner, getName } from '@/lib/helpers'
import SideMenu from '@/components/SideMenu'
import { Icon } from '@/components/ui/Icon'
import { BiRightArrowAlt as Arrow } from 'react-icons/bi'

const MdxComponentWallet = dynamic(
    () => import('@/components/MdxComponentWallet'),
    {
        loading: () => <span className='text-center text-3xl'>Loading...</span>,
    }
)

export default async function Page({ params }: { params: { slug: string } }) {
    
    const { slug } = params
    const url = `/site/Using_Zcash/Wallets.md`

    const markdown = await getFileContent(url)

    const content = markdown ? markdown : 'No Data or Wrong file'
    const urlRoot = `/site/using-zcash`
    const roots = await getRoot(urlRoot)

    const imgUrl = getBanner(`using-zcash`)

    return (
      
        <main>
            <div className='flex justify-center w-full  mb-5 bg-transparent rounded pb-4'>
                <Image
                    className="w-full mb-5 object-cover "
                    alt="wiki-banner"
                    width={800}
                    height={50}
                    src={imgUrl != undefined ? imgUrl : '/wiki-banner.avif'}
                />
            </div>

            <div id="content" className={`flex flex-col space-y-5 ${roots && roots.length > 0 ? 'md:flex-row md:space-x-5' : 'md:flex-col'} h-auto w-full p-5`}>
                <section className='h-auto w-auto px-3'>
                    <div>                    
                        <MdxComponentWallet source={content} />
                    </div>
                </section>
            </div>
        </main>
    )
}

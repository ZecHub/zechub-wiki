
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { getFileContent, getRoot } from '@/helpers'
import SideMenu from '@/components/SideMenu'

const MdxComponent = dynamic(
    () => import('@/components/MdxComponent'),
    {
      loading: () => <p>Loading...</p>,
    }
  )

export default async function Page({ params }: { params: { slug: string } }) {
  
    const { slug } = params
    const url = `/site/${slug[0]}/${slug[1]}.md`

    const markdown = await getFileContent(url)
    const content = markdown ? markdown : 'No Data'

    const urlRoot = `/site/${slug[0]}`
    const roots = await getRoot(urlRoot)
    return (
        <main>
            <div className='flex justify-center w-full  mb-5 bg-transparent rounded py-4'>
                <Image
                    className="md:w-auto w-5/6 mb-5 object-cover "
                    alt="wiki-banner"
                    width={800}
                    height={50}
                    src={"/wiki-banner.avif"}
                />
            </div>

            <div className={`flex flex-col space-y-5 ${roots && roots.length > 0 ? 'md:flex-row md:space-x-5' : 'md:flex-col'} h-auto w-full p-5`}>
                {(roots && roots.length > 0) && (
                    <div className='w-auto md:w-1/4  relative'>
                        <SideMenu folder={slug[0]} roots={roots} />
                    </div>
                )

                }
                <section className='h-auto w-auto border-t-2 md:border-l-2 px-3'>
                    <MdxComponent source={content} />
                </section>

            </div>

        </main>
    )
}


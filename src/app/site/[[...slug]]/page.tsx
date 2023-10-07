
import Image from 'next/image'
import MdxComponent from '@/components/MdxComponent'
import { getFileContent, getRoot } from '@/helpers'
import SideMenu from '@/components/SideMenu'

export default async function Page({ params }: { params: { slug: string } }) {

    const { slug } = params
    const url = `/site/${slug[0]}/${slug[1]}.md`

    const markdown = await getFileContent(url)
    const content = markdown ? markdown : 'No Data'

    const urlRoot = `/site/${slug[0]}`
    const roots = await getRoot(urlRoot)
    return (
        <main>
            <div className='flex justify-center w-full  mb-5 bg-[#1984c7] rounded py-4'>
                <Image
                    className="md:w-auto w-5/6 mb-5 object-cover "
                    alt="hero"
                    width={800}
                    height={50}
                    src={"/hero.png"}
                />
            </div>

            <div className={`flex flex-col space-y-5 ${roots && roots.length > 0 ? 'md:flex-row md:space-x-5' : 'md:flex-col'} h-auto p-5`}>
                {(roots && roots.length > 0) && (
                    <div className='w-auto md:w-1/2  relative'>
                        <SideMenu folder={slug[0]} roots={roots} />
                    </div>
                )

                }
                <div className='h-auto w-auto border-t-2 md:border-l-2 px-3'>
                    <MdxComponent source={content} />
                </div>

            </div>

        </main>
    )
}


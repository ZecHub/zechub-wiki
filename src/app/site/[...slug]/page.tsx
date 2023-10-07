
import Image from 'next/image'
import MdxComponent from '@/components/MdxComponent'
import { getFileContent } from '@/helpers'

interface Props{
    params: { url: string }
}

export default async function Page({ params }: { params: { slug: string } }) {

    const {slug } = params
    const url = `/site/${slug[0]}/${slug[1]}.md`
    console.log(url)

    const markdown = await getFileContent(url);
    const content = markdown ? markdown : 'No Data' 

    return (
        <main>
                <div className='flex justify-center w-full  mb-3 bg-[#1984c7] rounded py-4'>
                    <Image
                        className="md:w-auto w-5/6 mb-5 object-cover "
                        alt="hero"
                        width={800}
                        height={50}
                        src={"/hero.png"}
                    />
                </div>

                <div className='h-auto'>
                    <MdxComponent source={content} />
                </div>
   
        </main>
    )
}


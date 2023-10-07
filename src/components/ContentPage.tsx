import Image from 'next/image'
import MdxComponent from './MdxComponent'

interface content {
    content: string
}

const ContentPage = ({ content }: content) => {

    return (
        <>
        <Image
            className="md:w-auto w-5/6 mb-5 object-cover rounded-full"
            alt="hero"
            width={800}
            height={50}
            src={"/hero.png"}
          />
            
        </>
    )
}

export default ContentPage
import Image from "next/image"

const Logo = () =>  (
    <Image
        src={"/zechubLogo.jpg"}
        alt={"Logo"}
        width={60}
        height={60}
        className="rounded-full md:h-50"
    />      
)


export default Logo
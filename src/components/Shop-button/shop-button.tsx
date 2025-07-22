import Link from "next/link"
import { FadeInAnimation } from "../ui/Fade"

type ShopButtonProps = {
    shopUrl: string;
    hasBorder: boolean;
}

export const ShopButton = (props: ShopButtonProps) => {
    return (
        <div className="flex justify-center mx-auto">
            <Link
                type="button"
                href={props.shopUrl}
                referrerPolicy="origin"
                target="_blank"
                className={`md:hover:scale-110 ${props.hasBorder && 'border-[#fff]'}  transition duration-400  border-2 font-bold rounded-full py-2 px-4 color-[#fff]`}
            >
                Shop
            </Link>
        </div>
    )
}

'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeftLong as arrowLeft, FaArrowRight as arrowRight } from "react-icons/fa6";
import { Icon } from "../ui/Icon";
import { LuHome as home } from "react-icons/lu";
import { educationalData } from "@/constants/educational";


export const Educational = () => {
    const router = useRouter();
    const [actual, setActual] = useState(0);

    const { id, title, data } = educationalData[actual];

    const changePageBack = () => {
        if (actual >= 0) setActual(actual - 1);
    }

    const changePageForw = () => {
        if (actual < educationalData.length) setActual(actual + 1);
    }

    return (
        <>
            <div className="flex w-[100%] p-10 text-center text-2xl font-bold">
                <h1 className="">{id}. {title}</h1>
            </div>
            <div className="flex w-[100%] ">
                <div className="flex flex-row w-[100%] h-auto py-10">
                    <div className="flex justify-center w-[50%]">
                        <Image src={data[0].img} alt="img" width={300} height={300} />
                    </div>

                    <div className="flex justify-center items-center w-[50%]">
                        <h1>
                            {data[0].content}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex w-[100%] justify-center p-10">
                <div className="flex flex-row w-[30%] space-x-10 justify-center justify-items-center py-5 ">
                    {actual !== 0 && (<Icon icon={arrowLeft} className="md:w-10 w-6 h-6 md:h-10 hover:cursor-pointer hover:scale-125" onClick={changePageBack} />)}
                    <Icon icon={home} className="md:w-10 w-6 h-6 md:h-10 hover:cursor-pointer hover:scale-125" onClick={() => router.push('/')} />
                    {actual < educationalData.length - 1 && (<Icon icon={arrowRight} className="md:w-10 w-6 h-6 md:h-10 hover:cursor-pointer hover:scale-125" onClick={changePageForw} />)}
                </div>
            </div>
        </>

    )
}



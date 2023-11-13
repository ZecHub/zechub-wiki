'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {

  const router = useRouter()
  return (
    <div className="w-full  mb-3">
      <div className=" w-full mx-auto items-center md:flex-row justify-center rounded-lg ">
      
        <Image
            className="w-full  mb-5 object-cover"
            alt="hero"
            width={800}
            height={50}
            src={"/BannerPrancheta.png"}
          />
      </div>
    </div>
  );
};

export default Hero;

{/* <div className="text-center lg:w-5/12 w-full mb-5">
<h1 className="my-3 text-lg text-white md:text-5xl font-bold leading-tight dark:text-gray-100">
  Learn all about Zcash network
</h1>
<div className="flex justify-center mx-auto">
  <button onClick={() => router.push('/site/zcashcommunity/zcashcommunity')} className="hover:bg-slate-300 transition duration-400 bg-white border-2 text-gray-800 font-bold rounded-full  py-4 px-8">
    Start Here
  </button>
</div>


</div> 
flex flex-col px-3 py-16  bg-[#1984c7]


*/}

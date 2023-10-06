import Image from "next/image";

const Hero = () => {
  return (
    <div className="w-full  mb-3">
      <div className=" w-full mx-auto flex flex-col px-3 py-16 items-center md:flex-row justify-center rounded-lg bg-[#1984c7]">
        <div className="text-center lg:w-5/12 w-full mb-5">
          <h1 className="my-3 text-lg text-white md:text-5xl font-bold leading-tight dark:text-gray-100">
            Learn all about Zcash network
          </h1>
          <div className="flex justify-center mx-auto">
            <button className="hover:bg-slate-300 transition duration-400 bg-white border-2 text-gray-800 font-bold rounded-full  py-4 px-8">
              Start Here
            </button>
          </div>

          
        </div>
        <Image
            className="md:w-auto w-5/6 mb-5 object-cover rounded-full"
            alt="hero"
            width={800}
            height={50}
            src={"/hero.png"}
          />
      </div>
    </div>
  );
};

export default Hero;

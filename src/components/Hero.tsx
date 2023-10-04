import Image from "next/image";

const Hero = () => {
  return (
    <div className="w-full  mb-3">
      <div className="container w-full mx-auto flex px-3 py-16 items-center justify-center flex-row dark:bg-slate-500">
        <div className="text-center lg:w-5/12 w-full">
          <h1 className="my-3 text-5xl font-bold leading-tight dark:text-gray-100">
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

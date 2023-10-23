
import Link from 'next/link';
import Hero from '@/components/Hero'
import Cards from '@/components/ui/Cards'
import ContentSections from '@/components/ContentSections';
import { cardsConfig } from "@/configs/cardsConfig";
import MemberCards from '@/components/ui/MemberCards';
import { daoMembers } from '@/configs/membersDao';

export default async function Home() {

  const text = `ZecHub is the community driven education hub for the Zcash cryptocurrency (ZEC). Zcash is a digital currency providing censorship resistant, secure & private payments. The Zcash Blockchain utilises highly advanced 'verifiable' zk-snarks that do not require Trusted Setup following the NU5 network upgrade in 2022.`
  return (
    <main className="flex flex-col mx-auto ">
      <section id='hero'>
        <Hero />
      </section>

      <div className="flex flex-col">
        <section id='presentation'>
          <div className="w-full flex  items-center justify-center py-5">

            <div className="flex flex-col items-center justify-center p-3 mt-6 shadow">
              <h1 className="text-4xl font-bold mb-3">Welcome to ZecHub</h1>
              <div className="flex items-center justify-center p-4 ">
                <p className="text-lg font-bold text-center">
                  {text}
                </p>
              </div>
              <div className="flex justify-center mx-auto">
                <Link type='button' href={'/site/usingzcash/usingzec'} className=" md:hover:scale-110 border-[#1984c7] transition duration-400  border-4 font-bold rounded-full  py-4 px-8">
                  Explore Zcash
                </Link>
              </div>
            </div>

          </div>
        </section>


        <section id='cardLinks'>
          <div className="p-5 flex flex-col space-y-7 md:flex-row md:space-x-11 items-center justify-center mb-4">
            {
              cardsConfig && (cardsConfig.map((items) => (
                <Cards key={items.title} paraph={items.content} title={items.title} url={items.url} image={items.image} />
              ))
              )}
          </div>
        </section>

        <section id='content'>
          <ContentSections />
        </section>

        <section id='members' className=' mt-4'>
          <h1 className='text-3xl font-bold text-center my-5 '>DAO Members</h1>
          <div className='w-full grid grid-cols-1 space-x-2 md:grid-cols-3 md:gap-4 justify-items-center  mt-4 p-2'>

            {
              daoMembers && ( daoMembers.map((e) => (
                <div key={e.name} className="flex justify-center space-y-4 w-full space-x-3 md:space-y-2 ">
                  <MemberCards imgUrl={e.imgUrl} description={e.description} name={e.name} linkName={e.linkName} urlLink={e.urlLink} />
                </div>
              )))
            }
          </div>
        </section>
      </div>
    </main>
  );
}

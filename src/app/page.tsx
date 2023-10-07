
import Hero from '@/components/Hero'
import Cards from '@/components/ui/Cards'
import { cardsConfig } from "@/config";

export default async function Home() {

const text = `ZecHub is the community driven education hub for the Zcash cryptocurrency (ZEC). Zcash is a digital currency providing censorship resistant, secure & private payments. The Zcash Blockchain utilises highly advanced 'verifiable' zk-snarks that do not require Trusted Setup following the NU5 network upgrade in 2022.`
  return (
    <main className="flex flex-col mx-auto ">
      <Hero />
      <div className="flex flex-col">
        <div className="w-full flex  items-center justify-center">

          <div className="flex flex-col items-center justify-center p-3 mt-6 shadow">
            <h1 className="text-4xl font-bold mb-3">Welcome to ZecHub</h1>
            <div className="flex items-center justify-center p-4 ">
              <p className="text-lg font-bold text-center">
                {text}
              </p>
            </div>
          </div>

        </div>
        <div className="p-5 flex flex-col space-y-7 md:flex-row md:space-x-11 items-center justify-center">
          {
            cardsConfig.map((items) => (
              <Cards key={items.title} paraph={items.content} title={items.title} url={items.url} />
            ))
          }
        </div>
      </div>
    </main>
  );
}

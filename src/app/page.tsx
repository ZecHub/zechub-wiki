
import MdxComponent from "@/components/MdxComponent";
import Hero from '@/components/Hero'
import { getFileContent } from '@/helpers'
import Cards from '@/components/ui/Cards'
import { cardsConfig } from "@/config";

export default async function Home() {
  const markdown = await getFileContent('site/usingzcash/usingzec.md');
  const content = markdown ?  markdown : '# No Data'
 
  return (
    <main className="flex flex-col mx-auto ">
        <Hero />
        <div className="flex flex-col">
          <div className="w-full flex  items-center justify-center">

            <div className="flex flex-col items-center justify-center p-3 mt-6">
              <h1 className="text-4xl font-bold mb-3">Using Zcash</h1>
              <div className="flex items-center justify-center p-4 shadow">
                <MdxComponent  source={content} />
              </div>
            </div>

          </div>
          <div className="p-5 flex flex-col md:flex-row md:space-x-11 items-center justify-center">
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

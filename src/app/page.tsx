import Layout from "@/components/Layout";
import MdxComponent from "@/components/MdxComponent";
import Hero from '@/components/Hero'
import { getFileContent, getRoot } from '@/helpers'
import Cards from '@/components/ui/Cards'
import { cardsConfig } from "@/config";
import { title } from "process";


const paragraph = 'This is a test for Zechub wiki page, So take this'

export default async function Home() {
  const markdown = await getFileContent('site/usingzcash/usingzec.md');

  // min-h-screen flex-col items-center justify-between p-24
  return (
    <main className="flex flex-col mx-auto ">
      <Layout>
        <Hero />
        <div className="flex flex-col">
          <div className="w-full flex  items-center justify-center">

            <div className="flex flex-col items-center justify-center p-3 mt-6">
              <h1 className="text-4xl font-bold mb-3">Using Zcash</h1>
              <MdxComponent className="flex items-center justify-center" source={markdown} />
            </div>

          </div>
          <div className="p-5 flex flex-col md:flex-row md:space-x-11 items-center justify-center">
            {
              cardsConfig.map((items) => (
                <Cards paraph={items.content} title={items.title} url={items.url} />
              ))
            }
          </div>
        </div>
      </Layout>
    </main>
  );
}

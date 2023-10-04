import Navigation from '@/components/Navigation';
import MdxComponent from "@/components/MdxComponent";
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import {getFileContent, getRoot} from '@/helpers'
import SideMenu from '@/components/SideMenu';


export default async function Home() { 
 const markdown = await getFileContent('site/usingzcash/wallets.md');
 
 // min-h-screen flex-col items-center justify-between p-24
  return (
    <main className="flex flex-col mx-auto ">
      <div>
        <Navigation/>
      </div>
      <div>
        <Hero />
      </div>
      <div className="flex flex-row ">
        <div className="w-full p-20">
          <SideMenu/>
        </div>
        <div className="w-full">
          <MdxComponent source={markdown} />
        </div>
      </div>
      <div className="w-full">
          <Footer />
      </div>
    </main>
  );
}
